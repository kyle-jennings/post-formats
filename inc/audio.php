<?php

class post_formats_audio
{
    public $screens = array();

    public function __construct($screens = array())
    {
        $this->screens = $screens;
    }

    
    public function register_audio(){
        foreach($this->screens as $screen){
            add_meta_box(
                'post_formats_audio',
                __('Audio', 'post-formats'),
                array($this, 'audio_meta_box'),
                $screen,
                'normal',
                'default'
            );
        }
    }


    public function audio_meta_box($post){
        wp_nonce_field('post_format_audio_nonce', 'post_format_audio_nonce');
        $audio = get_post_meta($post->ID, '_post_format_audio', true);
        ?>
        <p style="text-align:center;">
            <audio src="<?php echo(wp_get_attachment_url($audio)); ?>" id="post_formats_audio_preview" controls="controls"></audio>
        </p>
        <input type="hidden" id="post_format_audio" name="post_format_audio" value="<?php echo($audio); ?>" />
        <input type="button" id="post_format_audio_select" value="<?php _e('Select Audio', 'post_formats'); ?>" />
        <a class="js--pfp-remove-audio" href="#" >Remove Audio</a>
        <?php
    }

    public function audio_meta_box_save($post_id){
        $is_autosave = wp_is_post_autosave($post_id);
        $is_revision = wp_is_post_revision($post_id);
        $is_valid_nonce = (isset($_POST[ 'post_format_audio_nonce' ]) && wp_verify_nonce($_POST['post_format_audio_nonce'], 'post_format_audio_nonce')) ? 'true' : 'false';

        if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
            return;
        }

        if(isset($_POST['post_format_audio'])){
            update_post_meta($post_id, '_post_format_audio', $_POST['post_format_audio']);
        }
    }

}
