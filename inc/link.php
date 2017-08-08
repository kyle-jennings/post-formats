<?php

class PostFormatLink
{
    public $screens = array();

    public function __construct($screens = array())
    {
        $this->screens = $screens;
    }

    public function register_link(){
        foreach($this->screens as $screen){
            add_meta_box(
                'post_formats_link',
                __('Link', 'post-formats'),
                array($this, 'link_meta_box'),
                $screen,
                'normal',
                'default'
            );
        }
    }

    public function link_meta_box($post){
        wp_nonce_field('post_format_link_nonce', 'post_format_link_nonce');
        $linkURL = get_post_meta($post->ID, '_post_format_link_url', true);
        $linkText = get_post_meta($post->ID, '_post_format_link_text', true);
        ?>
        <p>
            <label>
                <?php _e('Link Text', 'post_formats'); ?>
                <input type="text" value="<?php echo($linkText); ?>" name="post_format_link_text" />
            </label>
        </p>
        <p>
            <label>
                <?php _e('Link URL', 'post_formats'); ?>
                <input type="text" value="<?php echo($linkURL); ?>" name="post_format_link_url" />
            </label>
        </p>
        <?php
    }

    public function link_meta_box_save($post_id){
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'post_format_link_nonce' ]) && wp_verify_nonce($_POST['post_format_link_nonce'], 'post_format_link_nonce')) ? 'true' : 'false';

        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        if(isset($_POST['post_format_link_url'])){
            update_post_meta($post_id, '_post_format_link_url', $_POST['post_format_link_url']);
        }

        if(isset($_POST['post_format_link_text'])){
            update_post_meta($post_id, '_post_format_link_text', $_POST['post_format_link_text']);
        }
    }


}
