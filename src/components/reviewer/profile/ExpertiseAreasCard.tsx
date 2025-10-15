// components/reviewer/profile/ExpertiseAreasCard.tsx
'use client';

interface ExpertiseAreasCardProps {
  expertiseAreas: string[];
}

export default function ExpertiseAreasCard({ expertiseAreas }: ExpertiseAreasCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-6">
      <h2 className="text-xl font-bold text-[#101C50] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Areas of Expertise
      </h2>

      <div className="flex flex-wrap gap-3">
        {expertiseAreas.map((area, index) => (
          <div
            key={index}
            className="px-4 py-2 bg-[#101C50] text-white rounded-lg font-semibold"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            {area}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        * Areas of expertise are set by the administrator and cannot be edited.
      </p>
    </div>
  );
}
