<?php

class PostFormatAudio
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
                'top',
                'default'
            );
        }
    }


    public function audio_meta_box($post){
        wp_nonce_field('post_format_audio_nonce', 'post_format_audio_nonce');
        $url = get_post_meta($post->ID, '_post_format_audio', true);
        ?>
        <div class="pfp-audio-holder">
            <?php echo bootswatch_get_the_audio_markup($url); ?>
        </div>

        <input type="hidden" id="post_format_audio" name="post_format_audio" value="<?php echo($url); ?>" />


        <a class="button" data-filter="audio" id="post_format_audio_select">
            <span class="dashicons dashicons-format-audio"></span>
            Select Audio
        </a>

        <span class="pfp-or-hr">or use an oembed url</span>
        <input type="url" id="post_format_audio_url" value="<?php echo($url); ?>" />
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
        }else {
            delete_post_meta($post_id, '_post_format_audio');
        }
    }

}
