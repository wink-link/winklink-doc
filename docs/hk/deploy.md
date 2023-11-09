# 建立 WINkLink 节點

本節介紹如何加入 WINkLink 生態系統：部署預言機合約，建立 WINkLink 节點。

目前 WINkLink 不區分 Oracle 合約擁有者和預言機節點運營者。
即預言機節點的運營者同時是 Oracle 合約的擁有者。預言機節點帳戶只處理數據源和數據提交，
Oracle 合約擁有者可以通過合約調用，提取 Oracle 合約使用者所支付的使用費。

## 準備工作

WINkLink 的維護者需要對 TRON 有一定的了解，熟悉智能合約部署和調用流程。
建議參考 [官方文档](https://cn.developers.tron.network/)。

主要閱讀 TronIDE 合約部署相關內容

## 合約部署

WINkLink 生態採用去中心化架構，所有智能合約開源，任何組織和個人都可以部署自己的 WINkLink 預言機合約，
並對外公布所提供的服務。

用戶可以從各個公開 WINkLink 服務中選擇自己所需的組合，創建自己的聚合數據合約，從去中心化受益。

項目合約地址位於: <https://github.com/wink-link/winklink/tree/master/tvm-contracts/v1.0>

開發者需要使用 [tron-solidity 0.4.25](https://github.com/tronprotocol/solidity/releases/tag/0.4.25_Odyssey_v3.2.3)
編譯器編譯。(或在 TronIDE 中選擇該版本)

合約的部署和測試調用可以使用如下任一工具或程序庫：

- [官方 wallet-cli 工具](https://github.com/tronprotocol/wallet-cli)
- [TronIDE, 同时支持合约编译](https://cn.developers.tron.network/docs/ide%E5%85%A5%E9%97%A8)
- [TronBox, 同时支持合约编译](https://cn.developers.tron.network/docs/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E9%83%A8%E7%BD%B2)
- [tronweb](https://cn.developers.tron.network/reference#tronwebcontractnew)

### WinkMid 合約

WINkLink 使用 WIN 代幣(TRC20)作為整個生態的基礎代幣。

WINkLink 依賴 `transferAndCall` 功能，即在轉帳 TRC20 代幣給合約的同時調用合約的某一回調函數，相關功能類似 [ERC677](https://github.com/ethereum/EIPs/issues/677),但接口參數不同。

考慮到絕大多數已發行的代幣無法再修改合約增加接口, WINkLink 提供了 `WinkMid` 合約，可以用來包裝任一 TRC20 代幣，並提供
`transferAndCall` 接口。

合約代碼位於 [WinkMid.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/WinkMid.sol).

為方便開發者, Nile 測試網已經部署了 `WinkMid` 合約，封裝了 Nile 測試網 `WIN` 代幣。
開發者可直接使用該合約地址，無需額外部署。 Nile 測試網同時提供了水龍頭地址可以領取測試 TRX 和 WIN 代幣。

::: tip Nile 測試網

- WIN 代幣合約地址: `TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7`
- WinkMid 合約地址: `TFbci8j8Ja3hMLPsupsuYcUMsgXniG1TWb`
- 測試網水龍頭: <https://nileex.io/join/getJoinPage>
:::

部署 WinkMid 合約時候需要在構造函數提供被封裝的 TRC20 代幣地址（即 WIN 代幣地址）。

所有對 WinkMid 合約的操作均在合約中進行，開發者不需要直接調用該合約。

### Oracle 合約

Oracle 合約是部署在 TRON 公鏈上的預言機合約。主要功能如下

- 接收消費者合約(Consumer Contract)的數據請求，觸發 Event Log
  - 數據請求發送時會附帶 WIN 轉帳作為使用費用
- 接受 WINkLink 节點所提交的數據
  - WINkLink 节点通過監聽 Event Log 獲知數據請求
  - 节点通過識別 job 配置，選擇調用不同數據請求對應的適配器，獲得外部數據，向 Oracle 合約提交數據
  - 觸發消費者合約的數據回調函數
- 支持撤銷數據請求
- 對數據請求的 WIN 代幣費用進行結算，提取收益

合約代碼位於 [TronOracles.sol](https://github.com/wink-link/winklink/blob/master/tvm-contracts/v1.0/TronOracles.sol).

部署 Oracle 合約時需要在構造函數提供 WIN 代幣地址和 WinkMid 合約地址。

Oracle 合約實現了 `Ownable` 接口，合約的 owner 可以管理收益或銷毀合約。

## 节点部署

合約部署完畢後，就可以開始 WINkLink 节點部署

WINkLink 节点(項目目錄 `node`)代碼位於: <https://github.com/wink-link/winklink/tree/master/node>.

::: warning
目前的節點實現包含通過交易所 API 獲取幣價的適配器。請在穩定的非中國大陸網絡環境中運行節點。
:::

### 準備節點帳號

每個 WINkLink 节點都必須對應一個 TRON 帳號，用於調用 Oracle 合約提交數據。

開發者生成帳號地址和私鑰後，通過測試網水龍頭頁面投測試 TRX 代幣。該代幣用於支付智能合約調用的必要費用。

開發者可以選用以下任一方法生成帳號地址和私鑰：

- [官方 wallet-cli 工具](https://github.com/tronprotocol/wallet-cli)
- [Generate Address Offline](https://andelf.gitbook.io/tron/tron-by-example/generate-address-offline)
- [trident](https://github.com/tronprotocol/trident/tree/main/trident-java)

::: warning
通過非信任的網絡傳輸私鑰會有洩露風險。請通過離線方式生成地址和私鑰。
:::

### 依賴環境

WINkLink 节点依賴 MySQL 實例。開發者可以使用目標環境的軟體包管理器或 Docker 部署 MySQL 實例。

::: tip
這里假設本機部署的 MySQL 實例的用戶名和密碼分別是 `root:root`。在生產環境中請使用強密碼或其他驗證方式。
:::

WINkLink 节点使用 Java 語言編寫，依賴 JRE/JDK 環境，建議使用 Oracle JDK8。

WINkLink 节点依賴 nodejs 環境，需要安裝 nodejs(npm) >= 10.0。

### 獲取節點可執行程序

開發者可以在 [Github Release](https://github.com/wink-link/winklink/releases) 頁面下載到到最新版本的 WINkLink 节点可執行程序 `node-v1.0.jar`。

也可以按照如下步驟編譯:

```sh
# 需要 jdk8, 和 nodejs(npm) >= 10.0
git clone git@github.com:wink-link/winklink.git
cd winklink/

# 編譯
./gradlew build -x test
```

編譯完成後 `node-v1.0.jar` 位於項目源碼目錄下的 `node/build/libs/` 中。

::: warning
這里的編譯過程中忽略了測試(`-x test`)，這是因為測試用例中包含交易所幣價 API 測試用例，
這些測試用例需要穩定的非中國大陸網絡環境。
:::

### 節點配置

WINkLink 节点使用 springboot 方式配置。所有配置文件位於項目子目錄 `node/src/main/resource`.
`application.yml` 可以指定使用的具體 profile.

```yml
# application.yml
server:
    port: 8080
spring:
    # dev|pro
    profiles:
      active: dev # 這裡設置具體的 profile 文件，即 `application-dev.yml`
    jackson:
      time-zone: GMT+8
      date-format: yyyy-MM-dd HH:mm:ss
    servlet:
      multipart:
        maxRequestSize: 104857600 #100MB

# ... (omitted)
```

`application-[ACTIVE_PROFILE_NAME].yml` 中可以指定具體的 MySQL 數據庫連接配置，
默認 dev 使用本機實例，用戶名密碼為 `root:root`.

節點配置文件確認完畢後，還需要創建 `key.store` 文件, 寫入節點帳號的私鑰:

```text
privatekey=*****(32字节 hex 编码私钥)
```

::: tip
通過文件而非命令行參數提供私密信息是重要的安全性考慮，在生產環境需要設定私密文件 `key.store` 權限為 600,
即只有擁有者可讀寫。
:::

### 啟動節點

所有配置文件都需要被複製到節點程序當前運行時目錄，即 `cp node/src/main/resource/*.yml ./`.

使用如下命令啟動 WINkLink 節點程序：

```sh
java -jar node/build/libs/node-v1.0.jar -k key.store
```

具體的配置項目也可以通過命令行指定，例如：

```sh
java -jar node/build/libs/node-v1.0.jar --server.port=8081 --spring.profiles.active=dev --key key.store
```

使用如下命令判斷 WINkLink 節點是否正常運行：

```sh
tail -f logs/tron.log
```

::: warning 注意
節點帳號必須有足夠的 TRX 代幣，用於合約調用。可以通過測試網水龍頭地址申請。
:::

### 為節點添加 job

節點的 job 代表了節點所支持的數據服務，job ID 通過一個 32 字節唯一標識。對於最終用戶來說，
`(Oracle 地址, job ID)` 唯一標識了一個 WINkLink 節點提供的數據服務。
每個 WINkLink 節點都可以提供多組數據服務。

WINkLink 節點正常運行後，就可以通過 HTTP API 為節點添加 job:

示例：(修改下面代碼中 `address` 參數為上述步驟中部署的 Oracle 合約地址)

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

### 查詢節點 job

請求示例：

```sh
curl --location --request GET 'http://localhost:8080/job/specs'
```

## 為節點帳戶授權

節點帳戶需要授權才能向 Oracle 合約提交數據，否則會報錯 `"Not an authorized node to fulfill requests"`。

需要使用 Oracle 合約的 owner 執行如下合約調用，將節點帳戶添加到白名單:

```js
// setFulfillmentPermission(address,bool) [7fcd56db]
function setFulfillmentPermission(address _node, bool _allowed)
```

其中 `_node` 為節點帳戶地址，`_allowed` 為 `true` 代表授權，為 `false` 代表撤銷授權。

示例調用例如 `setFulfillmentPermission(TGQVLckg1gDZS5wUwPTrPgRG4U8MKC4jcP, true)`。

合約調用可以使用如下任一工具或程序庫：

- TronScan 區塊鏈瀏覽器 [Mainnet](https://tronscan.org/), [Nile Testnet](https://nile.tronscan.org/)
- [官方 wallet-cli 工具](https://github.com/tronprotocol/wallet-cli)
- [TronIDE](https://cn.developers.tron.network/docs/ide%E5%85%A5%E9%97%A8)
- [TronBox](https://cn.developers.tron.network/docs/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6%E9%83%A8%E7%BD%B2)
- [tronweb](https://cn.developers.tron.network/reference#tronwebcontractat)

<!-- ## 申請成為官方認證 WINkLink 節點

以上步驟執行完畢後，節點即可對外提供服務。

節點可以向社區公布自己的 Oracle 合約地址和所支持的數據服務 job ID. 也可以申請成為 WINkLink 官方認證節點，
在 WINkLink 官網列出自己的節點。

[申請表單](https://forms.gle/Qfqway2pW3f6Zumi8) -->
