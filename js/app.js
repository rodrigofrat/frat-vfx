(function () {
  'use strict';
  var C = window.FRAT_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- Capas: provisória até a imagem carregar ---------- */
  function provisorio(src, txt) {
    return '<span class="provisorio" aria-hidden="true"><span class="provisorio__marca">FRAT.VFX</span>' +
      '<span class="provisorio__txt">' + (txt || 'Conteúdo será adicionado') + '</span>' +
      (C.mostrarCaminhos !== false && src ? '<code>' + esc(src) + '</code>' : '') + '</span>';
  }
  function carregarCapa(box, src, alt, onLoad) {
    if (!src) return;
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () {
      im.alt = alt || ''; im.className = 'capa-img';
      box.insertBefore(im, box.firstChild);
      box.classList.add('tem-capa');
      if (onLoad) onLoad(im);
    };
    im.src = src;
  }
  function capa(src, alt, txt) {
    var box = el('span', 'capa', provisorio(src, txt));
    carregarCapa(box, src, alt);
    return box;
  }

  /* ---------- Players ---------- */
  function youtubeId(u) {
    var m = String(u || '').match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : null;
  }
  function aviso(src, tipo) {
    return el('div', 'aviso', '<strong>' + (tipo || 'Vídeo') + ' ainda não adicionado</strong><span>Coloque o arquivo em</span><code>' + esc(src || '(caminho vazio no config.js)') + '</code>');
  }
  function criarPlayer(src, titulo) {
    if (!src) return aviso('', 'Vídeo');
    var id = youtubeId(src);
    if (id) {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1&modestbranding=1';
      f.title = titulo || 'Vídeo';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      return f;
    }
    var v = document.createElement('video');
    v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('aria-label', titulo || 'Vídeo');
    v.addEventListener('error', function () { if (v.parentNode) v.parentNode.replaceChild(aviso(src), v); });
    v.src = src;
    return v;
  }

  /* ---------- Modal ---------- */
  var modal = $('#modal'), palco = $('#modal-palco'), origem = null;
  function abrirModal(o, botao) {
    origem = botao || document.activeElement;
    palco.innerHTML = '';
    palco.className = 'modal__palco';
    if (o.tipo === 'foto') {
      palco.classList.add('modal__palco--foto');
      var im = new Image();
      im.alt = o.legenda || o.titulo || 'Foto de bastidor';
      im.onerror = function () { palco.innerHTML = ''; palco.appendChild(aviso(o.src, 'Foto')); };
      im.src = o.src;
      palco.appendChild(im);
    } else {
      palco.classList.add(o.formato === 'vertical' ? 'modal__palco--v' : 'modal__palco--h');
      var player = criarPlayer(o.src, o.titulo);
      if (player.tagName === 'VIDEO') {
        player.addEventListener('loadedmetadata', function () {
          if (player.parentNode !== palco || !player.videoWidth || !player.videoHeight) return;
          var vertical = player.videoHeight > player.videoWidth;
          palco.classList.toggle('modal__palco--v', vertical);
          palco.classList.toggle('modal__palco--h', !vertical);
        });
      }
      palco.appendChild(player);
    }
    $('#modal-titulo').textContent = o.titulo || (o.tipo === 'foto' ? 'Foto' : '');
    if (!o.titulo) $('#modal-titulo').textContent = '';
    $('#modal-legenda').textContent = o.legenda || '';
    modal.setAttribute('aria-label', o.titulo || o.legenda || (o.tipo === 'foto' ? 'Foto' : 'Vídeo'));
    modal.hidden = false;
    document.body.classList.add('modal-aberto');
    $('.modal__fechar', modal).focus();
  }
  function fecharModal() {
    if (modal.hidden) return;
    palco.querySelectorAll('video').forEach(function (v) { v.pause(); v.removeAttribute('src'); v.load(); });
    palco.innerHTML = '';
    modal.hidden = true;
    document.body.classList.remove('modal-aberto');
    if (origem && origem.focus) origem.focus({ preventScroll: true });
  }
  modal.addEventListener('click', function (e) { if (e.target.closest('[data-fechar]')) fecharModal(); });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); fecharModal(); }
    if (e.key === 'Tab') {
      var f = Array.prototype.filter.call(modal.querySelectorAll('button, iframe, video, a[href]'), function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  /* ---------- Abertura: capas dos cards ---------- */
  var capas = C.capasAbertura || {};
  document.querySelectorAll('[data-capa]').forEach(function (box) {
    var k = box.getAttribute('data-capa');
    box.insertAdjacentHTML('afterbegin', provisorio(capas[k], 'Capa provisória'));
    carregarCapa(box, capas[k], '');
  });

  /* ---------- Sobre + reel ---------- */
  if (C.sobre && C.sobre.texto) {
    $('#sobre-bio').innerHTML = esc(C.sobre.texto).replace(/1,4 milhão/, '<mark>1,4 milhão</mark>');
  } else {
    $('#sobre-bio').innerHTML = $('#sobre-bio').innerHTML.replace(/1,4 milhão/, '<mark>1,4 milhão</mark>');
  }
  var reel = C.reel || {};
  var reelCapa = $('[data-capa-reel]');
  reelCapa.innerHTML = provisorio(reel.capa, 'Capa do reel');
  carregarCapa(reelCapa, reel.capa, '');
  $('#reel-play').addEventListener('click', function () {
    var q = $('#reel-quadro');
    q.classList.add('tocando');
    var p = criarPlayer(reel.video, reel.titulo || 'Reel');
    q.appendChild(p);
    if (p.focus) p.setAttribute('tabindex', '-1'), p.focus();
  });
  var lf = $('#lista-ferramentas');
  ((C.sobre && C.sobre.ferramentas) || []).forEach(function (t) {
    var li = el('li', 'ferramenta', '<span class="ferramenta__icone" aria-hidden="true">' + esc(t.sigla || t.nome.slice(0, 2)) + '</span><span>' + esc(t.nome) + '</span>');
    var ic = li.firstChild;
    if (t.icone) carregarCapa(ic, t.icone, '', function (im) { im.className = ''; ic.classList.add('tem-icone'); });
    lf.appendChild(li);
  });

  /* ---------- Galerias ---------- */
  function num(i) { return (i + 1 < 10 ? '0' : '') + (i + 1); }
  function selo() { return el('span', 'selo-play', '<span class="icone-play"></span>'); }

  var lm = $('#lista-motion');
  (C.motion || []).forEach(function (p, i) {
    var b = el('button', 'projeto projeto--vertical'); b.type = 'button';
    var c = capa(p.capa, '', 'Capa a adicionar'); c.appendChild(selo()); b.appendChild(c);
    b.appendChild(el('span', 'projeto__info', '<span class="projeto__num">' + num(i) + '</span><span class="projeto__titulo">' + esc(p.titulo) + '</span>' + (p.papel ? '<span class="projeto__papel">' + esc(p.papel) + '</span>' : '')));
    b.addEventListener('click', function () { abrirModal({ tipo: 'video', src: p.video, titulo: p.titulo, legenda: p.papel, formato: 'horizontal' }, b); });
    lm.appendChild(b);
  });

  var ls = $('#lista-shorts');
  (C.shorts || []).forEach(function (p, i) {
    var b = el('button', 'projeto projeto--vertical'); b.type = 'button';
    var c = capa(p.capa, '', 'Capa a adicionar'); c.appendChild(selo()); b.appendChild(c);
    b.appendChild(el('span', 'projeto__info', '<span class="projeto__num">' + num(i) + '</span><span class="projeto__titulo">' + esc(p.titulo) + '</span>'));
    b.addEventListener('click', function () { abrirModal({ tipo: 'video', src: p.video, titulo: p.titulo, legenda: p.legenda, formato: 'vertical' }, b); });
    ls.appendChild(b);
  });

  var lo = $('#lista-outros');
  (C.outros || []).forEach(function (p, i) {
    var video = p.tipo === 'video';
    var b = el('button', 'bastidor bastidor--' + (p.formato === 'vertical' ? 'vertical' : 'horizontal') + (video ? ' bastidor--video' : '')); b.type = 'button';
    b.setAttribute('aria-label', (video ? 'Assistir vídeo' : 'Ampliar foto') + (p.legenda ? ': ' + p.legenda : ' de bastidor ' + num(i)));
    var src = video ? p.capa : p.arquivo;
    var c = el('span', 'capa', provisorio(src, video ? 'Vídeo a adicionar' : 'Foto a adicionar'));
    carregarCapa(c, src, '', function (im) { c.style.aspectRatio = im.naturalWidth + ' / ' + im.naturalHeight; });
    if (video) c.appendChild(selo());
    b.appendChild(c);
    if (p.legenda) b.appendChild(el('span', 'bastidor__legenda', esc(p.legenda)));
    b.addEventListener('click', function () {
      abrirModal(video ? { tipo: 'video', src: p.video, legenda: p.legenda, formato: p.formato } : { tipo: 'foto', src: p.arquivo, legenda: p.legenda }, b);
    });
    lo.appendChild(b);
  });

  /* ---------- Títulos de seção: letras alternadas ---------- */
  document.querySelectorAll('[data-alterna]').forEach(function (h) {
    var t = h.textContent, k = 0, out = '';
    for (var i = 0; i < t.length; i++) {
      var ch = t[i];
      if (/\s|&/.test(ch)) { out += esc(ch); continue; }
      out += k++ % 2 ? '<span class="v">' + esc(ch) + '</span>' : esc(ch);
    }
    h.innerHTML = out;
  });

  /* ---------- Contato ---------- */
  var email = C.email || '[INSERIR E-MAIL]';
  var link = $('#email-link'); link.textContent = email; link.href = 'mailto:' + email;
  $('#copiar-email').addEventListener('click', function () {
    var b = this, ok = function () { b.textContent = 'Copiado!'; $('#copiar-status').textContent = 'E-mail copiado'; setTimeout(function () { b.textContent = 'Copiar e-mail'; $('#copiar-status').textContent = ''; }, 2200); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(email).then(ok, fallback); else fallback();
    function fallback() { var ta = el('textarea'); ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove(); ok(); }
  });

  /* ---------- Logo: grande na abertura, de canto no resto ---------- */
  if (C.logo) {
    document.querySelectorAll('img[src="midia/logo/frat-vfx-preto.png"]').forEach(function (i) { i.src = C.logo.preto; });
    document.querySelectorAll('img[src="midia/logo/frat-vfx-branco.png"]').forEach(function (i) { i.src = C.logo.branco; });
  }
  var canto = $('.logo-canto');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      var fora = !es[0].isIntersecting;
      document.body.classList.toggle('logo-visivel', fora);
      canto.tabIndex = fora ? 0 : -1;
    }).observe($('.abertura .logo'));
  }
  var secoes = Array.prototype.slice.call(document.querySelectorAll('[data-tema]'));
  function temaAtual() {
    var y = 50;
    for (var i = 0; i < secoes.length; i++) {
      var r = secoes[i].getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { document.body.dataset.tema = secoes[i].getAttribute('data-tema'); return; }
    }
  }
  window.addEventListener('scroll', temaAtual, { passive: true });
  temaAtual();
  document.querySelectorAll('a[href="#topo"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduzir.matches ? 'auto' : 'smooth' }); history.replaceState(null, '', location.pathname); });
  });

  /* ---------- Título "PORTFÓLIO" em ∞ ---------- */
  var palcoT = $('.titulo-3d');
  var letras = Array.prototype.slice.call(palcoT.querySelectorAll('.l'));
  var N = 900, pts, cum, L, larg, total, s0, escInf, W, H, ativo = false, visivel = true, raf = null;
  var T_PARADO = 2.6, T_ENTRA = 1.5, T_FLUI = 7.5, T_SAI = 1.5, CICLO = T_PARADO + T_ENTRA + T_FLUI + T_SAI;

  function medir() {
    palcoT.classList.remove('titulo-3d--ativo');
    letras.forEach(function (l) { l.style.transform = ''; });
    W = palcoT.clientWidth; H = palcoT.clientHeight;
    larg = letras.map(function (l) { return l.getBoundingClientRect().width; });
    total = larg.reduce(function (a, b) { return a + b; }, 0);
    var ax = Math.min(W * 0.43, H * 1.7), ay = (H * 0.34) / 0.3536, D = ax * 0.24;
    pts = []; cum = [0];
    for (var i = 0; i <= N; i++) {
      var t = (i / N) * Math.PI * 2, s = Math.sin(t), k = 1 + s * s;
      pts.push({ x: -Math.cos(t) / k * ax, y: -(s * Math.cos(t)) / k * ay, z: s * D });
      if (i) { var a = pts[i - 1], b = pts[i]; cum.push(cum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y)); }
    }
    L = cum[N];
    escInf = Math.min(0.66, (0.42 * L) / (total * 1.08));
    s0 = cum[N / 4] - (total * escInf * 1.08) / 2;
  }
  function ponto(s) {
    s = ((s % L) + L) % L;
    var lo = 0, hi = N;
    while (hi - lo > 1) { var m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m; }
    var a = pts[lo], b = pts[hi], f = (s - cum[lo]) / ((cum[hi] - cum[lo]) || 1);
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, z: a.z + (b.z - a.z) * f, ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  function suave(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function desenhar(m, cabeca) {
    var acc = 0;
    for (var i = 0; i < letras.length; i++) {
      var w = larg[i], fx = -total / 2 + acc + w / 2;
      var off = (acc + w / 2) * escInf * 1.08; acc += w;
      var s = cabeca + off, P = ponto(s);
      var x = fx + (P.x - fx) * m, y = P.y * m, z = P.z * m;
      var ang = P.ang * m, esc_ = 1 + (escInf - 1) * m;
      var giro = Math.sin((s / L) * Math.PI * 4) * 38 * m;
      letras[i].style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateZ(' + ang.toFixed(4) + 'rad) rotateX(' + giro.toFixed(1) + 'deg) scale(' + esc_.toFixed(3) + ')';
    }
  }
  var inicio = null;
  function quadro(agora) {
    raf = null;
    if (inicio === null) inicio = agora;
    var t = ((agora - inicio) / 1000) % CICLO, m, cab = s0;
    if (t < T_PARADO) m = 0;
    else if ((t -= T_PARADO) < T_ENTRA) m = suave(t / T_ENTRA);
    else if ((t -= T_ENTRA) < T_FLUI) { m = 1; cab = s0 + suave(t / T_FLUI) * L; }
    else { t -= T_FLUI; m = 1 - suave(t / T_SAI); cab = s0 + L; }
    desenhar(m, cab);
    if (visivel && !document.hidden && !reduzir.matches) raf = requestAnimationFrame(quadro);
  }
  function iniciar() {
    if (reduzir.matches) { palcoT.classList.remove('titulo-3d--ativo'); letras.forEach(function (l) { l.style.transform = ''; }); ativo = false; return; }
    medir();
    palcoT.classList.add('titulo-3d--ativo'); ativo = true;
    if (!raf) raf = requestAnimationFrame(quadro);
  }
  function retomar() { if (ativo && !raf && visivel && !document.hidden) raf = requestAnimationFrame(quadro); }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(iniciar);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (raf) cancelAnimationFrame(raf); raf = null; iniciar(); }, 150); });
  document.addEventListener('visibilitychange', retomar);
  if (reduzir.addEventListener) reduzir.addEventListener('change', function () { if (raf) cancelAnimationFrame(raf); raf = null; iniciar(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; retomar(); }).observe(palcoT);
})();
