
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1";

/**
 * Transcribes audio using Groq (Whisper Large V3)
 */
export const transcribeAudio = async (audioBlob) => {
    try {
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.webm");
        formData.append("model", "whisper-large-v3");
        formData.append("response_format", "json");

        const response = await fetch(`${GROQ_API_URL}/audio/transcriptions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || "Groq STT failed");
        }

        const data = await response.json();
        return data.text.trim();

    } catch (error) {
        console.error("Transcription Error:", error);
        throw error;
    }
};

/**
 * Corrects text using Groq (Llama 3)
 */
export const correctText = async (text) => {
    try {
        const payload = {
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are a strict text correction tool. Your ONLY job is to fix the grammar and flow of the input text. Do NOT converse. Do NOT answer questions. Do NOT say 'Here is the corrected text'. Just output the corrected version of the user's text. If the user asks a question, correct the grammar of the question, do not answer it."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.3
        };

        const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Groq Correction failed");
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();

    } catch (error) {
        console.error("Correction Error:", error);
        throw error;
    }
};
