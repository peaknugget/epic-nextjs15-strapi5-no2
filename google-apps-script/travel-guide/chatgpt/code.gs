// code.gs
// Google Apps Script backend for "스마트 여행 가이드" web app.
// - Gemini REST API (Generative Language) 사용 (gemini-1.5-flash 모델)
// - 결과를 지정된 Google Sheet에 저장

// --------------------------
// 설정 (사용자 환경에 맞게 변경 가능)
// --------------------------
const API_KEY = 'AIzaSyCBzVtrwfiKEgLol8hVbGiHtOttDx5FwBc'; // <-- 제공하신 키 (보안 유의)
const GEMINI_MODEL = 'gemini-1.5-flash'; // 모델 이름
const SHEET_ID = '1PbJHO6fTZAgOopsczQXs5PyY4yt_UAFu6Xb3UUViDPg';
const SHEET_NAME = '출력결과';

// --------------------------
// 웹앱 진입점
// --------------------------
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('스마트 여행 가이드 - AI 맞춤 여행 경로');
}

// --------------------------
// 클라이언트에서 호출: 여행 경로 생성 요청
// formData: { destination, people, gender, ageRange, styles:[], days, budget, requestText }
// --------------------------
function generateItinerary(formData) {
  try {
    // 1) 프롬프트 구성
    const prompt = buildPrompt(formData);

    // 2) Gemini REST API 호출 (generateContent)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt }
          ]
        }
      ],
      // generation configuration: 원하는 길이/온도 등 조정
      generation_config: {
        // 응답이 비교적 읽기 쉬운 형태로 나오게 약간 설정
        temperature: 0.6,
        maxOutputTokens: 800,
        // JSON 형식을 강제하려면 response_mime_type 사용 가능 (여기서는 자유 텍스트)
        // "response_mime_type": "application/json"
      }
    };

    const options = {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    const text = response.getContentText();

    if (code < 200 || code >= 300) {
      // API 에러
      const errMsg = `Gemini API error: ${code} - ${text}`;
      // 시트에 에러 저장
      appendRowToSheet(formData, '', 0, 'API_ERROR: ' + code);
      return { success: false, error: errMsg };
    }

    // parse response JSON
    const json = JSON.parse(text);
    // 여러 포맷을 대비해 안전하게 추출
    let generated = '';

    // common pattern: response.candidates[].content (array of parts)
    if (json.candidates && json.candidates.length > 0) {
      // 각 candidate의 content를 합침(있다면)
      const c = json.candidates[0];
      if (c.content && Array.isArray(c.content)) {
        // content의 각 element가 {text: "..."} 또는 {type:"..." , parts: [...]}
        generated = c.content.map(item => {
          if (item.text) return item.text;
          if (item.parts && Array.isArray(item.parts)) {
            return item.parts.map(p=> p.text || '').join('');
          }
          return JSON.stringify(item);
        }).join('\n');
      } else if (c.output && c.output[0] && c.output[0].content) {
        // 다른 구조일 경우 시도
        generated = c.output.map(o => o.content || '').join('\n');
      } else if (c.text) {
        generated = c.text;
      }
    }

    // fallback: 어떤 경우에도 빈 문자열이면 전체 응답 텍스트를 사용
    if (!generated) {
      // 일부 REST 응답은 top-level 'text' 또는 'candidates[i].text' 형태일 수 있음.
      if (json.text) generated = json.text;
      else generated = text;
    }

    // 3) 시트에 저장 (타임스탬프 포함)
    const length = Math.min( (typeof generated === 'string' ? generated.length : 0), 99999 );
    appendRowToSheet(formData, generated, length, '완료');

    // 4) 반환 (클라이언트로 보여줄 데이터)
    return { success: true, result: generated };

  } catch (err) {
    // 에러 처리: 시트 저장 시 에러 상태 기록
    appendRowToSheet(formData, '', 0, 'EXCEPTION: ' + err.toString());
    return { success: false, error: err.toString() };
  }
}

// --------------------------
// 시트에 한 행 추가
// 컬럼: “타임스탬프	여행지	인원수	성별 구성	나이대	여행 스타일	여행 일수	예산 규모	요청내용	AI응답	응답길이	상태”
// --------------------------
function appendRowToSheet(formData, aiResponse, responseLength, status) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    const styles = (formData.styles && formData.styles.length) ? formData.styles.join(', ') : '';

    const row = [
      timestamp,
      formData.destination || '',
      formData.people || '',
      formData.gender || '',
      formData.ageRange || '',
      styles,
      formData.days || '',
      formData.budget || '',
      formData.requestText || '',
      aiResponse || '',
      responseLength || 0,
      status || ''
    ];

    sheet.appendRow(row);
  } catch (e) {
    // 시트 접근 실패 시 로그
    console.error('appendRowToSheet error: ' + e.toString());
  }
}

// --------------------------
// 최근 저장된 결과를 가져오는 함수 (클라이언트에서 페이지 로드 시 카드 표시용)
// limit: optional (default 10)
// --------------------------
function getRecentResults(limit) {
  limit = limit || 8;
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return []; // 헤더밖에 없음

    const header = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const startRow = Math.max(2, lastRow - limit + 1);
    const data = sheet.getRange(startRow, 1, lastRow - startRow + 1, sheet.getLastColumn()).getValues();

    // map to objects
    const results = data.reverse().map(r => ({
      timestamp: r[0],
      destination: r[1],
      people: r[2],
      gender: r[3],
      ageRange: r[4],
      styles: r[5],
      days: r[6],
      budget: r[7],
      requestText: r[8],
      aiResponse: r[9],
      responseLength: r[10],
      status: r[11]
    }));
    return results;
  } catch (e) {
    console.error('getRecentResults error: ' + e.toString());
    return [];
  }
}

// --------------------------
// 내부: 프롬프트 빌더 (formData -> 자연어 프롬프트)
// --------------------------
function buildPrompt(formData) {
  const dest = formData.destination || '원하시는 여행지';
  const people = formData.people || '';
  const gender = formData.gender || '';
  const ageRange = formData.ageRange || '';
  const styles = (formData.styles && formData.styles.length) ? formData.styles.join(', ') : '';
  const days = formData.days || 1;
  const budget = formData.budget || '';
  const requestText = formData.requestText || '';

  let p = `당신은 전문 여행 가이드입니다. 다음 조건에 맞는 맞춤형 여행 일정(일자별 세부 경로, 추천 활동, 예상 소요시간, 대략적인 예산 배분, 교통 팁 등)을 한국어로 작성해주세요.\n\n`;
  p += `여행지: ${dest}\n`;
  p += `인원수: ${people}\n`;
  p += `성별 구성: ${gender}\n`;
  p += `나이대: ${ageRange}\n`;
  p += `여행 스타일: ${styles}\n`;
  p += `여행 일수: ${days}일\n`;
  p += `예산 규모: ${budget}\n`;
  if (requestText) p += `추가 요청/선호사항: ${requestText}\n\n`;

  p += `요청: \n1) 각 일차별로 오전/오후/저녁으로 나누어 권장 일정(구체적 장소, 추천 활동, 이동 방법과 소요 시간, 예상 비용)을 제시하세요.\n`;
  p += `2) 가능하면 식당/카페 추천 1~2곳과 (예: 현지 인기 메뉴)도 포함하세요.\n`;
  p += `3) 예산이 제한적일 때의 절약 팁과, 더 여유가 있을 때 업그레이드 팁도 간단히 적어주세요.\n`;
  p += `4) 최종 답변은 보기 쉬운 '일자별 카드' 형식(예: '1일차', '2일차' 제목, 항목별 정리)으로 작성하세요.\n`;
  p += `\n부탁드립니다.`;

  return p;
}
