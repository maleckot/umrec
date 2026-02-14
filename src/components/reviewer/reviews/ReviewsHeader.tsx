'use client';

const ReviewsHeader = () => {
  return (
    <div className="mb-8 sm:mb-10 animate-fadeIn">
      <h1 
        className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#101C50] via-[#1a2d70] to-[#101C50] bg-clip-text text-transparent mb-2"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        My Reviews
      </h1>
      <div className="h-1.5 w-24 bg-gradient-to-r from-[#101C50] to-[#288cfa] rounded-full"></div>
    </div>
  );
};

export default ReviewsHeader;
