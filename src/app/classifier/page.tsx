// src/app/classifier/page.tsx
import ModelPrediction from '@/components/ModelPrediction';

export default function ClassifierPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ModelPrediction />
    </div>
  );
}
