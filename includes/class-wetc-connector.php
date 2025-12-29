<?php

namespace SmackCoders\WETC;

if (!defined('ABSPATH')) {
    die;
}

if (!class_exists('WP_List_Table')) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

require_once SMACK_WETC_PLUGIN_PATH . 'includes/class-wetc-manager.php';

class WETC_Connector {
    const MENU_SLUG = 'email-customizer-add-new';

    private static $instance = null;
    public function __construct() {
        add_action('admin_menu', [$this, 'add_posts_menu_items']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('init', [$this, 'create_order_details_table']);
        add_action('woocommerce_checkout_create_order', [$this, 'save_order_details_to_db'], 10, 2);
        add_action('wp_ajax_get_email_template_json', [$this, 'get_email_template_json_callback']);
        add_action('wp_ajax_get_email_template_names', [$this, 'get_email_template_names_callback']);
        add_action('wp_ajax_save_email_template', [$this, 'save_email_template_callback']);
        add_action('wp_ajax_send_test_email', [$this, 'send_test_email_callback']);
    }

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function create_order_details_table() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'woo_order_details';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS $table_name (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            order_id BIGINT(20) UNSIGNED NOT NULL,
            order_items LONGTEXT NOT NULL,
            billing_address LONGTEXT NOT NULL,  
            shipping_address LONGTEXT NOT NULL,
            date_created DATETIME NOT NULL,
            template_id BIGINT(20) UNSIGNED DEFAULT 0,
            PRIMARY KEY (id),
            KEY order_id (order_id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    public function save_order_details_to_db($order, $data) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'woo_order_details';

        $order_items = [];
        foreach ($order->get_items() as $item_id => $item) {
            $product = $item->get_product();
            $order_items[] = [
                'product_id' => $item->get_product_id(),
                'name' => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'subtotal' => $item->get_subtotal(),
                'total' => $item->get_total(),
            ];
        }

        $billing_address = [
            'first_name' => $order->get_billing_first_name(),
            'last_name' => $order->get_billing_last_name(),
            'company' => $order->get_billing_company(),
            'address_1' => $order->get_billing_address_1(),
            'address_2' => $order->get_billing_address_2(),
            'city' => $order->get_billing_city(),
            'state' => $order->get_billing_state(),
            'postcode' => $order->get_billing_postcode(),
            'country' => $order->get_billing_country(),
            'email' => $order->get_billing_email(),
            'phone' => $order->get_billing_phone(),
        ];

        $shipping_address = [
            'first_name' => $order->get_shipping_first_name(),
            'last_name' => $order->get_shipping_last_name(),
            'company' => $order->get_shipping_company(),
            'address_1' => $order->get_shipping_address_1(),
            'address_2' => $order->get_shipping_address_2(),
            'city' => $order->get_shipping_city(),
            'state' => $order->get_shipping_state(),
            'postcode' => $order->get_shipping_postcode(),
            'country' => $order->get_shipping_country(),
        ];

        $result = $wpdb->insert(
            $table_name,
            [
                'order_id' => $order->get_id(),
                'order_items' => wp_json_encode($order_items),
                'billing_address' => wp_json_encode($billing_address),
                'shipping_address' => wp_json_encode($shipping_address),
                'date_created' => current_time('mysql'),
                'template_id' => 0,
            ],
            ['%d', '%s', '%s', '%s', '%s', '%d']
        );

        if (false === $result) {
            error_log('WETC_Connector: Failed to insert order details for order ID ' . $order->get_id());
        }
    }

    public function enqueue_assets($hook_suffix) {
        error_log('WETC DEBUG: hook_suffix = ' . $hook_suffix);
        // Only load assets on the email customizer list or add/edit pages
        // Relaxed check to ensure it catches the correct page hooks regardless of parent slug prefix
        if (strpos($hook_suffix, 'posts_list_table') === false && strpos($hook_suffix, self::MENU_SLUG) === false) {
            return;
        }

        // Enqueue WordPress media library scripts
        wp_enqueue_media();

        // Load CKEditor from CDN to solve bundling duplication issues
        if (strpos($hook_suffix, self::MENU_SLUG) !== false) {
            wp_enqueue_script(
                'ckeditor-cdn',
                'https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js',
                [],
                '41.4.2',
                false
            );
        }

        // Enqueue email template fetcher script
        wp_enqueue_script(
            'email-template-fetcher',
            SMACK_WETC_PLUGIN_URL . 'assets/js/email-template-fetcher.js',
            ['jquery'],
            '1.0',
            true
        );

        wp_localize_script(
            'email-template-fetcher',
            'emailTemplateAjax',
            [
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce'    => wp_create_nonce('get_email_template_names_nonce'),
                'admin_email' => get_option('admin_email'), // Pass admin email to frontend
                'plugin_url' => SMACK_WETC_PLUGIN_URL // Pass plugin URL for local assets
            ]
        );

        // Enqueue AJAX script for handling template JSON retrieval
        wp_enqueue_script(
            'email-customizer-ajax',
            SMACK_WETC_PLUGIN_URL . 'assets/js/email-customizer-ajax.js',
            ['jquery'],
            '1.0.0',
            true
        );

        wp_localize_script(
            'email-customizer-ajax',
            'emailCustomizerAjax',
            [
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('get_template_json_nonce')
            ]
        );

        // Load React app assets (development or production)
        /* // Development: Load from React dev server
        wp_enqueue_script(
            'react-email-customizer-app',
            'http://localhost:3000/static/js/bundle.js',
            [],
            null,
            true
        );
        wp_enqueue_style(
            'react-email-customizer-style',
            'http://localhost:3000/static/css/main.css',
            [],
            null
        );  */
         
        // Load React app assets ONLY on the Add New / Edit page
        if (strpos($hook_suffix, self::MENU_SLUG) !== false) {
            // Production: Load from build directory with caching
            $build_path = SMACK_WETC_PLUGIN_PATH . 'react-build/';
            $build_url = SMACK_WETC_PLUGIN_URL . 'react-build/';

            // Get asset files directly
            $css_files = glob($build_path . 'static/css/*.css') ?: [];
            $js_files = glob($build_path . 'static/js/*.js') ?: [];

            // Sort by modification time to ensure we get the latest
            usort($css_files, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });
            usort($js_files, function($a, $b) {
                return filemtime($b) - filemtime($a);
            });

            // Enqueue only the LATEST CSS file
            if (!empty($css_files)) {
                $css_file = $css_files[0];
                $file_name = basename($css_file);
                wp_enqueue_style(
                    'react-email-customizer-css-main',
                    $build_url . 'static/css/' . $file_name,
                    [],
                    filemtime($css_file)
                );
            }

            // Enqueue main JS entry point
            $main_js_handle = '';
            foreach ($js_files as $js_file) {
                $file_name = basename($js_file);
                if (strpos($file_name, 'main.') === 0) {
                    $handle = 'react-email-customizer-js-main';
                    $deps = ['email-customizer-ajax', 'email-template-fetcher'];
                    $main_js_handle = $handle;
                    
                    wp_enqueue_script(
                        $handle,
                        $build_url . 'static/js/' . $file_name,
                        $deps,
                        filemtime($js_file),
                        true
                    );
                    
                    wp_localize_script(
                        $handle,
                        'emailCustomizerAjax',
                        [
                            'ajax_url' => admin_url('admin-ajax.php'),
                            'nonce' => wp_create_nonce('get_template_json_nonce')
                        ]
                    );
                    break; // Only load the latest main
                }
            }
        }

        wp_enqueue_style(
            'wetc-mail-style',
            SMACK_WETC_PLUGIN_URL . 'assets/css/style.css',
            [],
            '1.0.0'
        );
    }

    public function add_posts_menu_items() {
        add_menu_page(
            __('Smack Mails', 'wp-posts-list'),
            __('Smack Mails', 'wp-posts-list'),
            'edit_posts',
            'posts_list_table',
            [$this, 'posts_list_init'],
            'dashicons-email-alt',
            1
        );

        add_submenu_page(
            'posts_list_table',
            __('Add New', 'wp-posts-list'),
            '',
            'manage_options',
            self::MENU_SLUG,
            [$this, 'submenu_add_new_page']
        );
    }

    public function submenu_add_new_page() {
        ?>
        <style>
            /* Remove bottom space from WordPress admin wrappers */
            #wpbody-content {
                padding-bottom: 0 !important;
                float: none !important;
            }
            #wpbody {
                padding-bottom: 0 !important;
            }
            #wpcontent {
                padding-bottom: 0 !important;
                padding-left: 0 !important;
            }
            #wpfooter {
                display: none !important;
            }
            /* Make root container fill available space using absolute positioning */
            #root {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0 !important;
                padding: 0 !important;
                background: #fff;
                overflow: hidden;
            }
            .auto-fold #wpcontent {
                padding-left: 0 !important;
            }
        </style>
        <div id="root"></div>
        <?php
    }

    public function posts_list_init() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        $email_templates = $wpdb->get_results("SELECT * FROM $table_name");
        echo '<div class="wrap">';
        echo '<h2>Email Customizer';
        
        echo '<a href="' . esc_url(admin_url('admin.php?page=email-customizer-add-new')) . '" class="page-title-action">Add New</a>';
        echo '<form id="importForm" method="post" action="' . esc_url(admin_url('admin-post.php?action=sm_mail_customizer_import_template')) . '" enctype="multipart/form-data" style="display:inline;">';
        echo '<input type="file" name="import_file" id="importFileInput" style="display: none;" onchange="document.getElementById(\'importForm\').submit();" required>';
        wp_nonce_field('import_template_nonce', '_wpnonce');
        echo '<a href="javascript:void(0);" class="page-title-action" onclick="document.getElementById(\'importFileInput\').click();">Import</a>';
        echo '</form>';
        echo '</h2>';
        
        // Add inline CSS to remove bottom space
        ?>
        <style>
            /* Remove bottom space from WordPress admin wrappers */
            #wpbody-content {
                padding-bottom: 0 !important;
            }
            #wpbody {
                padding-bottom: 0 !important;
            }
            #wpcontent {
                padding-bottom: 0 !important;
            }
            #wpfooter {
                display: none !important;
            .wrap {
                height: calc(100vh - 32px);
                overflow-y: auto;
            }
        </style>
        <?php

        ?>
        <div class="wc_emails_wrapper">
            <h3><?php _e('Custom Email Templates', 'woocommerce'); ?></h3>
            <p><?php _e('Custom email templates are listed below. Click on a template to configure it.', 'woocommerce'); ?></p>
            <table class="wc_emails widefat" cellspacing="0">
                <thead>
                    <tr>
                        <?php
                        $columns = apply_filters('woocommerce_email_setting_columns', [
                            'email_template_name' => __('Email Template', 'woocommerce'),
                            'content_type' => __('Content Type', 'woocommerce'),
                            'recipient' => __('Recipient(s)', 'woocommerce'),
                            'actions' => __('Actions', 'woocommerce')
                        ]);
                        foreach ($columns as $key => $column) {
                            echo '<th class="wc-email-settings-table-' . esc_attr($key) . '">' . esc_html($column) . '</th>';
                        }
                        ?>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    if ($email_templates) {
                        foreach ($email_templates as $email) {
                            echo '<tr>';
                            foreach ($columns as $key => $column) {
                                switch ($key) {
                                    case 'email_template_name':
                                        echo '<td class="wc-email-settings-table-' . esc_attr($key) . '">';
                                        echo '<a href="' . esc_url(admin_url('admin.php?page=email-customizer-add-new&id=' . absint($email->id))) . '">' . esc_html($email->email_template_name) . '</a>';
                                        echo '</td>';
                                        break;
                                    case 'content_type':
                                        echo '<td class="wc-email-settings-table-' . esc_attr($key) . '">';
                                        echo esc_html($email->content_type);
                                        echo '</td>';
                                        break;
                                    case 'recipient':
                                        echo '<td class="wc-email-settings-table-' . esc_attr($key) . '">';
                                        echo esc_html($email->recipient);
                                        echo '</td>';
                                        break;
                                    case 'actions':
                                        echo '<td class="wc-email-settings-table-' . esc_attr($key) . '">';
                                        echo '<a class="button" data-template-id="' . absint($email->id) . '" href="' . esc_url(admin_url('admin.php?page=email-customizer-add-new&id=' . absint($email->id))) . '">' . esc_html__('Manage', 'woocommerce') . '</a>';
                                        echo '</td>';
                                        break;
                                }
                            }
                            echo '</tr>';
                        }
                    } else {
                        echo '<tr><td colspan="' . count($columns) . '">' . esc_html__('No email templates found.', 'woocommerce') . '</td></tr>';
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <?php

        echo '</div>';
        // echo '<ul id="email-template-list"></ul>';

    }

    public function get_email_template_json_callback() {
        // Check nonce for security
        if (!check_ajax_referer('get_template_json_nonce', '_ajax_nonce', false)) {
            error_log('WETC_Connector: Invalid nonce in get_email_template_json_callback');
            wp_send_json_error(['message' => 'Invalid nonce']);
            wp_die();
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        $template_id = isset($_POST['template_id']) ? absint($_POST['template_id']) : 0;

        if ($template_id <= 0) {
            error_log('WETC_Connector: Invalid template ID: ' . $template_id);
            wp_send_json_error(['message' => 'Invalid template ID']);
        }

        $email_template = $wpdb->get_row(
            $wpdb->prepare("SELECT json_data FROM $table_name WHERE id = %d", $template_id)
        );

        if ($email_template && !empty($email_template->json_data)) {
            // Validate JSON before sending
            $decoded = json_decode($email_template->json_data);
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log('WETC_Connector: Stored JSON is invalid for template ID ' . $template_id . ': ' . json_last_error_msg());
                error_log('WETC_Connector: JSON data (first 500 chars): ' . substr($email_template->json_data, 0, 500));
                wp_send_json_error(['message' => 'Stored template data is corrupted: ' . json_last_error_msg()]);
            } else {
                wp_send_json_success(['json_data' => $email_template->json_data]);
            }
        } else {
            error_log('WETC_Connector: No JSON data found for template ID: ' . $template_id);
            wp_send_json_error(['message' => 'No JSON data found for this template']);
        }
    }
    public function get_email_template_names_callback() {
        // Security check
        if (!check_ajax_referer('get_email_template_names_nonce', '_ajax_nonce', false)) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            wp_die();
        }

        // Try to get cached template list
        $cache_key = 'wetc_template_names_list_v2';
        $cached_templates = get_transient($cache_key);

        if (false !== $cached_templates) {
            wp_send_json_success(['templates' => $cached_templates]);
            return;
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';

        // Check if priority column exists (handles cases where migration hasn't run)
        $column_check = $wpdb->get_results("SHOW COLUMNS FROM {$table_name} LIKE 'priority'");
        $has_priority = !empty($column_check);

        // Include json_data - frontend needs it for template loading
        // Performance is still optimized via caching
        $fields = "id, email_template_name, json_data" . ($has_priority ? ", priority" : "");
        $results = $wpdb->get_results(
            "SELECT {$fields} FROM {$table_name}",
            ARRAY_A
        );

        if (!empty($results)) {
            // Cache for 5 minutes
            set_transient($cache_key, $results, 5 * MINUTE_IN_SECONDS);
            wp_send_json_success(['templates' => $results]);
        } else {
            wp_send_json_error(['message' => 'No templates found']);
        }
    }

    public function save_email_template_callback() {
        // Security check
        if (!check_ajax_referer('get_email_template_names_nonce', '_ajax_nonce', false)) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            wp_die();
        }

        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';

        $template_name = isset($_POST['template_name']) ? sanitize_text_field($_POST['template_name']) : '';
        $subject = isset($_POST['subject']) ? sanitize_text_field($_POST['subject']) : '';
        $json_data = isset($_POST['json_data']) ? wp_unslash($_POST['json_data']) : '';
        $html_content = isset($_POST['html_content']) ? wp_unslash($_POST['html_content']) : '';
        $template_id = isset($_POST['template_id']) ? absint($_POST['template_id']) : 0;
        $content_type = isset($_POST['content_type']) ? sanitize_text_field($_POST['content_type']) : 'JSON';
        $recipient = isset($_POST['recipient']) ? sanitize_text_field($_POST['recipient']) : '';
        $priority = isset($_POST['priority']) ? intval($_POST['priority']) : 0;

        // FIX: If content_type appears to be a label (e.g. "New Order (Admin)"), clear it
        // so the logic below can correctly deduce the slug (e.g. "new_order_admin").
        if (!empty($content_type) && strpos($content_type, ' ') !== false) {
             $content_type = ''; 
        }

        if (empty($template_name)) {
            wp_send_json_error(['message' => 'Template name is required']);
            wp_die();
        }

        if (empty($json_data)) {
            wp_send_json_error(['message' => 'Template content is required']);
            wp_die();
        }

        // Validate JSON before saving
        $decoded = json_decode($json_data);
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('WETC_Connector: Invalid JSON data: ' . json_last_error_msg());
            error_log('WETC_Connector: JSON data (first 500 chars): ' . substr($json_data, 0, 500));
            wp_send_json_error(['message' => 'Invalid JSON data: ' . json_last_error_msg()]);
            wp_die();
        }

        // --- BACKEND FAILSAFE: Map Template Name to Content Type if it's generic 'JSON' ---
        if ($content_type === 'JSON' || empty($content_type)) {
            $lower_name = strtolower($template_name);
            if (strpos($lower_name, 'new order') !== false && strpos($lower_name, 'admin') !== false) {
                $content_type = 'new_order_admin';
            } elseif (strpos($lower_name, 'cancelled') !== false && strpos($lower_name, 'admin') !== false) {
                $content_type = 'cancelled_order_admin';
            } elseif (strpos($lower_name, 'cancelled') !== false && strpos($lower_name, 'customer') !== false) {
                $content_type = 'cancelled_order_customer';
            } elseif (strpos($lower_name, 'failed') !== false && strpos($lower_name, 'admin') !== false) {
                $content_type = 'failed_order_admin';
            } elseif (strpos($lower_name, 'failed') !== false && strpos($lower_name, 'customer') !== false) {
                $content_type = 'failed_order_customer';
            } elseif (strpos($lower_name, 'processing') !== false && strpos($lower_name, 'admin') !== false) {
                $content_type = 'processing_order_admin';
            } elseif (strpos($lower_name, 'processing') !== false && strpos($lower_name, 'customer') !== false) {
                $content_type = 'processing_order_customer';
            } elseif (strpos($lower_name, 'completed') !== false) {
                $content_type = 'completed_order_customer';
            } elseif (strpos($lower_name, 'refunded') !== false && strpos($lower_name, 'admin') !== false) {
                $content_type = 'refunded_order_admin';
            } elseif (strpos($lower_name, 'refunded') !== false && strpos($lower_name, 'customer') !== false) {
                $content_type = 'refunded_order_customer';
            } elseif (strpos($lower_name, 'on-hold') !== false || strpos($lower_name, 'on hold') !== false) {
                $content_type = 'on_hold_order';
            } elseif (strpos($lower_name, 'note') !== false) {
                $content_type = 'customer_note';
            } elseif (strpos($lower_name, 'invoice') !== false) {
                $content_type = 'customer_invoice';
            } elseif (strpos($lower_name, 'abandoned') !== false) {
                $content_type = 'abandoned_cart';
            } elseif (strpos($lower_name, 'registration') !== false || strpos($lower_name, 'new account') !== false) {
                if (strpos($lower_name, 'admin') !== false) {
                    $content_type = 'new_user_registration_admin';
                } else {
                    $content_type = 'new_user_registration';
                }
            }
        }



        // Check if priority column exists, if not try to add it
        $column_check = $wpdb->get_results("SHOW COLUMNS FROM {$table_name} LIKE 'priority'");
        $has_priority = !empty($column_check);
        
        if (!$has_priority) {
            $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN priority INT(11) DEFAULT 0");
            // Re-check
            $column_check = $wpdb->get_results("SHOW COLUMNS FROM {$table_name} LIKE 'priority'");
            $has_priority = !empty($column_check);
        }

        // Prepare data array - include html_content if it exists
        $data = [
            'email_template_name' => $template_name,
            'subject' => $subject,
            'json_data' => $json_data,
            'content_type' => $content_type,
            'recipient' => $recipient
        ];
        
        $formats = ['%s', '%s', '%s', '%s', '%s'];

        if ($has_priority) {
            $data['priority'] = $priority;
            $formats[] = '%d';
        }
        
        // Add html_content if provided
        if (!empty($html_content)) {
            $data['html_content'] = $html_content;
            $formats[] = '%s';
        }

        // Check if updating existing template or creating new one
        if ($template_id > 0) {
            // Update existing template
            $result = $wpdb->update(
                $table_name,
                $data,
                ['id' => $template_id],
                $formats,
                ['%d']
            );

            if ($result !== false) {
                // Clear template list cache after update
                delete_transient('wetc_template_names_list_v2');
                wp_send_json_success([
                    'message' => 'Template updated successfully',
                    'template_id' => $template_id
                ]);
            } else {
                wp_send_json_error(['message' => 'Failed to update template']);
            }
        } else {
            // Insert new template
            $result = $wpdb->insert(
                $table_name,
                $data,
                $formats
            );

            if ($result !== false) {
                // Clear template list cache after insert
                delete_transient('wetc_template_names_list_v2');
                wp_send_json_success([
                    'message' => 'Template saved successfully',
                    'template_id' => $wpdb->insert_id
                ]);
            } else {
                wp_send_json_error(['message' => 'Failed to save template']);
            }
        }
    }

    public function send_test_email_callback() {
        if (!check_ajax_referer('get_email_template_names_nonce', '_ajax_nonce', false)) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            wp_die();
        }

        $to_email = isset($_POST['to_email']) ? sanitize_email($_POST['to_email']) : '';
        $html_content = isset($_POST['html_content']) ? wp_unslash($_POST['html_content']) : '';

        if (!is_email($to_email)) {
            wp_send_json_error(['message' => 'Invalid email address']);
            wp_die();
        }

        if (empty($html_content)) {
            wp_send_json_error(['message' => 'Email content is empty']);
            wp_die();
        }

        // Decode HTML entities to ensure proper rendering in email clients
        $html_content = html_entity_decode($html_content, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Fetch latest order for placeholder replacement
        $args = array(
            'limit' => 1,
            'orderby' => 'date',
            'order' => 'DESC',
            'return' => 'ids',
        );
        $orders = wc_get_orders($args);
        $order_id = !empty($orders) ? $orders[0] : 0;
        $order = $order_id ? wc_get_order($order_id) : false;

        if ($order) {
            // Use default/dummy values for styles if not provided
            $header_color = '#F44336';
            $footer_color = '#333333';
            $font = 'Poppins';
            
            // Call the helper to replace placeholders
            // Ensure WETC_Email_Handler is loaded
            if (class_exists('SmackCoders\\WETC\\WETC_Email_Handler')) {
                $html_content = WETC_Email_Handler::replace_email_placeholders($html_content, $order_id, $order, $header_color, $footer_color, $font);
            }
        } else {
            // Optional: Append a note if no orders exist to populate data
             $html_content .= '<br><br><small style="color:red;">Note: No WooCommerce orders found. Placeholders could not be replaced with real data.</small>';
        }

        $subject = 'Test Email Template - ' . get_bloginfo('name');
        $headers = array('Content-Type: text/html; charset=UTF-8');

        $sent = wp_mail($to_email, $subject, $html_content, $headers);

        if ($sent) {
            wp_send_json_success(['message' => 'Email sent successfully']);
        } else {
            wp_send_json_error(['message' => 'Failed to send email. Check your mail server settings.']);
        }
        wp_die();
    }
}

WETC_Connector::get_instance();
?>