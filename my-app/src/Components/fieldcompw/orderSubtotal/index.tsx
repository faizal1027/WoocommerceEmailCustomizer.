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

    const lastColumnWidth = orderSubtotalEditorOptions.lastColumnWidth || 30;
    const labelColumnWidth = 100 - lastColumnWidth;

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
                border: `${orderSubtotalEditorOptions.borderWidth || 0}px solid ${orderSubtotalEditorOptions.borderColor || '#eeeeee'}`,
                padding: (orderSubtotalEditorOptions.borderWidth || 0) > 0 ? '0' : (orderSubtotalEditorOptions.padding || '10px'),
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: orderSubtotalEditorOptions.textAlign as any,
                width: '100%',
                backgroundColor: orderSubtotalEditorOptions.backgroundColor && orderSubtotalEditorOptions.backgroundColor !== 'transparent' ? orderSubtotalEditorOptions.backgroundColor : 'transparent',
            }}
        >
            {orderSubtotalEditorOptions.value === '{{order_subtotal}}' || orderSubtotalEditorOptions.value === '{{order_totals_table}}' || !orderSubtotalEditorOptions.value ? (
                <Box width="100%">
                    {[
                        { label: orderSubtotalEditorOptions.subtotalLabel || 'Subtotal', value: '₹50.00' },
                        { label: orderSubtotalEditorOptions.discountLabel || 'Discount', value: '-₹5.00', color: '#e53e3e' },
                        { label: orderSubtotalEditorOptions.shippingLabel || 'Shipping', value: '₹10.00' },
                        { label: orderSubtotalEditorOptions.refundedFullyLabel || 'Order fully refunded', value: '-₹0.00', weight: 'bold', border: true },
                        { label: orderSubtotalEditorOptions.refundedPartialLabel || 'Refund', value: '-₹0.00' },
                    ].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                alignItems: "stretch",
                                borderBottom: (index < 4 && (orderSubtotalEditorOptions.borderWidth || 0) > 0) ? `${orderSubtotalEditorOptions.borderWidth}px solid ${orderSubtotalEditorOptions.borderColor || '#eeeeee'}` : 'none',
                                borderTop: (item.border && !(orderSubtotalEditorOptions.borderWidth || 0)) ? `1px solid ${orderSubtotalEditorOptions.borderColor || '#eee'}` : 'none',
                                fontFamily: orderSubtotalEditorOptions.fontFamily === 'inherit' || !orderSubtotalEditorOptions.fontFamily ? 'inherit' : orderSubtotalEditorOptions.fontFamily,
                                fontSize: orderSubtotalEditorOptions.fontSize,
                                lineHeight: orderSubtotalEditorOptions.lineHeight ? `${orderSubtotalEditorOptions.lineHeight}px` : undefined,
                                color: item.color || orderSubtotalEditorOptions.textColor,
                            }}
                        >
                            <Box sx={{
                                fontWeight: item.weight || orderSubtotalEditorOptions.fontWeight || 'bold',
                                justifyContent: (orderSubtotalEditorOptions.labelAlign === 'center') ? 'center' : (orderSubtotalEditorOptions.labelAlign === 'right' ? 'flex-end' : 'flex-start'),
                                width: `${labelColumnWidth}%`,
                                borderRight: (orderSubtotalEditorOptions.borderWidth || 0) > 0 ? `${orderSubtotalEditorOptions.borderWidth}px solid ${orderSubtotalEditorOptions.borderColor || '#eeeeee'}` : 'none',
                                paddingRight: (orderSubtotalEditorOptions.borderWidth || 0) > 0 ? '10px' : '0',
                                paddingLeft: (orderSubtotalEditorOptions.borderWidth || 0) > 0 ? '10px' : '0',
                                paddingTop: `${orderSubtotalEditorOptions.spacing || 0}px`,
                                paddingBottom: `${orderSubtotalEditorOptions.spacing || 0}px`,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {item.label}:
                            </Box>
                            <Box sx={{
                                fontWeight: item.weight || 'normal',
                                justifyContent: (orderSubtotalEditorOptions.valueAlign === 'center') ? 'center' : (orderSubtotalEditorOptions.valueAlign === 'left' ? 'flex-start' : 'flex-end'),
                                width: `${lastColumnWidth}%`,
                                paddingLeft: (orderSubtotalEditorOptions.borderWidth || 0) > 0 ? '10px' : '0',
                                paddingRight: (orderSubtotalEditorOptions.borderWidth || 0) > 0 ? '10px' : '0',
                                paddingTop: `${orderSubtotalEditorOptions.spacing || 0}px`,
                                paddingBottom: `${orderSubtotalEditorOptions.spacing || 0}px`,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {item.value}
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{
                    backgroundColor: orderSubtotalEditorOptions.backgroundColor || 'transparent',
                    fontFamily: orderSubtotalEditorOptions.fontFamily || 'Arial, sans-serif',
                    fontSize: orderSubtotalEditorOptions.fontSize || '14px',
                    color: orderSubtotalEditorOptions.textColor || '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: `${orderSubtotalEditorOptions.spacing || 0}px`,
                    paddingBottom: `${orderSubtotalEditorOptions.spacing || 0}px`,
                    width: '100%'
                }}>
                    <Box sx={{
                        fontWeight: 'bold',
                        textAlign: orderSubtotalEditorOptions.labelAlign as any || 'left',
                        width: `${labelColumnWidth}%`
                    }}>
                        {orderSubtotalEditorOptions.label}
                    </Box>
                    <Box sx={{
                        textAlign: orderSubtotalEditorOptions.valueAlign as any || 'right',
                        width: `${lastColumnWidth}%`
                    }}>
                        {orderSubtotalEditorOptions.value}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default OrderSubtotalFieldComponent;
