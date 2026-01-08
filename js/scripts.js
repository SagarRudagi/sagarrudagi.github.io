// Externalized interactive functions so inline onclick handlers keep working
window.openTab = function(th){
  if(!th || !th.name) return;
  window.open(th.name, '_blank');
}

window.expandFunction = function(varB,varI,varD){
  var text = document.getElementById(varB);
  var block = document.getElementById(varI);
  var detail = document.getElementById(varD);
  if(!text || !block || !detail) return;
  if(text.innerHTML.trim() === "Expand"){
    block.style.width = '';
    block.style.height = '';
    text.textContent = "Collapse";
    detail.style.display = 'block';
    block.style.transition = "all 0.4s";
  } else {
    detail.style.display = 'none';
    block.style.width = '';
    block.style.height = '';
    text.textContent = "Expand";
    block.style.transition = "all 0.4s";
  }
}

window.expandEduFunction = function(varB,varI,varD){
  window.expandFunction(varB,varI,varD);
}

window.expandProjectFunction = function(varB,varI,varD){
  window.expandFunction(varB,varI,varD);
}

window.expandCertFunction = function(varB,varI,varD){
  window.expandFunction(varB,varI,varD);
}

window.openEduTab = function(th){
  if(!th || !th.name) return;
  window.open(th.name, '_blank');
}

// enhance keyboard accessibility: toggle expand/collapse with Enter key on focused buttons
document.addEventListener('keydown', function(e){
  if(e.key !== 'Enter') return;
  var el = document.activeElement;
  if(el && el.classList && el.classList.contains('expand')){
    el.click();
  }
});
