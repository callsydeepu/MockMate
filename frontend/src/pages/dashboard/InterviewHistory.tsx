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
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">Interview Practice Logs</h1>
          <p className="text-slate-400 text-xs font-medium">History of all simulated mock interviews and biometrics logs</p>
        </div>

        {/* Filter input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset pagination
            }}
            placeholder="Search by company or role..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/60 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all duration-300"
          />
        </div>
      </div>

      <Card className="border-white/5 p-0 overflow-hidden">
        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 font-mono text-[10px] tracking-wider uppercase">
                <th className="py-4 px-6 font-bold">Interview Profile</th>
                <th className="py-4 px-6 font-bold">Simulated Company</th>
                <th className="py-4 px-6 font-bold text-center">Session Rating</th>
                <th className="py-4 px-6 font-bold text-center">Date</th>
                <th className="py-4 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300 text-xs">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No matching interview records found. Take a mock test!
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/2 transition-colors">
                    {/* Role info */}
                    <td className="py-4.5 px-6 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                          <Compass className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <span className="block font-bold">{item.role}</span>
                          <span className="text-[10px] text-slate-400 font-medium font-mono">ID: {item.id}</span>
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
                    <td className="py-4.5 px-6 text-center text-slate-400 font-mono text-[10px]">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {item.date}
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="py-4.5 px-6 text-right">
                      <button
                        onClick={() => navigate(`/reports`, { state: { reportId: item.id } })}
                        className="glass-btn px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 hover:bg-violet-600/20 hover:border-violet-500/50 hover:text-white transition-colors"
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-slate-950/20">
            <span className="text-[10px] text-slate-500 font-mono">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} records
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-white/5 bg-white/3 text-slate-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all border ${
                    currentPage === idx + 1
                      ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                      : 'border-white/5 bg-slate-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-white/5 bg-white/3 text-slate-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
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
