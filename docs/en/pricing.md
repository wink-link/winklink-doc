# WINkLink Price Service

## Overview

To ensure that smart contracts reflect token prices in real-world time, it is necessary to frequently update them. In particular, the prices of assets in DeFi must closely match those of the real world. Otherwise, arbitrage or contract attacks may cause losses for users and developers.

WINkLink's price service focuses on digital currency pairs, providing decentralized applications (DApps) with accurate and stable price information on real-world digital currencies. The solution offered by WINkLink aggregates price data from multiple oracle nodes, resulting in a stable price service known as the Price Feed Contract.

This article explains how you may utilise the WINkLink price service contract.

## Acquire Latest Prices

Acquiring the latest price data in the consumer contract requires `AggregatorInterface`. 

This interface defines the functions provided by the Price Feed Contract to the public. The code below demonstrates an example of using the AggregatorInterface to acquire the latest price:

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

The `AggregatorInterface` interface provides the `getAnswer(uint256 roundId)` function to obtain the price history. The corresponding timestamp can be acquired via `getTimestamp(uint256 roundId)`.

## Price Feed Contract

### Mainnet

> :warning: Please do note that effective from 01 July onwards, the price feed mainnet contract address will be switched over from Flux Aggregator to Off Chain Reporting as indicated in the following table.

| Pair       | Price Feed Contract Address          | Price Feed Contract Address (Off Chain Reporting) |
|------------|--------------------------------------|---------------------------------------------------|
| TRX-USD    | `TXwZqjjw4HtphG4tAm5i1j1fGHuXmYKeeP` | TL8uHo6y289Us6eWnNGeBEJowvUTuWFczC                |
| JST-USD    | `TPMkqBh7kU16Zmv9EAtm6vfWYrTax4Aucb` | TVpgekkACDNXcn3iHUBWTDXoVJnPJsL5Yn                |
| SUNOLD-USD | `TYzFE7fC46yjs3p5JUidvxzg9XMFT7qWZy` | TSas5zYik8Pt7XNqyYpaLzwDxyW76cuTtx                |
| BTC-USD    | `TTzPaLxJMy8nwXe9NRfHopHW4KyUeavLdF` | TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu                |
| WIN-USD    | `TQU2nPFvemv6hbtmJ48Z749a7VcAmacV4D` | TRKgP4QEf56K4rpPisWVbgCURrv6GT5cqp                |
| USDJ-USD   | `TBxnH94m2Zsp869QpiAoCHt54wCsFSUsSP` | TV1i3T6d2wSY2j292nGBS7LGf6RbZ1GSbR                |
| JST-TRX    | `TXMSfKwBfvY6THwnTzRRteYHdB125rKBKK` | TQqt6DE5zXYGhMwjuox51PEDJjx2qRyZ2V                |
| WIN-TRX    | `TFtL1Kdb2n5yrVTxa6qYgwnNEAAGnKiuDT` | TPqoZD9poPLAe9adrMGWYF1FTcGzKtQ62H                |
| LIVE-USD   | `TFFVcMViFUn3UEXVMPeuWjb4xo6TwUacog` | TFdrzVi58EUC4SiVP9PsBAGD6kqYhnc6jX                |
| USDT-USD   | `TYWY6L4mECH2Gtiq3sg4zY4fvD1XZpwGrb` | TTX7YL4NxknJfbMx5PhcZzc7uFj2LBTsES                |
| SUNOLD-TRX | `TGoKRdiC9TrEoVZcKNFRa7oDEdC4S6Ra9r` | TJWUVrffrCgaUagnpyeEWEMXgr7C6oQrQU                |
| BTC-TRX    | `TPdsKCrr3SJ2HMvt9tTVy3CjhN1CuvEUqc` | TC2Y7a2y31zh2ps8i4uYAuxXiEXag2QhE1                |
| BTT-TRX    |                                      | TYoB3RQAGeSDvf12W62CkdyP6FUnLCF67c                |
| USDJ-TRX   | `TRTpP7TN186YAncgn5Yfjnw4Kds56BneAc` | TERbLaKKsccAEmzu7fXeAfRZFWy4Wpt9oc                |
| USDT-TRX   | `TRf25FSQQzHQ7j1Td7dtYUBPb8R5yVCx2L` | TQYBsKkLUuMUzF6fuUbgYnh7LN7GjH1E5b                |
| BTTOLD-USD | `TM2CEasFpeREBtLWgkzMqASkn5mvtf12He` | TGLkgXfo6wsghJMHofVhe1X2mBhCqP7aUc                |
| BTTOLD-TRX | `TEDsjLSWQjERk4baV2NjPUDAzfxxACBgQE` | TLyJU9M92N5PVBbPwaG6ztuD7as6JJ5MSi                |
| ETH-TRX    | `TBnthNeA1wjNDquD6kXYY2zTRLFyg5eMmj` | TWFDXQe8XdJKGa7ygmS7A1F4gZA1Zz1rzY                |
| TUSD-USD   | `TXyKzmu2J2eXcVspbLnnzuQmU2krLxb8dG` | TH6ebTijzy9vrjj6A6cM89QauXYEA3Fd96                |
| TUSD-TRX   | `TDtUKwNXhFp7HrKcAGR5jYEJBEURod8s2f` | TFEvAdi5FCk1HtC3g6TGJP43QQudUf5uVi                |
| NFT-USD    | `TS15kJyth5F7vAE5bpzAUumEGFDsnYkEGF` | TGosrYP5feJ18mtB1afh5cz6GMXafUKtyR                |
| NFT-TRX    | `TXSf7X1Dw7CGmykSQeNBDgKhCPw8Ehvggq` | TLNk9fuxtvy7YdkZHavpDFv9iLMmqCL2Dw                |
| SUN-USD    | `TAKUV2gwwmAG7fCtwSW9VwSrGnPikuuw5p` | TWbptpQjkDjAfBhoUD84BvRHnALHPGiRgk                |
| SUN-TRX    | `TPVW4azkkthtLdYGLUPdQGLvU9Tciuhq5a` | TJtMzMVZV1uZkkhu3nkjcEF27HiAUsSLdU                |
| USDC-USD   | `THL5y573nNXkHbHY8ZkZNLPZTMXdkq9aFr` | TYRAdCShPaTadcEUDzWTTmcAXL5TbBKJQx                |
| USDC-TRX   | `TSLmB88ek8npjBKeQRzdYZJMpabwfvj2PT` | TGDyBY4FaZjdQtcMCLa3rGfrETDDPe5V7P                |
 | USDD-TRX   |                                      | TUWPcsRhh5g5P2satCdCCwsVdWvbqdMews                |
| ETH-USD    | `TZCPyp7fWW3xnQ6gv5LG9v7S7VYbr4h2H1` | TEDSqFMsZPXDR45TSRCExWwTLYgVf3XqP4                |
| LTC-USD    | `TFhAq2W3fEse2rj8cLmQ29k4zP3X5CFc7z` | TCVW2G6ank9F8JfbtanZtGdDo3U6PQDCtV                |
| LTC-TRX    | `TA2DUPP9Nufru5QoRQSpVzVrTpmMRyLSU9` | TGMqrC3qLup42NZ7q5YUTn7gf4eN7tMhiS                |
| BUSD-USD   | `TWQjWbMjkiMGcR5pbkdRcUgcXmyspxqSkD` | TCbjeNG6hRwjvuiHfrtDtV7wDBQdeKpJLo                |
| BUSD-TRX   | `TQBSnLu654t21xf5R3nNrvNs8q422RmZyo` | TR9cBfG1UuH7S9gWp9YgxHvnAL5UyaS4eo                |

### Nile Testnet

- WIN Token Contract Address: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid Contract Address: `TLDU7C8K3Gd3pXrAj9gtpVVNRHZHuHHZ8P`

List of price service contract addresses:
> :warning: Please do note that effective from 01 July onwards, the price feed Nile Testnet contract address will be switched over from Flux Aggregator to Off Chain Reporting as indicated in the following table.

<!-- NOTE: multiline table, auto-formated -->

| Pair      | Price Feed Contract Address                        |
|-----------|----------------------------------------------------|
| TRX-USD   | `TZEy2S7pTc69awGEPrRdARZ8FrjBUpbuRy`               |
| USDT-USD  | `TP3dn7bgNT6eygNhF33XZYfcXiswsNyTnb`               |
| ETH-USD   | `TYvj7PaHUrPLC1vhjgL9PGvJ5FyA931KqM`               |
| LTC-USD   | `TY4mKLTkC2eNF26Ax58VZG3nBg3vzYeKfJ`               |
| LTC-TRX   | `TWmu8NugztyGXuYh2qxEAGmkESmJGbXNp1`               |
| BUSD-USD | `TWn3oCuk4un2h2uZmkDQjYynm1u4iQHzQz`               |
| BUSD-TRX | `TWVmGA1vtcWiigAZcxDJBCSrCjaj828MKa`               |
                                                 

| Pair       | Price Feed Contract Address (Off Chain Reporting) |
|------------|---------------------------------------------------|
| BTC-TRX    | TDc1uQoPPnkYTnheTM1HanZta3MokzT3ec                |
| BTT-TRX    | TA37XouyKMTarNRWUzEuViG3Q18dPD33a2                |
| BTTOLD-TRX | TWEfkCoX9KmcF59k3zRySUyhB4pgQRR1Zx                |
| ETH-TRX    | TCL3PCMyT91rtdKA3RU48F82modHS6ruTY                |
| JST-TRX    | TABJQBswQ5bQqXLeZdTHLpYkuPpLDZPJBi                |
| NFT-TRX    | TUoUcMURKBmdRGbpbmtZM7F7KEn3PXNPQv                |
| SUN-TRX    | TUM8k7t4hmA4gRnkPCXmoMDboaQThDVDqx                |
| SUNOLD-TRX | TZ3mcBEUbxfKdLNUzyL2Tqn7FM98XG8E1x                |
| TUSD-TRX   | TUKMTMDt6i1itFdifDPSNXTLddo8uzMf1C                |
| USDC-TRX   | TDbYHS4qR3UNg1QdxCgVa1YocWTmJMDP52                |
| USDD-TRX   | TPvtPmQM94bVkrLMwh2ZS5pRkx5PZG6Sus                |
| USDJ-TRX   | TYrqa6xmkPg7Fp1HU9Sf4oPk9Ax9wYh5ib                |
| USDT-TRX   | TAfx3XnfqgwKavCXuVVqdDX3VHfv6KPLVg                |
| WIN-TRX    | TL92yYSBBVTVyuWmEstfxKzpbRyeVKePEx                |
| TRX-USD    | TA9XdKp9qzCZ1qrZKqp4iKYT4soDH4f7tT                |
| BUSD-TRX   | TKcZpwtUzsohaUwbs6rb3v8hCNAMg93ZrY                |



### Apply for New Trading Pairs

To request for new trading pair to be added to WINkLink officially, please fill in and submit [this form](https://forms.gle/bSdwYa2mHRjdWCgt6).

#### Acquire Latest Prices with latestAnswer
Acquire the latest prices by calling `latestAnswer()` in `AggregatorInterface`.