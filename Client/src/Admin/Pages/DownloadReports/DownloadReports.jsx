import React from "react";

const DownloadReports = () => {
  return (
    <div className="p-6 lg:p-10 max-w-[1400px] mx-auto">
      <header className="mb-10">
        <h1
          className="text-[2.5rem] font-bold text-slate-100 flex items-center gap-4"
          style={{ fontFamily: "'Playfair Display',serif" }}
        >
          <span>📥</span> Download Data
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Export system records to CSV, PDF or Excel formats.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['Centers Data', 'Volunteers List', 'Disaster History', 'Request Logs', 'Victim Records'].map(item => (
          <div key={item} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-200">{item}</h3>
              <span className="text-2xl">📄</span>
            </div>
            <p className="text-sm text-slate-500 mb-6">Complete records for {item.toLowerCase()} including all metadata.</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 px-3 bg-[#21262d] border border-[#30363d] rounded-lg text-xs font-bold text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">CSV</button>
              <button className="flex-1 py-2 px-3 bg-[#21262d] border border-[#30363d] rounded-lg text-xs font-bold text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadReports;
