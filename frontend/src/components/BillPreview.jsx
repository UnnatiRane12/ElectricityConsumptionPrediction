import React from 'react';
import { Printer, Zap, QrCode, CheckCircle2 } from 'lucide-react';

const BillPreview = ({ billData, customerName = 'Alex Mercer', customerEmail = 'alex@example.com' }) => {
  if (!billData) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = billData.prediction_date
    ? new Date(billData.prediction_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <>
      {/* Print-only styles injected into head */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-bill, #printable-bill * { visibility: visible; }
          #printable-bill { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            padding: 24px; 
            background: white;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="space-y-5 max-w-2xl mx-auto">
        {/* Bill Invoice Card */}
        <div
          id="printable-bill"
          className="bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-md">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">POWERPREDICT</h2>
                <p className="text-xs text-slate-500">Smart Electricity Analytics & Billing</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-lg border border-cyan-200">
                ELECTRICITY INVOICE
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1.5">
                Bill #: {billData.bill_number || 'INV-0001'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Date: {formattedDate}</p>
            </div>
          </div>

          {/* Customer & Prediction Info */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Customer Info
              </span>
              <p className="font-bold text-slate-900 text-sm">{customerName}</p>
              <p className="text-slate-500 mt-0.5">{customerEmail}</p>
              <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                Account ID: CUST-{billData.user_id || 101}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Prediction Metadata
              </span>
              <p className="text-slate-700">
                Type:{' '}
                <span className="font-bold capitalize">{billData.prediction_type || 'monthly'}</span>{' '}
                Prediction
              </p>
              <p className="text-slate-700 mt-0.5">
                Usage:{' '}
                <span className="font-bold text-cyan-700">
                  {billData.predicted_units?.toFixed(2)} kWh
                </span>
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="text-slate-500">Category:</span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {billData.category || 'Residential'}
                </span>
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-right">Units</th>
                  <th className="px-4 py-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-800">Energy Consumption Charge</td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    ₹{billData.tariff_rate?.toFixed(2) || '6.50'}/kWh
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">
                    {billData.predicted_units?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    ₹{billData.energy_charge?.toFixed(2)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-800">Fixed Grid Service Charge</td>
                  <td className="px-4 py-3 text-right text-slate-400">—</td>
                  <td className="px-4 py-3 text-right text-slate-400">—</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    ₹{billData.fixed_charge?.toFixed(2)}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-800">State Electricity Duty & Taxes</td>
                  <td className="px-4 py-3 text-right text-slate-500">8.0%</td>
                  <td className="px-4 py-3 text-right text-slate-400">—</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">
                    ₹{billData.taxes?.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-emerald-50">
                  <td
                    colSpan="3"
                    className="px-4 py-3.5 text-right text-xs font-extrabold uppercase tracking-wider text-emerald-800"
                  >
                    Total Amount Payable:
                  </td>
                  <td className="px-4 py-3.5 text-right text-emerald-700 text-base font-extrabold">
                    ₹{billData.total_amount?.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                AI Model Verified Invoice
              </span>
              <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                This invoice is generated automatically based on XGBoost ML energy predictions.
              </p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-cyan-200 flex flex-col items-center justify-center">
              <QrCode className="w-9 h-9 text-cyan-600" />
              <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Scan</span>
            </div>
          </div>
        </div>

        {/* Print Button — hidden when printing */}
        <div className="no-print flex justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 hover:scale-105 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default BillPreview;
