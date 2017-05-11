<?php
require_once 'mandrill/src/Mandrill.php'; //Not required with Composer
try {
    $mandrill = new Mandrill('4YEh_FeeBJybutI9qvcgkA');
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $template_name =  $request->template;
    $message = array(
        'html' => '',
        'text' => '',
        'subject' => 'Activate Your Health Snaps Account',
        'from_email' => 'jordan@hchep.com',
        'from_name' => 'Health Snaps',
        'to' => array(
            array(
                'email' => $request->email,
                'type' => 'to'
            )
        ),
        'headers' => array('Reply-To' => 'jordan@hchep.com'),
        'important' => false,
        'track_opens' => true,
        'track_clicks' => null,
        'auto_text' => null,
        'auto_html' => null,
        'inline_css' => null,
        'url_strip_qs' => null,
        'preserve_recipients' => null,
        'view_content_link' => null,
        'tracking_domain' => null,
        'signing_domain' => null,
        'return_path_domain' => null,
        'merge' => true,
        'merge_language' => 'mailchimp',
        'global_merge_vars' => array(
            array(
                'name' => 'merge1',
                'content' => 'merge1 content'
            )
        ),
        'merge_vars' => array(
            array(
                'rcpt' => $request->email,
                'vars' => array(
                    array(
                        'name' => 'FNAME',
                        'content' => $request->fname
                    ),
                )
            )
        ),
        'tags' => array('new-customer')
    );
    $result = $mandrill->messages->sendTemplate($template_name, $template_content, $message, $async, $ip_pool, $send_at);
    print_r($result);
    /*
    Array
    (
        [0] => Array
            (
                [email] => recipient.email@example.com
                [status] => sent
                [reject_reason] => hard-bounce
                [_id] => abc123abc123abc123abc123abc123
            )
    
    )
    */
} catch(Mandrill_Error $e) {
    // Mandrill errors are thrown as exceptions
    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    throw $e;
}

?>