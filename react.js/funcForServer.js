
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
};

function authorizedRequest(requestType, string)
{
    var xhr = new XMLHttpRequest();
    xhr.open(requestType, string, false);
    var token = getCookie("token");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    return xhr;
}
// Получение списка задач и/или вычислиетльных систем
function GetList (string) {
    // Создаём новый объект XMLHttpRequest
    var xhr = authorizedRequest('GET', string);
    xhr.send();

    if (xhr.status !== 200) {
        alert( xhr.status + ': ' + xhr.statusText );
    }
    else {
        var list = JSON.parse(xhr.responseText);
        return list;
    }
};

// Авторизация пользователя
function DataForInput (login, password) {
    // Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/token', false);
    xhr.setRequestHeader("Authorization", "Basic " + btoa(login+":"+password));
    xhr.send();

    if (xhr.status !== 200 && xhr.status !== 401) {
        alert( xhr.status + ': ' + xhr.statusText );
    }
    else {
        if (xhr.status === 401)
            alert("Error: wrong login/password ");
        else {

            console.log("token user: "+JSON.parse(xhr.responseText).token);
            document.cookie = "token=" + JSON.parse(xhr.responseText).token;
            window.location.href = "personalAccount.html";
        }
    }
};


/*function DataForInput (login, password) {

    var list = GetList('/allusers');

    var user = 0;
    //var count = 0;
    for (var i = 0; i < list.length; i++) {
        if(list[i].login === login && list[i].password === password) {
            user = list[i];
            //count = 1;
        }
    }

    if (user === 0)
        alert("Error: wrong login/password ");
    else {
        console.log("id user and login : " + user.id + ' ' + user.login);
        document.cookie = "login=" + user.login;
        window.location.href = "personalAccount.html";
    }
}*/






// Регистрация нового пользователя
function AddNewUser (jsonstr) {
    // Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/users', false);
    xhr.setRequestHeader("Content-Type", "application/json");

    var data = JSON.stringify(jsonstr);
    xhr.send(data);

    if (xhr.status !== 201 && xhr.status !== 409) {
        console.log( xhr.status + ': ' + xhr.statusText + '\n' + JSON.parse(xhr.responseText).err);
        console.log("i`m here");
    }
    else {
        if(xhr.status === 409) {
            console.log( xhr.status + ': ' + JSON.parse(xhr.responseText).err);
            alert("Error: this login/email already exist.");
        }
        else {
            var result = JSON.parse(xhr.responseText);
            console.log('id new user: ' + result.id);
            window.location.href="success.html";
        }
    }
}
