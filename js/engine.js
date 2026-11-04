/* 人生重开模拟器 · 引擎
 * 纯逻辑，不碰 DOM、不碰 wx。浏览器 / Node 共用同一份。
 *
 * 核心状态机：
 *   step(state)   推进一年，抽事件。若事件有选项 → 挂起在 state.pending，等玩家选
 *   choose(state, i) 选择第 i 个选项，结算效果、记 flag、排后续事件
 *
 * 「决定后续发展」靠三样东西：
 *   1. flags   —— 选择留下的记号，后续事件用 ifFlag / ifNotFlag 认出来
 *   2. then    —— 选择直接把某个后续事件排进队列（可延迟 n 年）
 *   3. need    —— 选项本身有属性门槛，属性不够就看不到这个选项
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
  var POINTS = 20;
  var ATTR_CAP_BIRTH = 10;
  var TALENT_PICK = 3;
  var TALENT_DRAW = 10;

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
  function pickOne(rng, list) { return list[Math.floor(rng() * list.length)]; }

  function pickWeighted(rng, list) {
    if (!list.length) return null;
    var total = 0, i;
    for (i = 0; i < list.length; i++) total += list[i].weight || 1;
    if (total <= 0) return list[0];
    var r = rng() * total;
    for (i = 0; i < list.length; i++) {
      r -= list[i].weight || 1;
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

  function updatePeak(state) {
    for (var i = 0; i < ATTRS.length; i++) {
      var k = ATTRS[i];
      if (state.attrs[k] > state.peak[k]) state.peak[k] = state.attrs[k];
    }
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

    var state = {
      data: data,
      rng: rng,
      sex: sex,
      age: 0,
      attrs: attrs,
      talents: talents,
      lifespanJitter: (rng() * 2 - 1) * 6,
      lifespan: 0,
      alive: true,
      deathReason: null,
      fired: {},
      flags: {},
      queue: [],        // [{ id, at }] 待触发的后续事件
      pending: null,    // { ev, entry } 等待玩家选择的年份
      log: [],
      choices: 0,
      peak: { CHR: attrs.CHR, INT: attrs.INT, STR: attrs.STR, MNY: attrs.MNY }
    };
    state.lifespan = lifespanOf(state);

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

  function isAlive(state) { return state.alive; }

  /* 寿命每年按当前属性重算，用平方根而非线性：
   * 出生时分到的那几点体质极其值钱（0→10 差出二十五年），
   * 但后天累积到 40、60 时边际收益递减，不会把寿命顶穿。
   * 体质归零不会当场猝死，而是寿命跌到 57 岁左右——照样是重罚，但给了缓冲。 */
  function lifespanOf(state) {
    var a = state.attrs;
    var v = 38
      + 8 * Math.sqrt(Math.max(0, a.STR))
      + 2.5 * Math.sqrt(Math.max(0, a.INT))
      + 2 * Math.sqrt(Math.max(0, a.MNY))
      + (state.lifespanJitter || 0);
    if (v > 115) v = 115;
    if (v < 25) v = 25;
    return Math.round(v);
  }

  /* ---------- 事件筛选 ---------- */
  function flagOn(state, name) {
    if (typeof name === 'string') return !!state.flags[name];
    if (Array.isArray(name)) {
      for (var i = 0; i < name.length; i++) if (state.flags[name[i]]) return true;
      return false;
    }
    return false;
  }

  function isEligible(ev, state) {
    if (ev.queuedOnly) return false;  // 只能由 then 排队触发，不参与随机抽取
    if (state.age < ev.minAge || state.age > ev.maxAge) return false;
    if (ev.once && state.fired[ev.id]) return false;
    if (ev.sex && ev.sex !== state.sex) return false;
    if (ev.ifFlag && !flagOn(state, ev.ifFlag)) return false;
    if (ev.ifNotFlag && flagOn(state, ev.ifNotFlag)) return false;
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

  function findEvent(state, id) {
    var list = state.data.EVENTS;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /* 队列里到点的后续事件优先；没有就从池子里抽 */
  function nextEvent(state) {
    for (var i = 0; i < state.queue.length; i++) {
      if (state.queue[i].at <= state.age) {
        var ev = findEvent(state, state.queue[i].id);
        state.queue.splice(i, 1);
        if (ev) {
          if (ev.once) state.fired[ev.id] = true;
          return ev;
        }
        return nextEvent(state);
      }
    }
    return pickWeighted(state.rng, candidates(state));
  }

  function queueEvent(state, id, delay) {
    if (!id) return;
    var at = state.age + (delay || 1);
    // 同一事件不重复排队
    for (var i = 0; i < state.queue.length; i++) {
      if (state.queue[i].id === id) return;
    }
    state.queue.push({ id: id, at: at });
  }

  /* ---------- 选项门槛 ---------- */
  function optionVisible(state, opt) {
    if (!opt.need) return true;
    for (var k in opt.need) {
      if (!opt.need.hasOwnProperty(k)) continue;
      if (k === 'flag') { if (!flagOn(state, opt.need.flag)) return false; continue; }
      if (k === 'noFlag') { if (flagOn(state, opt.need.noFlag)) return false; continue; }
      var v = state.attrs[k];
      if (v === undefined) continue;
      var need = opt.need[k];
      if (typeof need === 'number') { if (v < need) return false; }
      else if (Array.isArray(need)) { if (v < need[0] || v > need[1]) return false; }
    }
    return true;
  }

  function buildOptions(state, ev) {
    if (!ev.options || !ev.options.length) return null;
    var out = [];
    for (var i = 0; i < ev.options.length; i++) {
      var opt = ev.options[i];
      if (!optionVisible(state, opt)) continue;
      out.push({ index: out.length, text: typeof opt.text === 'function' ? opt.text(state) : opt.text });
    }
    // 全部被门槛挡住时，至少给一个兜底选项，避免卡死
    if (!out.length) out.push({ index: 0, text: '什么也没做' });
    return out;
  }

  /* ---------- 推进一年 ---------- */
  function step(state) {
    if (!state.alive || state.pending) return null;

    state.age += 1;

    var ev = nextEvent(state);
    var entry = { age: state.age, text: '', changes: [], tags: [], options: null };

    if (!ev) {
      entry.text = '这一年很平常，日子就这么过去了。';
      entry.tags = ['平常'];
      state.log.push(entry);
      checkDeath(state, entry);
      return entry;
    }

    if (ev.once) state.fired[ev.id] = true;
    entry.text = typeof ev.text === 'function' ? ev.text(state) : ev.text;
    entry.tags = ev.tags || [];
    entry.eventId = ev.id;

    var opts = buildOptions(state, ev);
    if (opts) {
      // 挂起，等玩家选
      entry.options = opts;
      state.pending = { ev: ev, entry: entry, visible: visibleIndices(state, ev) };
      state.log.push(entry);
      return entry;
    }

    resolve(state, ev, null, entry);
    state.log.push(entry);
    return entry;
  }

  /* buildOptions 过滤后索引会错位，这里记下原始下标映射 */
  function visibleIndices(state, ev) {
    var map = [];
    for (var i = 0; i < ev.options.length; i++) {
      if (optionVisible(state, ev.options[i])) map.push(i);
    }
    if (!map.length) map.push(0);
    return map;
  }

  function choose(state, index) {
    if (!state.pending) return null;
    var pending = state.pending;
    var ev = pending.ev;
    var entry = pending.entry;
    var realIndex = pending.visible[Math.min(index, pending.visible.length - 1)];
    var opt = ev.options[realIndex] || ev.options[0];

    state.pending = null;
    state.choices += 1;

    entry.choice = typeof opt.text === 'function' ? opt.text(state) : opt.text;
    entry.choiceIndex = realIndex;

    resolve(state, ev, opt, entry);
    return entry;
  }

  /* 结算：应用效果、记 flag、排后续、判死亡 */
  function resolve(state, ev, opt, entry) {
    var eff = opt ? opt.effects : ev.effects;
    entry.changes = applyEffects(state.attrs, eff);

    if (opt) {
      entry.reply = typeof opt.reply === 'function' ? opt.reply(state) : (opt.reply || '');
      if (opt.set) {
        var list = Array.isArray(opt.set) ? opt.set : [opt.set];
        for (var i = 0; i < list.length; i++) {
          var f = list[i];
          if (f.charAt(0) === '!') delete state.flags[f.slice(1)];
          else state.flags[f] = true;
        }
      }
      if (opt.clear) {
        var cl = Array.isArray(opt.clear) ? opt.clear : [opt.clear];
        for (var j = 0; j < cl.length; j++) delete state.flags[cl[j]];
      }
      if (opt.then) queueEvent(state, opt.then, opt.thenDelay);
      if (opt.kill) {
        state.alive = false;
        state.deathReason = opt.kill;
        entry.death = true;
      }
    }

    updatePeak(state);

    if (state.alive && ev.kill) {
      state.alive = false;
      state.deathReason = ev.kill;
      entry.death = true;
    }

    if (state.alive) checkDeath(state, entry);
    return entry;
  }

  function checkDeath(state, entry) {
    state.lifespan = lifespanOf(state);
    if (state.age >= state.lifespan) {
      state.alive = false;
      state.deathReason = state.attrs.STR <= 3
        ? '身体被一点点耗空了'
        : '寿数到了，安安静静地走了';
      entry.death = true;
    }
  }

  /* ---------- 自动选择策略（模拟与「自动」用） ---------- */
  // random: 随机；good: 永远选最优；bad: 永远选最差；smart: 70% 选最优（模拟真人）；first: 选第一个
  function autoIndex(state, policy) {
    var pending = state.pending;
    if (!pending) return -1;
    var opts = pending.visible;
    if (policy === 'first') return 0;
    if (policy === 'good' || policy === 'bad' || policy === 'smart') {
      if (policy === 'smart' && state.rng() < 0.3) {
        return Math.floor(state.rng() * opts.length);
      }
      var best = 0, bestScore = null;
      for (var i = 0; i < opts.length; i++) {
        var o = pending.ev.options[opts[i]];
        var s = 0;
        for (var k in (o.effects || {})) s += o.effects[k];
        if (bestScore === null || (policy === 'bad' ? s < bestScore : s > bestScore)) {
          bestScore = s; best = i;
        }
      }
      return best;
    }
    return Math.floor(state.rng() * opts.length);
  }

  function runAll(state, maxYears, policy) {
    var guard = maxYears || 200;
    var n = 0;
    while (state.alive && n < guard) {
      if (state.pending) {
        choose(state, autoIndex(state, policy));
      } else {
        step(state);
        if (state.pending && policy) choose(state, autoIndex(state, policy));
      }
      n++;
    }
    // 结局时可能还有未选的年份，补一次
    while (state.pending) { choose(state, autoIndex(state, policy)); }
    return state;
  }

  /* ---------- 评级 ---------- */
  function score(state) {
    var sum = state.attrs.CHR + state.attrs.INT + state.attrs.STR + state.attrs.MNY;
    // 属性用平方根压缩：人生很长，线性加和会随选择次数线性膨胀
    return Math.round(state.age * 0.5 + 8 * Math.sqrt(sum));
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
    pick: pickOne,
    pickWeighted: pickWeighted,
    clampAttr: clampAttr,
    drawTalents: drawTalents,
    createLife: createLife,
    step: step,
    choose: choose,
    autoIndex: autoIndex,
    runAll: runAll,
    candidates: candidates,
    score: score,
    rate: rate,
    isAlive: isAlive,
    isPending: function (s) { return !!s.pending; }
  };
});
