/* 人生重开模拟器 · 批量模拟与数据校验
 * 用法: node test/sim.js [n=20000]
 * 校验:数据结构、事件覆盖、死亡可达、属性不越界、评级分布
 */
'use strict';

const E = require('../js/engine.js');
const D = require('../js/data.js');

let failures = 0;
function ok(cond, msg) {
  if (cond) console.log('  OK   ' + msg);
  else { console.log('  FAIL ' + msg); failures++; }
}

/* ================= 1. 数据校验 ================= */
console.log('\n【数据校验】');

const VALID_ATTR = new Set(E.ATTRS);
const ids = new Set();
let badEvent = 0, badEffect = 0;
for (const ev of D.EVENTS) {
  if (ids.has(ev.id)) { console.log('  重复 id: ' + ev.id); badEvent++; }
  ids.add(ev.id);
  if (!(ev.minAge >= 0) || !(ev.maxAge >= ev.minAge)) { console.log('  年龄区间非法: ' + ev.id); badEvent++; }
  if (!(ev.weight > 0)) { console.log('  权重非法: ' + ev.id); badEvent++; }
  if (ev.text === undefined) { console.log('  缺少文本: ' + ev.id); badEvent++; }
  for (const k in (ev.effects || {})) {
    if (!VALID_ATTR.has(k)) { console.log('  未知属性 ' + k + ' in ' + ev.id); badEffect++; }
  }
  for (const k in (ev.cond || {})) {
    if (k !== 'sex' && !VALID_ATTR.has(k)) { console.log('  未知条件属性 ' + k + ' in ' + ev.id); badEffect++; }
  }
}
ok(badEvent === 0, `事件池 ${D.EVENTS.length} 条，id/区间/权重/文本均合法`);
ok(badEffect === 0, '所有效果与条件的属性名合法');

const talentIds = new Set();
let badTalent = 0;
for (const t of D.TALENTS) {
  if (talentIds.has(t.id)) badTalent++;
  talentIds.add(t.id);
  for (const k in t.effects) if (!VALID_ATTR.has(k)) { console.log('  未知属性 ' + k + ' in ' + t.id); badTalent++; }
}
ok(badTalent === 0, `天赋 ${D.TALENTS.length} 条全部合法`);

// 每个年龄段都要有事件可抽，否则会大量出现"平常"
let gaps = [];
for (let age = 1; age <= 95; age++) {
  const hit = D.EVENTS.some(ev => age >= ev.minAge && age <= ev.maxAge && !ev.kill);
  if (!hit) gaps.push(age);
}
ok(gaps.length === 0, gaps.length ? `以下年龄没有事件可抽: ${gaps.join(',')}` : '1~95 岁每年都有事件可抽');

const gradeOk = D.GRADES.every((g, i) => i === 0 || g.min < D.GRADES[i - 1].min);
ok(gradeOk, '评级阈值严格递减');

/* ================= 2. 批量模拟 ================= */
const N = Number(process.argv[2] || 20000);
console.log(`\n【批量模拟 ${N} 次】`);

const rows = [];
let nan = 0, negAttr = 0, aliveAtEnd = 0, overGuard = 0;

for (let i = 0; i < N; i++) {
  const rng = E.mulberry32((i * 2654435761) % 2147483647 + 1);

  // 随机选 3 个天赋
  const drawn = E.drawTalents(D, rng);
  const picked = [];
  while (picked.length < E.TALENT_PICK && drawn.length) {
    picked.push(drawn.splice(Math.floor(rng() * drawn.length), 1)[0]);
  }

  // 随机分配 20 点
  const alloc = { CHR: 0, INT: 0, STR: 0, MNY: 0 };
  let left = E.POINTS;
  while (left > 0) {
    const k = E.ATTRS[Math.floor(rng() * E.ATTRS.length)];
    if (alloc[k] >= E.ATTR_CAP_BIRTH) continue;
    alloc[k]++; left--;
  }

  const game = E.createLife({ data: D, rng, alloc, talents: picked });
  E.runAll(game, 200);

  if (game.alive) aliveAtEnd++;
  if (game.age > 200) overGuard++;

  for (const k of E.ATTRS) {
    const v = game.attrs[k];
    if (!Number.isFinite(v)) nan++;
    if (v < 0) negAttr++;
  }

  const r = E.rate(game);
  if (!Number.isFinite(r.score)) nan++;

  rows.push({ age: game.age, score: r.score, grade: r.grade, attrs: { ...game.attrs }, lifespan: game.lifespan });
}

const pct = (arr, p) => arr[Math.floor(arr.length * p)];
const sorted = (f) => rows.map(f).sort((a, b) => a - b);

const ages = sorted(r => r.age);
const scores = sorted(r => r.score);

console.log('  寿命  p5=' + pct(ages, .05) + '  p25=' + pct(ages, .25) +
  '  p50=' + pct(ages, .50) + '  p75=' + pct(ages, .75) +
  '  p95=' + pct(ages, .95) + '  max=' + ages[ages.length - 1]);
console.log('  评分  p5=' + pct(scores, .05) + '  p25=' + pct(scores, .25) +
  '  p50=' + pct(scores, .50) + '  p75=' + pct(scores, .75) +
  '  p95=' + pct(scores, .95) + '  max=' + scores[scores.length - 1]);

const avgAge = (rows.reduce((s, r) => s + r.age, 0) / N).toFixed(1);
console.log('  平均寿命 ' + avgAge + ' 岁');

console.log('\n  评级分布:');
for (const g of D.GRADES) {
  const c = rows.filter(r => r.grade === g.grade).length;
  const p = (c / N * 100);
  const bar = '█'.repeat(Math.round(p / 2));
  console.log(`    ${g.grade.padEnd(4)} ${g.title.padEnd(3)} ${p.toFixed(2).padStart(6)}%  ${bar}`);
}

/* ================= 3. 断言 ================= */
console.log('\n【断言】');
ok(aliveAtEnd === 0, '每一次人生都会结束（无不死循环）');
ok(overGuard === 0, '没有触及 200 年保护上限');
ok(nan === 0, '没有 NaN / Infinity 数值');
ok(negAttr === 0, '属性从未出现负值');
ok(pct(ages, .50) >= 50 && pct(ages, .50) <= 90, '中位寿命落在 50~90 岁的合理区间');
ok(ages[0] >= 1, '最短寿命至少 1 岁');
ok(scores[scores.length - 1] > scores[0], '评分有区分度');

// 评级不应出现「单一等级占九成」的塌缩
const top = D.GRADES.map(g => rows.filter(r => r.grade === g.grade).length / N).sort((a, b) => b - a)[0];
ok(top < 0.6, '最高占比等级不超过 60%（评级没有塌缩）');

// 天赋确实影响结果：高家境天赋 vs 低家境天赋，平均评分应更高
function runWith(talentId, times) {
  let sum = 0;
  for (let i = 0; i < times; i++) {
    const rng = E.mulberry32(i + 7777);
    const t = D.TALENTS.find(x => x.id === talentId);
    const game = E.createLife({ data: D, rng, alloc: { CHR: 5, INT: 5, STR: 5, MNY: 5 }, talents: [t] });
    E.runAll(game);
    sum += E.rate(game).score;
  }
  return sum / times;
}
const rich = runWith('T07', 3000);   // 含着金汤匙
const poor = runWith('T08', 3000);   // 家徒四壁
console.log(`  含着金汤匙 平均 ${rich.toFixed(1)} / 家徒四壁 平均 ${poor.toFixed(1)}`);
ok(rich > poor + 5, '家境类天赋对结局有可辨识的影响');

console.log('\n' + (failures ? `✗ ${failures} 项未通过` : '✓ 全部通过'));
process.exit(failures ? 1 : 0);
