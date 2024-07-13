const express = require("express");
const connect = require("./configs/db");
const i18n = require('i18n');
const path = require("path");
const app = express();
const cookieParser = require('cookie-parser');

i18n.configure({
  locales: ['sp', 'hi', 'pr', 'ch', 'fr', 'en'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  objectNotation: true,
  register: global,
  syncFiles: true,
  getCookie: function(req) {
    return req.cookies && req.cookies.lang ? req.cookies.lang : 'en';
  }
});

app.use(cookieParser());

app.get('/change-lang/:lang', (req, res) => {
  const lang = ['sp', 'hi', 'pr', 'ch', 'fr', 'en'].includes(req.params.lang) ? req.params.lang : 'en';
  res.cookie('lang', lang, { httpOnly: true });
  res.redirect('back');
});

app.use((req, res, next) => {
  if (!req.cookies || !req.cookies.lang) {
    res.cookie('lang', 'en', {httpOnly: true });
    req.cookies = req.cookies || {};
    req.cookies.lang = 'en';
  }
  next();
});

app.use(i18n.init);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const userController = require("./controllers/user.controller");
const pageController = require("./controllers/page.controller");
const User = require("./models/user.model");

const languages = ['en', 'hi', 'fr', 'de', 'es', 'zh'];

// const domainController = require("./controllers/domain.controller");
// const locationController = require("./controllers/location.controller");
const internshipController = require("./controllers/internship.controller");

app.use((req, res, next) => {
  const selectedLang = req.query.lang || 'hi'; // Default to English
  if (!languages.includes(selectedLang)) {
    return res.status(400).send('Invalid language');
  }
  req.lang = selectedLang;
  next();
});

app.use("/users", userController);
app.use("/pages", pageController);
app.use("/data", internshipController);

app.get('/', (req, res) => {
  locale: req.getLocale(),
  res.redirect(301, "/pages/index.ejs");
})

app.listen("2222", async () => {
  try {
    await connect();
    console.log("listening at 2222");
  } catch (err) {
    console.log(err);
  }
});
