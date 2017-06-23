/**
 * Login JavaScript at FrontEnd
 * Created by Alexey S. Kiselev on June 2017.
 */

var submitButton = document.getElementById('dp_submit_button');

submitButton.addEventListener('click',function(e) {
    e.preventDefault();
    var errorStack = [];
    // Check login
    var loginInput = document.getElementById('dp_login_input');
    if(!loginInput.value) {
        errorStack.push('Login');
    }
    // Check password
    var passwordInput = document.getElementById('dp_password_input');
    if(!passwordInput.value) {
        errorStack.push('Password');
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
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
    xhr.onload = function () {
        var registerSuccess = document.getElementById('dp_register_success'),
            loginFormBox = document.getElementById('dp_login_form'),
            response = JSON.parse(this.responseText);
        if(response.status == 'ok') {
            registerSuccess.className += ' dp_show';
            loginFormBox.remove();
            setTimeout(function() {
                window.location.replace('/user/' + response.userid);
            },5000);
        }
        if(response.status == 'nouser') {
            errorBox.className += ' dp_show';
            errorBox.innerText = response.message;
            return false;
        }
    };
    xhr.send(JSON.stringify({
        userid: loginInput.value,
        password: passwordInput.value
    }));
});

function removeClass(elem,name) {
    var re = new RegExp(name,'g');
    return elem.className.replace(re,'').trim();
}