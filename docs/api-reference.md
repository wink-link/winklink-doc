# API Reference

When you use WINkLink price feeds, retrieve the feeds through the `AggregatorV3Interface` and the proxy address. Optionally, you can call variables and functions in the `AccessControlledOffchainAggregator` contract to get information about the aggregator behind the proxy.

The proxy exposes a stable address whose underlying aggregator can be upgraded without affecting your integration.

## AggregatorV3Interface

Import this interface to your contract and use it to run functions in the proxy contract. Create the interface object by pointing to the proxy address (find supported pairs and their proxy addresses in Price Feed Service → Supported Price Pairs List). For example:

```solidity
/**
 * Network: TRON Mainnet / Nile Testnet
 * Pass the proxy address of the price pair you want to read.
 */
constructor(address feedAddress) {
  priceFeed = AggregatorV3Interface(feedAddress);
}
```

To see examples for how to use this interface, see the "Acquire latest price" section on the Price Feed Service page.

### Functions in AggregatorV3Interface

| Name                                | Description                                                          |
| ----------------------------------- | ------------------------------------------------------------------- |
| [decimals](#decimals)               | The number of decimals in the response.                             |
| [description](#description)         | The description of the aggregator that the proxy points to.         |
| [getRoundData](#getrounddata)       | Get data from a specific round.                                     |
| [latestRoundData](#latestrounddata) | Get data from the latest round.                                     |
| [version](#version)                 | The version representing the type of aggregator the proxy points to.|

#### decimals

Get the number of decimals present in the response value.

```solidity
function decimals() external view returns (uint8);
```

- `RETURN`: The number of decimals.

#### description

Get the description of the underlying aggregator that the proxy points to.

```solidity
function description() external view returns (string memory);
```

- `RETURN`: The description of the underlying aggregator.

#### getRoundData

Get data about a specific round, using the `roundId`.

```solidity
function getRoundData(
  uint80 _roundId
) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
```

**Parameters:**

- `_roundId`: The round ID

**Return values:**

- `roundId`: The round ID
- `answer`: The answer for this round
- `startedAt`: Timestamp of when the round started
- `updatedAt`: Timestamp of when the round was updated
- `answeredInRound`: Deprecated — previously used when answers could take multiple rounds to be computed. On WINkLink feeds it is always equal to `roundId`.

#### latestRoundData

Get the data from the latest round.

```solidity
function latestRoundData()
  external
  view
  returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
```

**Return values:**

- `roundId`: The round ID.
- `answer`: The price that this feed provides for the configured pair.
- `startedAt`: Timestamp of when the round started.
- `updatedAt`: Timestamp of when the round was updated. Validate this against the feed's heartbeat to check freshness.
- `answeredInRound`: Deprecated — previously used when answers could take multiple rounds to be computed. On WINkLink feeds it is always equal to `roundId`.

> Notes for WINkLink OCR feeds: each report writes both `startedAt` and `updatedAt` to the block timestamp of that report, so the two values are identical. The proxy encodes a phase in the high bits of `roundId` (`phaseId << 64 | aggregatorRoundId`); as a result round IDs are not contiguous from `1` and increase across aggregator upgrades. Pass the phase-encoded `roundId` (e.g. the one returned by `latestRoundData()`) when calling `getRoundData()`.

#### version

The version representing the type of aggregator the proxy points to.

```solidity
function version() external view returns (uint256);
```

- `RETURN`: The version number. WINkLink price feeds currently return `4`.

## AccessControlledOffchainAggregator

This is the contract for the aggregator. You can call functions on the aggregator directly, but it is a best practice to use the [AggregatorV3Interface](#aggregatorv3interface) to run functions on the proxy instead so that changes to the aggregator do not affect your application. Read the aggregator contract only if you need functions that are not available in the proxy.

The aggregator contract has several variables and functions that might be useful for your application. Although aggregator contracts are similar for each data feed, some aggregators have different variables. Use the `typeAndVersion()` function on the aggregator to identify what type of aggregator it is and what version it is running.

Always check the contract source code and configuration to understand how specific data feeds operate. A reference WINkLink aggregator contract: [TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu](https://tronscan.org/#/contract/TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu/code) on TronScan.

### Variables and functions in AccessControlledOffchainAggregator

This contract imports `OffchainAggregator` and `SimpleReadAccessController`, which also include their own imports. The variables and functions lists include the publicly accessible items from these imported contracts.

A simple way to read the variables or functions is to get the ABI from a blockchain explorer (TronScan) and point the ABI to the aggregator address.

**Variables:**

| Name         | Description                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| checkEnabled | A boolean that indicates if access is limited to addresses on the internal access list.                            |
| maxAnswer    | The upper bound on the answer the aggregator is allowed to report. A report whose median is above this value is rejected. |
| minAnswer    | The lower bound on the answer the aggregator is allowed to report. A report whose median is below this value is rejected. |
| owner        | The address that owns this aggregator contract. This controls which address can execute specific functions.        |

**Functions:**

| Name                                                    | Description                                                                                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [billingAccessController](#billingaccesscontroller)     | The address for the billingAccessController, which limits access to the billing configuration for the aggregator.  |
| [decimals](#decimals-1)                                 | Return the number of digits of precision for the stored answer. Answers are stored in fixed-point format.          |
| [description](#description-1)                           | Return a description for this data feed. This is different depending on which feed you select.                      |
| [getAnswer](#getanswer)                                 | Deprecated — Do not use this function.                                                                              |
| [getBilling](#getbilling)                               | Retrieve the current billing configuration.                                                                         |
| [getRoundData](#getrounddata-1)                         | Get the full information for a specific aggregator round including the answer and update timestamps.                |
| [getTimestamp](#gettimestamp)                           | Deprecated — Do not use this function.                                                                              |
| [getWinToken](#getwintoken)                             | Get the address of the WIN token contract used to pay oracles.                                                      |
| [hasAccess](#hasaccess)                                 | Check if an address has internal access.                                                                            |
| [latestAnswer](#latestanswer)                           | Return the latest answer for this data feed. No timestamp is included to check data freshness.                     |
| [latestConfigDetails](#latestconfigdetails)             | Return information about the current offchain reporting protocol configuration.                                     |
| [latestRound](#latestround)                             | Deprecated — Do not use this function.                                                                              |
| [latestRoundData](#latestrounddata-1)                   | Get the full information for the most recent round including the answer and update timestamps.                      |
| [latestTimestamp](#latesttimestamp)                     | Deprecated — Do not use this function.                                                                              |
| [latestTransmissionDetails](#latesttransmissiondetails) | Get information about the most recent answer.                                                                       |
| [oracleObservationCount](#oracleobservationcount)       | Returns the number of observations that oracle is due to be reimbursed for.                                         |
| [owedPayment](#owedpayment)                             | Returns how much WIN an oracle is owed for its observations.                                                        |
| [requesterAccessController](#requesteraccesscontroller) | Returns the address for the requester access controller contract.                                                  |
| [transmitters](#transmitters)                           | The oracle addresses that can report answers to this aggregator.                                                    |
| [typeAndVersion](#typeandversion)                       | Returns the aggregator type and version. The version is for the type of aggregator, and different from the contract `version`. |
| [validatorConfig](#validatorconfig)                     | Returns the address and the gas limit for the validator contract.                                                  |
| [version](#version-1)                                   | Returns the contract version. This is different from the `typeAndVersion` for the aggregator.                       |
| [winAvailableForPayment](#winavailableforpayment)       | Get the amount of WIN on this contract that is available to make payments to oracles. This value can be negative if there are outstanding payment obligations. |

#### billingAccessController

The address for the billingAccessController, which limits access to the billing configuration for the aggregator.

```solidity
function billingAccessController() external view returns (AccessControllerInterface) {
  return s_billingAccessController;
}
```

#### decimals

Return the number of digits of precision for the stored answer. Answers are stored in fixed-point format.

```solidity
function decimals() external view returns (uint8 decimalPlaces);
```

#### description

Return a description for this data feed. Usually this is an asset pair for a price feed.

```solidity
function description() public view override checkAccess() returns (string memory) {
  return super.description();
}
```

#### getAnswer

> **Deprecated** — do not use this function. Use `getRoundData()` instead.

#### getBilling

Retrieve the current billing configuration. On TRON, the first three fields (`maximumGasPrice`, `reasonableGasPrice`, `microWinPerTrx`) are not used and are set to `0`.

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

#### getRoundData

Get the full information for a specific aggregator round including the answer and update timestamps. Use this to get the full historical data for a round.

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

#### getTimestamp

> **Deprecated** — do not use this function. Use `getRoundData()` instead.

#### getWinToken

Get the address of the WIN token contract used to pay oracles.

```solidity
function getWinToken() external view returns (WinTokenInterface winToken) {
  return s_winToken;
}
```

#### hasAccess

Check if an address has internal access.

```solidity
function hasAccess(address _user, bytes memory _calldata) public view virtual override returns (bool) {
  return super.hasAccess(_user, _calldata) || _user == tx.origin;
}
```

#### latestAnswer

Return the latest answer for this data feed. No timestamp is included to check data freshness. Returns `0` if no writes have occurred. `latestRoundData` includes the latest answer and timestamps for checking data freshness.

#### latestConfigDetails

Return information about the current offchain reporting protocol configuration.

```solidity
function latestConfigDetails() external view returns (uint32 configCount, uint32 blockNumber, bytes16 configDigest) {
  return (s_configCount, s_latestConfigBlockNumber, s_hotVars.latestConfigDigest);
}
```

#### latestRound

> **Deprecated** — do not use this function. Use `latestRoundData()` instead.

#### latestRoundData

Get the full information for the most recent round including the answer and update timestamps.

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

#### latestTimestamp

> **Deprecated** — do not use this function. Use `latestRoundData()` instead.

#### latestTransmissionDetails

Get information about the most recent answer. Callable only by an externally owned account (EOA).

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

#### oracleObservationCount

Returns the number of observations that oracle is due to be reimbursed for.

```solidity
function oracleObservationCount(address _signerOrTransmitter) external view returns (uint16) {
  Oracle memory oracle = s_oracles[_signerOrTransmitter];
  if (oracle.role == Role.Unset) {
    return 0;
  }
  return s_oracleObservationsCounts[oracle.index] - 1;
}
```

#### owedPayment

Returns how much WIN an oracle is owed for its observations.

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

#### requesterAccessController

Returns the address for the requester access controller contract.

```solidity
function requesterAccessController() external view returns (AccessControllerInterface) {
  return s_requesterAccessController;
}
```

#### transmitters

The oracle addresses that can report answers to this aggregator.

```solidity
function transmitters() external view returns (address[] memory) {
  return s_transmitters;
}
```

#### typeAndVersion

Returns the aggregator type and version. The version is for the type of aggregator, and different from the contract `version`.

```solidity
function typeAndVersion() external pure virtual override returns (string memory) {
  return "AccessControlledOffchainAggregator 4.0.0";
}
```

#### validatorConfig

Returns the address and the gas limit for the validator contract.

```solidity
function validatorConfig() external view returns (AggregatorValidatorInterface validator, uint32 gasLimit) {
  ValidatorConfig memory vc = s_validatorConfig;
  return (vc.validator, vc.gasLimit);
}
```

#### version

Returns the contract version. This is different from the `typeAndVersion` for the aggregator.

```solidity
function version() external view returns (uint256);
```

#### winAvailableForPayment

Get the amount of WIN on this contract that is available to make payments to oracles. This value can be negative if there are outstanding payment obligations.

```solidity
function winAvailableForPayment() external view returns (int256 availableBalance) {
  int256 balance = int256(s_winToken.balanceOf(address(this)));
  int256 due = int256(totalWINDue());
  return int256(balance) - int256(due);
}
```
