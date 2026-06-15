# Developer Notes

WINkLink price feeds provide reliable on-chain price data through a decentralized network of 7 independent oracle nodes. The performance of feeds in your DApp depends on both external market conditions and the integration code you write. When integrating WINkLink price feeds, please be mindful of two areas: **market integrity** and **application code**.

## Market Integrity

WINkLink price feeds reflect real-world market conditions and are subject to the external market environment. When integrating, understand the market characteristics of the asset you read, and account for extreme scenarios in your application logic.

The external market environment affects feeds in the following ways:

- The market structure of the underlying asset (exchange distribution, depth, liquidity, etc.) affects price stability.
- Assets with lower liquidity are more sensitive to changes in the external market environment.
- Under extreme market scenarios (sharp volatility, sudden drops in liquidity, market disruptions), feed update behavior may diverge from normal patterns.

We recommend designing your application logic to handle extreme market scenarios, and continuously observing feed behavior after going live.

## Application Code

Application code quality, reliability, and dependency management directly affect how robustly your DApp consumes price data.

### Validate price freshness

Each WINkLink price feed has a heartbeat — an interval within which the on-chain price is guaranteed to be updated. We recommend validating the timestamp before using a price:

```solidity
(uint80 roundId, int256 answer, , uint256 updatedAt, ) = priceFeed.latestRoundData();
require(updatedAt > 0, "Round not complete");
require(block.timestamp - updatedAt <= MAX_PRICE_AGE, "Price too stale");
```

`MAX_PRICE_AGE` should be larger than the heartbeat of the price pair you are reading. Choose the value based on your business tolerance.

### Understand decimals

The precision (decimal places) of WINkLink price feeds may differ between pairs. Always call `decimals()` before performing any price calculation:

```solidity
uint8 dec = priceFeed.decimals();
// Normalize the price using dec in your calculation
```

Do not hard-code a precision value.

### Keep your contract upgradeable

Avoid hard-coding feed contract addresses deep into immutable business logic. Store them in variables that can be updated by a contract owner or governance, so you can migrate to a replacement feed if WINkLink upgrades or deprecates the underlying aggregator.

### Test on Nile first

Before deploying your consumer contract to mainnet, run full integration testing on the Nile testnet against WINkLink's Nile feed addresses:

- Nile testnet feed addresses: see [Price Feed Service → Nile Testnet](./pricing.md#nile-testnet)
- Get testnet TRX — used to deploy and call your own contract — from the [Nile testnet faucet](https://nileex.io/join/getJoinPage)

### Watch for WINkLink updates

WINkLink publishes price feed–related updates through two channels. We recommend integrators monitor content relevant to their applications:

- [**Official announcement channel**](https://winklink.org/#/supportCentre?lang=en-US): matters such as feed deprecation notices and new feed launches.
- [**WINkLink price feed detail page**](https://winklink.org/#/solutions?lang=en-US): real-time configuration parameters (e.g., heartbeat, deviation threshold) for each feed. Parameter changes are reflected here.

Before integration, record the baseline configuration parameters of the feeds you use, so you can periodically compare them after launch and detect parameter changes promptly.

### Monitor in production

After integration, we recommend monitoring the following signals:

- Whether `latestRoundData()` is updated on schedule (heartbeat behavior is normal)
- Whether stale check or related validation events are triggered in your contract
- The frequency and distribution of the above

You can implement this through TRON block explorer event subscriptions or your own off-chain monitoring scripts.
