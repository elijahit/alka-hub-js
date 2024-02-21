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

module.exports = {
  readDb,
  readDbAll,
};