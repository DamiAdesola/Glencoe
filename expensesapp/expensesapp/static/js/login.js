const UserNameField=document.querySelector('#UserNameField');
const UsernameFeedBackSection=document.querySelector('.username-feedback')
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
                if (data.username_error){
                    UserNameField.classList.remove('is-invalid');
                    UserNameField.classList.add('is-valid');
                    submitBtn.disabled=false;
                }
                else{
                    UserNameField.classList.add('is-invalid');
                    UsernameFeedBackSection.style.display = "block";
                    UsernameFeedBackSection.innerHTML = `<p>User does not Exist</p> `
                    submitBtn.disabled = true;
                }
            })
    }

    if (UserNameValidation.length <= 0){
        UserNameField.classList.remove('is-valid');
        UserNameField.classList.add('is-invalid');
    }
    
});