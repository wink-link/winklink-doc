# WINkLink Automation Service

## Overview

The automation services enables users to automate contracts containing custom logic. This automation is achieved though on-chain registration and an off-chain service that continuously monitors and tracks contracts for execution.

This service allows users to register their custom logic contract with a managed central registry. The off-chain node will interact with the registry to obtain the list of active contracts that needed to be executed based on individual criteria.

![automation-flow.png](~@source/images/automation-flow.png)

The WINkLink Automation solution contains both off-chain and on-chain components:

- Automation Custom Logic contract (on-chain component): A user-created contract with defined trigger conditions and executable logic. Users are required to fund this contract with WINK tokens and initiate the request.
- Automation Registry & Registrar (on-chain component): These are a set of contracts designed to track and manage both the registration and the operational states of other contracts. Funds for individual contracts are also kept and calculated.
- Automation Node service (off-chain node): Subscribed to event logs to listen for new registered contracts and modifications to existing contracts. It also checks the trigger condition every 3 seconds to ensure timely execution of the user's logic.

### Contracts

A set of contracts are deployed in the nile environment for testing

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

## How to use existing WINkLink Automation

::: warning
Consumer contracts and jobs deployed are only provided as a sample for learning and testing. Users are advised to craft their own consumer contracts with bespoke jobs specifications.
e.g TCvpP3Fu5nXMJqFJEVGdCZoLZoUfkDPcn2
:::

### Automation Registration Process

1. User creates a custom logic contract and deployed on chain.
2. The contract is registered with the registrar with a forwarder created during the process.
3. User tops ups their own contract in the registry using the `addFunds` method

To utilize WINkLink's Automation feature, users have to craft their own consumer contracts and job specifications and fund these contracts to initiate requests.

### Automation execution Process

1. The WINkLink node obtains the list of all active user contracts for checking and execution on startup. It continuously listens for the chain events for new contract registration, pauses, unpauses and cancellation of existing contracts.
2. Every 3 seconds, the node will take the active list and `checkUpkeep`, `simulateUpkeep`, `performUpkeep`.
3. Each stage has to return a positive boolean result before the next stage can be executed.
4. Contracts will not execute if Wink funds is insufficient.

## How to launch an Automation Service Node

### Getting started


Maintainers for WINkLink need to understand how the TRON platform works, and know about smart contract deployment and the process of calling them. It is suggested to read related TRON official documentation, particularly the section on contract deployment on TronIDE.

The node account should be prepared according to the instructions in the Node account preparation documentation.

### Required Environment

WINkLink node relies on a running PostgreSQL database. Developers can find more information in the official documentation [postgresql official site](https://www.postgresql.org) .

::: tip
Here we assume that the username and the password for the PostgreSQL instance deployed locally are root:root respectively. Please use a strong password or other verification methods in the production environment.
:::

WINkLink node is written in Go programming language and requires Golang environment.

### Node Configuration

WINkLink node is configured using TOML files. The main configuration files is `tools/config/config.toml`. The `secrets.toml` file is used to specify the database instance to be used. Below is a sample template for reference.

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
After the node configuration file is confirmed, it is required to create `password` and `apicredentials` files and write the userid and password to access the node’s api:

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
It is important that you keep private information safe.
:::

### Building a docker image for the node

Use the following command to build a standard linux docker image:

```
# build a docker image
docker buildx build --platform linux/amd64 -t winklink-2.0 -f core/winklink.Dockerfile .
```

After building, the image can be tagged and pushed to the desired repository for deployment.

### Start a Node from source code

Install [go1.21](https://go.dev/dl/)
 

Navigate to the base directory of Winklink-2.0 source code (e.g. `/path/to/winklink-2.0`).

Build the command line interface with

```
make install
```

Start your WINkLink node using the following command with the respective configuration items:

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/password -a /tools/secrets/apicredentials
```

::: warning
The node account must have sufficient TRX tokens for contract calls. Testnet tokens can be obtained from the Testnet Faucet.
:::

### Registry Contract

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
## How to setup Automation contracts and jobs

### WinkMid Contract

WINkLink uses WIN (TRC20) as the base token for the whole platform.

WINkLink adopts the `transferAndCall` feature, i.e. calling one of the callback functions while transferring `TRC20` tokens to contracts, a feature similar to `ERC677` yet adopting different interface parameters.

Given that we cannot modify contracts or add interfaces for most of the tokens issued, WINkLink provides WinkMid wrapper contract, which helps wrapping any TRC20 token and provides transferAndCall interface.

The contract code is available at `WinkMid.sol`.

 The WinkMid contract has been deployed on Nile TestNet and the Win token has been encapsulated within it. Developers may use this contract address directly without additional deployment. Users may also claim test TRX and WIN tokens from the Faucet address provided by Nile TestNet.

::: tip
**Nile Testnet**

WIN TRC20 Contract Address: TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2

WinkMid Contract Address: TLLEKGqhH4MiN541BDaGpXD7MRkwG2mTro

Testnet Faucet: <https://nileex.io/join/getJoinPage>
:::

When deploying WinkMid contract, developers need to provide the encapsulated `TRC20` token address (i.e. WIN token address) for the constructor.

The WinkMid contract is designed as a helper for other contracts, so developers can utilize its functionality without directly calling it.

WIN token address and WinkMid contract address are required arguments in the constructor function when deploying a Coordinator contract.


### Registry and Registrar Contract

The registry contract is the primary contract for managing all new contract registrations. Deploy with the respective arguments specified within contract code itself.

To manage the complex logic, the registry contract is divided into LogicB, LogicA and Registry components, which must be deployed in that order.

After deploying the Registry contract, Oracle needs to be approved for `performUpkeep` by adding it to the list using setAuthorizedSender method.

### Upkeep Contract

The example below demonstrates a simple counter contract that increments by 1 with each execution.

During deployment, it takes in an argument in seconds to specify the interval that needs it to be triggered.

### Custom logic upkeep

This example provides a sample user contract that request for a custom logic upkeep.

The contract serves as a simple demonstration on the custom logic a user can have using the automation feature. This simple contract will run a counter for which will increment one whenever the condition of the time interval is met.

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

Every user defined contract is required to implement `AutomationCompatibleInterface` and its methods. This is to allow the registry to be able to pick up the corresponding method signature during execution.

`checkUpkeep`: Logic that is checked by the node to determine if the upkeep needs to be performed.

`simulateUpkeep`: A static call for node to simulate the run of the core logic.

`performUpkeep`: Core logic that is to be executed.

### Node

In the node, we add the job specification to support getting all the data and respective transformations

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

The keeper job specs specifies the registry address and the node address that is used to interact with the on-chain contracts.