const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'ilinks.db'));

// Promisify helpers
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastInsertRowid: this.lastID, changes: this.changes });
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize tables
const init = async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        icon TEXT,
        position INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await run(`
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT,
        position INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);

    await run(`CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_links_category_id ON links(category_id)`);

    // 尝试添加 wallpaper 列（如果不存在）
    try {
      await run(`ALTER TABLE users ADD COLUMN wallpaper TEXT`);
      console.log('Added wallpaper column to users table');
    } catch (err) {
      // 如果列已存在，忽略错误
      if (!err.message.includes('duplicate column name')) {
        console.log('Wallpaper column check:', err.message);
      }
    }

    // 尝试添加 ui_settings 列（如果不存在）
    try {
      await run(`ALTER TABLE users ADD COLUMN ui_settings TEXT`);
      console.log('Added ui_settings column to users table');
    } catch (err) {
      // 如果列已存在，忽略错误
      if (!err.message.includes('duplicate column name')) {
        console.log('UI settings column check:', err.message);
      }
    }

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err);
  }
};

init();

// Export a wrapper that mimics better-sqlite3 but returns Promises
module.exports = {
  prepare: (sql) => ({
    run: (...params) => run(sql, params),
    get: (...params) => get(sql, params),
    all: (...params) => all(sql, params)
  })
};
