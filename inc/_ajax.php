<?php

function pfp_oembed($url = null, $type = null) {

    if(!$url && !$type) {
        $type = $_POST['pfpType'];
        $url = $_POST['pfpURL'];
    }


    $func = 'pfp_get_the_'.lcfirst($type).'_markup';
    error_log($func);
    $html = call_user_func($func, $url);

    echo $html;

    exit();
}
add_action('wp_ajax_pfp_oembed', 'pfp_oembed');
