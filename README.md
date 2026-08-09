# 새숨더함 — 공식 홈페이지

> **"사람의 공간과 관계에 정성을 더하는 홈케어 브랜드"**  
> 실제 운영 사이트: **https://www.saesumplus.co.kr**

---

## 프로젝트 개요

새숨더함 공식 브랜드 홈페이지입니다.  
단순한 서비스 소개 페이지가 아닌, **브랜드 철학을 스토리텔링 방식으로 전달**하는 경험 중심의 싱글 페이지 웹사이트입니다.

방문자는 스크롤을 내릴수록 새숨더함의 철학 → 서비스 가치 → 플랫폼 비전 → 파트너 생태계의 이야기를 순서대로 경험하게 됩니다.

---

## 완성된 기능

### UI / 섹션 구성
| 섹션 | 설명 |
|------|------|
| **Navbar** | 투명→화이트 스크롤 전환, 이미지 로고 (배경 투명 PNG), 햄버거 메뉴 |
| **Hero** | 브랜드 철학 첫 화면 (배경 이미지 + 시적 문구 + CTA) |
| **Story 01** | 왜 새숨더함이 존재하는가 (신뢰 중심 메시지) |
| **Story 02** | 정성은 기술보다 먼저 (갤러리 이미지 3컷 동일 크기) |
| **Story 03** | 함께 성장하는 상생 (파트너 태그, 텍스트 전용) |
| **Story 04** | 새숨더함 스케줄러 (인터랙티브 Mockup UI) |
| **Story 05** | 홈케어오더나눔 (앱 다운로드 예고) |
| **Story 06** | 브랜드 드림 — 가장 신뢰받는 홈케어 |
| **Story 07** | 4대 서비스 소개 + **가격표 팝업 모달** |
| **Story 08** | 파트너 혜택 6가지 |
| **고객 후기** | 4개 실제 후기 카드 |
| **블로그** | 3개 콘텐츠 카드 (에어컨케어 / 카페트케어 / 소파케어) |
| **문의하기** | 네이버 폼 iframe 삽입 + 직접 연락처 + 카카오채널 |
| **Footer** | 회사정보 + SNS (유튜브, 네이버블로그, 카카오채널) |

### 인터랙션 & 애니메이션
- 스크롤 기반 Navbar 배경 전환 (투명 → 화이트)
- 로고: 히어로(어두운 배경)에서 흰색, 스크롤 후 컬러 로고로 전환 (`filter: brightness(0) invert(1)`)
- Intersection Observer를 활용한 섹션별 Reveal 애니메이션 (`.reveal-up.visible`)
- Hero 배경 Parallax 스크롤 효과
- 스케줄러 Mockup UI (다크 테마, 캘린더 컴포넌트)
- 숫자 카운터 Up 애니메이션 (Stats 카드)
- 서비스 카드 Hover 오버레이
- **가격표 팝업 모달** — `#priceBtn` 클릭, ESC/backdrop 닫기, 스크롤 잠금
- Back to Top 버튼
- 모바일 햄버거 메뉴

### 가격표 모달 구성 (`#priceModal`)
| 섹션 | 내용 |
|------|------|
| 🛏️ 매트리스 케어 | 건식/습식 × 싱글~패밀리 + 추가옵션 |
| 🛋️ 소파 케어 | 건식/습식 × 1인용~6인용 + 추가옵션 |
| 🟫 카페트 케어 | 크기별 (2m~5m) + 추가옵션 |
| ❄️ 에어컨 청소 | 기종별 전화 문의 (010-5675-4662) |

### 문의 채널
- **네이버 폼**: https://naver.me/GRDvyk52 (iframe 삽입)
- **전화**: 010-5675-4662
- **카카오톡 채널**: http://pf.kakao.com/_xdmexdX

### SEO
- 네이버 서치어드바이저 meta 인증 태그 포함
- `sitemap.xml` 생성 (전체 섹션 앵커 URL)
- `robots.txt` 생성 (네이버 Yeti 봇 허용)

---

## 파일 구조

```
index.html                  메인 단일 페이지 (41KB)
css/
  style.css                 전체 스타일 (변수 기반, 반응형, 2075줄)
js/
  main.js                   인터랙션 + 가격표 팝업 JS
images/
  logo.png                  새숨더함 로고 원본 (흰 배경)
  logo-transparent.png      배경 제거 로고 (navbar에 사용)
sitemap.xml                 XML 사이트맵
robots.txt                  크롤러 설정
```

---

## 주요 기능 URL 경로

| 경로 | 설명 |
|------|------|
| `/` 또는 `/index.html` | 메인 홈페이지 |
| `/#hero` | 히어로 섹션 |
| `/#story01` ~ `/#story08` | 각 스토리 섹션 |
| `/#blog` | 블로그 섹션 |
| `/#contact` | 문의 / 예약 섹션 |
| `#priceBtn` (버튼) | 가격표 팝업 모달 열기 (Story07 하단) |

---

## 디자인 시스템

| 요소 | 값 |
|------|-----|
| 메인 폰트 | Noto Serif KR (제목), Noto Sans KR (본문) |
| 브랜드 블루 | `--brand-blue: #0091EA` |
| 브랜드 블루 다크 | `--brand-blue-dark: #005FAD` |
| 브랜드 시안 | `--brand-cyan: #40C4FF` |
| 블루 소프트 | `--brand-blue-soft: #E6F3FB` |
| 차콜 | `--charcoal: #2c2b28` |
| Border radius | 12px (기본), 20px (대형) |

---

## 회사 정보

| 항목 | 내용 |
|------|------|
| 상호 | 새숨더함 |
| 대표 | 공경환 |
| 사업자등록번호 | 478-23-02307 |
| 주소 | 경기도 동두천시 이담로161 |
| 고객센터 | 010-5675-4662 |

---

## SNS 링크

| 채널 | URL |
|------|-----|
| 유튜브 | https://www.youtube.com/@saesum-plus |
| 네이버 블로그 | https://blog.naver.com/saesum-plus |
| 카카오톡 채널 | http://pf.kakao.com/_xdmexdX |

---

## 미구현 / 향후 개발 권장사항

### 콘텐츠
- [ ] 실제 시공 현장 사진으로 이미지 교체 (현재 AI 생성 이미지)
- [ ] 실제 고객 후기 및 사진 추가
- [ ] 블로그 개별 포스트 페이지 제작
- [ ] 서비스 상세 페이지 (`/services/mattress.html` 등)

### 기능
- [ ] 갤러리 라이트박스 기능
- [ ] 파트너 신청 폼 별도 구성
- [ ] 오더나눔 사전신청 시스템

### SEO / 마케팅
- [ ] Open Graph 이미지 제작 (`og:image`)
- [ ] Google Analytics 스크립트 추가
- [ ] 구조화 데이터 (Schema.org LocalBusiness) 추가
- [ ] Google Search Console 등록

---

## GitHub → Vercel 자동 배포 파이프라인

1. GitHub Repository에 파일 Push
2. Vercel이 자동으로 변경 감지 → 빌드 → 배포
3. 실제 사이트(https://www.saesumplus.co.kr)에 반영

### GitHub 업로드할 파일 목록 (이번 세션 변경)
- `index.html` — 전체 수정 (로고, 섹션, 모달, footer 등)
- `css/style.css` — 전체 수정 (로고 CSS, 가격표 모달 스타일 등)
- `js/main.js` — 전체 수정 (가격표 팝업 initPriceModal 추가)
- `images/logo-transparent.png` — 신규 (배경 제거 로고)
- `images/logo.png` — 신규 (원본 로고)
- `sitemap.xml` — 신규
- `robots.txt` — 신규

---

*새숨더함은 오늘도 사람의 공간에 정성을 더합니다.*
