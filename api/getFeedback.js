export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    try {
        const { userInfo, data, systemPrompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const userQuery = `학생 정보: ${userInfo.grade}학년 ${userInfo.class}반 ${userInfo.number}번 ${userInfo.name}
[활동 1: 비슷한 점]
${data.similar}
[활동 1: 다른 점]
${data.different}
[활동 2: 새롭게 창조하기]
${data.creative}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
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
            throw new Error(`Google Feedback API error: ${apiResponse.status} ${errorText}`);
        }

        const result = await apiResponse.json();
        res.status(200).json(result);

    } catch (error) {
        console.error('Serverless function error:', error);
        res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}