const UserNameField=document.querySelector('#UserNameField');
const UsernameFeedBackSection=document.querySelector('.username-feedback')
const EmailField=document.querySelector('#EmailField');
const EmailFeedBackSection=document.querySelector('.email-feedback')
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#PasswordField');

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
                console.log("response",data);
                if (data.username_error){
                    UserNameField.classList.add('is-invalid');
                    UsernameFeedBackSection.style.display = "block";
                    UsernameFeedBackSection.innerHTML = `<p>${data.username_error}</p> `
                }
            })
    }
    
});


EmailField.addEventListener("keyup", (value) => {
    const EmailValidation = value.target.value;
    EmailField.classList.remove('is-invalid');
    EmailFeedBackSection.style.display = "none";

    if (EmailValidation.length > 0){
        fetch("/authentication/validate-email",{
            body:JSON.stringify({email: EmailValidation}), 
            method:"POST"
        })
            .then(res => res.json())
            .then((data) => {
                console.log("response",data);
                if (data.email_error){
                    EmailField.classList.add('is-invalid');
                    EmailFeedBackSection.style.display = "block";
                    EmailFeedBackSection.innerHTML = `<p>${data.email_error}</p> `
                }
            })
    }
    
});