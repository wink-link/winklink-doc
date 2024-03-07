# WINkLink AnyAPI 服务

## 概览

AnyAPI 服务提供一系列内部适配器，让用户可以借助 WINkLink 节点的强大功能生成自定义数据。

该服务能够帮助开发者从链下渠道获取数据，进行必要的数据变换后将其喂到链上。这些数据可以是航司抵达/起飞时刻表、体育赛事的结果、交通状况等等。

![anyapi-flow.png](~@source/images/anyapi-flow.png)

WINkLink AnyAPI 解决方案由链上和链下两部分组成：

- AnyAPI Consumer（链上组件）：用于同 AnyApi Operator 合约交互。用户需向该合约充值 Wink 代币以发起请求。
- AnyAPI Operator（链上组件）：用于处理 Consumer 合约发起的所有 AnyAPI 请求的合约，它会在用户发起请求时发布一个事件，并把结果转发给 Consumer 合约。
- AnyAPI 服务（链下节点）：通过订阅 AnyAPI Operator 事件日志监听请求，并执行指定操作以获取自定义数据。服务将根据请求中指定的外部任务 ID 触发对应的任务。

### 合约

Nile 环境中（测试环境）部署了一组用于测试的合约。

| 项目                | 数值                                                              |
|:--------------------|:-------------------------------------------------------------------|
| WIN Token           | TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2                                 |
| WinkMid             | TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro                                 |
| Operator            | THRs9Y3vqE4FMTE7LPjMB4LFEH8uUsZaE4                                 |
| SingleWordConsumer  | TP3yr6MYDTDsta9JchahunXk1vvKkw87LS                                 |
| MultiWordConsumer   | TNCqRNxC3epb6KAiVyUvfFHJEkN2miTTb1                                 |
| Single Word Spec ID | 0x8495b310eb4a479f8982ad656521344900000000000000000000000000000000 |
| Multi Word Spec ID  | 0x1145310598fc4c25b825f4dae83e921e00000000000000000000000000000000 |

## 使用现有的 WINkLink AnyAPI

::: warning
当前部署的 Consumer 合约和任务仅为示例，用于学习和测试。建议用户自主设定任务规范，创建专属的 Consumer 合约。
:::

### AnyAPI 请求步骤

1. Dapp/Consumer 合约发起单变量/多变量请求，对应不同的外部任务 ID。

2. Dapp 合约调用 WinkMid transferAndCall 函数向 Operator 支付请求所需的费用。这一方法将发送 Wink 代币并执行 onTokenTransfer。

3. Operator 中的 onTokenTransfer 逻辑将触发预言机请求方法并发布 OracleRequest 事件。

4. 订阅该链的 AnyAPI 节点在收到事件后根据所含的外部任务 ID 进行处理。

5. Operator 合约收到节点的回调函数后将结果返回给 Dapp/Consumer 合约。

使用 WINkLink Operator 合约和节点前，用户需创建自己的 Consumer 合约和任务规范，并向合约内充值以发起请求。

## 启动 AnyAPI 服务节点

### 入门指南

WINkLink 的维护者需要对波场 TRON 有一定的了解，且熟悉智能合约的部署和调用流程。建议阅读波场相关的官方文档，特别是 TronIDE 上进行合约部署的相关文章。

准备节点账户，建议阅读节点账户准备相关的文档。

### 所需环境

WINkLink 节点依赖 PostgreSQL 数据库，开发者可在 [postgresql 官网的官方文档](https://www.postgresql.org)中获取更多信息。

::: tip
这里假定本机部署的 PostgreSQL 实例的用户名和密码分别是 root:root。在生产环境中请使用强密码或其他验证方式。
:::

WINkLink 节点使用的编程语言为 Go，因此需要搭建 Golang 环境。

### 节点配置

WINkLink 节点的配置文件格式为 TOML，主配置为 tools/config/config.toml。你可以使用 secrets.toml 指定要使用的 db 实例。以下为参考模板。

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
节点配置文件确认完毕后，还需要创建 `apicredentials` 文件和 `password`，然后写入用户 ID 和密码访问节点 API：

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
请妥善托管您的个人信息。
:::

### 搭建节点 Docker 镜像

使用以下指令构建标准的 Linux 镜像：

```
# build a docker image
docker buildx build --platform linux/amd64 -t winklink-2.0 -f core/winklink.Dockerfile .
```

将构建好的 Docker 镜像打上标签并推送到所需的存储库进行部署。

### 用源代码启动节点

安装 [go1.20](https://go.dev/dl/)

前往 winklink-2.0 源代码的基本目录

搭建命令行界面

```
make install
```

使用以下指令及对应配置项启动 WINkLink 节点：

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/password -a /tools/secrets/apicredentials
```

::: warning
节点帐号必须有足够的 TRX 代币，用于合约调用。可以通过测试网水龙头申请测试代币。
:::

### Operator 合约

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
## 设置 AnyAPI 合约及任务

### WinkMid 合约

WINkLink 用 WIN 代币（TRC20）作为整个生态的基础代币

WINkLink 使用了 `transferAndCall` 功能，即在转账 `TRC20` 代币给合约的同时调用合约的某一回调函数，该功能类似 `ERC677`，但接口参数不同。

考虑到绝大多数已发行的代币无法再修改合约或增加接口，WINkLink 提供 WinkMid 包装合约，可用来包装任一 TRC20 代币，并提供 transferAndCall 接口。

合约代码可于 `WinkMid.sol` 查看。

为方便开发者使用，Nile 测试网部署了 WinkMid 合约，并封装了 WIN 代币。开发者可直接使用该合约地址，无需额外部署。Nile 测试网还提供水龙头地址，用户可以领取 TRX 和 WIN 测试代币。

::: tip
**Nile 测试网**

WIN TRC20 合约地址: TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2

WinkMid 合约地址: TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro

测试网水龙头地址: <https://nileex.io/join/getJoinPage>
:::

部署 WinkMid 合约时，开发者需在构造函数中提供被封装的 `TRC20` 代币地址（即 WIN 代币地址）。

WinkMid 合约可帮助用户进行合约调用，开发者无需直接进行调用操作。

部署 Coordinator 合约时需在构造函数中提供 WIN 代币地址和 WinkMid 合约地址。

### Operator 合约

Operator 合约是处理来自 Consumer 合约的所有请求和 WINkLink 节点所有执行操作的主要合约，部署合约时需用对应参数。

部署 Operator 合约后，需使用 setAuthorizedSender 方法将 Oracle 添加到列表中，以授权其进行执行操作。

### Consumer 合约

以下示例包含两种主要的 Consumer 合约类型：

- SingleWordConsumer

单次请求返回单个值。

- MultiWordConsumer

单次请求返回多个值。

可以根据用户需求，使用相应参数部署任一合约。

::: warning
删除 bytes32 的“-”和右侧填充的“0”后，将 Consumer 合约中的 Spec ID 设置为对应的外部任务 ID

```
如：0x8495b310eb4a479f8982ad656521344900000000000000000000000000000000
```
:::

### 单变量请求

下面是一个请求单变量响应的 Consumer 合约示例。

该合约接收用户输入的 URL 以及期望的数据路径。示例中配置的任务可检索 TRX 的美元、欧元或新加坡元价格。

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

我们需在 WinkLink 节点中设置一个特定任务来处理和完成所需工作。

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

单变量任务规范有如下功能：
1. 解码链上获取的事件消息 
2. 用指定 URL 执行 http 操作 
3. 用提供的路径从指定路径检索数据 
4. 进行所需的数据变换 
5. 将编码的数据作为响应并提交给Operator

Operator 合约将接收响应并将其转发回 Consumer 合约。

### 多变量请求

下面是一个多变量请求的 Consumer 合约示例。

该合约接收用户输入的 URL 以及所有期望的数据路径。

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

我们在节点中添加任务规范来支持获取所有数据和相应的数据变换。

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

多变量任务规范有如下功能：
1. 解码链上获取的事件消息 
2. 用指定 URL 执行 http 操作
***
3. 用提供的路径从指定路径检索数据 
4. 进行所需的数据变换

根据需要获取的数据量，重复进行步骤 3 和步骤 4。
***
5. 将编码的数据作为响应并提交给Operator。

除步骤 3 和步骤 4 需要对所有数据进行检索和变换外，此任务规范与上述单变量请求基本一样。

## 内部适配器

本节展示了可用的内部适配器，可用于制定任务规范以获取所需数据。

| 任务                 | 描述              | 输入类型                                                                                                                            | 输出类型                                                                                                                                             |
|:-------------------|:----------------|:--------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| tvm abi decode log | 解码链上检索的事件       | []byte                                                                                                                          | map[string]                                                                                                                                      |
| tvm call           | 在 TVM 链上调用合约    | []byte                                                                                                                          | Contract call [`Return`](https://github.com/tron-oracle/winklink-2.0/blob/develop/core/chains/tvm/tron-sdk/proto/api/api.pb.go#L214-L222) struct |
| hex decode         | 将十六进制解码为字符串     | string                                                                                                                          | string                                                                                                                                           |
| hex encode         | 将字符串编码为十六进制     | string/[]byte/decimal/big.Int                                                                                                   | string                                                                                                                                           |
| base64 decode      | 将字符串解码为 Base64  | string                                                                                                                          | []byte                                                                                                                                           |
| base64 encode      | 将 Base64 编码为字符串 | string/[]byte                                                                                                                   | string                                                                                                                                           |
| http               | 发起 HTTP 调用      | string (method)<br/>url (url)<br/>map[string] (requestData)<br/>bool (allowUnrestrictedNetworkAccess)<br/>[]string (reqHeaders) | string                                                                                                                                           |
| json parse         | 从 JSON 获取值      | string (Path)<br/>string (Separator)<br/>string (Data)                                                                          | map[string]interface{}/[]interface{}                                                                                                             |
| length             | 获取字符串长度         | string                                                                                                                          | decimal                                                                                                                                          |
| less than          | 检查输入值是否小于限制值    | string (input)<br/>string (limit)                                                                                               | bool                                                                                                                                             |
| lower case         | 将字符串转为小写        | string                                                                                                                          | string                                                                                                                                           |
| upper case         | 将字符串转为大写        | string                                                                                                                          | string                                                                                                                                           |
| any                | 从输入值获取任意值       | decimal/string                                                                                                                  | string                                                                                                                                           |
| mean               | 根据输入值获取均值       | string (Values)<br/>string (AllowedFaults)<br/>string (Precision)                                                               | decimal                                                                                                                                          |
| median             | 根据输入值获取中位数      | string (Values)<br/>string (AllowedFaults)                                                                                      | decimal                                                                                                                                          |
| memo               | 返回输入值           | string                                                                                                                          | string                                                                                                                                           |
| merge              | 合并两个字符串输入值      | string (left)<br/>string (right)                                                                                                | map[string]interface{}                                                                                                                           |
| multiply           | 两个输入值相乘         | string (Input)<br/>string (Times)                                                                                               | decimal                                                                                                                                          |
| divide             | 输入值除以除数         | string (Input)<br/>string (Divisor)<br/>string (Precision)                                                                      | decimal                                                                                                                                          |
| sum                | 两个输入值相加         | string (Values)<br/>string (AllowedFaults)                                                                                      | decimal                                                                                                                                          |
| cbor parse         | Cbor 解码输入值      | string (Data)<br/>string (Mode)                                                                                                 | interface{}                                                                                                                                      |