
export interface User {
  userId: string;
  username: string;
  email: string;
  passwordHash: string; // In a real app, this is never sent to the client
  createdAt: string;
}

export interface Session {
  sessionId: string;
  userId: string;
  token: string;
  expiresAt: string;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  amountEncrypted: string;
  note: string;
  timestamp: string;
}

export interface Log {
  logId: string;
  userId: string;
  action: string;
  timestamp: string;
  ipAddress: string; // Simulated
}

export interface StoredFile {
  fileId: string;
  userId: string;
  filename: string;
  mimeType: string;
  uploadedAt: string;
}

export enum DashboardTab {
  PROFILE = 'profile',
  TRANSACTIONS = 'transactions',
  LOGS = 'logs',
  FILE_UPLOAD = 'files',
  CRYPTO_TOOL = 'crypto',
}
