import { INDUSTRIES } from './data/industries.js';
import { SERVICES } from './data/services.js';
import { CASE_STUDIES } from './data/caseStudies.js';
import { TESTIMONIALS } from './data/testimonials.js';

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initStatsCounter();
  initIndustryFilter();
  initServicesMatrix();
  initRoiCalculator();
  initTestimonials();
  initModals();
});

/* 1. Header Scroll effect */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* 2. Stats Animated Counter */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(num => {
          const target = parseInt(num.getAttribute('data-target') || '0', 10);
          const suffix = num.textContent.replace(/[0-9]/g, '');
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            num.textContent = current + suffix;
          }, 30);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) observer.observe(statsBar);
}

/* 3. Industry Domain Filter & Case Studies */
let activeIndustryId = 'all';

function initIndustryFilter() {
  const tabsContainer = document.getElementById('industry-tabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = INDUSTRIES.map(ind => `
    <button class="industry-tab ${ind.id === activeIndustryId ? 'active' : ''}" data-id="${ind.id}">
      <span>${ind.name}</span>
    </button>
  `).join('');

  tabsContainer.querySelectorAll('.industry-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeIndustryId = btn.getAttribute('data-id');
      tabsContainer.querySelectorAll('.industry-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCaseStudies();
    });
  });

  renderCaseStudies();
}

function renderCaseStudies() {
  const grid = document.getElementById('case-studies-grid');
  if (!grid) return;

  const filtered = activeIndustryId === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(cs => cs.industryId === activeIndustryId);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
        <p style="font-size: 1.1rem; margin-bottom: 1rem;">Specialized custom case study available for this domain upon consultation.</p>
        <button class="btn btn-secondary modal-open-trigger">Request Custom Domain Audit →</button>
      </div>
    `;
    attachModalTriggers();
    return;
  }

  grid.innerHTML = filtered.map(cs => `
    <article class="case-card" data-case-id="${cs.id}">
      <div class="case-img-wrap">
        <img src="${cs.image}" alt="${cs.clientName}" class="case-img" loading="lazy" />
        <span class="badge badge-emerald" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px);">
          ${cs.timeline}
        </span>
      </div>
      <div class="case-body">
        <div>
          <h3 class="case-title">${cs.clientName}</h3>
          <p class="case-tagline">${cs.tagline}</p>
        </div>

        <div class="case-metrics-row">
          ${cs.metrics.map(m => `
            <div class="metric-pill">
              <span class="metric-val">${m.value}</span>
              <span class="metric-lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-secondary" style="width: 100%; font-size: 0.85rem; padding: 0.6rem;">
          View Strategy Breakdown →
        </button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('click', () => {
      const caseId = card.getAttribute('data-case-id');
      openCaseStudyModal(caseId);
    });
  });
}

function openCaseStudyModal(caseId) {
  const cs = CASE_STUDIES.find(c => c.id === caseId);
  if (!cs) return;

  const modal = document.getElementById('case-modal');
  const content = document.getElementById('case-modal-content');

  content.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <span class="badge badge-amber" style="margin-bottom: 0.5rem;">${cs.timeline} Execution</span>
      <h2 style="font-size: 1.8rem; font-weight: 800;">${cs.clientName}</h2>
      <p style="color: var(--accent-blue); font-weight: 600; font-size: 0.95rem; margin-top: 0.25rem;">${cs.tagline}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; background: var(--bg-secondary); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
      ${cs.metrics.map(m => `
        <div style="text-align: center;">
          <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--accent-emerald);">${m.value}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">${m.label}</div>
        </div>
      `).join('')}
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.4rem;">The Challenge:</h4>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">${cs.challenge}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.4rem;">The Vanguard Solution:</h4>
      <p style="color: var(--text-secondary); font-size: 0.9rem;">${cs.solution}</p>
    </div>

    <div style="margin-bottom: 2rem;">
      <h4 style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Services Deployed:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${cs.servicesUsed.map(s => `<span class="badge" style="font-size: 0.75rem;">${s}</span>`).join('')}
      </div>
    </div>

    <button id="case-modal-cta" class="btn btn-primary" style="width: 100%;">
      Replicate Strategy For Your Brand →
    </button>
  `;

  modal.classList.add('active');

  document.getElementById('case-modal-cta')?.addEventListener('click', () => {
    modal.classList.remove('active');
    openContactModal();
  });
}

/* 4. Services Matrix Renderer */
function initServicesMatrix() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map(srv => `
    <div class="service-card">
      <div class="service-icon-wrap">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <h3 class="service-title">${srv.title}</h3>
      <div class="service-subtitle">${srv.subtitle}</div>

      <ul class="service-list">
        ${srv.deliverables.map(d => `<li class="service-list-item">${d}</li>`).join('')}
      </ul>

      <div class="service-metric-badge">
        ${srv.highlightMetric}
      </div>
    </div>
  `).join('');
}

/* 5. Interactive ROI & Growth Calculator in INR (₹) */
function initRoiCalculator() {
  const budgetSlider = document.getElementById('roi-budget-slider');
  const ticketSlider = document.getElementById('roi-ticket-slider');
  const industrySelect = document.getElementById('roi-industry-select');

  const budgetDisplay = document.getElementById('budget-val-display');
  const ticketDisplay = document.getElementById('ticket-val-display');

  const projectedRevDisplay = document.getElementById('projected-revenue-display');
  const projectedLeadsDisplay = document.getElementById('projected-leads-display');

  if (!budgetSlider || !ticketSlider || !projectedRevDisplay) return;

  // Realistic CPL in INR & ROAS benchmarks
  const domainBench = {
    'real-estate': { cpl: 450, roas: 5.8 },
    'skincare-dermatology': { cpl: 350, roas: 5.76 },
    'hospitals-dental': { cpl: 380, roas: 6.5 },
    'ayurveda-hospital': { cpl: 360, roas: 5.5 },
    'interior-design': { cpl: 550, roas: 5.2 },
    'travel-tourism': { cpl: 280, roas: 5.6 },
    'car-rental': { cpl: 250, roas: 5.4 },
    'chartered-accountant': { cpl: 650, roas: 4.8 },
    'educational-brands': { cpl: 320, roas: 6.0 }
  };

  function formatINR(amount) {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  function calculateROI() {
    const budget = parseFloat(budgetSlider.value);
    const ticket = parseFloat(ticketSlider.value);
    const domainKey = industrySelect.value;
    const bench = domainBench[domainKey] || { cpl: 350, roas: 5.5 };

    budgetDisplay.textContent = `${formatINR(budget)} / mo`;
    ticketDisplay.textContent = formatINR(ticket);

    const estimatedLeads = Math.round(budget / bench.cpl);
    const conversionRate = 0.08;
    const acquiredClients = Math.max(1, Math.round(estimatedLeads * conversionRate));
    const projectedGrossRev = budget * bench.roas;

    projectedRevDisplay.textContent = formatINR(projectedGrossRev);
    projectedLeadsDisplay.textContent = `${estimatedLeads} qualified leads / mo (${acquiredClients} estimated sales)`;
  }

  budgetSlider.addEventListener('input', calculateROI);
  ticketSlider.addEventListener('input', calculateROI);
  industrySelect.addEventListener('change', calculateROI);

  calculateROI();

  document.getElementById('roi-claim-btn')?.addEventListener('click', () => {
    openContactModal();
  });
}

/* 6. Testimonials Renderer with Anonymous Roles */
function initTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <div>
        <div class="test-stars">★★★★★</div>
        <p class="test-quote">"${t.content}"</p>
      </div>

      <div>
        <div class="badge badge-emerald" style="margin-bottom: 1rem; font-size: 0.75rem;">${t.growthTag}</div>
        <div class="test-author-row">
          <div>
            <div class="author-name">${t.role}</div>
            <div class="author-role">${t.company}</div>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* 7. Modal & Toast Logic */
function initModals() {
  const contactModal = document.getElementById('contact-modal');
  const caseModal = document.getElementById('case-modal');

  document.getElementById('nav-cta-btn')?.addEventListener('click', openContactModal);
  document.getElementById('hero-primary-cta')?.addEventListener('click', openContactModal);
  document.getElementById('cta-banner-btn')?.addEventListener('click', openContactModal);

  document.getElementById('modal-close-btn')?.addEventListener('click', () => {
    contactModal?.classList.remove('active');
  });

  document.getElementById('case-modal-close')?.addEventListener('click', () => {
    caseModal?.classList.remove('active');
  });

  [contactModal, caseModal].forEach(m => {
    m?.addEventListener('click', (e) => {
      if (e.target === m) m.classList.remove('active');
    });
  });

  const leadForm = document.getElementById('lead-form');
  leadForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    contactModal?.classList.remove('active');
    showToast('Inquiry Received! Sent to bibin247agent@gmail.com — We will respond within 2 hours.');
    leadForm.reset();
  });

  attachModalTriggers();
}

function openContactModal() {
  const modal = document.getElementById('contact-modal');
  modal?.classList.add('active');
}

function attachModalTriggers() {
  document.querySelectorAll('.modal-open-trigger').forEach(btn => {
    btn.addEventListener('click', openContactModal);
  });
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--accent-emerald); font-weight: 700;">✓</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}
