import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "password",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("Select country_code from visited_countries");
  let visited_countries = [];
  result.rows.forEach((country) => {
    visited_countries.push(country.country_code);
  });
  // console.log(visited_countries);

  let count = visited_countries.length;
  res.render("index.ejs", { countries: visited_countries, total: count++ });
});

//create app.post (/add) just like .get
// get user input
//check that input against the countries list.
//if it exists, get the country code
//add the country code to visited_countries
//refresh page
app.post("/add", async (req, res) => {
  let userInput = req.body.country;
  //  console.log("user input = " + userInput);

  const match = await db.query(
    "SELECT * FROM countries WHERE country_name = $1",
    [userInput]
  );

  let countryName = match.rows[0].country_name;
  let countryCode = match.rows[0].country_code;
  // console.log("just country code " + countryCode);
  // console.log("just country name " + countryName); 
  if (userInput === countryName) {
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      countryCode,
    ]);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
