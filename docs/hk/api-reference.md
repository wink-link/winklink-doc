# API 參考

集成 WINkLink 價格餵價時，通過 `AggregatorV3Interface` 接口 + 代理（proxy）合約地址讀取餵價。如需獲取代理背後的聚合器信息，可調用 `AccessControlledOffchainAggregator` 合約中的變量與函數。

代理對外提供一個穩定地址，其底層聚合器可無縫升級而不影響你的集成。

## AggregatorV3Interface

在你的合約中導入本接口並指向代理地址使用（在「WINkLink 價格服務 → 支持的價格對列表」中查詢可用價格對與代理地址）。示例：

```solidity
/**
 * Network: TRON Mainnet / Nile Testnet
 * Pass the proxy address of the price pair you want to read.
 */
constructor(address feedAddress) {
  priceFeed = AggregatorV3Interface(feedAddress);
}
```

使用示例見「WINkLink 價格服務」章節的「獲取最新價格」段。

### AggregatorV3Interface 方法列表

| 方法名 | 說明 |
| --- | --- |
| [decimals](#decimals) | 響應值的小數位數 |
| [description](#description) | 代理指向的聚合器描述 |
| [getRoundData](#getrounddata) | 獲取指定輪次的數據 |
| [latestRoundData](#latestrounddata) | 獲取最新輪次的數據 |
| [version](#version) | 代理指向的聚合器版本號 |

#### decimals

獲取響應值的小數位數。

```solidity
function decimals() external view returns (uint8);
```

- 返回：小數位數

#### description

獲取代理指向的底層聚合器的描述。

```solidity
function description() external view returns (string memory);
```

- 返回：底層聚合器的描述文本

#### getRoundData

按 `roundId` 獲取指定輪次的數據。

```solidity
function getRoundData(
  uint80 _roundId
) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
```

**參數：**

- `_roundId`：輪次 ID

**返回：**

- `roundId`：輪次 ID
- `answer`：本輪聚合後的價格
- `startedAt`：本輪起始時間戳
- `updatedAt`：本輪完成時間戳
- `answeredInRound`：已棄用 —— 此前用於答案需跨多輪計算的場景；在 WINkLink 餵價上恒等於 `roundId`

#### latestRoundData

獲取最新輪次的數據。

```solidity
function latestRoundData()
  external
  view
  returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
```

**返回：**

- `roundId`：輪次 ID
- `answer`：本餵價為所配置價格對提供的聚合價格
- `startedAt`：本輪起始時間戳
- `updatedAt`：本輪完成時間戳；請結合該餵價的 heartbeat 校驗新鮮度
- `answeredInRound`：已棄用 —— 此前用於答案需跨多輪計算的場景；在 WINkLink 餵價上恒等於 `roundId`

> WINkLink OCR 餵價說明：每次上報都會把 `startedAt` 與 `updatedAt` 寫為該次上報的區塊時間戳，兩者相同。代理會把 phase 編碼進 `roundId` 高位（`phaseId << 64 | aggregatorRoundId`），因此 roundId 並非從 `1` 連續遞增，且在底層聚合器升級時會跳號。調用 `getRoundData()` 時請傳入帶 phase 的 `roundId`（例如 `latestRoundData()` 返回的那個）。

#### version

代理指向的聚合器版本號。

```solidity
function version() external view returns (uint256);
```

- 返回：版本號。WINkLink 價格餵價當前返回 `4`。

## AccessControlledOffchainAggregator

這是聚合器（aggregator）合約本身。**最佳實踐是通過** [**AggregatorV3Interface**](#aggregatorv3interface) **代理調用**，避免聚合器升級時影響你的應用。僅在需要代理未暴露的方法時才直接調用聚合器合約。

聚合器合約提供了若干對應用可能有用的變量與函數。各餵價的聚合器結構相似，但部分聚合器的變量有所不同。可調用聚合器的 `typeAndVersion()` 函數確認其類型與版本。

集成時請實地查看合約源碼與配置，了解具體餵價的運作方式。參考合約：[TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu](https://tronscan.org/#/contract/TU5dpGzXAZwrpFfCrFzDBPWNxPm4diREqu/code)（TronScan）。

### AccessControlledOffchainAggregator 變量與函數

本合約導入了 `OffchainAggregator` 與 `SimpleReadAccessController`（二者又各自有導入項）。下面的變量與函數列表包含這些被導入合約中可公開訪問的項。

讀取這些變量或函數的簡便方式：從區塊瀏覽器（TronScan）獲取 ABI，並將 ABI 指向聚合器地址。

**變量：**

| 名稱 | 說明 |
| --- | --- |
| checkEnabled | 布爾值，是否僅允許內部白名單地址訪問 |
| maxAnswer | 聚合器允許上報的價格上限；中位數高於此值的上報會被合約拒絕 |
| minAnswer | 聚合器允許上報的價格下限；中位數低於此值的上報會被合約拒絕 |
| owner | 聚合器合約的擁有者地址，決定哪些地址可執行特定函數 |

**函數：**

| 名稱 | 說明 |
| --- | --- |
| [billingAccessController](#billingaccesscontroller) | billingAccessController 地址，限制聚合器 billing 配置的訪問權限 |
| [decimals](#decimals-1) | 返回價格的精度位數（定點格式） |
| [description](#description-1) | 返回本餵價的描述（因價格對而異） |
| [getAnswer](#getanswer) | 已棄用 —— 不要使用 |
| [getBilling](#getbilling) | 獲取當前 billing 配置 |
| [getRoundData](#getrounddata-1) | 獲取指定輪次的完整信息（價格 + 時間戳） |
| [getTimestamp](#gettimestamp) | 已棄用 —— 不要使用 |
| [getWinToken](#getwintoken) | 獲取支付預言機所用 WIN 代幣合約的地址 |
| [hasAccess](#hasaccess) | 檢查地址是否有內部訪問權限 |
| [latestAnswer](#latestanswer) | 返回最新價格（無時間戳，無法校驗新鮮度） |
| [latestConfigDetails](#latestconfigdetails) | 返回當前 OCR 協議配置信息 |
| [latestRound](#latestround) | 已棄用 —— 不要使用 |
| [latestRoundData](#latestrounddata-1) | 獲取最新輪次的完整信息 |
| [latestTimestamp](#latesttimestamp) | 已棄用 —— 不要使用 |
| [latestTransmissionDetails](#latesttransmissiondetails) | 獲取最新價格的詳細信息 |
| [oracleObservationCount](#oracleobservationcount) | 返回某預言機待結算的 observation 數量 |
| [owedPayment](#owedpayment) | 返回某預言機因其 observation 應得的 WIN 數量 |
| [requesterAccessController](#requesteraccesscontroller) | 返回 requester 訪問控制合約地址 |
| [transmitters](#transmitters) | 可向本聚合器上報價格的預言機地址列表 |
| [typeAndVersion](#typeandversion) | 返回聚合器類型與版本；此版本指聚合器類型版本，與合約 `version` 不同 |
| [validatorConfig](#validatorconfig) | 返回 validator 合約地址及其 gas 上限 |
| [version](#version-1) | 返回合約版本號，與聚合器的 `typeAndVersion` 不同 |
| [winAvailableForPayment](#winavailableforpayment) | 返回本合約當前可用於支付預言機的 WIN 餘額；若存在未結清的支付義務，該值可能為負 |

#### billingAccessController

billingAccessController 地址，限制聚合器 billing 配置的訪問權限。

```solidity
function billingAccessController() external view returns (AccessControllerInterface) {
  return s_billingAccessController;
}
```

#### decimals

返回價格的精度位數。價格以定點格式存儲。

```solidity
function decimals() external view returns (uint8 decimalPlaces);
```

#### description

返回本餵價的描述，價格餵價通常為資產對名稱。

```solidity
function description() public view override checkAccess() returns (string memory) {
  return super.description();
}
```

#### getAnswer

> **已棄用** —— 不要使用此函數，請改用 `getRoundData()`。

#### getBilling

獲取當前 billing 配置。在 TRON 上，前三個字段（`maximumGasPrice`、`reasonableGasPrice`、`microWinPerTrx`）未啟用，恒為 `0`。

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

獲取指定輪次的完整信息（價格 + 時間戳）。用於讀取某一輪次的完整歷史數據。

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

> **已棄用** —— 不要使用此函數，請改用 `getRoundData()`。

#### getWinToken

獲取支付預言機所用 WIN 代幣合約的地址。

```solidity
function getWinToken() external view returns (WinTokenInterface winToken) {
  return s_winToken;
}
```

#### hasAccess

檢查地址是否有內部訪問權限。

```solidity
function hasAccess(address _user, bytes memory _calldata) public view virtual override returns (bool) {
  return super.hasAccess(_user, _calldata) || _user == tx.origin;
}
```

#### latestAnswer

返回本餵價的最新價格。**不含時間戳，無法校驗新鮮度**；若尚無寫入則返回 `0`。`latestRoundData` 同時返回最新價格與時間戳，可用於校驗新鮮度。

#### latestConfigDetails

返回當前 OCR 協議配置信息。

```solidity
function latestConfigDetails() external view returns (uint32 configCount, uint32 blockNumber, bytes16 configDigest) {
  return (s_configCount, s_latestConfigBlockNumber, s_hotVars.latestConfigDigest);
}
```

#### latestRound

> **已棄用** —— 不要使用此函數，請改用 `latestRoundData()`。

#### latestRoundData

獲取最新輪次的完整信息（價格 + 時間戳）。

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

> **已棄用** —— 不要使用此函數，請改用 `latestRoundData()`。

#### latestTransmissionDetails

獲取最新價格的詳細信息。僅外部賬戶（EOA）可調用。

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

返回某預言機待結算的 observation 數量。

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

返回某預言機因其 observation 應得的 WIN 數量。

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

返回 requester 訪問控制合約地址。

```solidity
function requesterAccessController() external view returns (AccessControllerInterface) {
  return s_requesterAccessController;
}
```

#### transmitters

可向本聚合器上報價格的預言機地址列表。

```solidity
function transmitters() external view returns (address[] memory) {
  return s_transmitters;
}
```

#### typeAndVersion

返回聚合器類型與版本。此版本指聚合器類型版本，與合約 `version` 不同。

```solidity
function typeAndVersion() external pure virtual override returns (string memory) {
  return "AccessControlledOffchainAggregator 4.0.0";
}
```

#### validatorConfig

返回 validator 合約地址及其 gas 上限。

```solidity
function validatorConfig() external view returns (AggregatorValidatorInterface validator, uint32 gasLimit) {
  ValidatorConfig memory vc = s_validatorConfig;
  return (vc.validator, vc.gasLimit);
}
```

#### version

返回合約版本號。與聚合器的 `typeAndVersion` 不同。

```solidity
function version() external view returns (uint256);
```

#### winAvailableForPayment

返回本合約當前可用於支付預言機的 WIN 餘額。若存在未結清的支付義務，該值可能為負。

```solidity
function winAvailableForPayment() external view returns (int256 availableBalance) {
  int256 balance = int256(s_winToken.balanceOf(address(this)));
  int256 due = int256(totalWINDue());
  return int256(balance) - int256(due);
}
```
