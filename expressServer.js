const express = require('express');
const app = express();
const port = 8080;
app.set('view engine','ejs');
app.get('/urls',(req,res) => {
  const templeVars = {urls: urlDatabase};
  res.render('urls_index',templeVars);
});
app.get('/hello',(req,res) => {
  const templateVars = {greeting: 'Hello World'};
  res.render('hello_world',templateVars)
});


app.listen(port,() =>{
  console.log(`server is listening to port ${port}`)
});