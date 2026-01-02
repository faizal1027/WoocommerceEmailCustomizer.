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
                border: isSelected ? '2px dashed blue' : '1px transparent',
                padding: shippingMethodEditorOptions.padding || '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: shippingMethodEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: shippingMethodEditorOptions.backgroundColor && shippingMethodEditorOptions.backgroundColor !== 'transparent' ? shippingMethodEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: shippingMethodEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: shippingMethodEditorOptions.fontSize || '14px',
                color: shippingMethodEditorOptions.textColor || '#333333',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    fontWeight: 'bold',
                    textAlign: shippingMethodEditorOptions.labelAlign as any || 'left',
                    flex: 1,
                    width: '50%'
                }}>
                    {shippingMethodEditorOptions.label}
                </Box>
                <Box sx={{
                    textAlign: shippingMethodEditorOptions.valueAlign as any || 'right',
                    flex: 1,
                    width: '50%'
                }}>
                    {shippingMethodEditorOptions.value === '{{shipping_method}}' ? 'Flat rate' : shippingMethodEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default ShippingMethodFieldComponent;
