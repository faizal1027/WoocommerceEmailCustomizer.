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

const PaymentMethodFieldComponent: React.FC<Props> = ({
    blockId,
    isSelected,
    onClick,
    onWidgetClick,
}) => {
    const { paymentMethodEditorOptions } = useSelector((state: RootState) => state.workspace);
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
                padding: paymentMethodEditorOptions.padding || '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: paymentMethodEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: paymentMethodEditorOptions.backgroundColor && paymentMethodEditorOptions.backgroundColor !== 'transparent' ? paymentMethodEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: paymentMethodEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: paymentMethodEditorOptions.fontSize || '14px',
                color: paymentMethodEditorOptions.textColor || '#333333',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    fontWeight: 'bold',
                    textAlign: paymentMethodEditorOptions.labelAlign as any || 'left',
                    flex: 1,
                    width: '50%'
                }}>
                    {paymentMethodEditorOptions.label}
                </Box>
                <Box sx={{
                    textAlign: paymentMethodEditorOptions.valueAlign as any || 'right',
                    flex: 1,
                    width: '50%'
                }}>
                    {paymentMethodEditorOptions.value === '{{payment_method}}' ? 'Direct Bank Transfer' : paymentMethodEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentMethodFieldComponent;
