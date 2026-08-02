import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Zap, TrendingUp, Receipt, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/analytics/profile');
        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* User Card */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-rose-500 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {user?.full_name || 'User Profile'}
              </h1>
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </p>
              <div className="pt-1">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Role: {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* User Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                <Zap className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Prediction Count</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '...' : profileData?.prediction_count || 0}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Average Consumption</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '...' : `${profileData?.average_consumption || 0} kWh`}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <Receipt className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Average Bill</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? '...' : `₹${profileData?.average_bill || 0}`}
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase">Last Prediction</span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {profileData?.last_prediction_date ? new Date(profileData.last_prediction_date).toLocaleDateString() : 'No activity yet'}
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
