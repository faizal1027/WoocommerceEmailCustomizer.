import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId } from '../../../Store/Slice/workspaceSlice';

interface TaxBillingFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const TaxBillingFieldComponent: React.FC<TaxBillingFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  previewMode = true
}) => {
  // Get tax billing data from Redux store (you'll need to add this to your slice)
  const { taxBillingEditorOptions } = useSelector((state: RootState) => state.workspace);
  const theme = useTheme();
  const dispatch = useDispatch();

  const getResponsiveWidth = () => {
    switch (columnIndex) {
      case 0: return '100%';
      case 1: return '100%';
      case 2: return '100%';
      case 3: return '100%';
      default: return '100%';
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
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: taxBillingEditorOptions.fontFamily === 'inherit' || !taxBillingEditorOptions.fontFamily ? 'inherit' : taxBillingEditorOptions.fontFamily,
        fontSize: taxBillingEditorOptions.fontSize || '14px',
        color: taxBillingEditorOptions.textColor || '#333333',
        textAlign: taxBillingEditorOptions.textAlign || 'left',
        border: isSelected ? '2px dashed blue' : '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: taxBillingEditorOptions.backgroundColor && taxBillingEditorOptions.backgroundColor !== 'transparent' ? taxBillingEditorOptions.backgroundColor : '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    >
      {/* Tax Invoice Header */}
      <Typography variant="h6" sx={{ marginTop: 0, color: '#333' }}>
        Tax Invoice #{fallback(taxBillingEditorOptions.orderNumber, previewMode ? '12345' : '{{order_id}}')}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Order Date:</strong> {fallback(taxBillingEditorOptions.orderDate, previewMode ? 'December 10, 2025' : '{{order_date}}')}
      </Typography>

      {/* Billing Table */}
      <Table size="small" sx={{ width: '100%', borderCollapse: 'collapse', mt: 1 }}>
        <TableBody>
          <TableRow>
            <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              Subtotal
            </TableCell>
            <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
              {fallback(taxBillingEditorOptions.orderSubtotal, previewMode ? '$169.97' : '{{order_subtotal}}')}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              Shipping
            </TableCell>
            <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
              {fallback(taxBillingEditorOptions.orderShipping, previewMode ? '$10.00' : '{{shipping_cost}}')}
            </TableCell>
          </TableRow>
          {/* Discount Row */}
          {(taxBillingEditorOptions.orderDiscount !== '$0.00' && taxBillingEditorOptions.orderDiscount !== '0' && taxBillingEditorOptions.orderDiscount !== '') || !previewMode ? (
            <TableRow>
              <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                Discount
              </TableCell>
              <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#e53e3e' }}>
                -{fallback(taxBillingEditorOptions.orderDiscount, previewMode ? '$0.00' : '{{order_discount}}')}
              </TableCell>
            </TableRow>
          ) : null}

          <TableRow>
            <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee' }}>
              Tax ({fallback(taxBillingEditorOptions.taxRate, previewMode ? '8.5%' : '{{tax_rate}}')})
            </TableCell>
            <TableCell sx={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
              {fallback(taxBillingEditorOptions.orderTax, previewMode ? '$15.30' : '{{tax_amount}}')}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ padding: '8px', fontWeight: 'bold' }}>
              Total
            </TableCell>
            <TableCell sx={{ padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>
              {fallback(taxBillingEditorOptions.orderTotal, previewMode ? '$195.27' : '{{order_total}}')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Billing Address */}
      <Box sx={{ mt: 2, padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Billing Address:
        </Typography>
        <Typography variant="body2" sx={{ margin: '2px 0' }}>
          {fallback(taxBillingEditorOptions.billingFirstName, previewMode ? 'John' : '{{billing_first_name}}')} {fallback(taxBillingEditorOptions.billingLastName, previewMode ? 'Doe' : '{{billing_last_name}}')}
        </Typography>
        <Typography variant="body2" sx={{ margin: '2px 0' }}>
          {fallback(taxBillingEditorOptions.billingAddress1, previewMode ? '123 Main Street' : '{{billing_address_1}}')}, {fallback(taxBillingEditorOptions.billingCity, previewMode ? 'New York' : '{{billing_city}}')}
        </Typography>
        <Typography variant="body2" sx={{ margin: '2px 0' }}>
          {fallback(taxBillingEditorOptions.billingState, previewMode ? 'NY' : '{{billing_state}}')} {fallback(taxBillingEditorOptions.billingPostcode, previewMode ? '10001' : '{{billing_postcode}}')}, {fallback(taxBillingEditorOptions.billingCountry, previewMode ? 'United States' : '{{billing_country}}')}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        <strong>Tax Billing</strong>
      </Typography>
    </Box>
  );
};

export default TaxBillingFieldComponent;