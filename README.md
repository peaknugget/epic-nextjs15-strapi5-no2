## ⚠️ Strapi 5 이상 버전 Node.js 호환성 안내

Strapi **v5 이상**을 사용할 경우, 반드시 **Node.js v22 이상**을 사용해야 합니다.

그렇지 않으면 **파일 업로드 관련 오류**가 발생할 수 있습니다.





---

### 병합 처리

🔹 1. GitHub 웹 UI에서 가능한 방법

Pull Request(PR) 활용

포크한 내 저장소에서 “Pull requests” 탭으로 이동

“New pull request” 클릭

base repository를 내 포크, head repository를 원본(upstream)으로 설정

PR을 생성해서 병합(merge)

👉 이렇게 하면 원본의 최신 변경사항을 내 포크로 가져올 수 있어요.


---

### ✅ 권장 설정

* **Strapi 버전**: 5.x 이상
* **Node.js 버전**: v22 이상 (LTS 권장)

```bash
# 예시: Node.js 버전 확인
node -v

# nvm을 사용하여 Node.js 22 버전 설치
nvm install 22
nvm use 22
```

---

### ❌ 문제 상황 (Node.js < 22)

* 파일 업로드 실패
* 이미지 및 미디어 관리 오류
* 일부 플러그인 비정상 동작

---

### 📌 정리

Strapi 5 이상에서는 **Node.js v22 이상 환경**을 필수로 설정해야 안정적으로 동작합니다.
