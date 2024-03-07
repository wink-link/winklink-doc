# 管线任务
我们在此以更为常见的管线任务为例进行讨论。 TOML 文件中的任务可使用 “type” 参数进行分类。

![task](https://img.shields.io/badge/http-blue) 和 ![task](https://img.shields.io/badge/jsonparse-blue) 基本上一起使用，主要用于调用 API 和提取 JSON 结果。
```toml
# method=["GET", "POST"]
# url="HTTP_REST_API"
ds_http  [type="http" method=GET url="https://mock-exchange.org?symbol=TRX_USDT"]

# path=comma-separated-json-path. arrays can be accessed using the index number. e.g. "array,2"
ds_parse [type="jsonparse" path="json,path,syntax"]
```

![task](https://img.shields.io/badge/convert--trx-blue) 用于执行任务中的 `http-GET` 和 `jsonparse` 操作
```toml
# url="HTTP_REST_API"
# path=dot-separated-json-path *NOTE: dot separated syntax, which is different from jsonparse's comma separated syntax  
ds_converttrx [type="converttrx" url="https://mock-exchange.org?symbol=TRX_USDT" path="json.path.syntax"]
```

![task](https://img.shields.io/badge/convert--usd-blue) 从上一个管线任务（`Pipeline.Task`）获取输入值，然后进行一次 **<u>USDT</u>** 到 **<u>USD</u>** 的转换。
```toml
# No other parameters required. Verified through a USDT/USD Aggregator smart contract  
ds_convertusd [type="convertusd"]
```

![task](https://img.shields.io/badge/convert--usdt-blue) 从上一个管线任务（`Pipeline.Task`）中获取输入值，然后进行一次 **<u>USDT</u>** 到 **<u>TRX</u>** 的转换。
```toml
# No other parameters required. Verified through a USDT/TRX SunSwap pool TRC20 token  
ds_convertusdt [type="convertusdt"]
```

![task](https://img.shields.io/badge/just--swap-blue) 用于手动输入不在我们上述预定义列表中的兑换币对（“USDT/USD”和"USDT/TRX“）
```toml
# poolAddr="SWAP_CONTRACT_T_ADDRESS"
# trx20Addr="TOKEN_CONTRACT_T_ADDRESS"
ds_justswap [type="justswap" poolAddr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" trc20Addr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]
```

![task](https://img.shields.io/badge/tvm--abi--decode--log-blue) 是专供 `VRF` 使用的方法。 我们假设任务在初始化时会提供变量 `$jobRun.[logFn, logData, logTopics]`。 详情请参考 [winklink-libocr][libocr-link]
```toml
# abi=The function abi. defaults to: RandomWordsRequested(type [indexed] name, ...)
decode [type="tvmabidecodelog"]
```

![task](https://img.shields.io/badge/vrf--builder-blue) 是专供 `VRF` 使用的方法。 我们假设任务在初始化时会提供变量 `$jobSpec.[publicKey]` 以及 `$jobRun.[logBlockHash, logBlockNumber, logTopics]`。
```toml
# No other parameters required. It uses job parameters and event values to generate the result.[output, requestID, method, proof, requestCommitment] object  
vrf [type=vrfbuilder]
```

![task](https://img.shields.io/badge/tvm--call-blue) 是专供 `VRF` 使用的方法， 可触发调用合约中的 fulfillment 方法。
```toml
# contract="VRF_CONTRACT_ADDRESS"
# extractRevertReason=Boolean. default: false. ON error, extract the reason to determine if it is a RPC or contract error.
tvmcall [type=tvmcall contract="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" extractRevertReason=true]
```

#### 示例
以下例子展示了从 **<u>LIVE 到 USD</u>** 这一币对转化所需完成的任务。
1. Broadcaster规划一个 pipeline 任务

2. LIVE/TRX SunSwap 兑换

3. TRX/USDT 转换

4. 将结果相乘（根据您的需求可设置 6 位小数位）

5. 将 USDT 价格对的结果转化为 USD 价格对
```toml
ds_justswap     [type="justswap" poolAddr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" trc20Addr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]
ds_convertusdt  [type="convertusdt"]
ds_multiply     [type="multiply" times=1000000]
ds_convertusd   [type="convertusd"]

ds_justswap -> ds_convertusdt -> ds_multiply -> ds_convertusd
```

以下例子是针对 **<u>VRF</u>** 的场景
1. 广播者从链上接收一个 VRF RandomWordsRequested(...) 事件，并规划一个管线任务

2. 解码 ABI、数据和事件日志

3. 加密生成证明和随机数

智能合约的回调通过 `RequestFulfilled` 和 `RandomWordsFulfilled` 实现

```toml
decode   [type="tvmabidecodelog"]
vrf      [type=vrfbuilder]
tvmcall  [type=tvmcall contract="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" extractRevertReason=true]

decode -> vrf -> tvmcall
```