export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { prompt } = req.body;
        // 이미지 생성에는 별도의 API 키가 필요할 수 있습니다.
        // 만약 Gemini API 키와 동일하다면 그대로 사용하고, 다르다면 Vercel에 새로 추가해야 합니다.
        const apiKey = process.env.IMAGEN_API_KEY || process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-1.0-generate-001:predict?key=${apiKey}`;

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