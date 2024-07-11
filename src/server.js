const express = require("express");
const connect = require("./configs/db");
const path = require("path");
const app = express();

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
  const selectedLang = req.query.lang || 'en'; // Default to English
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
