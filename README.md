# 人生重开模拟器

一个纯前端的文字人生模拟：抽天赋 → 分配属性 → 逐年看事件 → 结算评级。

零依赖、零构建，双击 `index.html` 就能玩，手机上也能开。

## 玩法

1. **抽天赋**：从 36 个天赋池里随机抽 10 张，选 3 张。有稀有天赋（金色边框）。
2. **分属性**：20 点自由分配到 颜值 / 智力 / 体质 / 家境，单项出生上限 10 点。可以「随机分配」偷懒。
3. **过一生**：一年一条事件，手动点「下一年」、开「自动」播放，或者直接「过完一生」跳到结算。
4. **结算**：按最终属性 + 寿命算分，评 E~SSS 八档。

键盘：空格 / 回车 = 下一年。

## 数值设计

**寿命**在出生时就定死了：

```
寿命 = 62 + 体质 × 1.6 + 智力 × 0.5 + 家境 × 0.35 ± 8
```

所以出生分配就是"命"，后天改不了。中途**体质掉到 0 会当场死亡**——这是逆天改命失败的唯一方式。

**评分** = 四项最终属性之和 + 寿命 × 0.4，再按阈值切八档。当前阈值是用 2 万次模拟的实际分布定的，大致比例：

| 评级 | 标题 | 阈值 | 约占比 |
|---|---|---|---|
| SSS | 传说 | ≥132 | 0.6% |
| SS | 传奇 | ≥124 | 2.5% |
| S | 卓越 | ≥117 | 6.7% |
| A | 精彩 | ≥109 | 16% |
| B | 不错 | ≥100 | 25% |
| C | 普通 | ≥85 | 27% |
| D | 平凡 | ≥55 | 11% |
| E | 遗憾 | ≥0 | 11% |

**死亡结构**（2 万次模拟实测）：寿终正寝 73%、身体撑不住 20%、意外 3.7%、病故 3.3%。中位寿命 76 岁。

## 目录

```
index.html          五个页面的骨架
css/style.css       全部样式（深色 / 移动优先 / max-width 480px）
js/engine.js        纯逻辑，UMD，不碰 DOM —— 可注入 RNG，可在 Node 里跑
js/data.js          36 个天赋 + 113 条事件 + 8 档评级
js/app.js           界面宿主，只管 DOM 和流程
test/sim.js         Node 批量模拟 + 数据校验
test/ui-drive.html  无头浏览器里驱动完整交互流程
test/layout-check.html  320px 窄屏布局检查
```

引擎（`js/engine.js`）不依赖 DOM，所以同一份逻辑既跑在浏览器里，也跑在 Node 测试里——**改数值只用改 `js/data.js`，改完跑测试就能看到分布变化**。

## 测试

```bash
node test/sim.js          # 批量模拟 20000 次（可传次数: node test/sim.js 50000）
```

会校验数据完整性（id 重复、属性名拼错、年龄断档）、跑批量模拟、断言寿命与评级分布没有塌缩，并验证「含着金汤匙」确实比「家徒四壁」得分高。

浏览器侧的两个测试需要一个 Chrome：

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 交互流程（32 项）
"$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
  --dump-dom --virtual-time-budget=20000 \
  "file://$PWD/test/ui-drive.html" 2>/dev/null | grep -o 'PASS\|FAIL'

# 320px 窄屏布局
"$CHROME" --headless=new --disable-gpu --no-sandbox --allow-file-access-from-files \
  --dump-dom --virtual-time-budget=25000 \
  "file://$PWD/test/layout-check.html" 2>/dev/null | grep -o 'PASS\|FAIL'
```

布局测试里会临时把 `.screen` 的 transition 关掉——headless 的虚拟时间下动画采样不确定，不关的话测量会抖。

## 调平衡的三个坑

改事件数值时踩过的：

1. **「体质 -1」事件别堆太多**。它们每年都可能抽到，累积几十年足以让体质归零，全人类三十岁暴毙。第一版就是这么翻车的（中位寿命 29 岁）。
2. **终局事件的权重要小到反直觉**。`weight: 1` 看着很低，但它在 80 年里每年都在抽，累计下来能让 66% 的人死于意外/病故。现在给的是 0.03 和 0.05。
3. **评级阈值要按实测分布定，不能拍脑袋**。第一版把 SSS 设在 230，而实际最高分才 146——前四档永远够不着。

## 想继续加的话

- 更多天赋/事件：直接往 `js/data.js` 的数组里加，`test/sim.js` 会帮你查 id 重复和属性名拼错。
- 属性上限：`js/engine.js` 里的 `ATTR_CAP_BIRTH`（出生）和 `ATTR_MAX`（后天）。
- 存档：`js/app.js` 的 `loadStats/saveStats`，目前只存「活过几次」和最高分。
