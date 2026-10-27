/**
 * 새숨더함 메인 JavaScript
 * - 네비게이션 스크롤 효과 & 모바일 메뉴
 * - Intersection Observer 기반 섹션 애니메이션
 * - 프로그레스 바 애니메이션
 * - 문의 폼 처리 (Table API 연동)
 * - 스무스 스크롤 & Back to Top
 */

'use strict';

/* ══════════════════════════════════════
   1. DOM Ready
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initRevealAnimations();
  initProgressBar();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  initServiceCards();
  initParallax();
  initGformLazyLoad();
});

/* ══════════════════════════════════════
   2. Navbar — 스크롤 시 배경 전환
══════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleScrolled = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggleScrolled, { passive: true });
  toggleScrolled(); // 초기 상태
}

/* ══════════════════════════════════════
   3. Mobile Menu
══════════════════════════════════════ */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  const open  = () => { links.classList.add('open');  toggle.setAttribute('aria-expanded', 'true'); };
  const close = () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };

  toggle.addEventListener('click', () => {
    links.classList.contains('open') ? close() : open();
  });

  // 링크 클릭 시 닫기
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', close);
  });

  // 외부 클릭 시 닫기
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      close();
    }
  });
}

/* ══════════════════════════════════════
   4. Intersection Observer — 섹션 Reveal
══════════════════════════════════════ */
function initRevealAnimations() {
  const elements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 연속 요소의 경우 순차 지연
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.children).filter(
                el => el.classList.contains('reveal-up') ||
                      el.classList.contains('reveal-left') ||
                      el.classList.contains('reveal-right')
              )
            : [];
          
          const idx = siblings.indexOf(entry.target);
          const delay = idx * 120;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   5. Progress Bar 애니메이션
══════════════════════════════════════ */
function initProgressBar() {
  const fills = document.querySelectorAll('.progress-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width  = target.dataset.width || '0';
          setTimeout(() => {
            target.style.width = width + '%';
          }, 400);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => observer.observe(fill));
}

/* ══════════════════════════════════════
   6. Contact Form — Table API 연동
══════════════════════════════════════ */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  const msgEl     = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMsg();

    const name    = form.name.value.trim();
    const phone   = form.phone.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    // 유효성 검사
    if (!name) { showMsg('이름을 입력해 주세요.', 'error'); return; }
    if (!phone) { showMsg('연락처를 입력해 주세요.', 'error'); return; }
    const phoneRegex = /^[0-9\-+]{9,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      showMsg('올바른 연락처 형식을 입력해 주세요.', 'error');
      return;
    }

    setLoading(true);

    try {
      // 카카오톡 채널로 문의 연결
      const kakaoUrl = 'http://pf.kakao.com/_xdmexdX/chat';
      form.reset();
      showMsg('✅ 카카오톡 채널로 연결합니다. 잠시 후 채팅창이 열립니다.', 'success');
      setTimeout(() => {
        window.open(kakaoUrl, '_blank');
      }, 800);
    } catch {
      form.reset();
      showMsg('✅ 카카오톡 채널로 연결합니다. 잠시 후 채팅창이 열립니다.', 'success');
    } finally {
      setLoading(false);
    }
  });

  function showMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className   = type;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearMsg() {
    msgEl.textContent = '';
    msgEl.className   = '';
  }

  function setLoading(on) {
    submitBtn.disabled    = on;
    submitBtn.textContent = on ? '보내는 중...' : '문의 보내기 →';
  }
}

/* ══════════════════════════════════════
   7. Back to Top
══════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══════════════════════════════════════
   8. Smooth Scroll (앵커 링크)
══════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72');
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 20;

      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════
   9. Service Cards — 키보드 접근성
══════════════════════════════════════ */
function initServiceCards() {
  document.querySelectorAll('.service-card').forEach(card => {
    const url = card.dataset.url;
    if (!url) return;

    // 포인터 커서
    card.style.cursor = 'pointer';

    // 클릭 → 새 창으로 블로그 열기
    card.addEventListener('click', () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    });

    // 키보드 접근성 (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* ══════════════════════════════════════
   10. 부드러운 Parallax (Hero)
══════════════════════════════════════ */
function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  if (!heroImg) return;

  // 모바일에서는 비활성화
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let rafId = null;

  window.addEventListener('scroll', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
      rafId = null;
    });
  }, { passive: true });
}

/* ══════════════════════════════════════
   11. 숫자 카운터 애니메이션 (Stats)
══════════════════════════════════════ */
function animateCounter(el, end, duration = 1500) {
  const start    = 0;
  const startTime = performance.now();
  const isPercent = el.textContent.includes('%');
  const endNum   = parseInt(end, 10);

  const step = (now) => {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current  = Math.round(start + (endNum - start) * eased);

    el.textContent = isPercent ? current + '%' : current;

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// Stats 카드 등장 시 카운터 실행
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const val = el.textContent;
        animateCounter(el, val);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.7 });

  stats.forEach(s => observer.observe(s));
}

document.addEventListener('DOMContentLoaded', initStatsCounter);

/* ══════════════════════════════════════
   12. Table Schema 초기화
══════════════════════════════════════ */
async function ensureInquiriesTable() {
  try {
    await fetch('tables/inquiries', { method: 'GET' });
  } catch {
    // 테이블이 없으면 생략 (정적 환경)
  }
}

document.addEventListener('DOMContentLoaded', ensureInquiriesTable);

/* ══════════════════════════════════════
   13. 가격표 팝업 모달
══════════════════════════════════════ */
function initPriceModal() {
  const modal    = document.getElementById('priceModal');
  const openBtn  = document.getElementById('priceBtn');
  const closeBtn = document.getElementById('priceModalClose');
  const backdrop = document.getElementById('priceModalBackdrop');
  const contactBtn = document.getElementById('priceContactBtn');
  if (!modal || !openBtn) return;

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // 예약 문의 버튼 클릭 시 모달 닫고 contact 섹션으로 이동
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

document.addEventListener('DOMContentLoaded', initPriceModal);

/* ══════════════════════════════════════
   14. 대표 인사 팝업 (탭: 손편지 + CM송)
══════════════════════════════════════ */
function initCeoModal() {
  const modal     = document.getElementById('ceoModal');
  const closeBtn  = document.getElementById('ceoModalClose');
  const okBtn     = document.getElementById('ceoModalOk');
  const noShowChk = document.getElementById('ceoNoShow');

  if (!modal) return;

  // 오늘 하루 보지 않기 체크
  const TODAY = new Date().toDateString();
  if (localStorage.getItem('ceoModalHide') === TODAY) return;

  // ── 탭 전환 로직 ──
  const tabs   = modal.querySelectorAll('.ceo-tab');
  const panels = modal.querySelectorAll('.ceo-tab-panel');
  const ytFrame = document.getElementById('ceoYoutubeFrame');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');

      // 탭 활성화
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // 패널 전환
      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.hidden = false;
          panel.classList.add('active');
        } else {
          panel.hidden = true;
          panel.classList.remove('active');
        }
      });

      // CM송 탭을 떠날 때 유튜브 영상 일시정지
      // (src 유지 — src를 바꾸면 재진입 시 다시 로드됨)
      if (targetId !== 'panelCm' && ytFrame) {
        // contentWindow postMessage로 일시정지
        try {
          ytFrame.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*'
          );
        } catch (_) { /* cross-origin 차단 — 무시 */ }
      }
    });
  });

  // ── iframe 오류(Error 153 등) 감지 → fallback 표시 ──
  if (ytFrame) {
    ytFrame.addEventListener('error', showCmFallback);

    // YouTube가 차단된 환경에서는 load 후에도 빈 페이지가 뜸
    // → 3초 뒤 contentWindow 접근 시도로 추가 판별
    ytFrame.addEventListener('load', () => {
      setTimeout(() => {
        try {
          // 정상이면 접근 불가(cross-origin) → catch로 빠짐 = 정상
          // 차단이면 about:blank 등 접근 가능하거나 오류 페이지
          const doc = ytFrame.contentDocument || ytFrame.contentWindow.document;
          // about:blank 또는 오류 페이지가 열린 경우
          if (doc && (doc.URL === 'about:blank' || doc.body.innerText.includes('153'))) {
            showCmFallback();
          }
        } catch (_) {
          // cross-origin 차단 = iframe 정상 로드됨 → 아무 것도 안 함
        }
      }, 2000);
    });
  }

  function showCmFallback() {
    const wrap     = document.getElementById('ceoVideoWrap');
    const fallback = document.getElementById('ceoCmFallback');
    if (wrap)     wrap.classList.add('error');
    if (fallback) fallback.hidden = false;
  }

  // 1.5초 딜레이 — 홈페이지 완전 진입 후 자연스럽게 등장
  setTimeout(() => {
    modal.hidden = false;
    // body 스크롤 차단 없음 — 홍보 팝업 방식
  }, 1500);

  // 닫기
  function closeModal() {
    if (noShowChk && noShowChk.checked) {
      localStorage.setItem('ceoModalHide', TODAY);
    }
    // CM송 탭 재생 중이면 일시정지
    if (ytFrame) {
      try {
        ytFrame.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      } catch (_) { /* 무시 */ }
    }
    modal.hidden = true;
  }

  closeBtn.addEventListener('click', closeModal);
  okBtn.addEventListener('click', closeModal);

  // ESC 키로도 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

document.addEventListener('DOMContentLoaded', initCeoModal);

/* ══════════════════════════════════════
   15. 구글 시트 후기 자동 로드
   — Apps Script API → 후기 카드 렌더링
══════════════════════════════════════ */
const REVIEWS_API = 'https://script.google.com/macros/s/AKfycbzJmaxqyiLknXzCPXXZOGOxHrzyynEODsrVypDzjtZ9ktMyt40pm8IG_79FqwyHILFa/exec';

// 컬럼 키 매핑 (구글 시트 헤더 그대로)
const COL_STAR    = '서비스에 대한 평가를 별점으로 보여주세요. (5점 만점)';
const COL_TEXT    = '서비스 받고 나신 소감을 자유롭게 작성해 주세요.';
const COL_AUTHOR  = '성함(가명가능), 지역(시/군 단위까지만), 폰번호4자리 작성해 주세요.(개인정보 보호 위해 작성규칙 지켜주세요!)';
const COL_SERVICE = '제공 받은 서비스 품목 선택해 주세요. (복수선택 가능)';
const COL_TIME    = '타임스탬프';

function starHTML(score) {
  const n = parseInt(score, 10) || 5;
  return '★'.repeat(Math.min(n, 5)) + '☆'.repeat(Math.max(0, 5 - n));
}

function avatarChar(authorStr) {
  if (!authorStr) return '익';
  const trimmed = authorStr.trim();
  return trimmed.charAt(0) || '익';
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (isNaN(d)) return '';
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/* ── 대표 답글 데이터 (reviewId → {reviewId, text, time}) ── */
let reviewComments = {};
let ownerPw = null; // 대표 인증 비밀번호 (메모리에만 보관, 새로고침하면 사라짐)

function replyInnerHTML(rid) {
  const c   = reviewComments[rid];
  const has = !!(c && c.text);
  let html  = '';
  if (has) {
    const d = formatDate(c.time);
    html += `
      <div class="review-reply">
        <div class="review-reply-head">
          <i class="fa fa-reply" aria-hidden="true"></i> 새숨더함 대표 답글
          ${d ? `<span class="review-reply-date">${d}</span>` : ''}
        </div>
        <p class="review-reply-text">${escapeHtml(c.text).replace(/\n/g, '<br>')}</p>
      </div>`;
  }
  if (rid) {
    html += `
      <div class="review-owner-tools">
        <button type="button" class="btn-reply-edit">
          <i class="fa fa-pen" aria-hidden="true"></i> ${has ? '답글 수정' : '답글 쓰기'}
        </button>
      </div>`;
  }
  return html;
}

function renderReviewCard(row, isFeatured) {
  const rawId        = String(row[COL_TIME] || '');
  const star        = escapeHtml(row[COL_STAR]    || '5');
  const text        = escapeHtml(row[COL_TEXT]    || '');
  const authorFull  = escapeHtml(row[COL_AUTHOR]  || '익명 고객님');
  const service     = escapeHtml(row[COL_SERVICE] || '');
  const date        = formatDate(row[COL_TIME]);
  const avatar      = escapeHtml(avatarChar(row[COL_AUTHOR]));
  const featuredClass = isFeatured ? ' review-card-featured' : '';
  const starLabel   = `별점 ${star}점`;

  return `
    <blockquote class="review-card review-card-dynamic${featuredClass}" data-rid="${escapeHtml(rawId)}">
      <div class="review-stars" aria-label="${starLabel}">${starHTML(star)}</div>
      <p class="review-text">"${text}"</p>
      <div class="review-reply-wrap">${replyInnerHTML(rawId)}</div>
      <footer class="review-meta">
        <span class="reviewer-avatar" aria-hidden="true">${avatar}</span>
        <div>
          <cite class="reviewer-name">${authorFull}</cite>
          ${service ? `<span class="review-service">${service}</span>` : ''}
          ${date    ? `<span class="review-date">${date}</span>` : ''}
        </div>
      </footer>
    </blockquote>`;
}

const REVIEWS_PAGE_SIZE = 6; // 한 번에 보여줄 최대 후기 수
let allReviewRows = [];      // 전체 후기 보관
let shownCount = 0;          // 현재 표시된 후기 수

async function loadGsheetReviews() {
  const loading  = document.getElementById('reviews-loading');
  const grid     = document.getElementById('reviews-dynamic-grid');
  const fallback = document.getElementById('reviews-fallback');
  const moreWrap = document.getElementById('reviews-more-wrap');
  const moreBtn  = document.getElementById('reviews-more-btn');
  if (!grid) return;

  try {
    const res  = await fetch(REVIEWS_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rows = (data.reviews || []).filter(r => r[COL_TEXT] && r[COL_TEXT].trim());

    // 대표 답글 (Apps Script가 comments를 내려주는 경우에만)
    reviewComments = {};
    (data.comments || []).forEach(c => {
      if (c && c.reviewId) reviewComments[String(c.reviewId)] = c;
    });

    if (loading) loading.style.display = 'none';

    if (rows.length === 0) {
      // 후기 없으면 fallback 표시
      if (fallback) fallback.style.display = '';
      return;
    }

    // 최신순 정렬, 전체 보관
    allReviewRows = rows
      .slice()
      .sort((a, b) => new Date(b[COL_TIME]) - new Date(a[COL_TIME]));

    // 첫 6개 표시
    shownCount = Math.min(REVIEWS_PAGE_SIZE, allReviewRows.length);
    grid.innerHTML = allReviewRows
      .slice(0, shownCount)
      .map((row, i) => renderReviewCard(row, i === 0))
      .join('');
    grid.style.display = '';

    // 6개 초과면 더보기 버튼 표시
    if (allReviewRows.length > REVIEWS_PAGE_SIZE && moreWrap) {
      moreWrap.style.display = '';
      updateMoreBtn(moreBtn);
    }

  } catch (err) {
    console.warn('[Reviews] API 오류, fallback 표시:', err.message);
    if (loading)  loading.style.display  = 'none';
    if (fallback) fallback.style.display = '';
  }
}

function updateMoreBtn(btn) {
  if (!btn) return;
  const remaining = allReviewRows.length - shownCount;
  if (remaining <= 0) {
    btn.closest('#reviews-more-wrap').style.display = 'none';
    return;
  }
  btn.innerHTML = '<i class="fa fa-chevron-down" aria-hidden="true"></i> 후기 더보기 (' + remaining + '개 더 보기)';
}

function initReviewMoreBtn() {
  const btn  = document.getElementById('reviews-more-btn');
  const grid = document.getElementById('reviews-dynamic-grid');
  if (!btn || !grid) return;

  btn.addEventListener('click', () => {
    const nextCount = Math.min(shownCount + REVIEWS_PAGE_SIZE, allReviewRows.length);
    const newCards  = allReviewRows
      .slice(shownCount, nextCount)
      .map(row => renderReviewCard(row, false))
      .join('');
    grid.insertAdjacentHTML('beforeend', newCards);
    shownCount = nextCount;
    updateMoreBtn(btn);
  });
}

document.addEventListener('DOMContentLoaded', initReviewMoreBtn);

document.addEventListener('DOMContentLoaded', loadGsheetReviews);

/* ══════════════════════════════════════
   16. 구글 폼 iframe 지연 로드
   — 후기 섹션이 뷰포트에 들어올 때 src 주입
══════════════════════════════════════ */
function initGformLazyLoad() {
  const wrap    = document.getElementById('gform-iframe-wrap');
  const iframe  = document.getElementById('gform-iframe');
  const loading = document.getElementById('gform-loading');
  if (!wrap || !iframe) return;

  const dataSrc = iframe.getAttribute('data-src');
  if (!dataSrc) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(wrap);

      // src 주입
      iframe.src = dataSrc;

      // 로드 완료 시 스피너 숨기고 iframe 표시
      iframe.addEventListener('load', () => {
        if (loading) loading.style.display = 'none';
        iframe.style.display = 'block';
      }, { once: true });

      // 8초 이내 load 이벤트 없으면 강제 표시
      setTimeout(() => {
        if (loading) loading.style.display = 'none';
        iframe.style.display = 'block';
      }, 8000);
    });
  }, { threshold: 0.1 });

  observer.observe(wrap);
}

/* ══════════════════════════════════════
   17. 대표 전용 답글 기능 (4자리 비밀번호)
   — 비밀번호 검증과 답글 저장은 Apps Script(서버)에서 처리
   — 화면에서는 '대표 로그인' 후에만 답글 도구가 보임
══════════════════════════════════════ */
const OWNER_SS_KEY = 'saesumOwnerPw';

async function callReviewsApi(payload) {
  // text/plain 으로 보내야 CORS 사전요청(preflight) 없이 Apps Script가 받을 수 있음
  const res = await fetch(REVIEWS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

function initOwnerTools() {
  const grid      = document.getElementById('reviews-dynamic-grid');
  const loginBtn  = document.getElementById('owner-login-btn');
  const form      = document.getElementById('owner-login-form');
  const input     = document.getElementById('owner-pin');
  const msgEl     = document.getElementById('owner-login-msg');
  if (!grid || !loginBtn || !form || !input) return;

  const setMsg = (t, isErr) => {
    if (!msgEl) return;
    msgEl.textContent = t || '';
    msgEl.classList.toggle('is-error', !!isErr);
  };

  function setOwnerMode(on) {
    document.body.classList.toggle('owner-mode', on);
    loginBtn.innerHTML = on
      ? '<i class="fa fa-lock-open" aria-hidden="true"></i> 대표 로그아웃'
      : '<i class="fa fa-lock" aria-hidden="true"></i> 대표 로그인';
    loginBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (!on) {
      ownerPw = null;
      sessionStorage.removeItem(OWNER_SS_KEY);
    }
  }

  // 같은 탭에서 새로고침해도 유지 (탭을 닫으면 자동 해제)
  const saved = sessionStorage.getItem(OWNER_SS_KEY);
  if (saved) { ownerPw = saved; setOwnerMode(true); }

  loginBtn.addEventListener('click', () => {
    if (ownerPw) {
      setOwnerMode(false);
      setMsg('로그아웃 되었습니다.');
      return;
    }
    form.hidden = !form.hidden;
    if (!form.hidden) { input.value = ''; input.focus(); }
    setMsg('');
  });

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = input.value.trim();
    if (!/^\d{4}$/.test(pw)) { setMsg('숫자 4자리를 입력해 주세요.', true); return; }

    setMsg('확인 중…');
    try {
      const r = await callReviewsApi({ action: 'verify', pw });
      if (r.ok) {
        ownerPw = pw;
        sessionStorage.setItem(OWNER_SS_KEY, pw);
        setOwnerMode(true);
        form.hidden = true;
        setMsg('대표 모드로 전환되었습니다. 각 후기 카드의 [답글 쓰기]를 눌러 주세요.');
      } else if (r.error === 'locked') {
        setMsg('비밀번호를 여러 번 틀려 10분간 잠겼습니다.', true);
      } else {
        setMsg('비밀번호가 맞지 않습니다.', true);
      }
    } catch (err) {
      setMsg('서버 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.', true);
    }
  });

  /* ── 카드 안의 답글 작성/수정/삭제 (이벤트 위임) ── */
  const refreshReply = (card, rid) => {
    const wrap = card.querySelector('.review-reply-wrap');
    if (wrap) wrap.innerHTML = replyInnerHTML(rid);
  };

  grid.addEventListener('click', async (e) => {
    const card = e.target.closest('.review-card-dynamic');
    if (!card) return;
    const rid  = card.dataset.rid;
    const wrap = card.querySelector('.review-reply-wrap');

    // 1) 편집창 열기
    if (e.target.closest('.btn-reply-edit')) {
      if (!ownerPw) return;
      const cur  = (reviewComments[rid] && reviewComments[rid].text) || '';
      const has  = !!cur;
      wrap.innerHTML = `
        <div class="review-reply-editor">
          <textarea rows="3" maxlength="500" placeholder="고객님께 남길 답글을 입력해 주세요. (최대 500자)">${escapeHtml(cur)}</textarea>
          <div class="review-reply-actions">
            <button type="button" class="btn-reply-save">등록</button>
            ${has ? '<button type="button" class="btn-reply-delete">삭제</button>' : ''}
            <button type="button" class="btn-reply-cancel">취소</button>
            <span class="review-reply-msg" aria-live="polite"></span>
          </div>
        </div>`;
      wrap.querySelector('textarea').focus();
      return;
    }

    // 2) 취소
    if (e.target.closest('.btn-reply-cancel')) {
      refreshReply(card, rid);
      return;
    }

    // 3) 등록 / 삭제
    const isSave = e.target.closest('.btn-reply-save');
    const isDel  = e.target.closest('.btn-reply-delete');
    if (!isSave && !isDel) return;

    const msg = wrap.querySelector('.review-reply-msg');
    const ta  = wrap.querySelector('textarea');
    const text = isDel ? '' : ta.value.trim();

    if (isSave && !text) { msg.textContent = '답글 내용을 입력해 주세요.'; return; }
    if (isDel && !confirm('이 답글을 삭제할까요?')) return;

    wrap.querySelectorAll('button').forEach(b => b.disabled = true);
    msg.textContent = '저장 중…';

    try {
      const r = await callReviewsApi({ action: 'reply', reviewId: rid, text, pw: ownerPw });
      if (r.ok) {
        if (r.deleted || !r.comment) delete reviewComments[rid];
        else reviewComments[rid] = r.comment;
        refreshReply(card, rid);
      } else if (r.error === 'auth' || r.error === 'locked') {
        setOwnerMode(false);
        refreshReply(card, rid);
        setMsg('인증이 만료되었거나 잠겼습니다. 다시 로그인해 주세요.', true);
        form.hidden = false;
      } else {
        wrap.querySelectorAll('button').forEach(b => b.disabled = false);
        msg.textContent = '저장 실패: ' + (r.error || '알 수 없는 오류');
      }
    } catch (err) {
      wrap.querySelectorAll('button').forEach(b => b.disabled = false);
      msg.textContent = '서버 연결에 실패했습니다.';
    }
  });
}

document.addEventListener('DOMContentLoaded', initOwnerTools);
