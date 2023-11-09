# WINkLink 价格服务

## 介绍

智能合约经常需要对真实世界的代币资产价格做响应，在 DeFi 领域更是如此，资产价格必须和真实世界价格高度对应，
否则用户和开发者可能承受合约被套利或攻击带来的损失。

WINkLink 价格服务专注于数字货币价格对, 为 DApp 提供准确稳定的外部世界数字货币价格信息。

WINkLink 官方提供了聚合多个 WINkLink 预言机节点价格数据的方案，最终得到稳定的价格服务，称作喂价合约(Price Feed Contract)。

本文介绍如何使用和部署 WINkLink 价格服务合约。

## 获取最新价格

消费者合约中获取最新价格数据需要引入 `AggregatorInterface`, 该接口定义了喂价服务对外提供的接口。

```solidity
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

| Pair       | Contract Address (Proxy)            |
|------------|-------------------------------------|
| BTC-TRX    | TX4rin6u2SaF3TqANqRgzfSCGi95azQNVY  |
| BTC-USD    | TQoijQ1iZKRgJsAAWNPMu6amgtCJ3WMUV7  |
| BTT-TRX    | TS26cn4GmmipyGTcgvRRwqL6AyEU6vK4rw  |
| BTT-USD    | TBAAW545oJ6iTxqzezGvagrSUzCpz1S8eR  |
| BTTOLD-TRX | TUjTmKMxGmH78t5DmY7YsfJFoGw6XyX9VZ  |
| BTTOLD-USD | TEEnwU47Fgx4Ehii7Xs9bLWK3XKo4fs6sV  |
| BUSD-TRX   | TNjd3CCfdbpYZVNz6Tzf7LtjU3wT4Pit8w  |
| BUSD-USD   | TTwxWVbsLfQTBLqWiremnZtzddeUCYDC8r  |
| ETH-TRX    | TXZ9AUk6nC2454NSDGUWvPB72JxSNJrezX  |
| ETH-USD    | TR2yWYWovJaSM7TfZq7L7sT7ZRugdJJQmL  |
| JST-TRX    | TC19QPF2mjP1ZhXxD8JNKJs4ksxMZkCuNP  |
| JST-USD    | TE5rKoDzKmpVAQp1sn7x6V8biivR3d5r47  |
| LIVE-USD   | TNdLmxVhdj1H1yGjhhSp33cMaAJKjyTAM4  |
| LTC-TRX    | TVJPFXKMysYsRWEXJ3JkSnAUPucinUFUB6  |
| LTC-USD    | TGxGL85kN3W5sGdBiobgWabWFcMEtoqRJJ  |
| NFT-TRX    | TKtc1V6QAY1Gpy511QjzXkLUphG8Dre8CY  |
| NFT-USD    | TEC8b2oL6sAQFMiea73tTgjtTLwyV1GuZU  |
| STRX-TRX   | TW9bNueyJZA9iZnNXGYkJuPJJ7KFN3o5qw  |
| SUN-TRX    | TLLyqXr5cbYEMjzeThe1esss1SVBbxxubu  |
| SUN-USD    | TRMgzSPsuWEcVpd5hv19XtLeCk8Z799sZa  |
| SUNOLD-TRX | TWAob1YsNzh7bfgkjfAD9MAdarcoSWScWw  |
| SUNOLD-USD | TEEuSdqyv2NFREtNoUXMTDSmJVK3KCuLac  |
| TRX-USD    | TR5HtpPK4gX4RFC4DCBUHfFgsGkGFEzSAb  |
| TUSD-TRX   | TLXMULb1SRpv841Q54C4DhWkmmGfRA2rUH  |
| TUSD-USD   | TBc3yBP8xcyQ1E3hDTUhRxToMrgekLH2kh  |
| USDC-TRX   | TNTm5ezUGHxYc9Mvst58yYTAjxDmqWWGZc  |
| USDC-USD   | TNu3zS55MP4KnBBP6Maw1nHSzRpc3CXAxm  |
| USDD-TRX   | TWW4P2pck8rFcxx3H8NfnH4qhNPu1V35Pb  |
| USDD-USD   | TJ7jEgoYVaeymVfYZ3bS57dYArwVDS1mhW  |
| USDJ-TRX   | TCBKyYMP4YQFHxYznuUaResHDTaEWLuJNW  |
| USDJ-USD   | TB1MyT7pDCNg8w7cSW1QvYKs4WPzErzP5k  |
| USDT-TRX   | TUfV7S4RYtdmBvtHzedfFPVsK9nvndtETp  |
| USDT-USD   | TKePc46n5CiUCR8LL788TFeKA4kjvNnuem  |
| WIN-TRX    | TQvCG1U2jGTVwXLqvFWR27LDtEJZVgRbEg  |
| WIN-USD    | TSCef3LT3jpLwwXCWhZe3hZoMsYk1ZLif2  |
| WSTUSDT-TRX | TKcTU5vCPqBBfuULEGXg9kkLx6Tzs2Zo3x |

### Nile 测试网

- WIN 代币合约地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合约地址: `TLDU7C8K3Gd3pXrAj9gtpVVNRHZHuHHZ8P`

价格服务合约地址列表：

| Pair         | Nile (Proxy)                         |
|:-------------|:-------------------------------------|
| BTC-TRX      | TFETSL1Yc8dCJM7z6uBkHhAsPbqP5UaCDE   |
| BTC-USD      | TAX8Pm3FgN74za72TFZrn5gPBxJTKgnnpE   |
| BTT-TRX      | TKbeHN2hdrgSShG6iF3mDsJTu9fFzNrHjo   |
| BTT-USD      | TJdzg4wqBt4JkP1ehbYQufg1cLjbomT2j7   |
| BTTOLD-TRX   | TETkTRbnyB4ptWiK9qXgiyFxQQ9d8ZacT6   |
| BTTOLD-USD   | TRpRfFzubR7oheDCwHRbwJRfeFa85L6tWE   |
| BUSD-TRX     | TDBQRjnrdrDKcgPDyLuP11UC8CV8hwZGxe   |
| BUSD-USD     | TAiAAKcD4FtNhcJ8q9ZpkpnvSJ5R9XqYVx   |
| ETH-TRX      | TSVJwLrhWBF7K6BkEG6hStjMxQJXAzBABQ   |
| ETH-USD      | TQGyY3mWTTzKKBLBg3wQTSbAGqBnGqYSzX   |
| JST-TRX      | TSf6ZwFrDg5Jvyci1PnRHrrZvPpCCKNTjj   |
| JST-USD      | TJ7SizJiCAjMPAri1CFAxzg4xCRLycumMj   |
| LIVE-USD     | TPxNjLNrn3WAwoyGQgqJyw3dLo9E79mUdH   |
| LTC-TRX      | TWProfbHdGBCf7HVNys5KAbVT4vhUwpu22   |
| LTC-USD      | TRSFTb2seuQxQqUsyeJ8Wg8XhX1e2g3T19   |
| NFT-TRX      | TWP99RnyMVKFjzuu9XT5J21qBZu8DwhCum   |
| NFT-USD      | TX5KVe4sp24w5HJ4nfk2ZstRhV8RTFm67W   |
| STRX-TRX     | TEbUQ4gohuK5wdtKmpnGd2kvyzhhznJDCx   |
| SUN-TRX      | TTxxeWGpSDV3zPDxnYXzG1ue7RpTYTvDpY   |
| SUN-USD      | TJjENuVH7TD8RJdGtj22ac6Bt1ktpBGURR   |
| SUNOLD-TRX   | TNfn4qt4QJ7LAndM2aWbxrGGH8CRGvzxui   |
| SUNOLD-USD   | TMKzWKMA1gSwjYSL6VpfCUXLuwPKdjEsQ2   |
| TRX-USD      | TCeXRh9vcb78j2Eb2oJk4YwwnoHQDT64T1   |
| TUSD-TRX     | TM1bvBzHkRrQqvvHGi1CC1Heb8ESWreiNW   |
| TUSD-USD     | TUuxMFxv6qPn1ymZoYY45SSK1hhEVAvyKz   |
| USDC-TRX     | TWio8JqYx2aey49ua2ohLoyBPbVVWos8RB   |
| USDC-USD     | TF5a2qhfxtWzUQnAocPoxgKXLe1vEE8oER   |
| USDD-TRX     | TFr7TWdb5RWPNCfecr3HNfnCmNNL8qvgmJ   |
| USDD-USD     | TX264fxRmdhNfUgkruk9orzAVvtCehyowq   |
| USDJ-TRX     | TDJtnT7JRNqmNaqY1mK9i1xWN4GnX1UfGd   |
| USDJ-USD     | TKZUQTYAhH1LTG67QmhX4HxTWZdvLfH9d1   |
| USDT-TRX     | TJL5M1QqL7oF2ceazAFJ2ump9jf87jUqnK   |
| USDT-USD     | TT2ETLY1Mmx2DKYT9S6fMvKGPqbWH3LDEJ   |
| WIN-TRX      | TP7aHYuXUkKPKsojs9BNJDVyAJeQ2KtfCj   |
| WIN-USD      | TYYMqsRNZTwsiFkRtn2NewvXT9GnnsPBH9   |
 | WSTUSDT-TRX  | TZGEUihByCHG79Hbpider6pGZfY9S8ct6P   |

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

```solidity
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

```solidity
function requestRateUpdate() returns (bytes32)
```

接口返回 `requestID`. 通过 `requestID` 可以取消更新价格请求。

#### 获取最新价格 latestAnswer

使用 `AggregatorInterface` 中的 `latestAnswer()` 调用可以获取最新价格。

TronScan 的合约信息页面可以直接调用该方法获得最新值。
