# Pipeline Tasks
Here we will discuss the more commonly used pipeline tasks. the TOML tasks are referenced through the `type` parameter.

![task](https://img.shields.io/badge/http-blue) and ![task](https://img.shields.io/badge/jsonparse-blue) are almost exclusively used together for calling an API and extracting the JSON results.
```toml
# method=["GET", "POST"]
# url="HTTP_REST_API"
ds_http  [type="http" method=GET url="https://mock-exchange.org?symbol=TRX_USDT"]

# path=comma-separated-json-path. arrays can be accessed using the index number. e.g. "array,2"
ds_parse [type="jsonparse" path="json,path,syntax"]
```

![task](https://img.shields.io/badge/convert--trx-blue) is a helper for doing a `http-GET` and `jsonparse` in one task
```toml
# url="HTTP_REST_API"
# path=dot-separated-json-path *NOTE: dot separated syntax, which is different from jsonparse's comma separated syntax  
ds_converttrx [type="converttrx" url="https://mock-exchange.org?symbol=TRX_USDT" path="json.path.syntax"]
```

![task](https://img.shields.io/badge/convert--usd-blue) takes the `Input` value from a prior `Pipeline.Task` and does a **<u>USDT</u>** to **<u>USD</u>** conversion.
```toml
# No other parameters required. Verified through a USDT/USD Aggregator smart contract  
ds_convertusd [type="convertusd"]
```

![task](https://img.shields.io/badge/convert--usdt-blue) takes the `Input` value from a prior `Pipeline.Task` and does a **<u>USDT</u>** to **<u>TRX</u>** conversion.
```toml
# No other parameters required. Verified through a USDT/TRX SunSwap pool TRC20 token  
ds_convertusdt [type="convertusdt"]
```

![task](https://img.shields.io/badge/just--swap-blue) is used for manually inputting swap pairs that are not in our pre-defined list above ["USDT/USD", "USDT/TRX"]
```toml
# poolAddr="SWAP_CONTRACT_T_ADDRESS"
# trx20Addr="TOKEN_CONTRACT_T_ADDRESS"
ds_justswap [type="justswap" poolAddr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" trc20Addr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]
```

![task](https://img.shields.io/badge/tvm--abi--decode--log-blue) is `VRF` specific. It is assumed that `$jobRun.[logFn, logData, logTopics]` are provided on job init. Read more in [winklink-libocr][libocr-link]
```toml
# abi=The function abi. defaults to: RandomWordsRequested(type [indexed] name, ...)
decode [type="tvmabidecodelog"]
```

![task](https://img.shields.io/badge/vrf--builder-blue) is `VRF` specific. It is assumed that `$jobSpec.[publicKey]` & `$jobRun.[logBlockHash, logBlockNumber, logTopics]` are provided on job init.
```toml
# No other parameters required. It uses job parameters and event values to generate the result.[output, requestID, method, proof, requestCommitment] object  
vrf [type=vrfbuilder]
```

![task](https://img.shields.io/badge/tvm--call-blue) is `VRF` specific. It triggers the fulfillment contract call.
```toml
# contract="VRF_CONTRACT_ADDRESS"
# extractRevertReason=Boolean. default: false. ON error, extract the reason to determine if it is a RPC or contract error.
tvmcall [type=tvmcall contract="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" extractRevertReason=true]
```

#### Examples
In this example we show the tasks one might need to do a pair conversion from **<u>LIVE to USD</u>**
1. Broadcaster schedules a pipeline run
2. SunSwap LIVE/TRX
2. Convert USDT/TRX
3. Multiply the results (6 decimal places as per your needs)
4. Convert result USDT/USD
```toml
ds_justswap     [type="justswap" poolAddr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" trc20Addr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]
ds_convertusdt  [type="convertusdt"]
ds_multiply     [type="multiply" times=1000000]
ds_convertusd   [type="convertusd"]

ds_justswap -> ds_convertusdt -> ds_multiply -> ds_convertusd
```

The following example is for a **<u>VRF</u>** scenario
1. Broadcaster picked up a VRF RandomWordsRequested(...) event from the chain and schedules a pipeline run
2. The abi, data and event logs are decoded
3. The proof and random number is cryptographically generated
4. The callback to the smart contract is made with `RequestFulfilled` and `RandomWordsFulfilled`
```toml
decode   [type="tvmabidecodelog"]
vrf      [type=vrfbuilder]
tvmcall  [type=tvmcall contract="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" extractRevertReason=true]

decode -> vrf -> tvmcall
```