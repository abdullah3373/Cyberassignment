
import { db } from './db';
import { authService } from './authService';
import type { User, Transaction, Log, StoredFile } from '../types';
import { sanitizeInput } from '../utils/validation';
import { encryptData } from '../utils/crypto';

// This file simulates a backend API for authenticated users.

const performApiCall = <T,>(action: (user: User) => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { // Simulate network delay
      const user = authService.getCurrentUser();
      if (!user) {
        reject(new Error("Unauthorized: No active session."));
        return;
      }
      action(user).then(resolve).catch(reject);
    }, 300);
  });
};

export const apiService = {
  getProfile: (): Promise<User> => {
    return performApiCall(async (user) => user);
  },

  updateProfile: (updates: { username?: string; email?: string }): Promise<User> => {
    return performApiCall(async (user) => {
      const updatedUser = { ...user };
      if (updates.username) {
        updatedUser.username = sanitizeInput(updates.username);
      }
      if (updates.email) {
        updatedUser.email = sanitizeInput(updates.email);
      }
      db.users.update(updatedUser);
      authService.addAuditLog(user.userId, `User updated profile. Username: ${updatedUser.username}, Email: ${updatedUser.email}`);
      return updatedUser;
    });
  },

  getTransactions: (): Promise<Transaction[]> => {
    return performApiCall(async (user) => db.transactions.getAllByUserId(user.userId));
  },

  addTransaction: (amount: number, note: string, secret: string): Promise<Transaction> => {
    return performApiCall(async (user) => {
      const encryptedAmount = await encryptData(String(amount), secret);
      const newTransaction: Transaction = {
        transactionId: `txn-${Date.now()}`,
        userId: user.userId,
        amountEncrypted: encryptedAmount,
        note: sanitizeInput(note),
        timestamp: new Date().toISOString(),
      };
      db.transactions.add(newTransaction);
      authService.addAuditLog(user.userId, `Added new transaction.`);
      return newTransaction;
    });
  },

  getLogs: (): Promise<Log[]> => {
    return performApiCall(async (user) => db.logs.getAllByUserId(user.userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  getFiles: (): Promise<StoredFile[]> => {
     return performApiCall(async (user) => db.files.getAllByUserId(user.userId));
  },

  uploadFile: (file: File): Promise<StoredFile> => {
    return performApiCall(async (user) => {
      const newFile: StoredFile = {
        fileId: `file-${Date.now()}`,
        userId: user.userId,
        filename: sanitizeInput(file.name),
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
      };
      db.files.add(newFile);
      authService.addAuditLog(user.userId, `Uploaded file: ${newFile.filename}`);
      return newFile;
    });
  }
};
