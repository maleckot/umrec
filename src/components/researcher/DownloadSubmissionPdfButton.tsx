// src/components/researcher/DownloadSubmissionPdfButton.tsx
'use client';

import { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';
import { generatePdfFromDatabase } from '@/app/actions/generatePdfFromDatabase';
import { exit } from 'process';

interface DownloadSubmissionPdfButtonProps {
    submissionId: string;
    submissionTitle?: string;
    variant?: 'primary' | 'secondary' | 'icon';
    size?: 'sm' | 'md' | 'lg';
}

export default function DownloadSubmissionPdfButton({
    submissionId,
    submissionTitle = 'Submission',
    variant = 'primary',
    size = 'md',
}: DownloadSubmissionPdfButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);

        try {
            const result = await generatePdfFromDatabase(submissionId);

            if (result.success && result.pdfData) {
                // Trigger download
                const link = document.createElement('a');
                link.href = result.pdfData;
                link.download = result.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                alert(`PDF downloaded successfully! (${result.pageCount} pages)`);
            }
            if (!result.success) {
                alert('Failed: ' + result.error); 
                return; // Exit early
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading PDF');
        }

        setIsGenerating(false);
    };

    // Icon-only variant
    if (variant === 'icon') {
        return (
            <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                title="Download PDF"
            >
                {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
            </button>
        );
    }

    // Button sizes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    // Button variants
    const variantClasses = {
        primary: 'bg-[#071139] text-white hover:bg-[#0a1d5e]',
        secondary: 'bg-white text-[#071139] border-2 border-[#071139] hover:bg-gray-50',
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className={`flex items-center space-x-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]}`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
            {isGenerating ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                </>
            ) : (
                <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                </>
            )}
        </button>
    );
}
