# WINkLink 自动化服务

## 概览

用户可使用 WINkLink 自动化服务实现含有自定义逻辑的合约的自动执行。该服务分为链上注册和链下服务两部分，其中链下服务可持续监测并追踪合约执行情况。

借助 WINkLink 自动化服务，用户可在受管理的 Registry 注册其自定义逻辑合约。链下节点将与 Registry 进行交互，获取需要根据特定标准执行的有效合约列表。

![automation-flow.png](~@source/images/automation-flow.png)

WINkLink 自动化解决方案由链上和链下两部分组成：

- 自动化自定义逻辑合约（链上部分）：由用户创建的合约，包含其定义的触发条件和可执行逻辑。用户需使用 WINK 代币为该合约提供资金并发起请求。
- 自动化 Registry 与 Registrar（链上部分）：该套合约负责追踪、管理其他合约的注册和运行状态，同时保存并计算各个合约的资金。
- 自动化节点服务（链下节点）：订阅事件日志，监听新注册的合约以及对现有合约进行的修改。该服务每 3 秒检查一次触发条件，确保及时执行用户逻辑。

### 合约

Nile 环境（测试环境）中部署了一组用于测试的合约。

| 项目                       | 数值                                 |
|:-------------------------|:-----------------------------------|
| WIN Token                | TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2 |
| WinkMid                  | TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro |
| AutomationForwarderLogic | TJh6cdC2yxuVoHQ3i72AyQVcJd5ZWcYK6m |
| KeeperRegistryLogicB     | TMCRXdfPaedr8mhoZCrA96P3dBEt8zRQwx |
| KeeperRegistryLogicA     | TCrR2XfAJDF3NyH6RL7xwpnebswzsesLK9 |
| KeeperRegistry           | TQauX3xDe7NJdWeauYWfTv8u3hLaVecB7k |
| KeeperRegistrar          | TRrFfgs8p3f1MY3rxqnc9c1DrZKHkxZosd |
| AutomationRegistration   | TXj5cG2zxtofHoLWLXpecckSwmfDdnoXTa |

## 使用现有的 WINkLink 自动化服务

::: warning
当前部署的 Consumer 合约和任务仅为示例，用于学习和测试。建议用户自主设定任务规范，创建专属的 Consumer 合约。例：TCvpP3Fu5nXMJqFJEVGdCZoLZoUfkDPcn2
:::

### 自动化注册流程

1. 用户创建自定义逻辑合约并部署上链。
2. 合约在 `Registrar` 中完成注册，并在过程中创建了一个转发器。
3. 用户用 `addFunds` 方法在 `Registry` 中为合约充值资金。

如需使用 WINkLink 的自动化功能，用户需创建自己的 Consumer 合约和任务规范，并为合约提供资金以发起请求。

### 自动化执行流程

1. WINkLink 节点获取所有活跃用户合约的列表，以便在启动时进行检查和执行操作。节点持续监听新合约注册、暂停、取消暂停以及现有合约取消的事件链。
2. 节点每三秒对活跃列表进行 `checkUpkeep`、`simulateUpkeep` 和 `performUpkeep` 操作。
3. 在执行下一阶段之前，每一阶段都需先返回一个正布尔值。
4. Wink 资金不足时合约无法执行。

## 启动自动化服务节点

### 入门指南

WINkLink 的维护者需要对波场 TRON 有一定的了解，且熟悉智能合约的部署和调用流程。建议阅读波场相关的官方文档 ，尤其是在 TronIDE 进行合约部署的相关章节。

请参照节点账户准备文档中的说明设置节点账户。

### 所需环境

WINkLink 节点依赖 PostgreSQL 数据库。开发者可在 postgresql [官网](https://www.postgresql.org)的官方文档中获取更多信息。

::: tip
这里假定本地部署的 PostgreSQL 实例的用户名和密码分别是 root:root。在生产环境中请使用强密码或其他验证方式。
:::

WINkLink 节点使用的编程语言为 Go，因此需要搭建 Golang 环境。

### 节点配置

WINkLink 节点的配置文件格式为 TOML，主配置文件为 `tools/config/config.toml`。`secrets.toml` 文件用于指定要使用的数据库实例。以下为参考模板。

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

确认好节点配置文件后，需创建 password 和 apicredentials 文件，并写入用户 ID 和密码以访问节点 API：

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

构建完成后，可为镜像打上标签并推送到所需的存储库进行部署。

### 用源代码启动节点

安装 [go1.21](https://go.dev/dl/)


前往 WINkLink-2.0 源代码的基本目录（例如 `/path/to/winklink-2.0`).

使用以下指令搭建命令行界面

```
make install
```

使用以下指令及对应配置项启动 WINkLink 节点：

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/password -a /tools/secrets/apicredentials
```

::: warning
节点账户必须持有足够的 TRX 代币进行合约调用。您可以通过测试网水龙头申请测试代币。
:::

### Registry 合约

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
## 设置 Automation 合约以及任务

### WinkMid 合约

WINkLink 采用 WIN 代币（TRC20）作为整个生态的基础代币。

WINkLink 使用了 `transferAndCall` 功能，即在转账 `TRC20` 代币给合约的同时调用合约的某一回调函数，该功能类似 `ERC677`，但接口参数不同。

考虑到绝大多数已发行的代币无法再修改合约或增加接口，`WINkLink` 提供 `WinkMid` 包装合约，可用来包装任一 `TRC20` 代币，并提供 `transferAndCall` 接口。

合约代码可在 `WinkMid.sol` 查看。

WinkMid 合约已部署至 Nile 测试网，并封装了 WIN 代币。开发者可直接使用该合约地址，无需额外部署。Nile 测试网还提供水龙头地址，用户可以领取 TRX 和 WIN 测试代币。

::: tip
**Nile 测试网**

WIN TRC20 合约地址: TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2

WinkMid 合约地址: TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro

测试水龙头: <https://nileex.io/join/getJoinPage>
:::

部署 WinkMid 合约时，开发者需在构造函数中提供被封装的 `TRC20` 代币地址（即 WIN 代币地址）。

WinkMid 合约是其他合约的辅助工具，因此开发者可以直接使用其功能而无需调用它。

部署 Registry 合约时需在构造函数中提供 WIN 代币地址和 WinkMid 合约地址。

### Registry 和 Registrar 合约

Registry 合约是负责管理新合约注册的主要合约。请使用合约代码本身指定的相应参数进行部署。

为了管理复杂的逻辑，Registry 合约包括 LogicB、LogicA 和 Registry 组件；进行部署时请务必按照上述顺序依次部署。

在部署 Registry 合约后，需要通过使用 `setAuthorizedSender` 方法将 Oracle 添加到列表中，以便批准执行 `performUpkeep` 操作。

### Upkeep 合约

下例展示了每次执行时递增 1 的一个简单计数器合约。

该合约在部署期间接收以秒为单位的参数，用于指定触发所需的时间间隔。

### 自定义逻辑 upkeep

下面是一个请求自定义逻辑upkeep的用户合约示例。

该合约简单展示了用户可以使用自动化功能进行逻辑自定义。它会运行一个计数器，在时间间隔条件满足时递增 1。

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

每个用户定义的合约都需要实现 `AutomationCompatibleInterface` 及其方法，这样 Registry 便能在执行期间获取相应的方法签名。

`checkUpkeep`: 节点检查以确定是否需要执行维护的逻辑

`simulateUpkeep`: 节点静态调用来模拟核心逻辑的运行

`performUpkeep`: 需要执行的核心逻辑

### 节点

我们在节点中添加任务规范来支持获取所有数据和相应的数据变换。

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

Keeper 任务规范指定了用于链上合约交互的 Registry 地址和节点地址。