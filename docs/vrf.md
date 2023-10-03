# WINkLink 随机数服务

## 介绍
VRF（Verifiable Random Function)，即可验证的随机函数，其可生成安全可靠的随机数。
随机数由用户提供的seed、nonce(VRFCoordinator合约的私有状态)、请求所在区块hash 和 随机数生成节点的私钥共同决定，随机数节点不可作弊。且该随机数在返回给用户Dapp之前经过了验证，从而保证了该随机数的安全性。

随机数生成流程如下：
- 由用户合约在链上发出生成随机数的请求；
- 节点监听到该请求后，会在链下生成随机数和证明，然后在链上合约中响应； 
- 链上合约对生成的随机数进行验证并通过后，以回调函数反馈到用户Dapp。

它可以用于任何需要可靠随机数的应用程序：
- 区块链游戏和NFTs
- 职责和资源的随机分配（例如随机分配法官审理案件）
- 为共识机制选择代表性样本

WINkLink VRF解决方案包含了以下链上和链下的组件：

- VRF Coordinator（链上合约）：用于与VRF服务进行交互的合约。当发出随机数请求时，它会触发一个事件，然后通过VRF服务验证随机数以及关于其生成方式的证明。
- VRF Wrapper（链上合约）：封装了VRF Coordinator，提供了接口以便用户Dapp调用。
- VRF 服务（链下节点）：此链下组件通过订阅VRFCoordinator事件日志来监听随机数请求，并基于区块hash和随机数生成一个随机数，然后向VRFCoordinator发起一个交易，其中包括随机数和关于其生成方式的证明

本文介绍如何部署和使用VRF合约。

## VRF请求流程
1. Dapp合约调用`VRFV2Wrapper`的`calculateRequestPrice`函数来估算完成随机数生成所需的总交易成本

2. Dapp合约调用`WinkMid`的`transferAndCall`函数，以支付Wrapper所计算的请求价格。该方法发送Wink代币，并执行`VRFV2Wrapper`的`onTokenTransfer`逻辑。

3. `VRFV2Wrapper`的`onTokenTransfer`逻辑触发`VRFCoordinatorV2`的`requestRandomWords`函数以请求随机数。

4. `VRFCoordinatorV2`合约emit`RandomWordsRequested`事件。

5. VRF节点捕捉该事件，并等待指定数量的区块确认，然后把随机值和证明通过函数`fulfillRandomWords`返回`VRFCoordinatorV2`合约。

6. `VRFCoordinatorV2`在链上验证证明，然后回调`VRFV2Wrapper`的`fulfillRandomWords`函数。

7. 最后，`VRFV2Wrapper`回调Dapp合约完成请求。

## 准备工作

WINkLink 的维护者需要对 TRON 有一定的了解，熟悉智能合约部署和调用流程。
建议参考 [官方文档](https://cn.developers.tron.network/) 。

完成节点账号申请,建议参考[节点账号准备文档](https://doc.winklink.org/v1/doc/deploy.html#%E5%87%86%E5%A4%87%E8%8A%82%E7%82%B9%E5%B8%90%E5%8F%B7) 。

## VRFCoordinatorV2 合约

VRFCoordinatorV2 合约是部署在 TRON 公链上的预言机合约。主要功能如下

- 接收消费者合约(Consumer Contract)的数据请求，触发 Event Log
    - 数据请求发送时会附带 WIN 转账作为使用费用
- 接受 WINkLink 节点所提交的随机数和证明  
    - VRFCoordinator收到合约后会对随机数进行验证
- 对数据请求的 WIN 代币费用进行结算，提取收益


<!-- 合约代码位于 [VRFCoordinator.sol](https://github.com/wink-link/winklink/tree/master/tvm-contracts/v1.0/VRF/VRFCoordinator.sol) 。-->


部署 VRFCoordinatorV2 合约时需要在构造函数提供相关参数：
```js
  constructor(
    address wink,
    address blockhashStore,
    address winkMid
  )
```
`_blockHashStore` 为BlockHashStore合约地址，`_win` 为WIN代币地址, `_winkMid` 为WinkMid合约地址。


<!--
为方便开发者, Nile 测试网已经部署了 `WinkMid` 合约，封装了 Nile 测试网 `WIN` 代币。
开发者可直接使用该合约地址，无需额外部署。 Nile 测试网同时提供了水龙头地址可以领取测试 TRX 和 WIN 代币。

::: tip Nile 测试网

- WIN 代币合约地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合约地址: `TJpkay8rJXUWhvS2uL5AmMwFspQdHCX1rw`
- BlockHashStore 合约地址: `TBpTbK9KQzagrN7eMKFr5QM2pgZf6FN7KA`
- 测试网水龙头: <https://nileex.io/join/getJoinPage>
  :::
  -->

## VRFV2Wrapper 合约
VRFV2Wrapper封装了与VRFCoordinatorV2的交互，作为dapp与VRFCoordinatorV2的中间层,供Dapp直接调用。


**配置参数**\
`keyHash` : 节点keyhash\
`maxNumWords` : 单次请求词数限制，当前设置为10


<!--## 节点部署

节点部署部分可以参考[WINkLink](https://doc.winklink.org/v1/doc/deploy.html#%E8%8A%82%E7%82%B9%E9%83%A8%E7%BD%B2) ，本部分仅列出VRF节点部署的不同之处。

VRFCoordinator 合约部署完毕后，就可以开始 WINkLink 节点部署。

WINkLink 节点代码位于: <https://github.com/wink-link/winklink/tree/master/node>，
编译完成后 node-v1.0.jar 位于项目源码目录下的 node/build/libs/ 中

###节点配置

节点配置文件确认完毕后，还需要创建 `vrfKeyStore.yml` 文件, 写入用于生成VRF的私钥(支持添加多个VRF私钥):

```text
privateKeys:
  - *****(32字节 hex 编码私钥)
```

支持在无需重启节点server的情况下，动态更新vrfKeyStore，步骤如下：
首先在`vrfKeyStore.yml` 文件中添加新的VRF私钥
然后执行如下指令：
```sh
curl --location --request GET 'http://localhost:8081/vrf/updateVRFKey/vrfKeyStore.yml'
```

::: tip
通过文件而非命令行参数提供私密信息是重要的安全性考虑，在生产环境需要设定私密文件 `vrfKeyStore.yml` 权限为 600,
即只有拥有者可读写。
:::

### 启动节点

所有配置文件都需要被复制到节点程序当前运行时目录，即 `cp node/src/main/resource/*.yml ./`，同时application-dev文件中的 `tronApiKey` 部分需要填充apikey.

使用如下命令启动 WINkLink 节点程序：

```sh
java -jar node/build/libs/node-v1.0.jar -k key.store -vrfK vrfKeyStore.yml
```

具体的配置项目也可以通过命令行指定，例如：

主网:
```sh
java -jar node/build/libs/node-v1.0.jar --server.port=8081 --spring.profiles.active=dev --key key.store  --vrfKey vrfKeyStore.yml
```
nile测试网:
```sh
java -jar node/build/libs/node-v1.0.jar --env dev --server.port=8081 --spring.profiles.active=dev --key key.store  --vrfKey vrfKeyStore.yml
```

使用如下命令判断 WINkLink 节点是否正常运行：

```sh
tail -f logs/tron.log
```

::: warning 注意
节点帐号必须有足够的 TRX 代币，用于合约调用。可以通过测试网水龙头地址申请。
:::
### 为节点添加 job
节点的 job 代表了节点所支持的数据服务, job ID 通过一个 32 字节唯一标识。

WINkLink 节点正常运行后，就可以通过 HTTP API 为节点添加 job:

示例：(修改下面代码中 `address` 参数为上述步骤中部署的 VRFCoordinator 合约地址；`publicKey` 参数为节点公钥的压缩值，该值可通过查看节点运行后的终端显示获得,对应项为`ecKey compressed`)

```sh
curl --location --request POST 'http://localhost:8081/job/specs' \
  --header 'Content-Type: application/json' \
    --data-raw '{
    "initiators": [
        {
        "type": "randomnesslog",
        "params": {
            "address": "TYmwSFuFuiDZCtYsRFKCNr25byeqHH7Esb"
        }
        }
    ],
    "tasks": [
        {
        "type": "random",
        "params": {
        "publicKey":"0x024e6bda4373bea59ec613b8721bcbb56222ab2ec10b18ba24ae369b7b74ab1452"
        }
        },
        {
        "type": "trontx",
        "params": {
            "type": "TronVRF"
        }
	}
    ]
    }'
```

### 查询节点 job

请求示例：

```sh
curl --location --request GET 'http://localhost:8081/job/specs'
```
-->
## 为节点账户授权

节点账户需要授权才能向 VRFCoordinatorV2 合约提交数据，否则会报错 。

需要使用 VRFCoordinatorV2 合约的 owner 执行如下合约调用，将节点账户添加到白名单:

```js
  function registerProvingKey(address oracle, uint256[2] calldata publicProvingKey) external onlyOwner
```

其中`_oracle` 为注册节点的地址,用于接收Dapp应用对其支付的WIN代币，`_publicProvingKey` 为注册节点用于生成随机数的公钥。

示例调用例如 `registerProvingKey(TYmwSFuFuiDZCtYsRFKCNr25byeqHH7Esb,['6273228386041830135141271310112248407537170435188969735053134748570771583756',67273502359025519559461602732298865784327759914690240925031700564257821594585'])`。

## Dapp合约

当编写新的Dapp合约时，需遵循以下规则：
- a) 引入VRFV2WrapperConsumerBase.sol
```js
// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity ^0.8.7;

import "./VRFV2WrapperConsumerBase.sol";

contract VRFv2DirectFundingConsumer is VRFV2WrapperConsumerBase{}
```

- b) 合约需实现vrf回调函数`fulfillRandomWords`，在这里你可以编写获取随机数结果后的业务处理逻辑.
```js
 function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    )
```

- c) 调用`requestRandomness`发起vrf请求。
```js
 function requestRandomWords()
    external
    onlyOwner
    returns (uint256 requestId)
    {
        requestId = requestRandomness(
            msg.sender,
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit, numWords),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }
```


**示例Dapp合约**

部署实例合约VRFv2DirectFundingConsumer.sol。

构造函数参数：\
`_winkAddress`：wink代币合约地址
`_winkMid`： winkMid合约地址
`_wrapper`：VRFV2Wrapper合约地址
`_numWords`： 单次请求随机词数量

```js
// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity ^0.8.7;

import "./ConfirmedOwner.sol";
import "./VRFV2WrapperConsumerBase.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract VRFv2DirectFundingConsumer is
VRFV2WrapperConsumerBase,
        ConfirmedOwner
{
  address winkAddress;

  event RequestSent(uint256 requestId, uint32 numWords);
  event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
);

  struct RequestStatus {
  uint256 paid; // amount paid in wink
  bool fulfilled; // whether the request has been successfully fulfilled
  uint256[] randomWords;
}
  mapping(uint256 => RequestStatus)
  public s_requests; /* requestId --> requestStatus */

  // past requests Id.
  uint256[] public requestIds;
  uint256 public lastRequestId;

  // Depends on the number of requested values that you want sent to the
  // fulfillRandomWords() function. Test and adjust
  // this limit based on the network that you select, the size of the request,
  // and the processing of the callback request in the fulfillRandomWords()
  // function.
  uint32 callbackGasLimit = 0;

  // The default is 3, but you can set this higher.
  uint16 requestConfirmations = 3;

  // For this example, retrieve 2 random values in one request.
  // Cannot exceed VRFV2Wrapper.getConfig().maxNumWords.
  uint32 numWords;

  constructor(
          address _winkAddress,
        address _winkMid,
        address _wrapper,
        uint32 _numWords
)
  ConfirmedOwner(msg.sender)
  VRFV2WrapperConsumerBase(_winkAddress, _winkMid, _wrapper) {
  winkAddress = _winkAddress;
  numWords = _numWords;
}

  function requestRandomWords()
  external
  onlyOwner
  returns (uint256 requestId)
  {
    requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
    );
    s_requests[requestId] = RequestStatus({
      paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit, numWords),
      randomWords: new uint256[](0),
      fulfilled: false
    });
    requestIds.push(requestId);
    lastRequestId = requestId;
    emit RequestSent(requestId, numWords);
    return requestId;
  }

  function fulfillRandomWords(
          uint256 _requestId,
        uint256[] memory _randomWords
) internal override {
  require(s_requests[_requestId].paid > 0, "request not found");
  s_requests[_requestId].fulfilled = true;
  s_requests[_requestId].randomWords = _randomWords;
  emit RequestFulfilled(
          _requestId,
          _randomWords,
          s_requests[_requestId].paid
  );
}

  function getRequestStatus(
          uint256 _requestId
)
  external
  view
  returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
  {
    require(s_requests[_requestId].paid > 0, "request not found");
    RequestStatus memory request = s_requests[_requestId];
    return (request.paid, request.fulfilled, request.randomWords);
  }
}
```
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ConfirmedOwnerWithProposal.sol";

/**
 * @title The ConfirmedOwner contract
 * @notice A contract with helpers for basic contract ownership.
 */
contract ConfirmedOwner is ConfirmedOwnerWithProposal {
  constructor(address newOwner) ConfirmedOwnerWithProposal(newOwner, address(0)) {}
}
```

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OwnableInterface.sol";

/**
 * @title The ConfirmedOwner contract
 * @notice A contract with helpers for basic contract ownership.
 */
contract ConfirmedOwnerWithProposal is OwnableInterface {
  address private s_owner;
  address private s_pendingOwner;

  event OwnershipTransferRequested(address indexed from, address indexed to);
  event OwnershipTransferred(address indexed from, address indexed to);

  constructor(address newOwner, address pendingOwner) {
    require(newOwner != address(0), "Cannot set owner to zero");

    s_owner = newOwner;
    if (pendingOwner != address(0)) {
      _transferOwnership(pendingOwner);
    }
  }

  /**
   * @notice Allows an owner to begin transferring ownership to a new address,
   * pending.
   */
  function transferOwnership(address to) public override onlyOwner {
    _transferOwnership(to);
  }

  /**
   * @notice Allows an ownership transfer to be completed by the recipient.
   */
  function acceptOwnership() external override {
    require(msg.sender == s_pendingOwner, "Must be proposed owner");

    address oldOwner = s_owner;
    s_owner = msg.sender;
    s_pendingOwner = address(0);

    emit OwnershipTransferred(oldOwner, msg.sender);
  }

  /**
   * @notice Get the current owner
   */
  function owner() public view override returns (address) {
    return s_owner;
  }

  /**
   * @notice validate, transfer ownership, and emit relevant events
   */
  function _transferOwnership(address to) private {
    require(to != msg.sender, "Cannot transfer to self");

    s_pendingOwner = to;

    emit OwnershipTransferRequested(s_owner, to);
  }

  /**
   * @notice validate access
   */
  function _validateOwnership() internal view {
    require(msg.sender == s_owner, "Only callable by owner");
  }

  /**
   * @notice Reverts if called by anyone other than the contract owner.
   */
  modifier onlyOwner() {
    _validateOwnership();
    _;
  }
}
```

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}
```

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TRC20Interface.sol";
import "./VRFV2WrapperInterface.sol";

/** *******************************************************************************
 * @notice Interface for contracts using VRF randomness through the VRF V2 wrapper
 * ********************************************************************************
 * @dev PURPOSE
 *
 * @dev Create VRF V2 requests without the need for subscription management. Rather than creating
 * @dev and funding a VRF V2 subscription, a user can use this wrapper to create one off requests,
 * @dev paying up front rather than at fulfillment.
 *
 * @dev Since the price is determined using the gas price of the request transaction rather than
 * @dev the fulfillment transaction, the wrapper charges an additional premium on callback gas
 * @dev usage, in addition to some extra overhead costs associated with the VRFV2Wrapper contract.
 * *****************************************************************************
 * @dev USAGE
 *
 * @dev Calling contracts must inherit from VRFV2WrapperConsumerBase. The consumer must be funded
 * @dev with enough WINK to make the request, otherwise requests will revert. To request randomness,
 * @dev call the 'requestRandomness' function with the desired VRF parameters. This function handles
 * @dev paying for the request based on the current pricing.
 *
 * @dev Consumers must implement the fullfillRandomWords function, which will be called during
 * @dev fulfillment with the randomness result.
 */
abstract contract VRFV2WrapperConsumerBase {
  TRC20Interface internal immutable WINK_TOKEN;
  WinkMid internal immutable WINK_MID;
  VRFV2WrapperInterface internal immutable VRF_V2_WRAPPER;

  /**
   * @param _winkMid is the address of WinkMid
   * @param _vrfV2Wrapper is the address of the VRFV2Wrapper contract
   */
  constructor(address _wink, address _winkMid, address _vrfV2Wrapper) {
    WINK_TOKEN = TRC20Interface(_wink);
    WINK_MID = WinkMid(_winkMid);
    VRF_V2_WRAPPER = VRFV2WrapperInterface(_vrfV2Wrapper);
  }

  /**
   * @dev Requests randomness from the VRF V2 wrapper.
   *
   * @param _callbackGasLimit is the gas limit that should be used when calling the consumer's
   *        fulfillRandomWords function.
   * @param _requestConfirmations is the number of confirmations to wait before fulfilling the
   *        request. A higher number of confirmations increases security by reducing the likelihood
   *        that a chain re-org changes a published randomness outcome.
   * @param _numWords is the number of random words to request.
   *
   * @return requestId is the VRF V2 request ID of the newly created randomness request.
   */
  function requestRandomness(
          uint32 _callbackGasLimit,
          uint16 _requestConfirmations,
          uint32 _numWords
) internal returns (uint256 requestId) {
    uint64 amount = VRF_V2_WRAPPER.calculateRequestPrice(_callbackGasLimit, _numWords);
    WINK_TOKEN.approve(address(WINK_MID), amount);
    WINK_MID.transferAndCall(
            address(VRF_V2_WRAPPER),
            amount,
            abi.encode(_callbackGasLimit, _requestConfirmations, _numWords)
    );
    return VRF_V2_WRAPPER.lastRequestId();
  }

  /**
   * @notice fulfillRandomWords handles the VRF V2 wrapper response. The consuming contract must
   * @notice implement it.
   *
   * @param _requestId is the VRF V2 request ID.
   * @param _randomWords is the randomness result.
   */
  function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) internal virtual;

  function rawFulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) external {
    require(msg.sender == address(VRF_V2_WRAPPER), "only VRF V2 wrapper can fulfill");
    fulfillRandomWords(_requestId, _randomWords);
  }
}
```

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface VRFV2WrapperInterface {
  /**
   * @return the request ID of the most recent VRF V2 request made by this wrapper. This should only
   * be relied option within the same transaction that the request was made.
   */
  function lastRequestId() external view returns (uint256);

  /**
   * @notice Calculates the price of a VRF request with the given callbackGasLimit at the current
   * @notice block.
   *
   * @dev This function relies on the transaction gas price which is not automatically set during
   * @dev simulation. To estimate the price at a specific gas price, use the estimatePrice function.
   *
   * @param _callbackGasLimit is the gas limit used to estimate the price.
   */
  function calculateRequestPrice(uint32 _callbackGasLimit, uint32 _numWords) external view returns (uint64);

  //   /**
  //   * @notice Estimates the price of a VRF request with a specific gas limit and gas price.
  //   *
  //   * @dev This is a convenience function that can be called in simulation to better understand
  //   * @dev pricing.
  //   *
  //   * @param _callbackGasLimit is the gas limit used to estimate the price.
  //   * @param _requestGasPriceWei is the gas price in wei used for the estimation.
  //   */
  //   function estimateRequestPrice(uint32 _callbackGasLimit, uint256 _requestGasPriceWei) external view returns (uint256);
}
```


```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract TRC20Interface {

  function totalSupply() public view virtual returns (uint);

  function balanceOf(address guy) public view virtual returns (uint);

  function allowance(address src, address guy) public view virtual returns (uint);

  function approve(address guy, uint wad) public  virtual returns (bool);

  function transfer(address dst, uint wad) public virtual returns (bool);

  function transferFrom(address src, address dst, uint wad) public virtual returns (bool);

  event Transfer(address indexed from, address indexed to, uint tokens);
  event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

abstract contract WinkMid {

  function setToken(address tokenAddress) public virtual;

  function transferAndCall(address to, uint64 tokens, bytes calldata _data) public virtual returns (bool success);

  function balanceOf(address guy) public view virtual returns (uint);

  function allowance(address src, address guy) public view virtual returns (uint);

}
```


## Tron Nile网VRF合约
为方便开发者, Nile 测试网已经部署了 `WinkMid` 合约，封装了 Nile 测试网 `WIN` 代币。
开发者可直接使用该合约地址，无需额外部署。 Nile 测试网同时提供了水龙头地址可以领取测试 TRX 和 WIN 代币。

| Item           | Value                                                              |
|:---------------|:-------------------------------------------------------------------|
| WIN Token      | TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2                                 |
| WinkMid        | TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro                                 |
| BlockHashStore | TBpTbK9KQzagrN7eMKFr5QM2pgZf6FN7KA                                 |
| VRFCoordinatorV2 | TDidecxMyGMgqvYS7nmpMQCZ16HqqV5Fke                                 |
| VRFV2Wrapper | TMNRLGXhe3gzbUyWccuQAKhfVKFyqmLE1W                                 |
| Fee           | 10 WIN                                                              |

测试网水龙头: <https://nileex.io/join/getJoinPage>

## Tron主网VRF合约
| Item           | Value                                                              |
|:---------------|:-------------------------------------------------------------------|
| WIN Token      | TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7                                 |
| WinkMid        | TVMhaFMynYqTRLB1xShYL7wBwdmQHH6bKV                                 |
| BlockHashStore | TRGmef4qUdNJ4xTEL96hToGuMTNst57aS1                                 |
| VRFCoordinatorV2 | TZCz1BcnYviUNDiLvG6ZeuC477YupDgDA7                                 |
| VRFV2Wrapper | TGDVwQRKwtNHrwy4RFG49b2HTHkvWckP5N                                 |
| Fee           | 10 WIN                                                              |
