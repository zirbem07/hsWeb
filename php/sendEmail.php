<?php
require 'vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$mail = new PHPMailer;

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.mailgun.org';                     // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'support@hchep.com';                // SMTP username
$mail->Password = 'nowwego!';                         // SMTP password
$mail->SMTPSecure = 'tls';                            // Enable encryption, only 'tls' is accepted

$mail->From = $request->email;
$mail->FromName = 'Health Snaps SignUp Started';
$mail->addAddress('max@healthsnaps.com'); 
$mail->addAddress('jordan@healthsnaps.com');
$mail->addAddress('sean@healthsnaps.com');
// $mail->addAddress('lbalcerakhc@outlook.com');
$mail->WordWrap = 50;                                 // Set word wrap to 50 characters

$mail->Subject = 'Snaps Individual Signup';
$mail->Body    = "Sign Up started " . $request->email;



if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo . $mail->Body;
} else {
        echo "success";
        //header("Location: ../../thankyou.html");;
}