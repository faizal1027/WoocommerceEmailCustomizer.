import React from 'react';
import { TextField, MenuItem, Box, Typography } from '@mui/material';

export const PLACEHOLDERS = [
    { label: 'User Login', value: '{{user_login}}' },
    { label: 'User Email', value: '{{user_email}}' },
    { label: 'Reset Link', value: '{{reset_link}}' },
    { label: 'Login URL', value: '{{login_url}}' },
    { label: 'Customer Name', value: '{{customer_name}}' },
    { label: 'Order ID', value: '{{order_id}}' },
    { label: 'Order Date', value: '{{order_date}}' },
    { label: 'Order Total', value: '{{order_total}}' },
    { label: 'Order Subtotal', value: '{{order_subtotal}}' },
    { label: 'Order Discount', value: '{{order_discount}}' },
    { label: 'Payment Method', value: '{{payment_method}}' },
    { label: 'Billing Address 1', value: '{{billing_address_1}}' },
    { label: 'Shipping Address 1', value: '{{shipping_address_1}}' },
    { label: 'Shipping Email', value: '{{shipping_email}}' },
    { label: 'Site Name', value: '{{site_name}}' },
    { label: 'Site URL', value: '{{site_url}}' },
    { label: 'Store Name', value: '{{store_name}}' },
    { label: 'Store Email', value: '{{store_email}}' },
    { label: 'Store Phone', value: '{{store_phone}}' },
    { label: 'Shop URL', value: '{{shop_url}}' },
    { label: 'Refund Amount', value: '{{refund_amount}}' },
    { label: 'Refund Reason', value: '{{refund_reason}}' },
    { label: 'Customer Note', value: '{{customer_note}}' },
];

interface PlaceholderSelectProps {
    onSelect: (placeholder: string) => void;
    label?: string;
    size?: 'small' | 'medium';
}

export const PlaceholderSelect: React.FC<PlaceholderSelectProps> = ({
    onSelect,
    label = "Insert Placeholder",
    size = "small"
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value) {
            onSelect(value);
            // Reset select? Usually tricky with controlled inputs if we want it to act as a button.
            // We can keep it simple: just trigger select.
        }
    };

    return (
        <TextField
            select
            fullWidth
            size={size}
            label={label}
            value=""
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            SelectProps={{
                displayEmpty: true,
                renderValue: (value: any) => {
                    if (value === "") {
                        return <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>Select Variable...</span>;
                    }
                    return value;
                },
                MenuProps: {
                    disablePortal: false,
                    sx: { zIndex: 1300001 },
                    style: { zIndex: 1300001 }
                }
            }}
        >
            <MenuItem value="" disabled>
                Select Variable...
            </MenuItem>
            {PLACEHOLDERS.map((ph) => (
                <MenuItem key={ph.value} value={ph.value}>
                    <Box display="flex" justifyContent="space-between" width="100%">
                        <Typography variant="body2">{ph.label}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                            {ph.value}
                        </Typography>
                    </Box>
                </MenuItem>
            ))}
        </TextField>
    );
};
