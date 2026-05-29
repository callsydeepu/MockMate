import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, FileText, ExternalLink, Calendar, Compass } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { ScoreBadge } from '../../components/common/ScoreBadge';
import { useInterview } from '../../context/interview/InterviewContext';

const InterviewHistory: React.FC = () => {
  const { reports } = useInterview();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter history based on search query
  const filteredReports = reports.filter(r => 
    r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination bounds
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getCompanyTagStyle = (company: string) => {
    if (company.toLowerCase() === 'google') return 'tag-neon-pink';
    if (company.toLowerCase() === 'amazon') return 'tag-neon-amber';
    return 'tag-neon-cyan';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-slate-900">Interview Practice Logs</h1>
          <p className="text-slate-500 text-xs font-semibold">History of all simulated mock interviews and biometrics logs</p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset pagination
            }}
            placeholder="Search by company or role..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white/70 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all duration-300"
          />
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-lg p-0 overflow-hidden bg-white/80 backdrop-blur-md">
        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50 text-slate-500 font-mono text-[10px] tracking-wider uppercase">
                <th className="py-4 px-6 font-bold">Interview Profile</th>
                <th className="py-4 px-6 font-bold">Simulated Company</th>
                <th className="py-4 px-6 font-bold text-center">Session Rating</th>
                <th className="py-4 px-6 font-bold text-center">Date</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-semibold">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-bold">
                    No matching interview records found. Take a mock test!
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-violet-50/20 transition-all duration-200">
                    {/* Role info */}
                    <td className="py-4.5 px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                          <Compass className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900">{item.role}</span>
                          <span className="text-[10px] text-slate-500 font-semibold font-mono">ID: {item.id}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Company Tag */}
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${getCompanyTagStyle(item.companyName)}`}>
                        {item.companyName}
                      </span>
                    </td>

                    {/* Score Badge */}
                    <td className="py-4.5 px-6 text-center">
                      <ScoreBadge score={item.overallScore} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="py-4.5 px-6 text-center text-slate-500 font-mono text-[10px] font-bold">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.date}
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/reports`, { state: { reportId: item.id } })}
                        className="glass-btn px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition-colors font-bold text-slate-700 hover:text-violet-700 hover:bg-violet-50/50 hover:border-violet-300 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Analysis</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-[10px] text-slate-500 font-mono font-semibold">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-7 h-7 rounded-xl text-xs font-mono font-bold transition-all border ${
                    currentPage === idx + 1
                      ? 'bg-violet-600 text-white border-violet-500 shadow-sm shadow-violet-500/10'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm cursor-pointer'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InterviewHistory;
