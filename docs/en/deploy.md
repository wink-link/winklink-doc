# Deploy WINkLink Node

This section explains how to join in the WINkLink ecosystem, including deploying oracle contracts and deploying WINkLink node.

Currently, the owner of oracle contract is also the operator of the node on WINkLink. With regard to distribution of proceeds, Oracle node accounts process and submit data, and only owners of the oracle contract are entitled to withdraw the handling fees paid by Oracle contract users.

## Before you start

Maintainers for WINkLink need to understand how the TRON platform works, and know about smart contract deployment and the process of calling them. You're suggested to read related [TRON official documents](https://cn.developers.tron.network/), particularly those on contract deployment on TronIDE.

## Contract Deployment

Employing a decentralized structure, WINkLink features open-source smart contracts and allows any organization or individual to deploy their WINkLink oracle contracts and release these services to the public.

Users may pick their sets from all the open services available on WINkLink to create their own aggregated data contracts and benefit from decentralization.

Contract address for the project is hosted at: <https://github.com/wink-link/winklink/tree/master/tvm-contracts/v1.0>.

To compile it, developers need to use [tron-solidity v0.4.25](https://github.com/tronprotocol/solidity/releases/tag/0.4.25_Odyssey_v3.2.3) (or choose the corresponding version from TronIDE).

You may use any of the following tools or libraries for contract deployment and call testing:

- [Official wallet-cli](https://github.com/tronprotocol/wallet-cli)
- [TronIDE](https://cn.developers.tron.network/docs/ide%E5%85%A5%E9%97%A8)
- [TronBox](https://cn.developers.tron.network/docs/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E9%83%A8%E7%BD%B2)
- [tronweb](https://cn.developers.tron.network/reference#tronwebcontractnew)

### WinkMid Contract

WINkLink uses WIN (TRC20) as the base token for the whole platform.

WINkLink adopts the `transferAndCall` feature, i.e. calling one of the callback functions while transferring TRC20 tokens to contracts, a feature similar to [ERC677](https://github.com/ethereum/EIPs/issues/677) yet adopting different interface parameters.

Given that we cannot modify contracts or add interfaces for most of the tokens issued, WINkLink provides `WinkMid` wrapper contract, which helps wrapping any TRC20 token and provides `transferAndCall` interface.

The contract code is available at [WinkMid.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/WinkMid.sol).

For convenience, Nile TestNet has deployed `WinkMid` contract and encapsulated the `WIN` token on it. Developers may use this contract address directly without additional deployment. Users may also claim test TRX and WIN tokens from the Faucet address provided by Nile TestNet.

::: tip Nile Testnet

- WIN TRC20 Contract Address: `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7`
- WinkMid Contract Address: `TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb`
- Testnet Faucet: <https://nileex.io/join/getJoinPage>
  :::

When deploying WinkMid contract, developers need to provide the encapsulated TRC20 token address (i.e. WIN token address) for the constructor.

Developers do not need to call `WinkMid` contract directly, as it's wink a helper for caller contracts.

### Oracle Contract

Oracle contract is deployed on the TRON public chain with the following features:

- Receive data requests from Consumer Contract and trigger Event Log
  - WIN transfer as fees, will be sent along with the data request
- Accept data submitted from WINkLink node
  - WINkLink node monitors Event Log and then learns about the data request
  - Through job configuration, nodes call the corresponding adaptors of different data requests to obtain external data and trigger Oracle contracts to submit data
  - Trigger the callback function of the consumer contract
- Support cancelling data requests
- Calculate the WIN fee on data requests and claim rewards

Contract code is available at [TronOracles.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/TronOracles.sol).

WIN token address and WinkMid contract address are needed in the constructor function when deploying an Oracle contract.

Oracle contract implements the `Ownable` interface. The owner of the contract is eligible for managing rewards or destroying the contract.

## Node Deployment

WINkLink node can be deployed after the contract is deployed.

WINkLink node (project directory `node`) code is available at: https://github.com/wink-link/winklink/tree/master/node.

::: warning
Current node implementation includes the adapter for accessing token price via exchange APIs. Please run the node in a stable network environment outside Mainland China.
:::

### Prepare Node Account

Each WINkLink node must be linked to a TRON account for calling Oracle contract to submit data.

After generating the account address and the private key, the developer can test TRX token on the Testnet Faucet page.The token is used for paying the handling fees on calling the smart contracts.

Developers can generate account address and private key via one of the following methods:

- [Official wallet-cli](https://github.com/tronprotocol/wallet-cli)
- [Generate Address Offline](https://andelf.gitbook.io/tron/tron-by-example/generate-address-offline)
- [trident](https://github.com/tronprotocol/trident/tree/main/trident-java)

::: warning
Your private key might get leaked if it is transmitted via an untrusted network. Please generate the address and the private key offline.
:::

### Required Environment

WINkLink node relies on a running MySQL instance. Developers can use the system package manager or Docker of the target environment to deploy a MySQL instance.

::: tip
Here we assume that the username and the password for the MySQL instance deployed locally are `root:root` respectively. Please use a strong password or other verification methods in the production environment.
:::

WINkLink node is written in Java language and requires JRE/JDK environment. It is recommended to use Oracle JDK8.

WINkLink node requires a nodejs environment. You need to install Nodejs(npm) >= 10.0.

### Access Executable Program for the Node

Developers can download from [Github Release](https://github.com/wink-link/winklink/releases) page the latest version of WINkLink node executable `node-v1.0.jar`。

Or you can compile following the steps below:

```sh
# jdk8 and nodejs(npm) >= 10.0 are needed
git clone git@github.com:wink-link/winklink.git
cd winklink/

# compile
./gradlew build -x test
```

After compilation, `node-v1.0.jar` will be stored in `node/build/libs/` under the project source code directory.

::: warning
The compilation process here omits the test (`-x test`), because the test instance includes the API test instance for token price on exchanges, which will require a stable network environment outside Mainland China.
:::

### Node Configuration

WINkLink node is configured using springboot.
All configuration files are under the subdirectory `node/src/main/resource`.
With `application.yml` you can specify a db profile to be used.

```yml
# application.yml
server:
  port: 8080
spring:
  # dev|pro
  profiles:
    active: dev # Specify the profile file here, namely `application-dev.yml`
  jackson:
    time-zone: GMT+8
    date-format: yyyy-MM-dd HH:mm:ss
  servlet:
    multipart:
      maxRequestSize: 104857600 #100MB

# ... (omitted)
```

In `application-[ACTIVE_PROFILE_NAME].yml` you can specify a MySQL database connection configuration.
By default `dev` uses local instance. The username and the password are `root:root`.

After the node configuration file is confirmed, it is required to create a `key.store` file and write the private key of the node account:

```text
privatekey=*****(32 bye hex-decoded private key)
```

::: tip
It is for important safety concern that you use files to provide private information instead of command line. In the production environment, set the permission of the private file `key.store` as 600, meaning that only the owner can read or write the data.
:::

### Start a Node

All configuration files need to be copied to the directory that your node is running in,
use the command `cp node/src/main/resource/*.yml ./`.

Start your WINkLink node using the following command:

```sh
java -jar node/build/libs/node-v1.0.jar -k key.store
```

Configuration items can also be specified using a command line. For example:

```sh
java -jar node/build/libs/node-v1.0.jar --server.port=8081 --spring.profiles.active=dev --key key.store
```

Determine whether your WINkLink node is running properly using the following command:

```sh
tail -f logs/tron.log
```

::: warning
Your node account must have enough TRX tokens for contract calls.
You can apply testnet tokens at Testnet Faucet.
:::

### Add a Job to Your Node

The job of your node represents the data service that your node supports, and each job has a unique 32-byte ID. For end users, `(Oracle address, job ID)` uniquely identifies the data service provided by a WINkLink node. Each WINkLink node can provide multiple data services.

When your WINkLink node is running properly, you can add a job to your node via HTTP API:

Example: (change the address parameter below to the Oracle contract address deployed in the steps above)

```sh
curl --location --request POST 'http://localhost:8080/job/specs' \
  --header 'Content-Type: application/json' \
    --data-raw '{
    "initiators": [
        {
        "type": "runlog",
        "params": {
            "address": "TR9jYcLWAcQfbKcP5oau1ccSbeW7mdnqg8"
        }
        }
    ],
    "tasks": [
        {
        "type": "httpget",
        "params": {
            "get": "https://www.okex.com/api/spot/v3/instruments/TRX-USDT/ticker",
            "path": "last"
        }
        },
        {
        "type": "multiply",
        "params": {
            "times": 1000000
        }
        },
        {
        "type": "trontx"
        }
    ]
    }'
```

### Query Jobs

Request example:

```sh
curl --location --request GET 'http://localhost:8080/job/specs'
```

## Authorize a Node Account

The node account requires authorization to submit data to the Oracle contract, otherwise an error `"Not an authorized node to fulfill requests"` will be reported.

The owner of the Oracle contract is required to call the contract below and add the node account to the whitelist:

```js
// setFulfillmentPermission(address,bool) [7fcd56db]
function setFulfillmentPermission(address _node, bool _allowed)
```

`_node` refers to the node account address. When `_allowed` is `true`,
the account is authorized; when it is `false`, the authorization is revoked.

Call example: `setFulfillmentPermission(TGQVLckg1gDZS5wUwPTrPgRG4U8MKC4jcP, true)`.

Contract calls can be made via any of the following tools or libraries:

- TronScan: [Mainnet](https://tronscan.org/), [Nile Testnet](https://nile.tronscan.org/)
- [Official wallet-cli](https://github.com/tronprotocol/wallet-cli)
- [TronIDE](https://cn.developers.tron.network/docs/ide%E5%85%A5%E9%97%A8)
- [TronBox](https://cn.developers.tron.network/docs/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E9%83%A8%E7%BD%B2)
- [tronweb](https://cn.developers.tron.network/reference#tronwebcontractat)

<!-- ## Apply to be an officially certified WINkLink node

Your node can provide services to the public after the steps above are performed.

You can share your node's Oracle contract address and job ID of supported data services to the community. You can also apply to be a node officially certified by WINkLink and be listed on the WINkLink website.

[Application form](https://forms.gle/v1VwnSEQVMMpYNXJ8) -->
