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
                border: isSelected ? '2px dashed blue' : '1px transparent',
                padding: orderTotalEditorOptions.padding || '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: orderTotalEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: orderTotalEditorOptions.backgroundColor && orderTotalEditorOptions.backgroundColor !== 'transparent' ? orderTotalEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: orderTotalEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: orderTotalEditorOptions.fontSize || '18px',
                color: orderTotalEditorOptions.textColor || '#000000',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    fontWeight: 'bold',
                    textAlign: orderTotalEditorOptions.labelAlign as any || 'left',
                    flex: 1,
                    width: '50%'
                }}>
                    {orderTotalEditorOptions.label}
                </Box>
                <Box sx={{
                    fontWeight: 'bold',
                    textAlign: orderTotalEditorOptions.valueAlign as any || 'right',
                    flex: 1,
                    width: '50%'
                }}>
                    {orderTotalEditorOptions.value === '{{order_total}}' ? '₹55.00' : orderTotalEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default OrderTotalFieldComponent;
