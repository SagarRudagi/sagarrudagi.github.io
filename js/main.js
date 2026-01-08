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

