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
  //get the country codes from our table
  //store them in a countries variable, looping over each
  //pass that data over to ejs
const result = await db.query(
  "Select country_code from visited_countries"
);

let visited_countries = [];
result.rows.forEach((country) => {
  visited_countries.push(country.country_code); 
});
console.log(visited_countries);
  
 let count = visited_countries.length;
res.render('index.ejs', { countries: visited_countries, total: count++ });
 

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
