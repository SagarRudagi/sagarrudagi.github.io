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
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;z-index:102;padding:16px;';
  
  const container = document.createElement('div');
  container.style.cssText = 'width:100%;height:100%;max-width:1000px;background:#fff;border-radius:16px;border:1px solid rgba(0,255,136,0.15);overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,255,136,0.25);position:relative;';
  
  const header = document.createElement('div');
  header.style.cssText = 'padding:12px 16px;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;background:#fff;z-index:10;';
  
  const titleDiv = document.createElement('div');
  titleDiv.style.cssText = 'display:flex;gap:12px;align-items:center;flex:1;';
  titleDiv.innerHTML = '<h2 style="margin:0;color:#111;font-size:1.2rem;overflow:hidden;text-overflow:ellipsis;"></h2>';
  titleDiv.querySelector('h2').textContent = certCard.querySelector('h3').textContent;
  header.appendChild(titleDiv);
  
  const btnContainer = document.createElement('div');
  btnContainer.style.cssText = 'display:flex;gap:8px;flex-shrink:0;';
  
  const downloadBtn = document.createElement('a');
  downloadBtn.href = pdfUrl;
  downloadBtn.download = certCard.querySelector('h3').textContent + '.pdf';
  downloadBtn.innerHTML = '⬇';
  downloadBtn.title = 'Download certificate';
  downloadBtn.style.cssText = 'background:rgba(0,255,136,0.1);border:1px solid rgba(0,255,136,0.3);color:#00FF88;padding:8px 10px;border-radius:6px;text-decoration:none;font-weight:500;cursor:pointer;transition:all 0.2s ease;font-size:1rem;display:flex;align-items:center;justify-content:center;';
  downloadBtn.onmouseover = () => { downloadBtn.style.background = 'rgba(0,255,136,0.2)'; downloadBtn.style.borderColor = 'rgba(0,255,136,0.6)'; };
  downloadBtn.onmouseout = () => { downloadBtn.style.background = 'rgba(0,255,136,0.1)'; downloadBtn.style.borderColor = 'rgba(0,255,136,0.3)'; };
  btnContainer.appendChild(downloadBtn);
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Close (ESC)';
  closeBtn.style.cssText = 'background:transparent;border:0;color:#666;font-size:1.6rem;cursor:pointer;padding:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;transition:all 0.2s ease;';
  closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(0,0,0,0.1)'; closeBtn.style.color = '#000'; };
  closeBtn.onmouseout = () => { closeBtn.style.background = 'transparent'; closeBtn.style.color = '#666'; };
  closeBtn.onclick = () => closeCertificateOverlay();
  btnContainer.appendChild(closeBtn);
  header.appendChild(btnContainer);
  
  const pdfContainer = document.createElement('div');
  pdfContainer.style.cssText = 'flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;background:#f9f9f9;';
  
  const iframe = document.createElement('iframe');
  iframe.src = pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=FitH';
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  iframe.sandbox.add('allow-same-origin');
  pdfContainer.appendChild(iframe);
  
  container.appendChild(header);
  container.appendChild(pdfContainer);
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


