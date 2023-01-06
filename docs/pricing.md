# WINkLink 价格服务

## 介绍

智能合约经常需要对真实世界的代币资产价格做响应，在 DeFi 领域更是如此，资产价格必须和真实世界价格高度对应，
否则用户和开发者可能承受合约被套利或攻击带来的损失。

WINkLink 价格服务专注于数字货币价格对, 为 DApp 提供准确稳定的外部世界数字货币价格信息。

WINkLink 官方提供了聚合多个 WINkLink 预言机节点价格数据的方案，最终得到稳定的价格服务，称作喂价合约(Price Feed Contract).

本文介绍如何使用和部署 WINkLink 价格服务合约。

## 获取最新价格

消费者合约中获取最新价格数据需要引入 `AggregatorInterface`, 该接口定义了喂价服务对外提供的接口。

```js
pragma solidity ^0.5.0;

interface AggregatorInterface {
    function latestAnswer() external view returns (int256);
    function latestTimestamp() external view returns (uint256);
    function latestRound() external view returns (uint256);
    function getAnswer(uint256 roundId) external view returns (int256);
    function getTimestamp(uint256 roundId) external view returns (uint256);
}

contract PriceConsumer {
    AggregatorInterface internal priceFeed;

    /**
     * Price Aggregator Address: TYZxQSHAhxGgUWzxYEZAohvWc9cQWXtNBt
     */
    constructor() public {
        priceFeed = AggregatorInterface(0xF7e52418572834722ED87E9425d673FEdBD55a0e);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int) {
        // If the round is not complete yet, timestamp is 0
        require(priceFeed.latestTimestamp() > 0, "Round not complete");
        return priceFeed.latestAnswer();
    }
}
```

### 历史价格

由 `AggregatorInterface` 接口函数列表，通过 `getAnswer(uint256 roundId)` 可以获取历史价格信息。对应的时间戳通过
`getTimestamp(uint256 roundId)` 获得。

## 喂价合约

### 主网

| Pair     | 喂价合约地址                               |
| -------- |--------------------------------------|
| TRX-USD  | `TXwZqjjw4HtphG4tAm5i1j1fGHuXmYKeeP` |
| JST-USD  | `TPMkqBh7kU16Zmv9EAtm6vfWYrTax4Aucb` |
| SUNOLD-USD  | `TYzFE7fC46yjs3p5JUidvxzg9XMFT7qWZy` |
| BTC-USD  | `TTzPaLxJMy8nwXe9NRfHopHW4KyUeavLdF` |
| WIN-USD  | `TQU2nPFvemv6hbtmJ48Z749a7VcAmacV4D` |
| DICE-USD | `TP4nTfoGu9pTdMR4PNc6rH1NM7AS7MGWLm` |
| USDJ-USD | `TBxnH94m2Zsp869QpiAoCHt54wCsFSUsSP` |
| JST-TRX  | `TXMSfKwBfvY6THwnTzRRteYHdB125rKBKK` |
| WIN-TRX  | `TFtL1Kdb2n5yrVTxa6qYgwnNEAAGnKiuDT` |
| DICE-TRX | `TW4VZcEmjSBZLWjQiWr4jNitVGB2Bn3dCo` |
| LIVE-USD | `TFFVcMViFUn3UEXVMPeuWjb4xo6TwUacog` |
| USDT-USD | `TYWY6L4mECH2Gtiq3sg4zY4fvD1XZpwGrb` |
| SUNOLD-TRX  | `TGoKRdiC9TrEoVZcKNFRa7oDEdC4S6Ra9r` |
| BTC-TRX  | `TPdsKCrr3SJ2HMvt9tTVy3CjhN1CuvEUqc` |
| USDJ-TRX | `TRTpP7TN186YAncgn5Yfjnw4Kds56BneAc` |
| USDT-TRX | `TRf25FSQQzHQ7j1Td7dtYUBPb8R5yVCx2L` |
| BTTOLD-USD  | `TM2CEasFpeREBtLWgkzMqASkn5mvtf12He` |
| BTTOLD-TRX  | `TEDsjLSWQjERk4baV2NjPUDAzfxxACBgQE` |
| ETH-TRX  | `TBnthNeA1wjNDquD6kXYY2zTRLFyg5eMmj` |
| TUSD-USD | `TXyKzmu2J2eXcVspbLnnzuQmU2krLxb8dG` |
| TUSD-TRX | `TDtUKwNXhFp7HrKcAGR5jYEJBEURod8s2f` |
| NFT-USD  | `TS15kJyth5F7vAE5bpzAUumEGFDsnYkEGF` |
| NFT-TRX  | `TXSf7X1Dw7CGmykSQeNBDgKhCPw8Ehvggq` |
| SUN-USD  | `TAKUV2gwwmAG7fCtwSW9VwSrGnPikuuw5p` |
| SUN-TRX  | `TPVW4azkkthtLdYGLUPdQGLvU9Tciuhq5a` |
| USDC-USD | `THL5y573nNXkHbHY8ZkZNLPZTMXdkq9aFr` |
| USDC-TRX | `TSLmB88ek8npjBKeQRzdYZJMpabwfvj2PT` |
| ETH-USD  | `TZCPyp7fWW3xnQ6gv5LG9v7S7VYbr4h2H1` |
| USDD-USD  | `TAXZ1ido5jor7JeJNyMmvySd8uSSQaTZVk` |
| USDD-TRX  | `TRH63ix5DoZwoNEtYTpzykiJ7mW8Ak1fh7` |
| LTC-USD  | `TFhAq2W3fEse2rj8cLmQ29k4zP3X5CFc7z` |
| LTC-TRX  | `TA2DUPP9Nufru5QoRQSpVzVrTpmMRyLSU9` |
| BUSD-USD   | `TWQjWbMjkiMGcR5pbkdRcUgcXmyspxqSkD` |
| BUSD-TRX   | `TQBSnLu654t21xf5R3nNrvNs8q422RmZyo` |

### Nile 测试网

- 合约列表[查看页面](http://47.252.73.5:3300/#/solutions)
- WIN 代币合约地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合约地址: `TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb`

价格服务合约地址列表：

<!-- NOTE: multiline table, auto-formated -->

| Pair     | 喂价合约地址                         | 
|----------| ------------------------------------ |
| TRX-USD  | `TZEy2S7pTc69awGEPrRdARZ8FrjBUpbuRy` |
| USDT-USD | `TP3dn7bgNT6eygNhF33XZYfcXiswsNyTnb` |
| ETH-USD  | `TYvj7PaHUrPLC1vhjgL9PGvJ5FyA931KqM` |
| LTC-USD  | `TY4mKLTkC2eNF26Ax58VZG3nBg3vzYeKfJ` |
| LTC-TRX  | `TWmu8NugztyGXuYh2qxEAGmkESmJGbXNp1` |
| BUSD-USD | `TWn3oCuk4un2h2uZmkDQjYynm1u4iQHzQz` |
| BUSD-TRX | `TWVmGA1vtcWiigAZcxDJBCSrCjaj828MKa` |


### 申请新交易对

如果您需要 WINkLink 提供新的交易对，请填写并提交[申请表单](https://forms.gle/YiQWuBwNmHpzVckp7)

## 部署价格服务

开发者也可以部署自己的价格服务，自定义价格来源和最少响应预言机个数。

生产环境情况下，应该需要多个预言机节点来喂价，然后通过聚合得到一个最终的价格。
但在测试的流程下，我们暂且只设置一个节点来喂价。简化测试展示流程。

### 部署喂价合约

TronUser 合约是 WINkLink 官方推出的聚合价格服务合约模板，该合约实现了 `AggregatorInterface` 接口，开发者可以直接使用。

合约代码位于 [TronUser.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/TronUser.sol)

部署 TronUser 合约时需要在构造函数提供 WIN 代币地址和 WinkMid 合约地址。例如 Nile 测试网中，需要提供
`(TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2, TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb)`.

### 添加预言机节点以及 job ID

TronUser 合约部署完毕后，合约 owner 需要为其设置所聚合请求的预言机服务列表。使用如下接口：

```js
function updateRequestDetails(uint128 _paymentAmount, uint128 _minimumResponses, address[] _oracles, bytes32[] _jobIds)
```

其中 `_paymentAmount` 表示每次更新调用所支付代币数量。

`_oracles` 和 `_jobIds` 是一对等长列表，每组对应一个 WINkLink 预言机 job 唯一标识。

`_minimumResponses` 表示需要的最少响应预言机个数，必须大于等于 `_oracles` 长度。
例如可以设置要求至少 5/10 个预言机响应后，本次更新值才有效。

示例调用 `updateRequestDetails(10, 1, ["TR9jYcLWAcQfbKcP5oau1ccSbeW7mdnqg8"], ["db22ccf4b4a14d0cae2a0757632e425d"])`.

### 为合约转入 WIN 代币

TronUser 合约需要使用 `transferAndCall` 调用 Oracle 合约，所以合约账户需要有足够的 WIN 代币。
可以通过转账或测试网水龙头为合约转入若干 WIN 代币。

### 调用喂价合约

#### 更新价格 requestRateUpdate

使用如下接口请求 WINkLink 预言机节点从外部数据源获取最新价格：

```js
function requestRateUpdate() returns (bytes32)
```

接口返回 `requestID`. 通过 `requestID` 可以取消更新价格请求。

#### 获取最新价格 latestAnswer

使用 `AggregatorInterface` 中的 `latestAnswer()` 调用可以获取最新价格。

TronScan 的合约信息页面可以直接调用该方法获得最新值。
