//server configuration
const express = require('express');
const app = express();
const port = 3000;  
const dotenv = require('dotenv');
dotenv.config();

//static files configuration
app.use(express.static('public'));

//enable req.body
app.use(express.urlencoded({ extended: true }));

const Pool = require('pg').Pool;
const db = new Pool({
    user :  process.env.DB_USER,
    password : process.env.DB_PASS,
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    database : process.env.DB_NAME
});

//template engine
const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: app,
  noCache: true,
})


//donors array
const donors = [
  {
    name: "Diego Fernandes",
    blood: "AB+"
  },
  {
    name: "Cleiton Souza",
    blood: "B+"
  },
  {
    name: "Robson Marques",
    blood: "A+"
  },
  {
    name: "Mayk Brito",
    blood: "O+"
  },
  {
    name: "Jose Silva",
    blood: "AB+"
  }
]


//page view
app.get('/', function(req, res) {
    const donors = [];

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro no banco de dados.");
    
        const donors = result.rows;

        return res.render('index.html', { donors });
        
        });
})


app.post('/', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

    //donors.push({ name, blood });

    if (name == "" || email == "" || blood == "") {
      return res.send("Todos os campos são obrigatórios.");
    }

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`;

    const values = [name, email, blood];
    
    db.query(query, values, function(err) {
      if (err) return res.send("Erro no banco de dados.");

      return res.redirect('/');
    })
  })


//start server and show message
app.listen(port, function() {
  console.log(`Server is running on port ${port}`);
})