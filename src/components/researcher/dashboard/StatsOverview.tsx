export default function StatsOverview({ stats }: { stats: { active: number, pending: number, needsRevision: number } }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
      <StatCard 
        label="Active Submissions" 
        value={stats.active} 
        colorFrom="#003366" colorTo="#004080" 
        bgGradient="from-white to-[#E0C8A0]/10" 
        iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
      />
      <StatCard 
        label="Pending Review" 
        value={stats.pending} 
        colorFrom="#87CEEB" colorTo="#6BB6D9" 
        bgGradient="from-white to-[#87CEEB]/10" 
        iconPath="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
      <StatCard 
        label="Requires Revision" 
        value={stats.needsRevision} 
        colorFrom="#F7D117" colorTo="#B8860B" 
        bgGradient="from-white to-[#F7D117]/10" 
        iconPath="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
      />
    </div>
  );
}

const StatCard = ({ label, value, colorFrom, colorTo, bgGradient, iconPath }: any) => (
  <div className={`group bg-gradient-to-br ${bgGradient} rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-[${colorFrom}] hover:shadow-lg transition-all duration-300`}>
    <div className="flex items-center gap-3 sm:gap-4">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[${colorFrom}] to-[${colorTo}] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} /></svg>
      </div>
      <div>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-0.5 sm:mb-1 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>{label}</p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})`, fontFamily: 'Metropolis, sans-serif' }}>{value}</p>
      </div>
    </div>
  </div>
);
