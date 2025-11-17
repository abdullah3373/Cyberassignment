
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import type { StoredFile } from '../../types';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'text/plain', 'application/pdf'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
      try {
          const fileList = await apiService.getFiles();
          setFiles(fileList);
      } catch (err) {
          setError("Could not fetch file list.");
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError('');
    setMessage('');
    
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        setSelectedFile(null);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
        setSelectedFile(null);
        return;
      }
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await apiService.uploadFile(selectedFile);
      setMessage('File uploaded successfully!');
      setSelectedFile(null);
      // clear the file input
      const input = document.getElementById('file-upload') as HTMLInputElement;
      if(input) input.value = '';

      await fetchFiles(); // Refresh list
    } catch (err) {
      setError('File upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">File Upload</h1>
      <p className="text-slate-400 mb-8">Securely upload files with type and size validation.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Upload a New File</h2>
            <div className="mb-4">
              <label htmlFor="file-upload" className="block text-slate-300 text-sm font-bold mb-2">Select File</label>
              <input 
                id="file-upload"
                type="file" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
               <p className="text-xs text-slate-500 mt-2">Allowed types: .jpg, .png, .txt, .pdf. Max size: 5MB.</p>
            </div>
            {selectedFile && (
              <div className="text-sm text-slate-300 mb-4 bg-slate-700 p-3 rounded">
                <p>Selected: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            {message && <p className="text-green-400 text-sm mb-4">{message}</p>}
            <button 
              onClick={handleUpload} 
              disabled={!selectedFile || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-indigo-400"
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
        </div>
        
        <div className="bg-slate-800 p-8 rounded-lg shadow-lg">
           <h2 className="text-xl font-semibold text-white mb-4">Uploaded Files</h2>
           <div className="overflow-y-auto max-h-96">
                <ul className="divide-y divide-slate-700">
                    {loading ? <li className="py-3 text-slate-400">Loading...</li> :
                     files.length === 0 ? <li className="py-3 text-slate-500">No files uploaded.</li> :
                     files.map(file => (
                        <li key={file.fileId} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-slate-200">{file.filename}</p>
                                <p className="text-sm text-slate-400">{file.mimeType} - {new Date(file.uploadedAt).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
