import { server, genericLaddername, genericPlayername, postData, getData } from './basicConfig.js'

window.resetUser = function (password, username) {
    postData.body = JSON.stringify({ "password": password, username: username });
    fetch(server + '/login/resetpassword', postData)
        .then(function (response) {
            console.log("OK");
        });
}

window.resetLadder = function (password, username) {
    postData.body = JSON.stringify({ "password": password, laddername: username });
    fetch(server + '/user/resetpassword', postData)
        .then(function (response) {
            console.log("OK");
        });
}