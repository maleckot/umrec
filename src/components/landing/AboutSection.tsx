interface AboutProps {
  text: string;
}

export default function AboutSection({ text }: AboutProps) {
  return (
    <>
      <div className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-20 lg:px-32 bg-[#E8EEF3]">
        <div className="max-w-6xl mx-auto text-left fade-in-section">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-2 relative inline-block text-[#101C50]" style={{ fontWeight: 700 }}>
            ABOUT UMREC
            <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-1 bg-[#D3CC50]"></div>
          </h2>
          <p className="mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-justify whitespace-pre-line text-[#101C50]">
            {text}
          </p>
        </div>
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D3CC50] to-transparent shadow-glow-yellow"></div>
    </>
  );
}
