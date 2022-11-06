const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const e = require('express');
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

app.get('/api/getall', (req, res) => {
    let sql = 'SELECT wallet, key FROM usersmisteryroom';

    client.query(sql, (err, result) => {
        if (err) throw err;
        
        console.log(result);
        
        res.send(result);
    })
});

app.get('/api/userExists', (req, res) => {
  let values = req.query;
  let sql = `SELECT count(wallet) FROM usersmisteryroom where lower(wallet) like lower('${values.wallet}') `;

  client.query(sql, (err, result) => {
    if (err) throw err;
    if(result!==null){
      console.log("My wallet result is: "+result.rows[0].count+" values"+values.wallet);
      res.send(result.rows[0].count);
    }else{
      res.send("");
    }
})
});

app.get('/api/getKeyWallet', (req, res) => {
  let values = req.query;
  const sql = `select key FROM usersmisteryroom where lower(wallet) like lower('${values.wallet}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].key);

    res.send(result.rows[0].key);

})
});

app.get('/api/getContractId', (req, res) => {
  let values = req.query;
  const sql = `select contract_id FROM contracts where request_id=('${values.request_id}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].contract_id);

    res.send(result.rows[0].contract_id);
})
});

app.get('/api/getContractByWallet', (req, res) => {
  let values = req.query;
  const sql = `select contract_id FROM contracts where created_by=('${values.wallet}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].contract_id);

    res.send(result.rows[0].contract_id);
})
});

app.get('/api/getCountContractByWallet', (req, res) => {
  let values = req.query;
  const sql = `select count(contract_id)as count_contracts FROM contracts where created_by=('${values.wallet}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my count wallet result is: "+result.rows[0].count_contracts);

   res.send(result.rows[0].count_contracts);
    
})
});

app.get('/api/getAllWallets', (req, res) => {
  let values = req.body;
  let sql = `SELECT wallet FROM usersmisteryroom`;

  client.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
  })
});

app.post("/api/addUser", async(req, res) => {
  let values = req.body;
  let sql = `INSERT INTO usersmisteryroom(wallet, key) VALUES ('${values.wallet}','${values.key}')`;
  console.log("My insert query is:"+sql);
  
  if(values.wallet!==undefined && values.key!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});

app.get('/api/getRiddle', (req, res) => {
  let values = req.query;
  const sql = `select riddle from riddles where id=('${values.id}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].riddle);

    res.send(result.rows[0].riddle);

})
});

app.get('/api/getAnswear', (req, res) => {
  let values = req.query;
  const sql = `select answear from riddles where id=('${values.id}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].answear);

    res.send(result.rows[0].answear);

})
});

app.get('/api/getRiddleWallet', (req, res) => {
  let values = req.query;
  const sql = `select count(wallet) from riddles where wallet LIKE ('${values.wallet}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].count);

    res.send(result.rows[0].count);

})
});

app.get('/api/getNFTCode', (req, res) => {
  let values = req.query;
  const sql = `select nft from riddles where id=('${values.id}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].nft);

    res.send(result.rows[0].nft);

})
});

app.post("/api/registerRiddleAnswearWallet", async(req, res) => {
  let values = req.body;
  let sql = `UPDATE riddles set wallet = ('${values.wallet}') where id=('${values.id}')`;
  console.log("My insert query is:"+sql);
  
  if(values.wallet!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});

app.post("/api/updateChestState", async(req, res) => {
  let values = req.body;
  let sql = `UPDATE chest set state = ('${values.state}') where wallet like('${values.wallet}')`;
  console.log("My insert query is:"+sql);
  
  if(values.wallet!==undefined&&values.state!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});

app.post("/api/updateChestMint", async(req, res) => {
  let values = req.body;
  let sql = `UPDATE chest set minted = ('${values.minted}') where wallet like('${values.wallet}')`;
  console.log("My insert query is:"+sql);
  
  if(values.wallet!==undefined&&values.minted!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});

app.post("/api/updateContractIDContracts", async(req, res) => {
  let values = req.body;
  let sql = `UPDATE contracts set contract_id = ('${values.contract_id}') where request_id like('${values.request_id}')`;
  console.log("My insert query is:"+sql);
  
  if(values.request_id!==undefined&&values.contract_id!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});

app.post("/api/addChestStateItem", async(req, res) => {
  let values = req.body;
  let sql = `INSERT INTO chest(wallet, state, minted) VALUES ('${values.wallet}','${values.state}','${values.minted}')`;
  console.log("My insert query is:"+sql);
  
  if(values.wallet!==undefined && values.state!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});

app.post("/api/insertNewContract", async(req, res) => {
  let values = req.body;
  let sql = `INSERT INTO contracts(contract_id,name,request_id, created_by) VALUES ('${values.contract_id}','${values.name}','${values.request_id}','${values.created_by}')`;
  console.log("My insert query is:"+sql);
  
  if(values.contract_id!==undefined && values.name!==undefined && values.request_id!==undefined && values.created_by!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("success");
    });
  }else{
    res.send("fail");
  }
});

app.post("/api/updateContractIdInContracts", async(req, res) => {
  let values = req.body;
  let sql = `UPDATE contracts set contract_id = ('${values.contract_id}') where request_id like('${values.request_id}')`;
  console.log("My insert query is:"+sql);
  
  if(values.wallet!==undefined&&values.request_id!==undefined){
      client.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Success");
    });
  }else{
    res.send("Fail");
  }
});


app.get('/api/getChestState', (req, res) => {
  let values = req.query;
  const sql = `select state from chest where lower(wallet) LIKE lower('${values.wallet}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my state result is: "+result.rows[0].state);

    res.send(result.rows[0].state);

})
});

app.get('/api/getChestMinted', (req, res) => {
  let values = req.query;
  const sql = `select minted from chest where lower(wallet) LIKE lower('${values.wallet}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my state result is: "+result.rows[0].minted);

    res.send(result.rows[0].minted);

})
});

app.get('/api/getRequestIDContracts', (req, res) => {
  let values = req.query;
  const sql = `select request_id from contracts where id=('${values.id}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].request_id);

    res.send(result.rows[0].request_id);

})
});

app.get('/api/getRequestIDContractsByWallet', (req, res) => {
  let values = req.query;
  const sql = `select request_id from contracts where created_by=('${values.wallet}')`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my wallet result is: "+result.rows[0].request_id);

    res.send(result.rows[0].request_id);

})
});

app.get('/api/getHigherContractsID', (req, res) => {
  let values = req.query;
  const sql = `select id from contracts order by id desc limit 1`
  console.log("Calling:"+sql);

  client.query(sql, (err, result) => {
    if (err) throw err;
    console.log("my id result is: "+result.rows[0].id);
    let nr=result.rows[0];
    res.send(nr);
})
});