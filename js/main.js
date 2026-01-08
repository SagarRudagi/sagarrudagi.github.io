// Focus trap utility for modals
function createFocusTrap(element) {
  const focusableEls = element.querySelectorAll('button, [href], input, [tabindex]');
  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];
  return { firstEl, lastEl };
}

function focusTrap(e, { firstEl, lastEl }) {
  if (e.key !== 'Tab') return;
  if (e.shiftKey) {
    if (document.activeElement === firstEl) {
      lastEl.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastEl) {
      firstEl.focus();
      e.preventDefault();
    }
  }
}

let currentModal = null;
let trapHandler = null;

document.addEventListener('click', function(e){
  // open resume links
  var t = e.target;
  if(t.matches('[data-resume]') || (t.closest && t.closest('[data-resume]'))){
    var el = t.closest('[data-resume]') || t;
    var href = el.getAttribute('data-resume');
    if(href) window.open(href,'_blank');
    e.preventDefault();
  }
});

// smooth scroll for nav
document.querySelectorAll('.site-nav a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    e.preventDefault();
    var t = document.querySelector(this.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
  })
});

// keyboard close modal
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && currentModal){
    closeModal(currentModal);
  }
});

function closeModal(modal) {
  if(!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow='';
  currentModal = null;
  if(trapHandler) document.removeEventListener('keydown', trapHandler);
}

// delegated modal click handler
document.addEventListener('click', function(e){
  var closeBtn = e.target.closest('.close-btn');
  if(closeBtn) {
    var modal = closeBtn.closest('.modal');
    if(modal) closeModal(modal);
    return;
  }
  
  // close if click on modal backdrop (not content)
  if(e.target.classList && e.target.classList.contains('modal')) {
    closeModal(e.target);
  }
});

// Project card click handlers
function openProjectModal(projectCard) {
  const modal = document.getElementById('projectModal');
  const title = projectCard.getAttribute('data-title');
  const description = projectCard.getAttribute('data-description');
  const tech = projectCard.getAttribute('data-tech');
  const links = JSON.parse(projectCard.getAttribute('data-links') || '[]');
  
  // Populate modal
  document.getElementById('projectModalTitle').textContent = title;
  document.querySelector('.project-modal-content .full-description').textContent = description;
  
  // Populate tech stack
  const techTagsContainer = document.getElementById('modalTechTags');
  techTagsContainer.innerHTML = '';
  tech.split(',').forEach(t => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.textContent = t.trim();
    techTagsContainer.appendChild(tag);
  });
  
  // Populate links
  const linksContainer = document.getElementById('modalLinks');
  linksContainer.innerHTML = '';
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = link.text;
    linksContainer.appendChild(a);
  });
  
  // Show modal
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  currentModal = modal;
  
  // Set up close button focus
  const closeBtn = modal.querySelector('.project-modal-close');
  if(closeBtn) closeBtn.focus();
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentModal = null;
}

// Add click listeners to all project cards
document.querySelectorAll('.card.project').forEach(card => {
  card.addEventListener('click', function(e) {
    // Don't open modal if clicking on a link inside the card
    if(e.target.tagName === 'A' || e.target.closest('a')) return;
    openProjectModal(this);
  });
  // Make keyboard accessible
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', function(e) {
    if(e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(this);
    }
  });
});

// Close project modal on backdrop click
const projectModal = document.getElementById('projectModal');
if(projectModal) {
  projectModal.addEventListener('click', function(e) {
    if(e.target === this) closeProjectModal();
  });
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if(e.key === 'Escape' && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

// Certificate card click handlers
document.querySelectorAll('#certificates .card').forEach(card => {
  const link = card.querySelector('a');
  if(link) {
    const pdfUrl = link.getAttribute('href');
    card.addEventListener('click', function(e) {
      // Only open expanded view if not clicking the link itself
      if(e.target === link) return;
      expandCertificate(this, pdfUrl);
    });
    // Make keyboard accessible
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        expandCertificate(this, pdfUrl);
      }
    });
  }
});

function expandCertificate(certCard, pdfUrl) {
  // Create expanded overlay
  const overlay = document.createElement('div');
  overlay.className = 'cert-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:102;padding:20px;';
  
  const container = document.createElement('div');
  container.style.cssText = 'width:100%;max-width:900px;max-height:90vh;background:var(--panel);border-radius:16px;border:1px solid rgba(0,255,136,0.15);overflow:hidden;display:flex;flex-direction:column;';
  
  const header = document.createElement('div');
  header.style.cssText = 'padding:20px;border-bottom:1px solid rgba(0,255,136,0.1);display:flex;justify-content:space-between;align-items:center;';
  header.innerHTML = '<h2 style="margin:0;color:#00FF88">' + certCard.querySelector('h3').textContent + '</h2>';
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.style.cssText = 'background:transparent;border:0;color:var(--muted);font-size:2rem;cursor:pointer;padding:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all 0.2s ease;';
  closeBtn.onmouseover = () => closeBtn.style.cssText += 'color:#00FF88;background:rgba(0,255,136,0.1);';
  closeBtn.onmouseout = () => closeBtn.style.cssText = 'background:transparent;border:0;color:var(--muted);font-size:2rem;cursor:pointer;padding:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:8px;transition:all 0.2s ease;';
  closeBtn.onclick = () => closeCertificateOverlay();
  header.appendChild(closeBtn);
  
  const pdfViewer = document.createElement('div');
  pdfViewer.style.cssText = 'flex:1;display:flex;align-items:center;justify-content:center;padding:20px;overflow:hidden;';
  
  const iframe = document.createElement('iframe');
  iframe.src = pdfUrl + '#view=FitH';
  iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:8px;';
  pdfViewer.appendChild(iframe);
  
  container.appendChild(header);
  container.appendChild(pdfViewer);
  overlay.appendChild(container);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  
  // Close on backdrop click
  overlay.addEventListener('click', function(e) {
    if(e.target === this) closeCertificateOverlay();
  });
  
  // Close on ESC
  const escHandler = (e) => {
    if(e.key === 'Escape') {
      closeCertificateOverlay();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
  
  // Store reference for cleanup
  window.certOverlayCloseHandler = () => {
    if(overlay.parentNode) {
      overlay.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', escHandler);
    }
  };
}

function closeCertificateOverlay() {
  if(window.certOverlayCloseHandler) {
    window.certOverlayCloseHandler();
  }
}


