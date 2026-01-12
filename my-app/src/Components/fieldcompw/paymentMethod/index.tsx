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
                outline: 'none',
                boxShadow: isSelected ? '0 0 0 2px #2196f3' : 'none',
                border: `${paymentMethodEditorOptions.borderWidth || 0}px solid ${paymentMethodEditorOptions.borderColor || '#eeeeee'}`,
                padding: (paymentMethodEditorOptions.borderWidth || 0) > 0 ? '0' : (paymentMethodEditorOptions.padding || '10px'),
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: (paymentMethodEditorOptions.borderWidth || 0) > 0 ? 'stretch' : 'center',
                textAlign: paymentMethodEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: paymentMethodEditorOptions.backgroundColor && paymentMethodEditorOptions.backgroundColor !== 'transparent' ? paymentMethodEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Box sx={{
                fontFamily: paymentMethodEditorOptions.fontFamily || 'Arial, sans-serif',
                fontSize: paymentMethodEditorOptions.fontSize || '14px',
                fontWeight: paymentMethodEditorOptions.fontWeight,
                lineHeight: paymentMethodEditorOptions.lineHeight ? `${paymentMethodEditorOptions.lineHeight}px` : undefined,
                color: paymentMethodEditorOptions.textColor || '#333333',
                display: 'flex',
                alignItems: 'center',
                width: '100%'
            }}>
                <Box sx={{
                    textAlign: paymentMethodEditorOptions.labelAlign as any || 'left',
                    justifyContent: (paymentMethodEditorOptions.labelAlign === 'center') ? 'center' : (paymentMethodEditorOptions.labelAlign === 'right' ? 'flex-end' : 'flex-start'),
                    width: `${100 - (paymentMethodEditorOptions.lastColumnWidth || 30)}%`,
                    borderRight: paymentMethodEditorOptions.borderWidth ? `${paymentMethodEditorOptions.borderWidth}px solid ${paymentMethodEditorOptions.borderColor || '#eeeeee'}` : 'none',
                    padding: paymentMethodEditorOptions.borderWidth ? (paymentMethodEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: paymentMethodEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {paymentMethodEditorOptions.label}
                </Box>
                <Box sx={{
                    textAlign: paymentMethodEditorOptions.valueAlign as any || 'right',
                    justifyContent: (paymentMethodEditorOptions.valueAlign === 'center') ? 'center' : (paymentMethodEditorOptions.valueAlign === 'left' ? 'flex-start' : 'flex-end'),
                    width: `${paymentMethodEditorOptions.lastColumnWidth || 30}%`,
                    padding: paymentMethodEditorOptions.borderWidth ? (paymentMethodEditorOptions.padding || '10px') : 0,
                    boxSizing: 'border-box',
                    display: paymentMethodEditorOptions.borderWidth ? 'flex' : 'block',
                    alignItems: 'center'
                }}>
                    {paymentMethodEditorOptions.value === '{{payment_method}}' ? 'Direct Bank Transfer' : paymentMethodEditorOptions.value}
                </Box>
            </Box>
        </Box>
    );
};

export default PaymentMethodFieldComponent;
