// components/SubmissionDetailsCard.tsx
'use client';

interface SubmissionDetailsCardProps {
  description: string;
  category: string;
  dateSubmitted: string;
  dueDate: string;
  researchDescription: string;
}

const SubmissionDetailsCard: React.FC<SubmissionDetailsCardProps> = ({
  description,
  category,
  dateSubmitted,
  dueDate,
  researchDescription,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
        Submission Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}>
            Description
          </p>
          <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {description}
          </p>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}>
            Description
          </p>
          <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {category}
          </p>
        </div>

        {/* Date Submitted */}
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}>
            Date Submitted
          </p>
          <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {dateSubmitted}
          </p>
        </div>

        {/* Due Date */}
        <div>
          <p className="text-xs md:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}>
            Due Date
          </p>
          <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {dueDate}
          </p>
        </div>
      </div>

      {/* Research Description */}
      <div className="mt-6">
        <p className="text-xs md:text-sm text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif', fontWeight: 600 }}>
          Description
        </p>
        <p className="text-sm md:text-base text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {researchDescription}
        </p>
      </div>
    </div>
  );
};

export default SubmissionDetailsCard;
