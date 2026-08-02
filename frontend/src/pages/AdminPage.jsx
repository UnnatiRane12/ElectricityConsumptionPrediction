import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Zap, Receipt, Tag, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import api from '../utils/api';

const AdminPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      setAdminData(res.data);
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* Header */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-600 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Administrator Controls</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Admin Analytics & User Monitoring
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                System-wide overview of registered accounts, total prediction counts, generated bills, and tier distribution.
              </p>
            </div>

            <button
              onClick={fetchAdminStats}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Key Admin Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <Users className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Total Users</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '...' : adminData?.total_users || 0}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Total Predictions</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '...' : adminData?.total_predictions || 0}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <Receipt className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Total Bills Amount</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '...' : `₹${adminData?.total_bills_amount || 0}`}
              </p>
            </div>
          </div>

          {/* User List Table */}
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registered Users Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {adminData?.recent_users?.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-400">#{u.id}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{u.full_name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPage;
