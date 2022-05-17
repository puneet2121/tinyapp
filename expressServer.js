const express = require('express');
const app = express();
const port = 8080;

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({entended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine','ejs');
app.get('/urls',(req,res) => {
  const templeVars = {urls: urlDatabase};
  res.render('urls_index',templeVars);
});

//get http://localhost:8080/urls/b2xVn2
//get http://localhost:8080/urls/9sm5xK

app.get('/urls/new',(req,res) => {
  res.render('urls_new');
});

app.get('/urls/:myshortURL',(req,res) => {
  const templeVars = {
    shortURL: req.params.myshortURL,
    longURL:urlDatabase[req.params.myshortURL]
  };
  res.render('urls_show',templeVars);
})


app.get('/hello',(req,res) => {
  const templateVars = {greeting: 'Hello World'};
  res.render('hello_world',templateVars)
});
app.post('/urls',(req,res) => {
  console.log(req.body);
  res.send('ok');
});
function generateRandomString() {
  let ranString = ''
  let char = 'ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrst$%&*0123456789'
  let charLength = char.length
  for(let i = 0; i <= 6; i++){
    ranString += characters.charAt(Math.floor(Math.random() * 
 charLength));
   }
   return ranString;
}
generateRandomString();
 
app.listen(port,() =>{
  console.log(`server is listening to port ${port}`)
});