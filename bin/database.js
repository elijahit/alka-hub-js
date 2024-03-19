const { AsyncDatabase } = require('promised-sqlite3');
const database = "./bin/database.db";


async function readDb(querysql, parms) {
  const db = await AsyncDatabase.open(database);
  const result = await db.get(querysql, parms);
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

async function readDbWith4Params(querysql, ...params) {
  const db = await AsyncDatabase.open(database);
  const result = await db.get(querysql, params[0], params[1], params[2], params[3]);
  await db.close();
  return result;
}

async function readDbWith3Params(querysql, ...params) {
  const db = await AsyncDatabase.open(database);
  const result = await db.get(querysql, params[0], params[1], params[2]);
  await db.close();
  return result;
}

async function readDbAllWith3Params(querysql, ...params) {
  const db = await AsyncDatabase.open(database);
  const result = await db.all(querysql, params[0], params[1], params[2]);
  await db.close();
  return result;
}

async function readDbAllWith2Params(querysql, ...params) {
  const db = await AsyncDatabase.open(database);
  const result = await db.all(querysql, params[0], params[1]);
  await db.close();
  return result;
}

async function readDbAllWith1Params(querysql, ...params) {
  const db = await AsyncDatabase.open(database);
  const result = await db.all(querysql, params[0]);
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
  readDbWith3Params,
  readDbAllWith2Params,
  readDbWith4Params,
  readDbAllWith1Params,
  readDbAllWith3Params
};