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

const OrderSubtotalFieldComponent: React.FC<Props> = ({
    blockId,
    isSelected,
    onClick,
    onWidgetClick,
}) => {
    const { orderSubtotalEditorOptions } = useSelector((state: RootState) => state.workspace);
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
                textAlign: orderSubtotalEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: orderSubtotalEditorOptions.backgroundColor && orderSubtotalEditorOptions.backgroundColor !== 'transparent' ? orderSubtotalEditorOptions.backgroundColor : 'transparent',
            }}
        >
            {orderSubtotalEditorOptions.value === '{{order_subtotal}}' || orderSubtotalEditorOptions.value === '{{order_totals_table}}' ? (
                <Box width="100%">
                    {[
                        { label: 'Subtotal', value: '₹50.00' },
                        { label: 'Discount', value: '-₹5.00', color: '#e53e3e' },
                        { label: 'Shipping', value: '₹10.00' },
                        { label: 'Order fully refunded', value: '-₹0.00', weight: 'bold', border: true },
                        { label: 'Refund', value: '-₹0.00' },
                    ].map((item, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                                paddingTop: `${orderSubtotalEditorOptions.spacing || 0}px`,
                                paddingBottom: `${orderSubtotalEditorOptions.spacing || 0}px`,
                                borderTop: item.border ? '1px solid #eee' : 'none',
                            }}
                        >
                            <Typography sx={{
                                fontFamily: orderSubtotalEditorOptions.fontFamily === 'inherit' || !orderSubtotalEditorOptions.fontFamily ? 'inherit' : orderSubtotalEditorOptions.fontFamily,
                                fontSize: orderSubtotalEditorOptions.fontSize,
                                color: item.color || orderSubtotalEditorOptions.textColor,
                                fontWeight: item.weight || 'normal',
                            }}>
                                {item.label}:
                            </Typography>
                            <Typography sx={{
                                fontFamily: orderSubtotalEditorOptions.fontFamily === 'inherit' || !orderSubtotalEditorOptions.fontFamily ? 'inherit' : orderSubtotalEditorOptions.fontFamily,
                                fontSize: orderSubtotalEditorOptions.fontSize,
                                color: item.color || orderSubtotalEditorOptions.textColor,
                                fontWeight: item.weight || 'normal',
                            }}>
                                {item.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box
                    display="flex"
                    justifyContent="space-between"
                    gap={`${orderSubtotalEditorOptions.spacing}px`}
                >
                    <Typography sx={{
                        fontFamily: orderSubtotalEditorOptions.fontFamily === 'inherit' || !orderSubtotalEditorOptions.fontFamily ? 'inherit' : orderSubtotalEditorOptions.fontFamily,
                        fontSize: orderSubtotalEditorOptions.fontSize,
                        color: orderSubtotalEditorOptions.textColor,
                        fontWeight: 'bold'
                    }}>
                        {orderSubtotalEditorOptions.label}
                    </Typography>
                    <Typography sx={{
                        fontFamily: orderSubtotalEditorOptions.fontFamily === 'inherit' || !orderSubtotalEditorOptions.fontFamily ? 'inherit' : orderSubtotalEditorOptions.fontFamily,
                        fontSize: orderSubtotalEditorOptions.fontSize,
                        color: orderSubtotalEditorOptions.textColor,
                    }}>
                        {orderSubtotalEditorOptions.value}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default OrderSubtotalFieldComponent;
