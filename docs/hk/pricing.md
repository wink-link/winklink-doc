# WINkLink 價格服務

## 介紹

智能合約經常需要對真實世界的代幣資產價格做出反應，在 DeFi 領域更是如此，資產價格必須與真實世界價格高度對應，
否則用戶和開發者可能承受合約被套利或攻擊帶來的損失。

WINkLink 價格服務專注於數字貨幣價格對, 為 DApp 提供準確穩定的外部世界數字貨幣價格信息。

WINkLink 官方提供了聚合多個 WINkLink 預言機節點價格數據的方案，最終得到穩定的價格服務，稱作餵價合約(Price Feed Contract)。

本文介紹如何使用和部署 WINkLink 價格服務合約。

## 獲取最新價格

消費者合約中獲取最新價格數據需要引入 `AggregatorInterface`, 該接口定義了餵價服務對外提供的接口。

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

### 歷史價格

由 `AggregatorInterface` 接口函數列表，通過 `getAnswer(uint256 roundId)` 可以獲取歷史價格信息。對應的時間戳通過
`getTimestamp(uint256 roundId)` 獲得。

## 餵價合約

### 主網

| Pair       | Contract Address (Proxy)            |
|------------|-------------------------------------|
| BTC-TRX    | TX4rin6u2SaF3TqANqRgzfSCGi95azQNVY  |
| BTC-USD    | TQoijQ1iZKRgJsAAWNPMu6amgtCJ3WMUV7  |
| BTT-TRX    | TS26cn4GmmipyGTcgvRRwqL6AyEU6vK4rw  |
| BTT-USD    | TBAAW545oJ6iTxqzezGvagrSUzCpz1S8eR  |
| BTTOLD-TRX | TUjTmKMxGmH78t5DmY7YsfJFoGw6XyX9VZ  |
| BTTOLD-USD | TEEnwU47Fgx4Ehii7Xs9bLWK3XKo4fs6sV  |
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

### Nile 測試網

- WIN 代幣合約地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合約地址: `TLDU7C8K3Gd3pXrAj9gtpVVNRHZHuHHZ8P`

價格服務合約地址列表：

| Pair         | Nile (Proxy)                         |
|:-------------|:-------------------------------------|
| BTC-TRX      | TFETSL1Yc8dCJM7z6uBkHhAsPbqP5UaCDE   |
| BTC-USD      | TAX8Pm3FgN74za72TFZrn5gPBxJTKgnnpE   |
| BTT-TRX      | TKbeHN2hdrgSShG6iF3mDsJTu9fFzNrHjo   |
| BTT-USD      | TJdzg4wqBt4JkP1ehbYQufg1cLjbomT2j7   |
| BTTOLD-TRX   | TETkTRbnyB4ptWiK9qXgiyFxQQ9d8ZacT6   |
| BTTOLD-USD   | TRpRfFzubR7oheDCwHRbwJRfeFa85L6tWE   |
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

### 申請新交易對

如果您需要 WINkLink 提供新的交易對，請填寫並提交[申請表單](https://forms.gle/YiQWuBwNmHpzVckp7)

## 部署價格服務
開發者也可以部署自己的價格服務，自定義價格來源和最少響應預言機個數。

生產環境情況下，應該需要多個預言機節點來餵價，然後通過聚合得到一個最終的價格。
但在測試的流程下，我們暫且只設置一個節點來餵價。簡化測試展示流程。

### 部署餵價合約

TronUser 合約是 WINkLink 官方推出的聚合價格服務合約模板，該合約實現了 `AggregatorInterface` 接口，開發者可以直接使用。

合約代碼位於[TronUser.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/TronUser.sol)

部署 TronUser 合約時需要在構造函數提供 WIN 代幣地址和 WinkMid 合約地址。例如 Nile 測試網中，需要提供
`(TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2, TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb)`。

### 添加預言機節點以及 job ID

TronUser 合約部署完畢後，合約 owner 需要為其設置所聚合請求的預言機服務列表。使用如下接口：

```solidity
function updateRequestDetails(uint128 _paymentAmount, uint128 _minimumResponses, address[] _oracles, bytes32[] _jobIds)
```

其中 `_paymentAmount` 表示每次更新調用所支付代幣數量。

`_oracles` 和 `_jobIds` 是一對等長列表，每組對應一個 WINkLink 預言機 job 唯一標識。

`_minimumResponses` 表示需要的最少響應預言機個數，必須大於等於 `_oracles` 長度。
例如可以設置要求至少 5/10 個預言機響應後，本次更新值才有效。

示例調用 `updateRequestDetails(10, 1, ["TR9jYcLWAcQfbKcP5oau1ccSbeW7mdnqg8"], ["db22ccf4b4a14d0cae2a0757632e425d"])`。

### 為合約轉入 WIN 代幣

TronUser 合約需要使用 `transferAndCall` 調用 Oracle 合約，所以合約帳戶需要有足夠的 WIN 代幣。
可以通過轉賬或測試網水龍頭為合約轉入若干 WIN 代幣。

### 調用餵價合約

#### 更新價格 requestRateUpdate

使用如下接口請求 WINkLink 預言機節點從外部數據源獲取最新價格：

```solidity
function requestRateUpdate() returns (bytes32)
```

接口返回 `requestID`。 通過 `requestID` 可以取消更新價格請求。

#### 獲取最新價格 latestAnswer

使用 `AggregatorInterface` 中的 `latestAnswer()` 調用可以獲取最新價格。

TronScan 的合約信息頁面可以直接調用該方法獲得最新值。

