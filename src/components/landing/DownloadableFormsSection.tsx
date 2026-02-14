import { Repeat, BookOpen } from 'lucide-react';

interface FormItem {
  id: string;
  title: string;
  form_number: string;
  file_url: string;
}

export default function DownloadableFormsSection({ forms }: { forms: FormItem[] }) {
  const formIcons = [
    <Repeat key="rep" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
    <BookOpen key="book" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />,
    <svg key="1" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    <svg key="2" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  ];

  return (
    <div className="py-12 px-4 sm:px-8 bg-[#E8EEF3]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-xl md:text-4xl text-[#101C50]" style={{ fontWeight: 800 }}>DOWNLOADABLE FORMS<div className="w-20 h-1 bg-[#D3CC50]"></div></h2>
          <p className="text-sm md:text-lg mt-4 text-[#101C50]">Download the required forms for your research ethics application</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {forms.map((file, index) => (
            <div key={file.id || index} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.5rem)] bg-white rounded-xl p-6 border-2 border-[#101C50]/10 shadow-lg hover:-translate-y-2 transition-transform flex flex-col group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#101C50] to-[#050B24] flex items-center justify-center mx-auto mb-4 text-[#F0E847] shadow-lg group-hover:scale-110 transition-transform">
                {formIcons[index % formIcons.length]}
              </div>
              <h3 className="text-sm md:text-lg font-bold text-[#101C50] mb-2 text-center">{file.title}</h3>
              <p className="text-xs text-[#101C50]/70 mb-4 text-center">{file.form_number}</p>
              <a href={file.file_url} download className="mt-auto w-full bg-gradient-to-r from-[#101C50] to-[#050B24] text-white py-3 rounded-lg font-semibold text-sm flex justify-center gap-2 hover:shadow-xl transition-all">
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
