const UserNameField=document.querySelector('#UserNameField');
const UsernameFeedBackSection=document.querySelector('.username-feedback')
const EmailField=document.querySelector('#EmailField');
const EmailFeedBackSection=document.querySelector('.email-feedback')
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#PasswordField');
const strengthBadge = document.querySelector('.password-strength')
const submitBtn = document.querySelector(".submit-btn")

//NEED TO IMPLEMENT Validation for if both/or email and username are invalid
// Need to implemnt checker for TOS

togglePassword.addEventListener('click', function (e) {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});

UserNameField.addEventListener("keyup", (value) => {
    const UserNameValidation = value.target.value;
    UserNameField.classList.remove('is-invalid');
    UsernameFeedBackSection.style.display = "none";
    
    if (UserNameValidation.length > 0){
        fetch("/authentication/validate-username",{
            body:JSON.stringify({username: UserNameValidation}), 
            method:"POST"
        })
            .then(res => res.json())
            .then((data) => {
                if (data.username_error){
                    UserNameField.classList.add('is-invalid');
                    UsernameFeedBackSection.style.display = "block";
                    UsernameFeedBackSection.innerHTML = `<p>${data.username_error}</p> `
                    submitBtn.disabled = true;
                }
                else{
                    UserNameField.classList.remove('is-invalid');
                    UserNameField.classList.add('is-valid');
                    submitBtn.disabled=false;
                }
            })
    }

    if (UserNameValidation.length <= 0){
        UserNameField.classList.remove('is-valid');
        UserNameField.classList.add('is-invalid');
    }
    
});


EmailField.addEventListener("keyup", (value) => {
    const EmailValidation = value.target.value;
    EmailField.classList.remove('is-invalid');
    EmailField.classList.add('is-valid');
    EmailFeedBackSection.style.display = "none";

    if (EmailValidation.length > 0){
        fetch("/authentication/validate-email",{
            body:JSON.stringify({email: EmailValidation}), 
            method:"POST"
        })
            .then(res => res.json())
            .then((data) => {
                if (data.email_error){
                    EmailField.classList.add('is-invalid');
                    EmailFeedBackSection.style.display = "block";
                    EmailFeedBackSection.innerHTML = `<p>${data.email_error}</p> `
                    submitBtn.disabled = true;
                }
                else{
                    submitBtn.disabled=false;
                }
            })
    }
    
});


let timeout;

let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')
  
function StrengthChecker(PasswordParameter){
    if(strongPassword.test(PasswordParameter) && PasswordParameter.length >= 10) {
        strengthBadge.style.color = "#fff";
        strengthBadge.style.background = "#20a820";
        strengthBadge.textContent = 'Strong';
    } 
    else if(mediumPassword.test(PasswordParameter)){
        strengthBadge.style.color = "#111";
        strengthBadge.style.background = "#e6da44";
        strengthBadge.textContent = 'Medium';
    } 
    else{
        strengthBadge.style.color = "#111";
        strengthBadge.style.background = "#d13636";
        strengthBadge.textContent = 'Weak';
    }
}

  

password.addEventListener("input", () => {

    strengthBadge.style.display= 'block'
    clearTimeout(timeout);

    timeout = setTimeout(() => StrengthChecker(password.value), 200);
 
    if(password.value.length !== 0){
        strengthBadge.style.display != 'block'
    } 
    else{
        strengthBadge.style.display = 'none'
    }
});
