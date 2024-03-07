# WINkLink AnyAPI 服務

## 概覽

AnyAPI 服務提供一系列內部適配器，讓用戶可以借助 WINkLink 節點的強大功能生成自定義數據。

該服務能夠幫助開發者從鏈下渠道獲取數據，進行必要的數據變換後將其餵到鏈上。這些數據可以是航司抵達/起飛時刻表、體育賽事的結果、交通狀況等等。

![anyapi-flow.png](~@source/images/anyapi-flow.png)

WINkLink AnyAPI 解決方案由鏈上和鏈下兩部分組成：

- AnyAPI Consumer（鏈上組件）：用於同 AnyApi Operator 合約交互。用戶需向該合約充值 Wink 代幣以發起請求。
- AnyAPI Operator（鏈上組件）：用於處理 Consumer 合約發起的所有 AnyAPI 請求的合約，它會在用戶發起請求時發布一個事件，並把結果轉發給 Consumer 合約。
- AnyAPI 服務（鏈下節點）：通過訂閱 AnyAPI Operator 事件日誌監聽請求，並執行指定操作以獲取自定義數據。服務將根據請求中指定的外部任務 ID 觸發對應的任務。

### 合約

Nile 環境中（測試環境）部署了一組用於測試的合約。

| 項目                  | 數值                                                                 |
|:--------------------|:-------------------------------------------------------------------|
| WIN Token           | TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2                                 |
| WinkMid             | TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro                                 |
| Operator            | THRs9Y3vqE4FMTE7LPjMB4LFEH8uUsZaE4                                 |
| SingleWordConsumer  | TP3yr6MYDTDsta9JchahunXk1vvKkw87LS                                 |
| MultiWordConsumer   | TNCqRNxC3epb6KAiVyUvfFHJEkN2miTTb1                                 |
| Single Word Spec ID | 0x8495b310eb4a479f8982ad656521344900000000000000000000000000000000 |
| Multi Word Spec ID  | 0x1145310598fc4c25b825f4dae83e921e00000000000000000000000000000000 |

## 使用現有的 WINkLink AnyAPI

::: warning
當前部署的 Consumer 合約和任務僅為示例，用於學習和測試。建議用戶自主設定任務規範，創建專屬的 Consumer 合約。
:::

### AnyAPI 請求步驟

1. Dapp/Consumer 合約發起單變量/多變量請求，對應不同的外部任務 ID。

2. Dapp 合約調用 WinkMid transferAndCall 函數向 Operator 支付請求所需的費用。這一方法將發送 Wink 代幣並執行 onTokenTransfer。

3. Operator 中的 onTokenTransfer 邏輯將觸發預言機請求方法並發布 OracleRequest 事件。

4. 訂閱該鏈的 AnyAPI 節點在收到事件後根據所含的外部任務 ID 進行處理。

5. Operator 合約收到節點的回調函數後將結果返回給 Dapp/Consumer 合約。

使用 WINkLink Operator 合約和節點前，用戶需創建自己的 Consumer 合約和任務規範，並向合約內充值以發起請求。

## 啟動 AnyAPI 服務節點

### 入門指南

WINkLink 的維護者需要對波場 TRON 有一定的了解，且熟悉智能合約的部署和調用流程。建議閱讀波場相關的官方文檔，特別是 TronIDE 上進行合約部署的相關文章。

準備節點賬戶，建議閱讀節點賬戶準備相關的文檔。

### 所需環境

WINkLink 節點依賴 PostgreSQL 數據庫，開發者可在 [postgresql 官網的官方文檔](https://www.postgresql.org)中獲取更多信息。

::: tip
這裏假定本機部署的 PostgreSQL 實例的用戶名和密碼分別是 root:root。在生產環境中請使用強密碼或其他驗證方式。
:::

WINkLink 節點使用的編程語言為 Go，因此需要搭建 Golang 環境。

### 節點配置

WINkLink 節點的配置文件格式為 TOML，主配置為 tools/config/config.toml。你可以使用 secrets.toml 指定要使用的 db 實例。以下為參考模板。

```toml
# secrets.toml
[Database]
URL = 'postgresql://root:root@localhost:5432/winklink?sslmode=disable' # Require
AllowSimplePasswords = true

[Password]
Keystore = 'keystorePassword' # Required

[Tron]
TronApiKey = 'apiKey'
```
節點配置文件確認完畢後，還需要創建 `apicredentials` 文件和 `password`，然後寫入用戶 ID 和密碼訪問節點 API：

```toml
# apicredentials
example.user@fake.email
totallyNotFakePassword (16 characters long)
```

```toml
# password
totallyNotFakePassword (16 characters long)
```

::: tip
請妥善托管您的個人信息。
:::

### 搭建節點 Docker 鏡像

使用以下指令構建標準的 Linux 鏡像：

```
# build a docker image
docker buildx build --platform linux/amd64 -t winklink-2.0 -f core/winklink.Dockerfile .
```

將構建好的 Docker 鏡像打上標簽並推送到所需的存儲庫進行部署。

### 用源代碼啟動節點

安装 [go1.20](https://go.dev/dl/)

前往 winklink-2.0 源代碼的基本目錄

搭建命令行界面

```
make install
```

使用以下指令及對應配置項啟動 WINkLink 節點：

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/password -a /tools/secrets/apicredentials
```

::: warning
節點帳號必須有足夠的 TRX 代幣，用於合約調用。可以通過測試網水龍頭申請測試代幣。
:::

### Operator 合約

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "./AuthorizedReceiver.sol";
import "./TRC20ReceiverInterface.sol";
import "./ConfirmedOwner.sol";
import "./TRC20Interface.sol";
import "./OperatorInterface.sol";
import "./OwnableInterface.sol";
import "./WithdrawalInterface.sol";
import "./SafeMathWinklink.sol";

/**
 * @title The Winklink Operator contract
 * @notice Node operators can deploy this contract to fulfill requests sent to them
 */
contract Operator is AuthorizedReceiver, ConfirmedOwner, TRC20ReceiverInterface, OperatorInterface, WithdrawalInterface {
  using SafeMathWinklink for uint256;

  struct Commitment {
    bytes31 paramsHash;
    uint8 dataVersion;
  }

  uint256 public constant getExpiryTime = 5 minutes;
  uint256 private constant MAXIMUM_DATA_VERSION = 256;
  uint256 private constant MINIMUM_CONSUMER_GAS_LIMIT = 400000;
  uint256 private constant SELECTOR_LENGTH = 4;
  uint256 private constant EXPECTED_REQUEST_WORDS = 2;
  uint256 private constant MINIMUM_REQUEST_LENGTH = SELECTOR_LENGTH + (32 * EXPECTED_REQUEST_WORDS);
  // We initialize fields to 1 instead of 0 so that the first invocation
  // does not cost more gas.
  uint256 private constant ONE_FOR_CONSISTENT_GAS_COST = 1;
  // oracleRequest is intended for version 1, enabling single word responses
  bytes4 private constant ORACLE_REQUEST_SELECTOR = this.oracleRequest.selector;
  // operatorRequest is intended for version 2, enabling multi-word responses
  bytes4 private constant OPERATOR_REQUEST_SELECTOR = this.operatorRequest.selector;

  TRC20Interface internal immutable winkToken;
  WinkMid internal immutable winkMid;
  mapping(bytes32 => Commitment) private s_commitments;
  mapping(address => bool) private s_owned;
  // Tokens sent for requests that have not been fulfilled yet
  uint256 private s_tokensInEscrow = ONE_FOR_CONSISTENT_GAS_COST;

  event OracleRequest(
    bytes32 indexed specId,
    address requester,
    bytes32 requestId,
    uint256 payment,
    address callbackAddr,
    bytes4 callbackFunctionId,
    uint256 cancelExpiration,
    uint256 dataVersion,
    bytes data
  );

  event CancelOracleRequest(bytes32 indexed requestId);

  event OracleResponse(bytes32 indexed requestId);

  event OwnableContractAccepted(address indexed acceptedContract);

  event TargetsUpdatedAuthorizedSenders(address[] targets, address[] senders, address changedBy);

  /**
   * @notice Deploy with the address of the WINK token
   * @dev Sets the WinkToken address for the imported TRC20Interface
   * @param wink The address of the WINK token
   * @param owner The address of the owner
   */
  constructor(address wink, address _winkMid, address owner) ConfirmedOwner(owner) {
    winkToken = TRC20Interface(wink); // external but already deployed and unalterable
    winkMid = WinkMid(_winkMid);
  }

  /**
   * @notice The type and version of this contract
   * @return Type and version string
   */
  function typeAndVersion() external pure virtual returns (string memory) {
    return "Operator 1.0.0";
  }

  /**
   * @notice Creates the Winklink request. This is a backwards compatible API
   * with the Oracle.sol contract, but the behavior changes because
   * callbackAddress is assumed to be the same as the request sender.
   * @param callbackAddress The consumer of the request
   * @param payment The amount of payment given (specified in wei)
   * @param specId The Job Specification ID
   * @param callbackAddress The address the oracle data will be sent to
   * @param callbackFunctionId The callback function ID for the response
   * @param nonce The nonce sent by the requester
   * @param dataVersion The specified data version
   * @param data The extra request parameters
   */
  function oracleRequest(
    address sender,
    uint256 payment,
    bytes32 specId,
    address callbackAddress,
    bytes4 callbackFunctionId,
    uint256 nonce,
    uint256 dataVersion,
    bytes calldata data
  ) external override {
    (bytes32 requestId, uint256 expiration) = _verifyAndProcessOracleRequest(
      sender,
      payment,
      callbackAddress,
      callbackFunctionId,
      nonce,
      dataVersion
    );
    emit OracleRequest(specId, sender, requestId, payment, sender, callbackFunctionId, expiration, dataVersion, data);
  }

  /**
   * @notice Creates the Winklink request
   * @dev Stores the hash of the params as the on-chain commitment for the request.
   * Emits OracleRequest event for the Winklink node to detect.
   * @param sender The sender of the request
   * @param payment The amount of payment given (specified in wei)
   * @param specId The Job Specification ID
   * @param callbackFunctionId The callback function ID for the response
   * @param nonce The nonce sent by the requester
   * @param dataVersion The specified data version
   * @param data The extra request parameters
   */
  function operatorRequest(
    address sender,
    uint256 payment,
    bytes32 specId,
    bytes4 callbackFunctionId,
    uint256 nonce,
    uint256 dataVersion,
    bytes calldata data
  ) external override {
    (bytes32 requestId, uint256 expiration) = _verifyAndProcessOracleRequest(
      sender,
      payment,
      sender,
      callbackFunctionId,
      nonce,
      dataVersion
    );
    emit OracleRequest(specId, sender, requestId, payment, sender, callbackFunctionId, expiration, dataVersion, data);
  }

  /**
   * @notice Called by the Winklink node to fulfill requests
   * @dev Given params must hash back to the commitment stored from `oracleRequest`.
   * Will call the callback address' callback function without bubbling up error
   * checking in a `require` so that the node can get paid.
   * @param requestId The fulfillment request ID that must match the requesters'
   * @param payment The payment amount that will be released for the oracle (specified in wei)
   * @param callbackAddress The callback address to call for fulfillment
   * @param callbackFunctionId The callback function ID to use for fulfillment
   * @param expiration The expiration that the node should respond by before the requester can cancel
   * @param data The data to return to the consuming contract
   * @return Status if the external call was successful
   */
  function fulfillOracleRequest(
    bytes32 requestId,
    uint256 payment,
    address callbackAddress,
    bytes4 callbackFunctionId,
    uint256 expiration,
    bytes32 data
  )
  external
  override
  validateAuthorizedSender
  validateRequestId(requestId)
  validateCallbackAddress(callbackAddress)
  returns (bool)
  {
    _verifyOracleRequestAndProcessPayment(requestId, payment, callbackAddress, callbackFunctionId, expiration, 1);
    emit OracleResponse(requestId);
//    require(gasleft() >= MINIMUM_CONSUMER_GAS_LIMIT, "Must provide consumer enough gas");
    // All updates to the oracle's fulfillment should come before calling the
    // callback(addr+functionId) as it is untrusted.
    // See: https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern
    (bool success, ) = callbackAddress.call(abi.encodeWithSelector(callbackFunctionId, requestId, data)); // solhint-disable-line avoid-low-level-calls
    return success;
  }

  /**
   * @notice Called by the Winklink node to fulfill requests with multi-word support
   * @dev Given params must hash back to the commitment stored from `oracleRequest`.
   * Will call the callback address' callback function without bubbling up error
   * checking in a `require` so that the node can get paid.
   * @param requestId The fulfillment request ID that must match the requester's
   * @param payment The payment amount that will be released for the oracle (specified in wei)
   * @param callbackAddress The callback address to call for fulfillment
   * @param callbackFunctionId The callback function ID to use for fulfillment
   * @param expiration The expiration that the node should respond by before the requester can cancel
   * @param data The data to return to the consuming contract
   * @return Status if the external call was successful
   */
  function fulfillOracleRequest2(
    bytes32 requestId,
    uint256 payment,
    address callbackAddress,
    bytes4 callbackFunctionId,
    uint256 expiration,
    bytes calldata data
  )
  external
  override
  validateAuthorizedSender
  validateRequestId(requestId)
  validateCallbackAddress(callbackAddress)
  validateMultiWordResponseId(requestId, data)
  returns (bool)
  {
    _verifyOracleRequestAndProcessPayment(requestId, payment, callbackAddress, callbackFunctionId, expiration, 2);
    emit OracleResponse(requestId);
//    require(gasleft() >= MINIMUM_CONSUMER_GAS_LIMIT, "Must provide consumer enough gas");
    // All updates to the oracle's fulfillment should come before calling the
    // callback(addr+functionId) as it is untrusted.
    // See: https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern
    (bool success, ) = callbackAddress.call(abi.encodePacked(callbackFunctionId, data)); // solhint-disable-line avoid-low-level-calls
    return success;
  }

  /**
   * @notice Transfer the ownership of ownable contracts. This is primarily
   * intended for Authorized Forwarders but could possibly be extended to work
   * with future contracts.
   * @param ownable list of addresses to transfer
   * @param newOwner address to transfer ownership to
   */
  function transferOwnableContracts(address[] calldata ownable, address newOwner) external onlyOwner {
    for (uint256 i = 0; i < ownable.length; i++) {
      s_owned[ownable[i]] = false;
      OwnableInterface(ownable[i]).transferOwnership(newOwner);
    }
  }

  /**
   * @notice Accept the ownership of an ownable contract. This is primarily
   * intended for Authorized Forwarders but could possibly be extended to work
   * with future contracts.
   * @dev Must be the pending owner on the contract
   * @param ownable list of addresses of Ownable contracts to accept
   */
  function acceptOwnableContracts(address[] calldata ownable) public validateAuthorizedSenderSetter {
    for (uint256 i = 0; i < ownable.length; i++) {
      s_owned[ownable[i]] = true;
      emit OwnableContractAccepted(ownable[i]);
      OwnableInterface(ownable[i]).acceptOwnership();
    }
  }

  /**
   * @notice Sets the fulfillment permission for
   * @param targets The addresses to set permissions on
   * @param senders The addresses that are allowed to send updates
   */
  function setAuthorizedSendersOn(address[] calldata targets, address[] calldata senders)
  public
  validateAuthorizedSenderSetter
  {
    TargetsUpdatedAuthorizedSenders(targets, senders, msg.sender);

    for (uint256 i = 0; i < targets.length; i++) {
      AuthorizedReceiverInterface(targets[i]).setAuthorizedSenders(senders);
    }
  }

  /**
   * @notice Accepts ownership of ownable contracts and then immediately sets
   * the authorized sender list on each of the newly owned contracts. This is
   * primarily intended for Authorized Forwarders but could possibly be
   * extended to work with future contracts.
   * @param targets The addresses to set permissions on
   * @param senders The addresses that are allowed to send updates
   */
  function acceptAuthorizedReceivers(address[] calldata targets, address[] calldata senders)
  external
  validateAuthorizedSenderSetter
  {
    acceptOwnableContracts(targets);
    setAuthorizedSendersOn(targets, senders);
  }

  /**
   * @notice Allows the node operator to withdraw earned WINK to a given address
   * @dev The owner of the contract can be another wallet and does not have to be a Winklink node
   * @param recipient The address to send the WINK token to
   * @param amount The amount to send (specified in wei)
   */
  function withdraw(address recipient, uint256 amount)
  external
  override(OracleInterface, WithdrawalInterface)
  onlyOwner
  validateAvailableFunds(amount)
  {
    assert(winkToken.transfer(recipient, amount));
  }

  /**
   * @notice Displays the amount of WINK that is available for the node operator to withdraw
   * @dev We use `ONE_FOR_CONSISTENT_GAS_COST` in place of 0 in storage
   * @return The amount of withdrawable WINK on the contract
   */
  function withdrawable() external view override(OracleInterface, WithdrawalInterface) returns (uint256) {
    return _fundsAvailable();
  }

  /**
   * @notice Forward a call to another contract
   * @dev Only callable by the owner
   * @param to address
   * @param data to forward
   */
  function ownerForward(address to, bytes calldata data) external onlyOwner validateNotToWINK(to) {
    require(isContract(to), "Must forward to a contract");
    (bool status, ) = to.call(data);
    require(status, "Forwarded call failed");
  }

  /**
   * @notice Interact with other WINKTokenReceiver contracts by calling transferAndCall
   * @param to The address to transfer to.
   * @param value The amount to be transferred.
   * @param data The extra data to be passed to the receiving contract.
   * @return success bool
   */
  function ownerTransferAndCall(
    address to,
    uint64 value,
    bytes calldata data
  ) external override onlyOwner validateAvailableFunds(value) returns (bool success) {
    winkToken.approve(address(winkMid), value);
    return winkMid.transferAndCall(to, value, data);
  }

  /**
   * @notice Distribute funds to multiple addresses using ETH send
   * to this payable function.
   * @dev Array length must be equal, TRX sent must equal the sum of amounts.
   * A malicious receiver could cause the distribution to revert, in which case
   * it is expected that the address is removed from the list.
   * @param receivers list of addresses
   * @param amounts list of amounts
   */
  function distributeFunds(address payable[] calldata receivers, uint256[] calldata amounts) external payable {
    require(receivers.length > 0 && receivers.length == amounts.length, "Invalid array length(s)");
    uint256 valueRemaining = msg.value;
    for (uint256 i = 0; i < receivers.length; i++) {
      uint256 sendAmount = amounts[i];
      valueRemaining = valueRemaining.sub(sendAmount);
      receivers[i].transfer(sendAmount);
    }
    require(valueRemaining == 0, "Too much TRX sent");
  }

  /**
   * @notice Allows recipient to cancel requests sent to this oracle contract.
   * Will transfer the WINK sent for the request back to the recipient address.
   * @dev Given params must hash to a commitment stored on the contract in order
   * for the request to be valid. Emits CancelOracleRequest event.
   * @param requestId The request ID
   * @param payment The amount of payment given (specified in wei)
   * @param callbackFunc The requester's specified callback function selector
   * @param expiration The time of the expiration for the request
   */
  function cancelOracleRequest(
    bytes32 requestId,
    uint64 payment,
    bytes4 callbackFunc,
    uint256 expiration
  ) external override {
    bytes31 paramsHash = _buildParamsHash(payment, msg.sender, callbackFunc, expiration);
    require(s_commitments[requestId].paramsHash == paramsHash, "Params do not match request ID");
    // solhint-disable-next-line not-rely-on-time
    require(expiration <= block.timestamp, "Request is not expired");

    delete s_commitments[requestId];
    emit CancelOracleRequest(requestId);

    winkToken.transfer(msg.sender, payment);
  }

  /**
   * @notice Allows requester to cancel requests sent to this oracle contract.
   * Will transfer the WINK sent for the request back to the recipient address.
   * @dev Given params must hash to a commitment stored on the contract in order
   * for the request to be valid. Emits CancelOracleRequest event.
   * @param nonce The nonce used to generate the request ID
   * @param payment The amount of payment given (specified in wei)
   * @param callbackFunc The requester's specified callback function selector
   * @param expiration The time of the expiration for the request
   */
  function cancelOracleRequestByRequester(
    uint256 nonce,
    uint256 payment,
    bytes4 callbackFunc,
    uint256 expiration
  ) external {
    bytes32 requestId = keccak256(abi.encodePacked(msg.sender, nonce));
    bytes31 paramsHash = _buildParamsHash(payment, msg.sender, callbackFunc, expiration);
    require(s_commitments[requestId].paramsHash == paramsHash, "Params do not match request ID");
    // solhint-disable-next-line not-rely-on-time
    require(expiration <= block.timestamp, "Request is not expired");

    delete s_commitments[requestId];
    emit CancelOracleRequest(requestId);

    winkToken.transfer(msg.sender, payment);
  }

  /**
   * @notice Returns the address of the WINK token
   * @dev This is the public implementation for WinklinkTokenAddress, which is
   * an internal method of the WinklinkClient contract
   */
  function getWinklinkToken() public view returns (address) {
    return address(winkMid);
  }

  /**
   * @notice Require that the token transfer action is valid
   * @dev OPERATOR_REQUEST_SELECTOR = multiword, ORACLE_REQUEST_SELECTOR = singleword
   */
  function _validateTokenTransferAction(bytes4 funcSelector, bytes memory data) internal pure {
    require(data.length >= MINIMUM_REQUEST_LENGTH, "Invalid request length");
    require(
      funcSelector == OPERATOR_REQUEST_SELECTOR || funcSelector == ORACLE_REQUEST_SELECTOR,
      "Must use whitelisted functions"
    );
  }

  /**
   * @notice Verify the Oracle Request and record necessary information
   * @param sender The sender of the request
   * @param payment The amount of payment given (specified in wei)
   * @param callbackAddress The callback address for the response
   * @param callbackFunctionId The callback function ID for the response
   * @param nonce The nonce sent by the requester
   */
  function _verifyAndProcessOracleRequest(
    address sender,
    uint256 payment,
    address callbackAddress,
    bytes4 callbackFunctionId,
    uint256 nonce,
    uint256 dataVersion
  ) private validateNotToWINK(callbackAddress) returns (bytes32 requestId, uint256 expiration) {
    requestId = keccak256(abi.encodePacked(sender, nonce));
    require(s_commitments[requestId].paramsHash == 0, "Must use a unique ID");
    // solhint-disable-next-line not-rely-on-time
    expiration = block.timestamp.add(getExpiryTime);
    bytes31 paramsHash = _buildParamsHash(payment, callbackAddress, callbackFunctionId, expiration);
    s_commitments[requestId] = Commitment(paramsHash, _safeCastToUint8(dataVersion));
    s_tokensInEscrow = s_tokensInEscrow.add(payment);
    return (requestId, expiration);
  }

  /**
   * @notice Verify the Oracle request and unlock escrowed payment
   * @param requestId The fulfillment request ID that must match the requester's
   * @param payment The payment amount that will be released for the oracle (specified in wei)
   * @param callbackAddress The callback address to call for fulfillment
   * @param callbackFunctionId The callback function ID to use for fulfillment
   * @param expiration The expiration that the node should respond by before the requester can cancel
   */
  function _verifyOracleRequestAndProcessPayment(
    bytes32 requestId,
    uint256 payment,
    address callbackAddress,
    bytes4 callbackFunctionId,
    uint256 expiration,
    uint256 dataVersion
  ) internal {
    bytes31 paramsHash = _buildParamsHash(payment, callbackAddress, callbackFunctionId, expiration);
    require(s_commitments[requestId].paramsHash == paramsHash, "Params do not match request ID");
    require(s_commitments[requestId].dataVersion <= _safeCastToUint8(dataVersion), "Data versions must match");
    s_tokensInEscrow = s_tokensInEscrow.sub(payment);
    delete s_commitments[requestId];
  }

  /**
   * @notice Build the bytes31 hash from the payment, callback and expiration.
   * @param payment The payment amount that will be released for the oracle (specified in wei)
   * @param callbackAddress The callback address to call for fulfillment
   * @param callbackFunctionId The callback function ID to use for fulfillment
   * @param expiration The expiration that the node should respond by before the requester can cancel
   * @return hash bytes31
   */
  function _buildParamsHash(
    uint256 payment,
    address callbackAddress,
    bytes4 callbackFunctionId,
    uint256 expiration
  ) internal pure returns (bytes31) {
    return bytes31(keccak256(abi.encodePacked(payment, callbackAddress, callbackFunctionId, expiration)));
  }

  /**
   * @notice Safely cast uint256 to uint8
   * @param number uint256
   * @return uint8 number
   */
  function _safeCastToUint8(uint256 number) internal pure returns (uint8) {
    require(number < MAXIMUM_DATA_VERSION, "number too big to cast");
    return uint8(number);
  }

  /**
   * @notice Returns the WINK available in this contract, not locked in escrow
   * @return uint256 WINK tokens available
   */
  function _fundsAvailable() private view returns (uint256) {
    uint256 inEscrow = s_tokensInEscrow.sub(ONE_FOR_CONSISTENT_GAS_COST);
    return winkToken.balanceOf(address(this)).sub(inEscrow);
  }

  /**
   * @notice concrete implementation of AuthorizedReceiver
   * @return bool of whether sender is authorized
   */
  function _canSetAuthorizedSenders() internal view override returns (bool) {
    return isAuthorizedSender(msg.sender) || owner() == msg.sender;
  }

  function isContract(address _addr) private view returns (bool hasCode)
  {
    uint length;
    assembly { length := extcodesize(_addr) }
    return length > 0;
  }

  function onTokenTransfer(
    address sender,
    uint64 amount,
    bytes memory data
  ) public override {
    assembly {
    // solhint-disable-next-line avoid-low-level-calls
      mstore(add(data, 36), sender) // ensure correct sender is passed
    // solhint-disable-next-line avoid-low-level-calls
      mstore(add(data, 68), amount) // ensure correct amount is passed
    }
    // solhint-disable-next-line avoid-low-level-calls
    (bool success, ) = address(this).delegatecall(data); // calls oracleRequest
    require(success, "Unable to create request");
  }

  // MODIFIERS

  /**
   * @dev Reverts if the first 32 bytes of the bytes array is not equal to requestId
   * @param requestId bytes32
   * @param data bytes
   */
  modifier validateMultiWordResponseId(bytes32 requestId, bytes calldata data) {
    require(data.length >= 32, "Response must be > 32 bytes");
    bytes32 firstDataWord;
    assembly {
      firstDataWord := calldataload(data.offset)
    }
    require(requestId == firstDataWord, "First word must be requestId");
    _;
  }

  /**
   * @dev Reverts if amount requested is greater than withdrawable balance
   * @param amount The given amount to compare to `s_withdrawableTokens`
   */
  modifier validateAvailableFunds(uint256 amount) {
    require(_fundsAvailable() >= amount, "Amount requested is greater than withdrawable balance");
    _;
  }

  /**
   * @dev Reverts if request ID does not exist
   * @param requestId The given request ID to check in stored `commitments`
   */
  modifier validateRequestId(bytes32 requestId) {
    require(s_commitments[requestId].paramsHash != 0, "Must have a valid requestId");
    _;
  }

  /**
   * @dev Reverts if the callback address is the WINK token
   * @param to The callback address
   */
  modifier validateNotToWINK(address to) {
    require(to != address(winkToken), "Cannot call to WINK");
    _;
  }

  /**
   * @dev Reverts if the target address is owned by the operator
   */
  modifier validateCallbackAddress(address callbackAddress) {
    require(!s_owned[callbackAddress], "Cannot call owned contract");
    _;
  }
}
```
## 設置 AnyAPI 合約及任務

### WinkMid 合約

WINkLink 用 WIN 代幣（TRC20）作為整個生態的基礎代幣。

WINkLink 使用了 `transferAndCall` 功能，即在轉賬 `TRC20` 代幣給合約的同時調用合約的某一回調函數，該功能類似 `ERC677`，但接口參數不同。

考慮到絕大多數已發行的代幣無法再修改合約或增加接口，WINkLink 提供 WinkMid 包裝合約，可用來包裝任一 TRC20 代幣，並提供 transferAndCall 接口。


合約代碼可於 `WinkMid.sol` 查看。

為方便開發者使用，Nile 測試網部署了 WinkMid 合約，並封裝了 WIN 代幣。開發者可直接使用該合約地址，無需額外部署。Nile 測試網還提供水龍頭地址，用戶可以領取 TRX 和 WIN 測試代幣。

::: tip
**Nile 測試網**

WIN TRC20 合約地址: TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2

WinkMid 合約地址: TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro

測試網水龍頭地址: <https://nileex.io/join/getJoinPage>
:::

部署 WinkMid 合約時，開發者需在構造函數中提供被封裝的 `TRC20` 代幣地址（即 WIN 代幣地址）。

WinkMid 合約可幫助用戶進行合約調用，開發者無需直接進行調用操作。

部署 Coordinator 合約時需在構造函數中提供 WIN 代幣地址和 WinkMid 合約地址。

### Operator 合約

Operator 合約是處理來自 Consumer 合約的所有請求和 WINkLink 節點所有執行操作的主要合約，部署合約時需用對應參數。

部署 Operator 合約後，需使用 setAuthorizedSender 方法將 Oracle 添加到列表中，以授權其進行執行操作。

### Consumer 合約

以下示例包含兩種主要的 Consumer 合約類型：

- SingleWordConsumer

單次請求返回單個值

- MultiWordConsumer

單次請求返回多個值

可以根據用戶需求，使用相應參數部署任一合約。

::: warning
刪除 bytes32 的“-”和右側填充的“0”後，將 Consumer 合約中的 Spec ID 設置為對應的外部任務 ID

```
如：0x8495b310eb4a479f8982ad656521344900000000000000000000000000000000
```
:::

### 單變量請求

下面是一個請求單變量響應的 Consumer 合約示例。

該合約接收用戶輸入的 URL 以及期望的數據路徑。示例中配置的任務可檢索 TRX 的美元、歐元或新加坡元價格。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./WinklinkClient.sol";

contract SingleWordConsumer is WinklinkClient {
  using Winklink for Winklink.Request;

  bytes32 internal specId;
  bytes32 public currentPrice;

  event RequestFulfilled(
    bytes32 indexed requestId, // User-defined ID
    bytes32 indexed price
  );

  constructor(
    address _wink,
    address _winkMid,
    address _oracle,
    bytes32 _specId
  ) public {
    setWinklinkToken(_wink);
    setWinkMid(_winkMid);
    setWinklinkOracle(_oracle);
    specId = _specId;
  }

  function setSpecID(bytes32 _specId) public {
    specId = _specId;
  }

  //https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD,EUR,SGD
  function requestTRXPrice(string memory _urlPriceCompare, string memory _currency, uint64 _payment) public {
    Winklink.Request memory req = buildOperatorRequest(specId, this.fulfill.selector);
    req.add("get", _urlPriceCompare);
    string[] memory path = new string[](1);
    path[0] = _currency;
    req.addStringArray("path", path);
    // version 2
    sendWinklinkRequest(req, _payment);
  }

  function cancelRequest(
    address _oracle,
    bytes32 _requestId,
    uint64 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  ) public {
    WinklinkRequestInterface requested = WinklinkRequestInterface(_oracle);
    requested.cancelOracleRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function withdrawWink() public {
    TRC20Interface _wink = TRC20Interface(WinklinkTokenAddress());
    require(_wink.transfer(msg.sender, _wink.balanceOf(address(this))), "Unable to transfer");
  }

  function addExternalRequest(address _oracle, bytes32 _requestId) external {
    addWinklinkExternalRequest(_oracle, _requestId);
  }

  function fulfill(bytes32 _requestId, bytes32 _price) public recordWinklinkFulfillment(_requestId) {
    emit RequestFulfilled(_requestId, _price);
    currentPrice = _price;
  }
}
```

我們需在 WinkLink 節點中設置一個特定任務來處理和完成所需工作。

```json
type = "directrequest"
schemaVersion = 1
name = "DR: SingleWordRequest"
externalJobID = "8495b310-eb4a-479f-8982-ad6565213449"
forwardingAllowed = false
maxTaskDuration = "0s"
contractAddress = "0x51d389Ce2ba948C9c2fc382Efc910B5776D50E4b"
tvmChainID = "2"
minContractPaymentWin = "5"
requesters = [ "0xcFbe00786F9dC12d5985f1cD64657384F6065CD2" ]
fromAddress = "0x40544c785F4127f39c9Ad3321BE4f439eE8bd73C"
observationSource = """
    decode_log     [type=tvmabidecodelog abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)" data="$(jobRun.logData)" topics="$(jobRun.logTopics)"]
    decode_cbor    [type=cborparse data="$(decode_log.data)"]
    ds1                     [type=http method=GET url="$(decode_cbor.get)" allowunrestrictednetworkaccess="true"]
    ds1_parse         [type=jsonparse path="$(decode_cbor.path)"]
    ds1_multiply     [type=multiply value="$(ds1_parse)" times=100]
    encode_data    [type=tvmabiencode abi="(uint256 value)" data=<{"value": $(ds1_multiply)}>]
    encode_tx        [type=tvmabiencode abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)" data=<{"requestId": $(decode_log.requestId), "payment": $(decode_log.payment), "callbackAddress": $(decode_log.callbackAddr), "callbackFunctionId": $(decode_log.callbackFunctionId), "expiration": $(decode_log.cancelExpiration), "data": $(encode_data)}>]
   submit [type=tvmcall contract="THRs9Y3vqE4FMTE7LPjMB4LFEH8uUsZaE4" method="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)" data="$(encode_tx)" extractRevertReason=true]

decode_log->decode_cbor->ds1 -> ds1_parse -> ds1_multiply->encode_data->encode_tx->submit
"""
```

單變量任務規範有如下功能：

1. 解碼鏈上獲取的事件消息

2. 用指定 URL 執行 http 操作

3. 用提供的路徑從指定路徑檢索數據

4. 進行所需的數據變換

5. 將編碼的數據作為響應並提交給Operator

Operator 合約將接收響應並將其轉發回 Consumer 合約。

### 多變量請求

下面是一個多變量請求的 Consumer 合約示例。

該合約接收用戶輸入的 URL 以及所有期望的數據路徑。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./WinklinkClient.sol";

contract MultiWordConsumer is WinklinkClient {
  using Winklink for Winklink.Request;

  bytes32 internal specId;
  uint256 public currentUSDPriceInt;
  uint256 public currentEURPriceInt;
  uint256 public currentJPYPriceInt;

  event RequestFulfilled2(
    bytes32 indexed requestId,
    bytes32 usd,
    bytes32 eur,
    bytes32 jpy
  );

  constructor(
    address _wink,
    address _winkMid,
    address _oracle,
    bytes32 _specId
  ) public {
    setWinklinkToken(_wink);
    setWinkMid(_winkMid);
    setWinklinkOracle(_oracle);
    specId = _specId;
  }

  function setSpecID(bytes32 _specId) public {
    specId = _specId;
  }

  //https://min-api.cryptocompare.com/data/price?fsym=TRX&tsyms=USD,EUR,JPY
  function requestMultipleParametersWithCustomURLs(
    string memory _urlPriceCompare,
    string memory _pathUSD,
    string memory _pathEUR,
    string memory _pathJPY,
    uint64 _payment
  ) public {
    Winklink.Request memory req = buildOperatorRequest(specId, this.fulfillParametersWithCustomURLs.selector);
    req.add("urlPriceCompare", _urlPriceCompare);
    req.add("pathUSD", _pathUSD);
    req.add("pathEUR", _pathEUR);
    req.add("pathJPY", _pathJPY);
    sendWinklinkRequest(req, _payment);
  }

  function cancelRequest(
    address _oracle,
    bytes32 _requestId,
    uint64 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  ) public {
    WinklinkRequestInterface requested = WinklinkRequestInterface(_oracle);
    requested.cancelOracleRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function withdrawWink() public {
    TRC20Interface _wink = TRC20Interface(WinklinkTokenAddress());
    require(_wink.transfer(msg.sender, _wink.balanceOf(address(this))), "Unable to transfer");
  }

  function addExternalRequest(address _oracle, bytes32 _requestId) external {
    addWinklinkExternalRequest(_oracle, _requestId);
  }

  function fulfillParametersWithCustomURLs(bytes32 _requestId, uint256 _usd, uint256 _eur, uint _jpy)
  public
  recordWinklinkFulfillment(_requestId)
  {
    emit RequestFulfilled2(_requestId, bytes32(_usd), bytes32(_eur), bytes32(_jpy));
    currentUSDPriceInt = _usd;
    currentEURPriceInt = _eur;
    currentJPYPriceInt = _jpy;
  }
}
```

我們在節點中添加任務規範來支持獲取所有數據和相應的數據變換。

```json
type = "directrequest"
schemaVersion = 1
name = "DR: MultiWordRequest"
externalJobID = "11453105-98fc-4c25-b825-f4dae83e921e"
forwardingAllowed = false
maxTaskDuration = "0s"
contractAddress = "0x51d389Ce2ba948C9c2fc382Efc910B5776D50E4b"
tvmChainID = "2"
minContractPaymentWin = "1"
requesters = [ "0xcFbe00786F9dC12d5985f1cD64657384F6065CD2" ]
fromAddress = "0x40544c785F4127f39c9Ad3321BE4f439eE8bd73C"
observationSource = """
     decode_log  [type=tvmabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]
    decode_cbor  [type=cborparse data="$(decode_log.data)"]

    decode_log -> decode_cbor

    decode_cbor -> usd
    decode_cbor -> eur
    decode_cbor -> jpy

    usd           [type=http method=GET url="$(decode_cbor.urlPriceCompare)" allowunrestrictednetworkaccess="true"]
    usd_parse     [type=jsonparse path="$(decode_cbor.pathUSD)"]
    usd_multiply  [type=multiply value="$(usd_parse)", times="100"]
    usd -> usd_parse -> usd_multiply

    eur            [type=http method=GET url="$(decode_cbor.urlPriceCompare)" allowunrestrictednetworkaccess="true"]
    eur_parse      [type=jsonparse path="$(decode_cbor.pathEUR)"]
    eur_multiply   [type=multiply value="$(eur_parse)", times="100"]
    eur -> eur_parse -> eur_multiply

    jpy            [type=http method=GET url="$(decode_cbor.urlPriceCompare)" allowunrestrictednetworkaccess="true"]
    jpy_parse      [type=jsonparse path="$(decode_cbor.pathJPY)"]
    jpy_multiply   [type=multiply value="$(jpy_parse)", times="100000"]
    jpy -> jpy_parse -> jpy_multiply

    usd_multiply -> encode_mwr
    eur_multiply -> encode_mwr
    jpy_multiply -> encode_mwr

    encode_mwr [type=tvmabiencode
                abi="(bytes32 requestId, uint256 usd, uint256 eur, uint256 jpy)"
                data=<{
                    "requestId": $(decode_log.requestId),
                    "usd": $(usd_multiply),
                    "eur": $(eur_multiply),
                    "jpy": $(jpy_multiply)}>]
    encode_tx  [type=tvmabiencode
                abi="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes calldata data)"
                data=<{"requestId": $(decode_log.requestId),
                       "payment":   $(decode_log.payment),
                       "callbackAddress": $(decode_log.callbackAddr),
                       "callbackFunctionId": $(decode_log.callbackFunctionId),
                       "expiration": $(decode_log.cancelExpiration),
                       "data": $(encode_mwr)}>]
    submit_tx  [type=tvmcall contract ="THRs9Y3vqE4FMTE7LPjMB4LFEH8uUsZaE4" data="$(encode_tx)"  method="fulfillOracleRequest2(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes data)" extractRevertReason=true]

    encode_mwr -> encode_tx -> submit_tx
"""
```

多變量任務規範有如下功能：

1. 解碼鏈上獲取的事件消息

2. 用指定 URL 執行 http 操作

***
3. 用提供的路徑從指定路徑檢索數據

4. 進行所需的數據變換

根據需要獲取的數據量，重復進行步驟 3 和步驟 4。
***

5. 將編碼的數據作為響應並提交給Operator

除步驟 3 和步驟 4 需要對所有數據進行檢索和變換外，此任務規範與上述單變量請求基本一樣。

## 內部適配器

本節展示了可用的內部適配器，可用於制定任務規範以獲取所需數據。

| 任務                 | 描述              | 輸入類型                                                                                                                            | 輸出類型                                                                                                                                      |
|:-------------------|:----------------|:--------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| tvm abi decode log | 解碼鏈上檢索的事件       | []byte                                                                                                                          | map[string]                                                                                                                                      |
| tvm call           | 在 TVM 鏈上調用合約    | []byte                                                                                                                          | Contract call [`Return`](https://github.com/tron-oracle/winklink-2.0/blob/develop/core/chains/tvm/tron-sdk/proto/api/api.pb.go#L214-L222) struct |
| hex decode         | 將十六進制解碼為字符串     | string                                                                                                                          | string                                                                                                                                           |
| hex encode         | 將字符串編碼為十六進制     | string/[]byte/decimal/big.Int                                                                                                   | string                                                                                                                                           |
| base64 decode      | 將字符串解碼為 Base64  | string                                                                                                                          | []byte                                                                                                                                           |
| base64 encode      | 將 Base64 編碼為字符串 | string/[]byte                                                                                                                   | string                                                                                                                                           |
| http               | 發起 HTTP 調用      | string (method)<br/>url (url)<br/>map[string] (requestData)<br/>bool (allowUnrestrictedNetworkAccess)<br/>[]string (reqHeaders) | string                                                                                                                                           |
| json parse         | 從 JSON 獲取值      | string (Path)<br/>string (Separator)<br/>string (Data)                                                                          | map[string]interface{}/[]interface{}                                                                                                             |
| length             | 獲取字符串長度         | string                                                                                                                          | decimal                                                                                                                                          |
| less than          | 檢查輸入值是否小於限制值    | string (input)<br/>string (limit)                                                                                               | bool                                                                                                                                             |
| lower case         | 將字符串轉為小寫        | string                                                                                                                          | string                                                                                                                                           |
| upper case         | 將字符串轉為大寫        | string                                                                                                                          | string                                                                                                                                           |
| any                | 從輸入值獲取任意值       | decimal/string                                                                                                                  | string                                                                                                                                           |
| mean               | 根據輸入值獲取均值       | string (Values)<br/>string (AllowedFaults)<br/>string (Precision)                                                               | decimal                                                                                                                                          |
| median             | 根據輸入值獲取中位數      | string (Values)<br/>string (AllowedFaults)                                                                                      | decimal                                                                                                                                          |
| memo               | 返回輸入值           | string                                                                                                                          | string                                                                                                                                           |
| merge              | 合並兩個字符串輸入值      | string (left)<br/>string (right)                                                                                                | map[string]interface{}                                                                                                                           |
| multiply           | 兩個輸入值相乘         | string (Input)<br/>string (Times)                                                                                               | decimal                                                                                                                                          |
| divide             | 輸入值除以除數         | string (Input)<br/>string (Divisor)<br/>string (Precision)                                                                      | decimal                                                                                                                                          |
| sum                | 兩個輸入值相加         | string (Values)<br/>string (AllowedFaults)                                                                                      | decimal                                                                                                                                          |
| cbor parse         | Cbor 解碼輸入值      | string (Data)<br/>string (Mode)                                                                                                 | interface{}                                                                                                                                      |