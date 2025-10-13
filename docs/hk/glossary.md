# 術語表

## 預言機 Oracle

將鏈上計算與鏈下資源聯系起來的實體。由兩部分構成: Oracle 節點和 Oracle 合約。

## 預言機合約 Oracle Contract

Oracle 的鏈上組成部分。Oracle合約是消費合約傳遞和接受鏈下資源的接口。

## 預言機節點 Oracle Node

Oracle 的鏈下組成部分。

## 消費者合約 Consumer Contract

Oracle 所獲取到結果的接受者。 
例如 `TronUser` 餵價合約請求多個 Oracle 更新最新價格，並聚合結果。

消費者一般來說是發起請求的合約，但也可以不是。 
例如 `PriceConsumer` 通過 `AggregatorInterface` 查詢最新價格，並沒有請求 Oracle, 而是查詢餵價合約的最新結果。 
它也是一個消費者合約。
