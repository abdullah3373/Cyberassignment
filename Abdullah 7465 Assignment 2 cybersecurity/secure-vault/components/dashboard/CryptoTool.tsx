
import React, { useState } from 'react';
import { encryptData, decryptData } from '../../utils/crypto';
import { LockClosedIcon, LockOpenIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const CryptoTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [secret, setSecret] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProcess = async () => {
    if (!inputText || !secret) {
      setError('Input text and secret key are required.');
      return;
    }
    setLoading(true);
    setError('');
    setResult('');
    try {
      if (mode === 'encrypt') {
        const encrypted = await encryptData(inputText, secret);
        setResult(encrypted);
      } else {
        const decrypted = await decryptData(inputText, secret);
        setResult(decrypted);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Encryption & Decryption Tool</h1>
      <p className="text-slate-400 mb-8">Use client-side AES-GCM to encrypt and decrypt text.</p>
      
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
        <div className="flex space-x-4 mb-6 border-b border-slate-700">
          <button 
            onClick={() => setMode('encrypt')} 
            className={`flex items-center py-3 px-4 text-sm font-medium ${mode === 'encrypt' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <LockClosedIcon className="h-5 w-5 mr-2" /> Encrypt
          </button>
          <button 
            onClick={() => setMode('decrypt')}
            className={`flex items-center py-3 px-4 text-sm font-medium ${mode === 'decrypt' ? 'border-b-2 border-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
          >
             <LockOpenIcon className="h-5 w-5 mr-2" /> Decrypt
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="input-text" className="block text-slate-300 text-sm font-bold mb-2">
              {mode === 'encrypt' ? 'Plain Text' : 'Encrypted Text (Base64)'}
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              className="input-field font-mono"
              placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter base64 string to decrypt...'}
            />
          </div>
          <div>
            <label htmlFor="result-text" className="block text-slate-300 text-sm font-bold mb-2">Result</label>
            <textarea
              id="result-text"
              value={result}
              readOnly
              rows={8}
              className="input-field font-mono bg-slate-900 cursor-not-allowed"
              placeholder="Result will appear here..."
            />
          </div>
        </div>

        <div className="mt-6">
            <label htmlFor="secret-key" className="block text-slate-300 text-sm font-bold mb-2">Secret Key</label>
            <input
              type="password"
              id="secret-key"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="input-field"
              placeholder="Enter your secret key"
            />
        </div>
        
        {error && <p className="text-red-400 text-sm mt-4 p-3 bg-red-900/50 rounded">{error}</p>}
        
        <div className="mt-6 text-center">
            <button 
                onClick={handleProcess} 
                disabled={loading}
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-indigo-400 transition-colors duration-200"
            >
              {loading ? 'Processing...' : `Process ${mode === 'encrypt' ? 'Encryption' : 'Decryption'}`}
              {!loading && <ArrowRightIcon className="h-5 w-5 ml-2" />}
            </button>
        </div>
      </div>
       <style>{`.input-field { background-color: #334155; color: #cbd5e1; border: 1px solid #475569; border-radius: 0.5rem; width: 100%; padding: 0.75rem 1rem; } .input-field:focus { outline: none; box-shadow: 0 0 0 2px #6366f1; }`}</style>
    </div>
  );
};

export default CryptoTool;
