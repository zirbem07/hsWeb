<?php
require 'vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
require_once './lib/Braintree.php';
require_once './lib/chromeLogger.php';
ChromePhp::log('Hello console!');
// Braintree_Configuration::environment('sandbox');
// Braintree_Configuration::merchantId('mkxnw4k2csv3czsp');
// Braintree_Configuration::publicKey('4cfngmm5x7jryzys');
// Braintree_Configuration::privateKey('7adc5011a089d9c1ea32e1805d47ad8a');

Braintree_Configuration::environment('production');
Braintree_Configuration::merchantId('ssh8pbs3jfyjd78k');
Braintree_Configuration::publicKey('4hcq5p843h6xc6c6');
Braintree_Configuration::privateKey('53859dd8c7219dbbc160d1a1ce702f8f');
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
if($request->code == '1FREE'){
    $planId = '1FREE';
} else if($request->code == 'UPWORK'){
    $planId = '5422';
} else if($request->code == '7NGPT'){
    $planId = '7NGPT';
}else {
    $planId = 'basic';
}

ChromePhp::log($request);
ChromePhp::log($request->code);

try {
    /* First we create a new user using the BT API */
    $result = Braintree_Customer::create(array(
                'firstName' => $request->first_name,
                'lastName' => $request->last_name,
                // 'company' => 'My Company',
                // we can create a credit card at the same time
                'creditCard' => array(
                    'cardholderName' => $request->first_name .''. $request->last_name,
                    'number' => $request->number,
                    'expirationMonth' => $request->month,
                    'expirationYear' => $request->year,
                    'cvv' => $request->cvv,
                    'billingAddress' => array(
                        'firstName' => $request->first_name,
                        'lastName' => $request->last_name,
                        //'company' => 'My Billing Address Company',
                        'streetAddress' => $request->address,
                        'locality' => $request->city,
                        'region' => $request->state, // Two letter code
                        'postalCode' => $request->zip,
                        'countryCodeAlpha2' => 'US'
                    )
                )
            ));

            if ($result->success) {
                // $customerID = $result->customer->id;
                ChromePhp::log("Customer ID: " . $result->customer->id . "<br>");
                ChromePhp::log("Credit card ID: " . $result->customer->creditCards[0]->token . "");
                 $subscriptionData = array(
                    'paymentMethodToken' => $result->customer->creditCards[0]->token,
                    'planId' => $planId
                );

                $result = Braintree_Subscription::create($subscriptionData);
            
                if ($result->success) {
                    $customerID = $result->subscription->id;
                    ChromePhp::log("Subscription ID: " . $result->subscription->id . "<br>");
                    ChromePhp::log("Transaction ID: " . $result->subscription->transactions[0]->id . "<br>");
                    $mail = new PHPMailer;

                    $mail->isSMTP();                                      // Set mailer to use SMTP
                    $mail->Host = 'smtp.mailgun.org';                     // Specify main and backup SMTP servers
                    $mail->SMTPAuth = true;                               // Enable SMTP authentication
                    $mail->Username = 'support@hchep.com';                // SMTP username
                    $mail->Password = 'nowwego!';                         // SMTP password
                    $mail->SMTPSecure = 'tls';                            // Enable encryption, only 'tls' is accepted

                    $mail->From = $request->email;
                    $mail->FromName = 'Health Snaps SignUP';
                    $mail->addAddress('jordan@hchep.com');                 // Add a recipient
                    $mail->addAddress('maxwell.zirbel@hchep.com'); 

                    $mail->WordWrap = 50;                                 // Set word wrap to 50 characters

                    $mail->Subject = 'Snaps Individual Signup';
                    $mail->Body    = "Please Create an account for user:" . $request->email;



                    if(!$mail->send()) {
                        echo 'Message could not be sent.';
                        echo 'Mailer Error: ' . $mail->ErrorInfo . $mail->Body;
                    } else {
                         echo $customerID;
                         //header("Location: ../../thankyou.html");;
                    }

                } else {
                    foreach ($result->errors->deepAll() as $error) {
                        ChromePhp::log($error->code . ": " . $error->message . "<br>");
                        echo($error->message);
                    }
                    exit;
                }
            } else {
                foreach ($result->errors->deepAll() as $error) {
                    ChromePhp::log($error->code . ": " . $error->message . "<br>");
                    echo($error->message);
                }
                exit;
            }

   
} catch (Exception $e) {
    ChromePhp::log('Caught exception: ' . $e . "");
    // $e->getMessage() is empty
}

?>