// Подключение express
const express = require("express");
const jwt = require('jsonwebtoken');
const jwt_express = require('express-jwt');
const basicAuth = require('basic-auth');
const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");
const cookieParser = require('cookie-parser');

var jwtCheck = jwt_express({
  secret: 'supersecret'//new Buffer('supersecret', 'base64'),
});

// Создаём объект приложения
const app = express();

app.use(express.static('../react.js'));
app.use(express.json());
app.use(cookieParser());
/*app.use('/jobs', jwtCheck);
app.use('/systems', jwtCheck);
*/
app.use(jwtCheck.unless({path:['/token','/users', '/jobs']}));

// Подключение базы данных
let db = new sqlite3.Database('./myBase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// Авторизация пользователя и создание для него токена
app.get("/token", function(request, response){

    var auth = basicAuth(request);

    let sql = "SELECT * FROM users WHERE login='" + auth.name + "' AND password='" + auth.pass + "'";

    db.all(sql, [], (err, row) => {
        if (err) {
            console.log("Error in get users selecting from db");
            throw err;
            response.status(500);
        };
        if(row.length === 0) {
            response.status(401);
            //response.json({id:0});
            console.log("Error: empty request");
        }
        else {
            response.status(200);
            var token = jwt.sign({username:row[0].login}, 'supersecret', {expiresIn: 1200});
            console.log(token);
            response.json({token:token});
            console.log('user exist: '+row[0].id+' '+row[0].login+' '+row[0].surname+' '+row[0].first_name+'\n');
        }


    });
});

// Регистрация нового пользователя
app.post("/users", function(request, response){
    //console.log(request.body);
    db.run("INSERT INTO users (surname, first_name, second_name, birthdate, gender, login, password, email) VALUES (?,?,?,?,?,?,?,?)", request.body['surname'], request.body['first_name'], request.body['second_name'], request.body['birthdate'], request.body['gender'], request.body['login'], request.body['password'], request.body['email'], function(err){
        if (err){
            if(err.errno === 19) {
                response.status(409);
                response.json({err:"UnUNICUE"});
            }
            else {
                response.status(500);
                response.json({err:"Inner error"});
            }
        }
        else {
            response.status(201);
            console.log("Add new user: " + this.lastID + ' ' + request.body['login'] + ' ' + request.body['email'] + ' ' + request.body['surname'] + ' ' + request.body['first_name']);
            response.json({id:this.lastID});
        }
    });
});

app.delete("/users/:id", function(request, response){
    id = request.params["id"];
    console.log('id of delete users: ' + id);
    db.run("DELETE FROM users WHERE id = ?", request.params['id'], function(err){
        if (err){
            console.error(err.message);
            response.status(500);
        }
        else {
            response.status(200);
        }
        response.end('I do that');
    });
});











app.get("/jobs", function(request, response){

    let sql = `SELECT * FROM jobs`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log("Error in get jobs selecting from db");
            throw err;
            response.status(500);
        }
        else {
            response.status(200);
        }
        /*rows.forEach((row) => {
            console.log(row.name);
        });*/
        console.log("Getting information about all available tasks");
        response.json(rows);
    });

});


const scp = require('scp');
var exec = require('ssh-exec');


app.post("/jobs", function(request, response){
    console.log(request.body);
    db.run("INSERT INTO jobs (name) VALUES (?)", request.body['name'], function(err){
        if (err){
            console.error(err.message);
            response.status(500);
        }
        else {
            var options = {
                file: 'input.txt',
                user: 'ntsupm4x',
                host: 'ssd1.sscc.ru',
                port: '2231',
                path: '/home/nstupm4x/helen'
                //,
//                password: 'nstu2018!@#123'
            }

            /*scp.send(options, function (err) {
                if (err) console.log(err);
                else console.log('File transferred.');
            });
*/
            exec('cd ~/helen; ~/pm01/opp4.exe > hello.txt', {
                user: 'ntsupm4x',
                host: 'ssd1.sscc.ru',
                port: '2231',
                password: 'nstu2018!@#123'
            } , function (err, stdout, stderr) {
                console.log(err, stdout, stderr);
                response.status(201);
            });


        }
        newrowID = this.lastID;
        response.json({id:newrowID});
    });
});

app.delete("/job/:id", function(request, response){
    id = request.params["id"];
    console.log('id of delete jobs: ' + id);
    db.run("DELETE FROM jobs WHERE id = ?", request.params['id'], function(err){
        if (err){
            console.error(err.message);
            response.status(500);
        }
        else {
            response.status(200);
        }
        response.end('I do that');
    });
});

/*app.post('/runningjobs',func(){}
);
*/




app.get("/allusers", function(request, response){

    let sql = `SELECT * FROM users`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log("Error in get jobs selecting from db");
            throw err;
            response.status(500);
        }
        else {
            response.status(200);
        }
        response.json(rows);
    });

});












app.get("/systems", function(request, response){

    let sql = `SELECT * FROM systems`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log("Error in get users selecting from db");
            throw err;
        }
        /*rows.forEach((row) => {
            console.log(row.name);
        });*/
        console.log("Getting information about all available computing systems");
        response.json(rows);
    });

});

app.post("/systems", function(request, response){
    console.log(request.body);
    db.run("INSERT INTO systems (name) VALUES (?)", request.body['name'], function(err){
        if (err){
            console.err(err);
            response.status(500);
        }
        else {
            response.status(201);
        }
        newrowID = this.lastID;
        response.json({id:newrowID});
    });
});

app.delete("/system/:id", function(request, response){
    id = request.params["id"];
    console.log('id of delete systems: ' + id);
    db.run("DELETE FROM systems WHERE id = ?", request.params['id'], function(err){
        if (err){
            console.err(err);
            response.status(500);
        }
        else {
            response.status(200);
        }
        response.end('I do that');
    });
});




app.get("/notreadytasks", function(request, response){

    let sql = `SELECT * FROM runningTasks`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.log("Error in get users selecting from db");
            throw err;
        }
        /*rows.forEach((row) => {
            console.log(row.name);
        });*/
        console.log("Getting information about all running tasks");
        response.json(rows);
    });

});



// Начинаем прослушивать подключения на 3000 порту
app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
