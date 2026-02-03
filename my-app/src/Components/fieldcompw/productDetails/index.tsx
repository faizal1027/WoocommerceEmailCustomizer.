import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';
import { defaultProductDetailsEditorOptions } from '../../../Store/Slice/workspaceSlice';

interface ProductDetailsFieldComponentProps {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
    previewMode?: boolean;
    widgetData?: any;
}

const ProductDetailsFieldComponent: React.FC<ProductDetailsFieldComponentProps> = ({
    blockId,
    columnIndex,
    isSelected,
    onClick,
    onWidgetClick,
    widgetIndex,
    previewMode = true,
    widgetData
}) => {
    const dispatch = useDispatch();
    const block = useSelector((state: RootState) => state.workspace.blocks.find(b => b.id === blockId));
    const column = block?.columns[columnIndex];

    const options = React.useMemo(() => {
        if (widgetData && widgetData.contentData) {
            try {
                return { ...defaultProductDetailsEditorOptions, ...JSON.parse(widgetData.contentData) };
            } catch (e) {
                // Fail silently
            }
        }
        const contentData = column?.widgetContents?.[widgetIndex]?.contentData;
        if (contentData) {
            try {
                return { ...defaultProductDetailsEditorOptions, ...JSON.parse(contentData) };
            } catch (e) {
                // Fail silently
            }
        }
        return defaultProductDetailsEditorOptions;
    }, [column, widgetIndex, widgetData]);

    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
                onWidgetClick(e);
                onClick();
                dispatch(setSelectedBlockId(blockId));
            }}
            sx={{
                width: '100%',
                padding: options.padding,
                backgroundColor: options.backgroundColor,
                fontFamily: options.fontFamily || 'inherit',
                fontSize: options.fontSize || '14px',
                textAlign: options.textAlign as any || 'left',
                border: '1px solid transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                color: options.textColor,
            }}
        >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'inherit', fontFamily: 'inherit' }}>
                <thead>
                    <tr style={{ backgroundColor: options.headerBackgroundColor, color: options.headerTextColor }}>

                        <th style={{ padding: '8px', borderBottom: `1px solid ${options.borderColor}`, textAlign: 'left' }}>Product</th>
                        <th style={{ padding: '8px', borderBottom: `1px solid ${options.borderColor}`, textAlign: 'left' }}>Quantity</th>
                        <th style={{ padding: '8px', borderBottom: `1px solid ${options.borderColor}`, textAlign: 'right' }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>

                        <td style={{ padding: '12px', border: `1px solid ${options.borderColor}` }}>
                            Sample Product
                        </td>
                        <td style={{ padding: '12px', border: `1px solid ${options.borderColor}`, textAlign: 'center' }}>1</td>
                        <td style={{ padding: '12px', border: `1px solid ${options.borderColor}`, textAlign: 'right' }}>$50.00</td>
                    </tr>
                    <tr>

                        <td style={{ padding: '12px', border: `1px solid ${options.borderColor}` }}>
                            Another Product
                        </td>
                        <td style={{ padding: '12px', border: `1px solid ${options.borderColor}`, textAlign: 'center' }}>2</td>
                        <td style={{ padding: '12px', border: `1px solid ${options.borderColor}`, textAlign: 'right' }}>$25.00</td>
                    </tr>
                </tbody>
            </table>
        </Box >
    );
};

export default ProductDetailsFieldComponent;
