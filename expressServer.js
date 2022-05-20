//REQUIREMENTS 
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const generateRandomString = function() {
  let ranString = ''
  let char = 'ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrst0123456789'
  let charLength = char.length;
  for(let i = 0; i <= 6; i++) {
    ranString += char.charAt(Math.floor(Math.random() * charLength));
   }
   return ranString;
};

const getUserByEmail = function(email,userDatabase) {
  for(const user in userDatabase){
    if(userDatabase[user].email === email)
      return user;
  }
}


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//SETUP AND MIDDLEWARES
const app = express();
const port = 8080;
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({entended: true}));
app.use(cookieParser());

// ROUTES / ENDPOINTS

app.get("/register", (req, res) => {

  console.log('hello')
  const templateVars = {
    user_id: req.cookies["user_id"]
  };
  res.render('registerform',templateVars);
});

app.post("/register",(req,res) => {
  let email = req.body.email;
  let password = req.body.password;
  let user_id = generateRandomString();
  let user = { id:user_id, 
    email, 
    password}
  if(!email || !password){
    return res.status(400).send('Email and password can not be empty');
  }
  if(getUserByEmail(email,users)){
    return res.status(400).send('Email already exist');
  }
  users[user_id] = user;
  res.cookie('user_id',user.id)
  console.log(users)
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL2 = urlDatabase[shortURL]
  res.redirect(longURL2);
});
app.post('/urls/:shortURL/delete',(req,res) => {
  const shortURL = req.params.shortURL
  console.log(shortURL)
  //const longURL = urlDatabase[shortURL]
  delete urlDatabase[shortURL];
  res.redirect('/urls')
  
});
app.get('/login',(req,res) => {
  const templateVars = {
    user_id: req.cookies["user_id"]
  };
  res.render('login',templateVars)
});

app.post('/login',(req,res) => {
  console.log('req body',req.body.email)
  const email = req.body.email;
  const password = req.body.password;
  const user = getUserByEmail(email,users);
  if(!user) {
    return res.status(403).send('Email does not exist');
  } if(user) {
      if(users[user].password !== password) {
        return res.status(403).send('Password and Email does not match'); 
      }
  }
  res.cookie('user_id',user);
  res.redirect('/urls')
});

app.post('/logout',(req,res) => {
  res.clearCookie('user_id')
  res.redirect('/urls')
});

app.post('/urls/:id',(req,res) => {
  const shortURL = req.params.id
  const longURL = req.body.longURL
  console.log(shortURL)
  //const longURL = urlDatabase[shortURL]
  urlDatabase[shortURL] = longURL
  res.redirect('/urls')
})


app.get('/urls',(req,res) => {
  const templateVars = {
    users,
    urls: urlDatabase,
    user_id: req.cookies["user_id"]
  };
  res.render('urls_index',templateVars);
  
});

app.get('/urls/new',(req,res) => {
  const templateVars = {
    users,
    urls: urlDatabase,
    user_id: req.cookies["user_id"]
  };
  res.render('urls_new',templateVars);
});

app.get('/urls/:shortURL',(req,res) => {
  const templateVars = {
    users,
    shortURL: req.params.shortURL,
    longURL:urlDatabase[req.params.shortURL],
    user_id: req.cookies["user_id"]
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

app.get('*',(req,res) => {
  res.render('404');
});

 // LISTENER / 
app.listen(port,() =>{
  console.log(`server is listening to port ${port}`)
});