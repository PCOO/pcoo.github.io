# 项目交接说明

## Footer 一般字体标准

- Footer 底部信息的字体大小是本网站的**标准一般字体大小**。
- 桌面端标准：`1.75vw`。
- 移动端（`max-width: 600px`）标准：`0.75rem`。
- CSS 统一使用 `.site-footer` 上的 `--footer-body-font-size` 变量，不要在各组件中重复写死字号。
- Footer 最新作品的分类副标题与作品主标题必须保持相同字号，并与 Footer 底部信息使用同一变量。
- 后续新增 Footer 一般文本时，默认使用 `font-size: var(--footer-body-font-size)`；只有明确属于标题、菜单或品牌字标的内容才采用其他字号。

## 当前实现位置

- 首页与 Footer 样式：`index.html`
- 最新三篇作品共享模板：`_includes/featured-works.html`
- 正式首页入口仅为 `index.html`。

## Our services 移动端

- `max-width: 768px` 时，十项服务使用单列居中排列。
- 图片以底部居中的固定小窗展示，保留圆角、阴影及安全区间距；列表底部预留小窗高度，避免遮住末尾服务。
- 小窗仅在服务区进入视口时显示，移动菜单打开时隐藏；保留滚动、点击及焦点切换图片的交互。
- 桌面端继续使用左侧 sticky 图片与右侧服务列表。
