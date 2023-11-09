# 系统架构设计
<!-- Architecture Overview -->

## WINkLink 节点模型

```mermaid
flowchart LR
    外部数据源 <--> B[WINkLink Node] <--> C[TRON BlockChain API]
```

如上图，我们可以看到三个主要模块：

* 外部数据源
* WINkLink 节点
* TRON blockchain

这些是 WINkLink 预言机节点架构的主要组成部分，下面我们将逐个介绍。

### 外部数据源

外部数据源代表原生区块链外部可获取的数据，例如中心化交易所、中心化预言机、股票交易所的 API 接口等。

### WINkLink 节点

WINkLink 节点运行任务处理，监听链上合约请求(以 Event 方式监听)，从外部数据源获取数据，然后向区块链提交数据结果。

### TRON blockchain

区块链节点主要指 TRON 区块链提供的 API 服务，包括 Fullnode API 和 Event API 服务。
通过这些 API, WINkLink 节点可以监听特定合约事件来启动任务，同时也可以通过 API 服务签名广播交易，
将数据返回给**消费者合约**。

箭头表示的连接性是双向的, WINkLink 节点既订阅区块链事件，又通过 API 发布交易，提交数据结果。

## WINkLink 请求模型

### 创建请求

```mermaid
sequenceDiagram
    调用者->>消费者合约: 请求更新预言机数据
    activate 消费者合约
    消费者合约->>预言机合约: transferAndCall 发送代币和请求
    activate 预言机合约
    预言机合约->>预言机合约: emit OracleRequest
    预言机合约-->>消费者合约: request ID
    deactivate 预言机合约
    消费者合约-->>调用者: request ID
    deactivate 消费者合约
```

### 处理请求

预言机合约的事件会异步触发如下流程：

```mermaid
sequenceDiagram
    Note over WINKLinkNode: 从 Event API 监听到事件
    activate WINKLinkNode
    WINKLinkNode->>WINKLinkNode: 依 job ID 调用不同的适配器获得数据
    WINKLinkNode->>预言机合约: fulfill 调用提交结果
    activate 预言机合约
    预言机合约->>消费者合约: 调用回调函数
    activate 消费者合约
    消费者合约->>消费者合约: 按回调逻辑更新数据
    消费者合约-->>预言机合约: success?
    deactivate 消费者合约
    deactivate 预言机合约
    deactivate WINKLinkNode
```

## 聚合请求模型

在实际应用中，往往需要通过聚合多个预言机的方法来获得更准确的结果，同时过滤掉异常值。

例如价格聚合功能，从多个交易所提供的预言机服务聚合得到平均价格或中位数价格。

价格聚合相关逻辑参考: [FluxAggregator.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v2.0/AggregatorInterface.sol)

## 链下报告(OCR)

链下报告（OCR）是一种新的数据聚合方法，旨在提高WINkLink网络的可扩展性、稳定性和去中心化。

通过OCR，网络中的所有节点通过点对点（P2P）网络进行交互，其中一个节点充当领导者，其他节点充当跟随者。P2P网络在通信过程中使用轻量级共识算法。每个节点将其签名的数据观察结果报告给领导者，领导者生成一个合并报告。如果满足传输条件，该报告作为单个聚合交易广播到区块链上。这个过程会产生一个单一的聚合交易，大大降低了燃气消耗。

聚合交易包含了由一组预言机签名的报告，其中包含了他们所有的观察结果。为了维护WINkLink预言机网络的不可信任特性，该报告在链上进行验证，并且验证预言机组的签名。

目前，链下报告模型仍处于测试阶段，一旦稳定下来，将会提供更多的信息。
