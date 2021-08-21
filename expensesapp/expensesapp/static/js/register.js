const UserNameField=document.querySelector('#UserNameField');
const FeedBackSection=document.querySelector('.invalid-feedback')

UserNameField.addEventListener("keyup", (value) => {
    console.log('User Typing');

    const UserNameValidation = value.target.value;
    
    UserNameField.classList.remove('is-invalid');
    FeedBackSection.style.display = "none";
    
    if (UserNameValidation.length > 0){9
        fetch("/authentication/validate-username",{
            body:JSON.stringify({username: UserNameValidation}), 
            method:"POST"
        })
            .then(res => res.json())
            .then((data) => {
                console.log("response",data);
                if (data.username_error){
                    UserNameField.classList.add('is-invalid');
                    FeedBackSection.style.display = "block";
                    FeedBackSection.innerHTML = `<p>${data.username_error}</p> `
                }
            })
    }
    
});