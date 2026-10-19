/* Les Chasseurs de Brume-Haute — options communes aux jeux Keismey Studio (chargé après game.fr.js / game.en.js).
   Remplace la fenêtre « Son » : musique, effets, vibrations ; au village, en plus : langue, notes, sauvegarde,
   signaler un bug, soutenir le studio, écran titre, recommencer à zéro. */
(function () {
  var EN = LANG === 'en';
  var L = function (fr, en) { return EN ? en : fr; };
  if (AUD.cfg.vib === undefined) AUD.cfg.vib = true;
  window.openSound = function () {
    var c = AUD.cfg, now = AUD.cur ? AUD.names[AUD.cur] : null, vil = screen === 'village' && !H;
    modal('<h2>Options</h2>' +
      '<label class="srow"><span>' + L('Tout couper', 'Mute all') + '</span><input type="checkbox" id="snd-mute" ' + (c.mute ? 'checked' : '') + '></label>' +
      '<label class="srow"><span>' + L('Musique', 'Music') + '</span><input type="range" id="snd-music" min="0" max="1" step="0.05" value="' + c.music + '"></label>' +
      '<label class="srow"><span>' + L('Bruitages', 'Sound effects') + '</span><input type="range" id="snd-sfx" min="0" max="1" step="0.05" value="' + c.sfx + '"></label>' +
      '<label class="srow"><span>' + L('Vibrations', 'Vibration') + '</span><input type="checkbox" id="opt-vib" ' + (c.vib !== false ? 'checked' : '') + '></label>' +
      '<p class="small muted">' + (now ? L('En cours : ', 'Now playing: ') + now + '.' : L('La musique démarre au premier toucher.', 'Music starts on first tap.')) + '</p>' +
      (vil ? '<div class="optl">' +
        '<button class="btn ghost wide" data-a="lang" data-v="' + (EN ? 'fr' : 'en') + '">' + (EN ? 'Jouer en français' : 'Play in English') + '</button>' +
        '<button class="btn ghost wide" data-a="patches">' + L('Notes de mise à jour', 'Patch notes') + '</button>' +
        '<button class="btn ghost wide" data-a="saveexp">' + L('Sauvegarde : exporter', 'Save: export') + '</button>' +
        '<button class="btn ghost wide" data-a="saveimp">' + L('Sauvegarde : importer', 'Save: import') + '</button>' +
        '<button class="btn ghost wide" id="opt-bug">' + L('Signaler un bug', 'Report a bug') + '</button>' +
        '<button class="btn ghost wide" id="opt-sup">' + L('Soutenir le studio', 'Support the studio') + '</button>' +
        '<button class="btn ghost wide" id="opt-title">' + L('Écran titre', 'Title screen') + '</button>' +
        '<button class="btn ghost wide" data-a="reset">' + L('Recommencer à zéro', 'Start over') + '</button></div>' : '') +
      '<button class="btn main wide" data-a="close">' + L('Fermer', 'Close') + '</button>' +
      '<p class="small muted" style="text-align:center;margin-top:10px">v' + PATCHES[0].v + ' · Keismey Studio</p>');
    var q = function (id) { return document.getElementById(id); };
    q('opt-vib').onchange = function () { AUD.cfg.vib = this.checked; audSave(); if (this.checked) try { navigator.vibrate && navigator.vibrate(30); } catch (e) {} };
    if (vil) {
      q('opt-bug').onclick = function () { KS.bug(EN ? 'The Hunters of Brume-Haute' : 'Les Chasseurs de Brume-Haute', LANG); };
      q('opt-sup').onclick = function () { KS.support(); };
      q('opt-title').onclick = function () { closeModal(); if (window.BH_titleAgain) window.BH_titleAgain(); };
    }
  };
})();
