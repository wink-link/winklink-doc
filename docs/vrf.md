# WinkLink 随机数服务

## 介绍
VRF（Verifiable Random Function)，即可验证的随机函数，其可生成安全可靠的随机数。
随机数由用户提供的seed、nonce(VRFCoordinator合约的私有状态)、区块的hash 和 随机数生成节点的私钥共同决定，随机数节点不可作弊。且该随机数在返回给用户Dapp之前经过了验证，从而保证了该随机数的安全性。

随机数生成流程如下：
- 由用户合约在链上发出生成随机数的请求；
- 节点监听到该请求后，会在链下生成随机数和证明，然后在链上合约中响应； 
- 链上合约对生成的随机数进行验证并通过后，以回调函数反馈到用户Dapp。

它可以用于任何需要可靠随机数的应用程序：
- 区块链游戏和NFTs
- 职责和资源的随机分配（例如随机分配法官审理案件）
- 为共识机制选择代表性样本

本文介绍如何部署和使用VRF合约。

## 准备工作

WinkLink 的维护者需要对 TRON 有一定的了解，熟悉智能合约部署和调用流程。
建议参考 [官方文档](https://cn.developers.tron.network/) 。

完成节点账号申请,建议参考[节点账号准备文档](https://docs.winklink.org/v1/doc/deploy.html#%E5%87%86%E5%A4%87%E8%8A%82%E7%82%B9%E5%B8%90%E5%8F%B7) 。

## VRFCoordinator 合约

VRFCoordinator 合约是部署在 TRON 公链上的预言机合约。主要功能如下

- 接收消费者合约(Consumer Contract)的数据请求，触发 Event Log
    - 数据请求发送时会附带 WIN 转账作为使用费用
- 接受 WinkLink 节点所提交的随机数和证明  
    - VRFCoordinator收到合约后会对随机数进行验证
- 对数据请求的 WIN 代币费用进行结算，提取收益

合约代码位于 [VRFCoordinator.sol](https://github.com/3for/just-link/blob/vrf-dev/tvm-contracts/v1.0/VRF/VRFCoordinator.sol) 。

部署 VRFCoordinator 合约时需要在构造函数提供 WIN 代币地址和 JustMid 合约地址，_blockHashStore为BlockhashStore合约地址。

为方便开发者, Nile 测试网已经部署了 `JustMid` 合约，封装了 Nile 测试网 `WIN` 代币。
开发者可直接使用该合约地址，无需额外部署。 Nile 测试网同时提供了水龙头地址可以领取测试 TRX 和 WIN 代币。

::: tip Nile 测试网

- WIN 代币合约地址: `TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2`
- JustMid 合约地址: `TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb`
- 测试网水龙头: <https://nileex.io/join/getJoinPage>
  :::
## 节点部署
节点部署部分可以参考[WinkLink节点部署文档](https://docs.winklink.org/v1/doc/deploy.html#%E8%8A%82%E7%82%B9%E9%83%A8%E7%BD%B2) ，本部分仅列出VRF节点部署的不同之处。

VRFCoordinator 合约部署完毕后，就可以开始 WinkLink 节点部署。

WinkLink 节点代码位于: <https://github.com/3for/just-link/tree/vrf-dev/node>，
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
curl --location --request GET 'http://localhost:8080/vrf/updateVRFKey/vrfKeyStore.yml'
```

::: tip
通过文件而非命令行参数提供私密信息是重要的安全性考虑，在生产环境需要设定私密文件 `vrfKeyStore.yml` 权限为 600,
即只有拥有者可读写。
:::

### 启动节点

所有配置文件都需要被复制到节点程序当前运行时目录，即 `cp node/src/main/resource/*.yml ./`，同时application-dev文件中的 `tronApiKey` 部分需要填充apikey.

使用如下命令启动 WinkLink 节点程序：

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

使用如下命令判断 WinkLink 节点是否正常运行：

```sh
tail -f logs/tron.log
```

::: warning 注意
节点帐号必须有足够的 TRX 代币，用于合约调用。可以通过测试网水龙头地址申请。
:::
### 为节点添加 job
节点的 job 代表了节点所支持的数据服务, job ID 通过一个 32 字节唯一标识。

WinkLink 节点正常运行后，就可以通过 HTTP API 为节点添加 job:

示例：(修改下面代码中 `address` 参数为上述步骤中部署的 VRFCoordinator 合约地址；`publicKey` 参数为节点公钥的压缩值，该值可通过查看节点运行后的终端显示获得,对应项为`ecKey compressed`)

```sh
curl --location --request POST 'http://localhost:8080/job/specs' \
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
curl --location --request GET 'http://localhost:8080/job/specs'
```
## 为节点账户授权

节点账户需要授权才能向 VRFCoordinator 合约提交数据，否则会报错 。

需要使用 VRFCoordinator 合约的 owner 执行如下合约调用，将节点账户添加到白名单:

```js
  function registerProvingKey(uint256 _fee, address _oracle, bytes calldata _publicProvingKey, bytes32 _jobID)
```

其中 `_fee` 为注册节点生成随机数最小的WIN代币费用，`_oracle` 为注册节点的地址,用于接收Dapp应用对其支付的WIN代币，
`_publicProvingKey` 为注册节点用于生成随机数的公钥，即x||y， `_jobID` 为节点VRF服务的JobID。

示例调用例如 `registerProvingKey（10,TYmwSFuFuiDZCtYsRFKCNr25byeqHH7Esb,
0x4e6bda4373bea59ec613b8721bcbb56222ab2ec10b18ba24ae369b7b74ab145224d509bc2778e6d1c8a093522ba7f9b6669a9aef57d2231f856e4b594ad5f4ac,
04d773890bc347f88544dc85bea24985）`。

## Dapp合约

合约代码位于 [VRFD20.sol](https://github.com/3for/just-link/tree/vrf-dev/tvm-contracts/v1.0/VRF/VRFD20.sol)

### 部署Dapp合约
部署 VRFD20 合约时需要向构造函数中填充参数
```js
  constructor(address vrfCoordinator, address jst, address justMid, bytes32 keyHash, uint256 fee)
```
其中 `vrfCoordinator` 为 VRFCoordinator 合约地址，`jst` 为 WIN 代币合约地址，`justMid` 为 JustMid 合约地址，
`keyHash` 为注册节点公钥的Hash值，可通过调用 VRFCoordinator 合约的 hashOfKeyBytes 函数获得(输入为x||y)。
`fee` 支付随机数生成的WIN代币费用，可修改，其值应大于随机数节点注册时要求的fee。

例如 `constructor（TUeVYd9ZYeKh87aDA9Tp7F5Ljc47JKC37x,TNDSHKGBmgRx9mDYA9CnxPx55nu672yQw2,
TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb,0xe4f280f6d621db4bccd8568197e3c84e3f402c963264369a098bb2f0922cb125,12）`。

### 为合约转入WIN代币

VRFD20 合约需要调用 VRFCoordinator 合约，所以合约账户需要有足够的 WIN 代币。可以通过转账或测试网水龙头为合约转入若干 WIN 代币。

### 调用Dapp合约

使用如下接口请求生成随机数：

```js
function rollDice(uint256 userProvidedSeed, address roller)
```
其中 `userProvidedSeed` 为用户提供的种子，`roller` 目前可以填入任意地址
示例调用例如 `rollDice(0x852f725894485e4979af5ea47ddd90cc68ea1ac0f4b99e52e9b91fa35a7204e2, TL44GNkjETr2JumQHgYJF842oyE6h2inoR)`。
