let host = `http://localhost:3000`

$(document).ready(function(){
    // cekLogin()
    $('#formLogin').hide()
    $('#formRegister').hide()
})

function showFormLogin(){
    $('#formRegister').hide()
    $('#formLogin').show()
}
function showFormRegis(){
    $('#formLogin').hide() 
    $('#formRegister').show()
}
function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: `${host}/users/Glogin`,
        method: 'POST',
        data: {
            token: id_token
        }
    })
    .done(res => {
        // console.log(res);
        // localStorage.setItem('token', res.token)
        // window.location = '/home.html'
    })
    .fail(err => {
        console.log(err);
    })
  }

function register(){
    $.ajax({
        url: `${host}/users`,
        method: 'POST',
        data: {
            name: $('#regisName').val(),
            email: $('#regisEmail').val(),
            password: $('#regisPassword').val()
        }
    })
    .done(res => {
        console.log(res.msg);
        $('#notifRegis').empty()
        $('#notifRegis').append(res.msg)
        $('#regisName').empty()
        $('#regisEmail').empty()
        $('#regisPassword').empty()

    })
    .fail(err => {
        $('#regisPassword').empty()
        $('#notifRegis').empty()
        $('#notifRegis').append(err.responseJSON.err.message)
        console.log(err);
        console.log(err.responseJSON.err.message);
    })
}

function login(){
    $.ajax({
        url: `${host}/users/login`,
        method: 'POST',
        data: {
            email: $('#loginEmail').val(),
            password: $('#loginPassword').val()
        }
    })
    .done(res => {
        console.log(res);
        localStorage.setItem('token', res.token)
        window.location.href = '/home.html'
    })
    .fail(err => {
        console.log(err);
    })
}

function logout(){
    localStorage.removeItem('token')
}