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

        // Handle List Table Actions
        add_action('admin_post_wetc_trash_template', [$this, 'handle_trash_template']);
        add_action('admin_post_wetc_restore_template', [$this, 'handle_restore_template']);
        add_action('admin_post_wetc_delete_template', [$this, 'handle_delete_template']);
        add_action('admin_post_wetc_duplicate_template', [$this, 'handle_duplicate_template']);

        add_filter('set-screen-option', [__CLASS__, 'set_screen_option'], 10, 3);
    }

    public function handle_trash_template() {
        $this->handle_template_status_change('trash');
    }

    public function handle_restore_template() {
        $this->handle_template_status_change('publish');
    }

    private function handle_template_status_change($new_status) {
        if (!isset($_GET['id'])) wp_die('No ID provided');
        $id = intval($_GET['id']);
        
        // Use either specific nonce or generic one based on context, but match creation
        check_admin_referer('wetc_' . ($new_status == 'trash' ? 'trash' : 'restore') . '_template_' . $id);

        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        $wpdb->update($table_name, ['status' => $new_status], ['id' => $id]);

        wp_redirect(remove_query_arg(['action', 'id', '_wpnonce'], wp_get_referer()));
        exit;
    }

    public function handle_delete_template() {
        if (!isset($_GET['id'])) wp_die('No ID provided');
        $id = intval($_GET['id']);
        check_admin_referer('wetc_delete_template_' . $id);

        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        $wpdb->delete($table_name, ['id' => $id]);

        wp_redirect(remove_query_arg(['action', 'id', '_wpnonce'], wp_get_referer()));
        exit;
    }

    public function handle_duplicate_template() {
        if (!isset($_GET['id'])) wp_die('No ID provided');
        $id = intval($_GET['id']);
        check_admin_referer('wetc_duplicate_template_' . $id);

        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        $original = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $id), ARRAY_A);

        if ($original) {
            unset($original['id']);
            $original['email_template_name'] .= ' (Copy)';
            $wpdb->insert($table_name, $original);
        }

        wp_redirect(remove_query_arg(['action', 'id', '_wpnonce'], wp_get_referer()));
        exit;
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
        $hook = add_menu_page(
            __('Smack Mails', 'wp-posts-list'),
            __('Smack Mails', 'wp-posts-list'),
            'edit_posts',
            'posts_list_table',
            [$this, 'posts_list_init'],
            'dashicons-email-alt',
            1
        );

        add_action("load-$hook", [$this, 'init_screen_options']);

        add_submenu_page(
            'posts_list_table',
            __('Add New', 'wp-posts-list'),
            __('Add New', 'woocommerce'),
            'manage_options',
            self::MENU_SLUG,
            [$this, 'submenu_add_new_page']
        );
    }

    public function init_screen_options() {
        $option = 'per_page';
        $args = [
            'label'   => __('Email Templates per page', 'woocommerce'),
            'default' => 20,
            'option'  => 'wetc_templates_per_page'
        ];
        add_screen_option($option, $args);
        
        // Ensure the class is loaded for column headers logic if needed
        $this->list_table = new Posts_List_Table();
        
        $screen = get_current_screen();
        if ($screen) {
            // Force reset hidden columns preference so they are always checked by default
            // Using update_user_option to explicitly set it to 'empty' (nothing hidden)
            update_user_option(get_current_user_id(), "manage{$screen->id}columnshidden", []);
            
            add_filter("manage_{$screen->id}_columns", [$this, 'get_screen_columns']);
            add_filter("default_hidden_columns", [$this, 'get_default_hidden_columns'], 10, 2);
        }
    }

    public function get_screen_columns($columns) {
        // Remove columns we don't want in Screen Options checkboxes
        if (isset($columns['email_template_name'])) {
            unset($columns['email_template_name']);
        }
        if (isset($columns['cb'])) {
            unset($columns['cb']);
        }
        return $columns;
    }

    public function get_default_hidden_columns($hidden, $screen) {
        // Default to showing all columns (return empty array of hidden items)
        return [];
    }
    
    // Filter to handle saving screen options
    public static function set_screen_option($status, $option, $value) {
        if ('wetc_templates_per_page' === $option) {
            return $value;
        }
        return $status;
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
        $list_table = new Posts_List_Table();
        $list_table->prepare_items();
        
        echo '<div class="wrap">';
        echo '<h1 class="wp-heading-inline">' . __('Email Templates', 'woocommerce') . '</h1>';
        echo '<a href="' . esc_url(admin_url('admin.php?page=email-customizer-add-new')) . '" class="page-title-action">Add New</a>';
        
        // Import Button and Logic
        echo '<button id="wetc-import-btn" class="page-title-action">Import</button>';
        echo '<input type="file" id="wetc-import-file" accept=".json" style="display:none;" />';
        ?>
        <script type="text/javascript">
            jQuery(document).ready(function($) {
                $('#wetc-import-btn').on('click', function(e) {
                    e.preventDefault();
                    $('#wetc-import-file').click();
                });

                $('#wetc-import-file').on('change', function(e) {
                    var file = e.target.files[0];
                    if (!file) return;

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            var jsonContent = e.target.result;
                            var parsedTest = JSON.parse(jsonContent); // Validate JSON

                            // EXTRACT BLOCKS: The app expects json_data to be the blocks array, 
                            // but exportToJSON saves an object with metadata.
                            var jsonToSend = jsonContent;
                            if (parsedTest && parsedTest.blocks && Array.isArray(parsedTest.blocks)) {
                                jsonToSend = JSON.stringify(parsedTest.blocks);
                            }

                            // Prepare data for saving
                            var data = {
                                action: 'save_email_template',
                                _ajax_nonce: '<?php echo wp_create_nonce('get_email_template_names_nonce'); ?>',
                                template_name: file.name.replace('.json', '') + ' (Imported)',
                                json_data: jsonToSend,
                                content_type: 'JSON' // Default type, backend will try to deduce
                            };

                            // Use existing AJAX save mechanism
                            $.post(ajaxurl, data, function(response) {
                                if (response.success) {
                                    alert('Template imported successfully!');
                                    location.reload();
                                } else {
                                    alert('Error importing template: ' + (response.data.message || 'Unknown error'));
                                }
                            });

                        } catch (err) {
                            alert('Invalid JSON file');
                            console.error(err);
                        }
                    };
                    reader.readAsText(file);
                    // Reset input so same file can be selected again if needed
                    this.value = '';
                });
            });
        </script>
        <?php
        echo '<hr class="wp-header-end">';
        
        // Output search box
        echo '<form method="get">';
        echo '<input type="hidden" name="page" value="' . esc_attr($_REQUEST['page']) . '" />';
        $list_table->views(); // Display status views (All | Published | Trash)
        $list_table->search_box('search', 'search_id');
        $list_table->display();
        echo '</form>';
        echo '</div>';
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
        $cache_key = 'wetc_template_names_list_v3';
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
        $fields = "id, email_template_name, json_data, content_type" . ($has_priority ? ", priority" : "");
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
        $template_note = isset($_POST['template_note']) ? sanitize_textarea_field($_POST['template_note']) : '';

        error_log('WETC Debug: Saving template note: ' . print_r($template_note, true));
        error_log('WETC Debug: POST data keys: ' . print_r(array_keys($_POST), true));

        // Ensure creation column exists (failsafe for direct access to editor)
        $column_date = $wpdb->get_results("SHOW COLUMNS FROM {$table_name} LIKE 'created_at'");
        if (empty($column_date)) {
            $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
        }

        // Ensure note column exists (failsafe)
        $column_note = $wpdb->get_results("SHOW COLUMNS FROM {$table_name} LIKE 'template_note'");
        if (empty($column_note)) {
            $wpdb->query("ALTER TABLE {$table_name} ADD COLUMN template_note TEXT");
        }

        // FIX: If content_type appears to be a label (e.g. "New Order (Admin)"), clear it
        // so the logic below can correctly deduce the slug (e.g. "new_order_admin").
        // Removed this block to allow saving whatever the frontend sends (now fixed to send slug).
        // if (!empty($content_type) && strpos($content_type, ' ') !== false) {
        //      $content_type = ''; 
        // }

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
        $current_time = current_time('mysql');
        $data = [
            'email_template_name' => $template_name,
            'subject' => $subject,
            'json_data' => $json_data,
            'content_type' => $content_type,
            'recipient' => $recipient,
            'template_note' => $template_note,
            'created_at' => $current_time // Update timestamp
        ];
        
        $formats = ['%s', '%s', '%s', '%s', '%s', '%s', '%s'];

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
                delete_transient('wetc_template_names_list_v3');
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
                delete_transient('wetc_template_names_list_v3');
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