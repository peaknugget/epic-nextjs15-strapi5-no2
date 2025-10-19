# 스마트 여행 가이드 (튜북) — Apps Script 웹앱

## 준비 (한 번만)
1. Apps Script 프로젝트 생성 후 다음 파일을 업로드/생성:
   - `code.gs` (서버 코드)
   - `index.html` (UI)
   - `logo.svg` (선택)
   - README 참고

2. 프로젝트 속성에 Script Properties 등록:
   - `GEMINI_API_KEY` = (Gemini API 키)
   - `CLIENT_SECRET_KEY` = (클라이언트 secret key; 클라이언트가 요청 시 함께 전송해야 함)

3. 스프레드시트 준비:
   - 제공한 시트 ID(`1PbJH...`)가 맞는지 확인.
   - 시트명은 `출력결과` 로 존재해야 하며, 컬럼은 자동으로 appendRow 됩니다.

## 배포
1. `Publish` → `Deploy as web app` 또는 `Deploy` → `New deployment` 선택
2. 접근 권한: `Anyone` 또는 `Anyone, even anonymous` 로 설정 (환경에 따라 권한 조정)
3. 배포된 Exec URL 을 확인 (예: `https://script.google.com/macros/s/AKfy.../exec`)

## 클라이언트 사용 방법
- `index.html` 은 위 Exec URL 로 접속하면 동작합니다.
- 처음 사용 시 브라우저가 service-worker 등록을 시도합니다. 실패하면 localStorage fallback 으로 동작합니다.
- 폼 제출 시 브라우저에서 `clientKey` 를 요청합니다. 이 값은 ScriptProperties의 `CLIENT_SECRET_KEY` 와 동일해야 합니다.

## 주의사항 / 권장
- Apps Script의 서비스워커/캐시 동작과 scope 제약으로 완전한 오프라인 PWA는 제한될 수 있습니다.
  안정적인 PWA를 원한다면 정적 파일(HTML/CSS/JS/manifest/service-worker)은 Firebase Hosting 또는 다른 정적 호스팅에 배포하고,
  Apps Script는 AI 호출 및 스프레드시트 기록용 API로만 사용하시길 권장합니다.
- Gemini API 엔드포인트 및 요청 형식은 제공한 예시를 참고하여 실제 서비스 제공자가 요구하는 형식으로 수정하세요.
- 보안: `CLIENT_SECRET_KEY` 를 클라이언트에 직접 보관하는 방식은 안전하지 않습니다. 프로덕션에서는 OAuth 또는 서버 사이드 세션 인증을 사용하세요.

## 문제 발생 시
- 스프레드시트 접근 오류: 권한(공유) 확인
- Gemini 호출 오류: `GEMINI_API_KEY` 확인 및 GEMINI_API_URL 검토
- CORS / preflight 오류: Apps Script는 브라우저의 OPTIONS preflight 지원이 제한적일 수 있으므로, 필요 시 프록시나 외부 API 게이트웨이를 사용하세요.
