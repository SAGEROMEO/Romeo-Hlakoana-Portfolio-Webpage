// Main JavaScript for the portfolio website


document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js loaded');

  
  const nameInput = document.getElementById('name');
  if (nameInput) {
    nameInput.addEventListener('focus', () => {
      nameInput.style.borderColor = '#0066cc';
      nameInput.style.boxShadow = '0 0 5px #0066cc';
    });
    nameInput.addEventListener('blur', () => {
      nameInput.style.borderColor = '';
      nameInput.style.boxShadow = '';
    });
  }

  // Ensure EmailJS SDK is available, load dynamically if needed
  function ensureEmailJSSDK(cb){
    if(window.emailjs) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
    s.onload = cb;
    s.onerror = function(){
      console.warn('Failed to load EmailJS SDK');
      cb();
    };
    document.head.appendChild(s);
  }

  ensureEmailJSSDK(function(){
    // EmailJS configuration
    const EMAILJS_PUBLIC_KEY = 'JEgmrF57ZnriPmcpc';
    const EMAILJS_SERVICE_ID = 'service_by5l9dh';
    const EMAILJS_TEMPLATE_ID = 'template_vxrsi2i';
    if(window.emailjs && typeof emailjs.init === 'function' && EMAILJS_PUBLIC_KEY){
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const btn = document.getElementById('sendEmailBtn');
    if(!btn) return;
    btn.addEventListener('click', function(){
      const nameEl = document.getElementById('contactName');
      const emailEl = document.getElementById('contactEmail');
      const statusEl = document.getElementById('emailStatus');

      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const messageEl = document.getElementById('contactMessage');
      const message = messageEl ? messageEl.value.trim() : '';

      if(!name){
        statusEl.textContent = 'Please enter your full name.';
        statusEl.style.color = 'red';
        return;
      }

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!email || !emailRe.test(email)){
        statusEl.textContent = 'Please enter a valid email address.';
        statusEl.style.color = 'red';
        return;
      }

      // phone/contact field removed; no phone validation

      if(!message){
        statusEl.textContent = 'Please enter a message.';
        statusEl.style.color = 'red';
        return;
      }

      const templateParams = {
        from_name: name,
        from_email: email,
        message: message
      };

      btn.disabled = true;
      statusEl.textContent = 'Sending...';
      statusEl.style.color = '#333';

      if(!window.emailjs || typeof emailjs.send !== 'function'){
        console.error('EmailJS not available');
        statusEl.textContent = 'Email service unavailable.';
        statusEl.style.color = 'red';
        btn.disabled = false;
        return;
      }

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response){
          statusEl.textContent = 'Email sent successfully!';
          statusEl.style.color = 'green';
          btn.disabled = false;
        }, function(error){
          console.error('EmailJS error:', error);
          statusEl.textContent = 'Failed to send email.';
          statusEl.style.color = 'red';
          btn.disabled = false;
        });
    });
  });

});



(function () {
  "use strict";
  /*
   * Form Validation
   */

  // Fetch all the forms we want to apply custom validation styles to
  const forms = document.querySelectorAll(".needs-validation");
  const result = document.getElementById("result");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          form.querySelectorAll(":invalid")[0].focus();
        } else {
          /*
           * Form Submission using fetch()
           */

          const formData = new FormData(form);
          event.preventDefault();
          event.stopPropagation();
          const object = {};
          formData.forEach((value, key) => {
            object[key] = value;
          });
          const json = JSON.stringify(object);
          result.innerHTML = "Please wait...";

          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: json
          })
            .then(async (response) => {
              let json = await response.json();
              if (response.status == 200) {
                result.innerHTML = json.message;
                result.classList.remove("text-gray-500");
                result.classList.add("text-green-500");
              } else {
                console.log(response);
                result.innerHTML = json.message;
                result.classList.remove("text-gray-500");
                result.classList.add("text-red-500");
              }
            })
            .catch((error) => {
              console.log(error);
              result.innerHTML = "Something went wrong!";
            })
            .then(function () {
              form.reset();
              form.classList.remove("was-validated");
              setTimeout(() => {
                result.style.display = "none";
              }, 5000);
            });
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

let uploadedFile;

document.getElementById("fileInput").addEventListener("change", function(e){

uploadedFile = e.target.files[0];

if(uploadedFile){
document.getElementById("fileName").textContent =
"Uploaded: " + uploadedFile.name;
}

});

function downloadFile(){

if(!uploadedFile){
alert("Please upload a file first");
return;
}

const url = URL.createObjectURL(uploadedFile);

const a = document.createElement("a");
a.href = url;
a.download = uploadedFile.name;

document.body.appendChild(a);
a.click();

document.body.removeChild(a);

URL.revokeObjectURL(url);

}

function downloadData(){

const formData = {
name: document.getElementById("name").value,
surname: document.getElementById("surname").value,
gender: document.getElementById("gender").value,
nationality: document.getElementById("nationality").value,
languages: document.getElementById("languages").value
};

const blob = new Blob(
[JSON.stringify(formData, null, 2)],
{type:"application/json"}
);

const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "candidate_profile.json";
a.click();

URL.revokeObjectURL(url);

}

