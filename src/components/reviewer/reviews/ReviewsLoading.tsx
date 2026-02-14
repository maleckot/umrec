'use client';

const ReviewsLoading = () => {
  return (
    <div className="flex items-center justify-center pt-24 md:pt-28 lg:pt-32 pb-8">
      <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-xl">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-[#101C50]/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#101C50] border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-700 text-lg font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Loading reviews...
        </p>
      </div>
    </div>
  );
};

export default ReviewsLoading;
