/* Les Chasseurs de Brume-Haute — bouton retour du téléphone (voir ks-back.js).
   Chargé après game.fr.js / game.en.js, dont il utilise screen, go, modal, closeModal, H et SPLASH.
   fenêtre ouverte → fermée ; écran avec un bouton « ‹ … » → ce bouton ; chasse → « Abandonner » ;
   bilan → village ; village → écran titre (confirmé) ; écran titre → hub (confirmé). */
(function () {
  var EN = window.BH_LANG === 'en';
  var TX = EN
    ? { tq: 'Back to the title screen?', tp: 'Your progress is saved.', ty: 'Title screen', hq: 'Leave the game?', hp: 'Your progress is saved. You will find the other Keismey Studio games on the hub.', hy: 'Go to the hub', no: 'Cancel' }
    : { tq: 'Retour à l’écran titre ?', tp: 'Ta progression est enregistrée.', ty: 'Écran titre', hq: 'Quitter le jeu ?', hp: 'Ta progression est enregistrée. Tu retrouveras les autres jeux de Keismey Studio sur le hub.', hy: 'Aller au hub', no: 'Annuler' };
  var sp = document.getElementById('splash');
  var SPL0 = sp ? sp.cloneNode(true) : null;   // copie de l'écran titre, pour y revenir

  function ask(q, p, y, fn, above) {
    modal('<h2>' + q + '</h2><p class="small">' + p + '</p><div style="display:flex;flex-direction:column;gap:8px;margin-top:12px"><button class="btn wide" id="kbY">' + y + '</button><button class="btn ghost wide" data-a="close">' + TX.no + '</button></div>');
    var bd = document.querySelector('#modal .backdrop');
    if (above && bd) bd.style.zIndex = 10000;
    document.getElementById('kbY').onclick = function (e) { e.stopPropagation(); closeModal(); fn(); };
  }

  function titleAgain() {
    if (!SPL0 || document.getElementById('splash')) return;
    var el = SPL0.cloneNode(true), a = el.querySelector('.sp1'), b = el.querySelector('.sp2');
    if (a) a.remove();
    el.hidden = false; el.classList.remove('out');
    document.body.appendChild(el);
    SPLASH = true;
    requestAnimationFrame(function () { if (b) b.classList.add('on'); });
    el.addEventListener('click', function (ev) {
      ev.stopPropagation(); ev.preventDefault();
      if (el.classList.contains('out')) return;
      el.classList.add('out');
      setTimeout(function () { el.remove(); SPLASH = false; }, 520);
    });
  }

  function back() {
    var m = document.querySelector('#modal .backdrop');
    var spl = document.getElementById('splash');
    if (m) { m.click(); return; }                                   // comme toucher à côté de la fenêtre
    if (SPLASH && spl && !spl.classList.contains('out')) {
      if (spl.querySelector('.sp1') && !spl.querySelector('.sp2.on')) return;   // logo du studio
      ask(TX.hq, TX.hp, TX.hy, function () { KSBack.toHub(); }, true);
      return;
    }
    if (screen === 'hunt') { var ab = document.querySelector('#app [data-a="abandon"]'); if (ab) ab.click(); return; }
    var bk = document.querySelector('#app .back [data-a="go"]');
    if (bk) { bk.click(); return; }
    if (screen === 'result') { go('village'); return; }
    if (screen !== 'village') { go('village'); return; }
    ask(TX.tq, TX.tp, TX.ty, titleAgain);
  }
  window.BH_titleAgain = titleAgain;
  function onTitle() {
    var spl = document.getElementById('splash');
    return !!(SPLASH && spl && !spl.classList.contains('out') && !(spl.querySelector('.sp1') && !spl.querySelector('.sp2.on')) &&
      !document.querySelector('#modal .backdrop'));
  }
  KSBack.init({ back: back, lang: function () { return EN ? 'en' : 'fr'; }, title: onTitle });
})();
