import React, { useState, useEffect } from 'react';
import { Receipt, Search, Download, Printer, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import BillPreview from '../components/BillPreview';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const BillGeneratorPage = () => {
  const { user } = useAuth();
  const [latestBill, setLatestBill] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLatestBill = async () => {
    setLoading(true);
    try {
      const historyRes = await api.get('/predict/history');
      if (historyRes.data && historyRes.data.length > 0) {
        const latestPred = historyRes.data[0];
        const billRes = await api.get(`/bills/prediction/${latestPred.id}`);
        setLatestBill(billRes.data);
      }
    } catch (err) {
      console.error("Failed to load bill:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBill();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex gap-6">
        <Sidebar />

        <main className="flex-1 py-6 space-y-6">
          {/* Header Banner */}
          <div className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Receipt className="w-4 h-4" />
                <span>Invoice Engine</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Electricity Bill Generator & PDF Preview
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Generate official utility invoices with tariff details, energy charges, state taxes, QR code placeholders, and downloadable PDFs.
              </p>
            </div>
          </div>

          {/* Main Bill Container */}
          {loading ? (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-400 font-semibold text-sm">
              Loading bill details...
            </div>
          ) : latestBill ? (
            <BillPreview
              billData={latestBill}
              customerName={user?.full_name || "Alex Mercer"}
              customerEmail={user?.email || "alex@example.com"}
            />
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center space-y-4">
              <Receipt className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Bills Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Run a Daily or Monthly Electricity Prediction first to automatically generate your itemized electricity bill.
              </p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default BillGeneratorPage;
