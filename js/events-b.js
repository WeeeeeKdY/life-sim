/* 事件池 B：高考 / 大学 / 青年（18~30 岁）
 * 这一段的选项会真正岔开人生：上学还是打工、大厂还是考公还是创业。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LIFE_EVENTS_B = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return [
    /* ================= 高考 18 ================= */
    {
      id: 'g01', minAge: 18, maxAge: 18, weight: 400, once: 1,
      text: '高考前一夜，你躺在床上，窗外的蝉一直在叫。',
      tags: ['里程碑'],
      options: [
        {
          text: '最后过一遍错题本，十一点睡', need: { INT: 9 },
          effects: { INT: 2, STR: -1 }, then: 'g_top',
          reply: '你把所有错题都想通了一遍，闭上眼时心里很静。'
        },
        {
          text: '稳稳当当复习，不冒进', need: { INT: 5 },
          effects: { INT: 1, STR: 1 }, then: 'g_mid',
          reply: '你按自己的节奏走完了最后一晚。'
        },
        {
          text: '通宵再看一遍，能看多少是多少',
          effects: { INT: 1, STR: -2 }, then: 'g_mid',
          reply: '你看到了凌晨四点，考场上头有点发晕。'
        },
        {
          text: '算了，反正也考不上', need: { INT: [0, 4] },
          effects: { STR: 1 }, then: 'g_low',
          reply: '你很早就睡了，睡得很沉。'
        }
      ]
    },
    {
      id: 'g_top', queuedOnly: 1, minAge: 19, maxAge: 20, weight: 1, once: 1,
      text: '录取通知书到了，是一所很好的大学。',
      tags: ['里程碑'],
      options: [
        { text: '去，好好念', effects: { INT: 2, CHR: 1 }, set: 'top-uni', reply: '母亲把通知书复印了一份，收在抽屉里。' },
        { text: '去，但心里其实想学别的', effects: { INT: 1 }, set: 'wrong-major', reply: '你在不喜欢的专业里坐了一整个学期。' }
      ]
    },
    {
      id: 'g_mid', queuedOnly: 1, minAge: 19, maxAge: 20, weight: 1, once: 1,
      text: '你考上了一所普通大学，专业还说得过去。',
      tags: ['里程碑'],
      options: [
        { text: '接受，大学再努力', effects: { INT: 1, CHR: 1 }, set: 'mid-uni', reply: '你在开学第一天的操场上想，四年够长了。' },
        { text: '不甘心，决定复读', effects: { STR: -1, INT: 1 }, then: 'g_retry', reply: '你把行李又搬回了高中。' }
      ]
    },
    {
      id: 'g_low', queuedOnly: 1, minAge: 19, maxAge: 20, weight: 1, once: 1,
      text: '分数出来了，离本科线差了一截。',
      tags: ['里程碑'],
      options: [
        { text: '复读一年，再拼一次', effects: { STR: -1, INT: 1 }, then: 'g_retry', reply: '你回到那间教室，桌上的刻痕还是老样子。' },
        { text: '去读专科，早点学门手艺', effects: { INT: 1, MNY: 1 }, set: 'vocational', reply: '你选了一个就业率很高的专业。' },
        { text: '不念了，直接出去打工', effects: { MNY: 1, STR: 1 }, set: 'early-work', reply: '你跟着表哥进了工厂，第一个月工资一千八。' }
      ]
    },
    {
      id: 'g_retry', queuedOnly: 1, minAge: 19, maxAge: 21, weight: 1, once: 1,
      text: '复读班的墙上贴满了倒计时。你坐在最后一排。',
      tags: ['里程碑'],
      options: [
        {
          text: '这一年就当还债，拼命学', need: { INT: 7 },
          effects: { INT: 3, STR: -2, CHR: -1 }, then: 'g_top',
          reply: '你把一年的题做完了三年的量，第二次考得很好。'
        },
        {
          text: '能提多少提多少，别把自己逼死',
          effects: { INT: 1 }, then: 'g_mid',
          reply: '你比上次多考了五十多分，够用了。'
        }
      ]
    },

    /* ================= 大学 19-22 ================= */
    {
      id: 'y01', minAge: 19, maxAge: 21, weight: 8, once: 1,
      text: '大学第一节课，教室里坐了两百人，没人认识你。',
      tags: ['成长'],
      options: [
        { text: '坐第一排', effects: { INT: 1, CHR: -1 }, set: 'studious', reply: '老师后来记住了你的名字。' },
        { text: '坐最后一排，先观察', effects: { CHR: 1, INT: 1 }, reply: '你很快摸清了谁是真学霸，谁只是在装。' },
        { text: '翘了，在宿舍睡觉', effects: { STR: 1, INT: -1 }, reply: '你睡到中午，醒来时室友都回来了。' }
      ]
    },
    {
      id: 'y02', minAge: 19, maxAge: 22, weight: 7, once: 1,
      text: '社团招新，一整条路摆满了摊位。',
      tags: ['社交'],
      options: [
        { text: '学生会', effects: { CHR: 1, INT: 1 }, set: 'social', reply: '你学会了写通知、办活动、跟各种人打交道。' },
        { text: '乐队/话剧社', effects: { CHR: 2 }, set: 'art', reply: '你在台上第一次听见有人为你鼓掌。' },
        { text: '篮球队', effects: { STR: 2, CHR: 1 }, set: 'sport', reply: '你打得一身汗，也交到了真朋友。' },
        { text: '什么都不参加，泡图书馆', effects: { INT: 3, CHR: -1 }, set: 'loner', reply: '你四年读完了两百多本书。' }
      ]
    },
    {
      id: 'y03', minAge: 19, maxAge: 22, weight: 6,
      text: '宿舍里四个人，作息完全不一样。',
      tags: ['社交'],
      options: [
        { text: '定个规矩，好好商量', effects: { INT: 1, CHR: 1 }, reply: '你们签了一份手写的「宿舍公约」，居然真的执行了。' },
        { text: '忍着，戴耳塞睡觉', effects: { STR: -1, INT: 1 }, reply: '你练出了随时入睡的本事。' },
        { text: '吵一架，然后各过各的', effects: { CHR: -1, STR: -1 }, reply: '那之后宿舍里气氛很僵，一直到大三才缓和。' }
      ]
    },
    {
      id: 'y04', minAge: 19, maxAge: 23, weight: 6,
      text: '室友拉你开黑，你已经连着熬了三晚。',
      tags: ['日常'],
      options: [
        { text: '再来一把', effects: { CHR: 1, STR: -2 }, reply: '你们打到天亮，赢了，也困得说不出话。' },
        { text: '今天不去了，睡觉', effects: { STR: 1, INT: 1 }, reply: '你睡到自然醒，去食堂吃了顿早饭。' }
      ]
    },
    {
      id: 'y05', minAge: 19, maxAge: 24, weight: 7, once: 1,
      text: '你在图书馆遇到一个人，已经连续一周坐在同一张桌子。',
      tags: ['情感'],
      options: [
        { text: '写张纸条递过去', effects: { CHR: 2, INT: -1 }, set: 'in-love', reply: '对方笑了，回了一张：「我也注意你很久了。」' },
        { text: '假装找书，从旁边走过很多次', effects: { CHR: -1, INT: 1 }, set: 'shy', reply: '你走了一个学期，一句话也没说。' },
        { text: '专心看书，别多想', effects: { INT: 2 }, set: 'studious', reply: '你那次考了专业第一，也没再见过对方。' }
      ]
    },
    {
      id: 'y06', minAge: 19, maxAge: 23, weight: 6,
      text: '看到一份家教的兼职，一小时八十块。',
      tags: ['成长'],
      options: [
        { text: '接下，每周去三次', effects: { MNY: 2, INT: 1, STR: -1 }, set: 'worked', reply: '你第一次靠自己挣到了生活费，也第一次体会到讲明白一件事有多难。' },
        { text: '接下，但一边做一边摸鱼', effects: { MNY: 1 }, reply: '钱挣到了，那个孩子的成绩没怎么变。' },
        { text: '不接，把时间留给专业课', effects: { INT: 2 }, reply: '你的绩点很好看，但钱包一直是瘪的。' }
      ]
    },
    {
      id: 'y07', minAge: 21, maxAge: 23, weight: 10, once: 1,
      text: '大三结束，所有人都在问：考研、出国，还是工作？',
      tags: ['里程碑'],
      options: [
        { text: '考研，再读三年', effects: { INT: 3, MNY: -1, STR: -1 }, set: 'postgrad', then: 'y07a', reply: '你把书桌搬进了自习室，一坐就是一整年。' },
        { text: '出国读书', need: { MNY: 6 }, effects: { INT: 2, MNY: -3, CHR: 1 }, set: 'abroad', reply: '你在机场跟父母挥手，转身时眼睛有点酸。' },
        { text: '直接工作，早点独立', effects: { MNY: 2, INT: 1 }, set: 'work-early', then: 'y10', reply: '你开始投简历，也想好了要先养活自己。' },
        { text: '考公，图个稳定', effects: { INT: 1, STR: -1 }, set: 'gov-track', then: 'y10', reply: '你买了厚厚的行测，每天刷题。' }
      ]
    },
    {
      id: 'y07a', queuedOnly: 1, minAge: 22, maxAge: 26, weight: 1, once: 1,
      text: '研究生第二年，导师的项目和你想象的不一样。',
      tags: ['学业'],
      options: [
        { text: '沉下心做，把课题啃完', effects: { INT: 3, STR: -1 }, set: 'researcher', reply: '你发了一篇文章，虽然不算顶刊，但是自己写的。' },
        { text: '跟导师摊牌，换个方向', need: { CHR: 5 }, effects: { INT: 1, CHR: 1 }, reply: '导师沉默了一会儿，说你想清楚就行。' },
        { text: '混到毕业，重点放在实习', effects: { MNY: 1, INT: -1 }, set: 'work-early', reply: '你一边写论文一边实习，两边都没做到最好。' }
      ]
    },
    {
      id: 'y08', minAge: 21, maxAge: 25, weight: 7,
      text: '第一次正式面试，你手心全是汗。',
      tags: ['事业'],
      options: [
        { text: '如实说自己不会，但愿意学', effects: { CHR: 1, INT: 1 }, set: 'honest', reply: '面试官笑了：「这句话我一年听两百次，你是第一个说得像真的。」' },
        { text: '把不会的说成会', effects: { MNY: 1, CHR: -1 }, set: 'sly', reply: '你拿到了 offer，入职第一周就露了馅。' },
        { text: '紧张到说不出话', effects: { CHR: -1, INT: 1 }, reply: '那次没过，但你记住了所有被问到的问题。' }
      ]
    },
    {
      id: 'y09', minAge: 21, maxAge: 26, weight: 6,
      text: '你要租房了，中介带你看的第一间朝北，便宜八百。',
      tags: ['生活'],
      options: [
        { text: '租朝北的，省钱', effects: { MNY: 1, STR: -1, CHR: -1 }, reply: '冬天很冷，你买了两床被子，学会了在没有阳光的房间里生活。' },
        { text: '多花钱租朝南的', effects: { MNY: -1, STR: 1, CHR: 1 }, reply: '每天早上阳光会照到床脚，你觉得这个钱花得值。' },
        { text: '跟人合租，住客厅', effects: { MNY: 2, CHR: -1 }, reply: '你用帘子隔出一小块地方，住了两年。' }
      ]
    },
    {
      id: 'y10', minAge: 22, maxAge: 27, weight: 14, once: 1,
      text: '手里有几个 offer，你得选一个。',
      tags: ['里程碑'],
      options: [
        {
          text: '去大厂，钱多但累', need: { INT: 6 },
          effects: { MNY: 3, STR: -1 }, set: 'career-big', then: 'a01', thenDelay: 3,
          reply: '你签了那份合同，薪水是同学里最高的。'
        },
        {
          text: '进国企/考公，图个安稳',
          effects: { MNY: 1, STR: 1 }, set: 'career-stable',
          reply: '你把工牌挂在胸前，母亲终于不再问「以后怎么办」。'
        },
        {
          text: '跟朋友一起创业',
          effects: { MNY: -1, INT: 2 }, set: 'career-startup', then: 'a02', thenDelay: 3,
          reply: '你们在一个三十平的办公室里，白板上写满了还没实现的东西。'
        },
        {
          text: '先随便找一份，边做边看',
          effects: { MNY: 1 }, set: 'career-drift',
          reply: '你入职了，也说不上喜欢，但总归有了收入。'
        }
      ]
    },
    {
      id: 'y11', minAge: 23, maxAge: 30, weight: 6,
      text: '第一年攒下的钱，你打算怎么处理。',
      tags: ['生活'],
      options: [
        { text: '老老实实存着', effects: { MNY: 1 }, set: 'saver', reply: '你看着余额一点点涨，心里踏实。' },
        { text: '拿去学点新东西', effects: { INT: 2, MNY: -1 }, set: 'learner', reply: '你报了个课，也认识了一圈新的人。' },
        { text: '全花掉，买自己想要的', effects: { CHR: 2, MNY: -2 }, reply: '你换了手机、买了衣服，那个月过得很快乐。' },
        { text: '投进股市，赌一把', effects: { MNY: -2, INT: 1 }, set: 'gambler', reply: '你亏了，但学到了「不要追高」这四个字。' }
      ]
    },
    {
      id: 'y12', minAge: 23, maxAge: 32, weight: 6,
      text: '体检报告上出现了两个箭头。',
      tags: ['健康'],
      options: [
        { text: '开始规律健身', effects: { STR: 2, CHR: 1, MNY: -1 }, set: 'healthy', reply: '一年后你重新穿上了那件旧外套。' },
        { text: '控制饮食，少熬夜', effects: { STR: 1 }, reply: '指标下去了，你也没那么累了。' },
        { text: '先不管，工作要紧', effects: { MNY: 1, STR: -2 }, reply: '你把报告塞进抽屉，那两年一次都没打开过。' }
      ]
    },
    {
      id: 'y13', minAge: 23, maxAge: 30, weight: 6,
      text: '周末，同事约你出去吃饭，你其实想在家躺着。',
      tags: ['社交'],
      options: [
        { text: '去，多认识点人', effects: { CHR: 1, STR: -1 }, set: 'social', reply: '饭桌上你听到了一条后来很有用的消息。' },
        { text: '婉拒，在家休息', effects: { STR: 1 }, reply: '你在家睡了一整天，周一精神很好。' }
      ]
    },
    {
      id: 'y14', minAge: 24, maxAge: 32, weight: 6,
      text: '你开始觉得这份工作不适合自己。',
      tags: ['事业'],
      options: [
        { text: '裸辞，先休息一阵', effects: { STR: 1, MNY: -2 }, set: 'quit-once', reply: '你去了趟一直想去的地方，回来后重新想清楚要做什么。' },
        { text: '在职找下家，骑驴找马', effects: { INT: 1, MNY: 1, STR: -1 }, reply: '你花了三个月，最后跳到了一家更合适的公司。' },
        { text: '忍着，先攒钱', effects: { MNY: 2, STR: -1 }, set: 'endure', reply: '你留了下来，也把自己的一部分关掉了。' }
      ]
    },
    {
      id: 'y15', minAge: 25, maxAge: 32, weight: 6, once: 1, ifNotFlag: 'married',
      text: '过年回家，亲戚围着你问对象的事。',
      tags: ['情感'],
      options: [
        { text: '被安排去相亲', effects: { CHR: 1 }, then: 'y15a', reply: '你和那个人在咖啡馆坐了两个小时，聊得还行。' },
        { text: '说「我自己会处理」', effects: { INT: 1, CHR: 1 }, set: 'boundary', reply: '饭桌上安静了三秒，然后话题被岔开了。' },
        { text: '低头吃饭，让他们说', effects: { STR: -1 }, reply: '你吃完就回房间了，母亲跟进来又说了半小时。' }
      ]
    },
    {
      id: 'y15a', queuedOnly: 1, minAge: 26, maxAge: 34, weight: 1, once: 1, ifNotFlag: 'married',
      text: '相亲对象问你要不要再见一面。',
      tags: ['情感'],
      options: [
        { text: '见，慢慢了解', effects: { CHR: 1, STR: -1 }, set: 'dating', reply: '你们从每周一次变成了每天发消息。' },
        { text: '算了，感觉不合适', effects: {}, reply: '你礼貌地回了消息，然后删掉了对话框。' }
      ]
    }
  ];
});
