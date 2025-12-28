<?php
/**
 * One-time fix to map templates with 'JSON' type to their correct WooCommerce slugs
 * and fix recipients. Expanded to include Order Details, Notes, and Accounts.
 */

namespace SmackCoders\WETC;

function wetc_run_mapping_fix_v2() {
    // Load WordPress if not already loaded
    if (!function_exists('add_action')) {
        require_once(__DIR__ . '/../../../../wp-load.php');
    }
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'wetc_email_templates';

    // 1. Fetch all templates
    $templates = $wpdb->get_results("SELECT id, email_template_name, content_type, recipient FROM $table_name");

    foreach ($templates as $template) {
        $update_data = [];
        $lower_name = strtolower($template->email_template_name);
        $new_type = $template->content_type;

        // Try to guess type if it's 'JSON', empty, or contains parentheses (display name)
        if ($template->content_type === 'JSON' || empty($template->content_type) || strpos($template->content_type, '(') !== false) {
            if (strpos($lower_name, 'new order') !== false && strpos($lower_name, 'admin') !== false) {
                $new_type = 'new_order_admin';
            } elseif (strpos($lower_name, 'cancelled') !== false && strpos($lower_name, 'admin') !== false) {
                $new_type = 'cancelled_order_admin';
            } elseif (strpos($lower_name, 'cancelled') !== false && strpos($lower_name, 'customer') !== false) {
                $new_type = 'cancelled_order_customer';
            } elseif (strpos($lower_name, 'failed') !== false && strpos($lower_name, 'admin') !== false) {
                $new_type = 'failed_order_admin';
            } elseif (strpos($lower_name, 'failed') !== false && strpos($lower_name, 'customer') !== false) {
                $new_type = 'failed_order_customer';
            } elseif (strpos($lower_name, 'processing') !== false && strpos($lower_name, 'customer') !== false) {
                $new_type = 'processing_order_customer';
            } elseif (strpos($lower_name, 'processing') !== false && strpos($lower_name, 'admin') !== false) {
                $new_type = 'processing_order_admin';
            } elseif (strpos($lower_name, 'completed') !== false && strpos($lower_name, 'customer') !== false) {
                $new_type = 'completed_order_customer';
            } elseif (strpos($lower_name, 'refunded') !== false && strpos($lower_name, 'admin') !== false) {
                $new_type = 'refunded_order_admin';
            } elseif (strpos($lower_name, 'refunded') !== false && strpos($lower_name, 'customer') !== false) {
                $new_type = 'refunded_order_customer';
            } elseif (strpos($lower_name, 'on-hold') !== false || strpos($lower_name, 'on hold') !== false) {
                $new_type = 'on_hold_order';
            } elseif (strpos($lower_name, 'note') !== false) {
                $new_type = 'customer_note';
            } elseif (strpos($lower_name, 'invoice') !== false || strpos($lower_name, 'details') !== false) {
                $new_type = 'customer_invoice';
            } elseif (strpos($lower_name, 'account') !== false || strpos($lower_name, 'registration') !== false) {
                if (strpos($lower_name, 'admin') !== false) {
                    $new_type = 'new_user_registration_admin';
                } else {
                    $new_type = 'new_user_registration';
                }
            } elseif (strpos($lower_name, 'password') !== false) {
                $new_type = 'reset_password';
            } elseif (strpos($lower_name, 'pos completed') !== false) {
                $new_type = 'pos_completed_order';
            } elseif (strpos($lower_name, 'pos refunded') !== false) {
                $new_type = 'pos_refunded_order';
            }
        }

        if ($new_type !== $template->content_type) {
            $update_data['content_type'] = $new_type;
        }

        // 2. Fix Recipient for Customer Templates if they are wrong
        if (strpos($lower_name, 'customer') !== false || strpos($lower_name, 'pos') !== false) {
            if ($template->recipient !== '[CUSTOMER_EMAIL]') {
                $update_data['recipient'] = '[CUSTOMER_EMAIL]';
            }
        }

        // Perform Update if needed
        if (!empty($update_data)) {
            $wpdb->update($table_name, $update_data, ['id' => $template->id]);
            error_log("WETC Fix V2: Updated template #{$template->id} ({$template->email_template_name}) mapping to {$new_type}");
        }
    }
}

// Execute the fix
wetc_run_mapping_fix_v2();
