'use client';

interface Props {
  title: string;
  submissionId: string;
}

const HeaderSection = ({ title, submissionId }: Props) => {
  return (
    <div className="mb-6">
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}
      >
        {title}
      </h1>
      <p
        className="text-gray-700 font-medium mt-2"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Submission ID: <span className="font-bold text-[#101C50]">{submissionId}</span>
      </p>
    </div>
  );
};

export default HeaderSection;
