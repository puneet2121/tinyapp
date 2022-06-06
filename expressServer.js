//REQUIREMENTS
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const {getUserByEmail} = require('./helpers');
const {generateRandomString} = require('./helpers');

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userId: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userId: "aJ48lW"
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
};


//SETUP AND MIDDLEWARES
const app = express();
const port = 8082;
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({entended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


// ROUTES / ENDPOINTS

app.get('/',(req,res) => {
  res.redirect('/urls');
});
//register get request
app.get("/register", (req, res) => {
  const userId = req.session["userId"];
  const email = users[userId];
  const templateVars = {
    email,
    userId: req.session["userId"]
  };
  res.render('registerform',templateVars);
});
//register post request
app.post("/register",(req,res) => {
  const email = req.body.email;
  const userId = generateRandomString();    //generating user id
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = { id:userId,
    email,
    hashedPassword};
  if (!email || !password) {
    return res.status(400).send('Email and password can not be empty');
  }
  if (getUserByEmail(email,users)) {
    return res.status(400).send('Email already exist');
  }
  users[userId] = user;
  req.session.userId = userId;
  res.redirect('/urls');
});
//shortUrl get request
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.status(403).send('This shortId does not exist');
  }
  const longURL2 = urlDatabase[shortURL];
  res.redirect(longURL2.longURL);
});
//post delete routes
app.post('/urls/:shortURL/delete',(req,res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).render('401');
  }
  delete urlDatabase[shortURL];
  res.redirect('/urls');
  
});
//get request for login
app.get('/login',(req,res) => {
  const userId = req.session["userId"];
  const email = users[userId];
  const templateVars = {
    email,
    userId: req.session["userId"]
  };
  res.render('login',templateVars);
});
//post route for login
app.post('/login',(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userId = getUserByEmail(email,users);
  if (!userId) {
    return res.status(403).send('Email does not exist');
  } if (userId) {
    if (!(bcrypt.compareSync(password,users[userId].hashedPassword))) {
      return res.status(403).send('Password and Email does not match');
    }
  }
  req.session.userId = userId;
  res.redirect('/urls');
});
//logout route deleting the cookies after logout
app.post('/logout',(req,res) => {
  req.session = null;               //deleting the cookies for security after logout
  res.redirect('/urls');
});
//post request for url:id
app.post('/urls/:id',(req,res) => {
  const shortURL = req.params.id;
  const longURL = req.body.longURL;
  const userId = req.session.userId;  // creating encrypted cookie
  const user = {
    longURL,
    userId,
  };
  urlDatabase[shortURL] = user;
  res.redirect('/urls');  //redirect to urls
});
// get request for urls
app.get('/urls',(req,res) => {
  const userId = req.session["userId"];
  const email = users[userId] ? users[userId].email : '';
  let usersUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userId === userId) {
      usersUrls[url] = urlDatabase[url];
    }
  }
  const templateVars = {
    email,
    users,
    usersUrls,
    userId
  };
  res.render('urls_index',templateVars);
  
});
// get routes for urls/new
app.get('/urls/new',(req,res) => {
  const userId = req.session["userId"];
  const email = users[userId] ? users[userId].email : '';
  const templateVars = {
    users,
    email,
    urls: urlDatabase,
    userId: req.session["userId"]
  };
  if (!userId) {
    return res.redirect('/urls');
  }
  res.render('urls_new',templateVars);
});

app.get('/urls/:shortURL',(req,res) => {
  const userId = req.session["userId"];
  const email = users[userId] ? users[userId].email : '';
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).render('404');
    return;
  }
  const url = urlDatabase[req.params.shortURL];
  if (url.userId !== userId) {
    res.status(401).render('401');  //sending error page
    return;
  }
  const templateVars = {
    users,
    email,
    shortURL: req.params.shortURL,
    longURL:url.longURL,
    userId: req.session["userId"]
  };

  res.render('urls_show',templateVars);
});
// post routes for urls
app.post('/urls',(req,res) => {
  const longURL = req.body.longURL;
  const userId = req.session.userId;
  const shortURL = generateRandomString();
  const user = {
    longURL,
    userId,
  };
  urlDatabase[shortURL] = user;
  res.redirect(`/urls/${shortURL}`); // redirect to urls/shorturl
});

app.get('*',(req,res)=> {
  res.render('404');
});

// LISTENER /
app.listen(port,() =>{
  console.log(`server is listening to port ${port}`);
});