# 系统架构设计
<!-- Architecture Overview -->

## WINKLink 节点模型

```mermaid
flowchart LR
    外部数据源 <--> B[WINKLink Node] <--> C[TRON BlockChain API]
```

如上图，我们可以看到三个主要模块：

* 外部数据源
* WINKLink 节点
* TRON blockchain

这些是 WINKLink 预言机节点架构的主要组成部分，下面我们将逐个介绍。

### 外部数据源

外部数据源代表原生区块链外部可获取的数据，例如中心化交易所、中心化预言机、股票交易所的 API 接口等。

### WINKLink 节点

WINKLink 节点运行任务处理，监听链上合约请求(以 Event 方式监听)，从外部数据源获取数据，然后向区块链提交数据结果。

### TRON blockchain

区块链节点主要指 TRON 区块链提供的 API 服务，包括 Fullnode API 和 Event API 服务。
通过这些 API, WINKLink 节点可以监听特定合约事件来启动任务，同时也可以通过 API 服务签名广播交易，
将数据返回给**消费者合约**。

箭头表示的连接性是双向的, WINKLink 节点既订阅区块链事件，又通过 API 发布交易，提交数据结果。

## WINKLink 请求模型

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

价格聚合相关逻辑参考: [AggregatorInterface](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/TronUser.sol)
