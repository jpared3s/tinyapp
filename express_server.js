const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

function generateRandomString() {
  let result = '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function getUserByEmail(email) {
  let user;
  for (let key in users) {
    if (users[key].email === email) {
      user = users[key];
      break;
    }
  }
  return user;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    // urls: urlDatabase
  };
  res.render('urls_new', templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body); // Log the POST request body to the console
  // console.log(generateRandomString());
  let shortId = generateRandomString();
  // console.log(urlDatabase)
  urlDatabase[shortId] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortId}`); // Respond with 'Ok' (we will replace this)
});

app.get("/u/:id", (req, res) => {
  const shortID = req.params.id;
  console.log(shortID);
  const longURL = urlDatabase[shortID];
  console.log(longURL);
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  res.redirect(`/urls/${id}`);
});
app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  const newURL = req.body.NewLongURL;
  for (let URL in urlDatabase) {
    if (URL === id) {
      urlDatabase[id] = newURL;
      return res.redirect('/urls');
    }
  }
});
app.post("/login", (req, res) => {
  res.cookie("user_id", req.body.email);
  // res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true })
  res.redirect('/urls');
});
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Error: Email and password are required');
  }
  if (getUserByEmail(email)) {
    return res.status(400).send('Error: Email already in use');
  }
  const userId = generateRandomString();
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("user_id", userId);
  console.log(users);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

