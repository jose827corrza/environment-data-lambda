// let pgPool;

const pg = require("pg");

let pgPool;

const createConn = async () => {
  console.log('Creating connection to DB');
  pgPool = new pg.Pool({
    // connectionString: 'postgresql://postgres:postgres123testLambda@db.bcxqqqlqitybsbpxofjb.supabase.co:5432/postgres'
    connectionString: process.env.DB_URL
  })
}


const performQuery = async () => {
    const client = await pgPool.connect();
    const result = await client.query('SELECT now()');
    client.release();
    return result;
  }
  
  const performQueryEnvData = async () => {
    const client = await pgPool.connect();
    const result = await client.query('SELECT * from environment_sensor_data');
    console.log(result);
    client.release();
    return result.rows;
  }
  
  const performInsert = async (pressure, temperature, humidity, luminity, place) => {
    const client = await pgPool.connect();
    const text = 'INSERT INTO environment_sensor_data(pressure, temperature, humidity, luminity, place) VALUES($1, $2, $3, $4, $5)'
    const values = [pressure, temperature, humidity, luminity, place]
    try {
      const res = await client.query(text, values)
      console.log(res.rows[0])
      return res.rows[0]
    } catch (err) {
      console.log(err.stack)
    }
  }
  
  module.exports = {
    performInsert,
    performQuery,
    performQueryEnvData,
    createConn,
    pgPool
  }