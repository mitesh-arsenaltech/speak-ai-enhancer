
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, RotateCcw, Upload, FileAudio } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState(null);
    const [uploadMode, setUploadMode] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onRecordingComplete(blob);
                chunksRef.current = [];
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 20) {
                        stopRecording();
                        return 20;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access denied.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            clearInterval(timerRef.current);
            setIsRecording(false);
        }
    };

    const resetRecording = () => {
        setAudioUrl(null);
        setRecordingTime(0);
        setUploadedFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAudioUrl(url);
            setUploadedFileName(file.name);
            onRecordingComplete(file);
        }
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    // Minimalistic helper for rendering time
    const formatTime = (seconds) => {
        return `00:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg mb-6 mx-auto w-fit">
                <button
                    onClick={() => { setUploadMode(false); resetRecording(); }}
                    className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${!uploadMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Record
                </button>
                <button
                    onClick={() => { setUploadMode(true); resetRecording(); }}
                    className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${uploadMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Upload
                </button>
            </div>

            {!uploadMode ? (
                <div className="text-center space-y-6">
                    <div className="font-mono text-5xl font-light tracking-tighter text-gray-900">
                        {formatTime(recordingTime)}
                        <span className="text-gray-300 text-3xl ml-2">/ 20s</span>
                    </div>

                    <div className="flex justify-center gap-4 items-center h-20">
                        {!isRecording && !audioUrl && (
                            <button
                                onClick={startRecording}
                                className="group flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full hover:bg-black transition-all hover:scale-105 shadow-md"
                            >
                                <Mic size={24} className="text-white" />
                            </button>
                        )}

                        {isRecording && (
                            <button
                                onClick={stopRecording}
                                className="group flex items-center justify-center w-16 h-16 bg-red-600 rounded-full hover:bg-red-700 transition-all hover:scale-105 shadow-md"
                            >
                                <Square size={24} className="text-white fill-white" />
                            </button>
                        )}

                        {audioUrl && (
                            <div className="flex items-center gap-2 bg-gray-100 pl-4 pr-2 py-2 rounded-full">
                                <span className="text-xs font-medium text-gray-500">Ready</span>
                                <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
                                <button
                                    onClick={resetRecording}
                                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                    {isRecording && <p className="text-xs text-gray-400">Recording will auto-stop at 20s</p>}
                </div>
            ) : (
                <div className="text-center">
                    {!audioUrl ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-gray-900 hover:bg-gray-50 transition-all group"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="audio/*"
                                className="hidden"
                            />
                            <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-white border border-gray-100">
                                <Upload className="text-gray-400 group-hover:text-gray-900" size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">Choose Audio File</span>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white border border-gray-200 rounded-lg">
                                    <FileAudio className="text-gray-700" size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{uploadedFileName}</p>
                                    <p className="text-xs text-gray-500">Ready to process</p>
                                </div>
                            </div>
                            <button
                                onClick={resetRecording}
                                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
