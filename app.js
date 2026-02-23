const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const cors = require('cors')

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors())

// MySQL Connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'admin',
  password: process.env.MYSQL_PASSWORD || 'Admin123456',
  database: process.env.MYSQL_DATABASE || 'smarttodo'
});

connection.connect(function(err) {
  if (err) {
    console.log("Error connecting to MySQL: " + err);
  } else {
    console.log("MySQL Connection Successful");
    
    // Create planets table if not exists
    const createTable = `
      CREATE TABLE IF NOT EXISTS planets (
        id INT PRIMARY KEY,
        name VARCHAR(50),
        description TEXT,
        image VARCHAR(255),
        velocity VARCHAR(50),
        distance VARCHAR(50)
      )
    `;
    
    connection.query(createTable, function(err, results) {
      if (err) {
        console.log("Error creating table: " + err);
      } else {
        console.log("Planets table ready");
        
        // Insert sample data if table is empty
        connection.query('SELECT COUNT(*) as count FROM planets', function(err, results) {
          if (results[0].count === 0) {
            const planets = [
              [1, 'Mercury', 'عطارد هو أصغر كوكب في المجموعة الشمسية وأقربها إلى الشمس.', 'images/mercury.png', '47.87 km/s', '57.9 million km'],
              [2, 'Venus', 'الزهرة هو أكثر الكواكب حرارة في المجموعة الشمسية.', 'images/venus.png', '35.02 km/s', '108.2 million km'],
              [3, 'Earth', 'الأرض هو الكوكب الوحيد المعروف بوجود حياة.', 'images/earth.png', '29.78 km/s', '149.6 million km'],
              [4, 'Mars', 'المريخ يعرف بالكوكب الأحمر.', 'images/mars.png', '24.07 km/s', '227.9 million km'],
              [5, 'Jupiter', 'المشتري هو أكبر كوكب في المجموعة الشمسية.', 'images/jupiter.png', '13.07 km/s', '778.5 million km'],
              [6, 'Saturn', 'زحل معروف بحلقاته الجميلة.', 'images/saturn.png', '9.69 km/s', '1.4 billion km'],
              [7, 'Uranus', 'أورانوس يدور على جانبه.', 'images/uranus.png', '6.81 km/s', '2.9 billion km'],
              [8, 'Neptune', 'نبتون هو الكوكب الأبعد عن الشمس.', 'images/neptune.png', '5.43 km/s', '4.5 billion km']
            ];
            
            connection.query('INSERT INTO planets (id, name, description, image, velocity, distance) VALUES ?', [planets], function(err, results) {
              if (err) {
                console.log("Error inserting planets: " + err);
              } else {
                console.log("Planet data inserted successfully");
              }
            });
          }
        });
      }
    });
  }
});

app.post('/planet', function(req, res) {
  connection.query('SELECT * FROM planets WHERE id = ?', [req.body.id], function(err, results) {
    if (err || results.length === 0) {
      res.status(404).send({ error: "Planet not found" });
    } else {
      res.send(results[0]);
    }
  });
});

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "os": OS.hostname(),
    "env": process.env.NODE_ENV
  });
});

app.get('/live', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "live"
  });
});

app.get('/ready', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send({
    "status": "ready"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server successfully running on port - " + PORT);
});

module.exports = app;
