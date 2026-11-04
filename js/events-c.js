/* 事件池 C：壮年 / 中年 / 老年 / 特殊 / 终局（26~99 岁）
 * a01、a02 由青年期的职业选择排队触发，是「当年那个选择」的兑现。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LIFE_EVENTS_C = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return [
    /* ========== 由职业选择排队的后续事件 ========== */
    {
      id: 'a01', queuedOnly: 1, minAge: 26, maxAge: 45, weight: 1, once: 1,
      text: '进大厂第三年，你已经能独立带项目，也连续三个月没在十二点前下班。',
      tags: ['事业'],
      options: [
        { text: '再拼一把，冲晋升', effects: { MNY: 2, INT: 2, STR: -3 }, set: 'burnout-risk', reply: '你升了一级，也在体检报告上多了两项异常。' },
        { text: '开始按点下班，把生活捡回来', effects: { STR: 2, CHR: 1, MNY: -1 }, set: 'balanced', reply: '你被领导叫去谈过一次话，但你睡得好多了。' },
        { text: '跳去一家小公司做负责人', effects: { MNY: 1, INT: 1, CHR: 1 }, set: ['career-startup', '!career-big'], reply: '你成了那个说话算数的人，也成了那个睡不着的人。' }
      ]
    },
    {
      id: 'a02', queuedOnly: 1, minAge: 26, maxAge: 45, weight: 1, once: 1,
      text: '创业第三年，账上的钱只够发两个月工资。',
      tags: ['事业'],
      options: [
        { text: '抵押房子，再撑半年', effects: { MNY: -3, INT: 2, STR: -2 }, set: 'debt', reply: '你把房产证放在桌上，合伙人看了你很久。' },
        { text: '及时关掉，去找份正经工作', effects: { MNY: 1, STR: 1, CHR: -1 }, set: ['career-drift', '!career-startup'], reply: '最后一天你把白板擦干净，大家都来抱了你一下。' },
        { text: '裁掉一半人，自己不发工资', effects: { MNY: -1, INT: 1, CHR: -2 }, set: 'hard-call', reply: '你亲手通知了六个人，其中两个是你招进来的。' }
      ]
    },

    /* ================= 壮年 26-45 ================= */
    {
      id: 'a03', minAge: 28, maxAge: 45, weight: 7, once: 1,
      text: '公司裁员，名单上出现了你的名字。',
      tags: ['事业'],
      options: [
        { text: '拿赔偿走人，休息一阵', effects: { MNY: 1, STR: 1 }, set: 'laid-off', reply: '你抱着纸箱走出写字楼，阳光刺眼，居然有点轻松。' },
        { text: '去找领导争取留下', need: { CHR: 6 }, effects: { MNY: -1, CHR: 1, STR: -1 }, reply: '你留下来了，但从那以后每天都很小心。' },
        { text: '当天就投简历，别断收入', effects: { MNY: 1, INT: 1, STR: -2 }, reply: '你两周内入职了新公司，没给自己一天喘息。' }
      ]
    },
    {
      id: 'a04', minAge: 26, maxAge: 40, weight: 7,
      text: '领导找你谈话，说有个机会，但要去另一个城市。',
      tags: ['事业'],
      options: [
        { text: '去，机会难得', effects: { MNY: 2, INT: 1, CHR: -1 }, set: 'relocated', reply: '你一个人搬进新城市的出租房，夜里有点静。' },
        { text: '不去，家里走不开', effects: { CHR: 1, STR: 1 }, set: 'family-first', reply: '领导说理解，那个机会给了别人。' },
        { text: '去，但要求每月能回来一次', need: { CHR: 7 }, effects: { MNY: 1, CHR: 1, INT: 1 }, reply: '你谈成了这个条件，两头都没落下太多。' }
      ]
    },
    {
      id: 'a05', minAge: 26, maxAge: 35, weight: 9, once: 1, ifNotFlag: 'married',
      text: '恋爱谈到第三年，对方问你：「我们什么时候结婚？」',
      tags: ['情感', '里程碑'],
      options: [
        { text: '结，就今年', effects: { CHR: 2, MNY: -2, STR: 1 }, set: 'married', then: 'a06', thenDelay: 2, reply: '婚礼那天你喝多了，记得最清楚的是母亲在台下抹眼泪。' },
        { text: '再等等，事业稳定了再说', effects: { MNY: 1, CHR: -1 }, set: 'postpone', reply: '对方说好，但你们之间从此多了一点什么。' },
        { text: '其实我不想结婚', effects: { CHR: -1, INT: 1 }, set: ['single', '!married'], reply: '你们在一个雨天分了手，谁也没吵架。' }
      ]
    },
    {
      id: 'a06', minAge: 28, maxAge: 40, weight: 6, once: 1, ifFlag: 'married',
      text: '家里开始催生。',
      tags: ['家庭'],
      options: [
        { text: '要孩子', effects: { MNY: -2, STR: -1, CHR: 1 }, set: 'parent', reply: '孩子出生那天，你在产房外站了六个小时，手是抖的。' },
        { text: '先不要，两个人过', effects: { MNY: 1, STR: 1 }, set: 'childless', reply: '你们养了一只猫，家里也算热闹。' }
      ]
    },
    {
      id: 'a07', minAge: 28, maxAge: 42, weight: 7, once: 1,
      text: '房价又涨了，中介说「再不上车就晚了」。',
      tags: ['生活'],
      options: [
        { text: '掏空积蓄加杠杆买', effects: { MNY: -3, CHR: 1, STR: -2 }, set: 'mortgage', reply: '你签完字那天晚上，躺在床上算了一夜的月供。' },
        { text: '不买，继续租', effects: { MNY: 2, CHR: -1 }, set: 'renter', reply: '你把钱留在手里，也接受了随时可能搬家的生活。' },
        { text: '买个小一点的，够住就行', effects: { MNY: -2, STR: 1 }, set: 'small-home', reply: '五十平，朝南，你觉得够了。' }
      ]
    },
    {
      id: 'a08', minAge: 28, maxAge: 50, weight: 6, once: 1,
      text: '半夜接到电话，父母其中一个进了医院。',
      tags: ['家庭'],
      options: [
        { text: '请假回去，全程陪护', effects: { MNY: -2, STR: -1, CHR: 2 }, set: 'filial', reply: '你在医院走廊的长椅上睡了半个月，也把该说的话说完了。' },
        { text: '出钱请护工，自己继续上班', effects: { MNY: -1, CHR: -1, INT: 1 }, reply: '你每天打三个电话，心里一直有个地方不踏实。' },
        { text: '兄弟姐妹轮流，你出主意', need: { INT: 6 }, effects: { INT: 1, CHR: 1 }, reply: '你把治疗方案和时间表排得清清楚楚，医生都夸。' }
      ]
    },
    {
      id: 'a09', minAge: 27, maxAge: 45, weight: 6,
      text: '同事拉你一起做个副业，说一个月能多挣不少。',
      tags: ['事业'],
      options: [
        { text: '干，晚上和周末都搭进去', effects: { MNY: 2, STR: -2, INT: 1 }, set: 'side-hustle', reply: '你真挣到了钱，也再没有过完整的周末。' },
        { text: '不干，主业做好就够', effects: { STR: 1, INT: 1 }, reply: '你把精力都放在本行上，两年后成了组里最懂的。' },
        { text: '投点钱不参与，当个股东', effects: { MNY: -1, INT: 1 }, set: 'gambler', reply: '那笔钱后来没回来，但你和同事的关系还在。' }
      ]
    },
    {
      id: 'a10', minAge: 28, maxAge: 45, weight: 6, once: 1,
      text: '参加同学聚会，当年成绩最差的那个开着好车来了。',
      tags: ['社交'],
      options: [
        { text: '真心替他高兴，聊了一晚', effects: { CHR: 2, INT: 1 }, set: 'social', reply: '他后来给你介绍了一个客户，帮了大忙。' },
        { text: '心里发酸，早早回家', effects: { CHR: -1, STR: -1 }, reply: '你在回家路上算了算自己的存款。' },
        { text: '加个微信，回头找他请教', effects: { MNY: 1, INT: 1 }, reply: '他讲的话你听进去了一半，那一半后来很值钱。' }
      ]
    },
    {
      id: 'a11', minAge: 27, maxAge: 48, weight: 6,
      text: '项目出了问题，有人把责任推到了你头上。',
      tags: ['事业'],
      options: [
        { text: '当场把证据摆出来', need: { INT: 7 }, effects: { INT: 1, CHR: -1 }, set: 'evidence', reply: '会议室安静了几秒，那个人从此不再招惹你。' },
        { text: '先认下来，私下再解释', effects: { CHR: 1, STR: -2 }, set: 'swallow', reply: '你在洗手间站了一会儿，然后回去继续改方案。' },
        { text: '吵一架，谁也别想好过', effects: { CHR: -2, STR: -1 }, reply: '事情闹到了领导那里，最后你被调去了另一个组。' }
      ]
    },
    {
      id: 'a12', minAge: 26, maxAge: 50, weight: 6,
      text: '行业在变，你熟悉的那套东西正在被淘汰。',
      tags: ['事业'],
      options: [
        { text: '下班后从头学新东西', effects: { INT: 3, STR: -1 }, set: 'learner', reply: '你熬了半年，赶在了被淘汰之前换了赛道。' },
        { text: '赌它没那么快变', effects: { MNY: 1, INT: -1 }, reply: '你多舒服了两年，然后不得不面对它真的变了。' }
      ]
    },
    {
      id: 'a13', minAge: 30, maxAge: 50, weight: 6,
      text: '你开始每天早上起来腰疼。',
      tags: ['健康'],
      options: [
        { text: '去查，认真治', effects: { MNY: -1, STR: 2 }, reply: '医生说坐太久了，给你开了一张「每天走八千步」的处方。' },
        { text: '贴点膏药忍着', effects: { STR: -2, MNY: 1 }, reply: '膏药贴了半年，疼的地方从一个变成两个。' }
      ]
    },
    {
      id: 'a14', minAge: 32, maxAge: 50, weight: 5, once: 1, ifFlag: 'parent',
      text: '孩子上小学了，老师让家长多陪。',
      tags: ['家庭'],
      options: [
        { text: '每天抽两小时陪作业', effects: { CHR: 2, MNY: -1, STR: -1 }, set: 'devoted-parent', reply: '你重新学了一遍小学数学，也听见了孩子说「爸爸/妈妈最厉害」。' },
        { text: '报班，让专业的人教', effects: { MNY: -2, CHR: 1, INT: 1 }, reply: '孩子的成绩上去了，你和他聊天的时间少了。' },
        { text: '随他去吧，童年快乐最重要', effects: { CHR: 1, STR: 1 }, set: 'relaxed-parent', reply: '你没怎么管，孩子长得很开朗。' }
      ]
    },

    /* ================= 中年 40-65 ================= */
    {
      id: 'm01', minAge: 40, maxAge: 50, weight: 8, once: 1,
      text: '四十岁这年，你突然不知道自己在为了什么忙。',
      tags: ['里程碑'],
      options: [
        { text: '请个长假，一个人出去走走', effects: { STR: 1, CHR: 1, MNY: -2 }, set: 'restart', reply: '你在外地待了十天，回来时想清楚了一件小事。' },
        { text: '不管那么多，继续挣', effects: { MNY: 2, STR: -2 }, reply: '你把疑问压下去，日子继续往前推。' },
        { text: '换个做得动的事，钱少点就少点', effects: { MNY: -1, STR: 2, CHR: 1 }, set: 'downshift', reply: '你换了份轻松的工作，第一次觉得周末是长的。' }
      ]
    },
    {
      id: 'm02', minAge: 41, maxAge: 55, weight: 6, once: 1, ifFlag: 'parent',
      text: '孩子进入叛逆期，把门关上了，什么也不说。',
      tags: ['家庭'],
      options: [
        { text: '尊重他，等他愿意开口', effects: { CHR: 1, INT: 1 }, set: 'patient-parent', reply: '半年后他自己走出来，跟你说了很多话。' },
        { text: '强行管，翻他的东西', effects: { CHR: -2, STR: -1 }, set: 'strict-parent', reply: '你们大吵一架，那道门关得更紧了。' },
        { text: '带他出去走一趟，什么也不谈', effects: { CHR: 2, MNY: -1 }, reply: '在路上第三天，他主动跟你说了学校的事。' }
      ]
    },
    {
      id: 'm03', minAge: 40, maxAge: 58, weight: 6,
      text: '体检查出三高，医生说少熬夜少喝酒。',
      tags: ['健康'],
      options: [
        { text: '真改，戒了酒', effects: { STR: 2, MNY: -1, CHR: -1 }, set: 'healthy', reply: '酒局少了，朋友也少了，但指标都回到了正常。' },
        { text: '点头，然后忘了', effects: { STR: -2, MNY: 1 }, reply: '你把报告塞进抽屉，第二年又添了两项。' }
      ]
    },
    {
      id: 'm04', minAge: 42, maxAge: 58, weight: 6, once: 1,
      text: '公司来了个比你年轻的领导。',
      tags: ['事业'],
      options: [
        { text: '配合，把位置站稳', effects: { MNY: 1, STR: -1, CHR: 1 }, reply: '你成了离不开的那个人，也学会了闭嘴。' },
        { text: '不服，跟他较劲', effects: { CHR: -2, STR: -2 }, reply: '年底你的绩效被打了低分。' },
        { text: '趁机转型，去做以前没做过的事', effects: { INT: 2, MNY: -1 }, set: 'second-act', reply: '你去了一个新部门，重新从学徒做起。' }
      ]
    },
    {
      id: 'm05', minAge: 45, maxAge: 65, weight: 5, once: 1,
      text: '一次例行检查，医生让你坐下，说发现了一个东西。',
      tags: ['健康', '里程碑'],
      options: [
        { text: '马上手术，越快越好', effects: { MNY: -3, STR: -2 }, then: 'm05a', reply: '你在手术室门口跟家人笑了一下，说没事。' },
        { text: '保守治疗，定期复查', effects: { MNY: -1, STR: -1 }, then: 'm05b', reply: '你开始每三个月去一次医院，学会了看化验单。' },
        { text: '换一家医院再查一次', effects: { MNY: -2, INT: 1 }, then: 'm05b', reply: '第二家医院的结论不完全一样，你更糊涂了。' }
      ]
    },
    {
      id: 'm05a', queuedOnly: 1, minAge: 46, maxAge: 70, weight: 1, once: 1,
      text: '手术很顺利，你在病床上醒来，窗外的树刚发芽。',
      tags: ['健康'],
      options: [
        { text: '从此把身体放在第一位', effects: { STR: 3, MNY: -1, CHR: 1 }, set: 'second-life', reply: '你戒了很多东西，也多活了很多年。' },
        { text: '好了伤疤忘了疼，回去拼命', effects: { MNY: 2, STR: -2 }, reply: '你补上了落下的工作，也透支了刚修好的身体。' }
      ]
    },
    {
      id: 'm05b', queuedOnly: 1, minAge: 46, maxAge: 72, weight: 1, once: 1,
      text: '这几年你一直在复查，指标慢慢稳住了。',
      tags: ['健康'],
      options: [
        { text: '继续保持，谨小慎微', effects: { STR: 1, MNY: -1 }, set: 'careful', reply: '你活得很小心，也很长。' },
        { text: '放松点，不想被它绑住', effects: { CHR: 1, STR: -1 }, reply: '你重新开始喝酒、旅行，日子过得有滋味。' }
      ]
    },
    {
      id: 'm06', minAge: 45, maxAge: 70, weight: 5, once: 1,
      text: '母亲走了。你整理她的抽屉，发现里面存着你小学的奖状。',
      tags: ['家庭', '里程碑'],
      options: [
        { text: '好好地哭一场，然后办完后事', effects: { CHR: 1, STR: -2 }, set: 'grief', reply: '那天之后你变了一点，说不清是哪里。' },
        { text: '一滴眼泪也没掉，把事办完', effects: { STR: -1, CHR: -1 }, set: 'numb', reply: '很久以后，你在超市看到她爱吃的点心，突然站不住了。' }
      ]
    },
    {
      id: 'm07', minAge: 42, maxAge: 60, weight: 5, once: 1, ifFlag: 'married',
      text: '你和伴侣已经很久没有认真说过话了。',
      tags: ['情感'],
      options: [
        { text: '认真谈一次，想办法修', effects: { CHR: 2, STR: -1 }, set: 'saved-marriage', reply: '你们聊到凌晨，哭了一场，也笑了一场。' },
        { text: '就这样吧，各过各的', effects: { CHR: -1, INT: 1 }, set: 'cold-marriage', reply: '同一个屋檐下，你们成了最熟的陌生人。' },
        { text: '离婚', effects: { MNY: -2, CHR: 1, STR: -1 }, set: ['divorced', '!married'], reply: '签字那天天气很好，你走出来时深吸了一口气。' }
      ]
    },
    {
      id: 'm08', minAge: 41, maxAge: 65, weight: 5,
      text: '你在公园看到一群人在打太极，节奏很慢。',
      tags: ['健康'],
      options: [
        { text: '加入他们，每天来', effects: { STR: 2, CHR: 1 }, set: 'tai-chi', reply: '你认识了几个新朋友，睡眠变好了。' },
        { text: '看一眼，继续散步', effects: { STR: 1 }, reply: '你维持着自己的节奏，不快不慢。' }
      ]
    },
    {
      id: 'm09', minAge: 43, maxAge: 62, weight: 5, once: 1,
      text: '一个多年没联系的朋友找你借钱，数目不小。',
      tags: ['社交'],
      options: [
        { text: '借，能帮就帮', effects: { MNY: -3, CHR: 2 }, set: 'lender', reply: '他千恩万谢，你把这事放下了。' },
        { text: '借一点，就当送了', need: { MNY: 6 }, effects: { MNY: -1, CHR: 1 }, reply: '你给了个不心疼的数，关系保住了，钱也不指望了。' },
        { text: '婉拒', effects: { MNY: 1, CHR: -1 }, reply: '他再没联系过你。' }
      ]
    },
    {
      id: 'm10', minAge: 45, maxAge: 62, weight: 5, once: 1,
      text: '你算了算，照这样干下去，退休金够不够。',
      tags: ['生活'],
      options: [
        { text: '开始攒养老钱，省着花', effects: { MNY: 3, CHR: -1 }, set: 'frugal', reply: '你换了更便宜的车，也换来了睡得着的晚上。' },
        { text: '趁还能挣，多投点', effects: { MNY: -1, INT: 1, STR: -1 }, set: 'gambler', reply: '你赌了一把，结果不好不坏。' },
        { text: '不管了，到时候再说', effects: { CHR: 1, MNY: -1 }, reply: '你决定先过好眼前的日子。' }
      ]
    },
    {
      id: 'm11', minAge: 41, maxAge: 60, weight: 5,
      text: '深夜你翻到一张很旧的照片，看了很久。',
      tags: ['日常'],
      options: [
        { text: '给照片里的人打个电话', effects: { CHR: 2 }, reply: '电话接通，那头愣了一下，然后说「哎，是你啊」。' },
        { text: '放回原处，什么也没做', effects: { INT: 1, CHR: -1 }, reply: '你关了灯，很久才睡着。' }
      ]
    },

    /* ================= 老年 60-99 ================= */
    {
      id: 'o01', minAge: 60, maxAge: 66, weight: 10, once: 1,
      text: '你退休了。第一天早上醒来，不知道要做什么。',
      tags: ['里程碑'],
      options: [
        { text: '找点事做，返聘或做志愿者', effects: { STR: 1, CHR: 2, MNY: 1 }, set: 'active-old', reply: '你比上班时还忙，但每天都很精神。' },
        { text: '好好休息，睡到自然醒', effects: { STR: 2, CHR: 1 }, reply: '你花了三个月才习惯不用早起这件事。' },
        { text: '带着老伴/自己出去旅行', effects: { CHR: 2, MNY: -2, STR: 1 }, set: 'traveler', reply: '你去了年轻时一直想去的地方，站在那儿看了很久。' }
      ]
    },
    {
      id: 'o02', minAge: 62, maxAge: 80, weight: 6, ifNotFlag: 'married',
      text: '一个人住久了，屋子显得越来越大。',
      tags: ['生活'],
      options: [
        { text: '养一只猫或狗', effects: { CHR: 2, MNY: -1 }, reply: '它每天早上踩在你胸口叫你起床，你觉得挺好。' },
        { text: '搬去跟老朋友做邻居', effects: { CHR: 2, STR: 1 }, set: 'community', reply: '你们互相送饭，晚上一起下棋。' },
        { text: '习惯了一个人', effects: { INT: 1, CHR: -1 }, reply: '你把日子安排得很规律，也很安静。' }
      ]
    },
    {
      id: 'o03', minAge: 60, maxAge: 78, weight: 7, ifFlag: 'parent',
      text: '孩子说要接你去一起住，但那边人生地不熟。',
      tags: ['家庭'],
      options: [
        { text: '去，一家人在一起', effects: { CHR: 2, STR: -1 }, set: 'with-kids', reply: '你每天接送孙辈，累但笑得很多。' },
        { text: '不去，守着老房子', effects: { STR: 1, CHR: -1 }, set: 'alone-home', reply: '你留在了熟悉的街上，邻居都认识你。' },
        { text: '去半年，住不惯就回来', effects: { CHR: 1, STR: 1 }, reply: '你去了四个月，然后高高兴兴地回了家。' }
      ]
    },
    {
      id: 'o04', minAge: 60, maxAge: 85, weight: 6,
      text: '老年大学开了课，书法、摄影、智能手机都有。',
      tags: ['成长'],
      options: [
        { text: '报一门，认真学', effects: { INT: 2, CHR: 1 }, set: 'lifelong-learner', reply: '你学会了用手机剪视频，孙辈都惊了。' },
        { text: '算了，眼睛不行了', effects: { STR: -1 }, reply: '你把宣传单夹进了报纸里。' }
      ]
    },
    {
      id: 'o05', minAge: 65, maxAge: 90, weight: 6, once: 1,
      text: '一个老朋友的葬礼，你是去的少数几个人之一。',
      tags: ['社交'],
      options: [
        { text: '在葬礼上说了几句话', effects: { CHR: 2, STR: -1 }, reply: '你讲了四十年前的一件小事，台下有人笑了，也有人哭了。' },
        { text: '默默站到最后', effects: { INT: 1 }, reply: '你回家后翻了很久的相册。' }
      ]
    },
    {
      id: 'o06', minAge: 66, maxAge: 90, weight: 6,
      text: '你开始忘事了。钥匙放哪儿，昨天吃了什么。',
      tags: ['健康'],
      options: [
        { text: '每天写字、下棋，逼自己动脑', effects: { INT: 2, STR: 1 }, set: 'sharp', reply: '你记性没变好，但也没更坏。' },
        { text: '顺其自然', effects: { INT: -2, CHR: 1 }, reply: '你不太在意了，日子过得糊涂但轻松。' }
      ]
    },
    {
      id: 'o07', minAge: 70, maxAge: 95, weight: 5, once: 1,
      text: '你开始想，这辈子还有什么没做的。',
      tags: ['日常'],
      options: [
        { text: '去把最想做的那个做了', effects: { CHR: 3, MNY: -2, STR: -1 }, set: 'no-regret', reply: '你八十岁学游泳，九十岁还在游。' },
        { text: '算了，现在这样就挺好', effects: { STR: 1, CHR: 1 }, reply: '你坐在院子里晒太阳，觉得这辈子够了。' }
      ]
    },
    {
      id: 'o08', minAge: 72, maxAge: 95, weight: 5,
      text: '身体一天不如一天，走路要扶着墙。',
      tags: ['健康'],
      options: [
        { text: '坚持每天慢慢走一走', effects: { STR: 1 }, reply: '你走得慢，但一直没停下。' },
        { text: '少动，省着点力气', effects: { STR: -2 }, reply: '你越来越少出门，窗外的季节靠叶子判断。' }
      ]
    },
    {
      id: 'o09', minAge: 75, maxAge: 99, weight: 5,
      text: '孙辈来看你，问你年轻时候是什么样的人。',
      tags: ['家庭'],
      options: [
        { text: '讲一个从没讲过的故事', effects: { CHR: 2 }, reply: '你讲完，他们眼睛都亮了，说原来你这么厉害。' },
        { text: '笑着说「没什么好讲的」', effects: { INT: 1 }, reply: '你摸摸他们的头，把话咽了回去。' }
      ]
    },

    /* ================= 特殊 18-85 ================= */
    {
      id: 's01', minAge: 20, maxAge: 70, weight: 0.6, once: 1,
      text: '你随手买的一张彩票，中了个不小的奖。',
      tags: ['意外'],
      options: [
        { text: '存起来，当没这回事', effects: { MNY: 4, INT: 1 }, set: 'windfall-saved', reply: '你谁也没告诉，日子照旧过。' },
        { text: '换房换车，改善生活', effects: { MNY: 2, CHR: 2 }, reply: '你请所有亲戚吃了顿饭，那顿饭吃了很久。' },
        { text: '辞掉工作，去做想做的事', effects: { MNY: 1, CHR: 2, STR: -1 }, set: 'windfall-quit', reply: '你休息了两年，然后发现还是得找点事做。' }
      ]
    },
    {
      id: 's02', minAge: 18, maxAge: 80, weight: 0.5, once: 1,
      text: '一场不大不小的事故，你在医院躺了一个月。',
      tags: ['意外'],
      options: [
        { text: '好好养，彻底恢复', effects: { STR: -2, MNY: -2 }, reply: '你在床上想了很多，出院后整个人柔和了些。' },
        { text: '提前出院，回去上班', effects: { STR: -3, MNY: 1 }, set: 'stubborn', reply: '事情赶上了，伤也留下了。' }
      ]
    },
    {
      id: 's03', minAge: 22, maxAge: 55, weight: 0.8, once: 1,
      text: '你在一个场合遇到一个人，他后来成了你的贵人。',
      tags: ['社交'],
      options: [
        { text: '主动结交，认真维护', effects: { CHR: 2, MNY: 2, INT: 1 }, set: 'mentor', reply: '他教了你很多，也带了你很多年。' },
        { text: '客气一下，没往心里去', effects: {}, reply: '你们后来再没见过。' }
      ]
    },
    {
      id: 's04', minAge: 25, maxAge: 75, weight: 0.7, once: 1,
      text: '一个电话打来，说你的账户有异常，需要配合调查。',
      tags: ['意外'],
      options: [
        { text: '按对方说的操作', effects: { MNY: -3, INT: -1 }, reply: '转完钱你才反应过来，报了警，追不回来了。' },
        { text: '挂了，打官方电话核实', effects: { INT: 2 }, set: 'sharp', reply: '果然是假的。你顺手举报了那个号码。' }
      ]
    },
    {
      id: 's05', minAge: 25, maxAge: 65, weight: 0.5, once: 1,
      text: '你做的一件事被很多人知道了。',
      tags: ['里程碑'],
      options: [
        { text: '借着这波热度做下去', effects: { MNY: 2, CHR: 2, STR: -1 }, set: 'fame', reply: '你忙了两年，也被人记住了一阵子。' },
        { text: '低调处理，回去过原来的日子', effects: { STR: 1, INT: 1 }, reply: '你拒绝了所有采访，生活很快恢复了安静。' }
      ]
    },
    {
      id: 's06', minAge: 28, maxAge: 62, weight: 0.6, once: 1,
      text: '有人找你合伙做一个看起来稳赚的项目。',
      tags: ['事业'],
      options: [
        { text: '投，机会不常有', effects: { MNY: -3 }, set: 'mlm', reply: '钱投进去就没消息了，你后来才知道那是什么。' },
        { text: '先查清楚再说', effects: { INT: 2, MNY: 1 }, reply: '你查了三天，发现了问题，躲过一劫。' }
      ]
    },
    {
      id: 's07', minAge: 30, maxAge: 70, weight: 0.5, once: 1,
      text: '你捡到一个钱包，里面有身份证和一沓现金。',
      tags: ['日常'],
      options: [
        { text: '按地址送回去', effects: { CHR: 2 }, set: 'honest', reply: '失主非要给你感谢费，你没要，但心里很舒服。' },
        { text: '拿走现金，钱包扔掉', effects: { MNY: 1, CHR: -2 }, set: 'sly', reply: '你花了那笔钱，之后很久都不太踏实。' }
      ]
    },

    /* ================= 终局（小概率） ================= */
    {
      id: 'd01', minAge: 55, maxAge: 99, weight: 0.05, once: 1,
      text: '你病倒了，再也没能起来。',
      tags: ['终局'],
      kill: '一场病，带走了你',
      options: [
        { text: '平静地接受', effects: {}, reply: '你看着天花板，想起了一些很小的事。' }
      ]
    },
    {
      id: 'd02', minAge: 20, maxAge: 99, weight: 0.03, once: 1,
      text: '一场意外突然降临，没来得及告别。',
      tags: ['终局'],
      kill: '一场意外，戛然而止',
      options: [
        { text: '来不及反应', effects: {}, reply: '世界在你身后继续运转。' }
      ]
    }
  ];
});
