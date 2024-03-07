# 管線任務
我們在此以更為常見的管線任務為例進行討論。 TOML 文件中的任務可使用 `type` 參數進行分類。

![task](https://img.shields.io/badge/http-blue) 和 ![task](https://img.shields.io/badge/jsonparse-blue) 基本上一起使用，主要用於調用 API 和提取 JSON 結果。
```toml
# method=["GET", "POST"]
# url="HTTP_REST_API"
ds_http  [type="http" method=GET url="https://mock-exchange.org?symbol=TRX_USDT"]

# path=comma-separated-json-path. arrays can be accessed using the index number. e.g. "array,2"
ds_parse [type="jsonparse" path="json,path,syntax"]
```

![task](https://img.shields.io/badge/convert--trx-blue) 用於執行任務中的 `http-GET` 和 `jsonparse` 操作
```toml
# url="HTTP_REST_API"
# path=dot-separated-json-path *NOTE: dot separated syntax, which is different from jsonparse's comma separated syntax  
ds_converttrx [type="converttrx" url="https://mock-exchange.org?symbol=TRX_USDT" path="json.path.syntax"]
```

![task](https://img.shields.io/badge/convert--usd-blue) 從上一個管線任務（`Pipeline.Task`）獲取輸入值，然後進行一次 **<u>USDT</u>** 到 **<u>USD</u>** 的轉換。
```toml
# No other parameters required. Verified through a USDT/USD Aggregator smart contract  
ds_convertusd [type="convertusd"]
```

![task](https://img.shields.io/badge/convert--usdt-blue) 從上一個管線任務（`Pipeline.Task`）獲取輸入值，然後進行一次 **<u>USDT</u>** 到 **<u>TRX</u>** 的轉換。
```toml
# No other parameters required. Verified through a USDT/TRX SunSwap pool TRC20 token  
ds_convertusdt [type="convertusdt"]
```

![task](https://img.shields.io/badge/just--swap-blue) 用於手動輸入不在我們上述預定義列表中的兌換幣對（“USDT/USD”和"USDT/TRX“）
```toml
# poolAddr="SWAP_CONTRACT_T_ADDRESS"
# trx20Addr="TOKEN_CONTRACT_T_ADDRESS"
ds_justswap [type="justswap" poolAddr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" trc20Addr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]
```

![task](https://img.shields.io/badge/tvm--abi--decode--log-blue) 是專供 `VRF` 使用的方法。 我們假設任務在初始化時會提供變量 `$jobRun.[logFn, logData, logTopics]`。 詳情請參考 [winklink-libocr][libocr-link]
```toml
# abi=The function abi. defaults to: RandomWordsRequested(type [indexed] name, ...)
decode [type="tvmabidecodelog"]
```

![task](https://img.shields.io/badge/vrf--builder-blue) 是專供 `VRF` 使用的方法。 我們假設任務在初始化時會提供變量 `$jobSpec.[publicKey] 以及 $jobRun.[logBlockHash, logBlockNumber, logTopics]`。
```toml
# No other parameters required. It uses job parameters and event values to generate the result.[output, requestID, method, proof, requestCommitment] object  
vrf [type=vrfbuilder]
```

![task](https://img.shields.io/badge/tvm--call-blue) 是專供 `VRF` 使用的方法， 可觸發調用合約中的 fulfillment 方法。
```toml
# contract="VRF_CONTRACT_ADDRESS"
# extractRevertReason=Boolean. default: false. ON error, extract the reason to determine if it is a RPC or contract error.
tvmcall [type=tvmcall contract="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" extractRevertReason=true]
```

#### 示例
以下例子展示了從 **<u>LIVE 到 USD</u>** 這一幣對轉化所需完成的任務。
1. Broadcaster規劃一個 pipeline 任務

2. LIVE/TRX SunSwap 兌換

3. TRX/USDT 轉換

4. 將結果相乘（根據您的需求可設置 6 位小數位）

5. 將 USDT 價格對的結果轉化為 USD 價格對

```toml
ds_justswap     [type="justswap" poolAddr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" trc20Addr="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"]
ds_convertusdt  [type="convertusdt"]
ds_multiply     [type="multiply" times=1000000]
ds_convertusd   [type="convertusd"]

ds_justswap -> ds_convertusdt -> ds_multiply -> ds_convertusd
```

以下例子是針對 **<u>VRF</u>** 的場景
1. 廣播者從鏈上接收一個 VRF RandomWordsRequested(...) 事件，並規劃一個管線任務

2. 解碼 ABI、數據和事件日誌

3. 加密生成證明和隨機數

4. 智能合約的回調通過 `RequestFulfilled` 和 `RandomWordsFulfilled` 實現

```toml
decode   [type="tvmabidecodelog"]
vrf      [type=vrfbuilder]
tvmcall  [type=tvmcall contract="TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" extractRevertReason=true]

decode -> vrf -> tvmcall
```