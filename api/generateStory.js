export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { grade, systemPrompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY; // Vercel에 저장된 API 키를 안전하게 가져옴
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: `초등학교 ${grade}학년 수준의 비현실적인 이야기를 만들어줘.` }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { responseMimeType: "application/json" }
        };

        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            throw new Error(`Google API error: ${apiResponse.status} ${errorText}`);
        }

        const data = await apiResponse.json();
        res.status(200).json(data); // 결과를 프론트엔드로 다시 보내줌

    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}
