/**
 * Register JavaScript at FrontEnd
 * Created by Alexey S. Kiselev on June 2017.
 */

var registerButton = document.getElementById('dp_register_button');

registerButton.addEventListener('click',function(e) {
    e.preventDefault();
    var errorStack = [];
    // Check login
    var loginInput = document.getElementById('dp_new_login_input');
    if(!loginInput.value) {
        errorStack.push('Login');
    }
    // Check password
    var passwordInput = document.getElementById('dp_new_password_input');
    if(!passwordInput.value) {
        errorStack.push('Password');
    }
    // Check confirmed password
    var passwordAgainInput = document.getElementById('dp_new_again_password_input'),
        errorConfirmBox = document.getElementById('dp_error_confirm_box');
    if(passwordInput.value != passwordAgainInput.value) {
        errorConfirmBox.className += ' dp_show';
        return false;
    } else {
        errorConfirmBox.className = removeClass(errorConfirmBox,'dp_show');
    }
    // Error Handler
    var errorBox = document.getElementById('dp_error_box'),
        spanBox = document.getElementById('dp_login_error');
    if(errorStack.length) {
        spanBox.innerText = errorStack.join(' and ');
        errorBox.className += ' dp_show';
        return false;
    } else {
        errorBox.className = removeClass(errorBox,'dp_show');
    }
    // If no errors received
    var userProfile = document.getElementById('dp_new_userprofile');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/register', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
    xhr.onload = function () {
        var alreadyBox = document.getElementById('dp_register_already'),
            alreadyUserId = document.getElementById('dp_already_userid'),
            alreadyButton = document.getElementById('dp_register_already_button'),
            registerSucces = document.getElementById('dp_register_success'),
            registerForm = document.getElementById('dp_register_form'),
            response = JSON.parse(this.responseText);
        if(response.status == 'ok') {
            registerSucces.className += ' dp_show';
            alreadyBox.remove();
            registerForm.remove();
            setTimeout(function() {
                window.location.replace('/user/'+ response.userid);
            },5000);
        }
        if(response.status == 'already') {
            console.log('Already success');
            alreadyUserId.innerText = response.userid;
            alreadyBox.className += ' dp_show';
            return false;
        }
    };
    xhr.send(JSON.stringify({
        userid: loginInput.value,
        password: passwordInput.value,
        userprofile: userProfile.value
    }));
});

function removeClass(elem,name) {
    var re = new RegExp(name,'g');
    return elem.className.replace(re,'').trim();
}