import { DroppedBlock } from '../../Store/Slice/workspaceSlice';

export interface ImportResult {
  success: boolean;
  data?: DroppedBlock[];
  error?: string;
  warnings?: string[];
  fileName?: string;
}

export interface ImportOptions {
  validateSchema?: boolean;
  regenerateIds?: boolean;
  allowPartial?: boolean;
}

export interface ExportSchema {
  version: string;
  schema: string;
  generated: string;
  template: {
    name: string;
    description: string;
    created: string;
  };
  blocks: any[];
  metadata: {
    totalBlocks: number;
    totalColumns: number;
    totalWidgets: number;
    widgetTypes: Record<string, number>;
    generated: string;
  };
  validation?: {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  };
}

/**
 * Import template from JSON text (copy-paste)
 */
export function importFromText(jsonText: string, options: ImportOptions = {}): ImportResult {
  try {
    const parsedData = JSON.parse(jsonText);

    // Validate the JSON structure
    const validation = validateImportSchema(parsedData, options);

    if (!validation.isValid && !options.allowPartial) {
      return {
        success: false,
        error: `Invalid template format: ${validation.errors.join(', ')}`,
        warnings: validation.warnings
      };
    }

    // Convert to DroppedBlock format
    const blocks = convertToDroppedBlocks(parsedData.blocks, options);

    return {
      success: true,
      data: blocks,
      warnings: validation.warnings
    };

  } catch (error: any) {
    return {
      success: false,
      error: `Failed to parse JSON: ${error.message}`
    };
  }
}

/**
 * Import JSON template file
 */
export function importTemplate(file: File, options: ImportOptions = {}): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);

        // Validate the JSON structure
        const validation = validateImportSchema(parsedData, options);

        if (!validation.isValid && !options.allowPartial) {
          resolve({
            success: false,
            error: `Invalid template format: ${validation.errors.join(', ')}`,
            warnings: validation.warnings,
            fileName: file.name
          });
          return;
        }

        // Convert to DroppedBlock format
        const blocks = convertToDroppedBlocks(parsedData.blocks, options);

        resolve({
          success: true,
          data: blocks,
          warnings: validation.warnings,
          fileName: file.name
        });

      } catch (error: any) {
        resolve({
          success: false,
          error: `Failed to parse JSON: ${error.message}`,
          fileName: file.name
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read the file',
        fileName: file.name
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Validate import schema
 */
function validateImportSchema(data: any, options: ImportOptions): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid JSON structure');
    return { isValid: false, errors, warnings };
  }

  // Check for required fields (for your export schema)
  if (data.schema !== 'woocommerce-email-v1') {
    warnings.push('Schema version may not be compatible');
  }

  // Check if blocks exist
  if (!Array.isArray(data.blocks)) {
    errors.push('Missing or invalid blocks array');
  }

  // Validate each block
  if (Array.isArray(data.blocks)) {
    data.blocks.forEach((block: any, index: number) => {
      if (!block.columns || !Array.isArray(block.columns)) {
        warnings.push(`Block ${index + 1} missing columns array (defaulting to empty)`);
      }

      if (block.columns) {
        block.columns.forEach((column: any, colIndex: number) => {
          if (!column.widgetContents || !Array.isArray(column.widgetContents)) {
            warnings.push(`Column ${colIndex + 1} in block ${index + 1} has no widget contents`);
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Convert imported blocks to DroppedBlock format
 */
export function convertToDroppedBlocks(importedBlocks: any[], options: ImportOptions): DroppedBlock[] {
  return importedBlocks.map(block => ({
    id: options.regenerateIds ? generateId('block') : block.id || generateId('block'),
    style: convertStyleToBlockStyle(block.style),
    columns: (block.columns || []).map((column: any) => ({
      id: options.regenerateIds ? generateId('col') : column.id || generateId('col'),
      style: convertStyleToColumnStyle(column.style),
      contentType: null,
      contentData: null,
      widgetContents: (column.widgetContents || []).map((widget: any) => ({
        contentType: widget.contentType || widget.type || 'unknown',
        contentData: widget.contentData !== undefined
          ? (typeof widget.contentData === 'string' ? widget.contentData : JSON.stringify(widget.contentData))
          : (typeof widget.data === 'string' ? widget.data : JSON.stringify(widget.data))
      })),
      // Initialize all editor options with defaults
      textEditorOptions: { content: '' } as any,
      headingEditorOptions: {} as any,
      socialIconsEditorOptions: {} as any,
      dividerEditorOptions: {} as any,
      imageEditorOptions: {} as any,
      buttonEditorOptions: {} as any,
      sectionEditorOptions: {} as any,
      spacerEditorOptions: {} as any,
      linkEditorOptions: {} as any,
      iconEditorOptions: {} as any,
      shippingAddressEditorOptions: {} as any,
      billingAddressEditorOptions: {} as any,
      orderItemsEditorOptions: {} as any,
      taxBillingEditorOptions: {} as any
    }))
  }));
}

/**
 * Convert imported style to BlockStyle
 */
function convertStyleToBlockStyle(style: any): any {
  if (!style) {
    return {
      bgColor: 'transparent',
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderStyle: 'solid' as const,
      borderTopSize: 0,
      borderBottomSize: 0,
      borderLeftSize: 0,
      borderRightSize: 0,
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      height: 'auto'
    };
  }

  return {
    bgColor: style.backgroundColor || 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderStyle: (style.borderStyle || 'solid') as 'solid' | 'dashed' | 'dotted',
    borderTopSize: parseBorderSize(style.borderTop),
    borderBottomSize: parseBorderSize(style.borderBottom),
    borderLeftSize: parseBorderSize(style.borderLeft),
    borderRightSize: parseBorderSize(style.borderRight),
    padding: {
      top: style.paddingTop || style.padding?.top || 0,
      right: style.paddingRight || style.padding?.right || 0,
      bottom: style.paddingBottom || style.padding?.bottom || 0,
      left: style.paddingLeft || style.padding?.left || 0
    },
    height: style.height || 'auto'
  };
}

/**
 * Convert imported style to ColumnStyle
 */
function convertStyleToColumnStyle(style: any): any {
  if (!style) {
    return {
      bgColor: '#ffffffff',
      borderTopColor: '#a0c4ff',
      borderBottomColor: '#a0c4ff',
      borderLeftColor: '#a0c4ff',
      borderRightColor: '#a0c4ff',
      borderStyle: 'solid' as const,
      borderTopSize: 0,
      borderBottomSize: 0,
      borderLeftSize: 0,
      borderRightSize: 0,
      padding: { top: 10, right: 10, bottom: 10, left: 10 },
      height: 'auto'
    };
  }

  return {
    bgColor: style.backgroundColor || '#ffffffff',
    borderTopColor: '#a0c4ff',
    borderBottomColor: '#a0c4ff',
    borderLeftColor: '#a0c4ff',
    borderRightColor: '#a0c4ff',
    borderStyle: (style.borderStyle || 'solid') as 'solid' | 'dashed' | 'dotted',
    borderTopSize: parseBorderSize(style.borderTop),
    borderBottomSize: parseBorderSize(style.borderBottom),
    borderLeftSize: parseBorderSize(style.borderLeft),
    borderRightSize: parseBorderSize(style.borderRight),
    padding: {
      top: style.paddingTop || style.padding?.top || 10,
      right: style.paddingRight || style.padding?.right || 10,
      bottom: style.paddingBottom || style.padding?.bottom || 10,
      left: style.paddingLeft || style.padding?.left || 10
    },
    height: style.height || 'auto'
  };
}

/**
 * Parse border size from CSS string (e.g., "2px solid #000")
 */
function parseBorderSize(borderStr: string): number {
  if (!borderStr) return 0;
  const match = borderStr.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Generate unique ID
 */
function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}