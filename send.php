<?php
/**
 * Check to see if all fields that are required have been submitted
 *
 * @return boolean
 */
function isValid(){
    if(
        $_POST['fname'] != '' &&
        $_POST['lname'] != '' &&
        $_POST['email'] != '' &&
        $_POST['message'] != ''
    ) {
        return true;
    }
    return false;
}

// Declare variables to prepare for form submission
$success_output = '';
$error_output = '';

if (isValid()) {
    $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify'; // URL to the reCAPTCHA server
    $recaptcha_secret = 'yoursecretkeyhere'; // Secret key
    $recaptcha_response = $_POST['recaptchaResponse']; // Response from reCAPTCHA server, added to the form during processing
    $recaptcha = file_get_contents($recaptcha_url.'?secret='.$recaptcha_secret.'&response='.$recaptcha_response); // Send request to the server
    $recaptcha = json_decode($recaptcha); // Decode the JSON response
    if($recaptcha->success == true && $recaptcha->score >= 0.5 && $recaptcha->action == "contact"){ // If the response is valid
        // run email send routine
        $success_output = 'Your message was sent successfully.'; // Success message
    }else{
        $error_output = 'Something went wrong. Please try again later'; // Error message
    }
}else{
    $error_output = 'Please fill out all of the required fields.'; // Error message
}
// Output error or success message
$output = [
    'error' => $error_output,
    'success' => $success_output
];

// Return the output in JSON format
echo json_encode($output);