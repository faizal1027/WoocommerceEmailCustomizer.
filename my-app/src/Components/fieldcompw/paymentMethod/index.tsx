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
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: paymentMethodEditorOptions.textAlign as any,
                paddingTop: `${paymentMethodEditorOptions.spacing || 0}px`,
                paddingBottom: `${paymentMethodEditorOptions.spacing || 0}px`,
                width: '100%',
                backgroundColor: paymentMethodEditorOptions.backgroundColor && paymentMethodEditorOptions.backgroundColor !== 'transparent' ? paymentMethodEditorOptions.backgroundColor : 'transparent',
            }}
        >
            <Typography sx={{
                fontFamily: paymentMethodEditorOptions.fontFamily === 'inherit' || !paymentMethodEditorOptions.fontFamily ? 'inherit' : paymentMethodEditorOptions.fontFamily,
                fontSize: paymentMethodEditorOptions.fontSize,
                color: paymentMethodEditorOptions.textColor,
                fontWeight: 'bold'
            }}>
                {paymentMethodEditorOptions.label}
            </Typography>
            <Typography sx={{
                fontFamily: paymentMethodEditorOptions.fontFamily === 'inherit' || !paymentMethodEditorOptions.fontFamily ? 'inherit' : paymentMethodEditorOptions.fontFamily,
                fontSize: paymentMethodEditorOptions.fontSize,
                color: paymentMethodEditorOptions.textColor,
            }}>
                {paymentMethodEditorOptions.value === '{{payment_method}}' ? 'Paypal' : paymentMethodEditorOptions.value}
            </Typography>
        </Box>
    );
};

export default PaymentMethodFieldComponent;
