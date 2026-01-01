<?php

namespace SmackCoders\WETC;

if (!defined('ABSPATH')) {
    die;
}

if (!class_exists('WP_List_Table')) {
    require_once ABSPATH . 'wp-admin/includes/class-wp-list-table.php';
}

class Posts_List_Table extends \WP_List_Table {

    public function __construct() {
        parent::__construct([
            'singular' => 'post',
            'plural'   => 'posts',
            'ajax'     => false
        ]);

        $this->ensure_status_column();
        $this->process_bulk_action();
    }

    private function ensure_status_column() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        
        // Cache column check to avoid query on every page load if possible, 
        // but for admin panel robust check is better.
        $row = $wpdb->get_results("SHOW COLUMNS FROM $table_name LIKE 'status'");
        
        if (empty($row)) {
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN status VARCHAR(20) DEFAULT 'publish'");
        }
    }
  
    public function get_columns() {
        $columns = [
            'cb'                  => '<input type="checkbox" />', // Bulk actions
            'email_template_name' => __('Email subject', 'wc-email-template-customizer'),
            'content_type'        => __('Type', 'wc-email-template-customizer'),
            'recipient'           => __('Recipient', 'wc-email-template-customizer'),
            'note'                => __('Note', 'wc-email-template-customizer'),
            'date'                => __('Date', 'wc-email-template-customizer'),
        ];
        return $columns;
    }

    protected function get_sortable_columns() {
        return [];
    }

    public function column_default($item, $column_name) {
        switch ($column_name) {
            case 'content_type':
            case 'recipient':
                return isset($item[$column_name]) ? esc_html($item[$column_name]) : '';
            case 'note':
                return '-'; 
            case 'date':
                return '-';
            default:
                return print_r($item, true); // For debugging
        }
    }

    public function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="template[]" value="%s" />',
            $item['id']
        );
    }

    public function column_email_template_name($item) {
        $current_status = isset($_REQUEST['template_status']) ? $_REQUEST['template_status'] : 'all';
        $actions = [];

        if ($current_status === 'trash') {
            $actions['restore'] = sprintf(
                '<a href="%s">%s</a>', 
                wp_nonce_url(admin_url('admin-post.php?action=wetc_restore_template&id=' . $item['id']), 'wetc_restore_template_' . $item['id']), 
                __('Restore', 'wc-email-template-customizer')
            );
            $actions['delete'] = sprintf(
                '<a href="%s" onclick="return confirm(\'are you sure?\');" class="submitdelete">%s</a>', 
                wp_nonce_url(admin_url('admin-post.php?action=wetc_delete_template&id=' . $item['id']), 'wetc_delete_template_' . $item['id']), 
                __('Delete Permanently', 'wc-email-template-customizer')
            );
        } else {
            $actions['edit'] = sprintf('<a href="%s">%s</a>', admin_url('admin.php?page=email-customizer-add-new&id=' . $item['id']), __('Edit', 'wc-email-template-customizer'));
            $actions['duplicate'] = sprintf('<a href="%s">%s</a>', wp_nonce_url(admin_url('admin-post.php?action=wetc_duplicate_template&id=' . $item['id']), 'wetc_duplicate_template_' . $item['id']), __('Duplicate', 'wc-email-template-customizer'));
            $actions['trash'] = sprintf(
                '<a href="%s" class="submitdelete">%s</a>', 
                wp_nonce_url(admin_url('admin-post.php?action=wetc_trash_template&id=' . $item['id']), 'wetc_trash_template_' . $item['id']), 
                __('Trash', 'wc-email-template-customizer')
            );
        }

        return sprintf('%1$s %2$s',
            '<strong><a class="row-title" href="' . admin_url('admin.php?page=email-customizer-add-new&id=' . $item['id']) . '">' . esc_html($item['email_template_name']) . '</a></strong>',
            $this->row_actions($actions)
        );
    }

    public function get_bulk_actions() {
        $status = isset($_REQUEST['template_status']) ? $_REQUEST['template_status'] : 'all';
        
        if ($status === 'trash') {
            return [
                'untrash' => __('Restore', 'wc-email-template-customizer'),
                'delete'  => __('Delete Permanently', 'wc-email-template-customizer')
            ];
        } else {
            return [
                'trash' => __('Move to Trash', 'wc-email-template-customizer')
            ];
        }
    }

    public function get_views() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        
        // Count statuses
        $stats = $wpdb->get_results("SELECT status, COUNT(*) as num FROM $table_name GROUP BY status", ARRAY_A);
        $counts = ['publish' => 0, 'trash' => 0];
        foreach ($stats as $row) {
             if (empty($row['status'])) $row['status'] = 'publish'; // Default
             if (isset($counts[$row['status']])) {
                 $counts[$row['status']] = $row['num'];
             } else {
                 $counts['publish'] += $row['num']; // aggregate unknown as publish
             }
        }
        
        $total_active = $counts['publish'];
        $total_trash = $counts['trash'];
        
        $current = !isset($_REQUEST['template_status']) ? 'all' : $_REQUEST['template_status'];
        
        // All link
        $class_all = ($current === 'all' || $current === '') ? 'class="current"' : '';
        // Published link
        $class_pub = ($current === 'publish') ? 'class="current"' : '';
        // Trash link
        $class_trash = ($current === 'trash') ? 'class="current"' : '';

        $views = [
            'all' => sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', remove_query_arg(['template_status', 'filter_type']), $class_all, __('All', 'wc-email-template-customizer'), $total_active),
            'publish' => sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', add_query_arg('template_status', 'publish'), $class_pub, __('Published', 'wc-email-template-customizer'), $total_active),
            'trash' => sprintf('<a href="%s" %s>%s <span class="count">(%d)</span></a>', add_query_arg('template_status', 'trash'), $class_trash, __('Trash', 'wc-email-template-customizer'), $total_trash)
        ];

        return $views;
    }

    public function extra_tablenav($which) {
        if ($which == 'top') {
            $current_type = isset($_GET['filter_type']) ? sanitize_text_field($_GET['filter_type']) : '';
            
            // Get all unique types
            global $wpdb;
            $table_name = $wpdb->prefix . 'wetc_email_templates';
            $types = $wpdb->get_col("SELECT DISTINCT content_type FROM $table_name ORDER BY content_type ASC");
            
            echo '<div class="alignleft actions">';
            
            // Type Filter
            echo '<select name="filter_type">';
            echo '<option value="">' . __('Filter by type', 'wc-email-template-customizer') . '</option>';
            foreach ($types as $type) {
                printf(
                    '<option value="%s" %s>%s</option>',
                    esc_attr($type),
                    selected($current_type, $type, false),
                    esc_html(ucwords(str_replace('_', ' ', $type)))
                );
            }
            echo '</select>';

            submit_button(__('Filter'), 'secondary', false, false);
            echo '</div>';
        }
    }

    public function prepare_items() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'wetc_email_templates';
        $per_page = $this->get_items_per_page('wetc_templates_per_page', 20);
        
        $columns = $this->get_columns();
        $hidden = [];
        $sortable = $this->get_sortable_columns();
        
        $this->_column_headers = [$columns, $hidden, $sortable];

        // Process Bulk Actions
        $this->process_bulk_action();

        // Pagination parameters
        $current_page = $this->get_pagenum();
        $offset = ($current_page - 1) * $per_page;

        // Sorting
        $orderby = (isset($_GET['orderby'])) ? sanitize_sql_orderby($_GET['orderby']) : 'id';
        $order = (isset($_GET['order'])) ? sanitize_text_field($_GET['order']) : 'DESC';

        // Filters
        $where = "WHERE 1=1";
        
        // Search
        if (!empty($_REQUEST['s'])) {
            $search = esc_sql($_REQUEST['s']);
            $where .= " AND email_template_name LIKE '%{$search}%'";
        }
        
        // Type Filter
        if (!empty($_REQUEST['filter_type'])) {
            $type = esc_sql($_REQUEST['filter_type']);
            $where .= " AND content_type = '{$type}'";
        }

        // Status Filter
        // Default to 'publish' (aka not trash) if status not set or set to 'all' or 'publish'
        // Actually, for WP logic: 'all' usually excludes trash. 'trash' includes only trash.
        $status_filter = isset($_REQUEST['template_status']) ? $_REQUEST['template_status'] : 'all';
        
        if ($status_filter === 'trash') {
            $where .= " AND status = 'trash'";
        } else {
            // All and Publish both show non-trashed items
             $where .= " AND (status = 'publish' OR status IS NULL OR status = '')";
        }

        // Get Total Count
        $total_items = $wpdb->get_var("SELECT COUNT(id) FROM $table_name $where");

        // Get Items
        $this->items = $wpdb->get_results(
            "SELECT * FROM $table_name $where ORDER BY $orderby $order LIMIT $per_page OFFSET $offset",
            ARRAY_A
        );

        $this->set_pagination_args([
            'total_items' => $total_items,
            'per_page'    => $per_page,
            'total_pages' => ceil($total_items / $per_page)
        ]);
    }

    public function process_bulk_action() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'wetc_email_templates';
        $action = $this->current_action();

        if (!$action) return;

        // Security check
        // check_admin_referer('bulk-' . $this->_args['plural']); (Standard way, but using custom verification below)
        
        // Handle Single Row Actions that come via admin-post.php usually, but if they come here via GET:
        // (Actually row actions like ?action=wetc_delete_template usually point to admin-post hook, not self page reload.
        // But WP_List_Table often handles them if they point back to page. 
        // My previous code used admin-post.php for single actions. 
        // THIS method processes BULK actions from the top dropdown.)

        if (isset($_REQUEST['template']) && is_array($_REQUEST['template'])) {
            $ids = array_map('intval', $_REQUEST['template']);
            $ids_sql = implode(',', $ids);

            if ($action === 'trash') {
                 $wpdb->query("UPDATE $table_name SET status = 'trash' WHERE id IN ($ids_sql)");
            } elseif ($action === 'untrash') {
                 $wpdb->query("UPDATE $table_name SET status = 'publish' WHERE id IN ($ids_sql)");
            } elseif ($action === 'delete') {
                 $wpdb->query("DELETE FROM $table_name WHERE id IN ($ids_sql)");
            }
        }
    }
}
