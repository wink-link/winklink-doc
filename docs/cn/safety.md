# 开发者使用须知

WINkLink 价格喂价通过 7 个独立预言机节点的去中心化网络为智能合约提供链下价格数据。喂价数据在 DApp 中的表现，取决于**外部市场情况**和**应用集成代码**两方面的因素。在集成 WINkLink 价格喂价时，请关注以下两类要点：**市场完整性**和**应用代码**。

## 市场完整性

WINkLink 价格喂价反映真实市场情况，受外部市场环境的影响。集成方在使用喂价数据时，应理解所反映资产的市场特性，并在业务逻辑中考虑极端情况。

外部市场环境对喂价的影响包括：

- 所反映资产的市场结构（交易所分布、深度、流动性等）会影响价格稳定性
- 流动性较低的资产，对外部市场环境变化更敏感
- 在极端市场情况（剧烈波动、流动性骤降、市场异常）下，喂价的更新行为可能出现非预期变化

集成时建议结合自身业务场景考虑极端情况下的处理逻辑，并在上线后持续观察喂价行为。

## 应用代码

应用代码的质量、可靠性以及对外部依赖的处理，直接影响 DApp 使用价格数据的稳健性。

### 校验价格新鲜度

每个 WINkLink 价格喂价都有一个心跳周期（heartbeat），表示在该周期内链上价格必有更新。建议在使用价格前主动校验时间戳：

```solidity
(uint80 roundId, int256 answer, , uint256 updatedAt, ) = priceFeed.latestRoundData();
require(updatedAt > 0, "Round not complete");
require(block.timestamp - updatedAt <= MAX_PRICE_AGE, "Price too stale");
```

`MAX_PRICE_AGE` 应大于该价格对的 heartbeat 周期，具体取值按业务容忍度选择。

### 理解精度

WINkLink 价格喂价的精度（小数位数）可能因价格对而异。在做任何价格计算前，调用 `decimals()` 获取精度：

```solidity
uint8 dec = priceFeed.decimals();
// 在计算中使用 dec 进行归一化
```

不要假设精度为固定值。

### 保持合约可升级

避免将喂价合约地址硬编码到不可变更的业务逻辑中。建议将其存储为可由合约所有者或治理机制更新的变量，以便在 WINkLink 升级或弃用底层聚合器时，能够平滑迁移到新的喂价合约。

### 先在 Nile 测试网测试

在把**你的消费合约**部署到主网前，请先在 Nile 测试网、指向 WINkLink 的 Nile 喂价地址完成完整集成测试：

- Nile 测试网喂价合约地址：见 [价格服务 → Nile 测试网](./pricing.md#nile-测试网)
- 测试网 TRX（用于部署和调用你自己的合约）获取：[Nile 测试网水龙头](https://nileex.io/join/getJoinPage)

### 关注 WINkLink 信息变化

WINkLink 通过两个渠道发布价格喂价相关的更新，建议集成方持续关注与自身业务相关的内容：

- [**官方公告渠道**](https://winklink.org/#/supportCentre?lang=en-US)：发布价格对停用/弃用通知、新增价格对上线等**事项**
- [**WINkLink 价格喂价详情页**](https://winklink.org/#/solutions?lang=en-US)：展示每个价格对的**实时配置参数**（如 heartbeat、deviation threshold），参数调整时此处会同步反映

建议在集成前记录所用价格对的配置参数基线，便于上线后定期对比，及时发现参数变更。

### 上线后持续监控

集成完成上线后，建议持续监控以下信号：

- 喂价合约 `latestRoundData()` 返回是否按心跳周期定期更新
- 业务合约中 stale check 或相关校验是否被触发
- 上述异常事件的频率与时间分布

可结合 TRON 区块浏览器的事件订阅或自建链下监控脚本实现。
