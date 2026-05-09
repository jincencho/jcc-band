# JCC 홈페이지 v2 통합 개선 — 안티그래비티 작업 지시서

> **사용법**
> 매니저님이 안티그래비티에 한 STEP씩 복사해서 던지시면 됩니다.
> 쿼터 절약을 위해 한 번에 한 STEP만 진행하세요.

---

## 작업 원칙 (모든 STEP 공통)

```
당신은 매니저님의 JCC 홈페이지(jcc-band.vercel.app)를 개선하는 개발자입니다.

[중요 원칙]
1. 기존 디자인 톤 100% 유지 — 다크 네이비(#0F1419) + 골드(#B8860B) + JINCENCHO 골드 로고
2. 모바일 우선 반응형 (대부분 트래픽이 모바일)
3. 시크릿(텔레그램 봇 토큰 등)은 반드시 .env.local로 분리, 클라이언트 노출 금지
4. 한 단계 완료 후 매니저님 확인을 받고 다음 단계 진행
5. 변경사항은 변경 전/후를 비교 가능하게 명확히 표시
6. 작업 시작 전 변경할 파일 목록 먼저 보고 → OK 응답 후 코드 작성

[기존 사이트 정보]
- 기술 스택: Next.js + Vercel 배포
- 도메인: jcc-band.vercel.app
- 핵심 페이지: 홈, 더 알아보기, 상담 예약, 관리자
- 상담 예약: 매장방문(메인) + 비대면 견적(서브) 듀얼 트랙
- 5분류 상담: 구독문의 / 신혼가전 / 이사가전 / 입주가전 / 단품구매
- 백엔드: 폼 제출 시 텔레그램 봇으로 알림
```

---

# STEP 1. UTM 태그 수신 시스템 ⭐ 필수

## 작업 지시문 (안티그래비티에 복붙)

```
# STEP 1: UTM 태그 수신 + 텔레그램 알림 강화

## 목적
SNS 포스트 → 홈페이지 → 상담 신청 사이클에서, 어떤 포스트가 전환을 일으켰는지 추적

## 수정할 파일 (먼저 목록만 보여주세요)
- pages/api/submit-form.ts (또는 폼 제출 처리 API Route)
- 비대면 견적 폼 컴포넌트
- 매장방문 예약 폼 컴포넌트

## 요구사항

### 1. URL 쿼리스트링 자동 캡처
폼 페이지 진입 시 5개 UTM 파라미터를 hidden input 또는 useState로 캡처:
- utm_source: 'instagram' | 'threads'
- utm_medium: 'organic' | 'paid'
- utm_campaign: 예) 'wedding_busan_d1'
- utm_content: 예) '0830_subscribe_thread'
- utm_term: 예) 'munsoo-pugio' (단지/지역 슬러그)

### 2. 폼 제출 시 텔레그램 알림 포맷 강화

상담 신청이 들어오면 다음 형식으로 텔레그램에 보내주세요:

🔔 새 상담 신청 (매장방문 또는 비대면)

👤 이름: {성함}
📞 연락처: {연락처1} / {연락처2}
📋 상담 분야: {구독|혼수|이사|입주|단품}
📅 희망 날짜: {date} ← 매장방문만
💬 추가 요청: {message}

🌐 유입 경로
- 출처: {utm_source}
- 캠페인: {utm_campaign}
- 포스트: {utm_content}
- 단지/지역: {utm_term}

### 3. 보안 체크
- BOT_TOKEN과 CHAT_ID는 .env.local에서만 읽기
- API Route에서만 호출 (클라이언트 코드에 노출 금지)
- 환경변수 누락 시 에러 메시지 명확히

## 진행 방식
1단계: 변경할 파일 목록과 현재 상태 보여주기
2단계: 매니저님 OK 응답 대기
3단계: 코드 작성 및 변경 부분 주석 표시
4단계: 테스트 방법 안내

지금 1단계부터 시작해 주세요.
```

---

# STEP 2. /content 페이지 신설 — SNS 콘텐츠 라이브러리

## 작업 지시문

```
# STEP 2: SNS 콘텐츠 라이브러리 페이지 신설

## 목적
인스타·스레드 포스트들을 카페·블로그에 공유하기 좋은 형태로 모은 페이지.
"이 매니저 진짜 활동 많이 하네" 신뢰감을 갖도록 유도.

## 라우팅
- 경로: /content
- 헤더 네비게이션에 "콘텐츠" 메뉴 추가
  (홈 / 더 알아보기 / 콘텐츠 / 상담 예약 / 관리자)

## 페이지 구조

### 1. 상단 히어로
- 큰 글씨: "JCC가 매일 전하는 가전 인사이트"
- 서브: "19년 경력 조준석 매니저의 부울경 가전 가이드"

### 2. 카테고리 탭 (5개)
- 혼수 / 이사 / 입주 / 구독 / 단품
- 클릭 시 해당 타겟 콘텐츠만 필터링

### 3. 콘텐츠 카드 그리드
각 카드 구성:
- 썸네일 이미지 (16:9 또는 1:1)
- 제목 (1줄)
- 발행일 (예: 2026.05.04)
- 플랫폼 배지 (Instagram / Threads)
- 클릭 시 원본 SNS URL로 새 탭 이동

### 4. 데이터 소스
- 1단계: data/content.json 정적 파일로 시작
- 향후: Instagram Graph API / Threads API 연동 가능하게 구조화

## 디자인 원칙
- 매니저님 사이트 톤 동일 (다크 네이비 + 골드 + JINCENCHO)
- 모바일 우선
- 카드 호버 효과 골드 톤
- 스크롤 무한 로딩 또는 페이지네이션 (12개씩)

## 출력
- pages/content.tsx 전체 코드
- data/content.json 샘플 8개 (Day 1 카피 기반)
- 필요한 컴포넌트 모두

## 진행 방식
1. 먼저 디자인 와이어프레임을 텍스트로 보여주기
2. 매니저님 OK 응답 후 코드 작성
3. 작업 후 미리보기 가이드 제공

시작해 주세요.
```

---

# STEP 3. /graduation 페이지 — 졸업장 갤러리

## 작업 지시문

```
# STEP 3: 졸업장 & 후기 갤러리 페이지 신설

## 목적
"이미 많은 분이 진센조에서 가전 졸업했다"는 사회적 증명 시각화.
방문 신청을 망설이는 고객에게 결정적 신뢰 시그널 제공.

## 라우팅
- 경로: /graduation
- 헤더 네비게이션에 "가전 졸업장" 메뉴 추가

## 페이지 구조

### 1. 상단 히어로
- 큰 글씨: "지금까지 ○○쌍이 진센조에서 가전을 졸업했습니다"
  (숫자는 data/graduations.json의 항목 수로 자동 계산)
- 졸업장 모형 비주얼 1장 (개인정보 마스킹 처리된 샘플)

### 2. 졸업장 갤러리 그리드
- 익명 처리된 졸업장 이미지들 (성함 부분 블러)
- 각 카드 정보:
  * 지역 배지 (부산/울산/경남)
  * 카테고리 배지 (혼수/이사/입주)
  * 졸업월 (예: 2026.04)
- 호버 시 추가 정보:
  * 절감액 (예: "455만원 절감")
  * 구매 품목 수 (예: "11품목 풀패키지")

### 3. 인증샷 모음 섹션
- 고객이 카톡으로 보내준 인증샷 (동의 받은 것만)
- 카페에 자랑샷 올린 캡쳐 모음 (마스킹 처리)
- 6~9개 그리드

### 4. 졸업장 받는 방법 안내
- "JCC에서 가전 패키지 결제 완료 시 자동 증정"
- 5종 패키지 소개 카드:
  1) WEDDING·MOVING·AI HOME FESTA 표지
  2) Certificate of Completion 졸업인증서
  3) Care Guidelines 안내사항
  4) Share Your Moment 인증샷 안내 카드
  5) 갤러리아 결제내역서

### 5. 하단 CTA
- 큰 버튼: "당신도 진센조에서 가전 졸업하세요"
- 매장방문 예약 페이지로 이동

## 데이터 구조

data/graduations.json:
{
  "graduations": [
    {
      "id": "2026-0001",
      "region": "부산",
      "category": "혼수",
      "month": "2026-04",
      "savings": 4559000,
      "items": 11,
      "imageUrl": "/graduations/2026-0001-masked.png"
    }
  ]
}

public/graduations/ 폴더에 익명 처리된 이미지 placeholder 10개

## 디자인
- 매니저님 사이트 톤
- 졸업장 카드는 골드 테두리 강조
- 모바일에서는 1열, 태블릿 2열, 데스크탑 3열 그리드

## 출력
- pages/graduation.tsx
- 샘플 데이터 10개
- 더미 placeholder 이미지

먼저 와이어프레임 + 데이터 구조 보여주고 OK 받은 후 코드 작성해 주세요.
```

---

# STEP 4. /complex/[slug] — 단지별 랜딩 페이지

## 작업 지시문

```
# STEP 4: 단지별 동적 랜딩 페이지 (입주 D-Day 정밀 타깃)

## 목적
SNS 포스트 → 단지명 클릭 → 해당 단지 전용 랜딩 페이지로 직접 유입.
입주민 카페에서 링크 공유 시 단지 맞춤 정보가 노출돼 신뢰도 폭증.

## 라우팅
- 동적 경로: /complex/[slug]
- getStaticPaths + getStaticProps 적용
- 슬러그 예시:
  * /complex/doosan-weve-zenith-oceancity
  * /complex/munsoo-pugio-urbanpiece
  * /complex/munsoo-lottecastle-grandparc
  * /complex/eco-delta-city
  * /complex/wooam-1-redev
  * /complex/changwon-foresthills-desian

## 페이지 구조 (각 단지마다)

### 1. 단지 정보 헤더
- 단지명 (큰 글씨, 골드)
- 위치 (예: "부산 남구 우암동")
- 세대수 (예: "3,048세대")
- 입주 시점 (예: "2026.01")
- D-Day 카운트다운 (현재일 기준 자동 계산)
  * 예: "입주 D-43일"

### 2. "이 단지 전용 가전 가이드"
- 빌트인 옵션 사양 정리 (단지별 다름)
- 추천 가전 매칭 (Bespoke AI 모델 ↔ 단지 평면)
- 입주 첫날 셋업 시나리오 (D-30 / D-14 / D-7 단계별)

### 3. "이 단지 입주민 후기"
- 같은 단지에서 졸업한 분들의 익명 후기 카드 3~5개
- 절감액 평균치 (예: "이 단지 평균 절감액 412만원")

### 4. 매니저님 인용 카드
- "{단지명} 입주민님께 19년 차의 약속"
- "저는 고객이 만족할 때까지 옆에 있겠습니다 — 조준석 (JCC)"

### 5. CTA
- 메인 버튼: "이 단지 전용 매장방문 예약"
  → 캘린더 폼에 utm_term={slug} 자동 입력
- 서브 버튼: "카톡 비대면 견적"

## 데이터 구조

data/complexes.json:
{
  "complexes": [
    {
      "slug": "munsoo-pugio-urbanpiece",
      "name": "문수로푸르지오어반피스",
      "region": "울산 남구 신정동",
      "households": 339,
      "moveInDate": "2026-06-01",
      "builderInfo": "푸르지오",
      "builtInOptions": [
        "냉장고 빌트인 양문형",
        "식기세척기 옵션",
        "쿡탑 인덕션"
      ],
      "recommendedAppliances": [
        { "type": "냉장고", "model": "Bespoke AI 4도어", "reason": "..." },
        { "type": "세탁기", "model": "Bespoke AI Combo", "reason": "..." }
      ],
      "averageSavings": 4120000,
      "testimonials": [
        { "anonymous": "신정동 김O호 고객님", "content": "...", "savings": 4500000 }
      ]
    }
  ]
}

7개 핵심 단지 모두 더미 데이터로 채워 주세요:
1. 두산위브더제니스오션시티 (부산 남구 우암동, 3048, 2026.01)
2. 우암1구역 재개발 (부산 남구 우암동, 2205, 2026.12)
3. 에코델타시티 (부산 강서구, 3000+, 2026.03/11)
4. 울산KTX우방아이유쉘퍼스트 (울주 삼남읍, 344, 2026.06)
5. 문수로푸르지오어반피스 (울산 남구 신정동, 339, 2026.06)
6. 문수로롯데캐슬그랑파르크 (울산 남구 신정동, 193, 2026.08)
7. 진주 주약동 극동건설 (진주, 166, 2026.02)

## SEO 강화
- 각 페이지 meta:
  * title: "{단지명} 입주 가전 가이드 | JCC 진센조"
  * description: 단지명 + 입주 시점 + 핵심 가치 150자
  * og:image: 단지별 (없으면 JINCENCHO 로고로 대체)

## 출력
- pages/complex/[slug].tsx
- data/complexes.json (7개 단지 완성본)
- getStaticPaths + getStaticProps 작동 확인

먼저 데이터 구조 + 와이어프레임 보여주고 OK 받은 후 코드 작성해 주세요.
```

---

# STEP 5. SEO·성능 최적화

## 작업 지시문

```
# STEP 5: 홈페이지 SEO + 성능 최적화

## 목적
부울경 "진주 가전", "부산 혼수", "울산 입주가전" 등 검색 시 상위 노출.
모바일 로딩 속도 개선으로 SNS → 홈페이지 이탈률 감소.

## 작업 항목

### 1. 메타 태그 강화
모든 페이지에 다음 메타 추가:
- title: 페이지별 고유 + JCC 진센조 브랜드 포함
- description: 150자 이내, 핵심 키워드 자연 포함
- og:image: 페이지별 (홈은 JINCENCHO 로고 다크 1024)
- og:locale: ko_KR
- twitter:card: summary_large_image

### 2. 구조화 데이터 (JSON-LD)
LocalBusiness 스키마 추가:
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "JCC 진센조 (진주 통합매장)",
  "image": "https://jcc-band.vercel.app/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "진주",
    "addressRegion": "경남",
    "addressCountry": "KR"
  },
  "priceRange": "$$",
  "description": "삼성 AI 가전 전문가 조준석 매니저, 진주 전국 최초 통합매장",
  "sameAs": [
    "https://www.instagram.com/[매니저님 인스타]",
    "https://www.threads.net/@[매니저님 스레드]"
  ]
}

Person 스키마로 조준석 매니저 정보:
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "조준석",
  "jobTitle": "삼성 AI 가전 매니저",
  "yearsOfExperience": 19,
  "worksFor": "JCC (JINJU CENTUM CHOJUNSEOK)"
}

### 3. 사이트맵 자동 생성
- next-sitemap 패키지 설치
- next-sitemap.config.js 작성:
  * siteUrl: 'https://jcc-band.vercel.app'
  * generateRobotsTxt: true
  * 동적 경로 /complex/[slug] 모두 포함
- robots.txt 생성

### 4. 이미지 최적화
- next/image 컴포넌트 일괄 적용
- 졸업장 이미지 webp 변환
- 로고 사이즈 적절히 사용:
  * 모바일 헤더: 300px
  * 데스크탑 헤더: 500px
  * 다크 정사각: 1024px (OG 이미지용)

### 5. 폰트 최적화
- next/font 사용
- 한글 폰트 subset 적용
- preload 적절히

### 6. Lighthouse 점검
- 실행 후 점수 보고
- 목표: Performance 90+, Accessibility 95+, SEO 95+
- 90 미만 항목 모두 개선

## 출력
- 수정된 파일 전체
- next-sitemap.config.js
- 패키지 설치 명령어
- Lighthouse 결과 (전/후 비교)

작업 시작 전 변경할 파일 목록 먼저 보여주고 OK 받아 주세요.
```

---

# 🚀 마스터 종합 지시서 (한 번에 전체)

## ⚠️ 주의

이 지시서는 한 번에 5개 STEP 모두를 진행합니다.
**쿼터 소모가 매우 큽니다.** 매니저님이 한 STEP씩 끊어서 진행하시는 걸 강력 추천.

만약 정말 한 번에 진행하시려면 아래를 그대로 안티그래비티에 복붙:

```
# JCC 홈페이지 v2 통합 개선 — 5단계 작업

매니저님 JCC 홈페이지(jcc-band.vercel.app)를 다음 5단계로 단계별 개선해 주세요.

## 작업 원칙
- 한 단계 완료 후 매니저님 확인 받고 다음 단계 진행
- 모든 변경은 기존 디자인 톤(다크 네이비 + 골드 + JINCENCHO 로고) 유지
- 모바일 우선 반응형
- 텔레그램 봇 토큰 등 시크릿은 .env.local로 분리

## 단계별 작업

### STEP 1. UTM 태그 수신 시스템
폼 제출 시 SNS 유입 경로(utm_source, utm_campaign 등)를 텔레그램 알림에 함께 전송

### STEP 2. /content 페이지 신설
SNS 콘텐츠 라이브러리 (혼수/이사/입주/구독/단품 5탭)

### STEP 3. /graduation 페이지 신설
졸업장 갤러리 + 사회적 증명 (○○쌍 졸업)

### STEP 4. /complex/[slug] 동적 라우팅
부울경 7개 핵심 단지별 정밀 타깃 랜딩 페이지

### STEP 5. SEO·성능 최적화
메타 태그, 구조화 데이터, 사이트맵, 이미지 최적화

## 진행 방식
각 단계마다:
1. 변경할 파일 목록 먼저 보여주기
2. 매니저님 "OK" 응답 후 코드 작성
3. 작업 완료 후 변경사항 요약
4. 다음 단계로 진행 의사 확인

## 시작 신호
"STEP 1 시작"이라고 하시면 STEP 1만 진행.
한 단계씩 끊어서 진행해 주세요.
```

---

## 🔧 안티그래비티 쿼터 절약 팁

### 1. 모델 선택
- **Ollama Gemma4 (로컬)**: 무료, 코드 생성·수정 메인
- **Gemini 2.5 Flash**: 짧은 검수, 요약 용도
- **Gemini 2.5 Pro**: 마지막 통합 검토 한 번만
- **Claude (API)**: Antigravity 외부에서 별도 사용 (저와 대화)

### 2. 작업 분할
- 한 번에 1 STEP만
- 각 STEP 완료 후 GitHub 커밋
- 다음 STEP은 다른 세션에서

### 3. 컨텍스트 관리
- 새 세션 시작할 때 위 "작업 원칙" 부분만 먼저 던지기
- 불필요한 파일 읽기 요청 안 받기

### 4. 매니저님 직접 작업
- 단순 텍스트 수정·이미지 교체는 안티그래비티 안 쓰고 직접
- 디자인 조정도 가능하면 직접

---

## 📋 진행 체크리스트

작업 진행 시 매니저님이 체크하실 항목:

- [ ] STEP 1 — UTM 태그 수신 시스템 (가장 중요, 1순위)
- [ ] STEP 2 — /content 페이지
- [ ] STEP 3 — /graduation 페이지
- [ ] STEP 4 — /complex/[slug] 동적 라우팅
- [ ] STEP 5 — SEO·성능 최적화

각 STEP 완료마다:
- [ ] Vercel 배포 정상 확인
- [ ] 모바일에서 동작 확인
- [ ] 텔레그램 알림 정상 수신 확인 (STEP 1 이후)

---

🔒 **외부 공개 금지 — Internal Only**
