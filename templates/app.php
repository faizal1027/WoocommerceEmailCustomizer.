


<?php
// Assuming this is inside templates/app.php
$plugin_url = plugin_dir_url(__FILE__) . '../react-build';
?>

<div class="wrap">
    <div id="root"></div> <!-- React mounts here -->
</div>

<?php
// Enqueue React build JS/CSS
$js_path = plugin_dir_path(__FILE__) . '../react-build/static/js/app_bundle.js';
$css_path = plugin_dir_path(__FILE__) . '../react-build/static/css/app_bundle.css';

// Force reload by using current time if file exists
$js_ver = file_exists($js_path) ? filemtime($js_path) . '_' . time() : time();
$css_ver = file_exists($css_path) ? filemtime($css_path) . '_' . time() : time();

wp_enqueue_script('react-app-js', $plugin_url . '/static/js/app_bundle.js', [], $js_ver, true);
wp_enqueue_style('react-app-css', $plugin_url . '/static/css/app_bundle.css', [], $css_ver);
?> 
