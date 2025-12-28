import { EmailTypeInfo, EmailTemplateType } from '../types/emailTemplate';

export const EMAIL_TYPES: EmailTypeInfo[] = [
    {
        type: 'new_order_admin',
        name: 'New Order (Admin)',
        description: 'Sent to admin when a new order is received',
        icon: '📦',
        category: 'admin',
        defaultPlaceholders: [
            '{order_number}',
            '{order_date}',
            '{customer_name}',
            '{customer_email}',
            '{billing_address}',
            '{shipping_address}',
            '{order_items}',
            '{order_total}',
            '{payment_method}'
        ]
    },
    {
        type: 'cancelled_order_customer',
        name: 'Cancelled Order (Customer)',
        description: 'Sent to customer when an order is cancelled',
        icon: '❌',
        category: 'customer',
        defaultPlaceholders: [
            '{order_number}',
            '{order_date}',
            '{customer_name}',
            '{order_total}',
            '{cancellation_reason}'
        ]
    },
    {
        type: 'cancelled_order_admin',
        name: 'Cancelled Order (Admin)',
        description: 'Sent to admin when an order is cancelled',
        icon: '❌',
        category: 'admin',
        defaultPlaceholders: [
            '{order_number}',
            '{order_date}',
            '{customer_name}',
            '{order_total}',
            '{cancellation_reason}'
        ]
    },
    {
        type: 'failed_order_customer',
        name: 'Failed Order (Customer)',
        description: 'Sent to customer when payment fails',
        icon: '⚠️',
        category: 'customer',
        defaultPlaceholders: [
            '{order_number}',
            '{order_date}',
            '{customer_name}',
            '{order_total}'
        ]
    },
    {
        type: 'failed_order_admin',
        name: 'Failed Order (Admin)',
        description: 'Sent to admin when payment fails',
        icon: '⚠️',
        category: 'admin',
        defaultPlaceholders: [
            '{order_number}',
            '{order_date}',
            '{customer_name}',
            '{order_total}'
        ]
    },
    {
        type: 'processing_order_customer',
        name: 'Processing Order (Customer)',
        description: 'Sent to customer when order is processing',
        icon: '⏳',
        category: 'customer',
        defaultPlaceholders: [
            '{customer_name}',
            '{order_number}',
            '{order_date}',
            '{order_items}',
            '{order_total}',
            '{billing_address}',
            '{shipping_address}',
            '{payment_method}'
        ]
    },
    {
        type: 'processing_order_admin',
        name: 'Processing Order (Admin)',
        description: 'Sent to admin when order is processing (if enabled)',
        icon: '⏳',
        category: 'admin',
        defaultPlaceholders: [
            '{order_number}',
            '{customer_name}'
        ]
    },
    {
        type: 'completed_order_customer',
        name: 'Completed Order (Customer)',
        description: 'Sent to customer when order is completed',
        icon: '✅',
        category: 'customer',
        defaultPlaceholders: [
            '{customer_name}',
            '{order_number}',
            '{order_date}',
            '{order_items}',
            '{order_total}',
            '{download_links}'
        ]
    },
    {
        type: 'refunded_order_customer',
        name: 'Refunded Order (Customer)',
        description: 'Sent to customer when order is refunded',
        icon: '💰',
        category: 'customer',
        defaultPlaceholders: [
            '{customer_name}',
            '{order_number}',
            '{refund_amount}',
            '{refund_reason}',
            '{order_date}'
        ]
    },
    {
        type: 'refunded_order_admin',
        name: 'Refunded Order (Admin)',
        description: 'Sent to admin when order is refunded',
        icon: '💰',
        category: 'admin',
        defaultPlaceholders: [
            '{order_number}',
            '{refund_amount}'
        ]
    },
    {
        type: 'customer_invoice',
        name: 'Customer Invoice',
        description: 'Sent to customer with order invoice',
        icon: '📄',
        category: 'customer',
        defaultPlaceholders: [
            '{customer_name}',
            '{order_number}',
            '{invoice_link}'
        ]
    },
    {
        type: 'customer_note',
        name: 'Customer Note',
        description: 'Sent to customer when a note is added to their order',
        icon: '📝',
        category: 'customer',
        defaultPlaceholders: [
            '{customer_name}',
            '{order_number}',
            '{note_content}'
        ]
    },
    {
        type: 'on_hold_order',
        name: 'Order On-Hold (Customer)',
        description: 'Sent to customer when order is on hold',
        icon: '⏸️',
        category: 'customer',
        defaultPlaceholders: [
            '{customer_name}',
            '{order_number}',
            '{order_date}'
        ]
    },
    {
        type: 'abandoned_cart',
        name: 'Abandoned Cart',
        description: 'Sent to customer to recover abandoned cart',
        icon: '🛒',
        category: 'customer',
        defaultPlaceholders: [
            '{cart_url}',
            '{shop_url}'
        ]
    },
    {
        type: 'new_user_registration',
        name: 'New User Registration (Customer)',
        description: 'Sent to new customer upon registration',
        icon: '👤',
        category: 'customer',
        defaultPlaceholders: [
            '{customer_name}'
        ]
    },
    {
        type: 'new_user_registration_admin',
        name: 'New User Registration (Admin)',
        description: 'Sent to admin upon new user registration',
        icon: '👤',
        category: 'admin',
        defaultPlaceholders: [
            '{customer_name}'
        ]
    },
    {
        type: 'reset_password',
        name: 'Customer Reset Password',
        description: 'Sent to customer when they request a password reset',
        icon: '🔑',
        category: 'customer',
        defaultPlaceholders: [
            '{user_login}',
            '{reset_link}',
            '{store_name}'
        ]
    }
];

// Helper function to get email type info
export const getEmailTypeInfo = (type: EmailTemplateType): EmailTypeInfo | undefined => {
    return EMAIL_TYPES.find(et => et.type === type);
};

// Helper function to get placeholders for a type
export const getPlaceholdersForType = (type: EmailTemplateType): string[] => {
    const emailType = getEmailTypeInfo(type);
    return emailType?.defaultPlaceholders || [];
};
