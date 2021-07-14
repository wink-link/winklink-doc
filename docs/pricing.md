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

| Pair     | 喂价合约地址                         |
| -------- | ------------------------------------ |
| TRX-USD  | `TNwqbPTDLgGQVfLz75NnaMfsrVHbKQBuCo` |
| JST-USD  | `TAKipCT5xdCKkB8BTEGV8A9pysbnLSbK4v` |
| SUNOLD-USD  | `THVdX8xZfjUtZEHFYDzZhQF6HzwjBeivo6` |
| BTC-USD  | `TFBF8bBpQbrhzEZbTyXXPmB3a4tXmqqk7Y` |
| WIN-USD  | `TBdQHu2hd5obmikZWn4KkuqmxaN1LCEp4U` |
| DICE-USD | `TYQh9z6g2aGB1mQwRzGvdFphkt1nEjAMY2` |
| USDJ-USD | `TBbg182ovR4Ra282MERwDwiyCVS2gtjF8g` |
| JST-TRX  | `TCf4vSQLbHBFKzezHudEpvnhJ5GNQ6F2Ex` |
| WIN-TRX  | `TR6LAm2T1kdqgZBYWBtyS9HXs11KhvK5cq` |
| DICE-TRX | `TLjFYyi7Va3nUfEgUiL5S1YgLqPYjv7aF4` |
| LIVE-USD | `TBpcwZo2Vk825nss6WSSdhVz7NWqt5aS1U` |
| USDT-USD | `TZ8u8sz1ToRfGaQ5JbYNwEiuRTXUBe9tFx` |
| SUNOLD-TRX  | `TE14YrYpFtrPqxVSQ6V4WUsTniwfdcxbAR` |
| BTC-TRX  | `TGNLjD435kXGoHi9JiFvrDr9SQE6eyu91X` |
| USDJ-TRX | `TDQA9eG9tmS7JbbFbzfcxvQn1Z9xuPt62V` |
| USDT-TRX | `TWBz6RPTbgEu9qY72NNRSZprD88DnHzizw` |
| BTT-USD  | `THNCvWFdV3Qe2SeFWzz95XvjjsmBPtHi6q` |
| BTT-TRX  | `TSEu2g6oD5ukHYvKbn2shc9mdpELySgbv9` |
| ETH-TRX  | `TENtY6C9WiCpGenjUFwf33DYTcrV7GEZuh` |

### Nile 测试网

- 合约列表[查看页面](http://47.252.73.5:3300/#/solutions)
- WIN 代币合约地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合约地址: `TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb`

价格服务合约地址列表：

<!-- NOTE: multiline table, auto-formated -->

| Pair      | 喂价合约地址                         | Oracle 合约地址                                                                                                                                                                                      | job id                                                                                                                                                                                     |
| --------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TRX-USD   | `TAL6RWymPLepKsLGCzWPUTKQQcWFsuHfNE` | `TRDh1Hi4Hugb4J7DiQfvW6mCf8xGTEsQ66`<br>`TVKZGaPgSg8r3Pjyd5LsvbYEM5WRwfMetc`<br>`TQdYZe2XK2MwXx4PgDLuTWy4rhsc1A87wu`<br>`TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`<br>`TEx4rxit3Au6ek5avy4Aiy1N6Fyt38AS3o` | `bb347a9a63324fd995a7159cb0c8348a`<br>`40691f5fd4b64ab4a5442477ed484d80`<br>`f7ccb652cc254a19b0b954c49af25926`<br>`38cd68072a6c4a0ca05e9b91976cf4f1`<br>`328697ef599043e1a301ae985d06aabf` |
| JST-USD   | `TYr8nvS9BUbi9eLXNQpUMbxdvwYpoWn3ho` | `TRDh1Hi4Hugb4J7DiQfvW6mCf8xGTEsQ66`<br>`TVKZGaPgSg8r3Pjyd5LsvbYEM5WRwfMetc`<br>`TQdYZe2XK2MwXx4PgDLuTWy4rhsc1A87wu`<br>`TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                         | `b09f188f336844e2b4f93ec7c2cc238f`<br>`ca97ef49175a44078c2c2933287915fd`<br>`1f26180c61824d25b822d76972f16d7d`<br>`c10608a577214eba904a7673d4e97fca`                                       |
| SUNOLD-USD   | `TWWjBHU3KkuV65rTVkA4UrCrGwBRTXs3KK` | `TRDh1Hi4Hugb4J7DiQfvW6mCf8xGTEsQ66`<br>`TVKZGaPgSg8r3Pjyd5LsvbYEM5WRwfMetc`<br>`TQdYZe2XK2MwXx4PgDLuTWy4rhsc1A87wu`<br>`TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                         | `884366e5e9e441d6a792f77907778345`<br>`e109e9a1dc26475a834446509468ac59`<br>`d528c7c0d4784d0d9b53b932694b44fe`<br>`3f0a614654704ec3b50da1612b478ecb`                                       |
| BTC-USD   | `TYY5GdNvHN8NVY6MYtgEPwx15pyUmLEw5J` | `TRDh1Hi4Hugb4J7DiQfvW6mCf8xGTEsQ66`<br>`TVKZGaPgSg8r3Pjyd5LsvbYEM5WRwfMetc`<br>`TQdYZe2XK2MwXx4PgDLuTWy4rhsc1A87wu`<br>`TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`<br>`TEx4rxit3Au6ek5avy4Aiy1N6Fyt38AS3o` | `5a0f83ca61d74bad961acd0912adc53f`<br>`4f929a07ad1b4efba8fa686ad9641738`<br>`7c2457a191bf43488419adf7c48d4ff0`<br>`83d851c6627e4fed8c0e24292e1dc42f`<br>`1fc45a68c7f346229f08aee1982daa0e` |
| WIN-USD   | `TGPDYFAcFx8ZXf7sGTLwbvsDh8FdEnsNyN` | `TVKZGaPgSg8r3Pjyd5LsvbYEM5WRwfMetc`<br>`TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                                                                                                         | `2f6c1f3dbb634e60910da542df34a94a`<br>`ca4821f3c5ef4b2cb8ee330a6f634520`                                                                                                                   |
| DICE-USD  | `TS8fAMLNnbWgNyXz6queFHR7HfZkhAeppK` | `TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                                                                                                                                                 | `ad7888ed606d4b249edd298791f0c2d7`                                                                                                                                                         |
| USDJ-USDT | `TMmh7ZJkXpz4fE9FyFvRByMwvBE5Z2cRj8` | `TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                                                                                                                                                 | `b0ec07370a734d0cbdfabf6fe0e903c0`                                                                                                                                                         |
| JST-TRX   | `THs9f15hC6r6rWzAE2NBUyiX2SetwDCnYD` | `TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                                                                                                                                                 | `4ac87bf722da4659ae9989c2ad7646ae`                                                                                                                                                         |
| WIN-TRX   | `TReQocbkKBbGrgzoYWQ8bJnCNG1LGehwZw` | `TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                                                                                                                                                 | `febfcef0ce234fbdabaad191f2c4c542`                                                                                                                                                         |
| DICE-TRX  | `TSejCUHkk5gD2UjtoPt3n3rdByTbKLac4Q` | `TFKq9ZyySXFe1iCtWyYAFbJFCV9uEt5ghb`                                                                                                                                                                 | `c22e485bb31a4680b7eff3dc590d8c8f`                                                                                                                                                         |

### 申请新交易对

如果您需要 WINkLink 提供新的交易对，请填写并提交[申请表单](https://docs.google.com/forms/d/e/1FAIpQLSdPqV3oWV87FYdox5D_J6BIve7R5eG0cHIGsh49r8gg_QiNeQ/viewform)。

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
