


<?php
// Assuming this is inside templates/app.php
$plugin_url = plugin_dir_url(__FILE__) . '../react-build';
?>

<div class="wrap">
    <div id="root"></div> <!-- React mounts here -->
</div>

<?php
// Enqueue React build JS/CSS
wp_enqueue_script('react-app-js', $plugin_url . '/static/js/main.js', [], null, true);
wp_enqueue_style('react-app-css', $plugin_url . '/static/css/main.css', [], null);
?> 
