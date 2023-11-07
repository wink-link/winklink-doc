# WINkLink 隨機數服務

## 介紹
VRF（Verifiable Random Function)，即可驗證的隨機函數，其可生成安全可靠的隨機數。
隨機數由用戶提供的seed、nonce(VRFCoordinator合約的私有狀態)、請求所在區塊hash 和 隨機數生成節點的私鑰共同決定，隨機數節點不可作弊。且該隨機數在返回給用戶Dapp之前經過了驗證，從而保證了該隨機數的安全性。

隨機數生成流程如下：
- 由用戶合約在鏈上發出生成隨機數的請求；
- 節點監聽到該請求後，會在鏈下生成隨機數和證明，然後在鏈上合約中響應；
- 鏈上合約對生成的隨機數進行驗證並通過後，以回調函數反饋到用戶Dapp。

它可以用於任何需要可靠隨機數的應用程序：
- 區塊鏈遊戲和NFTs
- 職責和資源的隨機分配（例如隨機分配法官審理案件）
- 為共識機制選擇代表性樣本

WINkLink VRF解決方案包含了以下鏈上和鏈下的組件：

- VRF Coordinator（鏈上合約）：用於與VRF服務進行交互的合約。當發出隨機數請求時，它會觸發一個事件，然後對VRF服務生成的隨機數和證明進行驗證。
- VRF Wrapper（鏈上合約）：封裝了VRF Coordinator，提供了接口以便用戶Dapp調用。
- VRF 服務（鏈下節點）：此鏈下組件通過訂閱VRFCoordinator事件日誌來監聽隨機數請求，並基於區塊hash和隨機數生成一個隨機數，然後向VRFCoordinator發起一筆交易，其中包括隨機數和關於其生成方式的證明。

本文介紹如何部署和使用VRF合約。

## VRF請求流程
1. Dapp合約調用`VRFV2Wrapper`的`calculateRequestPrice`函數來估算完成隨機數生成所需的總交易成本。

2. Dapp合約調用`WinkMid`的`transferAndCall`函數，以支付Wrapper所計算的請求價格。該方法發送Wink代幣，並執行`VRFV2Wrapper`的`onTokenTransfer`邏輯。

3. `VRFV2Wrapper`的`onTokenTransfer`邏輯觸發`VRFCoordinatorV2`的`requestRandomWords`函數以請求隨機數。

4. `VRFCoordinatorV2`合約emit`RandomWordsRequested`事件。

5. VRF節點捕捉該事件，並等待指定數量的區塊確認，然後把隨機值和證明通過函數`fulfillRandomWords`返回`VRFCoordinatorV2`合約。

6. `VRFCoordinatorV2`在鏈上驗證證明，然後回調`VRFV2Wrapper`的`fulfillRandomWords`函數

7. 最後，`VRFV2Wrapper`回調Dapp合約完成請求。

## 準備工作

WINkLink 的維護者需要對 TRON 有一定的了解，熟悉智能合約部署和調用流程。
建議參考 [官方文檔](https://cn.developers.tron.network/) 。

完成節點帳號申請,建議參考[節點帳號準備文檔](./deploy.md) 。

## VRFCoordinatorV2 合約

VRFCoordinatorV2 合約是部署在 TRON 公鏈上的預言機合約。主要功能如下

- 接收消費者合約(Consumer Contract)的數據請求，觸發 Event Log
    - 數據請求發送時會附帶 WIN 轉賬作為使用費用
- 接受 WINkLink 節點所提交的隨機數和證明  
    - VRFCoordinator收到合約後會對隨機數進行驗證
- 對數據請求的 WIN 代幣費用進行結算，提取收益


<!-- 合約代碼位於 [VRFCoordinator.sol](https://github.com/wink-link/winklink/tree/master/tvm-contracts/v1.0/VRF/VRFCoordinator.sol) 。-->


部署 VRFCoordinatorV2 合約時需要在構造函數提供相關參數：
```
  constructor(
    address wink,
    address blockhashStore,
    address winkMid
  )
```
`_blockHashStore` 為BlockHashStore合約地址，`_win` 為WIN代幣地址, `_winkMid` 為WinkMid合約地址。


<!--
為方便開發者, Nile 測試網已經部署了 `WinkMid` 合約，封裝了 Nile 測試網 `WIN` 代幣。
開發者可直接使用該合約地址，無需額外部署。 Nile 測試網同時提供了水龍頭地址可以領取測試 TRX 和 WIN 代幣。

::: tip Nile 測試網

- WIN 代幣合約地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- WinkMid 合約地址: `TJpkay8rJXUWhvS2uL5AmMwFspQdHCX1rw`
- BlockHashStore 合約地址:: `TBpTbK9KQzagrN7eMKFr5QM2pgZf6FN7KA`
- 測試網水龍頭: <https://nileex.io/join/getJoinPage>
  :::
  -->

## VRFV2Wrapper 合約
VRFV2Wrapper封裝了與VRFCoordinatorV2的互動，作為dapp與VRFCoordinatorV2的中間層,供Dapp直接調用。


**配置參數**\
`keyHash` : 節點keyhash\
`maxNumWords` : 單次請求詞數限制，當前設置為10


<!--## 節點部署

節點部署部分可以參考[WINkLink](https://doc.winklink.org/v1/doc/deploy.html#%E8%8A%82%E7%82%B9%E9%83%A8%E7%BD%B2) ，本部分僅列出VRF節點部署的不同之處。

VRFCoordinator 合約部署完畢後，就可以開始 WINkLink 節點部署。

WINkLink 節點代碼位於: <https://github.com/wink-link/winklink/tree/master/node>，
編譯完成後 node-v1.0.jar 位於項目源碼目錄下的 node/build/libs/ 中

###節點配置

節點配置文件確認完畢後，還需要創建 `vrfKeyStore.yml` 文件, 寫入用於生成VRF的私鑰(支持添加多個VRF私鑰):

```text
privateKeys:
  - *****(32字节 hex 编码私钥)
```

支持在無需重啟節點server的情況下，動態更新vrfKeyStore，步驟如下：
首先在`vrfKeyStore.yml` 文件中添加新的VRF私鑰
然後執行如下指令：
```sh
curl --location --request GET 'http://localhost:8081/vrf/updateVRFKey/vrfKeyStore.yml'
```

::: tip
通過文件而非命令行參數提供私密信息是重要的安全性考慮，在生產環境需要設定私密文件 `vrfKeyStore.yml` 權限為 600，
即只有擁有者可讀寫。
:::

### 启动節點

所有配置文件都需要被複製到節點程序當前運行時目錄，即 `cp node/src/main/resource/*.yml ./`，同時application-dev文件中的 `tronApiKey` 部分需要填充apikey.

使用如下命令啟動 WINkLink 節點程序：

```sh
java -jar node/build/libs/node-v1.0.jar -k key.store -vrfK vrfKeyStore.yml
```

具體的配置項目也可以通過命令行指定，例如：

主網:
```sh
java -jar node/build/libs/node-v1.0.jar --server.port=8081 --spring.profiles.active=dev --key key.store  --vrfKey vrfKeyStore.yml
```
nile測試網:
```sh
java -jar node/build/libs/node-v1.0.jar --env dev --server.port=8081 --spring.profiles.active=dev --key key.store  --vrfKey vrfKeyStore.yml
```

使用以下命令檢查 WINkLink 節點是否正常運行：

```sh
tail -f logs/tron.log
```

::: warning 注意
節點帳號必須有足夠的 TRX 代幣，用於合約調用。可以通過測試網水龍頭地址申請。
:::
### 為節點添加 job
節點的 job 代表了節點所支持的數據服務, job ID 通過一個 32 字節唯一標識。

WINkLink 節點正常運行後，就可以通過 HTTP API 為節點添加 job:

示例：(修改下面代碼中 `address` 參數為上述步驟中部署的 VRFCoordinator 合約地址；`publicKey` 參數為節點公鑰的壓縮值，該值可通過查看節點運行後的終端顯示獲得,對應項為`ecKey compressed`)

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

### 查询節點 job

請求示例：

```sh
curl --location --request GET 'http://localhost:8081/job/specs'
```
-->
## 為節點帳戶授權

節點帳戶需要授權才能向 VRFCoordinatorV2 合約提交數據，否則會報錯。

需要使用 VRFCoordinatorV2 合約的擁有者執行如下合約調用，將節點帳戶添加到白名單：

```
  function registerProvingKey(address oracle, uint256[2] calldata publicProvingKey) external onlyOwner
```

其中 `_oracle` 為註冊節點的地址，用於接收 Dapp 應用對其支付的 WIN 代幣，`_publicProvingKey` 為註冊節點用於生成隨機數的公鑰。

示例調用例如:
```
registerProvingKey(TYmwSFuFuiDZCtYsRFKCNr25byeqHH7Esb,['6273228386041830135141271310112248407537170435188969735053134748570771583756',67273502359025519559461602732298865784327759914690240925031700564257821594585'])
```

## Dapp合約

當編寫新的 Dapp 合約時，需遵循以下規則：
- a) 引入VRFV2WrapperConsumerBase.sol
```solidity
// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity ^0.8.7;

import "./VRFV2WrapperConsumerBase.sol";

contract VRFv2DirectFundingConsumer is VRFV2WrapperConsumerBase{}
```

- b) 合約需實現VRF回調函數 `fulfillRandomWords`，在這裡你可以編寫獲取隨機數結果後的業務處理邏輯。
```
 function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    )
```

- c) 調用 `requestRandomness` 發起VRF請求。
```solidity
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


**示例Dapp合約**

部署示例合約VRFv2DirectFundingConsumer.sol。

構造函數參數：\
`_winkAddress`：wink代币合約地址
`_winkMid`： winkMid合約地址
`_wrapper`：VRFV2Wrapper合約地址
`_numWords`： 單次請求隨機詞數量

```solidity
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
        uint256 paid; // amount paid in link
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
    VRFV2WrapperConsumerBase(_winkMid, _wrapper) {
        winkAddress = _winkAddress;
        numWords = _numWords;
    }

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

```solidity
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

```solidity
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

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface OwnableInterface {
  function owner() external returns (address);

  function transferOwnership(address recipient) external;

  function acceptOwnership() external;
}

```

```solidity
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
 * @dev with enough LINK to make the request, otherwise requests will revert. To request randomness,
 * @dev call the 'requestRandomness' function with the desired VRF parameters. This function handles
 * @dev paying for the request based on the current pricing.
 *
 * @dev Consumers must implement the fullfillRandomWords function, which will be called during
 * @dev fulfillment with the randomness result.
 */
abstract contract VRFV2WrapperConsumerBase {
  WinkMid internal immutable WINK_MID;
  VRFV2WrapperInterface internal immutable VRF_V2_WRAPPER;

  /**
   * @param _winkMid is the address of WinkMid
   * @param _vrfV2Wrapper is the address of the VRFV2Wrapper contract
   */
  constructor(address _winkMid, address _vrfV2Wrapper) {
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
    address _from,
    uint32 _callbackGasLimit,
    uint16 _requestConfirmations,
    uint32 _numWords
  ) internal returns (uint256 requestId) {
    WINK_MID.transferAndCall(
      _from,
      address(VRF_V2_WRAPPER),
      VRF_V2_WRAPPER.calculateRequestPrice(_callbackGasLimit, _numWords),
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

```solidity
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


```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SafeMathTron.sol";

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

    function transferAndCall(address from, address to, uint64 tokens, bytes calldata _data) public virtual returns (bool success);

    function balanceOf(address guy) public view virtual returns (uint);

    function transferFrom(address src, address dst, uint wad) public virtual returns (bool);

    function allowance(address src, address guy) public view virtual returns (uint);

}

/**
* @dev A library for working with mutable byte buffers in Solidity.
*
* Byte buffers are mutable and expandable, and provide a variety of primitives
* for writing to them. At any time you can fetch a bytes object containing the
* current contents of the buffer. The bytes object should not be stored between
* operations, as it may change due to resizing of the buffer.
*/
library Buffer {
    /**
    * @dev Represents a mutable buffer. Buffers have a current value (buf) and
    *      a capacity. The capacity may be longer than the current value, in
    *      which case it can be extended without the need to allocate more memory.
    */
    struct buffer {
        bytes buf;
        uint capacity;
    }

    /**
    * @dev Initializes a buffer with an initial capacity.
    * @param buf The buffer to initialize.
    * @param capacity The number of bytes of space to allocate the buffer.
    * @return The buffer, for chaining.
    */
    function init(buffer memory buf, uint capacity) internal pure returns (buffer memory) {
        if (capacity % 32 != 0) {
            capacity += 32 - (capacity % 32);
        }
        // Allocate space for the buffer data
        buf.capacity = capacity;
        assembly {
            let ptr := mload(0x40)
            mstore(buf, ptr)
            mstore(ptr, 0)
            mstore(0x40, add(32, add(ptr, capacity)))
        }
        return buf;
    }

    /**
    * @dev Initializes a new buffer from an existing bytes object.
    *      Changes to the buffer may mutate the original value.
    * @param b The bytes object to initialize the buffer with.
    * @return A new buffer.
    */
    function fromBytes(bytes memory b) internal pure returns (buffer memory) {
        buffer memory buf;
        buf.buf = b;
        buf.capacity = b.length;
        return buf;
    }

    function resize(buffer memory buf, uint capacity) private pure {
        bytes memory oldbuf = buf.buf;
        init(buf, capacity);
        append(buf, oldbuf);
    }

    function max(uint a, uint b) private pure returns (uint) {
        if (a > b) {
            return a;
        }
        return b;
    }

    /**
    * @dev Sets buffer length to 0.
    * @param buf The buffer to truncate.
    * @return The original buffer, for chaining..
    */
    function truncate(buffer memory buf) internal pure returns (buffer memory) {
        assembly {
            let bufptr := mload(buf)
            mstore(bufptr, 0)
        }
        return buf;
    }

    /**
    * @dev Writes a byte string to a buffer. Resizes if doing so would exceed
    *      the capacity of the buffer.
    * @param buf The buffer to append to.
    * @param off The start offset to write to.
    * @param data The data to append.
    * @param len The number of bytes to copy.
    * @return The original buffer, for chaining.
    */
    function write(buffer memory buf, uint off, bytes memory data, uint len) internal pure returns (buffer memory) {
        require(len <= data.length);

        if (off + len > buf.capacity) {
            resize(buf, max(buf.capacity, len + off) * 2);
        }

        uint dest;
        uint src;
        assembly {
        // Memory address of the buffer data
            let bufptr := mload(buf)
        // Length of existing buffer data
            let buflen := mload(bufptr)
        // Start address = buffer address + offset + sizeof(buffer length)
            dest := add(add(bufptr, 32), off)
        // Update buffer length if we're extending it
            if gt(add(len, off), buflen) {
                mstore(bufptr, add(len, off))
            }
            src := add(data, 32)
        }

        // Copy word-length chunks while possible
        for (; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }

        // Copy remaining bytes
        uint mask = 256 ** (32 - len) - 1;
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }

        return buf;
    }

    /**
    * @dev Appends a byte string to a buffer. Resizes if doing so would exceed
    *      the capacity of the buffer.
    * @param buf The buffer to append to.
    * @param data The data to append.
    * @param len The number of bytes to copy.
    * @return The original buffer, for chaining.
    */
    function append(buffer memory buf, bytes memory data, uint len) internal pure returns (buffer memory) {
        return write(buf, buf.buf.length, data, len);
    }

    /**
    * @dev Appends a byte string to a buffer. Resizes if doing so would exceed
    *      the capacity of the buffer.
    * @param buf The buffer to append to.
    * @param data The data to append.
    * @return The original buffer, for chaining.
    */
    function append(buffer memory buf, bytes memory data) internal pure returns (buffer memory) {
        return write(buf, buf.buf.length, data, data.length);
    }

    /**
    * @dev Writes a byte to the buffer. Resizes if doing so would exceed the
    *      capacity of the buffer.
    * @param buf The buffer to append to.
    * @param off The offset to write the byte at.
    * @param data The data to append.
    * @return The original buffer, for chaining.
    */
    function writeUint8(buffer memory buf, uint off, uint8 data) internal pure returns (buffer memory) {
        if (off >= buf.capacity) {
            resize(buf, buf.capacity * 2);
        }

        assembly {
        // Memory address of the buffer data
            let bufptr := mload(buf)
        // Length of existing buffer data
            let buflen := mload(bufptr)
        // Address = buffer address + sizeof(buffer length) + off
            let dest := add(add(bufptr, off), 32)
            mstore8(dest, data)
        // Update buffer length if we extended it
            if eq(off, buflen) {
                mstore(bufptr, add(buflen, 1))
            }
        }
        return buf;
    }

    /**
    * @dev Appends a byte to the buffer. Resizes if doing so would exceed the
    *      capacity of the buffer.
    * @param buf The buffer to append to.
    * @param data The data to append.
    * @return The original buffer, for chaining.
    */
    function appendUint8(buffer memory buf, uint8 data) internal pure returns (buffer memory) {
        return writeUint8(buf, buf.buf.length, data);
    }

    /**
    * @dev Writes up to 32 bytes to the buffer. Resizes if doing so would
    *      exceed the capacity of the buffer.
    * @param buf The buffer to append to.
    * @param off The offset to write at.
    * @param data The data to append.
    * @param len The number of bytes to write (left-aligned).
    * @return The original buffer, for chaining.
    */
    function write(buffer memory buf, uint off, bytes32 data, uint len) private pure returns (buffer memory) {
        if (len + off > buf.capacity) {
            resize(buf, (len + off) * 2);
        }

        uint mask = 256 ** len - 1;
        // Right-align data
        data = data >> (8 * (32 - len));
        assembly {
        // Memory address of the buffer data
            let bufptr := mload(buf)
        // Address = buffer address + sizeof(buffer length) + off + len
            let dest := add(add(bufptr, off), len)
            mstore(dest, or(and(mload(dest), not(mask)), data))
        // Update buffer length if we extended it
            if gt(add(off, len), mload(bufptr)) {
                mstore(bufptr, add(off, len))
            }
        }
        return buf;
    }

    /**
    * @dev Writes a bytes20 to the buffer. Resizes if doing so would exceed the
    *      capacity of the buffer.
    * @param buf The buffer to append to.
    * @param off The offset to write at.
    * @param data The data to append.
    * @return The original buffer, for chaining.
    */
    function writeBytes20(buffer memory buf, uint off, bytes20 data) internal pure returns (buffer memory) {
        return write(buf, off, bytes32(data), 20);
    }

    /**
    * @dev Appends a bytes20 to the buffer. Resizes if doing so would exceed
    *      the capacity of the buffer.
    * @param buf The buffer to append to.
    * @param data The data to append.
    * @return The original buffer, for chhaining.
    */
    function appendBytes20(buffer memory buf, bytes20 data) internal pure returns (buffer memory) {
        return write(buf, buf.buf.length, bytes32(data), 20);
    }

    /**
    * @dev Appends a bytes32 to the buffer. Resizes if doing so would exceed
    *      the capacity of the buffer.
    * @param buf The buffer to append to.
    * @param data The data to append.
    * @return The original buffer, for chaining.
    */
    function appendBytes32(buffer memory buf, bytes32 data) internal pure returns (buffer memory) {
        return write(buf, buf.buf.length, data, 32);
    }

    /**
    * @dev Writes an integer to the buffer. Resizes if doing so would exceed
    *      the capacity of the buffer.
    * @param buf The buffer to append to.
    * @param off The offset to write at.
    * @param data The data to append.
    * @param len The number of bytes to write (right-aligned).
    * @return The original buffer, for chaining.
    */
    function writeInt(buffer memory buf, uint off, uint data, uint len) private pure returns (buffer memory) {
        if (len + off > buf.capacity) {
            resize(buf, (len + off) * 2);
        }

        uint mask = 256 ** len - 1;
        assembly {
        // Memory address of the buffer data
            let bufptr := mload(buf)
        // Address = buffer address + off + sizeof(buffer length) + len
            let dest := add(add(bufptr, off), len)
            mstore(dest, or(and(mload(dest), not(mask)), data))
        // Update buffer length if we extended it
            if gt(add(off, len), mload(bufptr)) {
                mstore(bufptr, add(off, len))
            }
        }
        return buf;
    }

    /**
     * @dev Appends a byte to the end of the buffer. Resizes if doing so would
     * exceed the capacity of the buffer.
     * @param buf The buffer to append to.
     * @param data The data to append.
     * @return The original buffer.
     */
    function appendInt(buffer memory buf, uint data, uint len) internal pure returns (buffer memory) {
        return writeInt(buf, buf.buf.length, data, len);
    }
}

library CBOR {

    using Buffer for Buffer.buffer;

    uint8 private constant MAJOR_TYPE_INT = 0;
    uint8 private constant MAJOR_TYPE_NEGATIVE_INT = 1;
    uint8 private constant MAJOR_TYPE_BYTES = 2;
    uint8 private constant MAJOR_TYPE_STRING = 3;
    uint8 private constant MAJOR_TYPE_ARRAY = 4;
    uint8 private constant MAJOR_TYPE_MAP = 5;
    uint8 private constant MAJOR_TYPE_CONTENT_FREE = 7;

    function encodeType(Buffer.buffer memory buf, uint8 major, uint value) private pure {
        if (value <= 23) {
            buf.appendUint8(uint8((major << 5) | value));
        } else if (value <= 0xFF) {
            buf.appendUint8(uint8((major << 5) | 24));
            buf.appendInt(value, 1);
        } else if (value <= 0xFFFF) {
            buf.appendUint8(uint8((major << 5) | 25));
            buf.appendInt(value, 2);
        } else if (value <= 0xFFFFFFFF) {
            buf.appendUint8(uint8((major << 5) | 26));
            buf.appendInt(value, 4);
        } else if (value <= 0xFFFFFFFFFFFFFFFF) {
            buf.appendUint8(uint8((major << 5) | 27));
            buf.appendInt(value, 8);
        }
    }

    function encodeIndefiniteLengthType(Buffer.buffer memory buf, uint8 major) private pure {
        buf.appendUint8(uint8((major << 5) | 31));
    }

    function encodeUInt(Buffer.buffer memory buf, uint value) internal pure {
        encodeType(buf, MAJOR_TYPE_INT, value);
    }

    function encodeInt(Buffer.buffer memory buf, int value) internal pure {
        if (value >= 0) {
            encodeType(buf, MAJOR_TYPE_INT, uint(value));
        } else {
            encodeType(buf, MAJOR_TYPE_NEGATIVE_INT, uint(- 1 - value));
        }
    }

    function encodeBytes(Buffer.buffer memory buf, bytes memory value) internal pure {
        encodeType(buf, MAJOR_TYPE_BYTES, value.length);
        buf.append(value);
    }

    function encodeString(Buffer.buffer memory buf, string memory value) internal pure {
        encodeType(buf, MAJOR_TYPE_STRING, bytes(value).length);
        buf.append(bytes(value));
    }

    function startArray(Buffer.buffer memory buf) internal pure {
        encodeIndefiniteLengthType(buf, MAJOR_TYPE_ARRAY);
    }

    function startMap(Buffer.buffer memory buf) internal pure {
        encodeIndefiniteLengthType(buf, MAJOR_TYPE_MAP);
    }

    function endSequence(Buffer.buffer memory buf) internal pure {
        encodeIndefiniteLengthType(buf, MAJOR_TYPE_CONTENT_FREE);
    }
}

/**
 * @title Library for common Winklink functions
 * @dev Uses imported CBOR library for encoding to buffer
 */
library Winklink {
    uint256 internal constant defaultBufferSize = 256; // solhint-disable-line const-name-snakecase

    using Buffer for Buffer.buffer;
    using CBOR for Buffer.buffer;

    struct Request {
        bytes32 id;
        address callbackAddress;
        bytes4 callbackFunctionId;
        uint256 nonce;
        Buffer.buffer buf;
    }

    /**
     * @notice Initializes a Winklink request
     * @dev Sets the ID, callback address, and callback function signature on the request
     * @param self The uninitialized request
     * @param _id The Job Specification ID
     * @param _callbackAddress The callback address
     * @param _callbackFunction The callback function signature
     * @return The initialized request
     */
    function initialize(
        Request memory self,
        bytes32 _id,
        address _callbackAddress,
        bytes4 _callbackFunction
    ) internal pure returns (Winklink.Request memory) {
        Buffer.init(self.buf, defaultBufferSize);
        self.id = _id;
        self.callbackAddress = _callbackAddress;
        self.callbackFunctionId = _callbackFunction;
        return self;
    }

    /**
     * @notice Sets the data for the buffer without encoding CBOR on-chain
     * @dev CBOR can be closed with curly-brackets {} or they can be left off
     * @param self The initialized request
     * @param _data The CBOR data
     */
    function setBuffer(Request memory self, bytes memory _data)
    internal pure
    {
        Buffer.init(self.buf, _data.length);
        Buffer.append(self.buf, _data);
    }

    /**
     * @notice Adds a string value to the request with a given key name
     * @param self The initialized request
     * @param _key The name of the key
     * @param _value The string value to add
     */
    function add(Request memory self, string memory _key, string memory _value)
    internal pure
    {
        self.buf.encodeString(_key);
        self.buf.encodeString(_value);
    }

    /**
     * @notice Adds a bytes value to the request with a given key name
     * @param self The initialized request
     * @param _key The name of the key
     * @param _value The bytes value to add
     */
    function addBytes(Request memory self, string memory _key, bytes memory _value)
    internal pure
    {
        self.buf.encodeString(_key);
        self.buf.encodeBytes(_value);
    }

    /**
     * @notice Adds a int256 value to the request with a given key name
     * @param self The initialized request
     * @param _key The name of the key
     * @param _value The int256 value to add
     */
    function addInt(Request memory self, string memory _key, int256 _value)
    internal pure
    {
        self.buf.encodeString(_key);
        self.buf.encodeInt(_value);
    }

    /**
     * @notice Adds a uint256 value to the request with a given key name
     * @param self The initialized request
     * @param _key The name of the key
     * @param _value The uint256 value to add
     */
    function addUint(Request memory self, string memory _key, uint256 _value)
    internal pure
    {
        self.buf.encodeString(_key);
        self.buf.encodeUInt(_value);
    }

    /**
     * @notice Adds an array of strings to the request with a given key name
     * @param self The initialized request
     * @param _key The name of the key
     * @param _values The array of string values to add
     */
    function addStringArray(Request memory self, string memory _key, string[] memory _values)
    internal pure
    {
        self.buf.encodeString(_key);
        self.buf.startArray();
        for (uint256 i = 0; i < _values.length; i++) {
            self.buf.encodeString(_values[i]);
        }
        self.buf.endSequence();
    }
}

interface WinklinkRequestInterface {
    function vrfRequest(
        address sender,
        uint256 payment,
        bytes32 id,
        address callbackAddress,
        bytes4 callbackFunctionId,
        uint256 nonce,
        uint256 version,
        bytes calldata data
    ) external;
}

/**
 * @title The WinklinkClient contract
 * @notice Contract writers can inherit this contract in order to create requests for the
 * Winklink network
 */
contract WinklinkClient {
    using Winklink for Winklink.Request;
    using SafeMathTron for uint256;

    uint256 constant internal LINK = 10 ** 18;
    uint256 constant private AMOUNT_OVERRIDE = 0;
    address constant private SENDER_OVERRIDE = address(0);
    uint256 constant private ARGS_VERSION = 1;

    WinkMid internal winkMid;
    TRC20Interface internal token;
    WinklinkRequestInterface private oracle;

    /**
     * @notice Creates a request that can hold additional parameters
     * @param _specId The Job Specification ID that the request will be created for
     * @param _callbackAddress The callback address that the response will be sent to
     * @param _callbackFunctionSignature The callback function signature to use for the callback address
     * @return A Winklink Request struct in memory
     */
    function buildWinklinkRequest(
        bytes32 _specId,
        address _callbackAddress,
        bytes4 _callbackFunctionSignature
    ) internal pure returns (Winklink.Request memory) {
        Winklink.Request memory req;
        return req.initialize(_specId, _callbackAddress, _callbackFunctionSignature);
    }

    /**
     * @notice Sets the LINK token address
     * @param _link The address of the LINK token contract
     */
    function setWinklinkToken(address _link) internal {
        token = TRC20Interface(_link);
    }

    function setWinkMid(address _winkMid) internal {
        winkMid = WinkMid(_winkMid);
    }

    /**
     * @notice Retrieves the stored address of the LINK token
     * @return The address of the LINK token
     */
    function winkMidAddress()
    public
    view
    returns (address)
    {
        return address(winkMid);
    }

    /**
     * @notice Encodes the request to be sent to the vrfCoordinator contract
     * @dev The Winklink node expects values to be in order for the request to be picked up. Order of types
     * will be validated in the VRFCoordinator contract.
     * @param _req The initialized Winklink Request
     * @return The bytes payload for the `transferAndCall` method
     */
    function encodeVRFRequest(Winklink.Request memory _req)
    internal
    view
    returns (bytes memory)
    {
        return abi.encodeWithSelector(
            oracle.vrfRequest.selector,
            SENDER_OVERRIDE, // Sender value - overridden by onTokenTransfer by the requesting contract's address
            AMOUNT_OVERRIDE, // Amount value - overridden by onTokenTransfer by the actual amount of LINK sent
            _req.id,
            _req.callbackAddress,
            _req.callbackFunctionId,
            _req.nonce,
            ARGS_VERSION,
            _req.buf.buf);
    }
}

```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMathTron {
    /**
      * @dev Returns the addition of two unsigned integers, reverting on
      * overflow.
      *
      * Counterpart to Solidity's `+` operator.
      *
      * Requirements:
      * - Addition cannot overflow.
      */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
      * @dev Returns the subtraction of two unsigned integers, reverting on
      * overflow (when the result is negative).
      *
      * Counterpart to Solidity's `-` operator.
      *
      * Requirements:
      * - Subtraction cannot overflow.
      */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
      * @dev Returns the multiplication of two unsigned integers, reverting on
      * overflow.
      *
      * Counterpart to Solidity's `*` operator.
      *
      * Requirements:
      * - Multiplication cannot overflow.
      */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
      * @dev Returns the integer division of two unsigned integers. Reverts on
      * division by zero. The result is rounded towards zero.
      *
      * Counterpart to Solidity's `/` operator. Note: this function uses a
      * `revert` opcode (which leaves remaining gas untouched) while Solidity
      * uses an invalid opcode to revert (consuming all remaining gas).
      *
      * Requirements:
      * - The divisor cannot be zero.
      */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
      * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
      * Reverts when dividing by zero.
      *
      * Counterpart to Solidity's `%` operator. This function uses a `revert`
      * opcode (which leaves remaining gas untouched) while Solidity uses an
      * invalid opcode to revert (consuming all remaining gas).
      *
      * Requirements:
      * - The divisor cannot be zero.
      */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}


/**
 * @title SignedSafeMath
 * @dev Signed math operations with safety checks that revert on error.
 */
library SignedSafeMath {
    int256 constant private _INT256_MIN = - 2 ** 255;

    /**
     * @dev Multiplies two signed integers, reverts on overflow.
     */
    function mul(int256 a, int256 b) internal pure returns (int256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        require(!(a == - 1 && b == _INT256_MIN), "SignedSafeMath: multiplication overflow");

        int256 c = a * b;
        require(c / a == b, "SignedSafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Integer division of two signed integers truncating the quotient, reverts on division by zero.
     */
    function div(int256 a, int256 b) internal pure returns (int256) {
        require(b != 0, "SignedSafeMath: division by zero");
        require(!(b == - 1 && a == _INT256_MIN), "SignedSafeMath: division overflow");

        int256 c = a / b;

        return c;
    }

    /**
     * @dev Subtracts two signed integers, reverts on overflow.
     */
    function sub(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a - b;
        require((b >= 0 && c <= a) || (b < 0 && c > a), "SignedSafeMath: subtraction overflow");

        return c;
    }

    /**
     * @dev Adds two signed integers, reverts on overflow.
     */
    function add(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a + b;
        require((b >= 0 && c >= a) || (b < 0 && c < a), "SignedSafeMath: addition overflow");

        return c;
    }
}
```


## TRON Nile網VRF合約
為了方便開發者，Nile測試網已經部署了`WinkMid`合約，封裝了Nile測試網的`WIN`代幣。
開發者可直接使用該合約地址，無需額外部署。Nile測試網同時提供了水龍頭地址可以領取測試TRX和WIN代幣。

| Item           | Value                                                              |
|:---------------|:-------------------------------------------------------------------|
| WIN Token      | TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2                                 |
| WinkMid        | TJpkay8rJXUWhvS2uL5AmMwFspQdHCX1rw                                 |
| BlockHashStore | TBpTbK9KQzagrN7eMKFr5QM2pgZf6FN7KA                                 |
| VRFCoordinatorV2 | TMvQdnsahiJRiJpA7YgcpLUdKFi2LswPrb                                 |
| VRFV2Wrapper | TJSP3zzmEH84y2W8hjfTgpqwhQsdWwn3N5                                 |
| Fee           | 10 WIN                                                              |

測試網水龍頭: <https://nileex.io/join/getJoinPage>

## Tron主網VRF合約
| Item           | Value                                                              |
|:---------------|:-------------------------------------------------------------------|
| WIN Token      | TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7                                 |
| WinkMid        | TSG1B8DKDGY5sRFXwQ6xJofVr75DCFUA64                                 |
| BlockHashStore | TRGmef4qUdNJ4xTEL96hToGuMTNst57aS1                                 |
| VRFCoordinatorV2 | TD7hF84Xwf8Cu2zscmqxrgiGaEBziZhXqf                                 |
| VRFV2Wrapper | TYMSMoitSkxuKUF1oiZp2fse4MEgsM86WT                                 |
| Fee           | 10 WIN                                                              |
