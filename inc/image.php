<?php

class PostFormatImage
{
    public $screens = array();

    public function __construct($screens = array())
    {
        $this->screens = $screens;
    }

    public function register_image(){
        foreach($this->screens as $screen){
            add_meta_box(
                'post_formats_image',
                __('Image', 'post-formats'),
                array($this, 'image_meta_box'),
                $screen,
                'normal',
                'default'
            );
        }
    }


    public function image_meta_box($post){
        
        ?>
        <p style="text-align:center;">
            The post format uses the "featured image".
        </p>
        <?php
    }

    public function image_meta_box_save($post_id){
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'post_format_image_nonce' ]) && wp_verify_nonce($_POST['post_format_image_nonce'], 'post_format_image_nonce')) ? 'true' : 'false';

        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        if(isset($_POST['post_format_image'])){
            update_post_meta($post_id, '_post_format_image', $_POST['post_format_image']);
        }
    }


}
