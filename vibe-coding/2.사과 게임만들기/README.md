

# 사과 게임 (HTML5 Canvas)

간단한 HTML5 Canvas 기반의 사과 받기 게임입니다.

## 실행 방법
1. 아래 세 파일을 같은 폴더에 저장합니다:
   - `index.html`
   - `game.js`
   - (선택) `apple.png` — 로컬 이미지를 사용하려면 game.js에서 appleImg.src를 변경하세요.
2. `index.html` 파일을 브라우저에서 엽니다.
3. "게임 시작" 버튼을 누르고 ← / → 키로 바구니를 움직여 사과를 받아 점수를 획득하세요.

## 규칙 요약
- 사과를 받으면 +10점
- 사과를 놓치면 생명 -1 (총 3개)
- 점수가 올라가면 난이도(사과 속도 및 출현 빈도) 증가

## 파일 구조
- `index.html` : 게임 UI / Tailwind 기반 반응형 레이아웃
- `game.js` : 게임 로직
- `README.md` : 설명서

## 커스터마이즈 팁
- `game.js`에서 `spawnInterval`, `baseSpeed`, `player.speed` 등을 조정해 난이도를 변경하세요.
- 사과 이미지를 사용하려면 `appleImg.src`를 로컬 파일 경로로 바꾸면 됩니다.

즐거운 게임 되세요! 🎮
