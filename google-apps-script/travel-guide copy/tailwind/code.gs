/**
 * code.gs
 * - doGet: index.html을 반환 (웹앱으로 배포 시)
 * - doPost: 클라이언트에서 받은 여행요청을 Gemini API로 전달하고,
 *           결과를 Google Sheet에 기록한 뒤 JSON으로 반환
 *
 * 사용법 요약:
 * - Project Settings > Script properties 에 GEMINI_API_KEY 를 추가하세요. (권장)
 *   또는 클라이언트가 payload.clientKey로 API 키를 함께 전송할 수 있습니다(테스트용).
 *
 * 시트: 아래 코드에 있는 SHEET_ID와 SHEET_NAME을 그대로 사용하세요.
 */

const SHEET_ID = '1PbJHO6fTZAgOopsczQXs5PyY4yt_UAFu6Xb3UUViDPg'; // 사용자가 제공한 시트 ID
const SHEET_NAME = '출력결과';

// Gemini 모델 (엔드포인트에 맞춰 필요 시 변경 가능)
const GEMINI_MODEL = 'gemini-1.5-flash-001'; // v1beta endpoint 예시

function doGet(e) {
  // index.html 파일이 Apps Script 프로젝트에 있어야 합니다.
  return HtmlService.createHtmlOutputFromFile('index')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('스마트 여행 가이드 - 튜북');
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: '잘못된 요청: post 데이터가 없습니다.' }, 400);
    }

    const payload = JSON.parse(e.postData.contents);
    // 필드: clientKey(선택), destination, people, gender, age, travelStyle (array), days, budget
    const clientKeyFromClient = payload.clientKey || '';
    const destination = payload.destination || '';
    const people = payload.people || '';
    const gender = payload.gender || '';
    const age = payload.age || '';
    const travelStyle = Array.isArray(payload.travelStyle) ? payload.travelStyle.join(', ') : (payload.travelStyle || '');
    const days = payload.days || '';
    const budget = payload.budget || '';

    // 요청내용을 보기 좋게 정리
    const requestSummary = [
      `여행지: ${destination}`,
      `인원수: ${people}`,
      `성별 구성: ${gender}`,
      `나이대: ${age}`,
      `여행 스타일: ${travelStyle}`,
      `여행 일수: ${days}일`,
      `예산(1인): ${budget}`
    ].join('\n');

    // Gemini API Key 우선순위: Script Properties(GEMINI_API_KEY) > 클라이언트에서 보낸 key
    const scriptProps = PropertiesService.getScriptProperties().getProperties();
    const GEMINI_API_KEY = scriptProps.GEMINI_API_KEY || clientKeyFromClient;
    if (!GEMINI_API_KEY) {
      // 키가 없는 경우에는 에러로 응답
      writeRowToSheet([new Date(), destination, people, gender, age, travelStyle, days, budget, requestSummary, '', '', '키없음']);
      return jsonResponse({ success: false, error: '서버에 설정된 GEMINI_API_KEY가 없습니다. Script properties에 GEMINI_API_KEY를 설정하거나 클라이언트에서 clientKey를 전송하세요.' }, 400);
    }

    // Gemini에 보낼 프롬프트 구성 (요청에 맞는 출력형태: markdown 형태 권장)
    const userPrompt = `다음 여행 요청 정보를 바탕으로 '${destination}'에 대한 ${days}일짜리 자세한 일자별 여행 계획을 마크다운 형식으로 작성해줘.
- 요청 정보:
${requestSummary}

응답은 한국어로, 다음을 포함해줘:
1) 간단한 여행 개요 (예산 분배, 추천 숙소 지역, 교통수단)
2) 일자별 추천 일정 (각 일자별로 '오전/오후/저녁'으로 나누어 활동 제안)
3) 추천 팁 (예약 팁, 지역 특이사항)
출력은 마크다운 형식(헤더, 리스트 등)을 사용하고, 길이는 적당히 상세하게 작성해줘.`;

    // Gemini REST 호출 body (v1beta / generateContent 형태 예시)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      // contents 배열 방식을 사용 (호환 예시)
      "contents": [
        {
          "role": "user",
          "parts": [
            { "text": userPrompt }
          ]
        }
      ],
      // 필요 시 temperature, maxOutputTokens 등 추가 가능
      "temperature": 0.3
    };

    const options = {
      method: 'post',
      contentType: 'application/json; charset=utf-8',
      payload: JSON.stringify(body),
      muteHttpExceptions: true,
      timeout: 60000
    };

    const resp = UrlFetchApp.fetch(endpoint, options);
    const code = resp.getResponseCode();
    const text = resp.getContentText();

    let aiText = '';
    let status = '완료';
    if (code >= 200 && code < 300) {
      const j = tryParseJSON(text);
      // 여러 응답 포맷에 유연하게 대응해서 텍스트 추출
      aiText = extractTextFromGeminiResponse(j) || '';
      if (!aiText) {
        aiText = JSON.stringify(j);
        status = '파싱불가';
      }
    } else {
      aiText = `Gemini API 오류: HTTP ${code} - ${text}`;
      status = 'API오류';
    }

    const length = aiText ? aiText.length : 0;

    // 시트에 기록 (타임스탬프, 여행지, 인원수, 성별 구성, 나이대, 여행 스타일, 여행 일수, 예산 규모, 요청내용, AI응답, 응답길이, 상태)
    writeRowToSheet([new Date(), destination, people, gender, age, travelStyle, days, budget, requestSummary, aiText, length, status]);

    return jsonResponse({ success: true, data: aiText, meta: { length, status } }, 200);

  } catch (err) {
    // 예외 시 시트에 오류 기록
    const errMsg = (err && err.toString) ? err.toString() : JSON.stringify(err);
    writeRowToSheet([new Date(), '', '', '', '', '', '', '', '', errMsg, 0, '서버오류']);
    return jsonResponse({ success: false, error: '서버 오류: ' + errMsg }, 500);
  }
}

/** JSON 응답 유틸 */
function jsonResponse(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


/** 시트에 행 추가 (존재하지 않으면 헤더 추가) */
function writeRowToSheet(rowArray) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // 헤더 체크 / 생성
  const header = ["타임스탬프","여행지","인원수","성별 구성","나이대","여행 스타일","여행 일수","예산 규모","요청내용","AI응답","응답길이","상태"];
  const firstRow = sheet.getRange(1,1,1,header.length).getValues()[0];
  const isHeaderEmpty = firstRow.join('').trim() === '';
  if (isHeaderEmpty) {
    sheet.getRange(1,1,1,header.length).setValues([header]);
  }
  // append
  sheet.appendRow(rowArray);
}

/** 안전한 JSON 파싱 */
function tryParseJSON(txt) {
  try { return JSON.parse(txt); } catch(e) { return null; }
}

/**
 * Gemini 응답에서 텍스트를 추출하는 유틸: 몇 가지 가능한 응답 포맷을 시도
 */
function extractTextFromGeminiResponse(resp) {
  if (!resp) return null;

  // 1) common pattern: candidates[].content[].text or candidates[].content[].parts[].text
  if (Array.isArray(resp.candidates) && resp.candidates.length) {
    for (const cand of resp.candidates) {
      if (cand.content && Array.isArray(cand.content)) {
        // content items may have 'text' or 'parts' arrays
        let pieces = [];
        cand.content.forEach(c => {
          if (typeof c.text === 'string') pieces.push(c.text);
          if (Array.isArray(c.parts)) {
            c.parts.forEach(p => { if (p && p.text) pieces.push(p.text); });
          }
        });
        if (pieces.length) return pieces.join('\n\n');
      }
      // older format
      if (cand.output && Array.isArray(cand.output)) {
        let pieces = [];
        cand.output.forEach(o => {
          if (o.content && Array.isArray(o.content)) {
            o.content.forEach(cc => {
              if (cc.text) pieces.push(cc.text);
              if (cc.parts && Array.isArray(cc.parts)) cc.parts.forEach(p=> p.text && pieces.push(p.text));
            });
          }
        });
        if (pieces.length) return pieces.join('\n\n');
      }
      if (typeof cand.text === 'string' && cand.text) return cand.text;
    }
  }

  // 2) output[] 형태
  if (Array.isArray(resp.output) && resp.output.length) {
    let outPieces = [];
    resp.output.forEach(o => {
      if (Array.isArray(o.content)) {
        o.content.forEach(c => {
          if (c.text) outPieces.push(c.text);
          if (Array.isArray(c.parts)) c.parts.forEach(p => p.text && outPieces.push(p.text));
        });
      }
    });
    if (outPieces.length) return outPieces.join('\n\n');
  }

  // 3) text 또는 resultText 같은 직관적 필드
  if (resp.text) return resp.text;
  if (resp.result && resp.result.output && typeof resp.result.output === 'string') return resp.result.output;

  // 4) fallback: try to stringify a few likely fields
  if (resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content) {
    return resp.choices[0].message.content;
  }

  return null;
}


function processTravel(payload) {
  try {
    // doPost 내부 로직을 재사용하기 위해 fake event 객체 생성
    const e = {
      postData: {
        contents: JSON.stringify(payload),
        type: 'application/json',
      },
    };

    // doPost 호출
    const resp = doPost(e);

    // ContentService 결과 → string
    const text = resp.getContent();

    // JS 객체 반환 (success, data 등)
    return JSON.parse(text);
  } catch (err) {
    return {
      success: false,
      error: 'processTravel 함수 내부 오류: ' + err.toString(),
    };
  }
}
