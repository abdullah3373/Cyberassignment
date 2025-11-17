
import { db } from './db';
import type { User, Session } from '../types';

const SESSION_KEY = 'secure_vault_session';

// --- Mocking Backend Logic ---
// In a real app, password hashing would happen on the server.
// Here we simulate it by just storing a mock hash.
// We also simulate checking the password by having a hardcoded one.
const MOCK_PASSWORD_FOR_DEFAULT_USER = "Password123!";

const createSession = (user: User): Session => {
  const session = {
    sessionId: `sess-${Date.now()}`,
    userId: user.userId,
    token: `token-${Date.now()}-${Math.random()}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour expiry
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

const getSession = (): Session | null => {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  const session: Session = JSON.parse(sessionStr);
  if (new Date(session.expiresAt) < new Date()) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return session;
};

const addAuditLog = (userId: string, action: string) => {
    const newLog = {
        logId: `log-${Date.now()}`,
        userId,
        action,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1', // Mock IP
    };
    db.logs.add(newLog);
}

export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const user = db.users.findByUsername(username);
        // Simulate password check.
        if (user && password === MOCK_PASSWORD_FOR_DEFAULT_USER) {
          createSession(user);
          addAuditLog(user.userId, 'User logged in successfully.');
          resolve(user);
        } else {
          // In a real app, you wouldn't specify what was wrong (username or password).
          addAuditLog('N/A', `Failed login attempt for username: ${username}.`);
          reject(new Error("Invalid username or password."));
        }
      }, 500);
    });
  },

  register: async (username: string, email: string, password: string): Promise<User> => {
     return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (db.users.findByUsername(username)) {
          reject(new Error("Username already exists."));
          return;
        }

        const newUser: User = {
          userId: `user-${Date.now()}`,
          username,
          email,
          // This is NOT real bcrypt. Just a placeholder.
          passwordHash: `$2a$10$mockHashForNewUser${Math.random()}`,
          createdAt: new Date().toISOString(),
        };

        db.users.add(newUser);
        createSession(newUser);
        addAuditLog(newUser.userId, 'User registered successfully.');
        resolve(newUser);
      }, 500);
    });
  },

  logout: (): void => {
    const session = getSession();
    if (session) {
      addAuditLog(session.userId, 'User logged out.');
      localStorage.removeItem(SESSION_KEY);
    }
  },

  getCurrentUser: (): User | null => {
    const session = getSession();
    if (!session) return null;
    const user = db.users.findById(session.userId);
    return user || null;
  },

  getSession,
  addAuditLog,
};
