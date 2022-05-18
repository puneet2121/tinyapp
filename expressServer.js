//REQUIREMENTS 
const express = require('express');
const bodyParser = require('body-parser');

const generateRandomString = function() {
  let ranString = ''
  let char = 'ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrst0123456789'
  let charLength = char.length
  for(let i = 0; i <= 6; i++) {
    ranString += char.charAt(Math.floor(Math.random() * charLength));
   }
   return ranString;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//SETUP AND MIDDLEWARES
const app = express();
const port = 8080;
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({entended: true}));

// ROUTES / ENDPOINTS

app.get('/urls',(req,res) => {
  const templateVars = {
    urls: urlDatabase
  };
  res.render('urls_index',templateVars);
});

app.get('/urls/new',(req,res) => {
  res.render('urls_new');
});

app.get('/urls/:shortURL',(req,res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL:urlDatabase[req.params.shortURL]
  };
  res.render('urls_show',templateVars);
})


app.get('/hello',(req,res) => {
  const templateVars = {greeting: 'Hello World'};
  res.render('hello_world',templateVars)
});

app.post('/urls',(req,res) => {
  console.log(req.body);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`)
});

 // LISTENER / 
app.listen(port,() =>{
  console.log(`server is listening to port ${port}`)
});