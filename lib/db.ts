import { createClient, Client } from '@libsql/client';
import * as bcryptjs from 'bcryptjs';

let client: Client | null = null;

export function getDb() {
  if (client) {
    return client;
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set');
  }

  client = createClient({
    url,
    authToken,
  });

  // Initialize database schema
  initializeDatabase(client);

  return client;
}

async function initializeDatabase(database: Client) {
  // Users table
  await database.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Technologies table
  await database.execute(`
    CREATE TABLE IF NOT EXISTS technologies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Badges table
  await database.execute(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT DEFAULT '#2b8cee',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  await database.execute(`
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
  await database.execute(`
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
  await database.execute(`
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
  await database.execute(`
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
    const adminResult = await database.execute({
      sql: 'SELECT id FROM users WHERE username = ?',
      args: ['admin'],
    });

    if (!adminResult.rows || adminResult.rows.length === 0) {
      const hashedPassword = bcryptjs.hashSync('admin', 10);
      await database.execute({
        sql: 'INSERT INTO users (username, password) VALUES (?, ?)',
        args: ['admin', hashedPassword],
      });
    }

    // Initialize default button settings
    const buttonResult = await database.execute({
      sql: 'SELECT id FROM button_settings WHERE key = ?',
      args: ['consultation_button'],
    });

    if (!buttonResult.rows || buttonResult.rows.length === 0) {
      await database.execute({
        sql: 'INSERT INTO button_settings (key, label, url) VALUES (?, ?, ?)',
        args: ['consultation_button', 'احجز استشارة مجانية', '#contact'],
      });
    }

    // Initialize default technologies
    const techResult = await database.execute('SELECT COUNT(*) as count FROM technologies');
    const count = (techResult.rows[0] as any)?.count || 0;

    if (count === 0) {
      const defaultTechs = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'];
      for (const tech of defaultTechs) {
        await database.execute({
          sql: 'INSERT INTO technologies (name) VALUES (?)',
          args: [tech],
        });
      }
    }
  } catch (error) {
    console.error('Error initializing default data:', error);
  }
}

