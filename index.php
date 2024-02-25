<?php

/*
  Plugin Name: Quiz
  Description: Give your readers a multiple choice question.
  Version: 1.0
  Author: D. Minkov | isabella-projects
  Author URI: https://github.com/isabella-projects/quiz
*/

if (!defined('ABSPATH')) exit;

class Quiz
{
    function __construct()
    {
        add_action('init', array($this, 'adminAssets'));
    }

    function adminAssets()
    {

        wp_register_style(
            'quiz_edit_css',
            plugin_dir_url(__FILE__) . 'build/index.jsx.css',
        );

        wp_register_script(
            'quiz_block_type',
            plugin_dir_url(__FILE__) . 'build/index.jsx.js',
            [
                'wp-blocks',
                'wp-element',
                'wp-editor'
            ]
        );

        register_block_type('multiple-choice/quiz', [
            'editor_script' => 'quiz_block_type',
            'editor_style' => 'quiz_edit_css',
            'render_callback' => [$this, 'renderQuiz']
        ]);
    }

    public function renderQuiz($attributes)
    {
        wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . 'build/front-end.jsx.js', [
            'wp-element'
        ], '1.0', true);
        wp_enqueue_style('attentionFrontendStyle', plugin_dir_url(__FILE__) . 'build/front-end.jsx.css');

        ob_start();
        include 'templates/render.template.php';
        $output = ob_get_clean();
        return $output;
    }
}

$quiz = new Quiz();
