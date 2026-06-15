# WINkLink 價格服務

> 集成前請參考 [開發者使用須知](./safety.md)。

## 概覽

### WINkLink 價格服務介紹

為確保智能合約能反映真實世界的代幣價格，需經常對合約的價格信息進行更新。 其中，DeFi 資產的價格尤其需要和現實世界資產緊密掛鉤， 否則可能導致套利或合約攻擊，給用戶和開發者造成損失。

WINkLink 價格服務專註於數字貨幣價格對，為去中心化應用（DApp）提供準確穩定的外部世界數字貨幣價格信息。 WINkLink 打造了聚合多個預言機節點價格數據的解決方案，從而提供穩定的價格服務，稱作餵價合約（Price Feed Contract）。

上述合約稱為**聚合器（Aggregator）** —— 持有 WINkLink 預言機節點聚合價格數據的鏈上合約。每個價格餵價（如 BTC/USD）由一個聚合器合約實現，消費合約通過它讀取價格。

## 支持的價格對列表及配置

### 主網

| 價格對         | 合約地址（代理）                           |
|-------------|------------------------------------|
| BTC-TRX     | [TX4rin6u2SaF3TqANqRgzfSCGi95azQNVY](https://tronscan.org/#/contract/TX4rin6u2SaF3TqANqRgzfSCGi95azQNVY) |
| BTC-USD     | [TQoijQ1iZKRgJsAAWNPMu6amgtCJ3WMUV7](https://tronscan.org/#/contract/TQoijQ1iZKRgJsAAWNPMu6amgtCJ3WMUV7) |
| BTT-TRX     | [TS26cn4GmmipyGTcgvRRwqL6AyEU6vK4rw](https://tronscan.org/#/contract/TS26cn4GmmipyGTcgvRRwqL6AyEU6vK4rw) |
| BTT-USD     | [TBAAW545oJ6iTxqzezGvagrSUzCpz1S8eR](https://tronscan.org/#/contract/TBAAW545oJ6iTxqzezGvagrSUzCpz1S8eR) |
| BTTOLD-TRX  | [TUjTmKMxGmH78t5DmY7YsfJFoGw6XyX9VZ](https://tronscan.org/#/contract/TUjTmKMxGmH78t5DmY7YsfJFoGw6XyX9VZ) |
| BTTOLD-USD  | [TEEnwU47Fgx4Ehii7Xs9bLWK3XKo4fs6sV](https://tronscan.org/#/contract/TEEnwU47Fgx4Ehii7Xs9bLWK3XKo4fs6sV) |
| ETH-TRX     | [TXZ9AUk6nC2454NSDGUWvPB72JxSNJrezX](https://tronscan.org/#/contract/TXZ9AUk6nC2454NSDGUWvPB72JxSNJrezX) |
| ETH-USD     | [TR2yWYWovJaSM7TfZq7L7sT7ZRugdJJQmL](https://tronscan.org/#/contract/TR2yWYWovJaSM7TfZq7L7sT7ZRugdJJQmL) |
| HTX-TRX     | [TJCCcAqSc1hK5DrJF8v26QW5LQbmXayPhJ](https://tronscan.org/#/contract/TJCCcAqSc1hK5DrJF8v26QW5LQbmXayPhJ) |
| JST-TRX     | [TC19QPF2mjP1ZhXxD8JNKJs4ksxMZkCuNP](https://tronscan.org/#/contract/TC19QPF2mjP1ZhXxD8JNKJs4ksxMZkCuNP) |
| JST-USD     | [TE5rKoDzKmpVAQp1sn7x6V8biivR3d5r47](https://tronscan.org/#/contract/TE5rKoDzKmpVAQp1sn7x6V8biivR3d5r47) |
| KGST-TRX    | [TGt2qPTTCv6PvWRzXj12VVoG9kebzYP7WZ](https://tronscan.org/#/contract/TGt2qPTTCv6PvWRzXj12VVoG9kebzYP7WZ) |
| LTC-TRX     | [TVJPFXKMysYsRWEXJ3JkSnAUPucinUFUB6](https://tronscan.org/#/contract/TVJPFXKMysYsRWEXJ3JkSnAUPucinUFUB6) |
| LTC-USD     | [TGxGL85kN3W5sGdBiobgWabWFcMEtoqRJJ](https://tronscan.org/#/contract/TGxGL85kN3W5sGdBiobgWabWFcMEtoqRJJ) |
| NFT-TRX     | [TKtc1V6QAY1Gpy511QjzXkLUphG8Dre8CY](https://tronscan.org/#/contract/TKtc1V6QAY1Gpy511QjzXkLUphG8Dre8CY) |
| NFT-USD     | [TEC8b2oL6sAQFMiea73tTgjtTLwyV1GuZU](https://tronscan.org/#/contract/TEC8b2oL6sAQFMiea73tTgjtTLwyV1GuZU) |
| STRX-TRX    | [TW9bNueyJZA9iZnNXGYkJuPJJ7KFN3o5qw](https://tronscan.org/#/contract/TW9bNueyJZA9iZnNXGYkJuPJJ7KFN3o5qw) |
| SUN-TRX     | [TLLyqXr5cbYEMjzeThe1esss1SVBbxxubu](https://tronscan.org/#/contract/TLLyqXr5cbYEMjzeThe1esss1SVBbxxubu) |
| SUN-USD     | [TRMgzSPsuWEcVpd5hv19XtLeCk8Z799sZa](https://tronscan.org/#/contract/TRMgzSPsuWEcVpd5hv19XtLeCk8Z799sZa) |
| SUNOLD-TRX  | [TWAob1YsNzh7bfgkjfAD9MAdarcoSWScWw](https://tronscan.org/#/contract/TWAob1YsNzh7bfgkjfAD9MAdarcoSWScWw) |
| SUNOLD-USD  | [TEEuSdqyv2NFREtNoUXMTDSmJVK3KCuLac](https://tronscan.org/#/contract/TEEuSdqyv2NFREtNoUXMTDSmJVK3KCuLac) |
| TRX-USD     | [TR5HtpPK4gX4RFC4DCBUHfFgsGkGFEzSAb](https://tronscan.org/#/contract/TR5HtpPK4gX4RFC4DCBUHfFgsGkGFEzSAb) |
| TUSD-TRX    | [TLXMULb1SRpv841Q54C4DhWkmmGfRA2rUH](https://tronscan.org/#/contract/TLXMULb1SRpv841Q54C4DhWkmmGfRA2rUH) |
| TUSD-USD    | [TBc3yBP8xcyQ1E3hDTUhRxToMrgekLH2kh](https://tronscan.org/#/contract/TBc3yBP8xcyQ1E3hDTUhRxToMrgekLH2kh) |
| U-TRX       | [TJyxgoVxr6a5uaBMaT8TazZMaK9fsSFNw3](https://tronscan.org/#/contract/TJyxgoVxr6a5uaBMaT8TazZMaK9fsSFNw3) |
| U-USD       | [TX6DsYNoMurRqnY9tRHuj4MnBoW76jVKa3](https://tronscan.org/#/contract/TX6DsYNoMurRqnY9tRHuj4MnBoW76jVKa3) |
| USDC-TRX    | [TNTm5ezUGHxYc9Mvst58yYTAjxDmqWWGZc](https://tronscan.org/#/contract/TNTm5ezUGHxYc9Mvst58yYTAjxDmqWWGZc) |
| USDC-USD    | [TNu3zS55MP4KnBBP6Maw1nHSzRpc3CXAxm](https://tronscan.org/#/contract/TNu3zS55MP4KnBBP6Maw1nHSzRpc3CXAxm) |
| USDD-TRX    | [TWW4P2pck8rFcxx3H8NfnH4qhNPu1V35Pb](https://tronscan.org/#/contract/TWW4P2pck8rFcxx3H8NfnH4qhNPu1V35Pb) |
| USDD-USD    | [TJ7jEgoYVaeymVfYZ3bS57dYArwVDS1mhW](https://tronscan.org/#/contract/TJ7jEgoYVaeymVfYZ3bS57dYArwVDS1mhW) |
| USDJ-TRX    | [TCBKyYMP4YQFHxYznuUaResHDTaEWLuJNW](https://tronscan.org/#/contract/TCBKyYMP4YQFHxYznuUaResHDTaEWLuJNW) |
| USDJ-USD    | [TB1MyT7pDCNg8w7cSW1QvYKs4WPzErzP5k](https://tronscan.org/#/contract/TB1MyT7pDCNg8w7cSW1QvYKs4WPzErzP5k) |
| USDT-TRX    | [TUfV7S4RYtdmBvtHzedfFPVsK9nvndtETp](https://tronscan.org/#/contract/TUfV7S4RYtdmBvtHzedfFPVsK9nvndtETp) |
| USDT-USD    | [TKePc46n5CiUCR8LL788TFeKA4kjvNnuem](https://tronscan.org/#/contract/TKePc46n5CiUCR8LL788TFeKA4kjvNnuem) |
| WBTC-USD    | [TCYS6aj9shB6rZNpTCqSkN1aTwkSnz1wHq](https://tronscan.org/#/contract/TCYS6aj9shB6rZNpTCqSkN1aTwkSnz1wHq) |
| WIN-TRX     | [TQvCG1U2jGTVwXLqvFWR27LDtEJZVgRbEg](https://tronscan.org/#/contract/TQvCG1U2jGTVwXLqvFWR27LDtEJZVgRbEg) |
| WIN-USD     | [TSCef3LT3jpLwwXCWhZe3hZoMsYk1ZLif2](https://tronscan.org/#/contract/TSCef3LT3jpLwwXCWhZe3hZoMsYk1ZLif2) |
| WSTUSDT-TRX | [TKcTU5vCPqBBfuULEGXg9kkLx6Tzs2Zo3x](https://tronscan.org/#/contract/TKcTU5vCPqBBfuULEGXg9kkLx6Tzs2Zo3x) |
| USDDOLD-USD | [TJrtqTiWkzsdCSU7Jz4JiBswc3Sv8FCw1i](https://tronscan.org/#/contract/TJrtqTiWkzsdCSU7Jz4JiBswc3Sv8FCw1i) |
| USDDOLD-TRX | [TGJ7FspL9bftnXKrRFah1yU7VxHkgBpzVB](https://tronscan.org/#/contract/TGJ7FspL9bftnXKrRFah1yU7VxHkgBpzVB) |
| USD1-TRX    | [TVRD5vMZDnmBXF3AxBiHVJYeykVFzC8eLB](https://tronscan.org/#/contract/TVRD5vMZDnmBXF3AxBiHVJYeykVFzC8eLB) |

### Nile 測試網

- WIN 代幣合約地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合約地址: `TLDU7C8K3Gd3pXrAj9gtpVVNRHZHuHHZ8P`

價格服務合約地址列表：

| 價格對         | Nile（代理）                           |
|:------------|:-----------------------------------|
| BTC-TRX     | [TFETSL1Yc8dCJM7z6uBkHhAsPbqP5UaCDE](https://nile.tronscan.org/#/contract/TFETSL1Yc8dCJM7z6uBkHhAsPbqP5UaCDE) |
| BTC-USD     | [TAX8Pm3FgN74za72TFZrn5gPBxJTKgnnpE](https://nile.tronscan.org/#/contract/TAX8Pm3FgN74za72TFZrn5gPBxJTKgnnpE) |
| BTT-TRX     | [TKbeHN2hdrgSShG6iF3mDsJTu9fFzNrHjo](https://nile.tronscan.org/#/contract/TKbeHN2hdrgSShG6iF3mDsJTu9fFzNrHjo) |
| BTT-USD     | [TJdzg4wqBt4JkP1ehbYQufg1cLjbomT2j7](https://nile.tronscan.org/#/contract/TJdzg4wqBt4JkP1ehbYQufg1cLjbomT2j7) |
| BTTOLD-TRX  | [TETkTRbnyB4ptWiK9qXgiyFxQQ9d8ZacT6](https://nile.tronscan.org/#/contract/TETkTRbnyB4ptWiK9qXgiyFxQQ9d8ZacT6) |
| BTTOLD-USD  | [TRpRfFzubR7oheDCwHRbwJRfeFa85L6tWE](https://nile.tronscan.org/#/contract/TRpRfFzubR7oheDCwHRbwJRfeFa85L6tWE) |
| ETH-TRX     | [TSVJwLrhWBF7K6BkEG6hStjMxQJXAzBABQ](https://nile.tronscan.org/#/contract/TSVJwLrhWBF7K6BkEG6hStjMxQJXAzBABQ) |
| ETH-USD     | [TQGyY3mWTTzKKBLBg3wQTSbAGqBnGqYSzX](https://nile.tronscan.org/#/contract/TQGyY3mWTTzKKBLBg3wQTSbAGqBnGqYSzX) |
| HTX-TRX     | [TGcVt5g4ExZNVz9gXPWBbnsAN1DPkg3RbG](https://nile.tronscan.org/#/contract/TGcVt5g4ExZNVz9gXPWBbnsAN1DPkg3RbG) |
| JST-TRX     | [TSf6ZwFrDg5Jvyci1PnRHrrZvPpCCKNTjj](https://nile.tronscan.org/#/contract/TSf6ZwFrDg5Jvyci1PnRHrrZvPpCCKNTjj) |
| JST-USD     | [TJ7SizJiCAjMPAri1CFAxzg4xCRLycumMj](https://nile.tronscan.org/#/contract/TJ7SizJiCAjMPAri1CFAxzg4xCRLycumMj) |
| KGST-TRX    | [TY9vDmskSFkahX7LESSe5cF5twZHerKgUd](https://nile.tronscan.org/#/contract/TY9vDmskSFkahX7LESSe5cF5twZHerKgUd) |
| LTC-TRX     | [TWProfbHdGBCf7HVNys5KAbVT4vhUwpu22](https://nile.tronscan.org/#/contract/TWProfbHdGBCf7HVNys5KAbVT4vhUwpu22) |
| LTC-USD     | [TRSFTb2seuQxQqUsyeJ8Wg8XhX1e2g3T19](https://nile.tronscan.org/#/contract/TRSFTb2seuQxQqUsyeJ8Wg8XhX1e2g3T19) |
| NFT-TRX     | [TWP99RnyMVKFjzuu9XT5J21qBZu8DwhCum](https://nile.tronscan.org/#/contract/TWP99RnyMVKFjzuu9XT5J21qBZu8DwhCum) |
| NFT-USD     | [TX5KVe4sp24w5HJ4nfk2ZstRhV8RTFm67W](https://nile.tronscan.org/#/contract/TX5KVe4sp24w5HJ4nfk2ZstRhV8RTFm67W) |
| STRX-TRX    | [TEbUQ4gohuK5wdtKmpnGd2kvyzhhznJDCx](https://nile.tronscan.org/#/contract/TEbUQ4gohuK5wdtKmpnGd2kvyzhhznJDCx) |
| SUN-TRX     | [TTxxeWGpSDV3zPDxnYXzG1ue7RpTYTvDpY](https://nile.tronscan.org/#/contract/TTxxeWGpSDV3zPDxnYXzG1ue7RpTYTvDpY) |
| SUN-USD     | [TJjENuVH7TD8RJdGtj22ac6Bt1ktpBGURR](https://nile.tronscan.org/#/contract/TJjENuVH7TD8RJdGtj22ac6Bt1ktpBGURR) |
| SUNOLD-TRX  | [TNfn4qt4QJ7LAndM2aWbxrGGH8CRGvzxui](https://nile.tronscan.org/#/contract/TNfn4qt4QJ7LAndM2aWbxrGGH8CRGvzxui) |
| SUNOLD-USD  | [TMKzWKMA1gSwjYSL6VpfCUXLuwPKdjEsQ2](https://nile.tronscan.org/#/contract/TMKzWKMA1gSwjYSL6VpfCUXLuwPKdjEsQ2) |
| TRX-USD     | [TCeXRh9vcb78j2Eb2oJk4YwwnoHQDT64T1](https://nile.tronscan.org/#/contract/TCeXRh9vcb78j2Eb2oJk4YwwnoHQDT64T1) |
| TUSD-TRX    | [TM1bvBzHkRrQqvvHGi1CC1Heb8ESWreiNW](https://nile.tronscan.org/#/contract/TM1bvBzHkRrQqvvHGi1CC1Heb8ESWreiNW) |
| TUSD-USD    | [TUuxMFxv6qPn1ymZoYY45SSK1hhEVAvyKz](https://nile.tronscan.org/#/contract/TUuxMFxv6qPn1ymZoYY45SSK1hhEVAvyKz) |
| U-TRX       | [TRGQuwRsH84b2GZ4U2AGfK8GZg36nKJ5dP](https://nile.tronscan.org/#/contract/TRGQuwRsH84b2GZ4U2AGfK8GZg36nKJ5dP) |
| U-USD       | [TBzWFDDQkzE4vxhw4tExSVibPRRRKVoLWX](https://nile.tronscan.org/#/contract/TBzWFDDQkzE4vxhw4tExSVibPRRRKVoLWX) |
| USDC-TRX    | [TWio8JqYx2aey49ua2ohLoyBPbVVWos8RB](https://nile.tronscan.org/#/contract/TWio8JqYx2aey49ua2ohLoyBPbVVWos8RB) |
| USDC-USD    | [TF5a2qhfxtWzUQnAocPoxgKXLe1vEE8oER](https://nile.tronscan.org/#/contract/TF5a2qhfxtWzUQnAocPoxgKXLe1vEE8oER) |
| USDD-TRX    | [TFr7TWdb5RWPNCfecr3HNfnCmNNL8qvgmJ](https://nile.tronscan.org/#/contract/TFr7TWdb5RWPNCfecr3HNfnCmNNL8qvgmJ) |
| USDD-USD    | [TX264fxRmdhNfUgkruk9orzAVvtCehyowq](https://nile.tronscan.org/#/contract/TX264fxRmdhNfUgkruk9orzAVvtCehyowq) |
| USDJ-TRX    | [TDJtnT7JRNqmNaqY1mK9i1xWN4GnX1UfGd](https://nile.tronscan.org/#/contract/TDJtnT7JRNqmNaqY1mK9i1xWN4GnX1UfGd) |
| USDJ-USD    | [TKZUQTYAhH1LTG67QmhX4HxTWZdvLfH9d1](https://nile.tronscan.org/#/contract/TKZUQTYAhH1LTG67QmhX4HxTWZdvLfH9d1) |
| USDT-TRX    | [TVZjuqiJNNuLQAQoPAFfUqvYUxhZYkUX5Z](https://nile.tronscan.org/#/contract/TVZjuqiJNNuLQAQoPAFfUqvYUxhZYkUX5Z) |
| USDT-USD    | [TT2ETLY1Mmx2DKYT9S6fMvKGPqbWH3LDEJ](https://nile.tronscan.org/#/contract/TT2ETLY1Mmx2DKYT9S6fMvKGPqbWH3LDEJ) |
| WBTC-USD    | [TSBoimXw9Mgx7u5A6eC3yfTimn1jfUWAKE](https://nile.tronscan.org/#/contract/TSBoimXw9Mgx7u5A6eC3yfTimn1jfUWAKE) |
| WIN-TRX     | [TP7aHYuXUkKPKsojs9BNJDVyAJeQ2KtfCj](https://nile.tronscan.org/#/contract/TP7aHYuXUkKPKsojs9BNJDVyAJeQ2KtfCj) |
| WIN-USD     | [TYYMqsRNZTwsiFkRtn2NewvXT9GnnsPBH9](https://nile.tronscan.org/#/contract/TYYMqsRNZTwsiFkRtn2NewvXT9GnnsPBH9) |
| WSTUSDT-TRX | [TZGEUihByCHG79Hbpider6pGZfY9S8ct6P](https://nile.tronscan.org/#/contract/TZGEUihByCHG79Hbpider6pGZfY9S8ct6P) |
| USDDOLD-USD | [THoshmYmTfmcNTqYLKAhMYTDNYBhJH3mbt](https://nile.tronscan.org/#/contract/THoshmYmTfmcNTqYLKAhMYTDNYBhJH3mbt) |
| USDDOLD-TRX | [TKxxkv4CkJANRVNay8C2eY9E2zMjmWViE7](https://nile.tronscan.org/#/contract/TKxxkv4CkJANRVNay8C2eY9E2zMjmWViE7) |
| USD1-TRX    | [TNeep6gumLAPU4ZfPkyhjJyyu7akMKKjrT](https://nile.tronscan.org/#/contract/TNeep6gumLAPU4ZfPkyhjJyyu7akMKKjrT) |

### 申請新價格對

如您想在 WINkLink 申請添加新價格對，請填寫並提交此[表格。](https://forms.gle/bSdwYa2mHRjdWCgt6)

## 使用現有的 WINkLink 價格服務

### 獲取最新價格

以下示例演示如何通過 `AggregatorV3Interface` 讀取 WINkLink 餵價：使用 `latestRoundData()` 讀取最新價、按 heartbeat 校驗新鮮度、調用 `decimals()` 處理精度。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
 * @title AggregatorV3Interface (WINkLink Price Feed)
 * @notice Interface for reading WINkLink price feeds.
 */
interface AggregatorV3Interface {
  function decimals() external view returns (uint8);
  function description() external view returns (string memory);
  function getRoundData(uint80 _roundId)
    external view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );
  function latestRoundData()
    external view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );
}

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract PriceConsumer {
  AggregatorV3Interface internal priceFeed;
  uint256 public constant MAX_PRICE_AGE = 1 hours; // Adjust to your business tolerance

  /**
   * Network: TRON Mainnet / Nile Testnet
   * Pass the feed address for the price pair you want to read.
   * Find supported pairs and addresses in the Price Feed Service documentation.
   */
  constructor(address feedAddress) {
    priceFeed = AggregatorV3Interface(feedAddress);
  }

  /// @notice Returns the latest price together with its decimals.
  /// @dev Reverts if the round is incomplete or the price is stale.
  function getLatestPrice() public view returns (int256 answer, uint8 decimals) {
    uint256 updatedAt;
    (
      /* uint80  roundId         */,
      answer,
      /* uint256 startedAt       */,
      updatedAt,
      /* uint80  answeredInRound */
    ) = priceFeed.latestRoundData();

    require(updatedAt > 0, "Round not complete");
    require(block.timestamp - updatedAt <= MAX_PRICE_AGE, "Price too stale");

    decimals = priceFeed.decimals();
  }
}
```

若你只需在鏈下讀取價格（如前端、後端或腳本），無需部署任何合約 —— 用 TronWeb 直接讀取代理：

```javascript
// Off-chain read with TronWeb — no contract deployment required.
// npm install tronweb
const { TronWeb } = require('tronweb');

// Mainnet: https://api.trongrid.io  |  Nile testnet: https://nile.trongrid.io
// For production, use a free TronGrid API key to avoid rate limits:
//   new TronWeb({ fullHost: 'https://api.trongrid.io', headers: { 'TRON-PRO-API-KEY': 'your-key' } })
const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });
// A constant (read-only) call still needs a from-address set; any valid address works:
tronWeb.setAddress('T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb');

// Proxy address of the price pair you want to read (see Supported Price Pairs List).
const FEED_ADDRESS = 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

async function getLatestPrice() {
  const feed = await tronWeb.contract().at(FEED_ADDRESS);
  const data = await feed.latestRoundData().call();
  const decimals = await feed.decimals().call();
  // Normalize the price as answer / 10 ** decimals
  console.log('answer:', data.answer.toString());
  console.log('updatedAt:', data.updatedAt.toString());
  console.log('decimals:', decimals.toString());
}

getLatestPrice();
```

或用 `tronpy`（Python）：

```python
# Off-chain read with tronpy — no contract deployment required.
# pip install tronpy
from tronpy import Tron

# Mainnet: Tron()  |  Nile testnet: Tron(network='nile')
# For production, use a free TronGrid API key to avoid rate limits:
#   from tronpy.providers import HTTPProvider
#   client = Tron(HTTPProvider(api_key='your-key'))
client = Tron()

# Proxy address of the price pair you want to read (see Supported Price Pairs List).
FEED_ADDRESS = 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'

feed = client.get_contract(FEED_ADDRESS)
round_id, answer, started_at, updated_at, answered_in_round = feed.functions.latestRoundData()
decimals = feed.functions.decimals()
# Normalize the price as answer / 10 ** decimals
print('answer:', answer)
print('updatedAt:', updated_at)
print('decimals:', decimals)
```

### 獲取價格歷史

**Round / RoundId** —— 每次價格更新形成一個新的 Round（輪次），由唯一的 `RoundId`（uint80）標識。任意歷史輪次的價格可通過 `getRoundData(roundId)` 查詢。

以下代碼演示如何通過 `getRoundData()` 按 `roundId` 讀取歷史價。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * DO NOT USE THIS CODE IN PRODUCTION.
 *
 * Continued from the AggregatorV3Interface defined above.
 */
contract HistoricalPriceConsumer {
  AggregatorV3Interface internal priceFeed;

  constructor(address feedAddress) {
    priceFeed = AggregatorV3Interface(feedAddress);
  }

  /// @notice Returns the historical price for a specific roundId.
  /// @param  _roundId The round to query (must be a valid completed round).
  function getHistoricalPrice(uint80 _roundId)
    public view
    returns (int256 answer, uint256 updatedAt)
  {
    (
      /* uint80  roundId         */,
      answer,
      /* uint256 startedAt       */,
      updatedAt,
      /* uint80  answeredInRound */
    ) = priceFeed.getRoundData(_roundId);

    require(updatedAt > 0, "Round not complete");
  }
}
```

## 設置餵價合約

### 部署合約

WINkLink 生態采用去中心化架構，所有智能合約開源，任何組織和個人都可以部署自己的 WINkLink 預言機合約， 並對外公布所提供的服務。

用戶可以從各個公開 WINkLink 服務中選擇自己所需的組合，創建自己的聚合數據合約，享受去中心化機制帶來的便利。

項目合約可點此查看：<https://github.com/tron-oracle/winklink-libocr/tree/main/tvm-contracts> - 連接您的 Github 賬戶

您可以使用以下任一工具或程序庫進行合約部署和調用測試：：
- TronScan: [Mainnet](https://tronscan.org/), [Nile Testnet](https://nile.tronscan.org/)
- [Official wallet-cli](https://github.com/tronprotocol/wallet-cli)
- [Tron IDE](https://developers.tron.network/docs/tron-ide)
- [TronBox](https://developers.tron.network/reference/what-is-tronbox)
- [tronweb](https://developers.tron.network/docs/tronweb-1)

### 聚合器合約

聚合器合約部署在波場 TRON 公鏈上，具有以下功能：

- 接受來自 WINkLink 節點的鏈下聚合傳輸
- 計算數據請求的 WIN 代幣費用，準許預言機節點領取獎勵；
- 實現 Owned 接口， 進而對聚合器合約暴露的不同方法提供權限控制。

合約代碼可於 AccessControlledOCRAggregator.sol 查看。

### 為節點添加任務

節點的任務代表其所支持的數據服務，每個任務都有一個 32 字節的唯一 ID。 對終端用戶而言， (預言機地址，任務 ID) 唯一標識了一個 WINkLink 節點提供的數據服務。 每個 WINkLink 節點都可以提供多項數據服務。

WINkLink 節點正常運行後，就可以通過 Operator UI 為節點添加任務：

示例：（將下列參數修改為上述步驟中部署的預言機合約地址）

::: tip
如涉及引導節點，請在配置文件中設置 DefaultBootstrapPeers。
```
Example: DefaultBootstrapPeers = ['/ip4/127.0.0.1/tcp/6788/p2p/12D3KooWMrKGdnH6nBrf7hDz25NXFSFNk7vgsTxj9bHskWEct4xh']
```
::: 

### 引导节点

```json
type               = "offchainreporting"
schemaVersion      = 1
tvmChainID         = 1
name               = "TUSD-TRX"
contractAddress    = "ACCESS-CONTROLLED-OCR-AGGREGATOR-ADDRESS"
p2pBootstrapPeers  = [
  "/ip4/127.0.0.1/tcp/6788/p2p/P2P-PEER-ID",
]
isBootstrapPeer = true
keyBundleID = "NODE-KEY-BUNDLE"
forwardingAllowed = false
maxTaskDuration = "0s"
```
::: tip
確保引導節點和預言機節點被配置為單獨的實體，每個實體鏈接到其唯一的數據庫實例。 在本地進行操作時，通過修改 config.toml 文件為每個實例指定不同的端口號，以便訪問每個實例各自的 Operator UI。

```json
[WebServer]
HTTPPort = 3000
SecureCookies = false # Default
```
:::

### 預言機節點

```json
type               = "offchainreporting"
schemaVersion      = 1
tvmChainID         = 2
name               = "OCR: TUSD-TRX"
contractAddress    = "ACCESS-CONTROLLED-OCR-AGGREGATOR-ADDRESS"
p2pBootstrapPeers  = [
"/ip4/127.0.0.1/tcp/6788/p2p/P2P-PEER-ID",
]
isBootstrapPeer    = false
keyBundleID        = "NODE-KEY-BUNDLE"
transmitterAddress = "THE-CURRENT-NODE-EIP55-ADDRESS"
observationTimeout = "10s"
blockchainTimeout  = "20s"
contractConfigTrackerSubscribeInterval = "2m"
contractConfigTrackerPollInterval = "1m"
contractConfigConfirmations = 3
observationSource   = """
ds_http           [type="http" method=GET url="https://www.okx.com/api/v5/market/index-tickers?instId=TUSD-USD"]
    ds_parse          [type="jsonparse" path="data,0,idxPx"]
ds_converttrx     [type="converttrx" url="https://www.okx.com/api/v5/market/index-tickers?instId=TRX-USD" path="data.0.idxPx"]
ds_multiply       [type="multiply" times=1000000]

    ds_http -> ds_parse -> ds_converttrx -> ds_multiply
"""
```

### 查詢任務

開發者可以在 Operator UI 的任務選項卡下檢索任務。

子選項卡如下：

- 概覽：最近的運行任務和任務流列表
- 定義：任務規範
- 錯誤：自任務創建以來累計遇到的不同錯誤
- 運行：所有任務運行的列表


![job-page-ui.png](~@source/images/job-page-ui.png)
