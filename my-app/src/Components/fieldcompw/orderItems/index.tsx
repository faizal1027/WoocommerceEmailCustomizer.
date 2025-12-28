import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';

interface OrderItemsFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const OrderItemsFieldComponent: React.FC<OrderItemsFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  previewMode = true
}) => {
  const { orderItemsEditorOptions } = useSelector((state: RootState) => state.workspace);
  const theme = useTheme();
  const dispatch = useDispatch();


  const getResponsiveWidth = () => {
    switch (columnIndex) {
      case 0:
        return '100%';
      case 1:
        return '100%';
      case 2:
        return '100%';
      case 3:
        return '100%';
      default:
        return '100%';
    }
  };

  const fallback = (val: string | number, placeholder: string | number) =>
    val === '' || val === null || val === undefined ? placeholder : val;

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(e);
        onClick();
        dispatch(setSelectedBlockId(blockId));
      }}
      sx={{
        width: getResponsiveWidth(),
        padding: 1,
        border: isSelected ? '2px dashed blue' : '',
        borderRadius: 1,
        backgroundColor: orderItemsEditorOptions.backgroundColor && orderItemsEditorOptions.backgroundColor !== 'transparent' ? orderItemsEditorOptions.backgroundColor : '#fff',
        position: 'relative',
        fontFamily: orderItemsEditorOptions.fontFamily === 'inherit' || !orderItemsEditorOptions.fontFamily ? 'inherit' : orderItemsEditorOptions.fontFamily,
        fontSize: orderItemsEditorOptions.fontSize || '14px',
        color: orderItemsEditorOptions.textColor || '#333333',
        textAlign: orderItemsEditorOptions.textAlign || 'left',
      }}
    >
      <Typography variant="h6" gutterBottom noWrap>
        [Order #{fallback(orderItemsEditorOptions.orderNumber, previewMode ? '12345' : '{{order_id}}')}] (
        {fallback(orderItemsEditorOptions.orderDate, previewMode ? 'December 10, 2025' : '{{order_date}}')})
      </Typography>

      <Box sx={{ overflowX: 'none' }}>
        <Table size="small" sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItemsEditorOptions.items.length > 0 ? (
              orderItemsEditorOptions.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{fallback(item.product, previewMode ? 'Sample Product' : '{{product_name}}')}</TableCell>
                  <TableCell align="right">{fallback(item.quantity, previewMode ? '2' : '{{qty}}')}</TableCell>
                  <TableCell align="right">{fallback(item.price, previewMode ? '$49.99' : '{{price}}')}</TableCell>
                </TableRow>
              ))
            ) : (
              previewMode ? (
                <>
                  <TableRow>
                    <TableCell>Premium Wireless Headphones</TableCell>
                    <TableCell align="right">1</TableCell>
                    <TableCell align="right">$129.99</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>USB-C Charging Cable</TableCell>
                    <TableCell align="right">2</TableCell>
                    <TableCell align="right">$19.99</TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: '#999', fontStyle: 'italic' }}>
                    {'{{order_items_rows}}'} - Items will appear here
                  </TableCell>
                </TableRow>
              )
            )}
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Subtotal:</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{fallback(orderItemsEditorOptions.subtotal, previewMode ? '$169.97' : '{{order_subtotal}}')}</strong>
              </TableCell>
            </TableRow>
            {/* Discount Row */}
            {(orderItemsEditorOptions.discount !== '£0.00' && orderItemsEditorOptions.discount !== '$0.00' && orderItemsEditorOptions.discount !== '0' && orderItemsEditorOptions.discount !== '') || !previewMode ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <strong>Discount:</strong>
                </TableCell>
                <TableCell align="right" sx={{ color: '#e53e3e' }}>
                  -{fallback(orderItemsEditorOptions.discount, previewMode ? '$0.00' : '{{order_discount}}')}
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Payment method:</strong>
              </TableCell>
              <TableCell align="right">
                {fallback(orderItemsEditorOptions.paymentMethod, previewMode ? 'Credit Card' : '{{payment_method}}')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>
                <strong>Total:</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{fallback(orderItemsEditorOptions.total, previewMode ? '$169.97' : '{{order_total}}')}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        <strong>Order Item</strong>
      </Typography>
    </Box>
  );
};

export default OrderItemsFieldComponent;
