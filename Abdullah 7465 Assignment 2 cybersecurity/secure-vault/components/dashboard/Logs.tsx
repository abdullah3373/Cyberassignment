
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { Log } from '../../types';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const logData = await apiService.getLogs();
        setLogs(logData);
      } catch (err) {
        setError('Failed to load activity logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
      <p className="text-slate-400 mb-8">A record of all actions performed in your account.</p>
      
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-700">
              <tr>
                <th scope="col" className="px-6 py-3">Timestamp</th>
                <th scope="col" className="px-6 py-3">Action</th>
                <th scope="col" className="px-6 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="text-center p-6">Loading logs...</td></tr>
              ) : error ? (
                 <tr><td colSpan={3} className="text-center p-6 text-red-400">{error}</td></tr>
              ) : logs.length === 0 ? (
                 <tr><td colSpan={3} className="text-center p-6 text-slate-500">No activity recorded.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.logId} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-600">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">{log.action}</td>
                    <td className="px-6 py-4 font-mono">{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Logs;
