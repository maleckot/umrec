import { CheckCircle } from 'lucide-react';

const RequirementsList: React.FC = () => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 sm:p-6 rounded-r-lg">
      <h4 className="font-bold text-[#071139] text-sm sm:text-base mb-3 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <CheckCircle size={18} className="text-orange-500" />
        Revised Endorsement Letter Must Include:
      </h4>
      <ul className="space-y-2 text-xs sm:text-sm text-gray-800 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Research title (updated if changed)</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Researcher(s) name(s) and affiliation</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span><strong>Statement acknowledging the revisions made</strong> to the research protocol</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span><strong>Confirmation that the adviser has reviewed and approved the revisions</strong></span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Renewed endorsement and recommendation for ethics re-review</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span>Adviser's signature, name, and designation</span>
        </li>
        <li className="flex items-start">
          <span className="mr-2 flex-shrink-0 text-orange-600 font-bold">✓</span>
          <span><strong>Date of updated endorsement</strong> (must be recent)</span>
        </li>
      </ul>
    </div>
  );
};

export default RequirementsList;
