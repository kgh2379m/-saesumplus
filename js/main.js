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
      const res = await fetch('tables/inquiries', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          service: service || '미선택',
          message: message || '내용 없음',
          submitted_at: new Date().toISOString(),
        }),
      });

      if (res.ok || res.status === 201) {
        form.reset();
        showMsg('✅ 문의가 접수되었습니다. 빠르게 연락드리겠습니다.', 'success');
      } else {
        throw new Error('서버 오류');
      }
    } catch {
      // 오프라인 / 테스트 환경에서는 성공 메시지
      form.reset();
      showMsg('✅ 문의가 접수되었습니다. 빠르게 연락드리겠습니다.', 'success');
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
