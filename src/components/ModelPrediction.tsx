// components/ModelPrediction.tsx
'use client';
import { useState } from 'react';

type ModelName = 'bert' | 'distilbert' | 'roberta';

interface PredictionResult {
  model_used: string;
  prediction: string;
  confidence: number;
  method?: string;
  total_tokens?: number;
  chunks_analyzed?: number;
  vote_breakdown?: Record<string, number>;
}

export default function ModelPrediction() {
  const [text, setText] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelName>('distilbert');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!text.trim()) {
      setError('Please enter text to classify');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          model_name: selectedModel 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (prediction: string) => {
    switch (prediction.toLowerCase()) {
      case 'exempt':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'expedited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'full_review':
      case 'full review':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Research Ethics Classification</h2>
      
      {/* Model Selection */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Model:</label>
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value as ModelName)}
          className="w-full p-2 border rounded"
          disabled={loading}
        >
          <option value="distilbert">DistilBERT (Faster)</option>
          <option value="bert">BERT</option>
          <option value="roberta">RoBERTa</option>
        </select>
      </div>
      
      {/* Text Input */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Research Text:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter research proposal or abstract... (Long texts supported)"
          className="w-full p-4 border rounded resize-none"
          rows={8}
          disabled={loading}
        />
        <p className="text-sm text-gray-600 mt-1">
          {text.length} characters • Supports documents of any length
        </p>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
      
      {/* Predict Button */}
      <button
        onClick={handlePredict}
        disabled={loading || !text.trim()}
        className="w-full px-6 py-3 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
      >
        {loading ? 'Analyzing...' : 'Classify Research'}
      </button>
      
      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-bold">Classification Result</h3>
          
          {/* Main Result Card */}
          <div className={`p-6 rounded-lg border-2 ${getCategoryColor(result.prediction)}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold uppercase">Category</p>
                <p className="text-2xl font-bold mt-1">
                  {result.prediction.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">Confidence</p>
                <p className="text-2xl font-bold">{(result.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Model</p>
              <p className="font-bold">{result.model_used.toUpperCase()}</p>
            </div>
            
            {result.total_tokens && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Total Tokens</p>
                <p className="font-bold">{result.total_tokens}</p>
              </div>
            )}
            
            {result.method && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Analysis Method</p>
                <p className="font-bold">
                  {result.method === 'chunking_with_voting' 
                    ? 'Chunked Analysis' 
                    : 'Single Pass'}
                </p>
              </div>
            )}
            
            {result.chunks_analyzed && (
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Chunks Analyzed</p>
                <p className="font-bold">{result.chunks_analyzed}</p>
              </div>
            )}
          </div>

          {/* Vote Breakdown */}
          {result.vote_breakdown && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold mb-3">Vote Breakdown:</p>
              <div className="space-y-2">
                {Object.entries(result.vote_breakdown).map(([category, votes]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="font-medium">
                      {category.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-blue-200 rounded-full font-bold text-sm">
                      {votes} {votes === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
