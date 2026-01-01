import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setSelectedBlockId, defaultCodeEditorOptions } from '../../../Store/Slice/workspaceSlice';

interface CodeFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  widgetData?: any; // Accepting widgetData prop
}

const CodeFieldComponent: React.FC<CodeFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  widgetData
}) => {
  const dispatch = useDispatch();

  // Parse options from widgetData or fallback to defaults
  let options = defaultCodeEditorOptions;

  if (widgetData && widgetData.contentData) {
    try {
      options = JSON.parse(widgetData.contentData);
    } catch (e) {
      console.error("Error parsing code widget data", e);
    }
  }

  const fontSize = options.fontSize ? parseInt(String(options.fontSize), 10) : 14;

  return (
    <Box
      onClick={(e) => {
        // Allow bubbling
      }}
      sx={{
        width: '100%',
        border: isSelected ? '2px dashed blue' : '1px solid #333',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          backgroundColor: options.backgroundColor || '#1e1e1e',
          color: options.textColor || '#d4d4d4',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: `${fontSize}px`,
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          minHeight: '100px',
        }}
      >
        <Box
          sx={{
            color: '#888',
            fontSize: '12px',
            marginBottom: '8px',
            borderBottom: '1px solid #333',
            paddingBottom: '4px',
          }}
        >
          {options.language?.toUpperCase() || 'JAVASCRIPT'}
        </Box>
        <Typography component="pre" sx={{ margin: 0, fontSize: 'inherit', fontFamily: 'inherit' }}>
          {options.content || 'console.log("Hello World");'}
        </Typography>
      </Box>
    </Box>
  );
};

export default CodeFieldComponent;