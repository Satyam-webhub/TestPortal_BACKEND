const sqlite3 = require('sqlite3').verbose();

const getDBConnection = () => {
    return new sqlite3.Database('./videos.db');
};

// Function to create tables without indexing
const createTables = (callback) => {
    const db = getDBConnection();

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS video_lengths (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sessionId TEXT NOT NULL,
            filename TEXT NOT NULL,
            length REAL NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS video_start_times (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sessionId TEXT NOT NULL,
            filename TEXT NOT NULL,
            start_time REAL NOT NULL
        )`, callback);


        // New table for processing details
        db.run(`CREATE TABLE IF NOT EXISTS video_processing_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sessionId TEXT ,
            processed BOOLEAN  ,
            filename TEXT 
            
        )`, callback);
    });

    db.close();
};

module.exports = { getDBConnection, createTables };
