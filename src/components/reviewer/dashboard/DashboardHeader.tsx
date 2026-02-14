'use client';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Reviewer Dashboard
        </h1>
        <p className="text-gray-600 text-base font-medium">
          Manage your review assignments and access ethics resources.
        </p>
      </div>
      <div className="text-right hidden md:block bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Today's Date</p>
        <p className="text-base font-bold text-[#101C50]">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
