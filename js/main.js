document.addEventListener('click', function(e){
  // open resume links
  var t = e.target;
  if(t.matches('[data-resume]') || (t.closest && t.closest('[data-resume]'))){
    var el = t.closest('[data-resume]') || t;
    var href = el.getAttribute('data-resume');
    window.open(href,'_blank');
  }
  // open project modal
  if(t.matches('[data-project]')){
    var id = t.getAttribute('data-project');
    var modal = document.getElementById('modal-'+id);
    if(modal) modal.classList.remove('hidden');
    document.body.style.overflow='hidden';
  }
  if(t.matches('.modal') || t.matches('.close-btn')){
    var modal = t.closest('.modal') || t;
    if(modal && modal.classList) modal.classList.add('hidden');
    document.body.style.overflow='';
  }
});

// keyboard close
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    document.querySelectorAll('.modal').forEach(m=>m.classList.add('hidden'));
    document.body.style.overflow='';
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
