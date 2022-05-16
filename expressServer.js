const express = require('express');
const app = express();
const port = 8080;

const urlDatabse = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'

};
app.get('/hello',(req,res) => {
  res.send('<html><body>Hello<b>World</b></body></html>\n');
});
app.get('/urls.json',(req,res) => {
  res.json(urlDatabse);
});
app.listen(port,() => {
  console.log(`app listening on port ${port}`);
});