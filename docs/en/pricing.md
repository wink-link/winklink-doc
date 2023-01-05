# WINkLink Price Service

## Overview

It is required that smart contracts frequently echo the token prices in the real world. For DeFi in particular, asset prices must be highly aligned with real-world prices, otherwise users and developers may suffer losses caused by arbitrage or attacks on the contract.

WINkLink's price service focuses on digital currency pairs, providing DApps with accurate and stable price information of real-world digital currencies.

The solution provided by WINkLink aggregates price data of multiple WINkLink oracle nodes that leads to a stable price service, which is called the Price Feed Contract.

We are going to explore how to use and deploy the WINkLink price service contract in the following sections.

## Acquire Latest Prices

Acquiring the latest price data in the consumer contract requires `AggregatorInterface`. It defines the interface that the Price Feed Contract provides to the public.

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

### Price History

Price history can be acquired from the `AggregatorInterface` interface function list via `getAnswer(uint256 roundId)`.The corresponding timestamp can be acquired via `getTimestamp(uint256 roundId)`.

## Price Feed Contract

### Mainnet

| Pair     | Price Feed Contract Address          |
| -------- | ------------------------------------ |
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
| LTC-USD  | `TFhAq2W3fEse2rj8cLmQ29k4zP3X5CFc7z` |
| LTC-TRX  | `TA2DUPP9Nufru5QoRQSpVzVrTpmMRyLSU9` |

### Nile Testnet

- Contract List[View Page](http://47.252.73.5:3300/#/solutions)
- WIN    Token Contract Address: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid Contract Address: `TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb`

List of price service contract addresses:

<!-- NOTE: multiline table, auto-formated -->

| Pair      | Price Feed Contract Address          |
|-----------| ------------------------------------ |
| TRX-USD   | `TZEy2S7pTc69awGEPrRdARZ8FrjBUpbuRy` |
| USDT-USD  | `TP3dn7bgNT6eygNhF33XZYfcXiswsNyTnb` |
| ETH-USD   | `TYvj7PaHUrPLC1vhjgL9PGvJ5FyA931KqM` |
| LTC-USD   | `TY4mKLTkC2eNF26Ax58VZG3nBg3vzYeKfJ` |
| LTC-TRX   | `TWmu8NugztyGXuYh2qxEAGmkESmJGbXNp1` |
| BUSD-USD | `TWn3oCuk4un2h2uZmkDQjYynm1u4iQHzQz` |
| BUSD-TRX | `TWVmGA1vtcWiigAZcxDJBCSrCjaj828MKa` |

### Apply for New Trading Pairs

If you need WINkLink to provide a new trading pair officially,
please fill in and submit the [this form](https://forms.gle/bSdwYa2mHRjdWCgt6).

## Deply the Price Service

Developers can deploy their own price services and customize price sources and the minimum number of response oracles.

In real production, price feed requires multiple oracle nodes, which will be aggregated into a final price. But for the test, we only set up one node for price feed to streamline the test.

### Deploy the Price Feed Contract

Launched by WINkLink, the `TronUser` contract is a contract template for aggregated price service. The contract applies the `AggregatorInterface` which developers can use directly.

The contract code is located at [TronUser.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/TronUser.sol).

In deploying the TronUser contract, the WIN token address and WinkMid contract address are required in the constructor. For example, on Nile TestNet,
`(TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2, TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb)` is required.

### Add an Oracle Node and a job ID

After the TronUser contract is deployed, the contract owner should set up an oracle service list of the aggregated requests for the contract with the following interface:

```js
function updateRequestDetails(uint128 _paymentAmount, uint128 _minimumResponses, address[] _oracles, bytes32[] _jobIds)
```

`_paymentAmount` refers to the amount of tokens paid for updating the call each time.

`_oracles` and `_jobIds` are a pair of lists with equal length. Each set represents a unique job ID of a WINkLink oracle.

`_minimumResponses` refers to the minimum number of response oracles. It must be greater than or equal to the length of `_oracles`. For example, you can set it to 5/10 so that only when at least 5/10 oracles have responded will the upgraded value become valid.

Call example:

```js
updateRequestDetails(
  10,
  1,
  ["TR9jYcLWAcQfbKcP5oau1ccSbeW7mdnqg8"],
  ["db22ccf4b4a14d0cae2a0757632e425d"]
);
```

### Transfer WIN Tokens to the Contract

TronUser contract needs `transferAndCall` to call the Oracle contract, so there should be enough WIN tokens in the contract account. You can transfer a certain amount of WIN tokens for the contract through the transfer service or the TestNet Faucet.

### Call the Price Feed Contract

#### Update Prices with requestRateUpdate

Use the following interface to request WINkLink oracle nodes to acquire the latest price information from external data sources:

```js
function requestRateUpdate() returns (bytes32)
```

The interface returns a `requestID`, which can also be used to cancel this price update request.

#### Acquire Latest Prices with latestAnswer

Acquire latest prices by calling `latestAnswer()` in `AggregatorInterface`.

You can call it to on the TronScan's contract information page.
