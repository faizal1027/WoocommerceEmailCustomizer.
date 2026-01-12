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

const OrderTotalFieldComponent: React.FC<Props> = ({
    blockId,
    isSelected,
    onClick,
    onWidgetClick,
}) => {
    const { orderTotalEditorOptions } = useSelector((state: RootState) => state.workspace);
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
                border: `${orderTotalEditorOptions.borderWidth || 0}px solid ${orderTotalEditorOptions.borderColor || '#eeeeee'}`,
                padding: (orderTotalEditorOptions.borderWidth || 0) > 0 ? '0' : (orderTotalEditorOptions.padding || '10px'),
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: (orderTotalEditorOptions.borderWidth || 0) > 0 ? 'stretch' : 'center',
                textAlign: orderTotalEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: orderTotalEditorOptions.backgroundColor && orderTotalEditorOptions.backgroundColor !== 'transparent' ? orderTotalEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: orderTotalEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: orderTotalEditorOptions.fontSize || '18px',
                fontWeight: orderTotalEditorOptions.fontWeight,
                lineHeight: orderTotalEditorOptions.lineHeight ? `${orderTotalEditorOptions.lineHeight}px` : undefined,
                color: orderTotalEditorOptions.textColor || '#000000',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    textAlign: orderTotalEditorOptions.labelAlign as any || 'left',
                    justifyContent: (orderTotalEditorOptions.labelAlign === 'center') ? 'center' : (orderTotalEditorOptions.labelAlign === 'right' ? 'flex-end' : 'flex-start'),
                    width: `${100 - (orderTotalEditorOptions.lastColumnWidth || 30)}%`,
                    borderRight: orderTotalEditorOptions.borderWidth ? `${orderTotalEditorOptions.borderWidth}px solid ${orderTotalEditorOptions.borderColor || '#eeeeee'}` : 'none',
                    padding: orderTotalEditorOptions.borderWidth ? (orderTotalEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: orderTotalEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {orderTotalEditorOptions.label}
                </Box>
                <Box sx={{
                    textAlign: orderTotalEditorOptions.valueAlign as any || 'right',
                    justifyContent: (orderTotalEditorOptions.valueAlign === 'center') ? 'center' : (orderTotalEditorOptions.valueAlign === 'left' ? 'flex-start' : 'flex-end'),
                    width: `${orderTotalEditorOptions.lastColumnWidth || 30}%`,
                    padding: orderTotalEditorOptions.borderWidth ? (orderTotalEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: orderTotalEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {orderTotalEditorOptions.value === '{{order_total}}' ? '₹55.00' : orderTotalEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default OrderTotalFieldComponent;
