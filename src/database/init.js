import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(path.join(dbDir, 'workshops.db'));

// Read schema
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

// Initialize database
const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Enable foreign keys
            db.run('PRAGMA foreign_keys = ON');
            
            // Begin transaction
            db.run('BEGIN TRANSACTION', (err) => {
                if (err) {
                    console.error('Error starting transaction:', err);
                    reject(err);
                    return;
                }

                // Execute schema
                db.exec(schema, (err) => {
                    if (err) {
                        console.error('Error executing schema:', err);
                        db.run('ROLLBACK', () => reject(err));
                        return;
                    }

                    // Commit transaction
                    db.run('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            db.run('ROLLBACK', () => reject(err));
                            return;
                        }

                        console.log('Database initialized successfully');
                        resolve();
                    });
                });
            });
        });
    });
};

// Initialize database and export connection
initDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});

export default db; 