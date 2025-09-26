# summary\_app

## ✅ 1. **Browser Preview** (마이크로소프트 제작)

> VSCode 내부에 실제 Chromium 기반 브라우저를 띄워서 `flutter run -d web-server`로 띄운 URL을 열 수 있습니다.

### 🔧 설정 방법

확장 프로그램 설치  
🔗 Browser Preview

Flutter Web 실행

실행하면 아래처럼 URL이 표시됩니다:

VSCode 명령 팔레트 열기 (`Ctrl+Shift+P`)  
👉 `Browser Preview: Open Preview` 선택

주소창에 `http://localhost:8080` 입력  
→ ✅ 이제 VSCode 탭 안에서 Flutter Web 실행화면 볼 수 있음

`Serving at http://localhost:8080`

`flutter run -d web-server`

**Profile 모드**로 실행

flutter run --profile

## 💡속도 증가 추가 팁

## ⚙️ VS Code에서도 Android Studio처럼 “저장 시 즉시 반영” 되게 하는 설정법

다음 설정을 적용해보세요 👇

### ① `settings.json` 열기

> VS Code → Ctrl + Shift + P → “Preferences: Open Settings (JSON)” 입력

### ② 아래 설정 추가

```xml
{
  // 저장 시 자동 포맷 비활성화 (불필요한 지연 방지)
  "editor.formatOnSave": false,
  // 저장 시 Flutter Hot Reload 실행
  "dart.flutterHotReloadOnSave": true,
  // Hot Restart도 저장 시 트리거 (필요시)
  "dart.flutterHotRestartOnSave": false,
  // 저장 시 debounce 최소화 (즉시 반영)
  "files.autoSaveDelay": 50
}
```

> 💡 `dart.flutterHotReloadOnSave: true` 설정은 Flutter 프로젝트일 때 저장 즉시 `hot reload` 명령을 트리거합니다.  
> Android Studio처럼 **“저장 → 즉시 반영”** 효과를 줍니다.

**자동 포맷 끄기 (**`**editor.formatOnSave**`**)**

포맷이 완료될 때까지 reload가 지연됩니다.

**Flutter CLI 최신화**

```c
flutter upgrade
flutter clean
flutter pub get
```

---

---

실행하면 아래처럼 URL이 표시됩니다:

Serving at http://localhost:8080

VSCode 명령 팔레트 열기 (Ctrl+Shift+P)  
👉 Browser Preview: Open Preview 선택

주소창에 http://localhost:8080 입력  
→ ✅ 이제 VSCode 탭 안에서 Flutter Web 실행화면 볼 수 있음

✅ 2. Port Viewer (내장 포트 뷰어)

VSCode에서 자동으로 열리는 로컬 서버를 인식해서 탭 내에서 볼 수 있는 확장

🔗 Port Viewer

flutter run -d web-server 실행 시, localhost:8080 같은 포트를 감지

VSCode 내부에서 바로 열기 가능

마치 "내장 브라우저"처럼 작동 (하지만 실제 렌더링은 iframe 기

# flutter\_app

# taskkill /F /IM adb.exe

# 폰연결 실행

# flutter run -d LM

# 브라우저 실행

# flutter run -d chrome

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

*   [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
*   [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the  
[online documentation](https://docs.flutter.dev/), which offers tutorials,  
samples, guidance on mobile development, and a full API reference.