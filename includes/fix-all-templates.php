<?php
/**
 * One-time script to fix all corrupted JSON templates
 * 
 * INSTRUCTIONS:
 * 1. Access this file via browser: http://localhost/wordpress/wp-content/plugins/WoocommerceEmailCustomizer/includes/fix-all-templates.php
 * 2. The script will automatically fix all corrupted templates
 * 3. Delete this file after running it once
 */

// Load WordPress
require_once('../../../../wp-load.php');

// Security check - only admins can run this
if (!current_user_can('manage_options')) {
    die('Access denied. You must be an administrator.');
}

global $wpdb;
$table_name = $wpdb->prefix . 'wetc_email_templates';

echo '<!DOCTYPE html>
<html>
<head>
    <title>Fix All Corrupted Templates</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 50px auto; padding: 20px; }
        h1 { color: #0073aa; }
        .success { background: #d4edda; color: #155724; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .error { background: #f8d7da; color: #721c24; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .warning { background: #fff3cd; color: #856404; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .info { background: #d1ecf1; color: #0c5460; padding: 15px; margin: 10px 0; border-radius: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #0073aa; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .btn { padding: 10px 20px; background: #0073aa; color: white; border: none; cursor: pointer; border-radius: 4px; text-decoration: none; display: inline-block; margin: 10px 5px; }
        .btn-danger { background: #dc3545; }
        .btn-success { background: #28a745; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>';

echo '<h1>🔧 Fix All Corrupted Email Templates</h1>';

// Get all templates
$all_templates = $wpdb->get_results("SELECT * FROM $table_name ORDER BY id");

if (!$all_templates) {
    echo '<div class="error">No templates found in database.</div>';
    echo '</body></html>';
    exit;
}

echo '<div class="info">Found ' . count($all_templates) . ' templates. Checking for corruption...</div>';

$corrupted = [];
$valid = [];
$fixed = [];
$failed = [];

// Check each template
foreach ($all_templates as $template) {
    $json_data = $template->json_data;
    
    // Check if JSON is valid
    if (empty($json_data)) {
        $corrupted[] = [
            'id' => $template->id,
            'name' => $template->email_template_name,
            'error' => 'Empty JSON data',
            'data' => $json_data
        ];
    } else {
        json_decode($json_data);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $corrupted[] = [
                'id' => $template->id,
                'name' => $template->email_template_name,
                'error' => json_last_error_msg(),
                'data' => $json_data
            ];
        } else {
            $valid[] = [
                'id' => $template->id,
                'name' => $template->email_template_name
            ];
        }
    }
}

// Display results
echo '<h2>📊 Analysis Results</h2>';
echo '<table>';
echo '<tr><th>Status</th><th>Count</th></tr>';
echo '<tr><td>✅ Valid Templates</td><td>' . count($valid) . '</td></tr>';
echo '<tr><td>❌ Corrupted Templates</td><td>' . count($corrupted) . '</td></tr>';
echo '</table>';

if (count($valid) > 0) {
    echo '<h3>✅ Valid Templates (' . count($valid) . ')</h3>';
    echo '<table>';
    echo '<tr><th>ID</th><th>Template Name</th></tr>';
    foreach ($valid as $t) {
        echo '<tr><td>' . $t['id'] . '</td><td>' . esc_html($t['name']) . '</td></tr>';
    }
    echo '</table>';
}

if (count($corrupted) > 0) {
    echo '<h3>❌ Corrupted Templates (' . count($corrupted) . ')</h3>';
    echo '<table>';
    echo '<tr><th>ID</th><th>Template Name</th><th>Error</th><th>Preview</th></tr>';
    foreach ($corrupted as $t) {
        echo '<tr>';
        echo '<td>' . $t['id'] . '</td>';
        echo '<td>' . esc_html($t['name']) . '</td>';
        echo '<td>' . esc_html($t['error']) . '</td>';
        echo '<td><pre>' . esc_html(substr($t['data'], 0, 100)) . '...</pre></td>';
        echo '</tr>';
    }
    echo '</table>';
    
    // Show fix button
    if (!isset($_POST['fix_all'])) {
        echo '<form method="post">';
        wp_nonce_field('fix_all_templates', 'fix_nonce');
        echo '<button type="submit" name="fix_all" value="1" class="btn btn-danger">🔧 Fix All Corrupted Templates (Reset to Empty)</button>';
        echo '<p class="warning">⚠️ This will reset all corrupted templates to empty arrays []. Any data in these templates will be lost.</p>';
        echo '</form>';
    }
}

// Handle fix request
if (isset($_POST['fix_all']) && check_admin_referer('fix_all_templates', 'fix_nonce')) {
    echo '<h2>🔧 Fixing Corrupted Templates...</h2>';
    
    foreach ($corrupted as $t) {
        $result = $wpdb->update(
            $table_name,
            ['json_data' => '[]'],
            ['id' => $t['id']],
            ['%s'],
            ['%d']
        );
        
        if ($result !== false) {
            $fixed[] = $t;
            echo '<div class="success">✓ Fixed template ID ' . $t['id'] . ': ' . esc_html($t['name']) . '</div>';
        } else {
            $failed[] = $t;
            echo '<div class="error">✗ Failed to fix template ID ' . $t['id'] . ': ' . esc_html($t['name']) . '</div>';
        }
    }
    
    echo '<h2>📊 Fix Summary</h2>';
    echo '<table>';
    echo '<tr><th>Status</th><th>Count</th></tr>';
    echo '<tr><td>✅ Successfully Fixed</td><td>' . count($fixed) . '</td></tr>';
    echo '<tr><td>❌ Failed to Fix</td><td>' . count($failed) . '</td></tr>';
    echo '</table>';
    
    if (count($fixed) > 0) {
        echo '<div class="success">';
        echo '<h3>✅ All corrupted templates have been fixed!</h3>';
        echo '<p>The following templates have been reset to empty arrays and are now ready to use:</p>';
        echo '<ul>';
        foreach ($fixed as $t) {
            echo '<li>ID ' . $t['id'] . ': ' . esc_html($t['name']) . '</li>';
        }
        echo '</ul>';
        echo '<p><strong>Next steps:</strong></p>';
        echo '<ol>';
        echo '<li>Go to your WordPress admin email customizer page</li>';
        echo '<li>Open each fixed template and rebuild it</li>';
        echo '<li>The new validation will prevent corruption from happening again</li>';
        echo '<li>Delete this file (fix-all-templates.php) for security</li>';
        echo '</ol>';
        echo '</div>';
    }
    
    echo '<a href="' . admin_url('admin.php?page=posts_list_table') . '" class="btn btn-success">Go to Email Templates</a>';
    echo '<script>setTimeout(function(){ window.location.href = "' . admin_url('admin.php?page=posts_list_table') . '"; }, 5000);</script>';
}

echo '<hr>';
echo '<div class="info">';
echo '<h3>ℹ️ Prevention Measures Already in Place</h3>';
echo '<p>The following fixes have been applied to prevent future corruption:</p>';
echo '<ul>';
echo '<li>✅ JSON validation before saving to database</li>';
echo '<li>✅ JSON validation when loading from database</li>';
echo '<li>✅ Detailed error logging for debugging</li>';
echo '<li>✅ Graceful error handling with fallbacks</li>';
echo '<li>✅ Enhanced error messages for users</li>';
echo '</ul>';
echo '<p><strong>These templates will not get corrupted again!</strong></p>';
echo '</div>';

echo '</body></html>';
?>
