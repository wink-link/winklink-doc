# 创建WINkLink节点

## 节点部署

合约部署完毕后，即可开始 WINkLink 节点部署。

WINkLink 节点（项目目录节点）代码可点此查看：<https://github.com/tron-oracle/winklink-2.0/tree/main> — 连接您的 Github 账户。

::: warning
当前节点实现包含通过交易所 API 访问代币价格的适配器。 请在中国大陆以外的稳定网络环境中运行节点。
:::

## 准备节点账户

每个 WINkLink 节点必须与一个波场帐户关联，以便调用聚合器合约传输数据。

账户地址和私钥生成后，开发人员可以在测试网水龙头页面测试 TRX 代币。该代币用于支付调用智能合约产生的手续费。

节点初始运行时将生成账户，私钥将存储在密钥链中。 节点将使用该账户进行喂价传输。

::: warning
账户尚未激活，请转账任意数量的 TRX 到该账户以进行激活
:::

## 所需环境

WINkLink 节点依赖 PostgreSQL 数据库， 开发者可在 PostgreSQL 的官方文档中获取更多信息。

::: tip
这里假定本机部署的 PostgreSQL 实例的用户名和密码分别是 root:root。 在生产环境中请使用强密码或其他验证方式。
:::

WINkLink 节点使用的编程语言为 Go，因此需要搭建 Golang 环境。

## 节点配置

WINkLink 节点的配置文件格式为 TOML， 主配置为 tools/config/config.toml。 你可以使用 secrets.toml 指定要使用的 db 实例。 以下为参考模板。

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

节点配置文件确认完毕后，还需要创建 apicredentials 文件和密码，然后写入用户 ID 和密码访问节点 API：

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
请妥善托管您的个人信息。
:::


## 搭建节点 Docker 镜像

使用以下指令构建标准的 Linux 镜像：

```
#build a docker image
docker buildx build --platform linux/amd64 -t winklink-2.0 -f core/winklink.Dockerfile .
```

将构建好的 Docker 镜像打上标签并推送到所需的存储库进行部署。

## 用源代码启动节点

安装 [go1.20](https://go.dev/dl/)

前往 winklink-2.0 源代码的基本目录

搭建命令行界面

```
make install
```

使用以下指令及对应配置项启动 WINkLink 节点：

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/vrfpassword -a /tools/secrets/apicredentials
```

::: warning
节点帐号必须有足够的 TRX 代币，用于合约调用。 可以通过测试网水龙头申请测试代币。
:::