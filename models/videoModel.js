const { getDBConnection } = require('../config/db');

const VideoModel = {
    // Store video length with sessionId
    saveVideoLength: (sessionId, filename, length, callback) => {
        const db = getDBConnection();
        db.run(
            `INSERT INTO video_lengths (sessionId, filename, length) VALUES (?, ?, ?)`,
            [sessionId, filename, length],
            (err) => {
                db.close();
                callback(err);
            }
        );
    },

    // Fetch all video lengths for a session
    getAllVideoLengths: (sessionId, callback) => {
        const db = getDBConnection();
        db.all(
            `SELECT * FROM video_lengths WHERE sessionId = ? ORDER BY id ASC`,
            [sessionId],
            (err, rows) => {
                db.close();
                callback(err, rows);
            }
        );
    },

    // Clear previous start times for a session
    clearStartTimes: (sessionId, callback) => {
        const db = getDBConnection();
        db.run(
            `DELETE FROM video_start_times WHERE sessionId = ?`,
            [sessionId],
            (err) => {
                db.close();
                callback(err);
            }
        );
    },

    // Bulk insert start times for a session
    saveStartTimes: (sessionId, startTimes, callback) => {
        if (startTimes.length === 0) return callback(null);

        const db = getDBConnection();

        const placeholders = startTimes.map(() => "(?, ?, ?)").join(", ");
        const values = startTimes.flatMap(({ filename, start_time }) => [sessionId, filename, start_time]);

        const query = `INSERT INTO video_start_times (sessionId, filename, start_time) VALUES ${placeholders}`;

        db.run(query, values, (err) => {
            db.close();
            callback(err);
        });
    },

    getAllStartTimes: (sessionId, callback) => {
        const db = getDBConnection();
        db.all(
            `SELECT * FROM video_start_times WHERE sessionId = ? ORDER BY start_time ASC`,
            [sessionId],
            (err, rows) => {
                db.close();
                callback(err, rows);
            }
        );
    },

// Insert processing details


 insertProcessingDetail : (sessionid, processed,filename, callback) => {
    const db = getDBConnection();
    db.run(
        `INSERT INTO video_processing_details (sessionid, processed ,filename) VALUES (?, ? ,?)`,
        [sessionid, processed ,filename],
        function (err) {
            db.close();
            callback(err, { id: this.lastID, sessionid, processed ,filename});
        }
    );
},


// Retrieve processing details by session ID
getProcessingDetailBySession: (sessionid, callback) => {
    const db = getDBConnection();
    db.all(
        `SELECT * FROM video_processing_details WHERE sessionid = ? ORDER BY id ASC`,
        [sessionid],
        (err, rows) => {
            db.close();
            callback(err, rows);
        }
    );
},













    
};

module.exports = VideoModel;
