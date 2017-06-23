/**
 * User Profile JavaScript at FrontEnd
 * Created by Alexey S. Kiselev on June 2017.
 */

var editButton = document.getElementById('dp_edit_userprofile_button');

editButton.addEventListener('click', function(e) {
    e.preventDefault();
    var userProfileBlock = document.getElementById('dp_userprofile'),
        userProfileForm = document.getElementById('dp_userprofile_form'),
        editProfileCancel = document.getElementById('dp_cancel_userprofile'),
        userProfileTextarea = document.getElementById('dp_new_userprofile'),
        userProfileInitial = document.getElementById('dp_userprofile_initial'),
        userProfileUpdate = document.getElementById('dp_update_userprofile_button');
    userProfileForm.className += ' dp_show';
    userProfileBlock.className = 'dp_hide';
    // Event for Cancel Button
    editProfileCancel.addEventListener('click', function(e){
        e.preventDefault();
        userProfileTextarea.value = userProfileInitial.innerText;
        userProfileForm.className = removeClass(userProfileForm,'dp_show');
        userProfileBlock.className = removeClass(userProfileBlock,'dp_hide');
    });
    // Event for Update Button
    userProfileUpdate.addEventListener('click', function(e){
        e.preventDefault();
        var xhr = new XMLHttpRequest(),
            userProfileUserId = document.getElementById('dp_userprofile_userid').value;
        xhr.open('POST', '/user/' + userProfileUserId, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
        xhr.onload = function () {
            var response = JSON.parse(this.responseText);
            if(response.status == 'ok') {
                userProfileInitial.innerText = userProfileTextarea.value;
                userProfileForm.className = removeClass(userProfileForm,'dp_show');
                userProfileBlock.className = removeClass(userProfileBlock,'dp_hide');
            }
            if(response.status == 'error') {
                alert('Error');
                return false;
            }
        };
        xhr.send(JSON.stringify({
            userid: userProfileUserId,
            userprofile: userProfileTextarea.value
        }));
    });
});

function removeClass(elem,name) {
    var re = new RegExp(name,'g');
    return elem.className.replace(re,'').trim();
}