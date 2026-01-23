
const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Default voice ID (Rachel)
const ELEVEN_LABS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

export const textToSpeech = async (text) => {
    try {
        const response = await fetch(ELEVEN_LABS_API_URL, {
            method: "POST",
            headers: {
                "xi-api-key": ELEVEN_LABS_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_v3",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.7
                }
            })
        });

        if (!response.ok) {
            throw new Error("ElevenLabs TTS failed");
        }

        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);

    } catch (error) {
        console.error("TTS Error:", error);
        throw error;
    }
};
