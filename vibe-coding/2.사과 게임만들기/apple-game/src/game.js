
/* ===================== */
/* FILE: game.js (같은 폴더에 저장) */
/* ===================== */

// game.js
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');


    // 게임 상태
    this.running = false;
    this.paused = false;

    // 플레이어(바구니)
    this.player = {
      width: 120,
      height: 30,
      x: 0,
      y: 0,
      speed: 600 // px/s
    };

    // 사과
    this.apples = [];
    this.appleSpawnTimer = 0;
    this.spawnInterval = 1.2; // 초

    // 점수/생명
    this.score = 0;
    this.lives = 3;

    // 난이도
    this.level = 1;

    // 입력
    this.keys = {};
    window.addEventListener('keydown', e => { this.keys[e.key] = true; });
    window.addEventListener('keyup', e => { this.keys[e.key] = false; });

    // 이미지 (사과)
    this.appleImg = new Image();
    // 기본 내장된 빨간 원으로 대체할 수 있지만 이미지 사용 시 경로를 지정하세요.
    this.appleImg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'><path fill='%23e11d48' d='M12 2C10.9 2 9.8 2.3 8.8 3 7.9 3.6 7.2 4.5 6.6 5.3 5.4 7 4.8 9.1 5 11c.2 1.9 1.2 3.7 2.8 5 1.6 1.4 3.8 2.2 6.2 2.2s4.6-.8 6.2-2.2c1.6-1.3 2.6-3.1 2.8-5 .2-1.9-.4-4-1.6-5.7C20.8 4.5 20.1 3.6 19.2 3 18.2 2.3 17.1 2 16 2c-1.1 0-2.1.3-3 1C13.1 2.3 12.6 2 12 2z'/></svg>`
    );

    // 시간
    this.lastTime = performance.now();


     // 해상도 보정 (👉 이제 호출해도 됨)
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Bind update loop
    this.loop = this.loop.bind(this);
  }

  resizeCanvas() {
    // 캔버스 DOM 크기 가져오기
    const styleW = this.canvas.clientWidth;
    const styleH = this.canvas.clientHeight;

    // 내부 해상도 조정 (디바이스 픽셀 비율 고려)
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(styleW * dpr);
    this.canvas.height = Math.floor(styleH * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 플레이어 초기 위치
    this.player.x = Math.floor(styleW / 2 - this.player.width / 2);
    this.player.y = Math.floor(styleH - this.player.height - 10);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.paused = false;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.apples = [];
    this.spawnInterval = 1.2;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  pause() {
    if (!this.running) return;
    this.paused = !this.paused;
    if (!this.paused) {
      // resume
      this.lastTime = performance.now();
      requestAnimationFrame(this.loop);
    }
  }

  reset() {
    this.running = false;
    this.paused = false;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.apples = [];
    this.clearCanvas();
    this.draw();
  }

  loop(now) {
    if (!this.running || this.paused) return;
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.update(dt);
    this.draw();

    if (this.running && !this.paused) requestAnimationFrame(this.loop);
  }

  update(dt) {
    // 입력 처리
    const canvasW = this.canvas.clientWidth;
    if (this.keys['ArrowLeft'] || this.keys['Left']) {
      this.player.x -= this.player.speed * dt;
    }
    if (this.keys['ArrowRight'] || this.keys['Right']) {
      this.player.x += this.player.speed * dt;
    }
    // 경계 체크
    this.player.x = Math.max(0, Math.min(canvasW - this.player.width, this.player.x));

    // 사과 생성
    this.appleSpawnTimer += dt;
    // 스폰 간격은 레벨(난이도) 따라 줄어든다
    const interval = Math.max(0.35, this.spawnInterval - (this.level - 1) * 0.08);
    if (this.appleSpawnTimer >= interval) {
      this.spawnApple();
      this.appleSpawnTimer = 0;
    }

    // 사과 업데이트
    for (let i = this.apples.length - 1; i >= 0; i--) {
      const a = this.apples[i];
      a.y += a.speed * dt;

      // 충돌 체크 - 바구니
      if (this.checkCollisionWithPlayer(a)) {
        this.apples.splice(i, 1);
        this.score += 10;
        // 난이도 증가: score 기준
        this.level = 1 + Math.floor(this.score / 100);
        // 스폰 속도 보정
        continue;
      }

      // 바닥 체크 (놓침)
      if (a.y > this.canvas.clientHeight) {
        this.apples.splice(i, 1);
        this.lives -= 1;
        if (this.lives <= 0) {
          this.gameOver();
          return;
        }
      }
    }

    // UI 업데이트
    document.getElementById('score').textContent = String(this.score);
    document.getElementById('lives').textContent = '❤'.repeat(Math.max(0, this.lives));
    document.getElementById('level').textContent = String(this.level);
  }

  spawnApple() {
    const canvasW = this.canvas.clientWidth;
    const size = 48; // 픽셀
    const x = Math.random() * (canvasW - size);
    // 속도는 레벨에 따라 증가
    const baseSpeed = 120; // px/s
    const speed = baseSpeed + Math.random() * 60 + (this.level - 1) * 40;

    this.apples.push({ x, y: -size, size, speed });
  }

  checkCollisionWithPlayer(a) {
    const px = this.player.x;
    const py = this.player.y;
    const pw = this.player.width;
    const ph = this.player.height;

    const ax = a.x;
    const ay = a.y;
    const as = a.size;

    // 단순 AABB 충돌
    if (ax < px + pw && ax + as > px && ay < py + ph && ay + as > py) {
      return true;
    }
    return false;
  }

  clearCanvas() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.ctx.clearRect(0, 0, w, h);
  }

  draw() {
    this.clearCanvas();
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    // 배경 그라디언트
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#f8fafc');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // 바구니 그리기
    this.ctx.fillStyle = '#6b7280';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    // 바구니 장식(테두리)
    this.ctx.strokeStyle = '#374151';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);

    // 사과 그리기
    for (const a of this.apples) {
      // 이미지가 준비되었으면 이미지로, 아니면 원으로
      if (this.appleImg.complete) {
        this.ctx.drawImage(this.appleImg, a.x, a.y, a.size, a.size);
      } else {
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(a.x + a.size / 2, a.y + a.size / 2, a.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // 숫자(옵션): 사과에 표시되는 값이나 장식을 여기에 추가 가능
    }

    // 게임 오버 텍스트
    if (!this.running && this.lives <= 0) {
      this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
      this.ctx.fillRect(0, 0, w, h);
      this.ctx.fillStyle = '#fff';
      this.ctx.font = '28px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('게임 오버', w / 2, h / 2 - 10);
      this.ctx.font = '18px sans-serif';
      this.ctx.fillText('게임을 다시 시작하려면 초기화 버튼을 누르세요.', w / 2, h / 2 + 20);
    }
  }

  gameOver() {
    this.running = false;
    this.paused = false;
    // 마지막 프레임 그리기
    this.draw();
    // 브라우저 알림(원하면 제거 가능)
    // alert(`게임 오버! 점수: ${this.score}`);
  }
}


// DOM 연결 및 제어
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
   if (!canvas) {
    console.error("캔버스를 찾을 수 없습니다. id='gameCanvas' 확인하세요.");
    return;
  }
  console.log(" canvas ",canvas);

  const g = new Game(canvas);
  document.getElementById("startBtn").addEventListener("click", () => g.start());
  document.getElementById("pauseBtn").addEventListener("click", () => g.pause());
  document.getElementById("resetBtn").addEventListener("click", () => g.reset());

  g.draw();
});
