const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://pixelusersdb1:pixelusersdb1@cluster0.xkcas.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri, {
    tls: true,
    minPoolSize: 1,
    // Removed minVersion — not valid here
  });
  clientPromise = client.connect();
}

async function getDB() {
  await clientPromise;
  return client.db("TUSHAR");
}

module.exports = getDB;
