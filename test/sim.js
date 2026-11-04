/* 人生重开模拟器 · 逻辑自检
 * 跑法：node test/sim.js [局数]
 *
 * 这里测的是引擎和数据，不碰 DOM。
 * 重点：选项机制、门槛、flag 记忆、后续事件队列、评级分布。
 */
'use strict';

var D = require('../js/data.js');
var E = require('../js/engine.js');

var N = parseInt(process.argv[2], 10) || 500;

var pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? '  → ' + extra : '')); }
}
function section(t) { console.log('\n' + t); }

function makeLife(seed, opts) {
  opts = opts || {};
  var rng = E.mulberry32(seed);
  return E.createLife({
    data: D,
    rng: rng,
    sex: opts.sex || (seed % 2 ? 'M' : 'F'),
    alloc: opts.alloc || { CHR: 5, INT: 5, STR: 5, MNY: 5 },
    talents: opts.talents || []
  });
}

/* ============ 1. 数据完整性 ============ */
section('1. 数据完整性');
(function () {
  var E_ = D.EVENTS;
  var ids = {}, dup = [];
  E_.forEach(function (e) { if (ids[e.id]) dup.push(e.id); ids[e.id] = 1; });
  ok('事件 id 唯一', dup.length === 0, dup.join(','));
  ok('事件数 ≥ 100', E_.length >= 100, String(E_.length));
  ok('天赋数 = 36', D.TALENTS.length === 36, String(D.TALENTS.length));

  var noOpt = E_.filter(function (e) { return !e.options || !e.options.length; });
  ok('每个事件都有选项', noOpt.length === 0, noOpt.map(function (e) { return e.id; }).join(','));

  var broken = [];
  E_.forEach(function (e) {
    (e.options || []).forEach(function (o) {
      if (o.then && !ids[o.then]) broken.push(e.id + '→' + o.then);
    });
  });
  ok('then 指向的事件都存在', broken.length === 0, broken.join(','));

  var badAttr = [];
  E_.forEach(function (e) {
    (e.options || []).forEach(function (o) {
      Object.keys(o.effects || {}).forEach(function (k) {
        if (E.ATTRS.indexOf(k) < 0) badAttr.push(e.id + '.' + k);
      });
    });
  });
  ok('选项效果只用四个属性', badAttr.length === 0, badAttr.join(','));

  var gaps = [];
  for (var a = 1; a <= 99; a++) {
    var n = E_.filter(function (e) {
      return e.minAge <= a && e.maxAge >= a && !e.kill && !e.queuedOnly;
    }).length;
    if (n === 0) gaps.push(a);
  }
  ok('1~99 岁每年都有可随机抽到的事件', gaps.length === 0, '缺口: ' + gaps.join(','));
})();

/* ============ 2. 选项机制 ============ */
section('2. 选项机制');
(function () {
  // 造一个必定触发的场景：把事件池收窄成单个事件
  var single = {
    TALENTS: D.TALENTS,
    GRADES: D.GRADES,
    EVENTS: [{
      id: 'x1', minAge: 1, maxAge: 99, weight: 1,
      text: '测试事件',
      options: [
        { text: '加智力', effects: { INT: 3 }, reply: '智力+3' },
        { text: '加体质', effects: { STR: 2 }, reply: '体质+2' }
      ]
    }]
  };
  var rng = E.mulberry32(1);
  var s = E.createLife({ data: single, rng: rng, alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, talents: [] });
  var beforeInt = s.attrs.INT;

  var entry = E.step(s);
  ok('step 返回带选项的事件', !!entry && !!entry.options && entry.options.length === 2);
  ok('有选项时挂起 pending', !!s.pending);
  ok('挂起期间属性不变', s.attrs.INT === beforeInt, s.attrs.INT + ' vs ' + beforeInt);
  ok('挂起期间再 step 无效果', E.step(s) === null);

  var r = E.choose(s, 0);
  ok('choose 后 pending 清空', s.pending === null);
  ok('选中项效果生效', s.attrs.INT === beforeInt + 3, String(s.attrs.INT));
  ok('返回的选择文本正确', r.choice === '加智力', r.choice);
  ok('返回的回复文本正确', r.reply === '智力+3', r.reply);
  ok('选择次数 +1', s.choices === 1, String(s.choices));
})();

/* ============ 3. 选项门槛 need ============ */
section('3. 选项门槛');
(function () {
  var data = {
    TALENTS: D.TALENTS, GRADES: D.GRADES,
    EVENTS: [{
      id: 'x2', minAge: 1, maxAge: 99, weight: 1, text: '门槛测试',
      options: [
        { text: '高智力专属', need: { INT: 20 }, effects: { INT: 1 } },
        { text: '谁都能选', effects: { STR: 1 } }
      ]
    }]
  };
  var s = E.createLife({ data: data, rng: E.mulberry32(2), alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, talents: [] });
  var entry = E.step(s);
  ok('属性不够时看不到高门槛选项', entry.options.length === 1, JSON.stringify(entry.options));
  ok('剩下的是无门槛选项', entry.options[0].text === '谁都能选');

  // 给足智力
  var s2 = E.createLife({ data: data, rng: E.mulberry32(2), alloc: { CHR: 0, INT: 20, STR: 0, MNY: 0 }, talents: [] });
  var e2 = E.step(s2);
  ok('属性够了就能看到高门槛选项', e2.options.length === 2, JSON.stringify(e2.options));
})();

/* ============ 4. flag 记忆 ============ */
section('4. flag 记忆与分支');
(function () {
  var data = {
    TALENTS: D.TALENTS, GRADES: D.GRADES,
    EVENTS: [{
      id: 'x3', minAge: 1, maxAge: 3, weight: 1, once: 1, text: '要不要举手',
      options: [
        { text: '举手', effects: {}, set: 'brave' },
        { text: '沉默', effects: {}, set: 'timid' }
      ]
    }, {
      id: 'x4', minAge: 4, maxAge: 99, weight: 1, once: 1, ifFlag: 'brave', text: '因为敢举手，你被推荐去演讲'
    }, {
      id: 'x5', minAge: 4, maxAge: 99, weight: 1, once: 1, ifNotFlag: 'brave', text: '你一直很安静'
    }]
  };
  var s = E.createLife({ data: data, rng: E.mulberry32(3), alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, talents: [] });
  E.step(s); E.choose(s, 0);
  ok('选择写入了 flag', s.flags.brave === true);

  var hit = null;
  for (var i = 0; i < 10 && s.alive; i++) {
    var e = E.step(s);
    if (e && e.eventId) { hit = e.eventId; break; }
    if (s.pending) E.choose(s, 0);
  }
  ok('ifFlag 分支被正确命中', hit === 'x4', String(hit));

  // 反例：沉默
  var s2 = E.createLife({ data: data, rng: E.mulberry32(3), alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, talents: [] });
  E.step(s2); E.choose(s2, 1);
  var hit2 = null;
  for (var j = 0; j < 10 && s2.alive; j++) {
    var e2 = E.step(s2);
    if (e2 && e2.eventId) { hit2 = e2.eventId; break; }
    if (s2.pending) E.choose(s2, 0);
  }
  ok('ifNotFlag 分支被正确命中', hit2 === 'x5', String(hit2));
})();

/* ============ 5. then 后续事件队列 ============ */
section('5. 后续事件排队');
(function () {
  var data = {
    TALENTS: D.TALENTS, GRADES: D.GRADES,
    EVENTS: [{
      id: 'x6', minAge: 1, maxAge: 99, weight: 1, once: 1, text: '做决定',
      options: [
        { text: '埋下伏笔', effects: {}, then: 'x7', thenDelay: 2 },
        { text: '什么也不做', effects: {} }
      ]
    }, {
      id: 'x7', queuedOnly: 1, minAge: 1, maxAge: 99, weight: 1, once: 1, text: '两年前那个决定的回响'
    }]
  };
  var s = E.createLife({ data: data, rng: E.mulberry32(4), alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, talents: [] });
  E.step(s);
  var age0 = s.age;
  E.choose(s, 0);
  ok('then 被排进队列', s.queue.length === 1, JSON.stringify(s.queue));
  ok('thenDelay 生效', s.queue[0].at === age0 + 2, 'at=' + s.queue[0].at + ' 期望 ' + (age0 + 2));

  var e1 = E.step(s);   // age0+1
  ok('延迟未到时不会提前触发', !e1 || e1.eventId !== 'x7', e1 && e1.eventId);
  if (s.pending) E.choose(s, 0);
  var e2 = E.step(s);   // age0+2
  ok('延迟到点后触发后续事件', !!e2 && e2.eventId === 'x7', e2 && e2.eventId);
})();

/* ============ 6. 死亡与寿命 ============ */
section('6. 死亡与寿命');
(function () {
  var s = makeLife(7, { alloc: { CHR: 0, INT: 0, STR: 10, MNY: 0 } });
  var weak = makeLife(7, { alloc: { CHR: 0, INT: 0, STR: 0, MNY: 0 } });
  ok('体质越高寿命越长', s.lifespan > weak.lifespan, s.lifespan + ' vs ' + weak.lifespan);
  ok('寿命不超上限 115', s.lifespan <= 115, String(s.lifespan));
  ok('寿命不低于下限 25', weak.lifespan >= 25, String(weak.lifespan));

  var done = E.runAll(makeLife(11), 200, 'random');
  ok('能正常走到死亡', !done.alive);
  ok('有死因描述', !!done.deathReason, String(done.deathReason));
  ok('死亡后 step 不再推进', E.step(done) === null);
})();

/* ============ 7. 批量模拟 ============ */
section('7. 批量模拟 ' + N + ' 局');
(function () {
  var stats = {};
  ['random', 'smart'].forEach(function (policy) {
    var ages = [], scores = [], grades = {}, stuck = 0, never = 0;
    for (var i = 1; i <= N; i++) {
      var s = makeLife(i);
      E.runAll(s, 200, policy);
      if (s.pending) stuck++;
      if (s.alive) never++;
      ages.push(s.age);
      scores.push(E.score(s));
      var g = E.rate(s).grade;
      grades[g] = (grades[g] || 0) + 1;
    }
    ages.sort(function (a, b) { return a - b; });
    scores.sort(function (a, b) { return a - b; });
    stats[policy] = { ages: ages, scores: scores, grades: grades, stuck: stuck, never: never };

    ok(policy + '：没有卡在待选状态', stuck === 0, String(stuck));
    ok(policy + '：全部走完一生', never === 0, String(never));
    ok(policy + '：寿命中位数在 45~110', ages[N >> 1] >= 45 && ages[N >> 1] <= 110, String(ages[N >> 1]));
    ok(policy + '：没有评级被某一档吃满', Object.keys(grades).length >= 3, JSON.stringify(grades));
  });

  // 好决策应当明显优于随机
  var mid = function (a) { return a[a.length >> 1]; };
  ok('认真选的分数中位数高于随机',
    mid(stats.smart.scores) > mid(stats.random.scores),
    mid(stats.smart.scores) + ' vs ' + mid(stats.random.scores));
  ok('认真选的寿命中位数高于随机',
    mid(stats.smart.ages) > mid(stats.random.ages),
    mid(stats.smart.ages) + ' vs ' + mid(stats.random.ages));

  console.log('\n  随机策略  寿命 p50=' + mid(stats.random.ages) +
    '  分数 p5=' + stats.random.scores[Math.floor(N * .05)] +
    ' p50=' + mid(stats.random.scores) +
    ' p90=' + stats.random.scores[Math.floor(N * .9)]);
  console.log('  认真策略  寿命 p50=' + mid(stats.smart.ages) +
    '  分数 p5=' + stats.smart.scores[Math.floor(N * .05)] +
    ' p50=' + mid(stats.smart.scores) +
    ' p90=' + stats.smart.scores[Math.floor(N * .9)]);
  console.log('  随机评级分布 ' + JSON.stringify(stats.random.grades));
  console.log('  认真评级分布 ' + JSON.stringify(stats.smart.grades));
})();

/* ============ 8. 确定性 ============ */
section('8. 确定性（同种子同结果）');
(function () {
  function trace(seed) {
    var s = makeLife(seed);
    var out = [];
    var guard = 0;
    while (s.alive && guard++ < 200) {
      if (s.pending) { E.choose(s, E.autoIndex(s, 'smart')); continue; }
      var e = E.step(s);
      if (e) out.push(e.age + ':' + (e.eventId || '-'));
    }
    return out.join('|') + '#' + s.age + '#' + E.score(s);
  }
  ok('同种子结果完全一致', trace(42) === trace(42));
  ok('不同种子结果不同', trace(42) !== trace(43));
})();

/* ============ 9. 评级表 ============ */
section('9. 评级表');
(function () {
  var mins = D.GRADES.map(function (g) { return g.min; });
  var desc = mins.every(function (v, i) { return i === 0 || mins[i - 1] > v; });
  ok('评级阈值严格递减', desc, mins.join(','));
  ok('最低档从 0 开始', mins[mins.length - 1] === 0);

  var fake = { data: D, attrs: { CHR: 0, INT: 0, STR: 0, MNY: 0 }, age: 0 };
  ok('最低分拿到 E', E.rate(fake).grade === 'E', E.rate(fake).grade);
})();

console.log('\n' + (fail === 0 ? '全部通过' : '有失败项') + '：' + pass + ' 通过 / ' + fail + ' 失败\n');
process.exit(fail === 0 ? 0 : 1);
