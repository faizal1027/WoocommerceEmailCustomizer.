<?php

namespace SmackCoders\WETC;

if (!defined('ABSPATH')) {
    die;
}
   
class WETC_Email_Handler {

    private static $instance = null;

    public static function log($message) {
        // $log_file = SMACK_WETC_PLUGIN_PATH . 'wetc_debug.log';
        // $timestamp = date('Y-m-d H:i:s');
        // @file_put_contents($log_file, "[$timestamp] $message\n", FILE_APPEND);
    }

    private function __construct() {
        self::log("WETC_Email_Handler constructor called. URI: " . $_SERVER['REQUEST_URI']);
        // Disable emails
        // Disable default WooCommerce emails with high priority to prevent duplicates
        $emails_to_disable = [
            'new_order',
            'cancelled_order',
            'failed_order',
            'customer_on_hold_order',
            'customer_processing_order',
            'customer_completed_order',
            'customer_refunded_order',
            'customer_invoice',
            'customer_note',
            'customer_reset_password',
            'customer_new_account',
            'new_account'
        ];

        foreach ($emails_to_disable as $email_id) {
            add_filter("woocommerce_email_enabled_{$email_id}", '__return_false', 9999);
            add_filter("woocommerce_email_recipient_{$email_id}", '__return_empty_string', 9999);
        }

        // Additional abandonment cart disable if applicable
        add_filter('woocommerce_email_enabled_abandoned_cart', '__return_false', 9999);

        // Hook 
        add_action('woocommerce_order_status_processing', [$this,'processing_order_email'], 10, 1);
        add_action('woocommerce_order_status_processing', [$this,'new_order_admin_email'], 10, 1);
        add_action('woocommerce_order_status_pending_to_processing_notification', [$this,'new_order_admin_email'], 10, 1);
        add_action('woocommerce_order_status_pending_to_completed_notification', [$this,'new_order_admin_email'], 10, 1);
        add_action('woocommerce_order_status_pending_to_on-hold_notification', [$this,'new_order_admin_email'], 10, 1);
        add_action('woocommerce_order_status_failed_to_processing_notification', [$this,'new_order_admin_email'], 10, 1);
        add_action('woocommerce_order_status_failed_to_completed_notification', [$this,'new_order_admin_email'], 10, 1);
        add_action('woocommerce_new_order', [$this,'new_order_admin_email'], 10, 1);
        add_action('woocommerce_order_status_failed', [$this,'failed_order_email'], 10, 1);
        add_action('woocommerce_order_status_failed', [$this,'failed_order_email_admin'], 10, 1);
        add_action('woocommerce_order_status_on-hold', [$this,'on_hold_order_email'], 10, 1);
        add_action('woocommerce_order_fully_refunded', [$this, 'refunded_order_email'], 10, 2);
        add_action('woocommerce_order_partially_refunded', [$this, 'refunded_order_email'], 10, 2);
        add_action('woocommerce_order_status_cancelled', [$this, 'cancelled_order_email'], 10, 1);
        add_action('woocommerce_order_status_cancelled', [$this, 'cancelled_order_email_admin'], 10, 1);
        add_action('woocommerce_order_status_completed', [$this,'completed_order_email'], 10, 1);
        add_action('woocommerce_order_status_completed', [$this,'new_order_admin_email'], 10, 1);
        
        // Admin Cancellation Hooks
        add_action('woocommerce_order_status_pending_to_cancelled_notification', [$this, 'cancelled_order_email_admin'], 10, 1);
        add_action('woocommerce_order_status_on-hold_to_cancelled_notification', [$this, 'cancelled_order_email_admin'], 10, 1);
        add_action('woocommerce_order_status_processing_to_cancelled_notification', [$this, 'cancelled_order_email_admin'], 10, 1);
        add_action('woocommerce_order_status_cancelled_notification', [$this, 'cancelled_order_email_admin'], 10, 1);
        
        add_action('woocommerce_order_status_abandoned-cart', [$this, 'abandoned_cart_email'], 10, 1);
        add_action('woocommerce_created_customer', [$this,'new_user_registration_email'], 10, 1);
        add_action('woocommerce_created_customer', [$this,'new_user_registration_email_admin'], 10, 1);
        add_action('woocommerce_new_customer_note', [$this, 'customer_note_email'], 10, 1);
        add_action('woocommerce_email_customer_invoice', [$this, 'customer_invoice_email'], 10, 1);
        add_action('woocommerce_after_resend_order_email', [$this, 'handle_resend_notification'], 10, 2);
        add_action('woocommerce_before_resend_order_emails', [$this, 'handle_resend_notification'], 10, 2);
        add_filter('retrieve_password_message', [$this, 'reset_password_email'], 10, 4);
        add_action('init', [$this, 'custom_email_open_tracker']);
        add_action('init', [$this, 'custom_email_click_tracker']);

        



        add_action('wp_mail_failed', function($error) {
            error_log('wp_mail failed: ' . print_r($error->errors, true));
        });

    }

public static function get_instance() {

    if (self::$instance === null) {
        self::$instance = new self();
    }
    return self::$instance;
}


    private function get_active_template_for_type($content_type) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        
        // --- Robust Slug Matching ---
        // 1. Try exact match
        $row = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE content_type = %s ORDER BY id DESC LIMIT 1",
            $content_type
        ));

        if ($row) return $row;

        // 2. Try case-insensitive and normalized (spaces to underscores)
        $normalized_slug = str_replace(' ', '_', strtolower($content_type));
        $all_templates = $wpdb->get_results("SELECT * FROM $table_name ORDER BY id DESC");
        
        foreach ($all_templates as $template) {
            $t_slug = str_replace(' ', '_', strtolower($template->content_type));
            if ($t_slug === $normalized_slug) {
                return $template;
            }
        }

        return null;
    }

    private function send_email_for_type($order_id, $content_type, $default_subject = '', $to_admin = false, $extra_replacements = []) {
        $order = wc_get_order($order_id);
        if (!$order) {
            self::log("WETC: Invalid order ID $order_id for type $content_type");
            error_log("WETC: Invalid order ID $order_id for type $content_type");
            return;
        }

        // --- Prevent Duplicate Emails ---
        if ($order_id > 0) {
            $sent_key = '_wetc_sent_' . $content_type;
            if ($order->get_meta($sent_key)) {
                self::log("WETC: Skipping $content_type for #$order_id (already sent/meta exists: $sent_key)");
                return;
            }
        }
        
        $template = $this->get_active_template_for_type($content_type);

        if (!$template) {
            self::log("WETC: No template found for $content_type");
            return;
        }

        // Only mark as sent if template found
        if ($order_id > 0) {
            $order->update_meta_data($sent_key, 'yes');
            $order->save();
        }

        $template_id = intval($template->id);
        
        // Use subject from DB, fallback to default passed, fallback to template name
        $subject = !empty($template->subject) ? $template->subject : ($default_subject ?: $template->email_template_name);
        $html_content = !empty($template->html_content) ? stripslashes($template->html_content) : '';

        if (empty($html_content)) {
            self::log("WETC: Template $template_id has no content (content_type: $content_type).");
            error_log("WETC: Template $template_id has no content.");
            return;
        }

        // Settings for styles (optional, can be deprecated if HTML has inline styles)
        $settings = !empty($template->settings) ? json_decode($template->settings, true) : [];
        $header_color = esc_attr($settings['header_color'] ?? '#F44336'); 
        $footer_color = esc_attr($settings['footer_color'] ?? '#333333'); 
        $font = esc_attr($settings['font'] ?? 'Poppins'); 

        // Replacements
        $body = self::replace_email_placeholders($html_content, $order_id, $order, $header_color, $footer_color, $font, $template_id, $extra_replacements);

        // Subject Replacements
        $subject = self::replace_email_placeholders($subject, $order_id, $order, $header_color, $footer_color, $font, $template_id, $extra_replacements);

        // Tracking Pixel
        $tracking_url = esc_url(site_url('/?email-tracker=1&order_id=' . $order_id . '&template_id=' . $template_id));
        $tracking_pixel = '<img src="' . $tracking_url . '" width="1" height="1" style="display:none;" alt="." />';
        
        if (strpos($body, '</body>') !== false) {
            $body = str_replace('</body>', $tracking_pixel . '</body>', $body);
        } else {
            $body .= $tracking_pixel;
        }

        // Recipient
        if ($to_admin) {
            $to = get_option('admin_email');
            // Check if template has specific recipient override?
            if (!empty($template->recipient) && is_email($template->recipient)) {
                 $to = $template->recipient;
            }
        } else {
            $to = $order->get_billing_email();
        }

        $headers = ['Content-Type: text/html; charset=UTF-8'];
        self::log("WETC: Attempting to send $content_type email to $to for order #$order_id...");
        $mail_sent = wp_mail($to, $subject, $body, $headers);

        if ($mail_sent) {
            self::log("WETC: Email SENT successfully for #$order_id");
            $this->log_analytics($template_id);
        } else {
            self::log("WETC: Email SEND FAILED for #$order_id");
            error_log("WETC: Failed sending $content_type to $to for order #$order_id");
        }

        return $body;
    }

    private function log_analytics($template_id) {
        global $wpdb;
        $date = current_time('Y-m-d');
        $table_analytics = $wpdb->prefix . 'woo_email_analytics';
        
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_analytics WHERE template_id = %d AND date_recorded = %s",
            $template_id, $date
        ));

        if ($existing) {
            $wpdb->update($table_analytics, 
                ['emails_sent' => $existing->emails_sent + 1], 
                ['id' => $existing->id]
            );
        } else {
            $wpdb->insert($table_analytics, [
                'template_id' => $template_id,
                'emails_sent' => 1,
                'emails_opened' => 0,
                'emails_clicked' => 0,
                'date_recorded' => $date
            ]);
        }
    }

    public static function replace_email_placeholders($body, $order_id, $order, $header_color, $footer_color, $font, $template_id = 0, $extra_replacements = []) {
        
        // --- Helper for Missing Data Notification ---
        $safe_replace = function($placeholder, $value) use (&$body) {
            $optional_placeholders = [
                '{{billing_address_2}}',
                '{{shipping_address_2}}',
                '{{billing_company}}',
                '{{shipping_company}}',
                '{{customer_note}}'
            ];

            if (empty($value)) {
                if (in_array($placeholder, $optional_placeholders)) {
                    return ''; // Allow empty for these
                }
                return $placeholder; 
            }
            return $value;
        };

        // --- 1. Order / User Details ---
        $customer_name = "";
        $total_order = "";
        $order_url = "";
        $subtotal = "";
        $payment_method = "";
        $admin_order_url = "";
        $billing_name = "";
        $billing_address_1 = "";
        $billing_address_2 = "";
        $billing_city = "";
        $billing_country = "";
        $billing_phone = "";
        $billing_email = "";
        $shipping_name = "";
        $shipping_address_1 = "";
        $shipping_address_2 = "";
        $shipping_city = "";
        $shipping_country = "";
        $shipping_phone = "";
        $shipping_email = "";
        $order_items_rows = "";
        $order_date = "";
        $shipping_method = "";
        $combined_discount = 0;
        $coupon_discount = 0;
        $total_sale_discount = 0;
        $tax_amount = "";
        $order_shipping = "";
        $related_products_data = [];
        $customer_note = "";
        $order_totals_table = "";

        // --- Store Details ---
        $store_name = get_bloginfo('name');
        $store_address = WC()->countries->get_base_address();
        $store_email = get_option('admin_email');
        $store_phone = get_option('woocommerce_store_phone', ''); 
        $store_tagline = get_bloginfo('description');
        $logo_url = get_theme_mod('custom_logo') ? wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'full')[0] : '';
        $contact_url = esc_url(get_option('contact_page_url'));

        if ($order instanceof \WC_Order) {
            $customer_name = $order->get_billing_first_name();
            $total_order = wc_price($order->get_total());
            $order_url_raw = esc_url($order->get_view_order_url());
            $order_url = $order_url_raw;
            if ($template_id > 0) {
                 $order_url = add_query_arg(['email-click' => 1, 'order_id' => $order_id, 'template_id' => $template_id, 'redirect_to' => $order_url_raw], site_url('/'));
            }
            $subtotal = wc_price($order->get_subtotal());
            $payment_method = $order->get_payment_method_title();
            $admin_order_url_raw = admin_url('post.php?post=' . $order_id . '&action=edit');
            $admin_order_url = $admin_order_url_raw;
            if ($template_id > 0) {
                 $admin_order_url = add_query_arg(['email-click' => 1, 'order_id' => $order_id, 'template_id' => $template_id, 'redirect_to' => $admin_order_url_raw], site_url('/'));
            }
            $billing_name = $order->get_formatted_billing_full_name();
            $billing_address_1 = $order->get_billing_address_1();
            $billing_address_2 = $order->get_billing_address_2();
            $billing_city = $order->get_billing_city();
            $billing_country = $order->get_billing_country();
            $billing_phone = $order->get_billing_phone();
            $billing_email = $order->get_billing_email();
            $shipping_name = $order->get_formatted_shipping_full_name();
            $shipping_address_1 = $order->get_shipping_address_1();
            $shipping_address_2 = $order->get_shipping_address_2();
            $shipping_city = $order->get_shipping_city();
            $shipping_country = $order->get_shipping_country();
            $shipping_phone = $order->get_shipping_phone();
            $shipping_email = $billing_email;
            $order_date = $order->get_date_created() ? $order->get_date_created()->date('Y-m-d') : '';
            $shipping_method = $order->get_shipping_method();
            $tax_amount = wc_price($order->get_total_tax());
            $order_shipping = wc_price($order->get_shipping_total());
            $coupon_discount = $order->get_total_discount();
            $coupon_discount = $order->get_total_discount();
            $customer_note = $order->get_customer_note();

            // Additional Billing Details
            $billing_first_name = $order->get_billing_first_name();
            $billing_last_name  = $order->get_billing_last_name();
            $billing_state      = $order->get_billing_state();
            $billing_postcode   = $order->get_billing_postcode();

            // Additional Shipping Details
            $shipping_first_name = $order->get_shipping_first_name();
            $shipping_last_name  = $order->get_shipping_last_name();
            $shipping_state      = $order->get_shipping_state();
            $shipping_postcode   = $order->get_shipping_postcode();
            
            // Refund Details
            $refund_amount = '';
            $refund_reason = '';
            $refunds = $order->get_refunds();
            if (!empty($refunds)) {
                $latest_refund = reset($refunds);
                $refund_amount = wc_price($latest_refund->get_amount());
                $refund_reason = $latest_refund->get_reason() ?: 'Not specified';
            }

            // Items breakdown
            $items = $order->get_items();
            foreach ($items as $item_id => $item) {
                $product_name = $item->get_name();
                $quantity = $item->get_quantity();
                $product = $item->get_product();
                $item_subtotal = $item->get_subtotal();
                $regular_price = $product ? (float)$product->get_regular_price() : 0;
                $line_regular_total = $regular_price > 0 ? $regular_price * $quantity : $item_subtotal;
                if ($line_regular_total > $item_subtotal) {
                    $total_sale_discount += ($line_regular_total - $item_subtotal);
                }
                $order_items_rows .= "<tr><td style='padding: 10px; border: 1px solid #ddd;'>$product_name</td><td style='padding: 10px; border: 1px solid #ddd;'>$quantity</td><td style='padding: 10px; border: 1px solid #ddd;'>" . wc_price($line_regular_total) . "</td></tr>";
            }
            $combined_discount = $coupon_discount + $total_sale_discount;

            // Related Products
            $first_item = reset($items);
            if ($first_item) {
                $product_id = $first_item->get_product_id();
                if ($product_id) {
                    $related_ids = wc_get_related_products($product_id, 4);
                    foreach ($related_ids as $idx => $r_id) {
                        $p = wc_get_product($r_id);
                        if ($p) {
                            $i = $idx + 1;
                            $img_id = $p->get_image_id();
                            $img_url = $img_id ? wp_get_attachment_image_src($img_id, 'medium')[0] : wc_placeholder_img_src();
                            $related_products_data["{{product_name_$i}}"] = $p->get_name();
                            $related_products_data["{{product_price_$i}}"] = $p->get_price_html();
                            $related_products_data["{{product_image_$i}}"] = $img_url;
                            $related_products_data["{{product_url_$i}}"] = $p->get_permalink();
                        }
                    }
                }
            }

            // Add Totals Breakdown
            if ($total_sale_discount > 0) {
                $order_items_rows .= "<tr>
                    <td colspan='2' style='padding: 10px; border: 1px solid #ddd; font-weight: bold;'>Sale Discount:</td>
                    <td style='padding: 10px; border: 1px solid #ddd; color: #e53e3e;'>-" . wc_price($total_sale_discount) . "</td>
                </tr>";
            }

            if ($coupon_discount > 0) {
                $order_items_rows .= "<tr>
                    <td colspan='2' style='padding: 10px; border: 1px solid #ddd; font-weight: bold;'>Coupon Savings:</td>
                    <td style='padding: 10px; border: 1px solid #ddd; color: #e53e3e;'>-" . wc_price($coupon_discount) . "</td>
                </tr>";
            }

            // Generate Order Totals Table
            if (method_exists($order, 'get_order_item_totals')) {
                $order_totals = $order->get_order_item_totals();
                if ($order_totals) {
                    foreach ($order_totals as $total) {
                        $order_totals_table .= '<tr>';
                        $order_totals_table .= '<td style="padding: 6px; border: 0; font-weight: bold;">' . $total['label'] . '</td>';
                        $order_totals_table .= '<td style="padding: 6px; border: 0; text-align: right;">' . $total['value'] . '</td>';
                        $order_totals_table .= '</tr>';
                    }
                }
            }
        } elseif ($order_id > 0) {
            // Might be a user ID for registration
            $user = get_userdata($order_id);
            if ($user) {
                $customer_name = $user->display_name;
                $billing_email = $user->user_email;
            }
        }
        // --- PERFORM REPLACEMENTS ---

        // Standard Placeholders
        $replacements = [
            '{{order_id}}' => ($order instanceof \WC_Order) ? $order->get_order_number() : '',
            '{{order_date}}' => $order_date,
            '{{customer_name}}' => $customer_name,
            '{{order_total}}' => $total_order,
            '{{order_url}}' => $order_url,
            '{{header_color}}' => $header_color,
            '{{footer_color}}' => $footer_color,
            '{{font}}' => $font,
            '{{order_items_rows}}' => $order_items_rows,
            '{{order_items}}' => $order_items_rows, // Alias for compatibility

            '{{order_subtotal}}' => $subtotal,
            '{{order_shipping}}' => $order_shipping,
            '{{order_discount}}' => $combined_discount > 0 ? wc_price($combined_discount) : '',
            '{{coupon_discount}}' => $coupon_discount > 0 ? wc_price($coupon_discount) : '',
            '{{sale_discount}}' => $total_sale_discount > 0 ? wc_price($total_sale_discount) : '',
            '{{tax_amount}}' => $tax_amount,
            '{{billing_name}}' => $billing_name,
            '{{billing_address_1}}' => $billing_address_1,
            '{{billing_address_2}}' => $billing_address_2,
            '{{billing_city}}' => $billing_city,
            '{{billing_country}}' => $billing_country,
            '{{billing_phone}}' => $billing_phone,
            '{{billing_phone}}' => $billing_phone,
            '{{billing_email}}' => $billing_email,
            '{{billing_first_name}}' => $billing_first_name,
            '{{billing_last_name}}' => $billing_last_name,
            '{{billing_state}}' => $billing_state,
            '{{billing_postcode}}' => $billing_postcode,
            '{{shipping_name}}' => $shipping_name,
            '{{shipping_address_1}}' => $shipping_address_1,
            '{{shipping_address_2}}' => $shipping_address_2,
            '{{shipping_city}}' => $shipping_city,
            '{{shipping_country}}' => $shipping_country,
            '{{shipping_country}}' => $shipping_country,
            '{{shipping_phone}}' => $shipping_phone,
            '{{shipping_first_name}}' => $shipping_first_name,
            '{{shipping_last_name}}' => $shipping_last_name,
            '{{shipping_state}}' => $shipping_state,
            '{{shipping_postcode}}' => $shipping_postcode,
            '{{contact_url}}' => (isset($contact_url) ? $contact_url : ''),
            '{{payment_method}}' => $payment_method,
            '{{admin_order_url}}' => $admin_order_url,
            '{{store_name}}' => (isset($store_name) ? $store_name : get_bloginfo('name')),
            '{{store_address}}' => (isset($store_address) ? $store_address : ''),
            '{{store_email}}' => (isset($store_email) ? $store_email : get_option('admin_email')),
            '{{store_phone}}' => (isset($store_phone) ? $store_phone : ''),
            '{{store_tagline}}' => (isset($store_tagline) ? $store_tagline : get_bloginfo('description')),
            '{{logo_url}}' => (isset($logo_url) ? $logo_url : ''),
            '{{related_products_title}}' => 'You Might Also Like',
            '{{shop_url}}' => get_home_url(),
            '{{cancellation_date}}' => current_time('Y-m-d'),
            '{{cancellation_reason}}' => ($order instanceof \WC_Order) ? ($order->get_meta('_order_cancellation_reason', true) ?: 'Not specified') : '',
            '{{shipping_method}}' => $shipping_method,
            '{{refund_amount}}' => $refund_amount,
            '{{refund_reason}}' => $refund_reason,
            '{{customer_note}}' => $customer_note,
            '{{order_tracking_url}}' => $order_url, // Standard fallback
            '{{order_totals_table}}' => $order_totals_table,
        ];
        
        // Add shipping email if available (custom field?) or reuse billing
         $replacements['{{shipping_email}}'] = $billing_email;

        // Merge related products replacements and extra replacements
        $replacements = array_merge($replacements, $related_products_data, $extra_replacements);

        // Execute Replacements with Notification Logic
        foreach ($replacements as $placeholder => $value) {
            // We only replace if the placeholder exists in the body to save processing? 
            // str_replace is fast, but we need to check $value for notification.
            // But we only notify if the body *actually contains* the placeholder and the value is missing.
            
            if (strpos($body, $placeholder) !== false) {
                 $replacement_value = $safe_replace($placeholder, $value);
                 $body = str_replace($placeholder, $replacement_value, $body);
            }
        }
        
        // Handling Related Products Placeholders that might NOT have data (e.g. {{product_name_4}} when only 2 exist)
        // We should check for any remaining {{product_...}} placeholders and notify/clear them?
        // The user said: "if any data missed it shows placeholder & notify". 
        // So if {{product_name_4}} is in the body but we didn't have data for it, it wasn't in our $replacements array.
        // We should detect standard related product placeholders.
        
        for ($i=1; $i<=4; $i++) {
            $prefixes = ["{{product_name_$i}}", "{{product_price_$i}}"];
            foreach ($prefixes as $ph) {
                 if (strpos($body, $ph) !== false && !isset($related_products_data[$ph])) {
                      // Found a placeholder but no data was fetched for it
                      error_log("WETC Missing Data Notification: Value for placeholder '{$ph}' is missing (no related product found).");
                      // It remains in body, satisfying "shows placeholder".
                 }
            }
        }

        return $body;
    }



//processing order to admin
  
//processing order to admin
public function processing_order_admin($order_id) {
    $this->send_email_for_type($order_id, 'processing_order_admin', 'New Customer Order - Processing', true);
}


//processing order to customer

//processing order to customer
public function processing_order_email($order_id) {
    $this->send_email_for_type($order_id, 'processing_order_customer', 'Your Order is Processing', false);
}




//Failed Order customer
public function failed_order_email($order_id) {
    $this->send_email_for_type($order_id, 'failed_order_customer', 'Order Failed', false);
}

//Failed Order admin
public function failed_order_email_admin($order_id) {
     $this->send_email_for_type($order_id, 'failed_order_admin', 'Order Failed (Admin)', true);
}


//refunded customer
public function refunded_order_email($order_id, $refund_id = null) {
    $extra = [];
    if ($refund_id) {
        $refund = wc_get_refund($refund_id);
        if ($refund) {
            $extra = [
                '{{refund_amount}}' => wc_price($refund->get_amount()),
                '{{refund_reason}}' => $refund->get_reason() ?: 'Not specified'
            ];
        }
    }
    $this->send_email_for_type($order_id, 'refunded_order_customer', 'Order Refunded', false, $extra);
    
    // Also trigger admin email from here to ensure it uses the same data
    $this->refunded_order_email_admin($order_id, $refund_id);
}

//refunded customer admin
public function refunded_order_email_admin($order_id, $refund_id = null) {
    static $last_refund_sent = null;
    if ($last_refund_sent === $refund_id && $refund_id !== null) return;
    $last_refund_sent = $refund_id;

    $extra = [];
    if ($refund_id) {
        $refund = wc_get_refund($refund_id);
        if ($refund) {
            $extra = [
                '{{refund_amount}}' => wc_price($refund->get_amount()),
                '{{refund_reason}}' => $refund->get_reason() ?: 'Not specified'
            ];
        }
    }
    $this->send_email_for_type($order_id, 'refunded_order_admin', 'Order Refunded (Admin)', true, $extra);
}

//cancelled_order
public function cancelled_order_email($order_id) {
    $this->send_email_for_type($order_id, 'cancelled_order_customer', 'Order Cancelled', false);
}
//cancelled_order_admin - was missing in view but likely exists or should exist
public function cancelled_order_email_admin($order_id) {
    $this->send_email_for_type($order_id, 'cancelled_order_admin', 'Order Cancelled (Admin)', true);
}


// Cancelled Order Admin Email
//On Hold
public function on_hold_order_email($order_id) {
    $this->send_email_for_type($order_id, 'on_hold_order', 'Order On Hold', false);
}

//Completed Order Template

public function completed_order_email($order_id) {
    $this->send_email_for_type($order_id, 'completed_order_customer', 'Your Order is Complete', false);
}

//new order admin email

public function new_order_admin_email($order_id) {
    $this->send_email_for_type($order_id, 'new_order_admin', 'New Customer Order', true);
}


//abandoned_cart_email 

public function abandoned_cart_email($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) {
        error_log("Invalid order ID: $order_id");
        return;
    }
    $cart_url = wc_get_cart_url(); // Use WC function for cart URL
    $extra_replacements = [
        '{{cart_url}}' => esc_url($cart_url),
    ];
    
    $this->send_email_for_type($order_id, 'abandoned_cart', 'You left something in your cart', false, $extra_replacements);
}

//new_user_registration_email customer

//new_user_registration_email customer
public function new_user_registration_email($order_id) {
    $this->send_email_for_type($order_id, 'new_user_registration', 'Welcome to the store!', false);
}

//new user reg admin

//new user reg admin
public function new_user_registration_email_admin($order_id) {
    $this->send_email_for_type($order_id, 'new_user_registration_admin', 'New User Registered', true);
}

////////////////////////////////////////////change///////////////////////////////////////////////////////////

//change
public function customer_note_email($args) {
    if (isset($args['order_id']) && isset($args['customer_note'])) {
        $extra = ['{{customer_note}}' => $args['customer_note']];
        $this->send_email_for_type($args['order_id'], 'customer_note', 'Note Added to Your Order', false, $extra);
    }
}

public function customer_invoice_email($order) {
    $order_id = ($order instanceof \WC_Order) ? $order->get_id() : $order;
    $this->send_email_for_type($order_id, 'customer_invoice', 'Invoice for Your Order', false);
}


//reset password for customer


public function reset_password_email($message, $key, $user_login, $user_data) {
    // For password reset, we don't have an order ID. 
    // We pass 0 and provide user-specific placeholders.
    $extra_replacements = [
        '{{user_login}}' => $user_login,
        '{{reset_link}}' => esc_url(network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login')),
    ];

    $body = $this->send_email_for_type(0, 'reset_password', 'Password Reset Request', false, $extra_replacements);
    
    // Return original message if our body is empty/template not found
    return !empty($body) ? $body : $message;
}

//reset password admin

public function reset_password_email_admin($message, $key, $user_login, $user_data) {
    $extra_replacements = [
        '{{user_login}}' => $user_login,
    ];
    $this->send_email_for_type(0, 'admin_password_reset', 'Password Reset Request (Admin)', true, $extra_replacements);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

public function custom_email_open_tracker() {

    if (isset($_GET['email-tracker']) && $_GET['email-tracker'] == '1' && isset($_GET['order_id'])) {
        global $wpdb;

        error_log("custom email tracker called");
        $order_id = intval($_GET['order_id']);

        $order = wc_get_order($order_id);
        if (!$order) {
            error_log("Invalid order ID passed to tracker: $order_id");
            exit;
        }
                                           
        $table_templates = $wpdb->prefix . 'wetc_email_templates';
        $table_analytics = $wpdb->prefix . 'woo_email_analytics';

        $template_id = isset($_GET['template_id']) ? sanitize_text_field(urldecode($_GET['template_id'])) : '';
        if (empty($template_id)) {
            error_log("No template name provided in tracker URL.");
            exit;
        }
        // $template = $wpdb->get_row("SELECT id FROM $table_templates WHERE template_name = 'Completed Order Customer Template'");
      //  $template_id = $template ? intval($template->id) : 0;                              
        error_log("Template ID resolved: $template_id");


        if ($template_id > 0) { 
            $date = current_time('Y-m-d');
            $existing = $wpdb->get_row($wpdb->prepare(
                "SELECT * FROM $table_analytics WHERE template_id = %d AND date_recorded = %s",
                $template_id, $date
            ));

            if ($existing) {
                $wpdb->update(
                    $table_analytics,
                    ['emails_opened' => $existing->emails_opened + 1],
                    ['id' => $existing->id]
                );
                error_log("📬 Email opened for order ID $order_id, updated analytics.");
            } else {
                $wpdb->insert(
                    $table_analytics,
                    [
                        'template_id'     => $template_id,
                        'emails_opened'   => 1,
                        'emails_sent'     => 0,
                        'date_recorded'   => $date
                    ]
                );
                error_log("📬 Email opened for order ID $order_id, new analytics row created.");
            }
        }

    // Output 1x1 
        header('Content-Type: image/gif');
        echo base64_decode("R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=");
        exit;
    }
}


    public function custom_email_click_tracker() {
    if (isset($_GET['email-click']) && $_GET['email-click'] == '1' && isset($_GET['template_id']) && isset($_GET['order_id']) && isset($_GET['redirect_to'])) {
        global $wpdb;

        $template_id = intval($_GET['template_id']);
        $order_id = intval($_GET['order_id']);
        $redirect_to = esc_url_raw($_GET['redirect_to']);
        $date = current_time('Y-m-d');

        $table_analytics = $wpdb->prefix . 'woo_email_analytics';

        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_analytics WHERE template_id = %d AND date_recorded = %s",
            $template_id, $date
        ));

        if ($existing) {    
            $wpdb->update(
                $table_analytics,
                ['emails_clicked' => $existing->emails_clicked + 1],
                ['id' => $existing->id]
            );
            error_log("📎 Email link clicked for order ID $order_id, updated click count.");
        } else {
            $wpdb->insert(
                $table_analytics,
                [
                    'template_id'     => $template_id,
                    'emails_opened'   => 0,
                    'emails_sent'     => 0,
                    'emails_clicked'  => 1,
                    'date_recorded'   => $date
                ]
            );
            error_log("📎 Email link clicked for order ID $order_id, new click analytics row created.");
        }

        wp_redirect($redirect_to);
        exit;
    }
}

    public function handle_resend_notification($order, $email_id) {
        $order_id = $order->get_id();
        error_log("WETC Hook: handle_resend_notification triggered for #$order_id (Email: $email_id)");
        
        switch ($email_id) {
            case 'new_order':
                $this->new_order_admin_email($order_id);
                break;
            case 'customer_processing_order':
                $this->processing_order_email($order_id);
                break;
            case 'customer_completed_order':
                $this->completed_order_email($order_id);
                break;
            case 'customer_refunded_order':
                $this->refunded_order_email($order_id);
                break;
            case 'customer_invoice':
                $this->customer_invoice_email($order_id);
                break;
        }
    }
}



WETC_Email_Handler::get_instance();


?>