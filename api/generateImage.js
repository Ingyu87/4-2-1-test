export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { prompt } = req.body;
        const apiKey = process.env.IMAGEN_API_KEY || process.env.GEMINI_API_KEY;

        // 모델 이름을 최신 버전으로 수정한 부분입니다.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

        const payload = {
            instances: [{ prompt: `${prompt}, children's storybook illustration, hyperrealistic, magical lighting` }],
            parameters: { "sampleCount": 1 }
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            throw new Error(`Google Imagen API error: ${apiResponse.status} ${errorText}`);
        }

        const data = await apiResponse.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}
