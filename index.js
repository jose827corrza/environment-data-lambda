const serverless = require("serverless-http");
const express = require("express");
const pg = require("pg");


const {
    performInsert,
    performQuery,
    performQueryEnvData,
    createConn,
    pgPool
  } = require('./src/service')

const app = express();


app.use(express.json())

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.get("/env-data", async (req, res, next) => {
  if (!pgPool) {
    // Cold start. Get Heroku Postgres creds and create pool.
    await createConn();
  } else {
      console.log('Using existing PG connection.');
  }
  try {
    const result = await performQueryEnvData();

    res.json({
        result
    });
    return;
} catch (e) {
    res.json({
        error: e.message,
    });
    return;
}
})

app.get("/check-db", async(req, res, next) => {
  if (!pgPool) {
    // Cold start. Get Heroku Postgres creds and create pool.
    await createConn();
} else {
    console.log('Using existing PG connection.');
}

try {
    const result = await performQuery();

    res.json({
        result: `According to PostgreSQL, the time is: ${result.rows[0].now}`
    });
    return;
} catch (e) {
    res.json({
        error: e.message,
    });
    return;
}
});

app.post('/insert-data', async (req, res, next) => {
  console.log('****');
  console.log(req.body);
  if (!pgPool) {
    // Cold start. Get Heroku Postgres creds and create pool.
    await createConn();
  } else {
      console.log('Using existing PG connection.');
  }
  try {
    const {pressure, temperature, humidity, luminity, place} = req.body;
    const result = await performInsert(pressure, temperature, humidity, luminity, place);
    res.status(201).json({
      pressure,
      temperature,
      humidity,
      luminity,
      place
    });
    return;
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
