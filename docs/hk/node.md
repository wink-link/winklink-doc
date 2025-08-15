# 創建WINkLink節點

## 節點部署

合約部署完畢後，即可開始 WINLink 節點部署。

WINkLink 節點（項目目錄節點）代碼可點此查看：https://github.com/tron-oracle/winklink-2.0/tree/main (opens new window) — 連接您的 Github 賬戶。

::: warning
當前節點實現包含通過交易所 API 訪問代幣價格的適配器。 請在中國大陸以外的穩定網絡環境中運行節點。
:::

## 準備節點賬戶

每個 WINLink 節點必須與一個波場帳戶關聯，以便調用聚合器合約傳輸數據。

賬戶地址和私鑰生成後，開發人員可以在測試網水龍頭頁面測試 TRX 代幣。該代幣用於支付調用智能合約產生的手續費。

節點初始運行時將生成賬戶，私鑰將存儲在密鑰鏈中。 節點將使用該賬戶進行餵價傳輸。

::: warning
賬戶尚未激活，請轉賬任意數量的 TRX 到該賬戶以進行激活
:::

## 所需環境

WINkLink 節點依賴 PostgreSQL 數據庫，開發者可在 [postgresql 官網的官方文檔](https://www.postgresql.org)中獲取更多信息。

::: tip
這裏假定本機部署的 PostgreSQL 實例的用戶名和密碼分別是 root:root。在生產環境中請使用強密碼或其他驗證方式。
:::

WINkLink 節點使用的編程語言為 Go，因此需要搭建 Golang 環境。

## 節點配置

WINkLink 節點的配置文件格式為 TOML，主配置為 tools/config/config.toml。你可以使用 secrets.toml 指定要使用的 db 實例。以下為參考模板。

```toml
# secrets.toml
[Database]
URL = 'postgresql://root:root@localhost:5432/winklink?sslmode=disable' # Require
AllowSimplePasswords = true

[Password]
Keystore = 'keystorePassword' # Required

[Tron]
TronApiKey = 'apiKey'
```
節點配置文件確認完畢後，還需要創建 `apicredentials` 文件和 `password`，然後寫入用戶 ID 和密碼訪問節點 API：

```toml
# apicredentials
example.user@fake.email
totallyNotFakePassword (16 characters long)
```

```toml
# password
totallyNotFakePassword (16 characters long)
```

::: tip
請妥善托管您的個人信息。
:::

## 搭建節點 Docker 鏡像

使用以下指令構建標準的 Linux 鏡像：

```
# build a docker image
docker buildx build --platform linux/amd64 -t winklink-2.0 -f core/winklink.Dockerfile .
```

將構建好的 Docker 鏡像打上標簽並推送到所需的存儲庫進行部署。

## 用源代碼啟動節點

安装 [go1.20](https://go.dev/dl/)

前往 winklink-2.0 源代碼的基本目錄

搭建命令行界面

```
make install
```

使用以下指令及對應配置項啟動 WINkLink 節點：

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/password -a /tools/secrets/apicredentials
```

::: warning
節點帳號必須有足夠的 TRX 代幣，用於合約調用。可以通過測試網水龍頭申請測試代幣。
:::
