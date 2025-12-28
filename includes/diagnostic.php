<?php
/**
 * Diagnostic tool to check WETC templates and hooks
 */

require_once(__DIR__ . '/../../../../wp-load.php');

global $wpdb;
$table_name = $wpdb->prefix . 'wetc_email_templates';

echo "--- Template Mapping Audit ---\n";
$templates = $wpdb->get_results("SELECT id, email_template_name, content_type, recipient FROM $table_name");

if (empty($templates)) {
    echo "No templates found in database.\n";
} else {
    foreach ($templates as $t) {
        echo "ID: {$t->id} | Name: {$t->email_template_name} | Slug: {$t->content_type} | Recipient: {$t->recipient}\n";
    }
}

echo "\n--- Hook Status ---\n";
$hooks = [
    'woocommerce_order_status_on-hold',
    'woocommerce_email_enabled_customer_on_hold_order'
];

foreach ($hooks as $hook) {
    if (has_action($hook) || has_filter($hook)) {
        echo "Hook '$hook' is ACTIVE.\n";
    } else {
        echo "Hook '$hook' is NOT active.\n";
    }
}
