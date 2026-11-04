/* 人生重开模拟器 · 引擎
 * 纯逻辑，不碰 DOM、不碰 wx。浏览器 / Node / 微信小游戏共用同一份。
 * 随机数可注入（rng），便于批量模拟与确定性测试。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LIFE_ENGINE = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var ATTRS = ['CHR', 'INT', 'STR', 'MNY'];
  var ATTR_NAMES = { CHR: '颜值', INT: '智力', STR: '体质', MNY: '家境' };
  var ATTR_MIN = 0;
  var ATTR_MAX = 99;
  var POINTS = 20;          // 可分配点数
  var ATTR_CAP_BIRTH = 10;  // 出生时单项上限
  var TALENT_PICK = 3;      // 选几个天赋
  var TALENT_DRAW = 10;     // 抽几个备选

  /* ---------- 随机数 ---------- */
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), 1 | t);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randInt(rng, min, max) { return min + Math.floor(rng() * (max - min + 1)); }
  function pick(rng, list) { return list[Math.floor(rng() * list.length)]; }

  function pickWeighted(rng, list) {
    if (!list.length) return null;
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += list[i].weight;
    if (total <= 0) return list[0];
    var r = rng() * total;
    for (i = 0; i < list.length; i++) {
      r -= list[i].weight;
      if (r <= 0) return list[i];
    }
    return list[list.length - 1];
  }

  /* ---------- 属性 ---------- */
  function clampAttr(v) {
    v = Math.round(v);
    if (v < ATTR_MIN) return ATTR_MIN;
    if (v > ATTR_MAX) return ATTR_MAX;
    return v;
  }

  function applyEffects(attrs, effects) {
    if (!effects) return [];
    var changes = [];
    for (var k in effects) {
      if (!effects.hasOwnProperty(k)) continue;
      if (!attrs.hasOwnProperty(k)) continue;
      var before = attrs[k];
      var after = clampAttr(before + effects[k]);
      attrs[k] = after;
      if (after !== before) changes.push({ key: k, name: ATTR_NAMES[k], delta: after - before, value: after });
    }
    return changes;
  }

  /* ---------- 天赋 ---------- */
  function drawTalents(data, rng) {
    var pool = data.TALENTS.slice();
    var out = [];
    for (var i = 0; i < TALENT_DRAW && pool.length; i++) {
      var idx = Math.floor(rng() * pool.length);
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }

  /* ---------- 出生 ---------- */
  function createLife(opts) {
    opts = opts || {};
    var data = opts.data;
    var rng = opts.rng || Math.random;
    var alloc = opts.alloc || {};
    var talents = opts.talents || [];
    var sex = opts.sex || (rng() < 0.5 ? 'M' : 'F');

    var attrs = {};
    for (var i = 0; i < ATTRS.length; i++) {
      var k = ATTRS[i];
      attrs[k] = clampAttr(alloc[k] || 0);
    }

    // 天赋加成
    var bonus = {};
    for (var t = 0; t < talents.length; t++) {
      var ef = talents[t].effects || {};
      for (var e in ef) {
        if (!ef.hasOwnProperty(e)) continue;
        bonus[e] = (bonus[e] || 0) + ef[e];
      }
    }
    for (var b in bonus) {
      if (!bonus.hasOwnProperty(b)) continue;
      if (attrs.hasOwnProperty(b)) attrs[b] = clampAttr(attrs[b] + bonus[b]);
    }

    // 寿命基线：体质为主，家境与智力略作修正
    var lifespan = Math.round(62 + attrs.STR * 1.6 + attrs.INT * 0.5 + attrs.MNY * 0.35 + (rng() * 2 - 1) * 8);
    if (lifespan < 18) lifespan = 18;

    var state = {
      data: data,
      rng: rng,
      sex: sex,
      age: 0,
      attrs: attrs,
      talents: talents,
      lifespan: lifespan,
      alive: true,
      deathReason: null,
      fired: {},
      log: [],
      peak: { CHR: attrs.CHR, INT: attrs.INT, STR: attrs.STR, MNY: attrs.MNY }
    };

    // 第 0 年：出生
    state.log.push({
      age: 0,
      text: birthText(state),
      changes: [],
      tags: ['出生']
    });

    return state;
  }

  function birthText(state) {
    var boy = state.sex === 'M';
    var a = state.attrs;
    var head = boy ? '你出生了，是个男孩。' : '你出生了，是个女孩。';
    var tail;
    if (a.MNY >= 8) tail = '产房外，父亲给所有人群发了消息。';
    else if (a.MNY <= 2) tail = '家里没有多余的钱，但母亲把你裹得很暖。';
    else tail = '普通的家庭，普通的夜晚，一切刚刚开始。';
    var body;
    if (a.STR <= 2) body = '你生下来就瘦小，哭声像小猫。';
    else if (a.STR >= 8) body = '你生下来就很壮实，哭声震得走廊都有回音。';
    else body = '护士说你很健康。';
    return head + body + tail;
  }

  function alive(state) { return state.alive; }

  /* ---------- 事件筛选 ---------- */
  function isEligible(ev, state) {
    if (state.age < ev.minAge || state.age > ev.maxAge) return false;
    if (ev.once && state.fired[ev.id]) return false;
    if (ev.sex && ev.sex !== state.sex) return false;
    if (ev.cond) {
      for (var k in ev.cond) {
        if (!ev.cond.hasOwnProperty(k)) continue;
        if (k === 'sex') {
          if (state.sex !== ev.cond[k]) return false;
          continue;
        }
        var range = ev.cond[k];
        var v = state.attrs[k];
        if (v === undefined) return false;
        if (v < range[0] || v > range[1]) return false;
      }
    }
    return true;
  }

  function candidates(state) {
    var list = [];
    for (var i = 0; i < state.data.EVENTS.length; i++) {
      var ev = state.data.EVENTS[i];
      if (isEligible(ev, state)) list.push(ev);
    }
    return list;
  }

  /* ---------- 推进一年 ---------- */
  function step(state) {
    if (!state.alive) return null;

    state.age += 1;

    // 1) 抽一个事件
    var ev = pickWeighted(state.rng, candidates(state));
    var entry = { age: state.age, text: '', changes: [], tags: [] };

    if (ev) {
      if (ev.once) state.fired[ev.id] = true;
      entry.text = typeof ev.text === 'function' ? ev.text(state) : ev.text;
      entry.tags = ev.tags || [];
      entry.changes = applyEffects(state.attrs, ev.effects);
      // 属性上限可能因事件突破，记录峰值
      for (var i = 0; i < ATTRS.length; i++) {
        var k = ATTRS[i];
        if (state.attrs[k] > state.peak[k]) state.peak[k] = state.attrs[k];
      }
      // 立即死亡类事件
      if (ev.kill) {
        state.alive = false;
        state.deathReason = ev.kill;
      }
    } else {
      entry.text = '这一年很平常，日子就这么过去了。';
      entry.tags = ['平常'];
    }

    state.log.push(entry);

    // 2) 结算死亡
    if (state.alive) {
      if (state.attrs.STR <= 0) {
        state.alive = false;
        state.deathReason = '身体终于没能撑住';
        entry.death = true;
      } else if (state.age >= state.lifespan) {
        state.alive = false;
        state.deathReason = '寿数到了，安安静静地走了';
        entry.death = true;
      }
    }

    return entry;
  }

  /* ---------- 一次性跑完 ---------- */
  function runAll(state, maxYears) {
    var guard = maxYears || 200;
    var n = 0;
    while (state.alive && n < guard) { step(state); n++; }
    return state;
  }

  /* ---------- 评级 ---------- */
  function score(state) {
    var s = state.attrs.CHR + state.attrs.INT + state.attrs.STR + state.attrs.MNY;
    return Math.round(s + state.age * 0.4);
  }

  function rate(state) {
    var s = score(state);
    var grades = state.data.GRADES;
    for (var i = 0; i < grades.length; i++) {
      if (s >= grades[i].min) {
        return { score: s, grade: grades[i].grade, title: grades[i].title, desc: grades[i].desc, color: grades[i].color };
      }
    }
    var last = grades[grades.length - 1];
    return { score: s, grade: last.grade, title: last.title, desc: last.desc, color: last.color };
  }

  return {
    ATTRS: ATTRS,
    ATTR_NAMES: ATTR_NAMES,
    POINTS: POINTS,
    ATTR_CAP_BIRTH: ATTR_CAP_BIRTH,
    TALENT_PICK: TALENT_PICK,
    TALENT_DRAW: TALENT_DRAW,
    mulberry32: mulberry32,
    randInt: randInt,
    pick: pick,
    pickWeighted: pickWeighted,
    clampAttr: clampAttr,
    drawTalents: drawTalents,
    createLife: createLife,
    step: step,
    runAll: runAll,
    candidates: candidates,
    score: score,
    rate: rate,
    isAlive: alive
  };
});
