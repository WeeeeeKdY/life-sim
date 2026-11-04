/* 人生重开模拟器 · 内容库
 * TALENTS  天赋（出生时加成）
 * EVENTS   人生事件池（按年龄段 + 属性条件筛选，权重抽取）
 * GRADES   结局评级（按总分从高到低匹配）
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LIFE_DATA = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
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

  /* ================= 事件池 ================= */
  var EVENTS = [
    /* ---- 婴幼儿 1-3 ---- */
    { id: 'b01', minAge: 1, maxAge: 2, weight: 10, once: 1, text: '你学会了走路，摇摇晃晃扑进妈妈怀里。', effects: { STR: 1 }, tags: ['成长'] },
    { id: 'b02', minAge: 1, maxAge: 3, weight: 7, once: 1, text: '你开口说的第一个词是"不要"。全家笑了一整天。', effects: { INT: 1 }, tags: ['成长'] },
    { id: 'b03', minAge: 1, maxAge: 3, weight: 5, text: '你半夜哭闹不止，父母轮流抱着你在客厅转圈。', effects: { STR: -1 }, tags: ['家庭'] },
    { id: 'b04', minAge: 2, maxAge: 4, weight: 5, once: 1, text: '你把遥控器丢进了鱼缸，全家捞了半小时。', effects: { INT: 1, MNY: -1 }, tags: ['日常'] },
    { id: 'b05', minAge: 1, maxAge: 5, weight: 4, text: '你发了一场高烧，烧到三十九度，母亲一夜没合眼。', effects: { STR: -1 }, tags: ['健康'] },
    { id: 'b06', minAge: 1, maxAge: 4, weight: 6, text: '邻居阿姨说你眉眼像妈妈，将来一定有出息。', effects: { CHR: 1 }, tags: ['日常'] },
    { id: 'b07', minAge: 2, maxAge: 5, weight: 4, once: 1, text: '你从沙发上翻下来，磕破了额头，留下一个小小的疤。', effects: { STR: -1, CHR: -1 }, tags: ['意外'] },
    { id: 'b08', minAge: 2, maxAge: 6, weight: 5, once: 1, text: '你第一次吃冰淇淋，被冰得直皱眉头，然后又伸出舌头。', effects: { CHR: 1 }, tags: ['日常'] },

    { id: 'b09', minAge: 1, maxAge: 6, weight: 6, text: '你胃口很好，一顿能吃两大碗，个子比同龄人窜得快。', effects: { STR: 1 }, tags: ['健康'] },
    { id: 'b10', minAge: 1, maxAge: 6, weight: 5, text: '你被养得白白胖胖，抱起来沉甸甸的，邻居都爱捏你的脸。', effects: { STR: 1, CHR: 1 }, tags: ['健康'] },

    /* ---- 幼儿园 4-6 ---- */
    { id: 'k01', minAge: 4, maxAge: 6, weight: 5, once: 1, text: '你在幼儿园抢了小朋友的玩具，被老师叫到一边说了很久。', effects: { CHR: -1 }, tags: ['成长'] },
    { id: 'k02', minAge: 4, maxAge: 7, weight: 6, once: 1, text: '老师把你的画贴在了墙上，你骄傲了整整一个星期。', effects: { INT: 1, CHR: 1 }, tags: ['成长'] },
    { id: 'k03', minAge: 4, maxAge: 6, weight: 5, text: '午睡时你把被子蒙在头上装睡，其实一直在数窗帘上的花。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 'k04', minAge: 4, maxAge: 6, weight: 4, once: 1, text: '你自己穿鞋，穿反了，就这样走了一整天。', effects: { INT: 1 }, tags: ['成长'] },
    { id: 'k05', minAge: 5, maxAge: 7, weight: 4, once: 1, text: '六一表演你唱跑调了，台下笑成一片，你跟着一起笑。', effects: { CHR: -1 }, tags: ['日常'] },
    { id: 'k06', minAge: 4, maxAge: 8, weight: 4, text: '你被小朋友推倒，膝盖磕出了血，回家路上一直没哭。', effects: { STR: -1 }, tags: ['意外'] },
    { id: 'k07', minAge: 5, maxAge: 8, weight: 5, once: 1, text: '你养了一缸小金鱼，每天早上起来先数一遍，一条都不能少。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 'k08', minAge: 5, maxAge: 9, weight: 5, once: 1, text: '你在小区里跑得最快，被大家叫做"小飞侠"。', effects: { STR: 1 }, tags: ['成长'] },
    { id: 'k09', minAge: 4, maxAge: 12, weight: 6, text: '你每天放学都在操场上疯跑，晒得黑黑的，回家饭量大得吓人。', effects: { STR: 1 }, tags: ['健康'] },

    /* ---- 小学 7-12 ---- */
    { id: 'p01', minAge: 7, maxAge: 11, weight: 6, once: 1, cond: { INT: [5, 99] }, text: '第一次期末考试，你考了班级前三，奖状被贴在客厅最显眼的地方。', effects: { INT: 1 }, tags: ['学业'] },
    { id: 'p02', minAge: 7, maxAge: 11, weight: 6, once: 1, cond: { INT: [0, 4] }, text: '第一次期末考试，家长签名的时候，笔尖在纸上停了很久。', effects: { INT: -1 }, tags: ['学业'] },
    { id: 'p03', minAge: 8, maxAge: 11, weight: 5, once: 1, cond: { CHR: [5, 99] }, text: '你被选为班长，第一次站在讲台上管四十个人。', effects: { CHR: 1, INT: 1 }, tags: ['成长'] },
    { id: 'p04', minAge: 7, maxAge: 12, weight: 4, once: 1, text: '你在操场摔断了胳膊，打了三个月石膏，全班在你的石膏上签名。', effects: { STR: -1 }, tags: ['意外'] },
    { id: 'p05', minAge: 8, maxAge: 12, weight: 5, once: 1, text: '妈妈给你报了奥数班，周末全泡在教室里，你偷偷在草稿纸上画小人。', effects: { INT: 2, STR: -1 }, tags: ['学业'] },
    { id: 'p06', minAge: 8, maxAge: 12, weight: 4, once: 1, text: '你偷偷抄了同桌的作业，被老师发现，两个人都被留下。', effects: { INT: -1, CHR: -1 }, tags: ['学业'] },
    { id: 'p07', minAge: 7, maxAge: 12, weight: 5, text: '你在课堂上睡着了，被粉笔头砸醒，全班都在笑。', effects: { INT: -1 }, tags: ['日常'] },
    { id: 'p08', minAge: 8, maxAge: 12, weight: 4, once: 1, text: '同学给你起了个难听的外号，你为此气了一整个学期。', effects: { CHR: -1 }, tags: ['成长'] },
    { id: 'p09', minAge: 8, maxAge: 12, weight: 5, once: 1, text: '你拿到了"三好学生"，奖状贴在床头，睡前要看一眼。', effects: { INT: 1, CHR: 1 }, tags: ['学业'] },
    { id: 'p10', minAge: 9, maxAge: 13, weight: 4, once: 1, text: '你暗恋同桌，偷偷把橡皮借给对方，一节课都没舍得要回来。', effects: { CHR: 1 }, tags: ['成长'] },
    { id: 'p11', minAge: 8, maxAge: 13, weight: 5, once: 1, text: '你戴上了第一副眼镜，才发现黑板上的字原来是这样的。', effects: { INT: 1, CHR: -1 }, tags: ['健康'] },
    { id: 'p12', minAge: 9, maxAge: 14, weight: 4, once: 1, cond: { MNY: [5, 99] }, text: '家里买了第一台电脑，你学会了自己装系统，成了同学眼里的高手。', effects: { INT: 1, MNY: 1 }, tags: ['日常'] },
    { id: 'p13', minAge: 9, maxAge: 14, weight: 4, cond: { MNY: [0, 4] }, text: '暑假你在家里的店里守柜台，第一次知道钱是这么挣来的。', effects: { MNY: 1, STR: 1 }, tags: ['家庭'] },
    { id: 'p14', minAge: 7, maxAge: 13, weight: 3, text: '你和小伙伴在河边玩到天黑，回家挨了一顿骂，但那天很开心。', effects: { STR: 1 }, tags: ['日常'] },

    /* ---- 中学 13-18 ---- */
    { id: 't01', minAge: 13, maxAge: 17, weight: 6, once: 1, text: '你熬夜打游戏，月考排名掉了三十名，手机被没收了一个月。', effects: { INT: -1, STR: -1 }, tags: ['学业'] },
    { id: 't02', minAge: 13, maxAge: 17, weight: 5, once: 1, text: '你遇到一位很好的老师，她说你"眼里有光"，你记了很多年。', effects: { INT: 1, CHR: 1 }, tags: ['成长'] },
    { id: 't03', minAge: 13, maxAge: 18, weight: 4, text: '你在篮球场上扭伤了脚踝，一瘸一拐走了半个月。', effects: { STR: -1 }, tags: ['意外'] },
    { id: 't04', minAge: 14, maxAge: 18, weight: 5, once: 1, text: '你收到一封没有署名的信，只写了一句话，你反复看了很多遍。', effects: { CHR: 1 }, tags: ['成长'] },
    { id: 't05', minAge: 13, maxAge: 18, weight: 6, text: '你和父母大吵一架，摔门而出，在楼下坐到路灯亮起来。', effects: { CHR: -1 }, tags: ['家庭'] },
    { id: 't06', minAge: 15, maxAge: 18, weight: 4, once: 1, text: '你偷偷谈恋爱被班主任叫去办公室，谈话持续了两节课。', effects: { CHR: 1, INT: -1 }, tags: ['成长'] },
    { id: 't07', minAge: 14, maxAge: 18, weight: 5, text: '你每天刷题到凌晨一点，视力又降了，镜片越来越厚。', effects: { INT: 1, STR: -1 }, tags: ['学业'] },
    { id: 't08', minAge: 15, maxAge: 18, weight: 4, once: 1, cond: { INT: [7, 99] }, text: '你参加了学科竞赛，拿了省级奖项，名字被写在学校的光荣榜上。', effects: { INT: 2 }, tags: ['学业'] },
    { id: 't09', minAge: 13, maxAge: 18, weight: 4, text: '你在运动会上跑三千米，最后一名，但全班都在终点喊你的名字。', effects: { STR: 1 }, tags: ['成长'] },
    { id: 't10', minAge: 13, maxAge: 17, weight: 3, once: 1, text: '你被同学孤立了一个学期，走廊上没人跟你说话。', effects: { CHR: -1, INT: -1 }, tags: ['成长'] },
    { id: 't11', minAge: 13, maxAge: 18, weight: 3, once: 1, cond: { MNY: [0, 4] }, text: '家里出了变故，父母的眉头一直没松开，你开始懂事得很早。', effects: { MNY: -2, INT: 1 }, tags: ['家庭'] },
    { id: 't12', minAge: 14, maxAge: 18, weight: 4, once: 1, text: '你自己去理发店，剪了一个糟糕的发型，戴了一个月帽子。', effects: { CHR: -1 }, tags: ['日常'] },
    { id: 't13', minAge: 16, maxAge: 18, weight: 3, text: '你在晚自习后一个人走回家，路灯把你的影子拉得很长。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 't14', minAge: 13, maxAge: 30, weight: 6, text: '你养成了早睡早起的习惯，跑两圈也不喘了。', effects: { STR: 1 }, tags: ['健康'] },
    { id: 't15', minAge: 15, maxAge: 30, weight: 5, text: '你练出了一点肌肉，旧衣服忽然合身了，走路也直了。', effects: { STR: 1, CHR: 1 }, tags: ['健康'] },

    /* ---- 高考 18 ---- */
    { id: 'g01', minAge: 18, maxAge: 18, weight: 500, once: 1, cond: { INT: [8, 99] }, text: '高考放榜，你的名字出现在重点大学的录取名单上，母亲在厨房哭了。', effects: { INT: 2, MNY: 1, CHR: 1 }, tags: ['学业', '里程碑'] },
    { id: 'g02', minAge: 18, maxAge: 18, weight: 500, once: 1, cond: { INT: [5, 7] }, text: '高考放榜，你考上了一所普通本科，说不上满意，但也算松了口气。', effects: { INT: 1 }, tags: ['学业', '里程碑'] },
    { id: 'g03', minAge: 18, maxAge: 18, weight: 500, once: 1, cond: { INT: [0, 4] }, text: '高考放榜，你落榜了。你在房间里坐了一整天，最后决定复读。', effects: { INT: 1, STR: -1 }, tags: ['学业', '里程碑'] },

    /* ---- 青年 19-25 ---- */
    { id: 'y01', minAge: 19, maxAge: 21, weight: 6, once: 1, text: '你第一次离开家，拖着行李箱站在宿舍楼下，抬头数了几遍窗户。', effects: { INT: 1 }, tags: ['成长'] },
    { id: 'y02', minAge: 19, maxAge: 22, weight: 6, once: 1, text: '你加入了社团，认识了这辈子最好的几个朋友。', effects: { CHR: 1, INT: 1 }, tags: ['成长'] },
    { id: 'y03', minAge: 19, maxAge: 22, weight: 5, once: 1, text: '你挂了两门课，暑假留在学校补考，教室里只有风扇的声音。', effects: { INT: -1 }, tags: ['学业'] },
    { id: 'y04', minAge: 19, maxAge: 24, weight: 4, once: 1, text: '你开始健身，坚持了三个月，第一次看见自己的腹肌。', effects: { STR: 2 }, tags: ['健康'] },
    { id: 'y05', minAge: 19, maxAge: 25, weight: 5, once: 1, text: '你的初恋结束了。你在操场坐到天亮，然后照常去上课。', effects: { CHR: -1, STR: -1 }, tags: ['情感'] },
    { id: 'y06', minAge: 19, maxAge: 24, weight: 5, once: 1, text: '你做了第一份兼职，拿到工资那天请全家吃了一顿饭。', effects: { MNY: 1, INT: 1 }, tags: ['事业'] },
    { id: 'y07', minAge: 20, maxAge: 25, weight: 4, once: 1, text: '你熬夜做了一个项目，拿了一个不大的奖，简历上多了一行。', effects: { INT: 1, STR: -1 }, tags: ['学业'] },
    { id: 'y08', minAge: 21, maxAge: 25, weight: 4, once: 1, cond: { INT: [5, 99] }, text: '你决定考研，在图书馆占了一整年的座位，桌上贴满了便利贴。', effects: { INT: 2, STR: -1 }, tags: ['学业'] },
    { id: 'y09', minAge: 22, maxAge: 25, weight: 5, once: 1, text: '你开始投简历，面试了十几家公司，最后签了一份说不上喜欢的工作。', effects: { INT: 1, MNY: 1 }, tags: ['事业'] },
    { id: 'y10', minAge: 19, maxAge: 23, weight: 3, once: 1, text: '你染了一头很张扬的颜色，走在路上回头率很高。', effects: { CHR: 1 }, tags: ['日常'] },
    { id: 'y11', minAge: 19, maxAge: 25, weight: 4, once: 1, text: '你学会了做饭，虽然只会一道番茄炒蛋，但做得很认真。', effects: { INT: 1, STR: 1 }, tags: ['日常'] },
    { id: 'y12', minAge: 20, maxAge: 25, weight: 3, once: 1, cond: { INT: [6, 99] }, text: '你在网上写了一篇东西，意外地火了，评论区吵了三千楼。', effects: { CHR: 1, INT: 1 }, tags: ['事业'] },
    { id: 'y13', minAge: 19, maxAge: 25, weight: 3, text: '你在深夜的宿舍阳台上，第一次认真想了想"以后要做什么"。', effects: { INT: 1 }, tags: ['成长'] },

    /* ---- 壮年 26-40 ---- */
    { id: 'a01', minAge: 26, maxAge: 38, weight: 5, text: '你换了工作，薪水涨了三成，也多了加不完的班。', effects: { MNY: 2, STR: -1 }, tags: ['事业'] },
    { id: 'a02', minAge: 27, maxAge: 38, weight: 4, once: 1, cond: { INT: [7, 99] }, text: '你升职了，成为团队里最年轻的主管，开会时开始有人记你说的话。', effects: { MNY: 2, INT: 1 }, tags: ['事业'] },
    { id: 'a03', minAge: 26, maxAge: 45, weight: 3, text: '公司裁员，你在名单上。你抱着纸箱走出写字楼，阳光刺眼。', effects: { MNY: -2, STR: -1 }, tags: ['事业'] },
    { id: 'a04', minAge: 26, maxAge: 35, weight: 4, once: 1, text: '你结婚了。仪式不大，但那天你一直在笑。', effects: { CHR: 1, MNY: 1 }, tags: ['情感', '里程碑'] },
    { id: 'a05', minAge: 27, maxAge: 38, weight: 4, once: 1, text: '你有了孩子。第一次抱他的时候，你的手一直在抖。', effects: { MNY: -1, CHR: 1, INT: 1 }, tags: ['家庭', '里程碑'] },
    { id: 'a06', minAge: 28, maxAge: 40, weight: 4, once: 1, cond: { MNY: [4, 99] }, text: '你买了房，签下三十年的贷款，钥匙握在手里沉甸甸的。', effects: { MNY: 2, STR: -1 }, tags: ['家庭', '里程碑'] },
    { id: 'a07', minAge: 27, maxAge: 38, weight: 3, once: 1, text: '你辞职创业，两年后关门大吉，欠的钱还了三年。', effects: { MNY: -3, INT: 1 }, tags: ['事业'] },
    { id: 'a08', minAge: 30, maxAge: 45, weight: 5, text: '你开始脱发，买的洗发水越来越贵，效果越来越差。', effects: { CHR: -1, MNY: -1 }, tags: ['健康'] },
    { id: 'a09', minAge: 28, maxAge: 50, weight: 3, text: '父母生了场大病，你在医院走廊的长椅上睡了半个月。', effects: { MNY: -2, STR: -1 }, tags: ['家庭'] },
    { id: 'a10', minAge: 28, maxAge: 40, weight: 3, once: 1, text: '你独自去了一趟很远的地方，回来后话变少了，但眼神清亮了。', effects: { INT: 1 }, tags: ['成长'] },
    { id: 'a11', minAge: 28, maxAge: 40, weight: 4, once: 1, text: '你学会了拒绝别人，日子忽然轻松了一些。', effects: { INT: 1 }, tags: ['成长'] },
    { id: 'a12', minAge: 30, maxAge: 45, weight: 4, once: 1, text: '有年轻人叫你"老师"，你愣了两秒才应声。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 'a13', minAge: 27, maxAge: 42, weight: 4, once: 1, text: '你养了一只猫，它只在饿的时候理你，你却觉得这样很好。', effects: { CHR: 1 }, tags: ['日常'] },
    { id: 'a14', minAge: 26, maxAge: 40, weight: 3, text: '你在加班的深夜点了外卖，一个人吃完，然后继续改方案。', effects: { MNY: 1, STR: -1 }, tags: ['事业'] },
    { id: 'a15', minAge: 26, maxAge: 60, weight: 6, text: '你戒了熬夜和应酬，去体检时医生说各项都挺好。', effects: { STR: 1 }, tags: ['健康'] },
    { id: 'a16', minAge: 28, maxAge: 65, weight: 5, text: '你开始每天散步一小时，体重慢慢回到了十年前的样子。', effects: { STR: 1 }, tags: ['健康'] },
    { id: 'a17', minAge: 26, maxAge: 55, weight: 4, text: '你把酒局都推了，周末去爬山，回来睡得特别沉。', effects: { STR: 1 }, tags: ['健康'] },

    /* ---- 中年 41-60 ---- */
    { id: 'm01', minAge: 41, maxAge: 55, weight: 4, once: 1, text: '你的孩子考上了大学，你在车站送他，车开远了还站在原地。', effects: { MNY: 1, CHR: 1 }, tags: ['家庭', '里程碑'] },
    { id: 'm02', minAge: 42, maxAge: 55, weight: 4, once: 1, cond: { INT: [7, 99] }, text: '你升任管理层，会议从早开到晚，你开始怀念做具体事情的日子。', effects: { MNY: 2, STR: -1 }, tags: ['事业'] },
    { id: 'm03', minAge: 40, maxAge: 58, weight: 4, text: '体检查出三高，医生说少熬夜、少喝酒，你点头，然后忘了。', effects: { STR: -1 }, tags: ['健康'] },
    { id: 'm04', minAge: 40, maxAge: 58, weight: 4, once: 1, text: '你开始跑马拉松，第一次跑完半程，在终点蹲下来喘了很久。', effects: { STR: 2 }, tags: ['健康'] },
    { id: 'm05', minAge: 45, maxAge: 60, weight: 4, once: 1, text: '父母相继离世。你成了家里最老的那一辈，忽然明白了一些事。', effects: { STR: -1, INT: 1 }, tags: ['家庭', '里程碑'] },
    { id: 'm06', minAge: 42, maxAge: 60, weight: 4, once: 1, text: '你重新拾起年轻时的爱好，画了一屋子画，一幅也没卖。', effects: { CHR: 1, INT: 1 }, tags: ['日常'] },
    { id: 'm07', minAge: 45, maxAge: 58, weight: 3, once: 1, text: '你辞了职，去一个陌生的城市住了半年，谁也不认识你。', effects: { INT: 2, MNY: -1 }, tags: ['成长'] },
    { id: 'm08', minAge: 45, maxAge: 60, weight: 4, text: '你被调去了边缘部门，慢慢闲了下来，反而睡得着了。', effects: { MNY: -1, STR: 1 }, tags: ['事业'] },
    { id: 'm09', minAge: 44, maxAge: 58, weight: 4, once: 1, text: '你开始带徒弟，把自己会的都教了出去，一点没留。', effects: { INT: 1, CHR: 1 }, tags: ['事业'] },
    { id: 'm10', minAge: 45, maxAge: 60, weight: 4, text: '同学会上，你发现大家都老了，聊的都是血压和孩子的分数。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 'm11', minAge: 41, maxAge: 60, weight: 3, text: '你在深夜翻到一张很旧的照片，看了很久，然后放回原处。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 'm12', minAge: 41, maxAge: 65, weight: 5, text: '你开始注意饮食，少盐少油，身体轻快了一些。', effects: { STR: 1 }, tags: ['健康'] },

    /* ---- 老年 61+ ---- */
    { id: 'o01', minAge: 61, maxAge: 70, weight: 6, once: 1, text: '你退休了，第一天睡到自然醒，醒来有点不知道做什么。', effects: { STR: 1 }, tags: ['里程碑'] },
    { id: 'o02', minAge: 61, maxAge: 90, weight: 5, text: '你每天在公园下棋，赢多输少，输了就说今天风大。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 'o03', minAge: 62, maxAge: 78, weight: 5, once: 1, text: '你抱上了孙辈，笑得合不拢嘴，把藏了很久的糖拿了出来。', effects: { CHR: 1 }, tags: ['家庭', '里程碑'] },
    { id: 'o04', minAge: 65, maxAge: 90, weight: 5, text: '你在浴室摔了一跤，躺了两个月，之后走路慢了很多。', effects: { STR: -2 }, tags: ['健康'] },
    { id: 'o05', minAge: 65, maxAge: 85, weight: 4, once: 1, text: '你开始写回忆录，写了一百页就停了，因为很多细节记不清了。', effects: { INT: 1 }, tags: ['日常'] },
    { id: 'o06', minAge: 68, maxAge: 95, weight: 5, text: '你开始忘记一些名字，包括昨天见过的那个人。', effects: { INT: -1 }, tags: ['健康'] },
    { id: 'o07', minAge: 65, maxAge: 95, weight: 5, text: '你坐在夕阳里，把这一生从头想了一遍，觉得也还行。', effects: { CHR: 1 }, tags: ['日常'] },
    { id: 'o08', minAge: 70, maxAge: 95, weight: 4, text: '老友们一个个走了，能打电话的人越来越少。', effects: { STR: -1 }, tags: ['情感'] },
    { id: 'o09', minAge: 75, maxAge: 99, weight: 3, text: '你每天早上去同一家早餐店，老板已经不用问你吃什么了。', effects: { STR: 1 }, tags: ['日常'] },

    /* ---- 特殊 / 条件 ---- */
    { id: 's01', minAge: 20, maxAge: 65, weight: 1, once: 1, text: '你随手买的一张彩票中了头奖，你在客厅里坐了一整晚没敢告诉任何人。', effects: { MNY: 8 }, tags: ['意外'] },
    { id: 's02', minAge: 8, maxAge: 70, weight: 2, once: 1, text: '你在路上捡到一个钱包，还给了失主，对方愣了很久。', effects: { CHR: 1 }, tags: ['日常'] },
    { id: 's03', minAge: 22, maxAge: 60, weight: 2, once: 1, text: '你被人骗了一笔钱，数额不小，你学会了看合同上的每一行小字。', effects: { MNY: -3, INT: 1 }, tags: ['意外'] },
    { id: 's04', minAge: 18, maxAge: 75, weight: 1, once: 1, text: '你遭遇了一场车祸，在医院躺了很久，出院后看什么都顺眼了。', effects: { STR: -3, INT: 1 }, tags: ['意外'] },
    { id: 's05', minAge: 25, maxAge: 60, weight: 2, once: 1, cond: { INT: [9, 99] }, text: '你的名字被写进了某个行业的名单里，多年后还有人引用你的话。', effects: { INT: 2, MNY: 3 }, tags: ['事业'] },
    { id: 's06', minAge: 10, maxAge: 80, weight: 2, once: 1, text: '你帮过一个陌生人，很多年后他辗转找到你，只为说一句谢谢。', effects: { CHR: 1, INT: 1 }, tags: ['日常'] },
    { id: 's07', minAge: 16, maxAge: 45, weight: 2, text: '你把自己关在房间里整整一周，谁也不见，出来的时候瘦了一圈。', effects: { STR: -1, INT: -1 }, tags: ['健康'] },
    { id: 's08', minAge: 25, maxAge: 70, weight: 1.5, once: 1, text: '你做了一个很长很长的梦，醒来之后觉得一切都值得。', effects: { CHR: 2 }, tags: ['成长'] },
    { id: 's09', minAge: 12, maxAge: 60, weight: 1, once: 1, cond: { MNY: [0, 3] }, text: '你靠着一股不服气的劲，硬生生把自己从原地拔出来了一点。', effects: { INT: 2, MNY: 2 }, tags: ['成长'] },

    /* ---- 终局事件 ---- */
    { id: 'd01', minAge: 55, maxAge: 99, weight: 0.05, once: 1, text: '你病倒了，再也没能起来。', kill: '一场病，带走了你', tags: ['终局'] },
    { id: 'd02', minAge: 20, maxAge: 99, weight: 0.03, once: 1, text: '一场意外突然降临，没来得及告别。', kill: '一场意外，戛然而止', tags: ['终局'] }
  ];

  /* ================= 评级 ================= */
  var GRADES = [
    { min: 132, grade: 'SSS', title: '传说', desc: '这样的一生，说书人都不敢这么编。', color: '#ff5f6d' },
    { min: 124, grade: 'SS', title: '传奇', desc: '你活成了别人嘴里的故事。', color: '#ff8a5b' },
    { min: 117, grade: 'S', title: '卓越', desc: '绝大多数人一辈子都到不了这里。', color: '#ffb03a' },
    { min: 109, grade: 'A', title: '精彩', desc: '有起伏，有高光，不虚此行。', color: '#ffd93d' },
    { min: 100, grade: 'B', title: '不错', desc: '比上不足，比下有余，挺好。', color: '#9fd356' },
    { min: 85, grade: 'C', title: '普通', desc: '和大多数人一样，平淡地过完了。', color: '#6fc3df' },
    { min: 55, grade: 'D', title: '平凡', desc: '日子紧巴，但也熬过来了。', color: '#8a94a6' },
    { min: 0, grade: 'E', title: '遗憾', desc: '好像还没来得及开始，就结束了。', color: '#6b7280' }
  ];

  return { TALENTS: TALENTS, EVENTS: EVENTS, GRADES: GRADES };
});
