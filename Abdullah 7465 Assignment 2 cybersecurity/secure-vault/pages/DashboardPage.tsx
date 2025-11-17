
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';
import { DashboardTab } from '../types';
import Profile from '../components/dashboard/Profile';
import Transactions from '../components/dashboard/Transactions';
import Logs from '../components/dashboard/Logs';
import FileUpload from '../components/dashboard/FileUpload';
import CryptoTool from '../components/dashboard/CryptoTool';
import { ShieldCheckIcon, UserCircleIcon, BanknotesIcon, DocumentTextIcon, LockClosedIcon, ArrowLeftOnRectangleIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.PROFILE);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case DashboardTab.PROFILE:
        return <Profile />;
      case DashboardTab.TRANSACTIONS:
        return <Transactions />;
      case DashboardTab.LOGS:
        return <Logs />;
      case DashboardTab.FILE_UPLOAD:
        return <FileUpload />;
      case DashboardTab.CRYPTO_TOOL:
        return <CryptoTool />;
      default:
        return <Profile />;
    }
  };

  const NavItem: React.FC<{ tab: DashboardTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100">
      <aside className="w-64 flex-shrink-0 bg-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-8 px-2">
            <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
            <span className="ml-2 text-xl font-semibold text-white">Secure Vault</span>
          </div>
          <nav className="space-y-2">
            <NavItem tab={DashboardTab.PROFILE} icon={<UserCircleIcon className="h-6 w-6" />} label="Profile" />
            <NavItem tab={DashboardTab.TRANSACTIONS} icon={<BanknotesIcon className="h-6 w-6" />} label="Transactions" />
            <NavItem tab={DashboardTab.LOGS} icon={<DocumentTextIcon className="h-6 w-6" />} label="Activity Logs" />
            <NavItem tab={DashboardTab.FILE_UPLOAD} icon={<ArchiveBoxIcon className="h-6 w-6" />} label="File Upload" />
            <NavItem tab={DashboardTab.CRYPTO_TOOL} icon={<LockClosedIcon className="h-6 w-6" />} label="Crypto Tool" />
          </nav>
        </div>
        <div className="border-t border-slate-700 pt-4">
          <div className="px-4 py-3 mb-2">
            <p className="text-sm font-medium text-white">{user.username}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-700 transition-colors duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardPage;
