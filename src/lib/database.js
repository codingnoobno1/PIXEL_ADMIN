// This file centralizes database connections.

// --- MongoDB (Mongoose) Connection ---
import dbConnect from './dbConnect'; // Re-using existing mongoose connection

// --- MongoDB (Native Driver) Connection ---
import clientPromise from './mongo'; // Re-using existing native mongo connection

// --- SQL (MSSQL) Connection ---
const { sql, poolPromise, connectDb } = require("./db"); // Re-using existing mssql connection

export {
  dbConnect as mongooseConnect, // Mongoose connection from dbConnect.js
  clientPromise as mongoClient,   // Native MongoDB client from mongo.js
  poolPromise as sqlPoolPromise,  // SQL Server connection pool promise
  connectDb as connectSql,        // Function to get the SQL pool
  sql                               // mssql package
};

// Example of how to use it:
/*
import { mongooseConnect, mongoClient, connectSql, sql } from './database';

// Using mongoose
async function doSomethingWithMongoose() {
    await mongooseConnect();
    // ... use mongoose models
}

// Using native mongo
async function doSomethingWithNativeMongo() {
    const client = await mongoClient;
    const db = client.db("your_db_name");
    // ... use db object
}

// Using SQL
async function doSomethingWithSql() {
    try {
        const pool = await connectSql();
        const result = await pool.request().query('SELECT 1 as number');
        console.log(result.recordset);
    } catch (err) {
        console.error('SQL query failed:', err);
    }
}
*/
