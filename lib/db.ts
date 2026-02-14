import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb() {
  if (db) {
    return db;
  }

  const dbPath = path.join(process.cwd(), 'portfolio.db');
  db = new Database(dbPath);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Initialize database schema
  initializeDatabase(db);

  return db;
}

function initializeDatabase(database: Database.Database) {
  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Technologies table
  database.exec(`
    CREATE TABLE IF NOT EXISTS technologies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Badges table
  database.exec(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT DEFAULT '#2b8cee',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  database.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT,
      project_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Project badges join table
  database.exec(`
    CREATE TABLE IF NOT EXISTS project_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      badge_id INTEGER NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
      UNIQUE(project_id, badge_id)
    )
  `);

  // Contact messages table
  database.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      project_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Button settings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS button_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Initialize default data
  try {
    // Check if default admin exists
    const adminExists = database
      .prepare('SELECT id FROM users WHERE username = ?')
      .get('admin');

    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('admin', 10);
      database
        .prepare('INSERT INTO users (username, password) VALUES (?, ?)')
        .run('admin', hashedPassword);
    }

    // Initialize default button settings
    const buttonExists = database
      .prepare('SELECT id FROM button_settings WHERE key = ?')
      .get('consultation_button');

    if (!buttonExists) {
      database
        .prepare('INSERT INTO button_settings (key, label, url) VALUES (?, ?, ?)')
        .run('consultation_button', 'احجز استشارة مجانية', '#contact');
    }

    // Initialize default technologies
    const techCount = database
      .prepare('SELECT COUNT(*) as count FROM technologies')
      .get() as { count: number };

    if (techCount.count === 0) {
      const defaultTechs = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'];
      const stmt = database.prepare('INSERT INTO technologies (name) VALUES (?)');
      for (const tech of defaultTechs) {
        stmt.run(tech);
      }
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
}

