<?php


function pfp_shortcode($str = null) {
    if(!$str || empty($str))
        $str = $_POST['pfpSTR'];

    $str = wp_kses_stripslashes($str);
    echo do_shortcode($str);

    exit();

}
add_action('wp_ajax_pfp_shortcode', 'pfp_shortcode');


function pfp_oembed($url = null, $type = null) {

    if(!$url && !$type) {
        $type = $_POST['pfpType'];
        $url = $_POST['pfpURL'];
    }


    $func = 'pfp_get_the_'.lcfirst($type).'_markup';

    $html = call_user_func($func, $url);

    echo $html;

    exit();
}
add_action('wp_ajax_pfp_oembed', 'pfp_oembed');
