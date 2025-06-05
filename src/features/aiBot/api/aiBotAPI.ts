export async function fetchAiStream(_chatId: string, userMessage: string): Promise<ReadableStream> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw new Error('Gemini API key is not configured');
    }

    const encoder = new TextEncoder();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: userMessage
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No content received from Gemini API');
        }

        // Create a simple streaming response by chunking the text
        const words = text.split(' ');
        const chunks: string[] = [];
        let currentChunk = '';

        for (let i = 0; i < words.length; i++) {
            currentChunk += words[i] + ' ';
            if (currentChunk.length > 20 || i === words.length - 1) {
                chunks.push(currentChunk);
                currentChunk = '';
            }
        }

        let chunkIndex = 0; return new ReadableStream({
            async pull(controller) {
                if (chunkIndex < chunks.length) {
                    controller.enqueue(encoder.encode(chunks[chunkIndex]));
                    chunkIndex++;
                } else {
                    controller.close();
                }
            }
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
}
