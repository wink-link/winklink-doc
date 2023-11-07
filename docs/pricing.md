# WINkLink Price Service

## Overview

To ensure that smart contracts reflect token prices in real-world time, it is necessary to frequently update them. In particular, the prices of assets in DeFi must closely match those of the real world. Otherwise, arbitrage or contract attacks may cause losses for users and developers.

WINkLink's price service focuses on digital currency pairs, providing decentralized applications (DApps) with accurate and stable price information on real-world digital currencies. The solution offered by WINkLink aggregates price data from multiple oracle nodes, resulting in a stable price service known as the Price Feed Contract.

This article explains how you may utilise the WINkLink price service contract.

## Acquire Latest Prices

Acquiring the latest price data in the consumer contract requires `AggregatorInterface`. 

This interface defines the functions provided by the Price Feed Contract to the public. The code below demonstrates an example of using the AggregatorInterface to acquire the latest price:

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

### Price History

The `AggregatorInterface` interface provides the `getAnswer(uint256 roundId)` function to obtain the price history. The corresponding timestamp can be acquired via `getTimestamp(uint256 roundId)`.

## Price Feed Contract

### Mainnet


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
| STRX-TRX   | TW9bNueyJZA9iZnNXGYkJuPJJ7KFN3o5qw  |
| NFT-USD    | TEC8b2oL6sAQFMiea73tTgjtTLwyV1GuZU  |
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

### Nile Testnet

- WIN Token Contract Address: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid Contract Address: `TLDU7C8K3Gd3pXrAj9gtpVVNRHZHuHHZ8P`

List of price service contract addresses:

| Pair       | Nile (Proxy)                          |
|:-----------|:--------------------------------------|
| BTC-TRX    | TFETSL1Yc8dCJM7z6uBkHhAsPbqP5UaCDE    |
| BTC-USD    | TAX8Pm3FgN74za72TFZrn5gPBxJTKgnnpE    |
| BTT-TRX    | TKbeHN2hdrgSShG6iF3mDsJTu9fFzNrHjo    |
| BTT-USD    | TJdzg4wqBt4JkP1ehbYQufg1cLjbomT2j7    |
| BTTOLD-TRX | TETkTRbnyB4ptWiK9qXgiyFxQQ9d8ZacT6    |
| BTTOLD-USD | TRpRfFzubR7oheDCwHRbwJRfeFa85L6tWE    |
| BUSD-TRX   | TDBQRjnrdrDKcgPDyLuP11UC8CV8hwZGxe    |
| BUSD-USD   | TAiAAKcD4FtNhcJ8q9ZpkpnvSJ5R9XqYVx    |
| ETH-TRX    | TSVJwLrhWBF7K6BkEG6hStjMxQJXAzBABQ    |
| ETH-USD    | TQGyY3mWTTzKKBLBg3wQTSbAGqBnGqYSzX    |
| JST-TRX    | TSf6ZwFrDg5Jvyci1PnRHrrZvPpCCKNTjj    |
| JST-USD    | TJ7SizJiCAjMPAri1CFAxzg4xCRLycumMj    |
| LIVE-USD   | TPxNjLNrn3WAwoyGQgqJyw3dLo9E79mUdH    |
| LTC-TRX    | TWProfbHdGBCf7HVNys5KAbVT4vhUwpu22    |
| LTC-USD    | TRSFTb2seuQxQqUsyeJ8Wg8XhX1e2g3T19    |
| NFT-TRX    | TWP99RnyMVKFjzuu9XT5J21qBZu8DwhCum    |
| NFT-USD    | TX5KVe4sp24w5HJ4nfk2ZstRhV8RTFm67W    |
| STRX-TRX   | TEbUQ4gohuK5wdtKmpnGd2kvyzhhznJDCx    |
| SUN-TRX    | TTxxeWGpSDV3zPDxnYXzG1ue7RpTYTvDpY    |
| SUN-USD    | TJjENuVH7TD8RJdGtj22ac6Bt1ktpBGURR    |
| SUNOLD-TRX | TNfn4qt4QJ7LAndM2aWbxrGGH8CRGvzxui    |
| SUNOLD-USD | TMKzWKMA1gSwjYSL6VpfCUXLuwPKdjEsQ2    |
| TRX-USD    | TCeXRh9vcb78j2Eb2oJk4YwwnoHQDT64T1    |
| TUSD-TRX   | TM1bvBzHkRrQqvvHGi1CC1Heb8ESWreiNW    |
| TUSD-USD   | TUuxMFxv6qPn1ymZoYY45SSK1hhEVAvyKz    |
| USDC-TRX   | TWio8JqYx2aey49ua2ohLoyBPbVVWos8RB    |
| USDC-USD   | TF5a2qhfxtWzUQnAocPoxgKXLe1vEE8oER    |
| USDD-TRX   | TFr7TWdb5RWPNCfecr3HNfnCmNNL8qvgmJ    |
| USDD-USD   | TX264fxRmdhNfUgkruk9orzAVvtCehyowq    |
| USDJ-TRX   | TDJtnT7JRNqmNaqY1mK9i1xWN4GnX1UfGd    |
| USDJ-USD   | TKZUQTYAhH1LTG67QmhX4HxTWZdvLfH9d1    |
| USDT-TRX   | TJL5M1QqL7oF2ceazAFJ2ump9jf87jUqnK    |
| USDT-USD   | TT2ETLY1Mmx2DKYT9S6fMvKGPqbWH3LDEJ    |
| WIN-TRX    | TP7aHYuXUkKPKsojs9BNJDVyAJeQ2KtfCj    |
| WIN-USD    | TYYMqsRNZTwsiFkRtn2NewvXT9GnnsPBH9    |
| WSTUSDT-TRX  | TZGEUihByCHG79Hbpider6pGZfY9S8ct6P  |

### Apply for New Trading Pairs

To request for new trading pair to be added to WINkLink officially, please fill in and submit [this form.](https://forms.gle/bSdwYa2mHRjdWCgt6)

#### Acquire Latest Prices with latestAnswer
Acquire the latest prices by calling `latestAnswer()` in `AggregatorInterface`.