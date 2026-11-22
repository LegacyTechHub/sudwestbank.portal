const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zipcode TEXT,
    nationality TEXT,
    occupation TEXT,
    dob TEXT,
    gender TEXT,
    marital_status TEXT,
    account_type TEXT DEFAULT 'GiroPrivat',
    currency TEXT DEFAULT 'EUR',
    passport_photo TEXT,
    kin_first_name TEXT,
    kin_last_name TEXT,
    kin_gender TEXT,
    kin_marital_status TEXT,
    kin_phone TEXT,
    kin_email TEXT,
    kin_address TEXT,
    kin_state TEXT,
    kin_city TEXT,
    kin_nationality TEXT,
    password_hash TEXT NOT NULL,
    account_number TEXT UNIQUE NOT NULL,
    iban TEXT UNIQUE NOT NULL,
    bic TEXT DEFAULT 'SWBSDESSXXX',
    balance REAL DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reference_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    recipient_name TEXT,
    recipient_iban TEXT,
    bank_name TEXT,
    amount REAL NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS beneficiaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    iban TEXT NOT NULL,
    bank_name TEXT,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    card_type TEXT NOT NULL,
    card_number_masked TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    monthly_limit REAL DEFAULT 5000.00,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;