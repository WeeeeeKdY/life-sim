/* 人生重开模拟器 · 内容库
 * TALENTS  天赋（出生时加成）
 * EVENTS   人生事件池（events-a/b/c 合并而成）
 * GRADES   结局评级（按总分从高到低匹配）
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LIFE_DATA = factory(root);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  /* ================= 天赋 ================= */
  var TALENTS = [
    { id: 'T01', name: '天生丽质', desc: '生下来就好看，走到哪都被多看两眼', effects: { CHR: 4 } },
    { id: 'T02', name: '长相抱歉', desc: '照镜子的时候总想换个角度', effects: { CHR: -3 } },
    { id: 'T03', name: '过目不忘', desc: '看一遍就记住，考试从不复习', effects: { INT: 4 } },
    { id: 'T04', name: '榆木脑袋', desc: '道理都懂，就是学不进去', effects: { INT: -3 } },
    { id: 'T05', name: '钢筋铁骨', desc: '从小不生病，感冒都少见', effects: { STR: 4 } },
    { id: 'T06', name: '病秧子', desc: '换季必咳，体育课永远在请假', effects: { STR: -3 } },
    { id: 'T07', name: '含着金汤匙', desc: '出生那天，家里刚换了新车', effects: { MNY: 5 } },
    { id: 'T08', name: '家徒四壁', desc: '冬天的被子薄得能看见光', effects: { MNY: -4 } },
    { id: 'T09', name: '双商在线', desc: '长得好看，脑子也好使', effects: { CHR: 2, INT: 2 } },
    { id: 'T10', name: '老天爷赏饭', desc: '天生吃这碗饭的人', effects: { CHR: 3, INT: 1 } },
    { id: 'T11', name: '体育健将', desc: '跑跳投样样行，就是文化课一般', effects: { STR: 3, CHR: 1 } },
    { id: 'T12', name: '书香门第', desc: '家里书比家具多', effects: { INT: 3, MNY: 2 } },
    { id: 'T13', name: '富二代', desc: '人生起跑线在别人的终点附近', effects: { MNY: 4, CHR: 1 } },
    { id: 'T14', name: '寒门贵子', desc: '什么都没有，只有一股狠劲', effects: { INT: 3, STR: 1, MNY: -2 } },
    { id: 'T15', name: '父母双全', desc: '饭桌上永远有四菜一汤', effects: { CHR: 1, INT: 1, STR: 1, MNY: 1 } },
    { id: 'T16', name: '独生子女', desc: '家里所有的资源都指向你', effects: { INT: 1, MNY: 1, CHR: 1 } },
    { id: 'T17', name: '家里有矿', desc: '具体有什么不说，反正不缺钱', effects: { MNY: 3, STR: 1 } },
    { id: 'T18', name: '早慧', desc: '三岁能背唐诗，五岁会算账', effects: { INT: 2 } },
    { id: 'T19', name: '童星', desc: '五岁上过一次电视，全家都记得', effects: { CHR: 2, MNY: 1 } },
    { id: 'T20', name: '混世魔王', desc: '屁股上有钉子，坐不住三分钟', effects: { STR: 2, CHR: -1 } },
    { id: 'T21', name: '心宽体胖', desc: '不操心，吃得香睡得好', effects: { STR: 2, CHR: -1 } },
    { id: 'T22', name: '天生的艺术家', desc: '看见颜色就想动手', effects: { CHR: 2, INT: 1 } },
    { id: 'T23', name: '数字天才', desc: '心算比计算器还快', effects: { INT: 3 } },
    { id: 'T24', name: '语言天赋', desc: '听两遍就会模仿口音', effects: { INT: 2, CHR: 1 } },
    { id: 'T25', name: '长寿基因', desc: '爷爷奶奶都活到了九十多', effects: { STR: 3 } },
    { id: 'T26', name: '玻璃娃娃', desc: '好看是好看，就是脆', effects: { CHR: 2, STR: -2 } },
    { id: 'T27', name: '基因彩票', desc: '所有好事都赶上了，不太讲道理', effects: { CHR: 2, INT: 2, STR: 2, MNY: 2 } },
    { id: 'T28', name: '平平无奇', desc: '丢进人堆里找不出来的那种', effects: { INT: 1, STR: 1 } },
    { id: 'T29', name: '爱笑的人', desc: '一笑眼睛就弯起来，运气也不差', effects: { CHR: 2 } },
    { id: 'T30', name: '社恐', desc: '电话响了要先做三分钟心理建设', effects: { INT: 1, CHR: -1 } },
    { id: 'T31', name: '大器晚成', desc: '现在看不出什么，以后再说', effects: { INT: 1, STR: 1, MNY: -1 } },
    { id: 'T32', name: '祖上阔过', desc: '家里还留着一只没用的银碗', effects: { MNY: 3, CHR: 1 } },
    { id: 'T33', name: '小镇做题家', desc: '笔杆子是唯一的武器', effects: { INT: 3, CHR: -1, MNY: -1 } },
    { id: 'T34', name: '山里娃', desc: '爬树掏鸟窝，脚底板比鞋结实', effects: { STR: 2, MNY: -3 } },
    { id: 'T35', name: '老来得子', desc: '父母年纪大，宠得没边', effects: { MNY: 1, CHR: -1 } },
    { id: 'T36', name: '严父慈母', desc: '一个负责打，一个负责哄', effects: { INT: 2, STR: -1 } }
  ];

  /* ================= 事件池（三份合并） ================= */
  var A, B, C;
  if (typeof module === 'object' && module.exports) {
    A = require('./events-a.js');
    B = require('./events-b.js');
    C = require('./events-c.js');
  } else {
    A = root.LIFE_EVENTS_A || [];
    B = root.LIFE_EVENTS_B || [];
    C = root.LIFE_EVENTS_C || [];
  }
  var EVENTS = [].concat(A, B, C);

  /* ================= 评级 =================
   * 阈值按实测分位数定（1000 局 / 每档策略）：
   *   摆烂 p50=68  随机 p50=104  认真 p50=155  全最优 p50=170
   * 所以：乱选落在 C/B，认真选落在 S/SS，几乎不出错才 SSS。 */
  var GRADES = [
    { min: 168, grade: 'SSS', title: '传说', desc: '这样的一生，说书人都不敢这么编。', color: '#ff5f6d' },
    { min: 158, grade: 'SS', title: '传奇', desc: '你活成了别人嘴里的故事。', color: '#ff8a5b' },
    { min: 145, grade: 'S', title: '卓越', desc: '绝大多数人一辈子都到不了这里。', color: '#ffb03a' },
    { min: 128, grade: 'A', title: '精彩', desc: '有起伏，有高光，不虚此行。', color: '#ffd93d' },
    { min: 110, grade: 'B', title: '不错', desc: '比上不足，比下有余，挺好。', color: '#9fd356' },
    { min: 92, grade: 'C', title: '普通', desc: '和大多数人一样，平淡地过完了。', color: '#6fc3df' },
    { min: 72, grade: 'D', title: '平凡', desc: '日子紧巴，但也熬过来了。', color: '#8a94a6' },
    { min: 0, grade: 'E', title: '遗憾', desc: '好像还没来得及开始，就结束了。', color: '#6b7280' }
  ];

  return { TALENTS: TALENTS, EVENTS: EVENTS, GRADES: GRADES };
});
