// code.gs
// Google Apps Script 서버 코드
// 배포: "웹 앱으로 배포" 또는 스프레드시트 스크립트로 사용

const GEMINI_API_KEY = ''; // 제공하신 키 (운영용은 PropertiesService에 저장 권장)
const SHEET_ID = '1PbJHO6fTZAgOopsczQXs5PyY4yt_UAFu6Xb3UUViDPg';
const SHEET_NAME = '출력결과';
const GEMINI_MODEL = 'gemini-1.5-flash'; // 모델 이름(요청 형태는 API 변경에 따라 수정 필요)

/**
 * 웹앱 진입점: travel-guide-frontend.html 파일명이 맞다면 그대로 사용.
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('travel-guide-frontend')
      .setTitle('스마트 여행 가이드');
}

/**
 * 클라이언트에서 호출하는 함수
 * formData: {destination, people, gender, age, travelStyle (array), days, budget}
 */
function generateTravelRoute(formData) {
  try {
    // 1) 프롬프트 생성 (한국어)
    const prompt = buildPrompt(formData);

    // 2) Gemini API 호출
    const aiText = callGeminiAPI(prompt);

    // 3) 스프래드시트에 기록
    const timestamp = new Date();
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('스프레드시트를 찾을 수 없습니다. 시트명이 정확한지 확인하세요: ' + SHEET_NAME);
    }

    const row = [
      timestamp, // 타임스탬프
      formData.destination || '',
      formData.people || '',
      formData.gender || '',
      formData.age || '',
      (Array.isArray(formData.travelStyle) ? formData.travelStyle.join(', ') : formData.travelStyle) || '',
      formData.days || '',
      formData.budget || '',
      '', // 요청내용 (추후 필요하면 채움)
      aiText || '',
      (aiText ? aiText.length : 0),
      '완료'
    ];

    sheet.appendRow(row);

    // 4) 결과 반환 (클라이언트에 보여줄 텍스트)
    return { success: true, data: aiText };

  } catch (err) {
    // 에러 발생 시 스프레드시트에 에러 상태로 기록 시도
    try {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      if (sheet) {
        sheet.appendRow([new Date(), formData.destination || '', formData.people || '', formData.gender || '', formData.age || '', (Array.isArray(formData.travelStyle) ? formData.travelStyle.join(', ') : formData.travelStyle) || '', formData.days || '', formData.budget || '', '', '', 0, '오류: ' + String(err)]);
      }
    } catch (e2) {
      // 기록 실패 무시
    }

    return { success: false, error: String(err) };
  }
}

/**
 * 프롬프트 빌드: formData를 읽어 Gemini에게 줄 요청문 생성
 */
function buildPrompt(formData) {
  const styles = Array.isArray(formData.travelStyle) ? formData.travelStyle.join(', ') : (formData.travelStyle || '');
  return [
    '당신은 여행 전문가이자 일정 설계 AI입니다. 다음 정보를 바탕으로 ' + formData.days + '일간의 상세한 일자별 여행 일정을 한글로 작성해주세요.',
    '',
    '요청 정보:',
    '- 여행지: ' + (formData.destination || ''),
    '- 인원수: ' + (formData.people || ''),
    '- 성별 구성: ' + (formData.gender || ''),
    '- 나이대: ' + (formData.age || ''),
    '- 여행 스타일: ' + styles,
    '- 여행 일수: ' + (formData.days || ''),
    '- 예산 규모(1인 기준): ' + (formData.budget || ''),
    '',
    '요구사항:',
    '1) 각 일자별로 오전/오후/저녁 추천 활동과 추천 소요시간, 이동방법(간단)과 예상 비용 범위를 제시해주세요.',
    '2) 현지에서 꼭 먹어봐야 할 음식(추천 2~3가지) 및 장소를 하루마다 하나씩 제안해주세요.',
    '3) 여행 팁(치안, 교통, 예약 팁 등)을 마지막 부분에 간단히 3~5가지 적어주세요.',
    '4) 출력 형식은 "Day 1:", "Day 2:" ... 와 같이 Day 마커로 구분하여 가독성 좋게 작성해주세요.',
    '5) 총 글자수는 적당히(너무 길지 않게) 하되, 실제 일정으로 활용할 수 있을 정도로 구체적으로 작성해주세요.',
    '',
    '출력은 순수 텍스트로만 제공해주세요.'
  ].join('\n');
}

/**
 * Gemini API 호출 함수 (간단 구현)
 * - 실제 Endpoint/스펙은 Google의 Generative API 문서에 따라 다를 수 있음.
 * - 사용자 제공 API key(Azure API key 등)가 있을 경우 여기에 적용.
 */
function callGeminiAPI(prompt) {
  // URL: Google Generative AI REST API 형태 (키는 쿼리파라미터로 전달)
  // (참고) 실제 프로덕션 엔드포인트/요청 스펙은 변경될 수 있으므로 필요하면 수정하세요.
  const url = 'https://generativeai.googleapis.com/v1/models/' + encodeURIComponent(GEMINI_MODEL) + ':generate?key=' + encodeURIComponent(GEMINI_API_KEY);

  const payload = {
    // 모델에 따라 body 구조가 다름. 아래는 범용적인 텍스트 프롬프트 전송 예시입니다.
    // 필요시 Google의 최신 API 문서에 맞춰 수정하세요.
    prompt: {
      text: prompt
    },
    temperature: 0.3,
    maxOutputTokens: 900
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    // timeout 은 필요에 따라 지정 가능
  };

  const resp = UrlFetchApp.fetch(url, options);
  const code = resp.getResponseCode();
  const text = resp.getContentText();

  if (code >= 200 && code < 300) {
    // 응답 JSON 파싱 — 다양한 스펙에 대비한 안전한 파싱
    try {
      const json = JSON.parse(text);

      // 여러 API 스펙에 대응: candidates / output / text 등
      // 우선 후보들 중 텍스트 추출 시도
      if (json.candidates && json.candidates.length > 0) {
        // candidate가 객체 배열이면 content 또는 output_text 등을 찾아봄
        const c = json.candidates[0];
        if (typeof c === 'string') return c;
        if (c.content) {
          if (typeof c.content === 'string') return c.content;
          // content가 배열/객체인 경우 간단 직렬화
          return JSON.stringify(c.content);
        }
      }

      if (json.output && Array.isArray(json.output) && json.output.length > 0) {
        // output[0].content 또는 output[0].text 등
        const o = json.output[0];
        if (o.content && typeof o.content === 'string') return o.content;
        if (o.text) return o.text;
        return JSON.stringify(o);
      }

      // fallback: 응답 전체 텍스트 반환
      return text;

    } catch (e) {
      // JSON 파싱 실패시 원본문자열 반환
      return text;
    }
  } else {
    throw new Error('AI 호출 실패: HTTP ' + code + ' - ' + text);
  }
}
