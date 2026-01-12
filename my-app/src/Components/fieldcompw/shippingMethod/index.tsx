import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';

interface Props {
    blockId: string;
    columnIndex: number;
    isSelected: boolean;
    onClick: () => void;
    onWidgetClick: (e: React.MouseEvent) => void;
    widgetIndex: number;
}

const ShippingMethodFieldComponent: React.FC<Props> = ({
    blockId,
    isSelected,
    onClick,
    onWidgetClick,
}) => {
    const { shippingMethodEditorOptions } = useSelector((state: RootState) => state.workspace);
    const dispatch = useDispatch();

    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
                onWidgetClick(e);
                onClick();
                dispatch(setSelectedBlockId(blockId));
            }}
            sx={{
                outline: 'none',
                boxShadow: isSelected ? '0 0 0 2px #2196f3' : 'none',
                border: `${shippingMethodEditorOptions.borderWidth || 0}px solid ${shippingMethodEditorOptions.borderColor || '#eeeeee'}`,
                padding: (shippingMethodEditorOptions.borderWidth || 0) > 0 ? '0' : (shippingMethodEditorOptions.padding || '10px'),
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: (shippingMethodEditorOptions.borderWidth || 0) > 0 ? 'stretch' : 'center',
                textAlign: shippingMethodEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: shippingMethodEditorOptions.backgroundColor && shippingMethodEditorOptions.backgroundColor !== 'transparent' ? shippingMethodEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: shippingMethodEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: shippingMethodEditorOptions.fontSize || '14px',
                fontWeight: shippingMethodEditorOptions.fontWeight,
                lineHeight: shippingMethodEditorOptions.lineHeight ? `${shippingMethodEditorOptions.lineHeight}px` : undefined,
                color: shippingMethodEditorOptions.textColor || '#333333',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    textAlign: shippingMethodEditorOptions.labelAlign as any || 'left',
                    justifyContent: (shippingMethodEditorOptions.labelAlign === 'center') ? 'center' : (shippingMethodEditorOptions.labelAlign === 'right' ? 'flex-end' : 'flex-start'),
                    width: `${100 - (shippingMethodEditorOptions.lastColumnWidth || 30)}%`,
                    borderRight: shippingMethodEditorOptions.borderWidth ? `${shippingMethodEditorOptions.borderWidth}px solid ${shippingMethodEditorOptions.borderColor || '#eeeeee'}` : 'none',
                    padding: shippingMethodEditorOptions.borderWidth ? (shippingMethodEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: shippingMethodEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {shippingMethodEditorOptions.label}
                </Box>
                <Box sx={{
                    textAlign: shippingMethodEditorOptions.valueAlign as any || 'right',
                    justifyContent: (shippingMethodEditorOptions.valueAlign === 'center') ? 'center' : (shippingMethodEditorOptions.valueAlign === 'left' ? 'flex-start' : 'flex-end'),
                    width: `${shippingMethodEditorOptions.lastColumnWidth || 30}%`,
                    padding: shippingMethodEditorOptions.borderWidth ? (shippingMethodEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: shippingMethodEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {shippingMethodEditorOptions.value === '{{shipping_method}}' ? 'Flat rate' : shippingMethodEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default ShippingMethodFieldComponent;
