# WINkLink 可驗證隨機數服務

## 概覽

可驗證隨機函數（VRF）是公鑰版密鑰加密哈希，可作為隨機數使用。 僅私鑰持有者可進行哈希運算，但任何公鑰持有者均可驗證哈希運算結果是否正確。 VRF 可用於生成安全可靠的隨機數。

隨機數由 seed（由用戶提供）、nonce（VRFCoordinator 合約的私有狀態）、區塊哈希（請求事件所在區塊）和預言機節點的密鑰決定。

VRF 的生成過程如下：

- Dapp 合約發出生成隨機數的鏈上請求；
- 鏈下預言機節點監聽到該請求後，將生成隨機數並附上加密證明以供驗證，隨後將其回傳至預言機合約（VRFCoordinator）；
- 經預言機合約驗證後，該隨機數將通過回調函數發布至 Dapp 合約。

上述流程可確保預言機運營商、礦工、用戶乃至智能合約開發人員等任何人都無法篡改或操縱隨機數。

WINkLink VRF 是專為 Dapp 合約設計的公平、可驗證的隨機數生成來源。 Dapp 合約的開發者可將 WINkLink VRF 用作防篡改隨機數生成器（RNG），為任何依賴隨機數的應用程序創建可靠的智能合約，包括：

- 區塊鏈遊戲和 NFT
- 職責和資源的隨機分配（例如隨機分配法官審理案件）
- 選擇具有代表性的共識機制樣本

WINkLink VRF 解決方案由鏈上和鏈下兩部分組成：

- VRF Coordinator（鏈上部分）：可與 VRF 服務交互。 當發起隨機數請求後，VRF Coordinator 將觸發一個事件，並對VRF 服務生成的隨機數和證明進行驗證。
- VRF Wrapper（鏈上部分）：對 VRF Coordinator 進行封裝，為調用合約提供接口。
- VRF 服務（鏈下部分）：通過訂閱 VRF Coordinator 事件日誌監聽請求，並根據區塊哈希和 nonce 計算隨機數， 隨後將包含隨機數和隨機數生成證明的交易發送至 VRFCoordinator。

### 直接資金流

![vrf-direct-funding-flow.png](~@source/images/vrf-direct-funding-flow.png)

### 訂閱流

![vrf-subscription-flow.png](~@source/images/vrf-subscription-flow.png)

### 波場 Nile VRF 合約

為方便開發者使用，Nile 測試網部署了 WinkMid 合約，並封裝了 WIN 代幣。 開發者可直接使用該合約地址，無需額外部署。 Nile 測試網還提供水龍頭地址，可供用戶領取 TRX 和 WIN 測試代幣。

| 内容               | 值                                  |
|:-----------------|:-----------------------------------|
| WIN Token        | TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2 |
| WinkMid          | TJpkay8rJXUWhvS2uL5AmMwFspQdHCX1rw |
| BlockHashStore   | TBpTbK9KQzagrN7eMKFr5QM2pgZf6FN7KA |
| VRFCoordinatorV2 | TMvQdnsahiJRiJpA7YgcpLUdKFi2LswPrb |
| VRFV2Wrapper     | TJSP3zzmEH84y2W8hjfTgpqwhQsdWwn3N5 |
| Fee              | 10 WIN                             |

測試網水龍頭地址：<https://nileex.io/join/getJoinPage>

### 波場主網 VRF 合约
| 内容               | 值                                  |
|:-----------------|:-----------------------------------|
| WIN Token        | TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7 |
| WinkMid          | TSG1B8DKDGY5sRFXwQ6xJofVr75DCFUA64 |
| BlockHashStore   | TRGmef4qUdNJ4xTEL96hToGuMTNst57aS1 |
| VRFCoordinatorV2 | TD7hF84Xwf8Cu2zscmqxrgiGaEBziZhXqf |
| VRFV2Wrapper     | TYMSMoitSkxuKUF1oiZp2fse4MEgsM86WT |
| Fee              | 10 WIN                             |

## 如何使用現有的 WINkLink 可驗證隨機數服務

### VRF 請求流程

1. Dapp 合約調用 VRFV2Wrapper 的 calculateRequestPrice 函數，估算生成隨機數需要的交易成本。

2. Dapp 合約調用 WinkMid 的 transferAndCall 函數，向 Wrapper 支付計算出的請求價格。 此方法會發送 Wink 代幣並執行 VRFV2Wrapper 的 onTokenTransfer 邏輯。

3. VRFV2Wrapper 的 onTokenTransfer 邏輯觸發 VRFCoordinatorV2 的 requestRandomWords 函數，並請求隨機數。

4. VRFCoordinatorV2 合約發布 RandomWordsRequested 事件。

5. VRF 節點捕獲此事件並等待指定數量的區塊確認， 隨後通過 fulfillRandomWords 函數向 VRFCoordinatorV2 合約返回隨機值及其證明。

6. The VRFCoordinatorV2 合約在鏈上對證明進行驗證，隨即調用 VRFV2Wrapper 的 fulfillRandomWords 函數。

7. 最後，VRFV2Wrapper 回調 Dapp 合約，完成請求。

### 準備事項

WINkLink 的維護者需要對波場 TRON 有一定的了解，且熟悉智能合約的部署和調用流程。 建議閱讀波場相關的官方文檔 ，特別是 TronIDE 上進行合約部署的相關文章。

準備節點賬戶。 建議閱讀節點賬戶準備相關的文檔。

### VRFCoordinatorV2 合約

VRFCoordinatorV2 合約部署在波場 TRON 公鏈上，擁有以下功能：

- 接收 Dapp 合約的隨機數請求並發布 VRFRequest 事件
- 數據請求發送時會附帶WIN轉賬，作為使用費用
- 接受 WINkLink 節點提交的隨機數和證明
- 將隨機數發送至 Dapp 合約之前，VRFCoordinator 合約會對其證明進行驗證
- 計算履行請求對應的 WINkLink 節點獎勵

部署 VRFCoordinator 合約時，構造函數所需的參數如下：

```solidity
constructor(
address wink,
address blockhashStore,
address winkMid
)
```

_`blockHashStore` 為 BlockHashStore 地址；_`win` WIN 為 WIN 代幣地址；_`winkMid` 為 WinkMid 合約地址。

::: tip
Nile 測試網

- WIN TRC20 合約地址：TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2
- WinkMid 合約地址：TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb
- BlockHashStore 合約地址：TBpTbK9KQzagrN7eMKFr5QM2pgZf6FN7KA
- 測試網水龍頭地址：<https://nileex.io/join/getJoinPage>
:::


### VRFV2Wrapper 合約

VRFV2Wrapper 可簡化交互，允許 Dapp 直接調用 VRFCoordinatorV2 合約。

**配置参数**\
`keyHash` : 節點 keyhash\
`maxNumWords` : 每個 VRF 請求包含的隨機數個數上限，目前為 10

### 授權節點賬戶

節點賬戶需要授權才能向 VRFCoordinatorV2 合約提交數據，否則將報錯。

VRFCoordinatorV2 合約的所有者需要調用以下合約，並將節點賬戶添加到白名單：

```solidity
function registerProvingKey(address oracle, uint256[2] calldata publicProvingKey) external onlyOwner
```

_`oracle` 為註冊節點地址，用於接收支付的 WIN 代幣 Dapp；_`publicProvingKey` 為註冊節點使用的公鑰，用於生成隨機數。

調用示例：

```
registerProvingKey(TYmwSFuFuiDZCtYsRFKCNr25byeqHH7Esb,['6273228386041830135141271310112248407537170435188969735053134748570771583756',67273502359025519559461602732298865784327759914690240925031700564257821594585'])
```

### Dapp 合約

設置 Consumer 合約的主要步驟如下：

- a) 導入並繼承 `VRFV2WrapperConsumerBase`

```solidity
// SPDX-License-Identifier: MIT
// An example of a consumer contract that directly pays for each request.
pragma solidity ^0.8.7;

import "./VRFV2WrapperConsumerBase.sol";

contract VRFv2DirectFundingConsumer is VRFV2WrapperConsumerBase{}
```

- b) 合約必須執行 fulfillRandomWords 函數，該函數為 VRF 回調函數。 隨機數返回合約後，添加處理邏輯。

```solidity
function fulfillRandomWords(
uint256 _requestId,
uint256[] memory _randomWords
)
```

- c) 合約調用 requestRandomness 函數，觸發 VRF 請求。

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

### Dapp 合約示例

部署 Consumer 合約VRFv2DirectFundingConsumer.sol

構造參數：\
`_winkAddress`：Wink 代幣合約地址\
`_winkMid`： winkMid 合約地址\
`_wrapper`：VRFV2Wrapper 合約地址\
`_numWords`： 每個 vrf 請求的隨機數個數上限

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

## 如何設置可驗證隨機函數合約

### WinkMid 合約

WWINkLink 用 WIN 代幣（TRC20）作為整個生態的基礎代幣。

WINkLink 使用了 transferAndCall 功能，即在轉賬 TRC20 代幣給合約的同時調用合約的某一回調函數，該功能類似 ERC677，但接口參數不同。

考慮到絕大多數已發行的代幣無法再修改合約或增加接口，WINkLink 提供 WinkMid 包裝合約，可用來包裝任一 TRC20 代幣，並提供 transferAndCall 接口。

合約代碼可於 WinkMid.sol 查看。

為方便開發者使用，Nile 測試網部署了 WinkMid 合約，並封裝了 WIN 代幣。 開發者可直接使用該合約地址，無需額外部署。 Nile 測試網還提供水龍頭地址，用戶可以領取 TRX 和 WIN 測試代幣。

::: tip
Nile 測試網

WIN TRC20 合約地址: TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2

WinkMid 合約地址: TJpkay8rJXUWhvS2uL5AmMwFspQdHCX1rw

測試網水龍頭地址: <https://nileex.io/join/getJoinPage> 
:::

部署 WinkMid 合約時，開發者需在構造函數中提供被封裝的 TRC20 代幣地址（即 WIN 代幣地址）。

WinkMid 合約可幫助用戶進行合約調用，開發者無需直接進行調用操作。

部署 Coordinator 合約時需在構造函數中提供 WIN 代幣地址和 WinkMid 合約地址。

### VRFCoordinatorV2

Coordinator 主要負責處理所有 VRF 請求和 fulfillment， 請使用相應的參數部署合約。

發起請求之前，預言機必須以 base58 編碼的形式用證明密鑰向 Coordinator 註冊其節點地址，否則請求將失敗。

### VRFV2Wrapper

Wrapper 合約是直接付費 Consumer 的訪問層。該合約通過 WinkMid 的 transferAndCall 函數為訂閱服務提供充足的 Wink 代幣，保證內部流通。

傳入數據為 ABI 編碼格式的訂閱 ID 值，例如，`0x0000000000000000000000000000000000000000000000000000000000000007` 表示訂閱 ID 為 7。

::: tip
keyhash 指的是預言機節點的 keyhash，可通過 Operator UI 或 CLI 獲取
:::

### Consumers

- VRFv2DirectFundingConsumer

在發起請求時，直接付費的 Consumer 會直接從用戶賬戶中扣除 Wink 代幣。 請求時，該 Consumer 接口會與 Wrapper 合約進行交互。

- VRFv2SubscriptionConsumer

為確保訂閱服務處於開啟狀態，訂閱服務 Consumer 需要使用訂閱服務管理器。 出現請求時，該 Consumer 接口憑有效的訂閱 ID 直接與 Coordinator 合約進行交互。

::: warning
代碼中提供的 Consumer 合約僅作示例，用戶應根據自身情況編寫自己的 Consumer 合約。
:::

## 如何啟動可驗證隨機數服務節點

### 節點部署

合約部署完畢後，即可開始 WINLink 節點部署。
WINkLink 節點（項目目錄節點）的代碼請參考：<https://github.com/tron-oracle/winklink-2.0/tree/main>.

::: warning
當前節點實現包含通過交易所 API 訪問代幣價格的適配器。 請在中國大陸以外的穩定網絡環境中運行節點。
:::

### 準備節點賬戶

每個 WINLink 節點必須與一個波場帳戶關聯，以便調用聚合器合約傳輸數據。

賬戶地址和私鑰生成後，開發人員可以在測試網水龍頭頁面測試 TRX 代幣。該代幣用於支付調用智能合約產生的手續費。

節點初始運行時將生成賬戶，私鑰將存儲在密鑰鏈中。 節點將使用該賬戶進行餵價傳輸。

::: warning
生成的賬戶尚未激活，請向該賬戶轉賬任意數量的 TRX 以完成激活
:::

### 所需環境

WINkLink 節點依賴 PostgreSQL 數據庫。 詳情請參考官方文檔：<https://www.postgresql.org> .

::: tip
這裏假定本機部署的 PostgreSQL 實例的用戶名和密碼分別是 root:root。 在生產環境中請使用強密碼或其他驗證方式。
:::

WINkLink 節點使用的編程語言為 Go，因此需要搭建 Golang 環境。

### 節點配置

WINkLink 節點的配置文件格式為 TOML， 主配置為 tools/config/config.toml。 你可以使用 secrets.toml 指定要使用的 db 實例。 以下為參考模板。

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
確認好節點配置文件後，需創建 `vrfpassword` 和 `apicredentials` 文件，並寫入用戶 ID 和密碼，以訪問節點 API：

```toml
# apicredentials
example.user@fake.email
totallyNotFakePassword (16 characters long)
```

```toml
# vrfpassword
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

安裝 [go1.20](https://go.dev/dl/)

前往 winklink-2.0 源代碼的基本目錄

搭建命令行界面

```
make install
```

使用以下指令及對應配置項啟動 WINkLink 節點：

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/vrfpassword -a /tools/secrets/apicredentials
```

::: warning
節點帳號必須有足夠的 TRX 代幣，用於合約調用。 可以通過測試網水龍頭申請測試代幣。
:::

### 為節點添加 VRF 任務

以下是創建一個所需最少參數的 VRF 任務規範示例模版

```json
type = "vrf"
schemaVersion = 1
name = "vrf-delete-test"
forwardingAllowed = false
coordinatorAddress = "THE-SMART-CONTRACT-EIP55-COORDINATOR-ADDRESS"
fromAddresses = [ "THE-CURRENT-NODE-EIP55-ADDRESS" ]
minIncomingConfirmations = 1
publicKey = "THE-CURRENT-NODE-PUBLIC-KEY"
observationSource = """
decode   [type="tvmabidecodelog"]
vrf      [type=vrfbuilder]
tvmcall  [type=tvmcall contract="THE-SMART-CONTRACT-TRON-ADDRESS" extractRevertReason=true]

decode->vrf->tvmcall
"""
```

創建完成後，節點便可以處理收到的 VRF 請求。
