// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex')

const db= knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'abhay',
        database : 'loginskilltank'}})

const app = express();

let initialpath = path.join(__dirname, 'public')
app.use(bodyParser.json())
app.use(express.static(initialpath));


app.get('/',(req,res)=>{
    res.sendFile(path.join(initialpath,'index.html'));
})

app.get('/login',(req,res)=>{
    res.sendFile(path.join(initialpath,'login.html'));
})

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(initialpath,'signup.html'));
})

app.post('/register-user', (req, res) => {
    const { username, email, password } = req.body;

    if(!username.length || !email.length || !password.length){
        res.json('fill all the fields');
    } else{
        db("users").insert({
            name: username,
            email: email,
            password: password
        })
        .returning(["username", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if(err.detail.includes('already exists')){
                res.json('email already exists');
            }
        })
    }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

 