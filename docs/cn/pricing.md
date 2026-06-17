# WINkLink 价格服务

> 集成前请参考 [开发者使用须知](#开发者使用须知)。

## 概览

### WINkLink 价格服务介绍

为确保智能合约能反映真实世界的代币价格，需经常对合约的价格信息进行更新。 其中，DeFi 资产的价格尤其需要和现实世界资产紧密挂钩， 否则可能导致套利或合约攻击，给用户和开发者造成损失。

WINkLink 价格服务专注于数字货币价格对，为去中心化应用（DApp）提供准确稳定的外部世界数字货币价格信息。 WINkLink 打造了聚合多个预言机节点价格数据的解决方案，从而提供稳定的价格服务，称作喂价合约（Price Feed Contract）。

上述合约称为**聚合器（Aggregator）** —— 持有 WINkLink 预言机节点聚合价格数据的链上合约。每个价格喂价（如 BTC/USD）由一个聚合器合约实现，消费合约通过它读取价格。

## 支持的价格对列表及配置

### 主网

| 价格对         | 合约地址（代理）                           |
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

### Nile 测试网

- WIN 代币合约地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合约地址: `TLDU7C8K3Gd3pXrAj9gtpVVNRHZHuHHZ8P`

价格服务合约地址列表:

| 价格对         | Nile (代理)                          |
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

### 申请新价格对

如您想在 WINkLink 申请添加新价格对，请填写并提交此[表格。](https://forms.gle/bSdwYa2mHRjdWCgt6)

## 使用现有的 WINkLink 价格服务

### 获取最新价格

以下示例演示如何通过 `AggregatorV3Interface` 读取 WINkLink 喂价：使用 `latestRoundData()` 读取最新价、按 heartbeat 校验新鲜度、调用 `decimals()` 处理精度。

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

若你只需在链下读取价格（如前端、后端或脚本），无需部署任何合约 —— 用 TronWeb 直接读取代理：

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

### 获取价格历史

**Round / RoundId** —— 每次价格更新形成一个新的 Round（轮次），由唯一的 `RoundId`（uint80）标识。任意历史轮次的价格可通过 `getRoundData(roundId)` 查询。

以下代码演示如何通过 `getRoundData()` 按 `roundId` 读取历史价。

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

## API 参考

集成 WINkLink 价格喂价时，通过 `AggregatorV3Interface` 接口 + 代理（proxy）合约地址读取喂价。如需获取代理背后的聚合器信息，可调用 `AccessControlledOffchainAggregator` 合约中的变量与函数。

代理对外提供一个稳定地址，其底层聚合器可无缝升级而不影响你的集成。

### AggregatorV3Interface

在你的合约中导入本接口并指向代理地址使用（在上文「支持的价格对列表」中查询可用价格对与代理地址）。示例：

```solidity
/**
 * Network: TRON Mainnet / Nile Testnet
 * Pass the proxy address of the price pair you want to read.
 */
constructor(address feedAddress) {
  priceFeed = AggregatorV3Interface(feedAddress);
}
```

使用示例见上文「获取最新价格」段。


| 方法名 | 说明 |
| --- | --- |
| decimals | 响应值的小数位数 |
| description | 代理指向的聚合器描述 |
| getRoundData | 获取指定轮次的数据 |
| latestRoundData | 获取最新轮次的数据 |
| version | 代理指向的聚合器版本号 |

**decimals**

获取响应值的小数位数。

```solidity
function decimals() external view returns (uint8);
```

- 返回：小数位数

**description**

获取代理指向的底层聚合器的描述。

```solidity
function description() external view returns (string memory);
```

- 返回：底层聚合器的描述文本

**getRoundData**

按 `roundId` 获取指定轮次的数据。

```solidity
function getRoundData(
  uint80 _roundId
) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
```

**参数：**

- `_roundId`：轮次 ID

**返回：**

- `roundId`：轮次 ID
- `answer`：本轮聚合后的价格
- `startedAt`：本轮起始时间戳
- `updatedAt`：本轮完成时间戳
- `answeredInRound`：已弃用 —— 此前用于答案需跨多轮计算的场景；在 WINkLink 喂价上恒等于 `roundId`

**latestRoundData**

获取最新轮次的数据。

```solidity
function latestRoundData()
  external
  view
  returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
```

**返回：**

- `roundId`：轮次 ID
- `answer`：本喂价为所配置价格对提供的聚合价格
- `startedAt`：本轮起始时间戳
- `updatedAt`：本轮完成时间戳；请结合该喂价的 heartbeat 校验新鲜度
- `answeredInRound`：已弃用 —— 此前用于答案需跨多轮计算的场景；在 WINkLink 喂价上恒等于 `roundId`

> WINkLink OCR 喂价说明：每次上报都会把 `startedAt` 与 `updatedAt` 写为该次上报的区块时间戳，两者相同。代理会把 phase 编码进 `roundId` 高位（`phaseId << 64 | aggregatorRoundId`），因此 roundId 并非从 `1` 连续递增，且在底层聚合器升级时会跳号。调用 `getRoundData()` 时请传入带 phase 的 `roundId`（例如 `latestRoundData()` 返回的那个）。

**version**

代理指向的聚合器版本号。

```solidity
function version() external view returns (uint256);
```

- 返回：版本号。WINkLink 价格喂价当前返回 `4`。

### AccessControlledOffchainAggregator

这是聚合器（aggregator）合约本身。**最佳实践是通过** **AggregatorV3Interface** **代理调用**，避免聚合器升级时影响你的应用。仅在需要代理未暴露的方法时才直接调用聚合器合约。

聚合器合约提供了若干对应用可能有用的变量与函数。各喂价的聚合器结构相似，但部分聚合器的变量有所不同。可调用聚合器的 `typeAndVersion()` 函数确认其类型与版本。

集成时请实地查看合约源码与配置，了解具体喂价的运作方式。参考合约：[TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu](https://tronscan.org/#/contract/TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu/code)（TronScan）。


本合约导入了 `OffchainAggregator` 与 `SimpleReadAccessController`（二者又各自有导入项）。下面的变量与函数列表包含这些被导入合约中可公开访问的项。

读取这些变量或函数的简便方式：从区块浏览器（TronScan）获取 ABI，并将 ABI 指向聚合器地址。

**变量：**

| 名称 | 说明 |
| --- | --- |
| checkEnabled | 布尔值，是否仅允许内部白名单地址访问 |
| maxAnswer | 聚合器允许上报的价格上限；中位数高于此值的上报会被合约拒绝 |
| minAnswer | 聚合器允许上报的价格下限；中位数低于此值的上报会被合约拒绝 |
| owner | 聚合器合约的拥有者地址，决定哪些地址可执行特定函数 |

**函数：**

| 名称 | 说明 |
| --- | --- |
| billingAccessController | billingAccessController 地址，限制聚合器 billing 配置的访问权限 |
| decimals | 返回价格的精度位数（定点格式） |
| description | 返回本喂价的描述（因价格对而异） |
| getAnswer | 已弃用 —— 不要使用 |
| getBilling | 获取当前 billing 配置 |
| getRoundData | 获取指定轮次的完整信息（价格 + 时间戳） |
| getTimestamp | 已弃用 —— 不要使用 |
| getWinToken | 获取支付预言机所用 WIN 代币合约的地址 |
| hasAccess | 检查地址是否有内部访问权限 |
| latestAnswer | 返回最新价格（无时间戳，无法校验新鲜度） |
| latestConfigDetails | 返回当前 OCR 协议配置信息 |
| latestRound | 已弃用 —— 不要使用 |
| latestRoundData | 获取最新轮次的完整信息 |
| latestTimestamp | 已弃用 —— 不要使用 |
| latestTransmissionDetails | 获取最新价格的详细信息 |
| oracleObservationCount | 返回某预言机待结算的 observation 数量 |
| owedPayment | 返回某预言机因其 observation 应得的 WIN 数量 |
| requesterAccessController | 返回 requester 访问控制合约地址 |
| transmitters | 可向本聚合器上报价格的预言机地址列表 |
| typeAndVersion | 返回聚合器类型与版本；此版本指聚合器类型版本，与合约 `version` 不同 |
| validatorConfig | 返回 validator 合约地址及其 gas 上限 |
| version | 返回合约版本号，与聚合器的 `typeAndVersion` 不同 |
| winAvailableForPayment | 返回本合约当前可用于支付预言机的 WIN 余额；若存在未结清的支付义务，该值可能为负 |

**billingAccessController**

billingAccessController 地址，限制聚合器 billing 配置的访问权限。

```solidity
function billingAccessController() external view returns (AccessControllerInterface) {
  return s_billingAccessController;
}
```

**decimals**

返回价格的精度位数。价格以定点格式存储。

```solidity
function decimals() external view returns (uint8 decimalPlaces);
```

**description**

返回本喂价的描述，价格喂价通常为资产对名称。

```solidity
function description() public view override checkAccess() returns (string memory) {
  return super.description();
}
```

**getAnswer**

> **已弃用** —— 不要使用此函数，请改用 `getRoundData()`。

**getBilling**

获取当前 billing 配置。在 TRON 上，前三个字段（`maximumGasPrice`、`reasonableGasPrice`、`microWinPerTrx`）未启用，恒为 `0`。

```solidity
function getBilling()
  external
  view
  returns (
    uint32 maximumGasPrice,
    uint32 reasonableGasPrice,
    uint32 microWinPerTrx,
    uint32 winPerObservation,
    uint32 winPerTransmission
  )
{
  Billing memory billing = s_billing;
  return (
    billing.maximumGasPrice,
    billing.reasonableGasPrice,
    billing.microWinPerTrx,
    billing.winPerObservation,
    billing.winPerTransmission
  );
}
```

**getRoundData**

获取指定轮次的完整信息（价格 + 时间戳）。用于读取某一轮次的完整历史数据。

```solidity
function getRoundData(uint80 _roundId)
  public
  view
  override
  checkAccess()
  returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
{
  return super.getRoundData(_roundId);
}
```

**getTimestamp**

> **已弃用** —— 不要使用此函数，请改用 `getRoundData()`。

**getWinToken**

获取支付预言机所用 WIN 代币合约的地址。

```solidity
function getWinToken() external view returns (WinTokenInterface winToken) {
  return s_winToken;
}
```

**hasAccess**

检查地址是否有内部访问权限。

```solidity
function hasAccess(address _user, bytes memory _calldata) public view virtual override returns (bool) {
  return super.hasAccess(_user, _calldata) || _user == tx.origin;
}
```

**latestAnswer**

返回本喂价的最新价格。**不含时间戳，无法校验新鲜度**；若尚无写入则返回 `0`。`latestRoundData` 同时返回最新价格与时间戳，可用于校验新鲜度。

**latestConfigDetails**

返回当前 OCR 协议配置信息。

```solidity
function latestConfigDetails() external view returns (uint32 configCount, uint32 blockNumber, bytes16 configDigest) {
  return (s_configCount, s_latestConfigBlockNumber, s_hotVars.latestConfigDigest);
}
```

**latestRound**

> **已弃用** —— 不要使用此函数，请改用 `latestRoundData()`。

**latestRoundData**

获取最新轮次的完整信息（价格 + 时间戳）。

```solidity
function latestRoundData()
  public
  view
  override
  checkAccess()
  returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
{
  return super.latestRoundData();
}
```

**latestTimestamp**

> **已弃用** —— 不要使用此函数，请改用 `latestRoundData()`。

**latestTransmissionDetails**

获取最新价格的详细信息。仅外部账户（EOA）可调用。

```solidity
function latestTransmissionDetails()
  external
  view
  returns (bytes16 configDigest, uint32 epoch, uint8 round, int256 latestAnswer, uint64 latestTimestamp)
{
  require(msg.sender == tx.origin, "Only callable by EOA");
  return (
    s_hotVars.latestConfigDigest,
    uint32(s_hotVars.latestEpochAndRound >> 8),
    uint8(s_hotVars.latestEpochAndRound),
    s_transmissions[s_hotVars.latestAggregatorRoundId].answer,
    s_transmissions[s_hotVars.latestAggregatorRoundId].timestamp
  );
}
```

**oracleObservationCount**

返回某预言机待结算的 observation 数量。

```solidity
function oracleObservationCount(address _signerOrTransmitter) external view returns (uint16) {
  Oracle memory oracle = s_oracles[_signerOrTransmitter];
  if (oracle.role == Role.Unset) {
    return 0;
  }
  return s_oracleObservationsCounts[oracle.index] - 1;
}
```

**owedPayment**

返回某预言机因其 observation 应得的 WIN 数量。

```solidity
function owedPayment(address _transmitter) public view returns (uint256) {
  Oracle memory oracle = s_oracles[_transmitter];
  if (oracle.role == Role.Unset) {
    return 0;
  }
  Billing memory billing = s_billing;
  uint256 winAmount = uint256(s_oracleObservationsCounts[oracle.index] - 1) * uint256(billing.winPerObservation);
  winAmount += s_gasReimbursementsWin[oracle.index] - 1;
  return winAmount;
}
```

**requesterAccessController**

返回 requester 访问控制合约地址。

```solidity
function requesterAccessController() external view returns (AccessControllerInterface) {
  return s_requesterAccessController;
}
```

**transmitters**

可向本聚合器上报价格的预言机地址列表。

```solidity
function transmitters() external view returns (address[] memory) {
  return s_transmitters;
}
```

**typeAndVersion**

返回聚合器类型与版本。此版本指聚合器类型版本，与合约 `version` 不同。

```solidity
function typeAndVersion() external pure virtual override returns (string memory) {
  return "AccessControlledOffchainAggregator 4.0.0";
}
```

**validatorConfig**

返回 validator 合约地址及其 gas 上限。

```solidity
function validatorConfig() external view returns (AggregatorValidatorInterface validator, uint32 gasLimit) {
  ValidatorConfig memory vc = s_validatorConfig;
  return (vc.validator, vc.gasLimit);
}
```

**version**

返回合约版本号。与聚合器的 `typeAndVersion` 不同。

```solidity
function version() external view returns (uint256);
```

**winAvailableForPayment**

返回本合约当前可用于支付预言机的 WIN 余额。若存在未结清的支付义务，该值可能为负。

```solidity
function winAvailableForPayment() external view returns (int256 availableBalance) {
  int256 balance = int256(s_winToken.balanceOf(address(this)));
  int256 due = int256(totalWINDue());
  return int256(balance) - int256(due);
}
```

## 开发者使用须知

WINkLink 价格喂价通过 7 个独立预言机节点的去中心化网络为智能合约提供链下价格数据。喂价数据在 DApp 中的表现，取决于**外部市场情况**和**应用集成代码**两方面的因素。在集成 WINkLink 价格喂价时，请关注以下两类要点：**市场完整性**和**应用代码**。

### 市场完整性

WINkLink 价格喂价反映真实市场情况，受外部市场环境的影响。集成方在使用喂价数据时，应理解所反映资产的市场特性，并在业务逻辑中考虑极端情况。

外部市场环境对喂价的影响包括：

- 所反映资产的市场结构（交易所分布、深度、流动性等）会影响价格稳定性
- 流动性较低的资产，对外部市场环境变化更敏感
- 在极端市场情况（剧烈波动、流动性骤降、市场异常）下，喂价的更新行为可能出现非预期变化

集成时建议结合自身业务场景考虑极端情况下的处理逻辑，并在上线后持续观察喂价行为。

### 应用代码

应用代码的质量、可靠性以及对外部依赖的处理，直接影响 DApp 使用价格数据的稳健性。

**校验价格新鲜度**

每个 WINkLink 价格喂价都有一个心跳周期（heartbeat），表示在该周期内链上价格必有更新。建议在使用价格前主动校验时间戳：

```solidity
(uint80 roundId, int256 answer, , uint256 updatedAt, ) = priceFeed.latestRoundData();
require(updatedAt > 0, "Round not complete");
require(block.timestamp - updatedAt <= MAX_PRICE_AGE, "Price too stale");
```

`MAX_PRICE_AGE` 应大于该价格对的 heartbeat 周期，具体取值按业务容忍度选择。

**理解精度**

WINkLink 价格喂价的精度（小数位数）可能因价格对而异。在做任何价格计算前，调用 `decimals()` 获取精度：

```solidity
uint8 dec = priceFeed.decimals();
// 在计算中使用 dec 进行归一化
```

不要假设精度为固定值。

**保持合约可升级**

避免将喂价合约地址硬编码到不可变更的业务逻辑中。建议将其存储为可由合约所有者或治理机制更新的变量，以便在 WINkLink 升级或弃用底层聚合器时，能够平滑迁移到新的喂价合约。

**先在 Nile 测试网测试**

在把**你的消费合约**部署到主网前，请先在 Nile 测试网、指向 WINkLink 的 Nile 喂价地址完成完整集成测试：

- Nile 测试网喂价合约地址：见 [Nile 测试网](#nile-测试网)
- 测试网 TRX（用于部署和调用你自己的合约）获取：[Nile 测试网水龙头](https://nileex.io/join/getJoinPage)

**关注 WINkLink 信息变化**

WINkLink 通过两个渠道发布价格喂价相关的更新，建议集成方持续关注与自身业务相关的内容：

- [**官方公告渠道**](https://winklink.org/#/supportCentre?lang=en-US)：发布价格对停用/弃用通知、新增价格对上线等**事项**
- [**WINkLink 价格喂价详情页**](https://winklink.org/#/solutions?lang=en-US)：展示每个价格对的**实时配置参数**（如 heartbeat、deviation threshold），参数调整时此处会同步反映

建议在集成前记录所用价格对的配置参数基线，便于上线后定期对比，及时发现参数变更。

**上线后持续监控**

集成完成上线后，建议持续监控以下信号：

- 喂价合约 `latestRoundData()` 返回是否按心跳周期定期更新
- 业务合约中 stale check 或相关校验是否被触发
- 上述异常事件的频率与时间分布

可结合 TRON 区块浏览器的事件订阅或自建链下监控脚本实现。

## 设置喂价合约

### 部署合约

WINkLink 生态采用去中心化架构，所有智能合约开源，任何组织和个人都可以部署自己的 WINkLink 预言机合约， 并对外公布所提供的服务。

用户可以从各个公开 WINkLink 服务中选择自己所需的组合，创建自己的聚合数据合约，享受去中心化机制带来的便利。

项目合约可点此查看：<https://github.com/tron-oracle/winklink-libocr/tree/main/tvm-contracts> - 连接您的 Github 账户

您可以使用以下任一工具或程序库进行合约部署和调用测试：
- TronScan: [Mainnet](https://tronscan.org/), [Nile Testnet](https://nile.tronscan.org/)
- [Official wallet-cli](https://github.com/tronprotocol/wallet-cli)
- [Tron IDE](https://developers.tron.network/docs/tron-ide)
- [TronBox](https://developers.tron.network/reference/what-is-tronbox)
- [tronweb](https://developers.tron.network/docs/tronweb-1)

### 聚合器合约

聚合器合约部署在波场 TRON 公链上，具有以下功能：

- 接受来自 WINkLink 节点的链下聚合传输；
- 计算数据请求的 WIN 代币费用，准许预言机节点领取奖励；
- 实现 Owned 接口， 进而对聚合器合约暴露的不同方法提供权限控制。

合约代码可于 AccessControlledOCRAggregator.sol 查看。

### 为节点添加任务

节点的任务代表其所支持的数据服务，每个任务都有一个 32 字节的唯一 ID。 对终端用户而言， (预言机地址，任务 ID) 唯一标识了一个 WINkLink 节点提供的数据服务。 每个 WINkLink 节点都可以提供多项数据服务。

WINkLink 节点正常运行后，就可以通过 Operator UI 为节点添加任务：

示例：（将下列参数修改为上述步骤中部署的预言机合约地址）

::: tip
如涉及引导节点，请在配置文件中设置 DefaultBootstrapPeers。
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
确保引导节点和预言机节点被配置为单独的实体，每个实体链接到其唯一的数据库实例。 在本地进行操作时，通过修改 config.toml 文件为每个实例指定不同的端口号，以便访问每个实例各自的 Operator UI。

```json
[WebServer]
HTTPPort = 3000
SecureCookies = false # Default
```
:::

### 预言机节点

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

### 查询任务

开发者可以在 Operator UI 的任务选项卡下检索任务。

子选项卡如下：

- 概览：最近的运行任务和任务流列表
- 定义：任务规范
- 错误：自任务创建以来累计遇到的不同错误
- 运行：所有任务运行的列表


![job-page-ui.png](~@source/images/job-page-ui.png)
