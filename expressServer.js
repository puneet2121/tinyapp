//REQUIREMENTS 
const express = require('express');
const bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

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
  for(const user in userDatabase) {
    if(userDatabase[user].email === email)
      return user;
  }
}
const urlDatabase = {
  b6UTxQ: {
        longURL: "https://www.tsn.ca",
        user_id: "aJ48lW"
    },
    i3BoGr: {
        longURL: "https://www.google.ca",
        user_id: "aJ48lW"
    }
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
// const password = "purple-monkey-r"; 
// const hashedPassword = bcrypt.hashSync(password, 10);
// console.log({hashedPassword});

//SETUP AND MIDDLEWARES
const app = express();
const port = 8080;
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({entended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


// ROUTES / ENDPOINTS

app.get("/register", (req, res) => {

  console.log('hello')
  const user_id = req.session["user_id"]
  const email = users[user_id]
  const templateVars = {
    email,
    user_id: req.session["user_id"]
  };
  res.render('registerform',templateVars);
});

app.post("/register",(req,res) => {
  let email = req.body.email;
  let user_id = generateRandomString();
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  let user = { id:user_id, 
    email, 
    hashedPassword}
  if(!email || !password){
    return res.status(400).send('Email and password can not be empty');
  }
  if(getUserByEmail(email,users)){
    return res.status(400).send('Email already exist');
  }
  users[user_id] = user;
  req.session.user_id = user_id
  console.log(users)
  res.redirect('/urls')
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if(!urlDatabase[shortURL]){
    return res.status(403).send('This shortId does not exist');
  }
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
  const user_id = req.session["user_id"]
  const email = users[user_id]
  const templateVars = {
    email,
    user_id: req.session["user_id"]
  };
  res.render('login',templateVars)
});

app.post('/login',(req,res) => {
  console.log('req body',req.body.email)
  const email = req.body.email;
  const password = req.body.password;
  const user_id = getUserByEmail(email,users);
  //console.log(users[user].password)
  if(!user_id) {
    return res.status(403).send('Email does not exist');
  } if(user_id) {
      if(!(bcrypt.compareSync(password,users[user_id].hashedPassword))) {
        return res.status(403).send('Password and Email does not match'); 
      }
  }
  req.session.user_id = user_id;
  res.redirect('/urls')
});

app.post('/logout',(req,res) => {
  req.session = null
  res.redirect('/urls')
});

app.post('/urls/:id',(req,res) => {
  const shortURL = req.params.id
  const longURL = req.body.longURL
  const user_id = req.session.user_id
  console.log(shortURL)
  let user = {
    longURL,
    user_id,
  }
  //const longURL = urlDatabase[shortURL]
  urlDatabase[shortURL] = user
  res.redirect('/urls')
})


app.get('/urls',(req,res) => {
  const user_id = req.session["user_id"]
  const email = users[user_id] ? users[user_id].email : ''
  let users_urls = {};
  for(let url in urlDatabase){
    console.log("urlspage",url)
    if(urlDatabase[url].user_id === user_id){
      users_urls[url] = urlDatabase[url];
    }
  }
  const templateVars = {
    email,
    users,
    users_urls,
    user_id
  };
  console.log('uers_urls',templateVars.users_urls)
  res.render('urls_index',templateVars);
  
});

app.get('/urls/new',(req,res) => {
  const user_id = req.session["user_id"]
  const email = users[user_id] ? users[user_id].email : ''
  const templateVars = {
    users,
    email,
    urls: urlDatabase,
    user_id: req.session["user_id"]
  };
  if(!user_id) {
    return res.redirect('/urls');
  }
  res.render('urls_new',templateVars);
});

app.get('/urls/:shortURL',(req,res) => {
  const user_id = req.session["user_id"]
  const email = users[user_id] ? users[user_id].email : ''
  if(!urlDatabase[req.params.shortURL]) {
    res.status(404).render('404');
    return;
  };
  const url = urlDatabase[req.params.shortURL];
  if(url.user_id !== user_id){
    res.status(401).render('401');
    return;
  }
  const templateVars = {
    users,
    email,
    shortURL: req.params.shortURL,
    longURL:url.longURL,
    user_id: req.session["user_id"]
  };

  res.render('urls_show',templateVars);
})


app.get('/hello',(req,res) => {
  const templateVars = {greeting: 'Hello World'};
  res.render('hello_world',templateVars)
});

app.post('/urls',(req,res) => {
  console.log(req.body.longURL);
  let longURL = req.body.longURL;
  const user_id = req.session.user_id
  let shortURL = generateRandomString();
  let user = {
    longURL,
    user_id,
  }
  urlDatabase[shortURL] = user;
  console.log(urlDatabase)
  res.redirect(`/urls/${shortURL}`)
});
app.get('*',(req,res)=> {
  res.render('404')
})



 // LISTENER / 
app.listen(port,() =>{
  console.log(`server is listening to port ${port}`)
});