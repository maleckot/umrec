import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
         {/* Light Gray Bottom Bar */}
      <div className="w-full h-50" style={{ backgroundColor: '#E8EEF3' }}></div>
      {/* Yellow Line Separator */}
      <div className="w-full h-1 bg-[#D3CC50]"></div>

 {/* Footer Content */}
      <div className="py-16 px-20 md:px-32 lg:px-30" style={{ backgroundColor: '#071139' }}>
        <div className="max-w-10xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {/* Left Section - Description */}
            <div className="text-white max-w-2xl">
              <p className="text-base md:text-lg" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                A key collaborative project by the {' '}
                <span className="underline">University of Makati Research Ethics Committee (UMREC)</span>{' '}
                and Boolerina Cododilla focused on the application of ethical principles in academic research.
              </p>
            </div>

            {/* Right Section - Contact Info */}
            <div className="text-white text-right">
              <p className="text-base md:text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                EMAIL |{' '}
                        <a 
            href="mailto:Umrec@Umak.Edu.Ph" 
            className="hover:underline"
            style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
            >
            Umrec@Umak.Edu.Ph
            </a>
              </p>
              <p className="text-base md:text-lg" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}>
                PHONE | 09999999
              </p>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 text-white">
              <Link 
                href="/privacy-policy" 
                className="text-base md:text-lg hover:underline" 
                style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
              >
                Privacy Policy
              </Link>
              <span className="hidden md:inline text-white">|</span>
              <Link 
                href="https://umak.edu.ph" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:underline underline" 
                style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
              >
                UMak.edu.ph
              </Link>
              <span className="hidden md:inline text-white">|</span>
              <Link 
                href="https://makati.gov.ph" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg hover:underline" 
                style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 400 }}
              >
                makati.gov.ph
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
