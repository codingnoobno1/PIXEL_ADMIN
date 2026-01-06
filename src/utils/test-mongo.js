const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://TUSHAR:pixelfacultyusers@faculty.gpemgbq.mongodb.net/?retryWrites=true&w=majority";

async function test() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("✅ Connected!");
    const db = client.db("TUSHAR");
    const collections = await db.collections();
    console.log("Collections:", collections.map(c => c.collectionName));
    await client.close();
  } catch (e) {
    console.error("❌ Error:", e);
  }
}

test();
