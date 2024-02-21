const { AsyncDatabase } = require('promised-sqlite3');
const database = "./bin/database.db";


async function readDb(querysql, ...parms) {
  const db = await AsyncDatabase.open(database);
  const result = await db.get(querysql, ...parms);
  await db.close();
  return result;
}

async function readDbAll(table) {
  const db = await AsyncDatabase.open(database);
  const result = await db.all(`SELECT * from ${table}`);
  await db.close();
  return result;
}

async function readDbAllWithValue(table, value) {
  const db = await AsyncDatabase.open(database);
  const result = await db.all(`SELECT ${value} from ${table}`);
  await db.close();
  return result;
}

async function runDb(querysql, ...params) {
  const db = await AsyncDatabase.open(database);
  await db.run(querysql, params);
  await db.close();
  return;
}

module.exports = {
  readDb,
  readDbAll,
  runDb,
  readDbAllWithValue,
};