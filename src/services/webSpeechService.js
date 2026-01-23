
export const textToSpeech = async (text) => {
    return new Promise((resolve) => {
        // Check if browser supports speech synthesis
        if (!('speechSynthesis' in window)) {
            console.error("Web Speech API not supported");
            resolve(null);
            return;
        }

        // specific handling for "speak" vs "get audio blob"
        // Web Speech API plays directly, so we can't easily return a Blob URL.
        // Instead we will handle the "playing" state in the UI or just trigger it here.
        // But to fit the existing app flow (async generate -> then play), 
        // we might need to adjust App.jsx.
        // For now, let's just return a "mock" URL or a special flag.
        // Or better, we can modify the App to play when ready.

        // Actually, for better UX, we'll return a special string or null 
        // and let the UI component handle the 'speaking' action.
        resolve("WEB_SPEECH_API");
    });
};

export const speakText = (text) => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(text);
        // Optional: Select a decent voice
        const voices = window.speechSynthesis.getVoices();
        // Try to find a good English voice
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    }
};
