// --- 전역 변수 및 요소 ---
const userInfo = { grade: '', class: '', number: '', name: '' };
let originalWriting = {}; // 원본 글 저장
let selectedGrade = null;
let selectedLength = null;

const pages = {
    userInfo: document.getElementById('userInfoPage'),
    storySelection: document.getElementById('storySelectionPage'),
    writing: document.getElementById('writingPage'),
    feedback: document.getElementById('feedbackPage'),
    loading: document.getElementById('loading')
};

const textareas = {
    similar: document.getElementById('activity1_similar'),
    different: document.getElementById('activity1_different'),
    creative: document.getElementById('activity2_creative')
};

const counters = {
    similar: document.getElementById('counter1_similar'),
    different: document.getElementById('counter1_different'),
    creative: document.getElementById('counter2_creative')
};

const minLengths = {
    similar: 100,
    different: 100,
    creative: 400
};

const startBtn = document.getElementById('startBtn');
const generateStoryBtn = document.getElementById('generateStoryBtn');
const submitBtn = document.getElementById('submitBtn');
const downloadBtn = document.getElementById('downloadBtn');
const gradeButtons = document.querySelectorAll('.grade-btn');
const lengthButtons = document.querySelectorAll('.length-btn');
const loadingText = document.getElementById('loadingText');

// --- 초기화 및 이벤트 리스너 ---
document.addEventListener('DOMContentLoaded', () => {
    startBtn.addEventListener('click', showStorySelection);
    generateStoryBtn.addEventListener('click', generateAndStartWriting);
    submitBtn.addEventListener('click', submitForFeedback);
    downloadBtn.addEventListener('click', downloadFeedback);

    gradeButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedGrade = button.dataset.grade;
            gradeButtons.forEach(btn => btn.classList.remove('ring-4', 'ring-amber-400'));
            button.classList.add('ring-4', 'ring-amber-400');
            updateGenerateButtonState();
        });
    });

    lengthButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedLength = button.dataset.length;
            lengthButtons.forEach(btn => {
                btn.classList.remove('ring-4', 'ring-amber-400', 'bg-sky-500', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            button.classList.add('ring-4', 'ring-amber-400', 'bg-sky-500', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
            updateGenerateButtonState();
        });
    });

    Object.keys(textareas).forEach(key => {
        textareas[key].addEventListener('input', () => updateCounterAndButton(key));
    });
    
    updateSubmitButtonState();
});

// --- 페이지 전환 및 사용자 정보 저장 ---
function showStorySelection() {
    userInfo.grade = document.getElementById('grade').value || '4';
    userInfo.class = document.getElementById('class').value || '3';
    userInfo.number = document.getElementById('number').value || '1';
    userInfo.name = document.getElementById('name').value || '백인규';

    pages.userInfo.classList.add('hidden');
    pages.storySelection.classList.remove('hidden');
}

function updateGenerateButtonState() {
    if (selectedGrade && selectedLength) {
        generateStoryBtn.disabled = false;
        generateStoryBtn.textContent = `${selectedGrade}학년 ${selectedLength === 'short' ? '짧은' : selectedLength === 'medium' ? '중간' : '긴'} 이야기 만들기`;
    } else {
        generateStoryBtn.disabled = true;
    }
}


// --- AI 이야기 및 이미지 생성 ---
async function generateAndStartWriting() {
    if (!selectedGrade || !selectedLength) {
        alert("학년과 이야기 길이를 먼저 선택해주세요!");
        return;
    }
    
    loadingText.textContent = 'AI가 이야기를 만들고 있어요...';
    pages.loading.classList.remove('hidden');
    
    try {
        const storyData = await generateStoryFromAPI(selectedGrade, selectedLength);
        
        document.getElementById('storyTitle').textContent = storyData.title;
        document.getElementById('storyText').innerHTML = storyData.story.replace(/\n/g, '<br>');
        
        loadingText.textContent = '이야기에 맞는 그림을 그리고 있어요...';
        await generateImageFromAPI(storyData.imagePrompt);

        pages.storySelection.classList.add('hidden');
        pages.writing.classList.remove('hidden');

    } catch (error) {
        console.error("Story/Image generation error:", error);
        alert("이야기를 만드는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
        pages.loading.classList.add('hidden');
    }
}

async function generateStoryFromAPI(grade, length) {
    const lengthInstructions = {
        short: '2~3문단으로 짧게 작성합니다.',
        medium: '4~5문단으로 중간 길이로 작성합니다.',
        long: '6~7문단으로 길게 작성합니다.'
    };
    const storyLengthInstruction = lengthInstructions[length] || lengthInstructions.medium;

    const systemPrompt = `당신은 초등학생을 위한 창의적인 동화 작가입니다. 다음 지시에 따라 비현실적이고 상상력이 풍부한 짧은 이야기를 만들어주세요.

### 지시사항:
1.  대상 독자: 대한민국 ${grade}학년 학생
2.  이야기 주제: 비현실적이고 마법 같은 사건
3.  이야기 구조: 기승전결이 명확해야 합니다.
4.  분량: ${storyLengthInstruction}
5.  응답 형식:
    -   반드시 다음 JSON 스키마를 따르는 JSON 객체로만 응답해주세요.
    -   JSON 객체 외에 다른 어떤 설명이나 텍스트도 추가하지 마세요.
    -   story 내용에 큰따옴표(")가 포함될 경우, 반드시 백슬래시(\\\\)를 사용하여 이스케이프 처리해야 합니다.
    -   \`title\`: 이야기의 제목 (한국어)
    -   \`story\`: 이야기의 전체 내용 (한국어, 문단은 \\n으로 구분)
    -   \`imagePrompt\`: 이야기의 가장 핵심적인 장면을 묘사하는, AI 이미지 생성기를 위한 한 문장의 프롬프트 (영어, 구체적이고 사실적인 스타일로)`;

    // API 호출 주소가 우리 서버리스 함수 주소로 변경되었습니다.
    const response = await fetch('/api/generateStory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            grade: grade,
            systemPrompt: systemPrompt
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.message}`);
    }
    
    const result = await response.json();
    let jsonString = result.candidates[0].content.parts[0].text;
    jsonString = jsonString.replace(/^```json\s*/, '').replace(/```$/, '');
    return JSON.parse(jsonString);
}

async function generateImageFromAPI(prompt) {
    const storyImage = document.getElementById('storyImage');
    const apiKey = ""; // 서버리스 함수로 옮길 예정
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const payload = {
        instances: [{ prompt: `${prompt}, children's storybook illustration, hyperrealistic, magical lighting` }],
        parameters: { "sampleCount": 1 }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Image generation failed.');

    const result = await response.json();
    if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
        storyImage.src = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
    }
}

// --- 글자 수 계산 및 제출 버튼 활성화 ---
function updateCounterAndButton(key) {
    const currentLength = textareas[key].value.length;
    const minLength = minLengths[key];
    counters[key].textContent = `${currentLength}자 / 최소 ${minLength}자`;
    
    if (currentLength >= minLength) {
        counters[key].classList.remove('text-red-500');
        counters[key].classList.add('text-green-600');
    } else {
        counters[key].classList.add('text-red-500');
        counters[key].classList.remove('text-green-600');
    }
    updateSubmitButtonState();
}

function updateSubmitButtonState() {
    const isReady = Object.keys(textareas).every(key => textareas[key].value.length >= minLengths[key]);
    submitBtn.disabled = !isReady;
}

// --- 글 제출 및 AI 첨삭 요청 ---
async function submitForFeedback() {
    loadingText.textContent = 'AI 선생님이 글을 꼼꼼히 읽고 있어요...';
    pages.loading.classList.remove('hidden');

    originalWriting = {
        similar: textareas.similar.value,
        different: textareas.different.value,
        creative: textareas.creative.value
    };

    try {
        const feedbackObject = await getAIFeedback(originalWriting);
        displayFeedback(feedbackObject);
    } catch (error) {
        console.error("Error getting AI feedback:", error);
        alert("AI 첨삭을 받아오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
        pages.loading.classList.add('hidden');
    }
}

// --- Gemini API 호출 (JSON 응답 요청) ---
async function getAIFeedback(data) {
    const systemPrompt = `당신은 초등학교 ${userInfo.grade}학년 학생의 글쓰기를 지도하는, 다정하고 긍정적인 국어 선생님입니다. 학생의 글을 분석하여 칭찬과 격려를 담아 첨삭 지도를 제공합니다. 당신의 응답은 반드시 지정된 JSON 형식을 따라야 합니다.

### 지시사항:
1.  **오류 찾기:** 학생의 글 전체에서 맞춤법, 띄어쓰기, 문맥상 어색한 표현 등 **모든 오류**를 찾아냅니다.
2.  **JSON 형식으로 응답:** 아래 스키마에 맞춰 JSON 객체로 응답을 생성합니다. 큰따옴표가 포함된 경우 백슬래시로 이스케이프 처리해야 합니다.

### JSON 스키마:
{
  "feedbackHtml": "string",
  "corrections": [
    {
      "original": "string",
      "corrected": "string",
      "reason": "string"
    }
  ]
}

### JSON 내용 작성 규칙:

#### 1. corrections 배열:
- 학생이 작성한 글에서 찾은 **모든 오류**를 이 배열에 객체 형태로 담아주세요.
- \`original\`: 학생이 쓴 오류가 있는 원본 텍스트(2~5 어절 정도의 짧은 구문)
- \`corrected\`: 당신이 수정한 올바른 텍스트
- \`reason\`: 왜 그렇게 수정해야 하는지에 대한 간단하고 친절한 설명.
- **예시:** \`{ "original": "농부가 거위를 살려고", "corrected": "농부가 거위를 사려고", "reason": "'~하려고'가 올바른 맞춤법이에요." }\`

#### 2. feedbackHtml 문자열 (HTML 형식):
- **중요:** HTML 문자열 내부에 큰따옴표(")가 포함될 경우, 반드시 백슬래시(\\\\)를 사용하여 이스케이프 처리해야 합니다(예: \`<p class=\\"...\\">...\</p>\`).
- **종합 평가:** 학생의 이름(${userInfo.name})을 부르며 글 전체에 대한 긍정적인 총평으로 시작합니다.
- **루브릭 기반 평가:** 4가지 항목('경험과의 연관성', '비교의 구체성', '창의성', '현실성')에 대해 학생의 글 수준에 맞춰 **솔직하고 객관적으로** '잘함', '보통', '노력 요함'으로 평가하고 그 이유를 설명하는 표를 만듭니다.
- **고쳐줄 부분 ✍️**: \`corrections\` 배열에 있는 **모든 오류**에 대해, "원래 표현"과 "추천 표현"을 비교하여 보여줍니다. "원래 표현"에서는 오류 부분을 \`<span class=\\"correction-original\\">...\</span>\`으로, "추천 표현"에서는 수정된 부분을 \`<span class=\\"correction-fixed\\">...\</span>\`으로 감싸고, 그 아래에 수정 이유(\`reason\`)를 자세히 설명합니다.
- **내용에 대한 조언**: 글의 내용을 더 발전시킬 수 있는 구체적이고 실질적인 조언을 1~2가지 추가로 제시합니다.`;

    const userQuery = `학생 정보: ${userInfo.grade}학년 ${userInfo.class}반 ${userInfo.number}번 ${userInfo.name}
[활동 1: 비슷한 점]
${data.similar}
[활동 1: 다른 점]
${data.different}
[활동 2: 새롭게 창조하기]
${data.creative}`;

    const apiKey = ""; // 서버리스 함수로 옮길 예정
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
    
    const result = await response.json();
    return JSON.parse(result.candidates[0].content.parts[0].text);
}

// --- 결과 표시 ---
function displayFeedback(feedbackObject) {
    const myWritingContainer = document.getElementById('myWritingResult');
    const { corrections } = feedbackObject;

    let highlightedWriting = { ...originalWriting };

    if (corrections && corrections.length > 0) {
        corrections.forEach(correction => {
            const { original } = correction;
            
            const regex = new RegExp(escapeRegExp(original), 'g');
                for (const key in highlightedWriting) {
                    highlightedWriting[key] = highlightedWriting[key].replace(
                        regex, 
                        `<span class="correction-original">${original}</span>`
                    );
                }
        });
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    myWritingContainer.innerHTML = `
        <div class="flex flex-col h-full space-y-4">
            <div class="flex-grow grid grid-cols-2 gap-4">
                    <div class="p-4 bg-gray-50 rounded-md border flex flex-col">
                        <p class="font-medium text-gray-600 mb-2">✅ 비슷한 점</p>
                        <div class="whitespace-pre-wrap flex-grow overflow-y-auto">${highlightedWriting.similar}</div>
                    </div>
                <div class="p-4 bg-gray-50 rounded-md border flex flex-col">
                    <p class="font-medium text-gray-600 mb-2">🤔 다른 점</p>
                    <div class="whitespace-pre-wrap flex-grow overflow-y-auto">${highlightedWriting.different}</div>
                </div>
            </div>
            <div class="flex flex-col flex-grow">
                <h3 class="font-semibold text-lg mb-2 text-gray-700">활동 2: 새롭게 창조하기</h3>
                <div class="p-4 bg-gray-50 rounded-md border h-full overflow-y-auto">
                    <p class="whitespace-pre-wrap">${highlightedWriting.creative}</p>
                </div>
            </div>
        </div>
    `;

    const aiFeedbackContainer = document.getElementById('aiFeedbackResult');
    aiFeedbackContainer.innerHTML = feedbackObject.feedbackHtml;

    pages.writing.classList.add('hidden');
    pages.feedback.classList.remove('hidden');
}

// --- PDF 결과 다운로드 (수정된 코드) ---
function downloadFeedback() {
    const { jsPDF } = window.jspdf;
    const feedbackContent = document.getElementById('feedbackContent'); // PDF로 만들 전체 컨테이너
    const studentIdentifier = `${userInfo.grade}학년${userInfo.class}반${userInfo.number}번_${userInfo.name}`;
    
    // 캡처할 두 개의 스크롤 컬럼 요소를 선택합니다.
    const captureTargets = feedbackContent.querySelectorAll('.overflow-y-auto');

    const originalButtonText = downloadBtn.innerHTML;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = 'PDF 만드는 중...';

    // 캡처 전에 스크롤을 없애고 콘텐츠를 모두 펼칩니다.
    // 각 컬럼의 고정 높이와 스크롤 관련 클래스를 임시로 제거합니다.
    captureTargets.forEach(el => {
        el.style.height = 'auto';
        el.style.overflowY = 'visible';
        el.classList.remove('overflow-y-auto'); // 클래스 제거
    });
    feedbackContent.style.height = 'auto'; // 부모 컨테이너 높이도 자동 조절

    html2canvas(feedbackContent, {
        scale: 2,
        useCORS: true,
        // 전체 페이지를 캡처하기 위해 window의 스크롤 높이를 사용하도록 설정
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 20; // A4 용지 좌우 여백 10mm씩
        const imgHeight = imgWidth / ratio;
        
        let heightLeft = imgHeight;
        let position = 10; // A4 용지 상단 여백 10mm
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);

        // 이미지가 페이지를 넘어갈 경우 새 페이지 추가
        while (heightLeft > 0) {
            position = - (imgHeight - heightLeft) + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        pdf.save(`글쓰기_첨삭결과_${studentIdentifier}.pdf`);

    }).catch(err => {
        console.error("PDF 생성 오류:", err);
        alert("PDF를 만드는 데 문제가 발생했습니다.");
    }).finally(() => {
        // 캡처 성공/실패 여부와 상관없이 스타일을 원래대로 복원합니다.
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalButtonText;
        captureTargets.forEach(el => {
            el.style.height = ''; // 'auto' 스타일 제거
            el.style.overflowY = ''; // 'visible' 스타일 제거
            el.classList.add('overflow-y-auto'); // 클래스 다시 추가
        });
        feedbackContent.style.height = ''; // 부모 컨테이너 스타일 복원
    });
}
