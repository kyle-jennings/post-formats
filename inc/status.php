<?php

class PostFormatStatus
{
    public $screens = array();

    public function __construct($screens = array())
    {
        $this->screens = $screens;
    }

    
    public function register_status(){
        foreach($this->screens as $screen){
            add_meta_box(
                'post_formats_status',
                __('Quote', 'post-formats'),
                array($this, 'status_meta_box'),
                $screen,
                'normal',
                'default'
            );
        }
    }


    public function status_meta_box($post){
        wp_nonce_field('post_format_status_nonce', 'post_format_status_nonce');
        $statusAuthor = get_post_meta($post->ID, '_post_format_status_author', true);
        $statusBody = get_post_meta($post->ID, '_post_format_status_body', true);
        ?>
        <p>
            <label>
                <?php _e('Quote Author', 'post_formats'); ?><br />
                <input type="text" value="<?php echo($statusAuthor); ?>" name="post_format_status_author" />
            </label>
        </p>
        <p>
            <label>
                <?php _e('Quote Body', 'post_formats'); ?><br />
                <textarea name="post_format_status_body"><?php echo($statusBody); ?></textarea>
            </label>
        </p>
        <?php
    }

    public function status_meta_box_save($post_id){
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'post_format_status_nonce' ]) && wp_verify_nonce($_POST['post_format_status_nonce'], 'post_format_status_nonce')) ? 'true' : 'false';

        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        if(isset($_POST['post_format_status_author'])){
            update_post_meta($post_id, '_post_format_status_author', $_POST['post_format_status_author']);
        }

        if(isset($_POST['post_format_status_body'])){
            update_post_meta($post_id, '_post_format_status_body', $_POST['post_format_status_body']);
        }
    }


}
