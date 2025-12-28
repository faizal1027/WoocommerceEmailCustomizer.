<?php
/**
 * Fix the On-Hold template slug mismatch
 */

require_once(__DIR__ . '/../../../../wp-load.php');

global $wpdb;
$table_name = $wpdb->prefix . 'wetc_email_templates';

// Update the slug for the On-Hold template
$result = $wpdb->query($wpdb->prepare(
    "UPDATE $table_name SET content_type = 'on_hold_order' WHERE content_type = 'Order On-Hold (Customer)' OR email_template_name LIKE %s",
    '%on-hold%'
));

if ($result !== false) {
    echo "Successfully updated $result template(s) to 'on_hold_order' slug.\n";
} else {
    echo "Failed to update templates.\n";
}

// Also clear the cache
delete_transient('wetc_template_names_list');
echo "Cache cleared.\n";
