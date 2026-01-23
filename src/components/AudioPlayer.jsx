
import React, { useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioPlayer = ({ src, label }) => {
    return (
        <div className="w-full flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">{label}</span>
            <audio
                src={src}
                controls
                className="w-full h-8"
            />
        </div>
    );
};

export default AudioPlayer;
