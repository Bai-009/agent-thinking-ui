# Agent Thinking UI

**让用户跟得上智能体的分析，并能从结论回到证据。**

智能体在一次任务中会连续产生判断、工具调用和结果。把这些信息全部铺开，会让用户在等待答案时承担额外的阅读负担；只显示加载状态，又无法帮助用户理解任务进展。

这个交互原型将运行态、完成态和开发者视图分开设计：运行时聚焦当前判断与行动，完成后按需展开证据，工程记录保留在独立入口。产品与交互设计、原型实现：**白东昊 / Bai-009**。

## 体验

下载仓库后，直接用浏览器打开 **[index.html](index.html)**，无需安装依赖或配置密钥。

1. 观察“判断 → 行动意图 → 执行反馈”依次出现；内容按阅读节奏呈现，而非跟随事件到达速度不断刷新。
2. 分析完成后，点击“详细证据”，逐层查看判断、执行动作和调用信息。
3. 点击答案中的 **① / ②**，直接展开与该结论关联的证据。
4. 点击答案下方的 **`</>`** 按钮，查看独立的开发者事件记录；按 Escape 关闭。
5. 点击右上角“重新演示”重播。

这是固定场景的交互原型。全部团队、费用、SQL、模型消息和运行指标均为重新编写的模拟数据；输入框不连接模型，不发送网络请求。展示文案、事件时间和阅读时长各自承担演示作用，不能作为模型性能指标。

## 关键设计

| 设计判断 | 实现方式 |
| --- | --- |
| 当前分析应有清晰的上下文 | 将判断、行动与工具结果绑定到同一次分析；新判断出现后，旧内容退出当前区域，迟到事件仍归档到原分析。 |
| 模型的输出速度不应决定用户的阅读速度 | 事件接收与展示队列分离；根据文本长度保留阅读时间，当前执行反馈最多显示三条。 |
| 详细信息应按需出现 | 运行中聚焦当前分析；完成后折叠为“判断 → 执行动作 → 调用信息”的证据树。 |
| 结论需要可定位的依据 | 答案引用打开对应查询和表结构记录，区分数据支持的结论与需要继续查询的问题。 |
| 业务理解与工程排查需要不同视图 | 原始事件、SQL、模型及 token 信息集中在开发者抽屉，不占用运行中的阅读区域。 |

## 文件

- `index.html`：页面布局、样式与无障碍标记。
- `app.js`：模拟事件、状态归属、展示队列、证据展开与开发者记录。

如需通过本机 HTTP 服务打开：

```sh
python3 -m http.server 8000
```

浏览器访问 `http://localhost:8000`。

## English

An interactive prototype for **progressive disclosure of agent activity**. It separates the live reasoning summary, intended action and tool feedback from the completed evidence archive and developer event log.

The event stream and presentation queue advance independently. Each analysis owns its actions and results, so late events remain attached to the correct context. Citations open the corresponding evidence instead of requiring readers to search the full trace.

Open `index.html` in a browser. No dependencies, backend or API key are required. All data and model messages are synthetic; this is a fixed-scenario UI prototype, not a live agent service.
