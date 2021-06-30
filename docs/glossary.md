# 术语表

## 预言机 Oracle

将链上计算与链下资源联系起来的实体。由两部分构成: Oracle 节点和 Oracle 合约。

## 预言机合约 Oracle Contract

Oracle 的链上组成部分。Oracle合约是消费合约传递和接受链下资源的接口。

## 预言机节点 Oracle Node

Oracle 的链下组成部分。

## 消费者合约 Consumer Contract

Oracle 所获取到结果的接受者。
例如 `TronUser` 喂价合约请求多个 Oracle 更新最新价格，并聚合结果。

消费者一般来说是发起请求的合约，但也可以不是。
例如 `PriceConsumer` 通过 `AggregatorInterface` 查询最新价格，并没有请求 Oracle, 而是查询喂价合约的最新结果。
它是也一个消费者合约。
