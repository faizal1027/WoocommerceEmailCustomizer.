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
        padding: orderItemsEditorOptions.padding || '0px 0px 0px 0px',
        border: isSelected ? '2px dashed blue' : '',
        borderRadius: 1,
        backgroundColor: orderItemsEditorOptions.backgroundColor && orderItemsEditorOptions.backgroundColor !== 'transparent' ? orderItemsEditorOptions.backgroundColor : '#fff',
        position: 'relative',
        fontFamily: orderItemsEditorOptions.fontFamily === 'inherit' || !orderItemsEditorOptions.fontFamily ? 'inherit' : orderItemsEditorOptions.fontFamily,
        fontSize: orderItemsEditorOptions.fontSize || '14px',
        color: orderItemsEditorOptions.textColor || '#333333',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        noWrap
        sx={{
          textAlign: orderItemsEditorOptions.textAlign || 'left',
          fontFamily: orderItemsEditorOptions.fontFamily === 'inherit' || !orderItemsEditorOptions.fontFamily ? 'inherit' : orderItemsEditorOptions.fontFamily,
          fontSize: orderItemsEditorOptions.fontSize || '18px',
          color: orderItemsEditorOptions.textColor || '#333333',
        }}
      >
        [Order #{fallback(orderItemsEditorOptions.orderNumber, previewMode ? '12345' : '{{order_id}}')}] (
        {fallback(orderItemsEditorOptions.orderDate, previewMode ? 'December 10, 2025' : '{{order_date}}')})
      </Typography>

      <Box sx={{ overflowX: 'none' }}>
        <Table size="small" sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', fontWeight: 'bold' }}>Product</TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', fontWeight: 'bold' }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderItemsEditorOptions.items.length > 0 ? (
              orderItemsEditorOptions.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>{fallback(item.product, previewMode ? 'Sample Product' : '{{product_name}}')}</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>{fallback(item.quantity, previewMode ? '2' : '{{qty}}')}</TableCell>
                  <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>{fallback(item.price, previewMode ? '$49.99' : '{{price}}')}</TableCell>
                </TableRow>
              ))
            ) : (
              previewMode ? (
                <>
                  <TableRow>
                    <TableCell sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>Premium Wireless Headphones</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>1</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>$129.99</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>USB-C Charging Cable</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>2</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>$19.99</TableCell>
                  </TableRow>
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: '#999', fontStyle: 'italic', fontFamily: 'inherit', fontSize: 'inherit' }}>
                    {'{{order_items_rows}}'} - Items will appear here
                  </TableCell>
                </TableRow>
              )
            )}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>Subtotal:</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>{fallback(orderItemsEditorOptions.subtotal, previewMode ? '$169.97' : '{{order_subtotal}}')}</strong>
              </TableCell>
            </TableRow>
            {/* Discount Row */}
            {(orderItemsEditorOptions.discount !== '£0.00' && orderItemsEditorOptions.discount !== '$0.00' && orderItemsEditorOptions.discount !== '0' && orderItemsEditorOptions.discount !== '') || !previewMode ? (
              <TableRow>
                <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                  <strong>Discount:</strong>
                </TableCell>
                <TableCell align="right" sx={{ color: '#e53e3e', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  -{fallback(orderItemsEditorOptions.discount, previewMode ? '$0.00' : '{{order_discount}}')}
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>Payment method:</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                {fallback(orderItemsEditorOptions.paymentMethod, previewMode ? 'Credit Card' : '{{payment_method}}')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>Total:</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>{fallback(orderItemsEditorOptions.total, previewMode ? '$169.97' : '{{order_total}}')}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

    </Box >
  );
};

export default OrderItemsFieldComponent;
