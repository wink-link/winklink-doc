# API 参考

集成 WINkLink 价格喂价时，通过 `AggregatorV3Interface` 接口 + 代理（proxy）合约地址读取喂价。如需获取代理背后的聚合器信息，可调用 `AccessControlledOffchainAggregator` 合约中的变量与函数。

代理对外提供一个稳定地址，其底层聚合器可无缝升级而不影响你的集成。

## AggregatorV3Interface

在你的合约中导入本接口并指向代理地址使用（在「WINkLink 价格服务 → 支持的价格对列表」中查询可用价格对与代理地址）。示例：

```solidity
/**
 * Network: TRON Mainnet / Nile Testnet
 * Pass the proxy address of the price pair you want to read.
 */
constructor(address feedAddress) {
  priceFeed = AggregatorV3Interface(feedAddress);
}
```

使用示例见「WINkLink 价格服务」章节的「获取最新价格」段。

### AggregatorV3Interface 方法列表

| 方法名 | 说明 |
| --- | --- |
| [decimals](#decimals) | 响应值的小数位数 |
| [description](#description) | 代理指向的聚合器描述 |
| [getRoundData](#getrounddata) | 获取指定轮次的数据 |
| [latestRoundData](#latestrounddata) | 获取最新轮次的数据 |
| [version](#version) | 代理指向的聚合器版本号 |

#### decimals

获取响应值的小数位数。

```solidity
function decimals() external view returns (uint8);
```

- 返回：小数位数

#### description

获取代理指向的底层聚合器的描述。

```solidity
function description() external view returns (string memory);
```

- 返回：底层聚合器的描述文本

#### getRoundData

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

#### latestRoundData

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

#### version

代理指向的聚合器版本号。

```solidity
function version() external view returns (uint256);
```

- 返回：版本号。WINkLink 价格喂价当前返回 `4`。

## AccessControlledOffchainAggregator

这是聚合器（aggregator）合约本身。**最佳实践是通过** [**AggregatorV3Interface**](#aggregatorv3interface) **代理调用**，避免聚合器升级时影响你的应用。仅在需要代理未暴露的方法时才直接调用聚合器合约。

聚合器合约提供了若干对应用可能有用的变量与函数。各喂价的聚合器结构相似，但部分聚合器的变量有所不同。可调用聚合器的 `typeAndVersion()` 函数确认其类型与版本。

集成时请实地查看合约源码与配置，了解具体喂价的运作方式。参考合约：[TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu](https://tronscan.org/#/contract/TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu/code)（TronScan）。

### AccessControlledOffchainAggregator 变量与函数

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
| [billingAccessController](#billingaccesscontroller) | billingAccessController 地址，限制聚合器 billing 配置的访问权限 |
| [decimals](#decimals-1) | 返回价格的精度位数（定点格式） |
| [description](#description-1) | 返回本喂价的描述（因价格对而异） |
| [getAnswer](#getanswer) | 已弃用 —— 不要使用 |
| [getBilling](#getbilling) | 获取当前 billing 配置 |
| [getRoundData](#getrounddata-1) | 获取指定轮次的完整信息（价格 + 时间戳） |
| [getTimestamp](#gettimestamp) | 已弃用 —— 不要使用 |
| [getWinToken](#getwintoken) | 获取支付预言机所用 WIN 代币合约的地址 |
| [hasAccess](#hasaccess) | 检查地址是否有内部访问权限 |
| [latestAnswer](#latestanswer) | 返回最新价格（无时间戳，无法校验新鲜度） |
| [latestConfigDetails](#latestconfigdetails) | 返回当前 OCR 协议配置信息 |
| [latestRound](#latestround) | 已弃用 —— 不要使用 |
| [latestRoundData](#latestrounddata-1) | 获取最新轮次的完整信息 |
| [latestTimestamp](#latesttimestamp) | 已弃用 —— 不要使用 |
| [latestTransmissionDetails](#latesttransmissiondetails) | 获取最新价格的详细信息 |
| [oracleObservationCount](#oracleobservationcount) | 返回某预言机待结算的 observation 数量 |
| [owedPayment](#owedpayment) | 返回某预言机因其 observation 应得的 WIN 数量 |
| [requesterAccessController](#requesteraccesscontroller) | 返回 requester 访问控制合约地址 |
| [transmitters](#transmitters) | 可向本聚合器上报价格的预言机地址列表 |
| [typeAndVersion](#typeandversion) | 返回聚合器类型与版本；此版本指聚合器类型版本，与合约 `version` 不同 |
| [validatorConfig](#validatorconfig) | 返回 validator 合约地址及其 gas 上限 |
| [version](#version-1) | 返回合约版本号，与聚合器的 `typeAndVersion` 不同 |
| [winAvailableForPayment](#winavailableforpayment) | 返回本合约当前可用于支付预言机的 WIN 余额；若存在未结清的支付义务，该值可能为负 |

#### billingAccessController

billingAccessController 地址，限制聚合器 billing 配置的访问权限。

```solidity
function billingAccessController() external view returns (AccessControllerInterface) {
  return s_billingAccessController;
}
```

#### decimals

返回价格的精度位数。价格以定点格式存储。

```solidity
function decimals() external view returns (uint8 decimalPlaces);
```

#### description

返回本喂价的描述，价格喂价通常为资产对名称。

```solidity
function description() public view override checkAccess() returns (string memory) {
  return super.description();
}
```

#### getAnswer

> **已弃用** —— 不要使用此函数，请改用 `getRoundData()`。

#### getBilling

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

#### getRoundData

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

#### getTimestamp

> **已弃用** —— 不要使用此函数，请改用 `getRoundData()`。

#### getWinToken

获取支付预言机所用 WIN 代币合约的地址。

```solidity
function getWinToken() external view returns (WinTokenInterface winToken) {
  return s_winToken;
}
```

#### hasAccess

检查地址是否有内部访问权限。

```solidity
function hasAccess(address _user, bytes memory _calldata) public view virtual override returns (bool) {
  return super.hasAccess(_user, _calldata) || _user == tx.origin;
}
```

#### latestAnswer

返回本喂价的最新价格。**不含时间戳，无法校验新鲜度**；若尚无写入则返回 `0`。`latestRoundData` 同时返回最新价格与时间戳，可用于校验新鲜度。

#### latestConfigDetails

返回当前 OCR 协议配置信息。

```solidity
function latestConfigDetails() external view returns (uint32 configCount, uint32 blockNumber, bytes16 configDigest) {
  return (s_configCount, s_latestConfigBlockNumber, s_hotVars.latestConfigDigest);
}
```

#### latestRound

> **已弃用** —— 不要使用此函数，请改用 `latestRoundData()`。

#### latestRoundData

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

#### latestTimestamp

> **已弃用** —— 不要使用此函数，请改用 `latestRoundData()`。

#### latestTransmissionDetails

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

#### oracleObservationCount

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

#### owedPayment

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

#### requesterAccessController

返回 requester 访问控制合约地址。

```solidity
function requesterAccessController() external view returns (AccessControllerInterface) {
  return s_requesterAccessController;
}
```

#### transmitters

可向本聚合器上报价格的预言机地址列表。

```solidity
function transmitters() external view returns (address[] memory) {
  return s_transmitters;
}
```

#### typeAndVersion

返回聚合器类型与版本。此版本指聚合器类型版本，与合约 `version` 不同。

```solidity
function typeAndVersion() external pure virtual override returns (string memory) {
  return "AccessControlledOffchainAggregator 4.0.0";
}
```

#### validatorConfig

返回 validator 合约地址及其 gas 上限。

```solidity
function validatorConfig() external view returns (AggregatorValidatorInterface validator, uint32 gasLimit) {
  ValidatorConfig memory vc = s_validatorConfig;
  return (vc.validator, vc.gasLimit);
}
```

#### version

返回合约版本号。与聚合器的 `typeAndVersion` 不同。

```solidity
function version() external view returns (uint256);
```

#### winAvailableForPayment

返回本合约当前可用于支付预言机的 WIN 余额。若存在未结清的支付义务，该值可能为负。

```solidity
function winAvailableForPayment() external view returns (int256 availableBalance) {
  int256 balance = int256(s_winToken.balanceOf(address(this)));
  int256 due = int256(totalWINDue());
  return int256(balance) - int256(due);
}
```
