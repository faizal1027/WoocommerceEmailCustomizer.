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

        $this->process_bulk_action();
    }
  
    public function get_columns() {
        $columns = [
            'cb'           => '<input type="checkbox" />', // Bulk actions
            'post_title'   => __('Title', 'wp-posts-list'),
            'post_category'=> __('Email Type', 'wp-posts-list'),
            'post_date'    => __('Date', 'wp-posts-list'),
            'post_status'  => __('Status', 'wp-posts-list'),
        ];
    
        $hidden_columns = get_user_meta(get_current_user_id(), "manageposts_list_tablecolumnshidden", true);
        $hidden_columns = is_array($hidden_columns) ? $hidden_columns : [];

        foreach ($hidden_columns as $hidden_column) {
            if (isset($columns[$hidden_column])) {
                unset($columns[$hidden_column]);
            }
        }
    
        return $columns;
    }
    
    
    public function column_cb($item) {
        return sprintf(
            '<input type="checkbox" name="bulk-delete[]" value="%d" />',
            esc_attr($item['ID'])
        );
    }
    

    protected function get_sortable_columns() {
        return [
            'post_title' => ['post_title', true],
            'post_date'  => ['post_date', true],
        ];
    }

    public function get_bulk_actions() {
        
        $post_status = isset($_GET['post_status']) ? sanitize_text_field($_GET['post_status']) : 'all';

    
       
        $allowed_statuses = ['all', 'publish', 'draft', 'pending', 'Inactive', 'trash'];
    
        
        if (!in_array($post_status, $allowed_statuses)) {
            $post_status = 'all';

        }
    
       
        if ($post_status === 'trash') {
            return [
                'restore' => __('Restore', 'wp-posts-list'),
                'delete'  => __('Delete Permanently', 'wp-posts-list'),
            ];
        }
    
       
        return [
            'trash' => __('Move to Trash', 'wp-posts-list'),
        ];
    }
    
    

    public function get_views() {
        global $wpdb;

        $status_links = [];
        $statuses = [
            'all'       => __('All', 'textdomain'),
            'publish'   => __('Active', 'textdomain'),
            'draft'     => __('Inactive', 'textdomain'),
            'trash'     => __('Trash', 'textdomain'), 
        ];

        $current_status = isset($_GET['post_status']) ? sanitize_text_field($_GET['post_status']) : 'all';

        $all_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'sm-mail-customizer'");

        foreach ($statuses as $status => $label) {
            $count = ($status === 'all') ? $all_count : $wpdb->get_var($wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'sm-mail-customizer' AND post_status = %s",
                $status
            ));

            $class = ($current_status === $status) ? ' class="current"' : '';

            $status_links[$status] = sprintf(
                '<a href="%s" %s>%s <span class="count">(%d)</span></a>',
                esc_url(admin_url('admin.php?page=' . sanitize_text_field($_REQUEST['page']) . '&post_status=' . $status)),
                $class,
                esc_html($label),
                $count
            );
        }

        return $status_links;
    }

    public function prepare_items() {
        global $wpdb;
    
        $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        $taxonomy_filter = isset($_GET['taxonomy_filter']) ? intval($_GET['taxonomy_filter']) : '';
        $post_status = isset($_GET['post_status']) ? sanitize_text_field($_GET['post_status']) : 'all';
        $taxonomy = $this->get_taxonomy_by_label('Email Type');
    
        $per_page = $this->get_items_per_page('posts_per_page', 10);
        $current_page = $this->get_pagenum();
        $offset = ($current_page - 1) * $per_page;

        $query = "SELECT p.* FROM {$wpdb->posts} p ";
        if (!empty($taxonomy_filter) && $taxonomy) {
            $query .= " INNER JOIN {$wpdb->term_relationships} tr ON (p.ID = tr.object_id)";
            $query .= " INNER JOIN {$wpdb->term_taxonomy} tt ON (tr.term_taxonomy_id = tt.term_taxonomy_id)";
        }
    
        $query .= " WHERE p.post_type = 'sm-mail-customizer'";
    
        if ($post_status !== 'all') {
            $query .= $wpdb->prepare(" AND p.post_status = %s", $post_status);
        }
    
        if (!empty($taxonomy_filter) && $taxonomy) {
            $query .= $wpdb->prepare(" AND tt.taxonomy = %s AND tt.term_id = %d", $taxonomy, $taxonomy_filter);
        }
    
        if (!empty($search)) {
            $query .= $wpdb->prepare(" AND p.post_title LIKE %s", '%' . $wpdb->esc_like($search) . '%');
        }
    
        
        $total_items = $wpdb->get_var(str_replace("p.*", "COUNT(*)", $query));
    
        $query .= $wpdb->prepare(" ORDER BY p.post_date DESC LIMIT %d OFFSET %d", $per_page, $offset);
    
        $this->items = $wpdb->get_results($query, ARRAY_A);
    
        $columns = $this->get_columns();
        $hidden = [];
        $sortable = $this->get_sortable_columns();
        $this->_column_headers = [$columns, $hidden, $sortable];
        error_log('Columns in prepare_items: ' . print_r($columns, true));

        $this->set_pagination_args([
            'total_items' => $total_items,
            'per_page'    => $per_page,
            'total_pages' => ceil($total_items / $per_page),
        ]);
    }
    

    public function column_default($item, $column_name) {
        switch ($column_name) {
            case 'post_category':
                return $this->get_post_taxonomy_terms($item['ID']);
            default:
                return isset($item[$column_name]) ? esc_html($item[$column_name]) : '';
        }
    }

    public function column_post_title($item) {
        $status = isset($_GET['post_status']) ? sanitize_text_field(wp_unslash($_GET['post_status'])) : 'all';
        $template_id = isset($item['ID']) ? intval($item['ID']) : 0; 

        if ($status === 'trash') {
            $actions = [
                'restore' => sprintf(
                    '<a href="%s">%s</a>',
                    esc_url(wp_nonce_url(admin_url('admin.php?page=' . sanitize_text_field($_REQUEST['page']) . '&action=restore&template=' . $template_id), 'restore_post_' . $template_id)),
                    __('Restore', 'wp-posts-list')
                ),
                'delete'  => sprintf(
                    '<a href="%s">%s</a>',
                    esc_url(wp_nonce_url(admin_url('admin.php?page=' . sanitize_text_field($_REQUEST['page']) . '&action=delete&template=' . $template_id), 'delete_post_' . $template_id)),
                    __('Delete Permanently', 'wp-posts-list')
                ),
            ];
        } else {
            $edit_link = get_edit_post_link($template_id);
            $export_link = wp_nonce_url(
                admin_url('admin-post.php?action=sm_mail_customizer_export_single_template&template_id=' . $template_id),
                'export_template_' . $template_id);

            $actions = [
                'edit'      => sprintf('<a href="%s">%s</a>', esc_url($edit_link), __('Edit', 'wp-posts-list')),
                'duplicate' => '<a href="#" class="quick-edit">' . __('Duplicate', 'wp-posts-list') . '</a>',
                'export'    => sprintf('<a href="%s">%s</a>', esc_url($export_link), __('Export', 'wp-posts-list')),
                'trash'     => sprintf('<a href="%s">%s</a>', esc_url(get_delete_post_link($template_id)), __('Trash', 'wp-posts-list')),
            ];
        }

        return sprintf('%s %s', esc_html($item['post_title'] ?? 'Untitled'), $this->row_actions($actions));
    }

    private function get_post_taxonomy_terms($post_id) {
        $taxonomy = $this->get_taxonomy_by_label('Email Type');
        if (!$taxonomy) {
            return __('No Categories', 'wp-posts-list');
        }

        $terms = wp_get_post_terms($post_id, $taxonomy);
        if (empty($terms) || is_wp_error($terms)) {
            return __('No Categories', 'wp-posts-list');
        }

        return implode(', ', wp_list_pluck($terms, 'name'));
    }

    public function get_taxonomy_by_label($label) {
        $taxonomies = get_taxonomies([], 'objects');
        foreach ($taxonomies as $taxonomy) {
            if ($taxonomy->label === $label) {
                return $taxonomy->name;
            }
        }
        return false;
    }



    public function extra_tablenav($which) {
        if ($which == 'top') {
            $taxonomy = $this->get_taxonomy_by_label('Email Type');
            if (!$taxonomy) {
                return;
            }

            $terms = get_terms([
                'taxonomy'   => $taxonomy,
                'hide_empty' => false,
            ]);

            $selected_term = isset($_GET['taxonomy_filter']) ? intval($_GET['taxonomy_filter']) : '';

            echo '<form method="get">';
            echo '<input type="hidden" name="page" value="' . esc_attr($_REQUEST['page']) . '" />';

            echo '<div class="alignleft actions">';
            echo '<select name="taxonomy_filter" id="taxonomy_filter">';
            echo '<option value="">' . __('All Email Types', 'wp-posts-list') . '</option>';

            foreach ($terms as $term) {
                printf(
                    '<option value="%s" %s>%s</option>',
                    esc_attr($term->term_id),
                    selected($selected_term, $term->term_id, false),
                    esc_html($term->name)
                );
            }

            echo '</select>';
            submit_button(__('Filter'), 'secondary', false, false);
            echo '</div>';
            echo '</form>';
        }
    }

    public function process_bulk_action() {
       
        if (!isset($_GET['action']) || !isset($_GET['template'])) {
            return;
        }
   
        $action = sanitize_text_field($_GET['action']);
        $template_id = intval($_GET['template']);
    
        if (!isset($_GET['_wpnonce']) || !wp_verify_nonce($_GET['_wpnonce'], $action . '_post_' . $template_id)) {
            wp_die(__('Security check failed.', 'wp-posts-list'));
        }
    
        if ($action === 'trash') {
          
            wp_update_post(['ID' => $template_id, 'post_status' => 'trash']);
    
            wp_redirect(admin_url('admin.php?page=' . sanitize_text_field($_REQUEST['page']) . '&post_status=trash'));
            exit;
        }
    
        if ($action === 'restore') {
            wp_update_post(['ID' => $template_id, 'post_status' => 'publish']);
    
            wp_redirect(admin_url('admin.php?page=' . sanitize_text_field($_REQUEST['page']) . '&post_status=publish'));
            exit;
        }  
        if ($action === 'delete') {
            wp_delete_post($template_id, true);
    
            wp_redirect(admin_url('admin.php?page=' . sanitize_text_field($_REQUEST['page']) . '&post_status=trash'));
            exit;
        }   
    }
}
