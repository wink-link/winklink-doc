# 開發者使用須知

WINkLink 價格餵價通過 7 個獨立預言機節點的去中心化網絡為智能合約提供鏈下價格數據。餵價數據在 DApp 中的表現，取決於**外部市場情況**和**應用集成代碼**兩方面的因素。在集成 WINkLink 價格餵價時，請關注以下兩類要點：**市場完整性**和**應用代碼**。

## 市場完整性

WINkLink 價格餵價反映真實市場情況，受外部市場環境的影響。集成方在使用餵價數據時，應理解所反映資產的市場特性，並在業務邏輯中考慮極端情況。

外部市場環境對餵價的影響包括：

- 所反映資產的市場結構（交易所分布、深度、流動性等）會影響價格穩定性
- 流動性較低的資產，對外部市場環境變化更敏感
- 在極端市場情況（劇烈波動、流動性驟降、市場異常）下，餵價的更新行為可能出現非預期變化

集成時建議結合自身業務場景考慮極端情況下的處理邏輯，並在上線後持續觀察餵價行為。

## 應用代碼

應用代碼的質量、可靠性以及對外部依賴的處理，直接影響 DApp 使用價格數據的穩健性。

### 校驗價格新鮮度

每個 WINkLink 價格餵價都有一個心跳週期（heartbeat），表示在該週期內鏈上價格必有更新。建議在使用價格前主動校驗時間戳：

```solidity
(uint80 roundId, int256 answer, , uint256 updatedAt, ) = priceFeed.latestRoundData();
require(updatedAt > 0, "Round not complete");
require(block.timestamp - updatedAt <= MAX_PRICE_AGE, "Price too stale");
```

`MAX_PRICE_AGE` 應大於該價格對的 heartbeat 週期，具體取值按業務容忍度選擇。

### 理解精度

WINkLink 價格餵價的精度（小數位數）可能因價格對而異。在做任何價格計算前，調用 `decimals()` 獲取精度：

```solidity
uint8 dec = priceFeed.decimals();
// 在計算中使用 dec 進行歸一化
```

不要假設精度為固定值。

### 保持合約可升級

避免將餵價合約地址硬編碼到不可變更的業務邏輯中。建議將其存儲為可由合約所有者或治理機制更新的變量，以便在 WINkLink 升級或棄用底層聚合器時，能夠平滑遷移到新的餵價合約。

### 先在 Nile 測試網測試

在把**你的消費合約**部署到主網前，請先在 Nile 測試網、指向 WINkLink 的 Nile 餵價地址完成完整集成測試：

- Nile 測試網餵價合約地址：見 [價格服務 → Nile 測試網](./pricing.md#nile-測試網)
- 測試網 TRX（用於部署和調用你自己的合約）獲取：[Nile 測試網水龍頭](https://nileex.io/join/getJoinPage)

### 關注 WINkLink 資訊變化

WINkLink 通過兩個渠道發佈價格餵價相關的更新，建議集成方持續關注與自身業務相關的內容：

- [**官方公告渠道**](https://winklink.org/#/supportCentre?lang=en-US)：發佈價格對停用/棄用通知、新增價格對上線等**事項**
- [**WINkLink 價格餵價詳情頁**](https://winklink.org/#/solutions?lang=en-US)：展示每個價格對的**實時配置參數**（如 heartbeat、deviation threshold），參數調整時此處會同步反映

建議在集成前記錄所用價格對的配置參數基線，便於上線後定期對比，及時發現參數變更。

### 上線後持續監控

集成完成上線後，建議持續監控以下信號：

- 餵價合約 `latestRoundData()` 返回是否按心跳週期定期更新
- 業務合約中 stale check 或相關校驗是否被觸發
- 上述異常事件的頻率與時間分布

可結合 TRON 區塊瀏覽器的事件訂閱或自建鏈下監控腳本實現。
