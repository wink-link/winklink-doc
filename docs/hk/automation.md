# WINkLink 自動化服務

## 概覽

用戶可使用 WINkLink 自動化服務實現含有自定義邏輯的合約的自動執行。該服務分爲鏈上註冊和鏈下服務兩部分，其中鏈下服務可持續監測並追蹤合約執行情況。

藉助 WINkLink 自動化服務，用戶可在受管理的 Registry 註冊其自定義邏輯合約。鏈下節點將與 Registry 進行交互，獲取需要根據特定標準執行的有效合約列表。

![automation-flow.png](~@source/images/automation-flow.png)

WINkLink 自動化解決方案由鏈上和鏈下兩部分組成：

- 自動化自定義邏輯合約（鏈上部分）：由用戶創建的合約，包含其定義的觸發條件和可執行邏輯。用戶需使用 WINK 代幣爲該合約提供資金併發起請求。
- 自動化 Registry 與 Registrar（鏈上部分）：該套合約負責追蹤、管理其他合約的註冊和運行狀態，同時保存並計算各個合約的資金。
- 自動化節點服務（鏈下節點）：訂閱事件日誌，監聽新註冊的合約以及對現有合約進行的修改。該服務每 3 秒檢查一次觸發條件，確保及時執行用戶邏輯。

### 合約

Nile 環境（測試環境）中部署了一組用於測試的合約。

| Item                     | Value                                                             |
|:-------------------------|:------------------------------------------------------------------|
| WIN Token                | TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2                                |
| WinkMid                  | TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro                                |
| AutomationForwarderLogic | TJh6cdC2yxuVoHQ3i72AyQVcJd5ZWcYK6m                                |
| KeeperRegistryLogicB     | TMCRXdfPaedr8mhoZCrA96P3dBEt8zRQwx                                |
| KeeperRegistryLogicA     | TCrR2XfAJDF3NyH6RL7xwpnebswzsesLK9                                |
| KeeperRegistry           | TQauX3xDe7NJdWeauYWfTv8u3hLaVecB7k                                |
| KeeperRegistrar          | TRrFfgs8p3f1MY3rxqnc9c1DrZKHkxZosd                                |
| AutomationRegistration   | TXj5cG2zxtofHoLWLXpecckSwmfDdnoXTa                                |

## 使用現有的 WINkLink 自動化服務

::: warning
當前部署的 `Consumer` 合約和任務僅爲示例，用於學習和測試。建議用戶自主設定任務規範，創建專屬的 `Consumer` 合約。例：TCvpP3Fu5nXMJqFJEVGdCZoLZoUfkDPcn2
:::

### 自動化註冊流程

1. 用戶創建自定義邏輯合約並部署上鍊。
2. 合約在 `Registrar` 中完成註冊，並在過程中創建了一個轉發器。
3. 用戶用 `addFunds` 方法在 `Registry` 中爲合約充值資金。

如需使用 WINkLink 的自動化功能，用戶需創建自己的 Consumer 合約和任務規範，併爲合約提供資金以發起請求。

### 自動化執行流程

1. WINkLink 節點獲取所有活躍用戶合約的列表，以便在啓動時進行檢查和執行操作。節點持續監聽新合約註冊、暫停、取消暫停以及現有合約取消的事件鏈。
2. 節點每三秒對活躍列表進行 `checkUpkeep`、`simulateUpkeep` 和 `performUpkeep` 操作。
3. 在執行下一階段之前，每一階段都需先返回一個正布爾值。
4. Wink 資金不足時合約無法執行。

## 啓動自動化服務節點

### 入門指南

WINkLink 的維護者需要對波場 TRON 有一定的瞭解，且熟悉智能合約的部署和調用流程。建議閱讀波場相關的官方文檔 ，尤其是在 TronIDE 進行合約部署的相關章節。

請參照節點賬戶準備文檔中的說明設置節點賬戶。

### 所需環境

WINkLink 節點依賴 PostgreSQL 數據庫。開發者可在 postgresql [官網](https://www.postgresql.org)的官方文檔中獲取更多信息。

::: tip
這裏假定本地部署的 PostgreSQL 實例的用戶名和密碼分別是 root:root。在生產環境中請使用強密碼或其他驗證方式。
:::

WINkLink 節點使用的編程語言爲 Go，因此需要搭建 Golang 環境。

### 節點配置

WINkLink 節點的配置文件格式爲 TOML，主配置文件爲 `tools/config/config.toml`。`secrets.toml` 文件用於指定要使用的數據庫實例。以下爲參考模板。

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

確認好節點配置文件後，需創建 `password` 和 `apicredentials` 文件，並寫入用戶 ID 和密碼以訪問節點 API：

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
請妥善託管您的個人信息。
:::

### 搭建節點 Docker 鏡像

使用以下指令構建標準的 Linux 鏡像：

```
# build a docker image
docker buildx build --platform linux/amd64 -t winklink-2.0 -f core/winklink.Dockerfile .
```

構建完成後，可爲鏡像打上標籤並推送到所需的存儲庫進行部署。

### 用源代碼啓動節點

安裝 [go1.21](https://go.dev/dl/)


前往 WINkLink-2.0 源代碼的基本目錄 (例如 `/path/to/winklink-2.0`).

使用以下指令搭建命令行界面

```
make install
```

使用以下指令及對應配置項啓動 WINkLink 節點：

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/password -a /tools/secrets/apicredentials
```

::: warning
節點賬戶必須持有足夠的 TRX 代幣進行合約調用。您可以通過測試網水龍頭申請測試代幣。
:::

### Registry 合約

```solidity
/// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.18;

import {EnumerableSet} from "../../vendor/openzeppelin-solidity/v4.7.3/contracts/utils/structs/EnumerableSet.sol";
import {Address} from "../../vendor/openzeppelin-solidity/v4.7.3/contracts/utils/Address.sol";
import {KeeperRegistryBase2_1} from "./KeeperRegistryBase2_1.sol";
import {KeeperRegistryLogicB2_1} from "./KeeperRegistryLogicB2_1.sol";
import {Chainable} from "./Chainable.sol";
import {TRC20ReceiverInterface} from "./TRC20ReceiverInterface.sol";
import {OCR2Abstract} from "./OCR2Abstract.sol";

/**
 * @notice Registry for adding work for Chainlink Keepers to perform on client
 * contracts. Clients must support the Upkeep interface.
 */
contract KeeperRegistry2_1 is KeeperRegistryBase2_1, OCR2Abstract, Chainable, TRC20ReceiverInterface {
    using Address for address;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    
    string public constant override typeAndVersion = "KeeperRegistry 2.1.0";

    /**
     * @param logicA the address of the first logic contract, but cast as logicB in order to call logicB functions
   */
    constructor(
        KeeperRegistryLogicB2_1 logicA
    )
    KeeperRegistryBase2_1(
    logicA.getMode(),
    logicA.getWinkAddress(),
    logicA.getWinkMid(),
    logicA.getWinkNativeFeedAddress(),
    // logicA.getFastGasFeedAddress(),
    logicA.getAutomationForwarderLogic(),
    logicA.getWinkPerPerform(),
    logicA.getWinkOverhead(),
    logicA.getWinkPremium()
    )
    Chainable(address(logicA))
    {}

    // ================================================================
    // |                           ACTIONS                            |
    // ================================================================

    /**
     * @inheritdoc OCR2Abstract
   */
    function transmit(
        bytes32[3] calldata reportContext,
        bytes calldata rawReport,
        bytes32[] calldata rs,
        bytes32[] calldata ss,
        bytes32 rawVs
    ) external override {
        uint256 gasOverhead = gasleft();
        HotVars memory hotVars = s_hotVars;

        if (hotVars.paused) revert RegistryPaused();
        if (!s_transmitters[msg.sender].active) revert OnlyActiveTransmitters();

        // Verify signatures
        if (s_latestConfigDigest != reportContext[0]) revert ConfigDigestMismatch();
        if (rs.length != hotVars.f + 1 || rs.length != ss.length) revert IncorrectNumberOfSignatures();
        _verifyReportSignature(reportContext, rawReport, rs, ss, rawVs);

        Report memory report = _decodeReport(rawReport);
        UpkeepTransmitInfo[] memory upkeepTransmitInfo = new UpkeepTransmitInfo[](report.upkeepIds.length);
        uint16 numUpkeepsPassedChecks;

        for (uint256 i = 0; i < report.upkeepIds.length; i++) {
            upkeepTransmitInfo[i].upkeep = s_upkeep[report.upkeepIds[i]];
            upkeepTransmitInfo[i].triggerType = _getTriggerType(report.upkeepIds[i]);
            upkeepTransmitInfo[i].maxWinkPayment = _getMaxWinkPayment(
                hotVars,
                upkeepTransmitInfo[i].triggerType,
                uint32(report.gasLimits[i]),
                uint32(report.performDatas[i].length),
                report.winkNative
            );
            (upkeepTransmitInfo[i].earlyChecksPassed, upkeepTransmitInfo[i].dedupID) = _prePerformChecks(
                report.upkeepIds[i],
                report.triggers[i],
                upkeepTransmitInfo[i]
            );

            if (upkeepTransmitInfo[i].earlyChecksPassed) {
                numUpkeepsPassedChecks += 1;
            } else {
                continue;
            }

            // Actually perform the target upkeep
            (upkeepTransmitInfo[i].performSuccess, upkeepTransmitInfo[i].gasUsed) = _performUpkeep(
                upkeepTransmitInfo[i].upkeep.forwarder,
                report.gasLimits[i],
                report.performDatas[i]
            );

            // Deduct that gasUsed by upkeep from our running counter
            gasOverhead -= upkeepTransmitInfo[i].gasUsed;

            // Store last perform block number / deduping key for upkeep
            _updateTriggerMarker(report.upkeepIds[i], upkeepTransmitInfo[i]);
        }
        // No upkeeps to be performed in this report
        if (numUpkeepsPassedChecks == 0) {
            return;
        }

        // This is the overall gas overhead that will be split across performed upkeeps
        // Take upper bound of 16 gas per callData bytes, which is approximated to be reportLength
        // Rest of msg.data is accounted for in accounting overheads
        gasOverhead =
            (gasOverhead - gasleft() + 16 * rawReport.length) +
            ACCOUNTING_FIXED_GAS_OVERHEAD +
            (ACCOUNTING_PER_SIGNER_GAS_OVERHEAD * (hotVars.f + 1));
        gasOverhead = gasOverhead / numUpkeepsPassedChecks + ACCOUNTING_PER_UPKEEP_GAS_OVERHEAD;

        uint96 totalReimbursement;
        uint96 totalPremium;
        {
            uint96 reimbursement;
            uint96 premium;
            for (uint256 i = 0; i < report.upkeepIds.length; i++) {
                if (upkeepTransmitInfo[i].earlyChecksPassed) {
                    upkeepTransmitInfo[i].gasOverhead = _getCappedGasOverhead(
                        gasOverhead,
                        upkeepTransmitInfo[i].triggerType,
                        uint32(report.performDatas[i].length),
                        hotVars.f
                    );

                    (reimbursement, premium) = _postPerformPayment(
                        report.upkeepIds[i],
                        upkeepTransmitInfo[i],
                        report.winkNative
                    );
                    totalPremium += premium;
                    totalReimbursement += reimbursement;

                    emit UpkeepPerformed(
                        report.upkeepIds[i],
                        upkeepTransmitInfo[i].performSuccess,
                        reimbursement + premium,
                        upkeepTransmitInfo[i].gasUsed,
                        upkeepTransmitInfo[i].gasOverhead,
                        report.triggers[i]
                    );
                }
            }
        }
        // record payments
        s_transmitters[msg.sender].balance += totalReimbursement;
        s_hotVars.totalPremium += totalPremium;

        uint40 epochAndRound = uint40(uint256(reportContext[1]));
        uint32 epoch = uint32(epochAndRound >> 8);
        if (epoch > hotVars.latestEpoch) {
            s_hotVars.latestEpoch = epoch;
        }
    }

    function performUpkeep(
        uint256 upkeepId,
        uint256 gasLimit,
        bytes calldata performData)
    external onlyAuthorizedTriggeringNodes(msg.sender) {
        uint96 winkPayment;
        uint96 premium;

        Upkeep memory performableUpkeep = s_upkeep[upkeepId];
        (bool success,) = _performUpkeep(performableUpkeep.forwarder, gasLimit, performData);
        if (!success) revert PerformUpkeepFailed();
        (winkPayment, premium) = _calculatePaymentAmount(
            s_winkPerPerform,
            s_winkOverhead,
            1
        );
        uint96 payment = winkPayment + premium;
        s_upkeep[upkeepId].balance -= payment;
        s_upkeep[upkeepId].amountSpent += payment;
        s_hotVars.totalPremium += payment;
        Trigger trigger = _getTriggerType(upkeepId);

        emit UpkeepPerformed(
            upkeepId,
            success,
            winkPayment + premium,
            s_winkPerPerform,
            s_winkOverhead,
            trigger
        );
    }

    /**
     * @notice simulates the upkeep with the perform data returned from checkUpkeep
   * @param id identifier of the upkeep to execute the data with.
   * @param performData calldata parameter to be passed to the target upkeep.
   * @return success whether the call reverted or not
   * @return gasUsed the amount of gas the target contract consumed
   */
    function simulatePerformUpkeep(
        uint256 id,
        bytes calldata performData
    ) external view returns (bool success, uint256 gasUsed) {
        if (s_hotVars.paused) revert RegistryPaused();
        Upkeep memory upkeep = s_upkeep[id];
        bytes memory simulatePerformCallData = abi.encodeWithSelector(SIMULATE_PERFORM_SELECTOR, performData);
        bytes memory forwardCallData = abi.encodeWithSelector(FORWARD_SELECTOR, upkeep.performGas, simulatePerformCallData);

        (bool forwardSuccess, bytes memory result) = address(upkeep.forwarder).staticcall{gas: s_storage.maxPerformGas}(forwardCallData);
        if (!forwardSuccess) revert StaticCallFailed();
        (success, gasUsed) = abi.decode(result, (bool, uint256));

        return (success, gasUsed);
    }

    /**
     * @notice uses WINK's transferAndCall to LINK and add funding to an upkeep
   * @dev safe to cast uint256 to uint96 as total LINK supply is under UINT96MAX
   * @param sender the account which transferred the funds
   * @param amount number of LINK transfer
   */
    function onTokenTransfer(address sender, uint64 amount, bytes calldata data) external override {
        if (msg.sender != address(i_winkMid)) revert OnlyCallableByWINKToken();
        if (data.length != 32) revert InvalidDataLength();
        uint256 id = abi.decode(data, (uint256));
        if (s_upkeep[id].maxValidBlocknumber != UINT32_MAX) revert UpkeepCancelled();
        s_upkeep[id].balance = s_upkeep[id].balance + uint96(amount);
        s_expectedWinkBalance = s_expectedWinkBalance + amount;
        emit FundsAdded(id, sender, uint96(amount));
    }

    // ================================================================
    // |                           SETTERS                            |
    // ================================================================

    /**
     * @inheritdoc OCR2Abstract
   * @dev prefer the type-safe version of setConfig (below) whenever possible
   */
    function setConfig(
        address[] memory signers,
        address[] memory transmitters,
        uint8 f,
        bytes memory onchainConfigBytes,
        uint64 offchainConfigVersion,
        bytes memory offchainConfig
    ) external override {
        setConfigTypeSafe(
            signers,
            transmitters,
            f,
            abi.decode(onchainConfigBytes, (OnchainConfig)),
            offchainConfigVersion,
            offchainConfig
        );
    }

    function setConfigTypeSafe(
        address[] memory signers,
        address[] memory transmitters,
        uint8 f,
        OnchainConfig memory onchainConfig,
        uint64 offchainConfigVersion,
        bytes memory offchainConfig
    ) public onlyOwner {
        if (signers.length > MAX_NUM_ORACLES) revert TooManyOracles();
        if (f == 0) revert IncorrectNumberOfFaultyOracles();
//    if (signers.length != transmitters.length || signers.length <= 3 * f) revert IncorrectNumberOfSigners();

        // move all pooled payments out of the pool to each transmitter's balance
        uint96 totalPremium = s_hotVars.totalPremium;
        uint96 oldLength = uint96(s_transmittersList.length);
        for (uint256 i = 0; i < oldLength; i++) {
            _updateTransmitterBalanceFromPool(s_transmittersList[i], totalPremium, oldLength);
        }

        // remove any old signer/transmitter addresses
        address signerAddress;
        address transmitterAddress;
        for (uint256 i = 0; i < oldLength; i++) {
            signerAddress = s_signersList[i];
            transmitterAddress = s_transmittersList[i];
            delete s_signers[signerAddress];
            // Do not delete the whole transmitter struct as it has balance information stored
            s_transmitters[transmitterAddress].active = false;
        }
        delete s_signersList;
        delete s_transmittersList;

        // add new signer/transmitter addresses
        {
            Transmitter memory transmitter;
            for (uint256 i = 0; i < signers.length; i++) {
                if (s_signers[signers[i]].active) revert RepeatedSigner();      address temp;

                if (signers[i] == ZERO_ADDRESS) revert InvalidSigner();
                s_signers[signers[i]] = Signer({active: true, index: uint8(i)});

                temp = transmitters[i];
                if (temp == ZERO_ADDRESS) revert InvalidTransmitter();
                transmitter = s_transmitters[temp];
                if (transmitter.active) revert RepeatedTransmitter();
                transmitter.active = true;
                transmitter.index = uint8(i);
                // new transmitters start afresh from current totalPremium
                // some spare change of premium from previous pool will be forfeited
                transmitter.lastCollected = totalPremium;
                s_transmitters[temp] = transmitter;
            }
        }
        s_signersList = signers;
        s_transmittersList = transmitters;

        s_hotVars = HotVars({
            f: f,
            paymentPremiumPPB: onchainConfig.paymentPremiumPPB,
            flatFeeMicroWink: onchainConfig.flatFeeMicroWink,
            stalenessSeconds: onchainConfig.stalenessSeconds,
            gasCeilingMultiplier: onchainConfig.gasCeilingMultiplier,
            paused: s_hotVars.paused,
            reentrancyGuard: s_hotVars.reentrancyGuard,
            totalPremium: totalPremium,
            latestEpoch: 0 // DON restarts epoch
        });

        s_storage = Storage({
            checkGasLimit: onchainConfig.checkGasLimit,
            minUpkeepSpend: onchainConfig.minUpkeepSpend,
            maxPerformGas: onchainConfig.maxPerformGas,
            maxCheckDataSize: onchainConfig.maxCheckDataSize,
            maxPerformDataSize: onchainConfig.maxPerformDataSize,
            maxRevertDataSize: onchainConfig.maxRevertDataSize,
            upkeepPrivilegeManager: onchainConfig.upkeepPrivilegeManager,
            nonce: s_storage.nonce,
            configCount: s_storage.configCount,
            latestConfigBlockNumber: s_storage.latestConfigBlockNumber,
            ownerWinkBalance: s_storage.ownerWinkBalance
        });
        s_fallbackGasPrice = onchainConfig.fallbackGasPrice;
        s_fallbackWinkPrice = onchainConfig.fallbackWinkPrice;

        uint32 previousConfigBlockNumber = s_storage.latestConfigBlockNumber;
        s_storage.latestConfigBlockNumber = uint32(_blockNum());
        s_storage.configCount += 1;

        bytes memory onchainConfigBytes = abi.encode(onchainConfig);

        s_latestConfigDigest = _configDigestFromConfigData(
            block.chainid,
            address(this),
            s_storage.configCount,
            signers,
            transmitters,
            f,
            onchainConfigBytes,
            offchainConfigVersion,
            offchainConfig
        );

        for (uint256 idx = 0; idx < s_registrars.length(); idx++) {
            s_registrars.remove(s_registrars.at(idx));
        }

        for (uint256 idx = 0; idx < onchainConfig.registrars.length; idx++) {
            s_registrars.add(onchainConfig.registrars[idx]);
        }

        emit ConfigSet(
            previousConfigBlockNumber,
            s_latestConfigDigest,
            s_storage.configCount,
            signers,
            transmitters,
            f,
            onchainConfigBytes,
            offchainConfigVersion,
            offchainConfig
        );
    }

    // ================================================================
    // |                           GETTERS                            |
    // ================================================================

    /**
     * @inheritdoc OCR2Abstract
   */
    function latestConfigDetails()
    external
    view
    override
    returns (uint32 configCount, uint32 blockNumber, bytes32 configDigest)
    {
        return (s_storage.configCount, s_storage.latestConfigBlockNumber, s_latestConfigDigest);
    }

    /**
     * @inheritdoc OCR2Abstract
   */
    function latestConfigDigestAndEpoch()
    external
    view
    override
    returns (bool scanLogs, bytes32 configDigest, uint32 epoch)
    {
        return (false, s_latestConfigDigest, s_hotVars.latestEpoch);
    }
}
```
## 設置 Automation 合約以及任務

### WinkMid 合約

WINkLink 採用 WIN 代幣（TRC20）作爲整個生態的基礎代幣。

WINkLink 使用了 `transferAndCall` 功能，即在轉賬 `TRC20` 代幣給合約的同時調用合約的某一回調函數，該功能類似 `ERC677`，但接口參數不同。

考慮到絕大多數已發行的代幣無法再修改合約或增加接口，`WINkLink` 提供 `WinkMid` 包裝合約，可用來包裝任一 `TRC20` 代幣，並提供 `transferAndCall` 接口。

合約代碼可在 `WinkMid.sol` 查看。

WinkMid 合約已部署至 Nile 測試網，並封裝了 WIN 代幣。開發者可直接使用該合約地址，無需額外部署。Nile 測試網還提供水龍頭地址，用戶可以領取 TRX 和 WIN 測試代幣。

::: tip
**Nile 測試網**

WIN TRC20 合約地址: TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2

WinkMid 合約地址: TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro

測試水龍頭: <https://nileex.io/join/getJoinPage>
:::

部署 WinkMid 合約時，開發者需在構造函數中提供被封裝的 `TRC20` 代幣地址（即 WIN 代幣地址）。

WinkMid 合約是其他合約的輔助工具，因此開發者可以直接使用其功能而無需調用它。

部署 Registry 合約時需在構造函數中提供 WIN 代幣地址和 WinkMid 合約地址。

### Registry 和 Registrar 合約

Registry 合約是負責管理新合約註冊的主要合約。請使用合約代碼本身指定的相應參數進行部署。

爲了管理複雜的邏輯，Registry 合約包括 LogicB、LogicA 和 Registry 組件；進行部署時請務必按照上述順序依次部署。

在部署 Registry 合約後，需要通過使用 setAuthorizedSender 方法將 Oracle 添加到列表中，以便批准執行  `performUpkeep` 操作。

### Upkeep 合約

下例展示了每次執行時遞增 1 的一個簡單計數器合約。

該合約在部署期間接收以秒爲單位的參數，用於指定觸發所需的時間間隔。

### 自定義邏輯 upkeep

下面是一個請求自定義邏輯upkeep的用戶合約示例。

該合約簡單展示了用戶可以使用自動化功能進行邏輯自定義。它會運行一個計數器，在時間間隔條件滿足時遞增 1。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol
import "./AutomationCompatibleInterface.sol";
import "./OwnerIsCreator.sol";

/**
 * @dev Example contract, use the Forwarder as needed for additional security.
 *
 * @notice important to implement {AutomationCompatibleInterface}
 */

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract Counter is AutomationCompatibleInterface, OwnerIsCreator {
    /**
     * Public counter variable
     */
    uint256 public counter;

    /**
     * Use an interval in seconds and a timestamp to slow execution of Upkeep
     */
    uint256 public immutable interval;
    uint256 public lastTimeStamp;
    address public s_forwarderAddress;


    constructor(uint256 updateInterval) {
        interval = updateInterval;
        lastTimeStamp = block.timestamp;

        counter = 0;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
    external
    view
    override
    returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        require(
            msg.sender == s_forwarderAddress,
            "This address does not have permission to call performUpkeep"
        );
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
            counter = counter + 1;
        }
        // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
    }

    // Used to perform a dry run and return if the logic failed
    function simulatePerformUpkeep(bytes calldata /* performData */) external view override returns (bool performSuccess) {
        uint256 simulateCounter = counter;
        uint256 simmulateLastTimeStamp;
        if ((block.timestamp - lastTimeStamp) > interval) {
            simmulateLastTimeStamp = block.timestamp;
            simulateCounter = simulateCounter + 1;
        }

        if (simulateCounter == counter + 1) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Set the address that `performUpkeep` is called from
    /// @dev Only callable by the owner
    /// @param forwarderAddress the address to set
    function setForwarderAddress(address forwarderAddress) external onlyOwner {
        s_forwarderAddress = forwarderAddress;
    }
}
```

每個用戶定義的合約都需要實現 `AutomationCompatibleInterface`  及其方法，這樣 Registry 便能在執行期間獲取相應的方法簽名。

`checkUpkeep`: 節點檢查以確定是否需要執行維護的邏輯。

`simulateUpkeep`: 節點靜態調用來模擬核心邏輯的運行。

`performUpkeep`: 需要執行的核心邏輯。

### 節點

我們在節點中添加任務規範來支持獲取所有數據和相應的數據變換。

```toml
type = "keeper"
schemaVersion = 1
name = "keeper"
gasLimit = 1_000_000_000
forwardingAllowed = false
contractAddress = "<Registry Address>"
tvmChainID = 3448148188
fromAddress = "<Node Address>"
```

Keeper 任務規範指定了用於鏈上合約交互的 Registry 地址和節點地址。