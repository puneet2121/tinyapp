const express = require('express');
const app = express();
const port = 8080;

const urlDatabse = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'

};
app.get('/',(req,res) => {
  res.send('hello');
});
app.listen(port,() => {
  console.log(`app listeingn on port ${port}`);
});