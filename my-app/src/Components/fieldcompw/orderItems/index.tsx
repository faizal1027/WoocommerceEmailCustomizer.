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
import { setSelectedBlockId, defaultOrderItemsEditorOptions, OrderItem } from '../../../Store/Slice/workspaceSlice';

interface OrderItemsFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
  widgetData?: any;
}

const OrderItemsFieldComponent: React.FC<OrderItemsFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  previewMode = true,
  widgetData
}) => {
  const { blocks } = useSelector((state: RootState) => state.workspace);
  const dispatch = useDispatch();

  const storeBlock = blocks.find((b) => b.id === blockId);
  const storeColumn = storeBlock?.columns[columnIndex];
  const storeWidget = storeColumn?.widgetContents[widgetIndex];

  const widget = widgetData || storeWidget;

  const content = (widget?.contentData)
    ? { ...defaultOrderItemsEditorOptions, ...JSON.parse(widget.contentData) }
    : defaultOrderItemsEditorOptions;

  const theme = useTheme();


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
        width: '100%',
        boxSizing: 'border-box',
        padding: content.padding || '0px 0px 0px 0px',
        border: '',
        borderRadius: 1,
        backgroundColor: content.backgroundColor && content.backgroundColor !== 'transparent' ? content.backgroundColor : '#fff',
        position: 'relative',
        fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
        fontSize: content.fontSize || '14px',
        color: content.textColor || '#333333',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        noWrap
        sx={{
          textAlign: content.textAlign || 'left',
          fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
          fontSize: content.fontSize || '18px',
          color: content.textColor || '#333333',
        }}
      >
        [Order #{fallback(content.orderNumber, previewMode ? '12345' : '{{order_id}}')}] (
        {fallback(content.orderDate, previewMode ? 'December 10, 2025' : '{{order_date}}')})
      </Typography>

      <Box sx={{ overflowX: 'none', width: '100%' }}>
        <Table size="small" sx={{ minWidth: 300, width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', fontWeight: 'bold' }}>Product</TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit', fontWeight: 'bold' }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {content.items.length > 0 ? (
              content.items.map((item: OrderItem, index: number) => (
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
                <strong>{fallback(content.subtotal, previewMode ? '$169.97' : '{{order_subtotal}}')}</strong>
              </TableCell>
            </TableRow>
            {/* Discount Row */}
            {(content.discount !== '£0.00' && content.discount !== '$0.00' && content.discount !== '0' && content.discount !== '') || !previewMode ? (
              <TableRow>
                <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                  <strong>Discount:</strong>
                </TableCell>
                <TableCell align="right" sx={{ color: '#e53e3e', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  -{fallback(content.discount, previewMode ? '$0.00' : '{{order_discount}}')}
                </TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>Payment method:</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                {fallback(content.paymentMethod, previewMode ? 'Credit Card' : '{{payment_method}}')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>Total:</strong>
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                <strong>{fallback(content.total, previewMode ? '$169.97' : '{{order_total}}')}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

    </Box >
  );
};

export default OrderItemsFieldComponent;
