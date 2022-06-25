window.addEventListener("load", function(){ // Wait for the page to load

    "use strict"; // Strict mode for JavaScript

    const form = document.querySelector(".contact") // Get the form

    form.addEventListener("submit", function (event){
        event.preventDefault() // Prevent the default action of the form
        let fields = document.querySelectorAll(".contact .form-control") // Get all the fields
        let valid = true
        for (var i = 0; i < fields.length; i++) {
            fields[i].classList.remove("no-error") // Remove the no-error class from all fields
            if(fields[i].value === ""){ // If the field is empty
                fields[i].classList.add("has-error")
                fields[i].nextElementSibling.style.display = "block"
                valid = false
            }else{ // If the field is not empty
                fields[i].classList.remove("has-error")
                fields[i].classList.add("no-error")
                fields[i].nextElementSibling.style.display = "none"
            }
        }
        if(valid){ // If all the fields are valid
            document.querySelector(".formfields").style.display = "none"
            document.querySelector("#alert").innerText = "Processing your submission, please wait..."
            grecaptcha.ready(function() { // Wait for the recaptcha to be ready
                grecaptcha
                    .execute("yoursitekeyhere", {
                        action: "contact"
                    }) // Execute the recaptcha
                    .then(function(token){
                        
                        let recaptchaResponse = document.getElementById("recaptchaResponse")
                        recaptchaResponse.value = token // Set the recaptcha response

                        fetch("/send.php", {
                            method: "POST",
                            body: new FormData(form), // Send the form data
                        })
                            .then((response) => response.text())
                            .then((response) => {
                                const responseText = JSON.parse(response) // Get the response
                                if(responseText.error !== "") { // If there is an error
                                    document.querySelector("#alert").innerText = responseText.error
                                    document.querySelector("#alert").classList.add("error")
                                    document.querySelector(".formfields").style.display = "block"
                                    return
                                }
                                document.querySelector("#alert").innerText = responseText.success
                                document.querySelector("#alert").classList.add("success")
                                window.location.replace("/thanks") // Redirect to the thanks page
                            })
                    })
            })
        }
    })
})