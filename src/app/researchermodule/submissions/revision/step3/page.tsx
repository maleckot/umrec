import { Suspense } from 'react';
import RevisionStep3Content from './step3-content';

export default function Step3Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
<RevisionStep3Content />
    </Suspense>
  );
}
