// components/SearchBar.tsx
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      />
    </div>
  );
}
