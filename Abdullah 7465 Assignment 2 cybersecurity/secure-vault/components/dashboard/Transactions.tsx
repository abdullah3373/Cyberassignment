
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { Transaction } from '../../types';
import { decryptData } from '../../utils/crypto';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [secret, setSecret] = useState('');
  const [decryptionSecret, setDecryptionSecret] = useState('');
  const [decryptedAmounts, setDecryptedAmounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const trans = await apiService.getTransactions();
      setTransactions(trans);
    } catch (err) {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !note || !secret) {
      setError('Please fill all fields for the new transaction.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await apiService.addTransaction(parseFloat(amount), note, secret);
      setAmount('');
      setNote('');
      setSecret('');
      await fetchTransactions(); // Refresh list
    } catch (err) {
      setError('Failed to add transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecrypt = async (transactionId: string, encryptedAmount: string) => {
    if (!decryptionSecret) {
      setDecryptedAmounts(prev => ({ ...prev, [transactionId]: 'Secret key is required.' }));
      return;
    }
    try {
      const decrypted = await decryptData(encryptedAmount, decryptionSecret);
      setDecryptedAmounts(prev => ({ ...prev, [transactionId]: `$${decrypted}` }));
    } catch (err) {
      setDecryptedAmounts(prev => ({ ...prev, [transactionId]: 'Decryption Failed' }));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
      <p className="text-slate-400 mb-8">Manage your secure transactions.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Transaction</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-slate-300 text-sm font-bold mb-2">Amount</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" placeholder="0.00" required />
              </div>
              <div className="mb-4">
                <label htmlFor="note" className="block text-slate-300 text-sm font-bold mb-2">Note</label>
                <input type="text" id="note" value={note} onChange={(e) => setNote(e.target.value)} className="input-field" placeholder="e.g., Groceries" required />
              </div>
              <div className="mb-6">
                <label htmlFor="secret" className="block text-slate-300 text-sm font-bold mb-2">Encryption Secret</label>
                <input type="password" id="secret" value={secret} onChange={(e) => setSecret(e.target.value)} className="input-field" placeholder="Your secret key" required />
                 <p className="text-xs text-slate-500 mt-1">This key encrypts the amount. Remember it to decrypt later.</p>
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-indigo-400">
                {submitting ? 'Adding...' : 'Add Transaction'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">History</h2>
            <div className="mb-4">
                <label htmlFor="decryptionSecret" className="block text-slate-300 text-sm font-bold mb-2">Decryption Secret</label>
                <input type="password" id="decryptionSecret" value={decryptionSecret} onChange={(e) => setDecryptionSecret(e.target.value)} className="input-field" placeholder="Enter secret to view amounts" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">Note</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Amount (Encrypted)</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} className="text-center p-4">Loading...</td></tr>
                  ) : transactions.map(t => (
                    <tr key={t.transactionId} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-600">
                      <td className="px-6 py-4">{t.note}</td>
                      <td className="px-6 py-4">{new Date(t.timestamp).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-mono text-xs truncate max-w-xs">{decryptedAmounts[t.transactionId] || t.amountEncrypted}</td>
                      <td className="px-6 py-4">
                         <button onClick={() => handleDecrypt(t.transactionId, t.amountEncrypted)} className="font-medium text-indigo-400 hover:underline disabled:text-slate-500" disabled={!decryptionSecret}>Decrypt</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && !loading && <p className="text-center p-4 text-slate-500">No transactions yet.</p>}
            </div>
          </div>
        </div>
      </div>
      <style>{`.input-field { background-color: #334155; color: #cbd5e1; border: 1px solid #475569; border-radius: 0.5rem; width: 100%; padding: 0.75rem 1rem; } .input-field:focus { outline: none; box-shadow: 0 0 0 2px #6366f1; }`}</style>
    </div>
  );
};

export default Transactions;
