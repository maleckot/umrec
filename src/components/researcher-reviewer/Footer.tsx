import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      
      {/* Yellow Line Separator with glow */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent" style={{ boxShadow: '0 0 20px rgba(211, 204, 80, 0.5)' }}></div>

      {/* Footer Content - Fully Responsive Design */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 bg-gradient-to-b from-[#071139] to-[#050B24] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #F0E847 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Content Section - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
            {/* Left Section - Description */}
            <div className="text-white group">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed transition-all duration-300 group-hover:text-gray-200 text-center lg:text-left" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400, lineHeight: '1.8' }}>
                A key collaborative project by the{' '}
                <span className="font-semibold text-[#F0E847] hover:text-[#D3CC50] transition-colors duration-300 border-b border-[#F0E847]/30 hover:border-[#F0E847] cursor-default">
                  University of Makati Research Ethics Committee (UMREC)
                </span>{' '}
                and Boolerina Cododilla focused on the application of ethical principles in academic research.
              </p>
            </div>

            {/* Right Section - Contact Info - Centered on Mobile */}
            <div className="text-white space-y-3 sm:space-y-4">
              {/* Email Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-2 sm:gap-3 group">
                <span className="text-sm sm:text-base md:text-lg font-semibold text-[#F0E847] whitespace-nowrap" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  EMAIL
                </span>
                <span className="hidden sm:inline text-gray-400">|</span>
                <a 
                  href="mailto:Umrec@Umak.Edu.Ph" 
                  className="text-sm sm:text-base md:text-lg hover:text-[#F0E847] transition-colors duration-300 relative break-all sm:break-normal"
                  style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
                >
                  Umrec@Umak.Edu.Ph
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>

              {/* Phone Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-2 sm:gap-3">
                <span className="text-sm sm:text-base md:text-lg font-semibold text-[#F0E847] whitespace-nowrap" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  PHONE
                </span>
                <span className="hidden sm:inline text-gray-400">|</span>
                <span className="text-sm sm:text-base md:text-lg" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                  09999999
                </span>
              </div>
            </div>
          </div>

          {/* Elegant divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#F0E847]/20 to-transparent mb-6 sm:mb-8"></div>

          {/* Bottom Links - Fully Responsive Stack */}
          <nav className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-white" aria-label="Footer navigation">
            <Link 
              href="/privacy-policy" 
              className="text-sm sm:text-base md:text-lg hover:text-[#F0E847] transition-all duration-300 relative group px-2 py-1" 
              style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
            </Link>

            <span className="hidden sm:inline text-[#F0E847]/30 text-sm md:text-base">|</span>

            <Link 
              href="https://umak.edu.ph" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base md:text-lg text-[#F0E847] hover:text-[#D3CC50] transition-all duration-300 relative group border-b border-[#F0E847]/50 hover:border-[#D3CC50] px-2 py-1" 
              style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
            >
              UMak.edu.ph
            </Link>

            <span className="hidden sm:inline text-[#F0E847]/30 text-sm md:text-base">|</span>

            <Link 
              href="https://makati.gov.ph" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base md:text-lg hover:text-[#F0E847] transition-all duration-300 relative group px-2 py-1" 
              style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
            >
              makati.gov.ph
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0E847] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Optional: Copyright or Additional Info - Mobile Friendly */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              © {new Date().getFullYear()} University of Makati Research Ethics Committee. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
