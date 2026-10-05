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
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // 예약 섹션으로 스크롤
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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
   15. 고객 후기 — 로드 & 작성 모달
══════════════════════════════════════ */

/* ── 15-1. 샘플 후기 (API 실패 시 fallback) ── */
const FALLBACK_REVIEWS = [
  {
    author_name: '김지은',
    service: '매트리스 케어',
    region: '서울 마포구',
    rating: 5,
    content: '매트리스를 구매한 지 3년이 됐는데 처음으로 제대로 청소했어요. 작업 전후 사진을 보여주시는데 정말 깜짝 놀랐습니다. 전문 장비로 꼼꼼하게 해주시고, 친절하게 설명도 해주셔서 너무 만족스러웠어요. 앞으로 정기적으로 이용할 것 같아요!'
  },
  {
    author_name: '박민준',
    service: '에어컨 케어',
    region: '경기 성남시',
    rating: 5,
    content: '에어컨에서 냄새가 난다 싶었는데 필터 상태를 보니 정말 심각했더라고요. 청소 후 확실히 공기가 달라졌습니다. 아이들 키우는 집이라 더 신경 쓰였는데 꼼꼼하게 해주셔서 감사합니다. 가격도 합리적이고 시간도 딱 맞게 오셨어요.'
  },
  {
    author_name: '이수연',
    service: '소파 케어',
    region: '서울 강동구',
    rating: 5,
    content: '강아지를 키우다 보니 소파에 냄새도 배고 털도 많이 남아서 걱정했는데, 케어 후 완전히 새 소파처럼 돌아왔어요! 반려동물 전문 케어라 더 믿음이 갔고, 사용하는 약품도 친환경이라 안심이 됐습니다. 정말 강력 추천드려요!'
  }
];

/* ── 15-2. 후기 카드 HTML 생성 ── */
function renderReviewCards(rows) {
  const stars   = n => '★'.repeat(n) + '☆'.repeat(5 - n);
  const mask    = name => name.length <= 1 ? name + '○○' : name[0] + '○'.repeat(name.length - 1);
  const initial = name => (name || '?')[0];

  return rows.map(r => `
    <blockquote class="review-card review-card-dynamic">
      <div class="review-stars" aria-label="별점 ${r.rating}점">${stars(Number(r.rating))}</div>
      <p class="review-text">"${escapeHtml(r.content)}"</p>
      <footer class="review-meta">
        <span class="reviewer-avatar" aria-hidden="true">${escapeHtml(initial(r.author_name))}</span>
        <div>
          <cite class="reviewer-name">${escapeHtml(mask(r.author_name))} 고객님</cite>
          <span class="review-service">${escapeHtml(r.service)}</span>
          <span class="review-location">${escapeHtml(r.region)}</span>
        </div>
      </footer>
    </blockquote>
  `).join('');
}

/* ── 15-3. 승인된 후기 목록 로드 ── */
async function loadReviews() {
  const grid    = document.getElementById('reviewsGrid');
  const loading = document.getElementById('reviewsLoading');
  if (!grid) return;

  try {
    const res = await fetch('tables/reviews?limit=50&sort=created_at');

    /* 401·403 등 인증 오류 → fallback */
    if (!res.ok) {
      throw new Error('API ' + res.status);
    }

    const data = await res.json();
    const rows = (data.data || []).filter(
      r => r.approved === true || r.approved === 'true' || r.approved === 1
    );

    if (loading) loading.remove();

    if (!rows.length) {
      /* DB에 승인된 후기 없으면 fallback 샘플 표시 */
      grid.innerHTML = renderReviewCards(FALLBACK_REVIEWS);
      return;
    }

    grid.innerHTML = renderReviewCards(rows);

  } catch (err) {
    /* 네트워크 오류·401 등 → 샘플 후기 표시 (빈 화면 방지) */
    if (loading) loading.remove();
    grid.innerHTML = renderReviewCards(FALLBACK_REVIEWS);
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', loadReviews);

/* ── 15-2. 후기 작성 모달 ── */
function initReviewModal() {
  const modal      = document.getElementById('reviewModal');
  const openBtn    = document.getElementById('reviewWriteBtn');
  const closeBtn   = document.getElementById('reviewModalClose');
  const cancelBtn  = document.getElementById('reviewCancelBtn');
  const backdrop   = document.getElementById('reviewModalBackdrop');
  const form       = document.getElementById('reviewForm');
  const submitBtn  = document.getElementById('reviewSubmitBtn');
  const formMsg    = document.getElementById('reviewFormMsg');
  const ratingInput = document.getElementById('rv-rating');
  const starBtns   = document.querySelectorAll('.star-btn');
  const starLabel  = document.getElementById('starLabel');
  const textarea   = document.getElementById('rv-content');
  const charCount  = document.getElementById('charCount');

  if (!modal || !openBtn) return;

  /* 모달 열기 */
  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('rv-name').focus();
  }

  /* 모달 닫기 */
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* 별점 인터랙션 */
  const starLabels = ['', '별로예요', '그저 그래요', '괜찮아요', '좋아요', '최고예요!'];
  let currentRating = 0;

  function setStars(val) {
    currentRating = val;
    ratingInput.value = val;
    starBtns.forEach(btn => {
      btn.classList.toggle('active', Number(btn.dataset.val) <= val);
    });
    starLabel.textContent = val ? `${val}점 — ${starLabels[val]}` : '별점을 선택해주세요';
  }

  starBtns.forEach(btn => {
    btn.addEventListener('click',      () => setStars(Number(btn.dataset.val)));
    btn.addEventListener('mouseenter', () => {
      starBtns.forEach(b => b.classList.toggle('active', Number(b.dataset.val) <= Number(btn.dataset.val)));
    });
    btn.addEventListener('mouseleave', () => setStars(currentRating));
  });

  /* 글자 수 카운터 */
  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      charCount.textContent = `${textarea.value.length} / 1000`;
    });
  }

  /* 폼 제출 */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    hideMsg();

    const name    = form.author_name.value.trim();
    const phone   = form.phone_last4.value.trim();
    const service = form.service.value;
    const region  = form.region.value.trim();
    const rating  = Number(ratingInput.value);
    const content = form.content.value.trim();

    // 유효성 검사
    if (!name)              return showMsg('이름을 입력해주세요.', 'error');
    if (!/^\d{4}$/.test(phone)) return showMsg('연락처 뒷 4자리를 숫자 4자리로 입력해주세요.', 'error');
    if (!service)           return showMsg('이용 서비스를 선택해주세요.', 'error');
    if (!region)            return showMsg('지역을 입력해주세요.', 'error');
    if (!rating)            return showMsg('별점을 선택해주세요.', 'error');
    if (content.length < 20) return showMsg('후기 내용을 20자 이상 입력해주세요.', 'error');

    setLoading(true);

    try {
      const res = await fetch('tables/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name:  name,
          phone_last4:  phone,
          service,
          region,
          rating,
          content,
          approved:     false,
          admin_note:   ''
        })
      });

      if (!res.ok) throw new Error('서버 오류');

      // 성공
      form.reset();
      setStars(0);
      if (charCount) charCount.textContent = '0 / 1000';
      showMsg('✅ 후기가 접수되었습니다! 관리자 확인 후 게시됩니다. 감사합니다 😊', 'success');
      submitBtn.disabled = true;

      // 3초 후 모달 닫기
      setTimeout(() => {
        closeModal();
        submitBtn.disabled = false;
        hideMsg();
      }, 3000);

    } catch {
      showMsg('⚠️ 제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    } finally {
      setLoading(false);
    }
  });

  function showMsg(text, type) {
    formMsg.textContent = text;
    formMsg.className   = `review-form-msg ${type}`;
    formMsg.hidden      = false;
    formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function hideMsg() {
    formMsg.hidden    = true;
    formMsg.textContent = '';
  }
  function setLoading(on) {
    submitBtn.disabled    = on;
    submitBtn.innerHTML   = on
      ? '<i class="fa fa-spinner fa-spin"></i> 제출 중...'
      : '<i class="fa fa-paper-plane"></i> 후기 제출하기';
  }
}

document.addEventListener('DOMContentLoaded', initReviewModal);
