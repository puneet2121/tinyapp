const express = require('express');
const app = express();
const port = 8080;

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


app.listen(port,() =>{
  console.log(`server is listening to port ${port}`)
});