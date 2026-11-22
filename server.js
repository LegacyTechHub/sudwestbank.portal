const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_key_in_production';

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `passport_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(__dirname));

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
}

function generateAccountDetails() {
  const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const iban = `DE89 6009 0700 ${randomDigits.slice(0, 4)} ${randomDigits.slice(4, 8)} ${randomDigits.slice(8, 10)}`;
  return { accountNumber: randomDigits, iban };
}

// 1. Register
app.post('/api/register', upload.single('passport'), (req, res) => {
  try {
    const b = req.body;
    if (!b.email || !b.password || !b.first_name || !b.last_name) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(b.email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(b.password, 10);
    const { accountNumber, iban } = generateAccountDetails();
    const passportPhoto = req.file ? `/uploads/${req.file.filename}` : null;

    const insert = db.prepare(`
      INSERT INTO users (
        first_name, last_name, email, phone, address, city, state, zipcode, nationality,
        occupation, dob, gender, marital_status, account_type, currency, passport_photo,
        kin_first_name, kin_last_name, kin_gender, kin_marital_status, kin_phone, kin_email,
        kin_address, kin_state, kin_city, kin_nationality, password_hash, account_number, iban, balance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00)
    `);

    const result = insert.run(
      b.first_name, b.last_name, b.email.toLowerCase().trim(), b.phone || '', b.address || '',
      b.city || '', b.state || '', b.zipcode || '', b.nationality || '', b.occupation || '',
      b.dob || '', b.gender || '', b.marital_status || '', b.account_type || 'GiroPrivat',
      b.currency || 'EUR', passportPhoto, b.kin_first_name || '', b.kin_last_name || '',
      b.kin_gender || '', b.kin_marital_status || '', b.kin_phone || '', b.kin_email || '',
      b.kin_address || '', b.kin_state || '', b.kin_city || '', b.kin_nationality || '',
      passwordHash, accountNumber, iban
    );

    const userId = result.lastInsertRowid;

    db.prepare('INSERT INTO cards (user_id, card_type, card_number_masked, expiry_date) VALUES (?, ?, ?, ?)').run(
      userId, 'girocard', '•••• •••• •••• 4821', '09/29'
    );
    db.prepare('INSERT INTO cards (user_id, card_type, card_number_masked, expiry_date) VALUES (?, ?, ?, ?)').run(
      userId, 'PayLife Gold Mastercard®', '•••• •••• •••• 9104', '11/29'
    );
    db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
      userId, 'Welcome to Online Banking', 'Your account has been successfully created and is ready to use.'
    );

    const token = jwt.sign({ id: userId, email: b.email }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
      token,
      user: { id: userId, first_name: b.first_name, last_name: b.last_name, email: b.email, account_number: accountNumber, iban, balance: 0.00 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. Login
app.post('/api/login', (req, res) => {
  const { identifier, email, password } = req.body;
  const loginId = (identifier || email || '').toLowerCase().trim();
  if (!loginId || !password) {
    return res.status(400).json({ error: 'Email/Account number and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = ? OR account_number = ?').get(loginId, loginId);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
  const { password_hash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// 3. Forgot Password
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });
  res.json({ message: 'If an account matches that email, password recovery instructions have been sent.' });
});

// 4. Dashboard Overview
app.get('/api/dashboard', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password_hash, ...safeUser } = user;
  const recentTransactions = db.prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5').all(req.user.id);
  res.json({ user: safeUser, recentTransactions });
});

// 5. Money Transfers
app.post('/api/transfers', authMiddleware, (req, res) => {
  const { recipient_name, recipient_iban, bank_name, amount, description } = req.body;
  const transferAmount = parseFloat(amount);

  if (!recipient_name || !recipient_iban || isNaN(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ error: 'Valid recipient name, IBAN, and positive amount are required.' });
  }

  const sender = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!sender || sender.balance < transferAmount) {
    return res.status(400).json({ error: 'Insufficient balance for this transfer.' });
  }

  const referenceId = `SWB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const executeTransfer = db.transaction(() => {
    db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(transferAmount, sender.id);

    db.prepare(`
      INSERT INTO transactions (user_id, reference_id, type, recipient_name, recipient_iban, bank_name, amount, description, status)
      VALUES (?, ?, 'Transfer', ?, ?, ?, ?, ?, 'Completed')
    `).run(sender.id, referenceId, recipient_name, recipient_iban, bank_name || '', -transferAmount, description || 'SEPA Transfer');

    const cleanIban = recipient_iban.replace(/\s+/g, '').toUpperCase();
    const internalRecipient = db.prepare("SELECT * FROM users WHERE REPLACE(UPPER(iban), ' ', '') = ?").get(cleanIban);
    if (internalRecipient && internalRecipient.id !== sender.id) {
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(transferAmount, internalRecipient.id);
      db.prepare(`
        INSERT INTO transactions (user_id, reference_id, type, recipient_name, recipient_iban, amount, description, status)
        VALUES (?, ?, 'Deposit', ?, ?, ?, ?, 'Completed')
      `).run(internalRecipient.id, `${referenceId}-IN`, `${sender.first_name} ${sender.last_name}`, sender.iban, transferAmount, description || 'Incoming Transfer');
    }

    db.prepare('INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)').run(
      sender.id, 'Transfer Completed', `Transfer of ${transferAmount.toFixed(2)} ${sender.currency} to ${recipient_name} succeeded (${referenceId}).`
    );
  });

  executeTransfer();
  const updatedSender = db.prepare('SELECT balance, currency FROM users WHERE id = ?').get(sender.id);
  res.json({
    message: 'Transfer Successful',
    receipt: { reference_id: referenceId, recipient_name, recipient_iban, amount: transferAmount, currency: updatedSender.currency, status: 'Completed', date: new Date().toISOString() },
    newBalance: updatedSender.balance
  });
});

// 6. Transaction History
app.get('/api/transactions', authMiddleware, (req, res) => {
  const { search, type } = req.query;
  let query = 'SELECT * FROM transactions WHERE user_id = ?';
  const params = [req.user.id];

  if (type && type !== 'All') {
    query += ' AND type = ?';
    params.push(type);
  }
  if (search) {
    query += ' AND (recipient_name LIKE ? OR description LIKE ? OR reference_id LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  query += ' ORDER BY created_at DESC';

  const transactions = db.prepare(query).all(...params);
  res.json({ transactions });
});

// 7. Beneficiaries
app.get('/api/beneficiaries', authMiddleware, (req, res) => {
  const beneficiaries = db.prepare('SELECT * FROM beneficiaries WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ beneficiaries });
});

app.post('/api/beneficiaries', authMiddleware, (req, res) => {
  const { name, iban, bank_name, note } = req.body;
  if (!name || !iban) {
    return res.status(400).json({ error: 'Name and IBAN are required.' });
  }
  const result = db.prepare('INSERT INTO beneficiaries (user_id, name, iban, bank_name, note) VALUES (?, ?, ?, ?, ?)').run(
    req.user.id, name, iban, bank_name || '', note || ''
  );
  res.status(201).json({ id: result.lastInsertRowid, name, iban, bank_name, note });
});

app.delete('/api/beneficiaries/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM beneficiaries WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Beneficiary removed' });
});

// 8. Cards & Notifications
app.get('/api/cards', authMiddleware, (req, res) => {
  const cards = db.prepare('SELECT * FROM cards WHERE user_id = ?').all(req.user.id);
  res.json({ cards });
});

app.patch('/api/cards/:id', authMiddleware, (req, res) => {
  const { status, monthly_limit } = req.body;
  if (status) db.prepare('UPDATE cards SET status = ? WHERE id = ? AND user_id = ?').run(status, req.params.id, req.user.id);
  if (monthly_limit !== undefined) db.prepare('UPDATE cards SET monthly_limit = ? WHERE id = ? AND user_id = ?').run(monthly_limit, req.params.id, req.user.id);
  res.json({ message: 'Card updated' });
});

app.get('/api/notifications', authMiddleware, (req, res) => {
  const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ notifications });
});

app.patch('/api/notifications/:id/read', authMiddleware, (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ message: 'Marked as read' });
});

// 9. Profile, Password & Support
app.put('/api/profile', authMiddleware, (req, res) => {
  const { phone, address, city, state, zipcode } = req.body;
  db.prepare('UPDATE users SET phone = ?, address = ?, city = ?, state = ?, zipcode = ? WHERE id = ?').run(
    phone, address, city, state, zipcode, req.user.id
  );
  res.json({ message: 'Profile updated' });
});

app.put('/api/password', authMiddleware, (req, res) => {
  const { current_password, new_password } = req.body;
  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(current_password, user.password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }
  const newHash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);
  res.json({ message: 'Password updated successfully' });
});

app.post('/api/support', authMiddleware, (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required.' });
  db.prepare('INSERT INTO support_tickets (user_id, subject, message) VALUES (?, ?, ?)').run(req.user.id, subject, message);
  res.status(201).json({ message: 'Support ticket submitted' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});