/* 事件池 A：婴幼儿 / 幼儿园 / 小学 / 中学（1~18 岁）
 * 每条事件都有选项，选项会留下 flag 或排后续事件。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LIFE_EVENTS_A = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return [
    /* ================= 婴幼儿 1-3 ================= */
    {
      id: 'b01', minAge: 1, maxAge: 2, weight: 8, once: 1,
      text: '你扶着沙发摇摇晃晃地站了起来，大人都在看你。',
      tags: ['成长'],
      options: [
        { text: '松开手，自己往前走', effects: { STR: 1, INT: 1 }, reply: '你摔了两次，第三次走出一米远，全家鼓掌。' },
        { text: '抓住大人的手再走', effects: { STR: 1 }, reply: '你走得稳稳当当，没摔过一跤。' },
        { text: '爬着过去更快', effects: { INT: 1 }, reply: '你四肢着地飞快窜到茶几底下，谁也抓不住。' }
      ]
    },
    {
      id: 'b02', minAge: 1, maxAge: 3, weight: 7, once: 1,
      text: '你张开嘴，说出了人生第一个词。',
      tags: ['成长'],
      options: [
        { text: '「妈妈」', effects: { CHR: 1 }, reply: '母亲当场红了眼眶，抱着你转了三圈。' },
        { text: '「爸爸」', effects: { CHR: 1 }, reply: '父亲激动得一晚上没睡，第二天逢人就说。' },
        { text: '先说的是一句谁也没听懂的外星语', effects: { INT: 1 }, reply: '家里人面面相觑，然后一起笑了。' }
      ]
    },
    {
      id: 'b03', minAge: 1, maxAge: 3, weight: 5,
      text: '半夜你哭闹不止，父母轮流抱着你在客厅转圈。',
      tags: ['家庭'],
      options: [
        { text: '一直哭到天亮', effects: { STR: -1 }, reply: '一家三口都没睡，母亲的眼睛布满了血丝。' },
        { text: '被抱着下楼走了一圈才安静', effects: {}, reply: '楼下的路灯很暖，你在父亲肩上睡着了。' }
      ]
    },
    {
      id: 'b04', minAge: 1, maxAge: 2, weight: 6, once: 1,
      text: '周岁抓周，桌上摆了一堆东西，大人围着你屏住呼吸。',
      tags: ['家庭'],
      options: [
        { text: '抓了那本书', effects: { INT: 1 }, set: 'book', reply: '爷爷说这孩子将来一定有出息。' },
        { text: '抓了那个小算盘', effects: { MNY: 1 }, reply: '亲戚们笑着说这孩子以后会过日子。' },
        { text: '抓了块糖，塞进嘴里', effects: { CHR: 1, MNY: -1 }, reply: '满桌人大笑，母亲说随他去吧。' }
      ]
    },
    {
      id: 'b05', minAge: 1, maxAge: 5, weight: 4,
      text: '你发了一场高烧，烧到三十九度。',
      tags: ['健康'],
      options: [
        { text: '连夜送医院', effects: { STR: -1, MNY: -1 }, reply: '挂了三天水，护士说再晚来就麻烦了。' },
        { text: '物理降温，在家熬过去', effects: { STR: -1 }, reply: '你出了一身汗，第二天居然退了下去。' }
      ]
    },
    {
      id: 'b06', minAge: 1, maxAge: 6, weight: 6,
      text: '你胃口很好，一顿能吃两大碗，个子比同龄人窜得快。',
      tags: ['健康'],
      options: [
        { text: '能吃就多吃', effects: { STR: 1 }, reply: '你长得又高又结实，抱起来沉甸甸的。' },
        { text: '想吃点甜的，正餐不怎么动', effects: { STR: -1, CHR: 1 }, reply: '你开心了，但换季总是第一个感冒。' }
      ]
    },
    {
      id: 'b07', minAge: 2, maxAge: 5, weight: 6,
      text: '要打针了，护士拿着针管走过来。',
      tags: ['健康'],
      options: [
        { text: '咬着牙伸出手臂', effects: { STR: 1, INT: 1 }, set: 'brave', reply: '护士夸你勇敢，还给了你一颗糖。' },
        { text: '大哭大闹，被大人按住', effects: { STR: -1 }, reply: '整层楼都听见了你的哭声。' }
      ]
    },

    /* ================= 幼儿园 3-6 ================= */
    {
      id: 'k01', minAge: 4, maxAge: 6, weight: 7,
      text: '幼儿园第一天，母亲在门口松开了你的手。',
      tags: ['成长'],
      options: [
        { text: '哭着想跟回家', effects: { CHR: -1 }, reply: '你哭到嗓子哑，最后被老师抱进教室。' },
        { text: '头也不回地走进教室', effects: { INT: 1, CHR: 1 }, reply: '母亲站在门口看了很久，有点失落也有点骄傲。' },
        { text: '拉着一个也在哭的小朋友一起进去', effects: { CHR: 1 }, set: 'social', reply: '你们成了整个幼儿园最好的朋友。' }
      ]
    },
    {
      id: 'k02', minAge: 4, maxAge: 6, weight: 6,
      text: '一个小朋友抢走了你手里的玩具。',
      tags: ['社交'],
      options: [
        { text: '一把抢回来', effects: { STR: 1, CHR: -1 }, reply: '你抢回来了，但对方哭着告了老师。' },
        { text: '去告老师', effects: { INT: 1 }, reply: '老师让他还给了你，还夸你懂规矩。' },
        { text: '算了，让他玩吧', effects: { CHR: 1, STR: -1 }, reply: '你一个人坐在角落，那天下午有点长。' }
      ]
    },
    {
      id: 'k03', minAge: 4, maxAge: 7, weight: 6, once: 1,
      text: '老师让大家轮流上台自我介绍。',
      tags: ['社交'],
      options: [
        { text: '大声说完自己的名字和爱好', effects: { CHR: 1, INT: 1 }, set: 'social', reply: '你讲得眉飞色舞，小朋友们都记住了你。' },
        { text: '小声说完就赶紧跑下来', effects: {}, reply: '老师笑着说没关系，下次再大声一点。' },
        { text: '躲在老师腿后面不肯出来', effects: { CHR: -1 }, set: 'timid', reply: '那天没人知道你的名字。' }
      ]
    },
    {
      id: 'k04', minAge: 5, maxAge: 8, weight: 6,
      text: '你在纸上歪歪扭扭地写下了自己的名字。',
      tags: ['成长'],
      options: [
        { text: '练了一整个下午', effects: { INT: 1, STR: -1 }, reply: '手腕酸了，但第二天老师把你的字贴在墙上。' },
        { text: '写一遍就去玩了', effects: { STR: 1 }, reply: '你在院子里跑得满头大汗，很快乐。' }
      ]
    },
    {
      id: 'k05', minAge: 4, maxAge: 8, weight: 5,
      text: '你从滑梯上摔了下来，膝盖擦破一大块。',
      tags: ['意外'],
      options: [
        { text: '自己爬起来拍拍土', effects: { STR: 1 }, set: 'brave', reply: '你没哭，老师说这孩子皮实。' },
        { text: '坐在地上大哭', effects: {}, reply: '老师跑过来把你抱去了医务室。' }
      ]
    },
    {
      id: 'k06', minAge: 5, maxAge: 10, weight: 7, once: 1,
      text: '父母问你想学点什么，给你报个班。',
      tags: ['成长'],
      options: [
        { text: '画画', effects: { CHR: 1, INT: 1 }, set: 'art', reply: '你在纸上涂满了颜色，一画就是一下午。' },
        { text: '钢琴', effects: { INT: 1, MNY: -1 }, set: 'art', reply: '练琴很痛苦，但你慢慢能弹出完整的曲子了。' },
        { text: '乒乓球', effects: { STR: 2 }, set: 'sport', reply: '你被教练夸手感好，每天放学都往球馆跑。' },
        { text: '什么都不想学，就想玩', effects: { STR: 1, INT: -1 }, reply: '你度过了一个很快乐的童年。' }
      ]
    },
    {
      id: 'k07', minAge: 5, maxAge: 9, weight: 5, once: 1,
      text: '你在小区里跑得最快，被大家叫做「小飞侠」。',
      tags: ['成长'],
      options: [
        { text: '天天出去跑', effects: { STR: 2, INT: -1 }, set: 'sport', reply: '你晒得黑黑的，跑起来风一样。' },
        { text: '跑归跑，作业还是要写完', effects: { STR: 1, INT: 1 }, reply: '你两头都没落下，母亲很满意。' }
      ]
    },
    {
      id: 'k08', minAge: 4, maxAge: 12, weight: 5,
      text: '放学后你又在操场上疯跑，晒得黑黑的。',
      tags: ['健康'],
      options: [
        { text: '跑到天黑才回家', effects: { STR: 1 }, reply: '回家饭量大得吓人，母亲一边骂一边给你添饭。' },
        { text: '跟同学在教室里聊到天黑', effects: { CHR: 1 }, set: 'social', reply: '你们聊了很多，那种关系后来持续了很多年。' }
      ]
    },

    /* ================= 小学 7-13 ================= */
    {
      id: 'p01', minAge: 7, maxAge: 9, weight: 8, once: 1,
      text: '第一次考试的成绩发下来了。',
      tags: ['学业'],
      options: [
        { text: '拿着卷子给父母看', effects: { CHR: 1 }, reply: '不管分数多少，母亲把它贴在了冰箱上。' },
        { text: '藏进书包最底下', effects: { INT: 1, CHR: -1 }, set: 'sly', reply: '你学会了第一件不想让人知道的事。' },
        { text: '自己订正了三遍', effects: { INT: 2 }, set: 'studious', reply: '你发现自己错的都是同一类题。' }
      ]
    },
    {
      id: 'p02', minAge: 7, maxAge: 12, weight: 7,
      text: '老师给你换了个新同桌。',
      tags: ['社交'],
      options: [
        { text: '主动跟他说话', effects: { CHR: 1 }, set: 'social', reply: '你们很快混熟了，上课都在传纸条。' },
        { text: '各写各的，互不打扰', effects: { INT: 1 }, reply: '一年下来你们说的话不超过一百句。' },
        { text: '抄他的作业', effects: { INT: -1, CHR: 1 }, set: 'sly', reply: '你省了很多时间，也少学了很多东西。' }
      ]
    },
    {
      id: 'p03', minAge: 7, maxAge: 13, weight: 6,
      text: '班上有几个人开始针对你，起外号、藏你的笔袋。',
      tags: ['社交'],
      options: [
        { text: '当面顶回去', effects: { CHR: 1, STR: -1 }, set: 'brave', reply: '你被打了一下，但从那以后没人再敢招惹你。' },
        { text: '告诉老师和家长', effects: { INT: 1, CHR: -1 }, reply: '事情被压下去了，但你在班里变得更安静。' },
        { text: '忍着，装作没发生', effects: { STR: -1, CHR: -1 }, set: 'timid', reply: '那一整个学期你都不太想去学校。' }
      ]
    },
    {
      id: 'p04', minAge: 7, maxAge: 12, weight: 6,
      text: '体育课测八百米，跑到第三圈你有点撑不住了。',
      tags: ['健康'],
      options: [
        { text: '咬着牙冲刺', effects: { STR: 1, INT: 1 }, reply: '你跑完直接躺在草地上，天很蓝。' },
        { text: '走完最后两百米', effects: {}, reply: '体育老师没说什么，你自己有点在意。' },
        { text: '中途说肚子疼退场', effects: { STR: -1, CHR: -1 }, reply: '你坐在树荫下，看着别人一个个冲过终点。' }
      ]
    },
    {
      id: 'p05', minAge: 7, maxAge: 12, weight: 8, once: 1,
      text: '老师提了个问题，全班没人举手。你知道答案。',
      tags: ['学业'],
      options: [
        { text: '举手，站起来回答', effects: { INT: 1, CHR: 1 }, set: 'brave', then: 't05', reply: '你说对了，老师说以后多举手。' },
        { text: '低头，假装在想', effects: { INT: 1 }, set: 'timid', reply: '最后老师自己说了答案，你松了口气。' },
        { text: '小声跟同桌说了答案，让他举手', effects: { CHR: 1, INT: 1 }, reply: '他答对了，回头冲你眨了眨眼。' }
      ]
    },
    {
      id: 'p06', minAge: 8, maxAge: 13, weight: 6,
      text: '暑假作业还剩一大半，离开学只有三天了。',
      tags: ['学业'],
      options: [
        { text: '三天不睡赶完', effects: { INT: 1, STR: -1 }, reply: '你写到最后手都是抖的，但准时交了。' },
        { text: '找同学的抄一份', effects: { INT: -1, CHR: 1 }, set: 'sly', reply: '你抄得飞快，还顺便学会了怎么模仿笔迹。' },
        { text: '干脆不写，开学再说', effects: { STR: 1, INT: -1 }, reply: '开学被罚站了一节课，你倒是睡得很好。' }
      ]
    },
    {
      id: 'p07', minAge: 8, maxAge: 12, weight: 4, once: 1,
      text: '你在桌上看到一张五十块钱，是母亲随手放的。',
      tags: ['家庭'],
      options: [
        { text: '拿走，想买那个模型', effects: { MNY: 1, CHR: -1 }, set: 'sly', then: 'p07f', reply: '你把钱塞进裤兜，心跳得很快。' },
        { text: '交给母亲', effects: { CHR: 1, INT: 1 }, set: 'honest', reply: '母亲愣了一下，然后摸了摸你的头。' },
        { text: '放回原处，什么也没说', effects: {}, reply: '你盯着那张钱看了很久，然后写作业去了。' }
      ]
    },
    {
      id: 'p07f', queuedOnly: 1, minAge: 9, maxAge: 16, weight: 1, once: 1,
      text: '母亲问起那五十块钱的事。',
      tags: ['家庭'],
      options: [
        { text: '承认是自己拿的', effects: { CHR: 1, MNY: -1 }, set: ['honest', '!sly'], reply: '母亲没有打你，只说以后要用钱就开口。你哭了一晚上。' },
        { text: '咬定不知道', effects: { CHR: -1, MNY: 1 }, set: 'sly', reply: '她看了你很久，然后转身走开了。' }
      ]
    },
    {
      id: 'p08', minAge: 7, maxAge: 13, weight: 4, once: 1,
      text: '父亲换了工作，全家要搬到另一个城市。',
      tags: ['家庭'],
      options: [
        { text: '跟着走，重新认识所有人', effects: { CHR: 1, INT: 1 }, reply: '你在新学校沉默了一个月，然后交到了新朋友。' },
        { text: '留在老家，跟爷爷奶奶过', effects: { INT: 1, CHR: -1 }, set: 'left-behind', reply: '你学会了照顾自己，也习惯了电话里的声音。' }
      ]
    },
    {
      id: 'p09', minAge: 9, maxAge: 15, weight: 7,
      text: '你开始长个子了，裤腿一年短了两回。',
      tags: ['成长'],
      options: [
        { text: '每天打篮球', effects: { STR: 2, INT: -1 }, reply: '你蹿得飞快，投篮也越来越准。' },
        { text: '每天喝牛奶早睡', effects: { STR: 1 }, reply: '你长得慢一些但很匀称，没怎么生过病。' },
        { text: '挑食，只吃肉不吃菜', effects: { STR: -1, CHR: 1 }, reply: '你长高了，但体检时医生说有点营养不良。' }
      ]
    },
    {
      id: 'p10', minAge: 8, maxAge: 13, weight: 5, once: 1,
      text: '母亲给你报了奥数班，周末两天全占满。',
      tags: ['学业'],
      options: [
        { text: '认真学，把题都啃下来', effects: { INT: 2, STR: -1 }, set: 'studious', reply: '你后来拿了区里三等奖，母亲很骄傲。' },
        { text: '上课睡觉，回家抄答案', effects: { INT: -1, STR: 1 }, reply: '你睡得很香，那半年什么也没学到。' },
        { text: '跟母亲说不想去，改成自己看书', effects: { INT: 1, CHR: 1 }, set: 'independent', reply: '她犹豫了一晚，同意了。你把空出来的时间用来读闲书。' }
      ]
    },
    {
      id: 'p11', minAge: 7, maxAge: 15, weight: 5, once: 1,
      text: '深夜你听见父母在客厅小声吵架。',
      tags: ['家庭'],
      options: [
        { text: '走出去问怎么了', effects: { CHR: 1, STR: -1 }, set: 'family-open', reply: '他们愣住了，然后一起抱住你，说没事。' },
        { text: '把被子蒙过头，装作睡着', effects: { INT: 1, CHR: -1 }, set: 'family-quiet', reply: '你学会了在黑暗里数呼吸。' },
        { text: '第二天去问母亲', effects: { INT: 1 }, reply: '她说大人的事你不用管，你听出了她声音里的疲惫。' }
      ]
    },
    {
      id: 'p12', minAge: 9, maxAge: 14, weight: 5,
      text: '班上流行收集卡牌，你没有零花钱买。',
      tags: ['社交'],
      options: [
        { text: '跟家里要钱', effects: { MNY: -1, CHR: 1 }, reply: '你拿到了卡，也听到了母亲一句「别跟人比」。' },
        { text: '用废纸自己画一套', effects: { INT: 1, CHR: 1 }, reply: '大家反而更喜欢你画的那套，抢着跟你换。' },
        { text: '不参与，自己看课外书', effects: { INT: 2, CHR: -1 }, reply: '你在图书角读完了一整套百科全书。' }
      ]
    },
    {
      id: 'p13', minAge: 10, maxAge: 15, weight: 5,
      text: '班里传阅一本小说，轮到你是晚上十点。',
      tags: ['学业'],
      options: [
        { text: '看到凌晨三点', effects: { INT: 2, STR: -1 }, reply: '你第二天顶着黑眼圈，但脑子里全是另一个世界。' },
        { text: '只看到十二点', effects: { INT: 1 }, reply: '你记住了那句最喜欢的话，也睡够了。' },
        { text: '不看了，明天还要上课', effects: { STR: 1 }, reply: '你睡了个好觉，第二天听同学们讨论时略有些羡慕。' }
      ]
    },
    {
      id: 'p14', minAge: 9, maxAge: 14, weight: 4, once: 1,
      text: '这次期末考砸了，卷子要家长签名。',
      tags: ['学业'],
      options: [
        { text: '老实交代', effects: { CHR: 1, STR: -1 }, set: 'honest', reply: '被骂了一顿，但父亲最后帮你分析了错题。' },
        { text: '模仿父亲的笔迹签了', effects: { INT: 1, CHR: -1 }, set: 'sly', then: 'p14f', reply: '你练了一晚上，签得还挺像。' },
        { text: '说老师没发，拖延过去', effects: { INT: -1 }, reply: '事情拖到不了了之，你松了一整口气。' }
      ]
    },
    {
      id: 'p14f', queuedOnly: 1, minAge: 10, maxAge: 17, weight: 1, once: 1,
      text: '老师在课堂上当着全班问：「这个签名是谁签的？」',
      tags: ['学业'],
      options: [
        { text: '站起来承认', effects: { CHR: 1, INT: 1 }, set: ['honest', '!sly'], reply: '你脸涨得通红，但老师说你敢认就好。' },
        { text: '继续硬撑说不知道', effects: { CHR: -1, INT: -1 }, set: 'sly', reply: '老师给家里打了电话，那天晚上很长。' }
      ]
    },

    /* ================= 中学 13-18 ================= */
    {
      id: 't01', minAge: 15, maxAge: 16, weight: 20, once: 1,
      text: '要分文理科了，班主任让你回家想清楚。',
      tags: ['学业', '里程碑'],
      options: [
        { text: '理科，将来做技术', effects: { INT: 2, CHR: -1 }, set: 'tech', reply: '你在物理题里找到了某种确定性的安全感。' },
        { text: '文科，读喜欢的东西', effects: { CHR: 1, INT: 1 }, set: 'art-track', reply: '你读了很多书，也开始写一些没人看的东西。' },
        { text: '跟着最好的朋友选', effects: { CHR: 1 }, set: 'loyal', reply: '你们在同一个班坐了两年，后来各奔东西。' }
      ]
    },
    {
      id: 't02', minAge: 14, maxAge: 18, weight: 7, once: 1,
      text: '你收到了一张折得很小的纸条，上面写着「放学别走」。',
      tags: ['情感'],
      options: [
        { text: '去了，也喜欢对方', effects: { CHR: 2, INT: -1 }, set: 'firstlove', reply: '你们在操场边站了半小时，什么也没说，但都笑了。' },
        { text: '去了，但说自己只想好好读书', effects: { INT: 1, CHR: -1 }, set: 'studious', reply: '对方点点头说好，你回去后有点睡不好。' },
        { text: '没去', effects: {}, reply: '第二天你们装作什么都没发生。' }
      ]
    },
    {
      id: 't03', minAge: 13, maxAge: 18, weight: 4,
      text: '你在篮球场上扭伤了脚踝，肿得像个馒头。',
      tags: ['意外'],
      options: [
        { text: '休息两周，老实养着', effects: { STR: -1 }, reply: '你落下了几节课，但脚好得很干净。' },
        { text: '第二天照样上场', effects: { STR: -2, CHR: 1 }, set: 'stubborn', reply: '你打完了那场球，也留下了老伤。' }
      ]
    },
    {
      id: 't04', minAge: 14, maxAge: 18, weight: 6,
      text: '作业写不完，你决定熬夜。',
      tags: ['学业'],
      options: [
        { text: '熬到两点，全部写完', effects: { INT: 1, STR: -1 }, reply: '你第二天在课上睡着了，被点名站起来回答问题。' },
        { text: '写一半，剩下的明天早自习补', effects: { INT: 1 }, reply: '你睡够了，早自习的效率意外地高。' },
        { text: '干脆不写，早点睡', effects: { STR: 1, INT: -1 }, reply: '你精神很好，被老师批评时也能笑着听完。' }
      ]
    },
    {
      id: 't05', minAge: 13, maxAge: 18, weight: 12, once: 1, ifFlag: 'brave',
      text: '因为你在课上敢举手，老师推荐你去参加全校演讲比赛。',
      tags: ['里程碑'],
      options: [
        { text: '认真准备，上台', effects: { CHR: 2, INT: 1, STR: -1 }, set: 'confident', reply: '你讲到一半忘词了，但硬着头皮讲完，台下掌声比想象中响。' },
        { text: '答应下来，最后临阵脱逃', effects: { CHR: -1 }, set: 'timid', reply: '你在后台站了很久，最后说自己肚子疼。' }
      ]
    },
    {
      id: 't06', minAge: 13, maxAge: 18, weight: 6, once: 1,
      text: '你最好的朋友突然不理你了，你不知道为什么。',
      tags: ['社交'],
      options: [
        { text: '直接问清楚', effects: { CHR: 1, INT: 1 }, reply: '原来是一场误会，你们当天就和好了。' },
        { text: '也不理他，看谁先低头', effects: { CHR: -1, STR: -1 }, reply: '一直到毕业，你们再没说过话。' },
        { text: '写了封信塞进他抽屉', effects: { CHR: 1 }, set: 'sincere', reply: '他第二天早自习递给你一瓶汽水，什么也没说。' }
      ]
    },
    {
      id: 't07', minAge: 14, maxAge: 18, weight: 6,
      text: '你每天刷题到凌晨一点，视力又降了。',
      tags: ['学业'],
      options: [
        { text: '继续，成绩更重要', effects: { INT: 2, STR: -1, CHR: -1 }, set: 'studious', reply: '你的排名稳住了，镜片也厚了。' },
        { text: '十一点就睡，白天效率补回来', effects: { INT: 1, STR: 1 }, reply: '你发现清醒的一小时比困的两小时管用。' }
      ]
    },
    {
      id: 't08', minAge: 14, maxAge: 18, weight: 5,
      text: '下午有两节自习课，几个同学翻墙去了网吧。',
      tags: ['社交'],
      options: [
        { text: '跟着去', effects: { CHR: 1, INT: -1 }, set: 'wild', reply: '你们玩到天黑，翻墙回来时被教导主任撞见。' },
        { text: '留下自习', effects: { INT: 1, CHR: -1 }, reply: '教室很安静，你多做了一整套卷子。' },
        { text: '不去，但帮他们瞒着', effects: { CHR: 1, INT: 1 }, reply: '你成了他们信得过的人，也保住了自己的成绩。' }
      ]
    },
    {
      id: 't09', minAge: 13, maxAge: 18, weight: 5,
      text: '你发现跑步的时候，脑子最安静。',
      tags: ['健康'],
      options: [
        { text: '每天跑三公里', effects: { STR: 2, INT: 1 }, set: 'runner', reply: '你瘦了，也睡得很沉，做题时思路清楚了很多。' },
        { text: '偶尔跑跑', effects: { STR: 1 }, reply: '跑完那一阵很舒服，但没能坚持下来。' }
      ]
    },
    {
      id: 't10', minAge: 15, maxAge: 18, weight: 5, once: 1,
      text: '学校选拔参加学科竞赛的人，老师问你要不要试试。',
      tags: ['学业'],
      options: [
        { text: '试试，停课集训一个月', effects: { INT: 3, STR: -1 }, set: 'competitor', reply: '你拿了省二等奖，也落下了两个月的课。' },
        { text: '不参加，稳着来', effects: { INT: 1 }, reply: '你按部就班，成绩一直很平稳。' }
      ]
    },
    {
      id: 't11', minAge: 16, maxAge: 18, weight: 4, once: 1,
      text: '暑假有两个月，同学介绍你去奶茶店打工。',
      tags: ['成长'],
      options: [
        { text: '去，挣点自己的钱', effects: { MNY: 2, STR: -1, CHR: 1 }, set: 'worked', reply: '你第一次知道钱有多难挣，也第一次请全家吃了饭。' },
        { text: '不去，在家看书预习', effects: { INT: 2 }, reply: '你把下学期的课本翻了一遍。' },
        { text: '在家躺了两个月', effects: { STR: 1, INT: -1 }, reply: '开学时你胖了三斤，作业一笔没动。' }
      ]
    },
    {
      id: 't12', minAge: 14, maxAge: 18, weight: 6,
      text: '吃饭时父亲说：「我们家就靠你了。」',
      tags: ['家庭'],
      options: [
        { text: '点头，把这句话记在心里', effects: { INT: 1, STR: -1 }, set: 'burden', reply: '你后来很多年都在为这句话用力。' },
        { text: '说「我尽力，但别给我这么大压力」', effects: { CHR: 1, INT: 1 }, set: 'boundary', reply: '父亲愣了一下，说好，然后给你夹了块肉。' },
        { text: '低头扒饭，什么也没说', effects: { INT: 1, CHR: -1 }, reply: '那顿饭你吃得很慢。' }
      ]
    },
    {
      id: 't13', minAge: 16, maxAge: 18, weight: 4,
      text: '晚自习后你一个人走回家，路灯把影子拉得很长。',
      tags: ['日常'],
      options: [
        { text: '戴上耳机，想点自己的事', effects: { INT: 1, CHR: 1 }, reply: '你想明白了一个困扰很久的问题。' },
        { text: '跑起来，快点到家', effects: { STR: 1 }, reply: '你跑得气喘吁吁，反而精神了。' }
      ]
    },
    {
      id: 't14', minAge: 13, maxAge: 30, weight: 5,
      text: '你决定调整一下作息。',
      tags: ['健康'],
      options: [
        { text: '早睡早起，坚持一段', effects: { STR: 1, INT: 1 }, set: 'healthy', reply: '你发现自己一天多出了两个小时。' },
        { text: '算了，先熬过这阵子', effects: { INT: 1, STR: -1 }, reply: '事情是做完了，人也有点空。' }
      ]
    },
    {
      id: 't15', minAge: 15, maxAge: 30, weight: 4,
      text: '你练出了一点肌肉，旧衣服忽然合身了。',
      tags: ['健康'],
      options: [
        { text: '继续练下去', effects: { STR: 2, CHR: 1 }, set: 'fit', reply: '半年后你换了整个衣柜。' },
        { text: '够了，保持现状', effects: { STR: 1 }, reply: '你维持在一个舒服的状态。' }
      ]
    },
    {
      id: 't16', minAge: 13, maxAge: 18, weight: 5,
      text: '你迷上了一款游戏，每天想早点回家。',
      tags: ['日常'],
      options: [
        { text: '玩，但定好时间', effects: { INT: 1, CHR: 1 }, reply: '你在游戏里认识了一群朋友，成绩也没掉。' },
        { text: '通宵打，白天睡觉', effects: { INT: -1, STR: -2 }, set: 'gamer', reply: '你段位很高，成绩单很难看。' },
        { text: '把游戏删了', effects: { INT: 1, STR: 1 }, set: 'disciplined', reply: '删掉那一刻有点舍不得，后来也就忘了。' }
      ]
    }
  ];
});
