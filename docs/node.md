# Building a WinkLink Node

## Node Deployment

WINkLink node can be deployed after the contract is deployed.

WINkLink node (project directory node) code is available at: <https://github.com/tron-oracle/winklink-2.0/tree/main> - Connect your Github account .

::: warning
Current node implementation includes the adapter for accessing token price via exchange APIs. Please run the node in a stable network environment outside Mainland China.
:::

## Prepare Node Account

Each WINkLink node must be linked to a TRON account for calling Aggregator contract to transmit data.

After generating the account address and the private key, the developer can test TRX token on the Testnet Faucet page.The token is used for paying the handling fees on calling the smart contracts.

Account will be generated on the initial run of the node and the private key will be stored in the keychain. Node will use this account for price feed transmissions.

::: warning
Account generated is not activated, please transfer any amount of TRX into the account for activation
:::

## Required Environment

WINkLink node relies on a running PostgreSQL database. Developers can find more information in the official documentation PostgreSQL .

::: tip
Here we assume that the username and the password for the PostgreSQL instance deployed locally are root:root respectively. Please use a strong password or other verification methods in the production environment.
:::

WINkLink node is written in Go programming language and requires Golang environment.

## Node Configuration

WINkLink node is configured using TOML files. Main config is `tools/config/config.toml`. With `secrets.toml` you can specify a db instance to be used. Below is a sample template for reference.

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

After the node configuration file is confirmed, it is required to create `password` and `apicredentials` files and write the userid and password to access the node’s api:

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
It is important that you keep private information safe.
:::


## Building a docker image for the node

Use the following command to build a standard linux docker image:

```
#build a docker image
docker buildx build --platform linux/amd64 -t winklink-2.0 -f core/winklink.Dockerfile .
```

After building, we can tag and push it to the desired repository for deployment.

## Start a Node from source code

Install [go1.20](https://go.dev/dl/)

Go into the base directory of the source code winklink-2.0

Build the command line interface with

```
make install
```

Start your WINkLink node using the following command with the respective configuration items:

```
winklink -c /tools/config/config.toml -s /tools/config/secrets.toml node start -p /tools/secrets/vrfpassword -a /tools/secrets/apicredentials
```

::: warning
Your node account must have enough TRX tokens for contract calls. You can apply testnet tokens at Testnet Faucet.
:::