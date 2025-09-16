
/* TW Audio Preview — namespaced controls */
(function(){
  /* === Editable titles (change these to match your tracks) === */
var TRACK_TITLES = [
  "Space Traveller - Trench Paradise",
  "Space Traveller - Subspace Continuum Anthem",
  "Space Traveller - Trench Boogie",
  "Space Traveller - Trench Powder",
  "Space Traveller - Trench Babylon",
  "Space Traveller - Tanzu's Old Days",
  "Space Traveller - Best's Dubai Tour",
  "Space Traveller - Zapatadinho",
  "Space Traveller - Keith's Space Pills",
  "Space Traveller - Trench Wars Burning!",
  "Trench Rap Wars - Ease's Thundered To Blocknite",
  "Trench Rap Wars - Vys's Netban Diss"
];
/* If you rename/replace files to mp3/ogg, update here: */
var TRACK_FILES = [
  "assets/audio/Space Traveller - Trench Paradise.mp3",
  "assets/audio/Space Traveller - Subspace Continuum Anthem.mp3",
  "assets/audio/Space Traveller - Trench Boogie.mp3",
  "assets/audio/Space Traveller - Trench Powder.mp3",
  "assets/audio/Space Traveller - Trench Babylon.mp3",
  "assets/audio/Space Traveller - Tanzu's Old Days.mp3",
  "assets/audio/Space Traveller - Best's Dubai Tour.mp3",
  "assets/audio/Space Traveller - Zapatadinho.mp3",
  "assets/audio/Space Traveller - Keith's Space Pills.mp3",
  "assets/audio/Space Traveller - Trench Wars Burning!.mp3",
  "assets/audio/Trench Rap Wars - Ease's Thundered To Blocknite.mp3",
  "assets/audio/Trench Rap Wars - Vys's Netban Diss.mp3"
];

/* Build track objects from the arrays above */
var tracks = TRACK_FILES.map(function(file, idx){ 
  return { title: (TRACK_TITLES[idx] || ('Track ' + (idx+1))), file: file }; 
});
  var cur = 0, playing = false;
  var root = document.documentElement;
  var bar = document.querySelector('.tw-audio-bar');
  if(!bar){ return; }

  // Compute header + audio heights to help scroll offset (without touching base.js)
  function computeOffsets(){
    var header = document.querySelector('header');
    var hh = header ? Math.round(header.getBoundingClientRect().height) : 56;
    root.style.setProperty('--twHeaderH', hh + 'px');
    var ah = bar ? Math.round(bar.getBoundingClientRect().height) : 0;
    root.style.setProperty('--twAudioH', ah + 'px');
  }
  computeOffsets();
  window.addEventListener('resize', computeOffsets);
  window.addEventListener('load', computeOffsets);

  // Wiring
  var btnPrev = bar.querySelector('[data-action="prev"]');
  var btnPlay = bar.querySelector('[data-action="play"]');
  var btnStop = bar.querySelector('[data-action="stop"]');
  var btnNext = bar.querySelector('[data-action="next"]');
  var btnList = bar.querySelector('[data-action="list"]');
  var ticker = bar.querySelector('.tw-audio-ticker');
  var listWrap = bar.querySelector('.tw-audio-list');
  var audio = new Audio();
  audio.preload = 'metadata';
  audio.playsInline = true;

  function setTicker(text){
    ticker.textContent = text || '';
    // reset animation
    ticker.style.animation = 'none';
    // force reflow
    void ticker.offsetHeight;
    ticker.style.animation = '';
  }

  function load(i){
    cur = (i + tracks.length) % tracks.length;
    audio.src = tracks[cur].file;
    setTicker('Now Playing — ' + tracks[cur].title);
    // Update active class in list
    var btns = bar.querySelectorAll('.tw-audio-track');
    btns.forEach(function(b, idx){ b.classList.toggle('active', idx===cur); });
  }

  function play(){ load(cur); audio.play().then(function(){
      playing = true;
      btnPlay.setAttribute('aria-pressed','true');
      btnPlay.innerHTML = 'Pause';
    }).catch(function(){ setTicker('Tap Play again if blocked'); });
  }

  function pause(){
    audio.pause();
    playing = false;
    btnPlay.setAttribute('aria-pressed','false');
    btnPlay.innerHTML = 'Play Me!';
  }

  function stop(){
    audio.pause();
    audio.currentTime = 0;
    setTicker('Ready — Press "Play Me!"');
    playing = false;
    btnPlay.setAttribute('aria-pressed','false');
    btnPlay.innerHTML = 'Play Me!';
  }

  btnPrev.addEventListener('click', function(e){ e.preventDefault();  load(cur-1); if(playing) play(); });
  btnNext.addEventListener('click', function(e){ e.preventDefault();  load(cur+1); if(playing) play(); });
  btnPlay.addEventListener('click', function(e){ e.preventDefault();  if(playing) pause(); else play(); });
  btnStop.addEventListener('click', function(e){ e.preventDefault();  stop(); });
  var listTimer=null;
function scheduleListAutoClose(){
  if(listTimer) clearTimeout(listTimer);
  listTimer = setTimeout(function(){ listWrap.classList.remove('open'); }, 10000);
}
btnList.addEventListener('click', function(e){ e.preventDefault();
  listWrap.classList.toggle('open');
  if(listWrap.classList.contains('open')){
    try{ var p = listWrap.querySelector('.panel'); if(p){ p.scrollTop = 0; } }catch(err){}
    scheduleListAutoClose();
  }
});
// Reset the auto-close timer on interaction inside the panel
listWrap.addEventListener('mousemove', function(){ if(listWrap.classList.contains('open')) scheduleListAutoClose(); });
listWrap.addEventListener('click', function(){ if(listWrap.classList.contains('open')) scheduleListAutoClose(); });

  audio.addEventListener('ended', function(){ load(cur+1); play(); });

  // Build tracklist buttons (6 tracks, 2 columns, 3 rows)
  var cols = [bar.querySelector('.tw-col-1'), bar.querySelector('.tw-col-2')];
  var isMobile = window.matchMedia('(max-width: 900px)').matches;
  tracks.forEach(function(t, i){
    var b = document.createElement('button');
    b.className = 'tw-audio-track';
    b.type = 'button';
    b.textContent = t.title;
    b.dataset.idx = i;
    b.addEventListener('click', function(){
      load(parseInt(this.dataset.idx,10));
      play();
    });
    (isMobile ? cols[0] : cols[i%2]).appendChild(b);
  });

  // Initial state
  load(0);
  setTicker('Ready — Press "Play Me!"');
})();



// === Desktop Tracklist Positioning Helper ===
;(function(){
  function isDesktop(){ return window.innerWidth > 900; }
  function elems(){
    var bar = document.querySelector('.tw-audio-bar');
    if(!bar) return {};
    return { 
      bar: bar,
      wrap: bar.querySelector('.wrap'),
      list: bar.querySelector('.tw-audio-list'),
      panel: bar.querySelector('.tw-audio-list .panel'),
      btn: bar.querySelector('[data-action="list"]')
    };
  }
  function applyPosition(){
    var E = elems();
    if(!E.wrap || !E.list || !E.panel || !E.btn) return;
    if(!isDesktop()){
      // reset on mobile
      E.list.style.left=''; E.list.style.right=''; E.list.style.top=''; E.list.style.position='';
      E.panel.style.left=''; E.panel.style.right=''; 
      return;
    }
    // Container anchored to the wrap; panel offset equals button x within wrap
    E.wrap.style.position = 'relative';
    E.list.style.position = 'absolute';
    E.list.style.left = '0px';
    E.list.style.right = 'auto';
    E.list.style.top = (E.wrap.offsetHeight + 6) + 'px';
    var wRect = E.wrap.getBoundingClientRect();
    var bRect = E.btn.getBoundingClientRect();
    var panelW = Math.min(420, Math.floor(window.innerWidth * 0.9));
    var left = Math.round(bRect.left - wRect.left);
    var overflow = left + panelW - wRect.width;
    if (overflow > 0) left = Math.max(0, left - overflow - 8);
    E.panel.style.position = 'relative';
    E.panel.style.left = left + 'px';
  }
  function watchOpen(){
    var E = elems();
    if(!E.list) return;
    var obs = new MutationObserver(function(muts){
      for (var i=0;i<muts.length;i++){
        if(muts[i].attributeName === 'class' && E.list.classList.contains('open')){ 
          applyPosition();
          try{ var p = E.panel; if(p){ p.scrollTop = 0; } }catch(err){}
          break; 
        }
      }
    });
    obs.observe(E.list, { attributes:true });
  }
  window.addEventListener('resize', function(){ if(isDesktop()) applyPosition(); });
  window.addEventListener('load', function(){ applyPosition(); watchOpen(); });
  document.addEventListener('click', function(e){
    var t = e.target && e.target.closest ? e.target.closest('[data-action="list"]') : null;
    if(t) setTimeout(applyPosition, 0);
  }, true);
})();

