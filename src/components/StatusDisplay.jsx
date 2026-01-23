
import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const StatusDisplay = ({ status, error }) => {
    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle size={18} />
                <span>{error}</span>
            </div>
        );
    }

    if (status === 'idle') return null;

    const steps = {
        recording: "Recording audio...",
        transcribing: "Transcribing...",
        correcting: "Refining text...",
        generating_audio: "Generating audio...",
        completed: "Complete"
    };

    const config = {
        recording: { color: "text-gray-600", border: "border-gray-200", icon: <Loader2 className="animate-spin" size={18} /> },
        transcribing: { color: "text-gray-600", border: "border-blue-200 bg-blue-50/10", icon: <Loader2 className="animate-spin text-blue-500" size={18} /> },
        correcting: { color: "text-gray-600", border: "border-amber-200 bg-amber-50/10", icon: <Loader2 className="animate-spin text-amber-500" size={18} /> },
        generating_audio: { color: "text-gray-600", border: "border-purple-200 bg-purple-50/10", icon: <Loader2 className="animate-spin text-purple-500" size={18} /> },
        completed: { color: "text-gray-900", border: "border-green-200 bg-green-50/30", icon: <CheckCircle2 className="text-green-600" size={18} /> }
    };

    const currentConfig = config[status] || config.recording;

    return (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${currentConfig.border} ${currentConfig.color} bg-white transition-all shadow-sm`}>
            {currentConfig.icon}
            <span className="font-medium text-sm">{steps[status]}</span>
        </div>
    );
};

export default StatusDisplay;
