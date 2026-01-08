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


