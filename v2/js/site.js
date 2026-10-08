

(function(){
  var WHATSAPP = '';                       // numéro de la réception, format international sans "+"
  var EMAIL = 'contact@hotel-allety.fr';
  var lang = 'fr';
  var NUL = { addEventListener:function(){}, classList:{ add:function(){}, remove:function(){}, toggle:function(){}, contains:function(){ return false; } }, setAttribute:function(){}, removeAttribute:function(){}, focus:function(){}, style:{}, dataset:{}, options:[], value:'' };
  var $ = function(s, r){ return (r || document).querySelector(s) || NUL; };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = function(fr, en){ return lang === 'fr' ? fr : en; };
  var src = function(n){ return 'img/' + n + '.jpg'; };

  var CH = {"double":{"prix":115,"cap":2,"surf":"10 m²","fr":"Double Confort","en":"Comfort Double","lit":["1 grand lit double","1 double bed"],"txt":["Notre chambre à deux, avec son grand lit et sa porte‑fenêtre ouverte sur la lumière de Paris. Compacte et bien pensée, elle a tout ce qu'il faut pour un séjour en couple ou un déplacement professionnel.","Our room for two, with a large double bed and a French window that lets in the Paris light. Compact and well thought out, it has everything you need for a couple's getaway or a business trip."],"imgs":["ch-double","ch-gris","bain"]},"eco":{"prix":129,"cap":3,"surf":"18 m²","fr":"Triple Économique","en":"Economy Triple","lit":["1 lit double + 1 lit simple","1 double + 1 single bed"],"txt":["Le plus d'espace pour le prix. Avec ses 18 m² et ses trois couchages, c'est la chambre préférée des amis en week‑end et des petites familles.","The most space for the price. With 18 m² and three beds, it is the favourite of friends on a weekend away and small families."],"imgs":["ch-eco","ch-rouge","douche"]},"triple":{"prix":139,"cap":3,"surf":"12 m²","fr":"Triple","en":"Triple","lit":["3 lits simples, ou 1 double + 1 simple","3 single beds, or 1 double + 1 single"],"txt":["Des lits à la carte : trois lits simples entre collègues, ou un lit double et un lit simple en famille. Dites‑nous votre préférence à la réservation.","Beds arranged as you wish: three singles for colleagues, or a double and a single for a family. Tell us your preference when you book."],"imgs":["ch-triple","q3","bain"]},"quad":{"prix":165,"cap":4,"surf":"","fr":"Quadruple avec balcon","en":"Quadruple with balcony","lit":["1 lit double + 2 lits simples","1 double + 2 single beds"],"txt":["Notre plus grande chambre, avec ses hautes fenêtres et son balcon sur le boulevard. Toute la famille sous le même toit, et Paris à vos pieds.","Our largest room, with tall windows and a balcony over the boulevard. The whole family under one roof, with Paris at your feet."],"imgs":["ch-quad","q2","vue"]}};
  var ORDRE = ['double','eco','triple','quad'];
  var CODES = { PARIS3:{ taux:.10, nuits:3, fr:'Long séjour : −10 % dès 3 nuits', en:'Long stay: 10% off from 3 nights' },
                BONJOUR:{ taux:.05, nuits:2, cadeau:true, fr:'Premier petit‑déjeuner offert (dès 2 nuits), en plus des −5 %', en:'First breakfast free (from 2 nights), on top of the 5% off' } };

  /* Chargement */
  window.addEventListener('load', function(){ setTimeout(function(){ $('#charge').classList.add('fini'); }, 250); });
  setTimeout(function(){ $('#charge').classList.add('fini'); }, 3500);

  /* En-tête, progression, boutons flottants */
  var haut = $('#haut'), collante = $('#collante'), remonter = $('#remonter'), progres = $('#progres');
  var paras = $$('[data-para]');
  function defile(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    haut.classList.toggle('colle', y > 60);
    collante.classList.toggle('vue', y > innerHeight * .9 && y < h - 500);
    remonter.classList.toggle('vue', y > innerHeight);
    progres.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    paras.forEach(function(p){ var r = p.parentElement.getBoundingClientRect(); if(r.bottom > 0 && r.top < innerHeight){ p.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -0.07).toFixed(1) + 'px)'; } });
  }
  var attente = false;
  window.addEventListener('scroll', function(){ if(!attente){ attente = true; requestAnimationFrame(function(){ defile(); attente = false; }); } }, {passive:true});
  defile();
  remonter.addEventListener('click', function(){ scrollTo({top:0, behavior:'smooth'}); });

  /* Menu plein écran */
  var voile = $('#voile');
  function menu(o){ voile.classList.toggle('ouvert', o); voile.setAttribute('aria-hidden', !o); document.body.classList.toggle('fige', o); }
  $('#burger').addEventListener('click', function(){ menu(true); });
  $$('[data-ferme-menu], #voile nav a').forEach(function(e){ e.addEventListener('click', function(){ menu(false); }); });

  /* Diaporama */
  var diapos = $$('.diapo'), pts = $$('#pts button'), cur = 0, minuterie;
  function va(n){ diapos[cur].classList.remove('actif'); pts[cur].classList.remove('actif'); cur = (n + diapos.length) % diapos.length; diapos[cur].classList.add('actif'); pts[cur].classList.add('actif'); $('#compte').textContent = '0' + (cur + 1); }
  function auto(){ clearInterval(minuterie); if(diapos.length > 1 && !matchMedia('(prefers-reduced-motion:reduce)').matches) minuterie = setInterval(function(){ va(cur + 1); }, 6500); }
  pts.forEach(function(b, i){ b.addEventListener('click', function(){ va(i); auto(); }); });
  auto();

  /* Apparitions et compteurs */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('vu'); io.unobserve(e.target);
      var c = e.target.querySelector('[data-compte]'); if(c) compte(c); } }); }, {threshold:.14, rootMargin:'0px 0px -6% 0px'});
    $$('.rv, .rideau').forEach(function(e){ io.observe(e); });
  } else { $$('.rv, .rideau').forEach(function(e){ e.classList.add('vu'); }); }
  function compte(el){ var fin = +el.dataset.compte, d = 1400, t0 = null;
    function pas(ts){ if(!t0) t0 = ts; var p = Math.min((ts - t0) / d, 1), v = Math.round(fin * (1 - Math.pow(1 - p, 3))); el.textContent = v.toLocaleString('fr-FR'); if(p < 1) requestAnimationFrame(pas); }
    requestAnimationFrame(pas); }

  /* Carrousel des chambres */
  var rail = $('#rail');
  function glisse(s){ var w = rail.querySelector('.piece').getBoundingClientRect().width + 26; rail.scrollBy({left:s * w, behavior:'smooth'}); }
  $('#rg').addEventListener('click', function(){ glisse(-1); }); $('#rd').addEventListener('click', function(){ glisse(1); });

  /* Avis */
  var tem = $$('.temoin'), ti = 0;
  function avis(n){ if(!tem.length) return; tem[ti].classList.remove('actif'); ti = (n + tem.length) % tem.length; tem[ti].classList.add('actif'); }
  $('#tg').addEventListener('click', function(){ avis(ti - 1); }); $('#td').addEventListener('click', function(){ avis(ti + 1); });
  setInterval(function(){ if(!matchMedia('(prefers-reduced-motion:reduce)').matches && !document.hidden) avis(ti + 1); }, 8000);

  /* Onglets du quartier */
  $$('[data-onglet]').forEach(function(b){ b.addEventListener('click', function(){
    $$('[data-onglet]').forEach(function(x){ x.classList.toggle('actif', x === b); });
    $$('[data-panneau]').forEach(function(p){ p.hidden = p.dataset.panneau !== b.dataset.onglet; });
  }); });

  /* Galerie */
  var vues = $$('#mur button'), visibles = vues.slice(), vi = 0, visio = $('#visio');
  $$('#filtres button').forEach(function(b){ b.addEventListener('click', function(){
    $$('#filtres button').forEach(function(x){ x.classList.toggle('actif', x === b); });
    visibles = vues.filter(function(v){ var ok = b.dataset.f === 'tout' || v.dataset.c === b.dataset.f; v.hidden = !ok; return ok; });
  }); });
  function montre(i){ vi = (i + visibles.length) % visibles.length; var b = visibles[vi]; $('#v-img').src = b.querySelector('img').src; $('#v-leg').textContent = b.querySelector('span').textContent + '  ·  ' + (vi + 1) + ' / ' + visibles.length; }
  vues.forEach(function(b){ b.addEventListener('click', function(){ montre(visibles.indexOf(b)); visio.classList.add('ouvert'); document.body.classList.add('fige'); }); });
  function fermeVisio(){ visio.classList.remove('ouvert'); document.body.classList.remove('fige'); }
  $('#v-ferme').addEventListener('click', fermeVisio); $('#v-pr').addEventListener('click', function(){ montre(vi - 1); }); $('#v-sv').addEventListener('click', function(){ montre(vi + 1); });
  visio.addEventListener('click', function(e){ if(e.target === visio) fermeVisio(); });

  /* Fenêtre générique */
  var fen = $('#fenetre'), boite = $('#boite');
  function ouvre(html, etroite){ boite.className = 'boite' + (etroite ? ' etroite' : ''); boite.innerHTML = '<button class="fermer" type="button" data-ferme aria-label="Fermer">✕</button>' + html; boite.scrollTop = 0; fen.classList.add('ouvert'); document.body.classList.add('fige'); }
  function ferme(){ fen.classList.remove('ouvert'); document.body.classList.remove('fige'); }
  fen.addEventListener('click', function(e){ if(e.target === fen || e.target.closest('[data-ferme]')) ferme(); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ ferme(); fermeVisio(); menu(false); }
    if(visio.classList.contains('ouvert')){ if(e.key === 'ArrowLeft') montre(vi - 1); if(e.key === 'ArrowRight') montre(vi + 1); }
  });

  /* Dates */
  var arr = $('#arr'), dep = $('#dep'), ad = $('#ad'), en = $('#en'), code = $('#code');
  function iso(d){ return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  var j = new Date(), j1 = new Date(j), j3 = new Date(j); j1.setDate(j.getDate() + 1); j3.setDate(j.getDate() + 3);
  arr.min = iso(j); arr.value = iso(j1); dep.min = iso(j1); dep.value = iso(j3);
  arr.addEventListener('change', function(){ if(!arr.value) return; var a = new Date(arr.value); a.setDate(a.getDate() + 1); dep.min = iso(a); if(!dep.value || dep.value <= arr.value) dep.value = iso(a); });
  function fmt(v){ return new Date(v + 'T12:00:00').toLocaleDateString(t('fr-FR','en-GB'), {weekday:'short', day:'numeric', month:'long'}); }
  function eur(n){ return n.toLocaleString(t('fr-FR','en-GB'), {minimumFractionDigits:n % 1 ? 2 : 0, maximumFractionDigits:2}) + ' €'; }
  function nuits(){ return Math.round((new Date(dep.value) - new Date(arr.value)) / 86400000); }
  function gens(){ return (+ad.value) + (+en.value); }

  /* Réservation en 3 étapes */
  function remise(){
    var c = code.value.trim().toUpperCase(), n = nuits(), o = CODES[c];
    if(!c) return { taux:.05, msg:t('Tarif direct : −5 % appliqués automatiquement.','Direct rate: 5% off applied automatically.'), etat:'bon' };
    if(!o) return { taux:.05, msg:t('Code « ' + c + ' » inconnu. Le tarif direct −5 % reste appliqué.','Code "' + c + '" not recognised. The 5% direct rate still applies.'), etat:'mauvais' };
    if(n < o.nuits) return { taux:.05, msg:t('Le code ' + c + ' est valable dès ' + o.nuits + ' nuits. Le tarif direct −5 % reste appliqué.','Code ' + c + ' is valid from ' + o.nuits + ' nights. The 5% direct rate still applies.'), etat:'mauvais' };
    return { taux:o.taux, cadeau:o.cadeau, msg:'✓ ' + c + ' : ' + t(o.fr, o.en), etat:'bon' };
  }
  function etapes(n){ return '<div class="etapes"><span class="' + (n === 1 ? 'actif' : '') + '">1 · ' + t('Votre séjour','Your stay') + '</span><span class="' + (n === 2 ? 'actif' : '') + '">2 · ' + t('Votre chambre','Your room') + '</span><span class="' + (n === 3 ? 'actif' : '') + '">3 · ' + t('Confirmation','Confirmation') + '</span></div>'; }
  function resume(){ var n = nuits(); return t('Du ','From ') + fmt(arr.value) + t(' au ',' to ') + fmt(dep.value) + ' · ' + n + ' ' + t(n > 1 ? 'nuits' : 'nuit', n > 1 ? 'nights' : 'night') + ' · ' + gens() + ' ' + t(gens() > 1 ? 'voyageurs' : 'voyageur', gens() > 1 ? 'guests' : 'guest'); }
  function etape2(prefere){
    if(!arr.value || !dep.value || dep.value <= arr.value){ arr.focus(); return ouvre('<div class="dedans"><h2>' + t('Vos dates','Your dates') + '</h2><p class="doux">' + t('Merci de choisir une date de départ postérieure à la date d\'arrivée.','Please choose a check‑out date after your check‑in date.') + '</p></div>', true); }
    var n = nuits(), r = remise(), g = gens();
    var liste = ORDRE.slice().sort(function(a, b){ return (a === prefere ? -1 : 0) - (b === prefere ? -1 : 0); }).map(function(id){
      var c = CH[id], ok = c.cap >= g, tot = n * c.prix, dir = Math.round(tot * (1 - r.taux) * 100) / 100;
      return '<div class="option' + (ok ? '' : ' non') + '"><img src="' + src(c.imgs[0]) + '" alt=""><div><h3>' + t(c.fr, c.en) + '</h3><div class="d">' + (c.surf ? c.surf + ' · ' : '') + t(c.lit[0], c.lit[1]) + ' · ' + c.cap + ' ' + t('pers. max','guests max') + '</div></div>' +
        '<div class="px">' + (ok ? '<div><small>' + n + ' × ' + eur(c.prix) + '</small><s>' + eur(tot) + '</s><b>' + eur(dir) + '</b></div><button class="b petit" type="button" data-choix="' + id + '">' + t('Choisir','Select') + '</button>' : '<small>' + t('Trop petite pour ' + g + ' voyageurs','Too small for ' + g + ' guests') + '</small>') + '</div></div>';
    }).join('');
    ouvre('<div class="dedans">' + etapes(2) + '<h2>' + t('Choisissez votre chambre','Choose your room') + '</h2><p class="doux">' + resume() + '</p><p class="note-code ' + r.etat + '">' + r.msg + '</p><div class="choix">' + liste + '</div></div>');
  }
  function etape3(id){
    var c = CH[id], n = nuits(), r = remise(), tot = n * c.prix, dir = Math.round(tot * (1 - r.taux) * 100) / 100;
    var nom = t(c.fr, c.en);
    var msg = t('Bonjour, je souhaite réserver à l\'Hôtel Allety.\nChambre : ','Hello, I would like to book at Hôtel Allety.\nRoom: ') + nom + '\n' + t('Arrivée : ','Check‑in: ') + fmt(arr.value) + '\n' + t('Départ : ','Check‑out: ') + fmt(dep.value) + ' (' + n + ' ' + t(n > 1 ? 'nuits' : 'nuit', n > 1 ? 'nights' : 'night') + ')\n' + t('Voyageurs : ','Guests: ') + ad.value + t(' adulte(s)',' adult(s)') + (+en.value ? ', ' + en.value + t(' enfant(s)',' child(ren)') : '') + '\n' + t('Tarif direct affiché : ','Direct rate shown: ') + eur(dir) + (code.value.trim() ? '\nCode : ' + code.value.trim().toUpperCase() : '') + '\n' + t('Mon nom : ','My name: ');
    ouvre('<div class="dedans">' + etapes(3) + '<h2>' + t('Votre demande est prête','Your request is ready') + '</h2><p class="doux">' + t('Envoyez‑la à la réception : elle vous confirme la disponibilité et bloque votre chambre. Vous réglez à l\'hôtel, à l\'arrivée.','Send it to the front desk: they will confirm availability and hold your room. You pay at the hotel, on arrival.') + '</p>' +
      '<div class="recap"><dl><dt>' + t('Chambre','Room') + '</dt><dd>' + nom + '</dd><dt>' + t('Séjour','Stay') + '</dt><dd>' + resume() + '</dd><dt>' + t('Avantage','Benefit') + '</dt><dd>' + r.msg.replace('✓ ','') + '</dd><dt>Total</dt><dd><s style="color:#7d766b">' + eur(tot) + '</s> <span class="total">' + eur(dir) + '</span></dd></dl></div>' +
      '<div class="envoi" style="display:flex;flex-wrap:wrap;gap:10px"><a class="b" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg) + '">' + t('Envoyer sur WhatsApp','Send via WhatsApp') + '</a><a class="b vide" href="mailto:' + EMAIL + '?subject=' + encodeURIComponent(t('Demande de réservation','Booking request')) + '&body=' + encodeURIComponent(msg) + '">' + t('Par e‑mail','By e‑mail') + '</a><a class="b vide" href="tel:+33153802944">' + t('Appeler','Call') + '</a><button class="l" type="button" data-retour style="margin-left:auto">' + t('Changer de chambre','Change room') + '</button></div></div>', true);
  }
  $('#resa').addEventListener('submit', function(e){ e.preventDefault(); etape2(); });
  $$('[data-ouvre-resa]').forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); etape2(); }); });
  $$('[data-code]').forEach(function(b){ b.addEventListener('click', function(){ code.value = b.dataset.code; etape2(); }); });
  boite.addEventListener('click', function(e){
    var c = e.target.closest('[data-choix]'); if(c) return etape3(c.dataset.choix);
    if(e.target.closest('[data-retour]')) return etape2();
    var rs = e.target.closest('[data-reserve]'); if(rs) return etape2(rs.dataset.reserve);
    var m = e.target.closest('[data-mini]'); if(m){ $('#fiche-img').src = m.querySelector('img').src; $$('[data-mini]', boite).forEach(function(x){ x.classList.toggle('actif', x === m); }); }
  });

  /* Fiche chambre */
  function fiche(id){
    var c = CH[id], ims = c.imgs.map(src);
    ouvre('<div class="fiche"><div class="vis"><img id="fiche-img" src="' + ims[0] + '" alt=""><div class="mini">' + ims.map(function(s, i){ return '<button type="button" data-mini class="' + (i ? '' : 'actif') + '"><img src="' + s + '" alt=""></button>'; }).join('') + '</div></div>' +
      '<div class="dedans"><p class="sur">' + t('Chambre','Room') + '</p><h2>' + t(c.fr, c.en) + '</h2><div class="tarif">' + eur(c.prix) + '<small>' + t('/ nuit, tarif plateforme','/ night, platform rate') + '</small></div><p class="doux">' + t(c.txt[0], c.txt[1]) + '</p>' +
      '<ul class="equip">' + (c.surf ? '<li><svg class="i"><use href="#plan2"/></svg>' + c.surf + '</li>' : '<li><svg class="i"><use href="#balcon"/></svg>' + t('Balcon sur le boulevard','Balcony over the boulevard') + '</li>') +
      '<li><svg class="i"><use href="#gens"/></svg>' + c.cap + ' ' + t('personnes','guests') + '</li><li><svg class="i"><use href="#lit"/></svg>' + t(c.lit[0], c.lit[1]) + '</li><li><svg class="i"><use href="#douche"/></svg>' + t('Salle d\'eau privative','Private bathroom') + '</li><li><svg class="i"><use href="#wifi"/></svg>' + t('Wifi gratuit','Free wifi') + '</li><li><svg class="i"><use href="#tv"/></svg>' + t('Télévision écran plat','Flat‑screen TV') + '</li><li><svg class="i"><use href="#tasse"/></svg>' + t('Bouilloire','Kettle') + '</li><li><svg class="i"><use href="#eclat"/></svg>' + t('Ménage quotidien','Daily housekeeping') + '</li></ul>' +
      '<div class="regles"><div><b>' + t('Arrivée','Check‑in') + '</b>' + t('Dès 15h, réception 24h/24','From 3 pm, 24/7 front desk') + '</div><div><b>' + t('Départ','Check‑out') + '</b>' + t('Jusqu\'à 12h','Until noon') + '</div><div><b>' + t('Enfants','Children') + '</b>' + t('Lit bébé 20 € / nuit','Baby cot €20 / night') + '</div><div><b>' + t('À savoir','Good to know') + '</b>' + t('Non‑fumeur, sans ascenseur','Non‑smoking, no lift') + '</div></div>' +
      '<button class="b" type="button" data-reserve="' + id + '">' + t('Réserver cette chambre','Book this room') + '</button></div></div>');
  }
  $$('.piece').forEach(function(p){
    p.addEventListener('click', function(e){ var r = e.target.closest('[data-reserve]'); if(r) return etape2(r.dataset.reserve); location.href = 'chambre-' + p.dataset.chambre + '.html'; });
    p.addEventListener('keydown', function(e){ if(e.key === 'Enter' && e.target === p) location.href = 'chambre-' + p.dataset.chambre + '.html'; });
  });
  document.addEventListener('click', function(e){
    var r = e.target.closest('[data-reserve]'); if(r && !r.closest('#boite') && !r.closest('.piece')) return etape2(r.dataset.reserve);
    var v = e.target.closest('[data-vignette]'); if(v){ $('#grande').src = v.querySelector('img').src; $$('[data-vignette]').forEach(function(x){ x.classList.toggle('actif', x === v); }); }
  });

  /* Carnet du quartier */
  var ART = {
    boulevards:{ img:'rue',
      fr:['Une journée sur les Grands Boulevards','<p>Tout commence devant l\'hôtel. La porte Saint‑Denis, élevée en 1672 pour célébrer les victoires de Louis XIV, est le plus ancien arc de triomphe de Paris. Sa voisine, la porte Saint‑Martin, se trouve à 250 mètres.</p><h4>Le matin</h4><p>Remontez le boulevard vers l\'ouest. Les façades des théâtres se succèdent : c\'est ici que Paris vient rire et applaudir depuis deux siècles.</p><h4>L\'après‑midi</h4><p>Le Grand Rex, avec sa façade Art déco et sa salle étoilée, propose des visites de ses coulisses. Le musée Grévin est à 750 mètres de l\'hôtel.</p><h4>Le soir</h4><p>Les brasseries du boulevard servent tard. Demandez à la réception notre adresse du moment.</p>'],
      en:['A day on the Grands Boulevards','<p>It all starts in front of the hotel. The Porte Saint‑Denis, built in 1672 to celebrate the victories of Louis XIV, is the oldest triumphal arch in Paris. Its neighbour, the Porte Saint‑Martin, is 250 metres away.</p><h4>Morning</h4><p>Walk west along the boulevard. One theatre façade follows another: Parisians have been coming here to laugh and applaud for two centuries.</p><h4>Afternoon</h4><p>The Grand Rex, with its Art Deco façade and starry ceiling, offers behind‑the‑scenes tours. The Musée Grévin is 750 metres from the hotel.</p><h4>Evening</h4><p>The brasseries on the boulevard serve late. Ask the front desk for our current favourite.</p>'] },
    passages:{ img:'facade',
      fr:['Les passages couverts, même sous la pluie','<p>Bien avant les grands magasins, les Parisiens faisaient leurs emplettes à l\'abri, sous des verrières. Plusieurs de ces galeries du XIX<sup>e</sup> siècle sont à dix minutes à pied de l\'hôtel.</p><h4>Passage des Panoramas</h4><p>L\'un des plus anciens de Paris. Marchands de timbres, graveurs et petites tables où déjeuner.</p><h4>Passage Jouffroy et passage Verdeau</h4><p>Ils se suivent, de l\'autre côté du boulevard. Librairies anciennes, jouets, cannes et salons de thé.</p><h4>Notre conseil</h4><p>Venez en fin de matinée, quand la lumière tombe droit à travers les verrières.</p>'],
      en:['The covered passages, rain or shine','<p>Long before department stores, Parisians shopped under glass roofs. Several of these 19th‑century arcades are a ten‑minute walk from the hotel.</p><h4>Passage des Panoramas</h4><p>One of the oldest in Paris. Stamp dealers, engravers and small tables for lunch.</p><h4>Passage Jouffroy and Passage Verdeau</h4><p>One follows the other, across the boulevard. Antiquarian bookshops, toys, walking sticks and tea rooms.</p><h4>Our tip</h4><p>Come in the late morning, when the light falls straight through the glass roofs.</p>'] },
    canal:{ img:'vue',
      fr:['De République au canal Saint‑Martin','<p>La place de la République est à 850 mètres de l\'hôtel, ou à une station de métro. De là, quelques rues suffisent pour rejoindre le canal Saint‑Martin.</p><h4>La balade</h4><p>Longez le quai : passerelles de fer, écluses et platanes. Les Parisiens s\'y installent au bord de l\'eau dès les premiers beaux jours.</p><h4>À faire</h4><p>Regardez une péniche franchir une écluse, puis poussez la porte d\'une des boutiques de créateurs du quartier.</p><h4>Le retour</h4><p>Comptez vingt minutes à pied pour rentrer à l\'hôtel par le boulevard.</p>'],
      en:['From République to the Canal Saint‑Martin','<p>Place de la République is 850 metres from the hotel, or one metro stop. From there, a few streets lead to the Canal Saint‑Martin.</p><h4>The walk</h4><p>Follow the quay: iron footbridges, locks and plane trees. Parisians settle by the water as soon as the sun comes out.</p><h4>Things to do</h4><p>Watch a barge pass through a lock, then step into one of the area\'s designer boutiques.</p><h4>The way back</h4><p>Allow twenty minutes on foot to return to the hotel along the boulevard.</p>'] }
  };
  $$('[data-article]').forEach(function(b){ b.addEventListener('click', function(){ var a = ART[b.dataset.article], c = a[lang]; ouvre('<img class="tete-img" src="' + src(a.img) + '" alt=""><div class="dedans article-txt"><p class="sur">' + t('Le carnet du quartier','The neighbourhood notebook') + '</p><h2>' + c[0] + '</h2>' + c[1] + '</div>', true); }); });

  /* Lettre et contact */
  $('#lettre').addEventListener('submit', function(e){ e.preventDefault(); var m = $('#lettre-msg'); m.className = 'ok'; m.textContent = t('Merci, vous êtes inscrit. À très vite à Paris.','Thank you, you are subscribed. See you soon in Paris.'); m.removeAttribute('data-en'); delete m.dataset.fr; e.target.reset(); });
  var canal = 'wa';
  $$('#demande [data-canal]').forEach(function(b){ b.addEventListener('click', function(){ canal = b.dataset.canal; }); });
  $('#demande').addEventListener('submit', function(e){ e.preventDefault();
    var nom = $('#d-nom').value.trim(), msg = $('#d-msg').value.trim(); if(!nom){ $('#d-nom').focus(); return; } if(!msg){ $('#d-msg').focus(); return; }
    var sujet = $('#d-sujet').options[$('#d-sujet').selectedIndex].textContent, corps = t('Bonjour, ','Hello, ') + '\n' + msg + '\n\n' + nom;
    window.open(canal === 'wa' ? 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent('[' + sujet + '] ' + corps) : 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps), '_blank');
  });
  $('#mentions').addEventListener('click', function(){ ouvre('<div class="dedans"><h2>' + t('Mentions légales','Legal notice') + '</h2><p class="doux">' + t('Éditeur : Hôtel Allety, 4 bis boulevard de Bonne Nouvelle, 75010 Paris. Téléphone : 01 53 80 29 44.','Publisher: Hôtel Allety, 4 bis boulevard de Bonne Nouvelle, 75010 Paris. Phone: 01 53 80 29 44.') + '</p><p class="doux">' + t('Raison sociale, numéro RCS, médiateur de la consommation et conditions d\'annulation : à compléter avec l\'hôtel.','Company name, registration number, consumer mediator and cancellation terms: to be completed with the hotel.') + '</p></div>', true); });

  /* Langue */
  $('#lg').addEventListener('click', function(){
    lang = lang === 'fr' ? 'en' : 'fr';
    try{ localStorage.setItem('allety-lang', lang); }catch(e){}
    $$('[data-en]').forEach(function(el){ if(el.dataset.fr === undefined) el.dataset.fr = el.innerHTML; el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.fr; });
    document.documentElement.lang = lang;
    $('#lg').innerHTML = lang === 'fr' ? '<b>FR</b> / EN' : 'FR / <b>EN</b>';
    code.placeholder = t('Facultatif','Optional'); $('#lettre input').placeholder = t('Votre adresse e‑mail','Your e‑mail address');
  });
  try{ if(localStorage.getItem('allety-lang') === 'en') $('#lg').click(); }catch(e){}
})();
