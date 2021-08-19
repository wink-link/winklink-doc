# 搭建 WINkLink 节点

本节介绍如何加入 WINkLink 生态：部署预言机合约，搭建 WINkLink 节点。

目前 WINkLink 不区分 Oracle 合约拥有者和预言机节点运营者。
即预言机节点的运营者同时是 Oracle 合约的拥有者。预言机节点账户只处理数据源和数据提交，
Oracle 合约拥有者可以通过合约调用，提取 Oracle 合约使用者所支付的使用费。

## 准备工作

WINkLink 的维护者需要对 TRON 有一定的了解，熟悉智能合约部署和调用流程。
建议参考 [官方文档](https://cn.developers.tron.network/)。

主要阅读 TronIDE 合约部署相关内容。

## 合约部署

WINkLink 生态采用去中心化架构，所有智能合约开源，任何组织和个人都可以部署自己的 WINkLink 预言机合约，
并对外公布所提供的服务。

用户可以从各个公开 WINkLink 服务中选择自己所需的组合，创建自己的聚合数据合约，从去中心化受益。

项目合约地址位于: <https://github.com/wink-link/winklink/tree/master/tvm-contracts/v1.0>

开发者需要使用 [tron-solidity 0.4.25](https://github.com/tronprotocol/solidity/releases/tag/0.4.25_Odyssey_v3.2.3)
编译器编译。(或在 TronIDE 中选择该版本)

合约的部署和测试调用可以使用如下任一工具或程序库：

- [官方 wallet-cli 工具](https://github.com/tronprotocol/wallet-cli)
- [TronIDE, 同时支持合约编译](https://cn.developers.tron.network/docs/ide%E5%85%A5%E9%97%A8)
- [TronBox, 同时支持合约编译](https://cn.developers.tron.network/docs/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E9%83%A8%E7%BD%B2)
- [tronweb](https://cn.developers.tron.network/reference#tronwebcontractnew)
- [tronpy](https://tronpy.readthedocs.io/en/latest/contract.html#creating-smart-contract)
- [rust-tron](https://github.com/andelf/rust-tron/blob/master/docs/contract.md)

### WinkMid 合约

WINkLink 使用 WIN 代币(TRC20)作为整个生态的基础代币。

WINkLink 依赖 `transferAndCall` 功能，即在转账 TRC20 代币给合约的同时调用合约的某一回调函数，相关功能类似 [ERC677](https://github.com/ethereum/EIPs/issues/677), 但接口参数不同。

考虑到绝大多数已发行的代币无法再修改合约增加接口, WINkLink 提供了 `WinkMid` 合约，可以用来包装任一 TRC20 代币，并提供
`transferAndCall` 接口。

合约代码位于 [WinkMid.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/WinkMid.sol).

为方便开发者, Nile 测试网已经部署了 `WinkMid` 合约，封装了 Nile 测试网 `WIN` 代币。
开发者可直接使用该合约地址，无需额外部署。 Nile 测试网同时提供了水龙头地址可以领取测试 TRX 和 WIN 代币。

::: tip Nile 测试网

- WIN 代币合约地址: `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7`
- WinkMid 合约地址: `TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb`
- 测试网水龙头: <https://nileex.io/join/getJoinPage>
:::

部署 WinkMid 合约时候需要在构造函数提供被封装的 TRC20 代币地址（即 WIN 代币地址）。

所有对 WinkMid 合约的操作均在合约中进行，开发者不需要直接调用该合约。

### Oracle 合约

Oracle 合约是部署在 TRON 公链上的预言机合约。主要功能如下

- 接收消费者合约(Consumer Contract)的数据请求，触发 Event Log
  - 数据请求发送时会附带 WIN 转账作为使用费用
- 接受 WINkLink 节点所提交的数据
  - WINkLink 节点通过监听 Event Log 获知数据请求
  - 节点通过识别 job 配置，选择调用不同数据请求对应的适配器，获得外部数据，向 Oracle 合约提交数据
  - 触发消费者合约的数据回调函数
- 支持撤销数据请求
- 对数据请求的 WIN 代币费用进行结算，提取收益

合约代码位于 [TronOracles.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/TronOracles.sol).

部署 Oracle 合约时需要在构造函数提供 WIN 代币地址和 WinkMid 合约地址。

Oracle 合约实现了 `Ownable` 接口，合约的 owner 可以管理收益或销毁合约。

## 节点部署

合约部署完毕后，就可以开始 WINkLink 节点部署。

WINkLink 节点(项目目录 `node`)代码位于: <https://github.com/wink-link/winklink/tree/master/node>.

::: warning
目前的节点实现包含通过交易所 API 获取币价的适配器。请在稳定的非中国大陆网络环境中运行节点。
:::

### 准备节点帐号

每个 WINkLink 节点都必须对应一个 TRON 帐号，用于调用 Oracle 合约提交数据。

开发者生成帐号地址和私钥后，通过测试网水龙头页面投测试 TRX 代币。该代币用于支付智能合约调用的必要费用。

开发者可以选用以下任一方法生成帐号地址和私钥：

- [官方 wallet-cli 工具](https://github.com/tronprotocol/wallet-cli)
- [Generate Address Offline](https://andelf.gitbook.io/tron/tron-by-example/generate-address-offline)
- [tronj](https://github.com/ki5fpl/tronj/blob/master/client/src/test/java/com/github/ki5fpl/tronj/client/ClientTest.java#L70)
- [tronpy](https://github.com/andelf/tronpy/blob/master/examples/generate_address.py)

::: warning
通过非信任的网络传输私钥会有泄露风险。请通过离线方式生成地址和私钥。
:::

### 依赖环境

WINkLink 节点依赖 MySQL 实例。开发者可以使用目标环境的软件包管理器或 Docker 部署 MySQL 实例。

::: tip
这里假定本机部署的 MySQL 实例的用户名和密码分别是 `root:root`。在生产环境中请使用强密码或其他验证方式。
:::

WINkLink 节点使用 Java 语言编写，依赖 JRE/JDK 环境，建议使用 Oracle JDK8.

WINkLink 节点依赖 nodejs 环境，需要安装 nodejs(npm) >= 10.0.

### 获取节点可执行程序

开发者可以在 [Github Release](https://github.com/wink-link/winklink/releases) 页面下载到到最新版本的 WINkLink 节点可执行程序 `node-v1.0.jar`。

也可以按照如下步骤编译:

```sh
# 需要 jdk8, 和 nodejs(npm) >= 10.0
git clone git@github.com:wink-link/winklink.git
cd winklink/

# 编译
./gradlew build -x test
```

编译完成后 `node-v1.0.jar` 位于项目源码目录下的 `node/build/libs/` 中。

::: warning
这里的编译过程中忽略了测试(`-x test`)，这是因为测试用例中包含交易所币价 API 测试用例，
这些测试用例需要稳定的非中国大陆网络环境。
:::

### 节点配置

WINkLink 节点使用 springboot 方式配置。所有配置文件位于项目子目录 `node/src/main/resource`.
`application.yml` 可以指定使用的具体 profile.

```yml
# application.yml
server:
    port: 8080
spring:
    # dev|pro
    profiles:
        active: dev # 这里设置具体的 profile 文件，即 `application-dev.yml`
    jackson:
        time-zone: GMT+8
        date-format: yyyy-MM-dd HH:mm:ss
    servlet:
        multipart:
            maxRequestSize: 104857600 #100MB

# ... (omitted)
```

`application-[ACTIVE_PROFILE_NAME].yml` 中可以指定具体的 MySQL 数据库连接配置，
默认 `dev` 使用本机实例，用户名密码为 `root:root`.

节点配置文件确认完毕后，还需要创建 `key.store` 文件, 写入节点帐号的私钥:

```text
privatekey=*****(32字节 hex 编码私钥)
```

::: tip
通过文件而非命令行参数提供私密信息是重要的安全性考虑，在生产环境需要设定私密文件 `key.store` 权限为 600,
即只有拥有者可读写。
:::

### 启动节点

所有配置文件都需要被复制到节点程序当前运行时目录，即 `cp node/src/main/resource/*.yml ./`.

使用如下命令启动 WINkLink 节点程序：

```sh
java -jar node/build/libs/node-v1.0.jar -k key.store
```

具体的配置项目也可以通过命令行指定，例如：

```sh
java -jar node/build/libs/node-v1.0.jar --server.port=8081 --spring.profiles.active=dev --key key.store
```

使用如下命令判断 WINkLink 节点是否正常运行：

```sh
tail -f logs/tron.log
```

::: warning 注意
节点帐号必须有足够的 TRX 代币，用于合约调用。可以通过测试网水龙头地址申请。
:::

### 为节点添加 job

节点的 job 代表了节点所支持的数据服务, job ID 通过一个 32 字节唯一标识。对于最终用户来说，
`(Oracle 地址, job ID)` 唯一标识了一个 WINkLink 节点提供的数据服务。
每个 WINkLink 节点都可以提供多组数据服务。

WINkLink 节点正常运行后，就可以通过 HTTP API 为节点添加 job:

示例：(修改下面代码中 `address` 参数为上述步骤中部署的 Oracle 合约地址)

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

### 查询节点 job

请求示例：

```sh
curl --location --request GET 'http://localhost:8080/job/specs'
```

## 为节点账户授权

节点账户需要授权才能向 Oracle 合约提交数据，否则会报错 `"Not an authorized node to fulfill requests"`。

需要使用 Oracle 合约的 owner 执行如下合约调用，将节点账户添加到白名单:

```js
// setFulfillmentPermission(address,bool) [7fcd56db]
function setFulfillmentPermission(address _node, bool _allowed)
```

其中 `_node` 为节点账户地址，`_allowed` 为 `true` 代表授权，为 `false` 代表撤销授权。

示例调用例如 `setFulfillmentPermission(TGQVLckg1gDZS5wUwPTrPgRG4U8MKC4jcP, true)`。

合约调用可以使用如下任一工具或程序库：

- TronScan 区块链浏览器 [Mainnet](https://tronscan.org/), [Nile Testnet](https://nile.tronscan.org/)
- [官方 wallet-cli 工具](https://github.com/tronprotocol/wallet-cli)
- [TronIDE](https://cn.developers.tron.network/docs/ide%E5%85%A5%E9%97%A8)
- [TronBox](https://cn.developers.tron.network/docs/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E9%83%A8%E7%BD%B2)
- [tronweb](https://cn.developers.tron.network/reference#tronwebcontractat)
- [tronpy](https://tronpy.readthedocs.io/en/latest/contract.html#creating-smart-contract)
- [rust-tron](https://github.com/andelf/rust-tron/blob/master/docs/contract.md)

## 申请成为官方认证 WINkLink 节点

以上步骤执行完毕后，节点即可对外提供服务。

节点可以向社区公布自己的 Oracle 合约地址和所支持的数据服务 job ID. 也可以申请成为 WINkLink 官方认证节点，
在 WINkLink 官网列出自己的节点。

[申请表单](https://docs.google.com/forms/d/e/1FAIpQLSf4ZY2N6VeWdP6CBYwzB61Xah8B3PW0gZZ9a6xGmGZTcBI73g/viewform
