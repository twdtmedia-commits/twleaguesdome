// BAKED: Forced Contained Mobile Scaler (wins regardless of prior scripts)
(function(){
  var mq = window.matchMedia('(max-width: 900px)');
  function scaleIt(){
    var root = document.getElementById('sprackle-embed');
    if(!root) return;
    root.classList.add('spr-contained'); // ensures CSS targets this block
    if(!mq.matches) return; // desktop unchanged
    var cont = root.querySelector('.sprackle-scale');
    var wrap = root.querySelector('.spr-wrap');
    if(!cont || !wrap) return;
    var W = 1440, H = 2200;
    var vw = Math.max(320, cont.clientWidth);
    var css = getComputedStyle(document.documentElement);
    var hh = parseInt(css.getPropertyValue('--twHeaderH')) || 56;
    var ah = parseInt(css.getPropertyValue('--twAudioH')) || 48;
    var vh = window.innerHeight - (hh + ah);
    if(vh < 200) vh = cont.clientHeight || 200;
    var s = Math.min(vw / W, vh / H);
    wrap.style.transformOrigin = '0 0';
    wrap.style.transform = 'scale(' + s + ')';
    cont.style.height = vh + 'px';
  }
  ['resize','orientationchange'].forEach(function(ev){ addEventListener(ev, scaleIt, {passive:true}); });
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', scaleIt); } else { scaleIt(); }
  addEventListener('load', function(){ setTimeout(scaleIt, 100); setTimeout(scaleIt, 400); });
})();

/* ===== Mobile Menu Variant A Controller (baked 2025-09-16) ===== */
(function(){
  function openCloseSetup(){
    var root = document.documentElement;
    var btn = document.querySelector('.j-variant-A.j-ham-btn');
    var menu = document.querySelector('.j-variant-A.j-menu');
    var backdrop = document.querySelector('.j-variant-A.j-backdrop');
    var closeBtn = menu ? menu.querySelector('.j-close') : null;
    function open(){ root.classList.add('j-open'); if(btn) btn.setAttribute('aria-expanded','true'); if(menu) menu.setAttribute('aria-hidden','false'); if(backdrop) backdrop.setAttribute('aria-hidden','false'); }
    function close(){ root.classList.remove('j-open'); if(btn) btn.setAttribute('aria-expanded','false'); if(menu) menu.setAttribute('aria-hidden','true'); if(backdrop) backdrop.setAttribute('aria-hidden','true'); }
    btn && btn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    backdrop && backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', openCloseSetup); }
  else { openCloseSetup(); }
})();