const Pool = require('pg').Pool;
const express = require('express');
const cors = require('cors');
const keccak256 = require('keccak256');
const { Client } = require('pg');
require('dotenv').config({path: ".env"});
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(cors(corsOptions))

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));

const client = new Client({
    connectionString: process.env.DB_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

client.connect();

app.post("/api/post_refCode", async(req, res) => {
    let values= req.body;
    if(values.refCode===process.env.REACT_APP_REFCODE){
        let hash = values.refCode+process.env.REACT_APP_SECRETKEY; 
        let keccak256Hash=keccak256(hash).toString('hex');
        res.send(keccak256Hash);
    }else{
        res.send("Invalid");
    }
})

app.get('/api/getall', (req, res) => {
    let sql = 'SELECT * FROM pfpracernft';

    client.query(sql, (err, result) => {
        if (err) throw err;
        
        console.log(result.rowCount);
        
        res.send(JSON.stringify(result.rowCount));
    }).catch(err => {
      throw err;
  });
});

app.post('/api/getWalletVerify', (req, res) => {
  let values = req.body;
  console.log("My values is:"+values.wallet);
  let sql = `SELECT COUNT(wallet) AS amount FROM pfpracernft WHERE wallet LIKE '${values.wallet}'`;
  
  client.query(sql, (err, result) => {
    if (err) throw err;
    
    console.log("My result is: "+JSON.stringify(result.rows[0].amount));
    
    res.send(JSON.stringify(result.rows[0].amount));
});
});

app.post("/api/insertWallet", async(req, res) => {
  let values = req.body;
  let sql = `INSERT INTO pfpracernft(id, wallet, txtype, amount) VALUES ('${values.id}','${values.wallet}','${values.txtype}', '${values.amount}')`;
  console.log("My insert query is:"+sql);
  
  if(values.id!==undefined && values.wallet!==undefined && values.amount!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});