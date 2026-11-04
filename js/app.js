/* 人生重开模拟器 · 界面宿主
 * 只负责 DOM 与流程；所有规则在 engine.js 里。
 */
(function () {
  'use strict';

  var E = window.LIFE_ENGINE;
  var D = window.LIFE_DATA;
  var $ = function (id) { return document.getElementById(id); };

  var ATTR_COLOR = { CHR: '#ff8fb1', INT: '#7bb6ff', STR: '#7bd88f', MNY: '#ffd93d' };
  var ATTR_EMOJI = { CHR: '✨', INT: '🧠', STR: '💪', MNY: '💰' };

  var S = {
    talents: [],
    picked: [],
    alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 },
    game: null,
    timer: null,
    over: false
  };

  /* ---------- 通用 ---------- */
  function show(id) {
    var all = document.querySelectorAll('.screen');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
    $(id).classList.add('active');
  }

  function emojiFor(t) {
    var ef = t.effects || {}, best = null, bestV = 0, allNeg = true;
    for (var k in ef) {
      if (!ef.hasOwnProperty(k)) continue;
      if (ef[k] > 0) allNeg = false;
      if (ef[k] > bestV) { bestV = ef[k]; best = k; }
    }
    if (allNeg) return '🥀';
    return ATTR_EMOJI[best] || '🎲';
  }

  function isRare(t) {
    var sum = 0;
    for (var k in t.effects) if (t.effects.hasOwnProperty(k) && t.effects[k] > 0) sum += t.effects[k];
    return sum >= 6;
  }

  function fxHtml(effects) {
    var out = [];
    for (var k in effects) {
      if (!effects.hasOwnProperty(k)) continue;
      var v = effects[k];
      var cls = v > 0 ? 'fx-up' : 'fx-down';
      out.push('<span class="' + cls + '">' + E.ATTR_NAMES[k] + ' ' + (v > 0 ? '+' : '') + v + '</span>');
    }
    return out.join('');
  }

  function loadStats() {
    try {
      return {
        lives: Number(localStorage.getItem('life.lives') || 0),
        best: Number(localStorage.getItem('life.best') || 0)
      };
    } catch (e) { return { lives: 0, best: 0 }; }
  }
  function saveStats(st) {
    try {
      localStorage.setItem('life.lives', String(st.lives));
      localStorage.setItem('life.best', String(st.best));
    } catch (e) { /* 隐私模式忽略 */ }
  }

  /* ---------- 开始页 ---------- */
  function renderStart() {
    var st = loadStats();
    var el = $('startStats');
    if (st.lives > 0) {
      el.textContent = '已经活过 ' + st.lives + ' 次 · 最高评分 ' + st.best;
    } else {
      el.textContent = '第一次来到这个世界';
    }
  }

  /* ---------- 天赋 ---------- */
  function renderTalents() {
    S.talents = E.drawTalents(D, Math.random);
    S.picked = [];
    updateTalentBar();
    var box = $('talentList');
    box.innerHTML = '';
    S.talents.forEach(function (t) {
      var el = document.createElement('div');
      el.className = 'card' + (isRare(t) ? ' rare' : '');
      el.dataset.id = t.id;
      el.innerHTML =
        '<div class="card-emoji">' + emojiFor(t) + '</div>' +
        '<div class="card-body">' +
          '<div class="card-name">' + t.name + '</div>' +
          '<div class="card-desc">' + t.desc + '</div>' +
          '<div class="card-fx">' + fxHtml(t.effects) + '</div>' +
        '</div>' +
        '<div class="card-check">✓</div>';
      el.addEventListener('click', function () { toggleTalent(t, el); });
      box.appendChild(el);
    });
  }

  function toggleTalent(t, el) {
    var i = S.picked.indexOf(t);
    if (i >= 0) {
      S.picked.splice(i, 1);
      el.classList.remove('on');
    } else {
      if (S.picked.length >= E.TALENT_PICK) return;
      S.picked.push(t);
      el.classList.add('on');
    }
    updateTalentBar();
  }

  function updateTalentBar() {
    $('talentCount').textContent = String(S.picked.length);
    $('btnTalentNext').disabled = S.picked.length !== E.TALENT_PICK;
  }

  /* ---------- 属性 ---------- */
  function allocTotal() {
    return S.alloc.CHR + S.alloc.INT + S.alloc.STR + S.alloc.MNY;
  }

  function renderAttrs() {
    var left = E.POINTS - allocTotal();
    $('pointsLeft').textContent = String(left);
    var box = $('attrList');
    box.innerHTML = '';
    E.ATTRS.forEach(function (k) {
      var v = S.alloc[k];
      var row = document.createElement('div');
      row.className = 'attr-row';
      row.innerHTML =
        '<div class="attr-head">' +
          '<span class="attr-label">' + ATTR_EMOJI[k] + ' ' + E.ATTR_NAMES[k] + '</span>' +
          '<span class="attr-val">' + v + '</span>' +
        '</div>' +
        '<div class="attr-track">' +
          '<button class="attr-num" data-act="minus">−</button>' +
          '<div class="attr-bar"><div class="attr-fill" style="width:' + (v / E.ATTR_CAP_BIRTH * 100) + '%;background:' + ATTR_COLOR[k] + '"></div></div>' +
          '<button class="attr-num" data-act="plus">+</button>' +
        '</div>';
      var minus = row.querySelector('[data-act="minus"]');
      var plus = row.querySelector('[data-act="plus"]');
      minus.disabled = v <= 0;
      plus.disabled = v >= E.ATTR_CAP_BIRTH || left <= 0;
      minus.addEventListener('click', function () {
        if (S.alloc[k] > 0) { S.alloc[k]--; renderAttrs(); }
      });
      plus.addEventListener('click', function () {
        if (S.alloc[k] < E.ATTR_CAP_BIRTH && allocTotal() < E.POINTS) { S.alloc[k]++; renderAttrs(); }
      });
      box.appendChild(row);
    });
    $('btnLive').disabled = left !== 0;
  }

  function randomAlloc() {
    S.alloc = { CHR: 0, INT: 0, STR: 0, MNY: 0 };
    var left = E.POINTS;
    while (left > 0) {
      var k = E.ATTRS[Math.floor(Math.random() * E.ATTRS.length)];
      if (S.alloc[k] >= E.ATTR_CAP_BIRTH) continue;
      S.alloc[k]++;
      left--;
    }
    renderAttrs();
  }

  /* ---------- 人生 ---------- */
  function startLife() {
    S.game = E.createLife({
      data: D,
      rng: Math.random,
      alloc: S.alloc,
      talents: S.picked
    });
    S.over = false;
    $('logList').innerHTML = '';
    $('ageNum').textContent = '0';
    $('btnNext').disabled = false;
    $('btnNext').textContent = '下一年';
    $('btnAuto').textContent = '自动';
    $('btnAuto').classList.remove('primary');
    $('btnAuto').classList.add('ghost');
    stopAuto();
    show('screen-life');
    S.game.log.forEach(appendEntry);
    renderAttrMini();
    $('ageNum').textContent = String(S.game.age);
  }

  function renderAttrMini(changed) {
    var box = $('attrMini');
    box.innerHTML = E.ATTRS.map(function (k) {
      var cls = '';
      var d = changed && changed[k];
      if (d > 0) cls = 'up';
      else if (d < 0) cls = 'down';
      return '<span class="' + cls + '">' + E.ATTR_NAMES[k].slice(0, 2) + '<b> ' + S.game.attrs[k] + '</b></span>';
    }).join('');
  }

  function appendEntry(entry) {
    var box = $('logList');
    var div = document.createElement('div');
    div.className = 'entry';

    var textCls = 'entry-text';
    if (entry.death) textCls += ' death';
    else if (entry.tags && entry.tags.indexOf('里程碑') >= 0) textCls += ' milestone';

    var fx = '';
    if (entry.changes && entry.changes.length) {
      fx = '<div class="entry-fx">' + entry.changes.map(function (c) {
        var cls = c.delta > 0 ? 'fx-up' : 'fx-down';
        return '<span class="' + cls + '">' + c.name + ' ' + (c.delta > 0 ? '+' : '') + c.delta + '</span>';
      }).join('') + '</div>';
    }

    div.innerHTML =
      '<div class="entry-age">' + entry.age + '岁</div>' +
      '<div class="entry-body"><div class="' + textCls + '">' + entry.text + '</div>' + fx + '</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function nextYear() {
    if (!S.game || S.over) return;
    var entry = E.step(S.game);
    if (!entry) { finish(); return; }

    appendEntry(entry);
    $('ageNum').textContent = String(S.game.age);

    var changed = {};
    if (entry.changes) {
      entry.changes.forEach(function (c) { changed[c.key] = c.delta; });
    }
    renderAttrMini(changed);

    if (!S.game.alive) {
      S.over = true;
      stopAuto();
      $('btnNext').disabled = true;
      $('btnNext').textContent = '查看结局';
      $('btnNext').disabled = false;
      setTimeout(finish, 700);
    }
  }

  function stopAuto() {
    if (S.timer) { clearInterval(S.timer); S.timer = null; }
  }

  function toggleAuto() {
    if (S.over) return;
    if (S.timer) {
      stopAuto();
      $('btnAuto').textContent = '自动';
      return;
    }
    $('btnAuto').textContent = '暂停';
    S.timer = setInterval(nextYear, 780);
  }

  function skipAll() {
    if (!S.game || S.over) return;
    stopAuto();
    while (S.game.alive) {
      var entry = E.step(S.game);
      if (!entry) break;
      appendEntry(entry);
    }
    $('ageNum').textContent = String(S.game.age);
    renderAttrMini();
    S.over = true;
    finish();
  }

  /* ---------- 结算 ---------- */
  function finish() {
    stopAuto();
    if (!S.game) return;
    $('btnNext').disabled = true;

    var g = S.game;
    var r = E.rate(g);
    var st = loadStats();
    st.lives += 1;
    if (r.score > st.best) st.best = r.score;
    saveStats(st);

    var milestones = g.log.filter(function (e) {
      return (e.tags && e.tags.indexOf('里程碑') >= 0) || e.death;
    }).slice(0, 10);

    var talentChips = g.talents.map(function (t) {
      return '<span class="talent-chip">' + t.name + '</span>';
    }).join('');

    var finalAttr = E.ATTRS.map(function (k) {
      return '<div><div class="k">' + E.ATTR_NAMES[k] + '</div>' +
        '<div class="v" style="color:' + ATTR_COLOR[k] + '">' + g.attrs[k] + '</div></div>';
    }).join('');

    var hl = milestones.length
      ? milestones.map(function (e) {
        return '<div><span>' + e.age + '岁</span>' + e.text + '</div>';
      }).join('')
      : '<div>这一生没有太多可以说的，但它确实发生过。</div>';

    $('endWrap').innerHTML =
      '<div class="end-head">' +
        '<div class="end-grade">评级 ' + r.grade + '</div>' +
        '<h2 class="end-title" style="color:' + r.color + '">' + r.title + '</h2>' +
        '<p class="end-desc">' + r.desc + '</p>' +
        '<div class="end-age">享年 <b>' + g.age + '</b> 岁 · 评分 ' + r.score + '</div>' +
        '<div class="end-age" style="margin-top:6px;font-size:12px">' + (g.deathReason || '') + '</div>' +
      '</div>' +
      '<div class="panel"><div class="panel-title">最终属性</div>' +
        '<div class="final-attr">' + finalAttr + '</div></div>' +
      '<div class="panel"><div class="panel-title">天赋</div>' + talentChips + '</div>' +
      '<div class="panel"><div class="panel-title">人生节点</div>' +
        '<div class="highlights">' + hl + '</div></div>';

    show('screen-end');
  }

  /* ---------- 事件绑定 ---------- */
  $('btnStart').addEventListener('click', function () {
    show('screen-talent');
    renderTalents();
  });

  $('btnReroll').addEventListener('click', renderTalents);

  $('btnTalentNext').addEventListener('click', function () {
    S.alloc = { CHR: 0, INT: 0, STR: 0, MNY: 0 };
    show('screen-attr');
    renderAttrs();
  });

  $('btnAttrAuto').addEventListener('click', randomAlloc);
  $('btnLive').addEventListener('click', startLife);
  $('btnNext').addEventListener('click', function () {
    if (S.over) { finish(); return; }
    nextYear();
  });
  $('btnAuto').addEventListener('click', toggleAuto);
  $('btnSkip').addEventListener('click', skipAll);
  $('btnRestart').addEventListener('click', function () {
    stopAuto();
    S.game = null;
    S.over = false;
    show('screen-talent');
    renderTalents();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') {
      var life = $('screen-life');
      if (!life.classList.contains('active')) return;
      e.preventDefault();
      if (S.over) finish(); else nextYear();
    }
  });

  renderStart();
})();
