# Introduction to WINkLink
## What is Oracle
For quite some time, smart contracts powered by blockchain have been unable to directly communicate with external systems, which has limited the variety of smart contract-based applications.

The introduction of an oracle provides a solution to connect smart contracts with the outside world. However, most oracles on the market are currently centralized, which exposes corresponding smart contracts to the risk of a single point of failure, compromising the benefits promised by their decentralized nature.

## What is WINkLink

WINkLink is a decentralized oracle project that operates on the TRON network. For more information about the TRON Network and its development basics, please visit [TRON Developer Hub](https://developers.tron.network).

WINkLink has created a decentralized oracle project that provides external data for smart contracts. It connects smart contracts with various real-life events while ensuring a high level of security and reliability

With the sharp rise of various DeFi applications, a stable and reliable decentralized oracle service is essential for premium DeFi projects. This is where WINkLink comes in, as it addresses the needs of TRON-based smart contracts to access external data.

## How WINkLink Works
WINkLink Node Model
```mermaid
flowchart LR
A[External data source] <--> B[WINkLink node] <--> C[TRON BlockChain API]
```

The WINkLink oracle node structure consists of three main modules, as illustrated above:

- External data source 
- WINkLink node
- TRON blockchain

Let us take a closer look at each of these modules.

### External Data Source

The external data source module encompasses all the external data that is available to the native blockchain. This includes centralized exchanges, centralized oracles, stock exchange APIs, and other such sources of data.

### WINkLink Node

The WINkLink node is responsible for running task processing, monitoring on-chain contract requests (via Event), retrieving data from external data sources, and submitting results to the blockchain.

### TRON blockchain

The TRON blockchain node primarily consists of the API services provided by the TRON blockchain. These include Fullnode API and Event API services. Through these APIs, the WINkLink node can monitor specific contract events to trigger tasks, sign and broadcast transactions, and return data back to the **consumer contract**.

As indicated by the double-headed arrow, the WINkLink node subscribes to blockchain events while broadcasting transactions via API and returning data results.

## WINkLink Request Model

### Create a Request

```mermaid
sequenceDiagram
Caller->>ConsumerContract: request an oracle data update
activate ConsumerContract
ConsumerContract->>OracleContract: transferAndCall send token and request
activate OracleContract
OracleContract->>OracleContract: emit OracleRequest event
OracleContract-->>ConsumerContract: request ID
deactivate OracleContract
ConsumerContract-->>Caller: request ID
deactivate ConsumerContract
```

### Process a Request

The Oracle's contract events asynchronously trigger the following procedure:

```mermaid
sequenceDiagram
Note over WINKLinkNode: get an event from Event API
activate WINKLinkNode
WINKLinkNode->>WINKLinkNode: call different adapter according to job ID
WINKLinkNode->>OracleContract: fulfill call, submit data
activate OracleContract
OracleContract->>ConsumerContract: call callback function
activate ConsumerContract
ConsumerContract->>ConsumerContract: update data according to callback logic
ConsumerContract-->>OracleContract: success?
deactivate ConsumerContract
deactivate OracleContract
deactivate WINKLinkNode
```

## WINkLink Off-Chain Reporting Model

Off-Chain Reporting (OCR) is a new method for aggregating data that promises to improve scalability, stability, and decentralization in the WINkLink network.

With OCR, all nodes in the network interact through a peer-to-peer (P2P) network, with one node acting as the leader and the others as followers. The P2P network uses a lightweight consensus algorithm during communication. Each node reports its signed data observation back to the leader, who generates a consolidated report. If the transmission conditions are met, this report is broadcast onto the blockchain as a single aggregate transaction. This process leads to a single aggregate transaction, which greatly reduces gas consumption.

The aggregated transaction contains a report that is signed by a quorum of oracles and includes all their observations. To maintain the trustlessness properties of WINkLink oracle networks, the report is validated on-chain and the quorum's signatures are verified on-chain.

Currently, the Off-Chain Reporting model is still in its beta phase, and additional information will be made available once it has been stabilized.

## Core Mechanism Terms

This section gives a brief reference for the mechanism terms used throughout the price feed documentation.

- **Aggregator** — The on-chain contract that aggregates price data submitted by WINkLink oracle nodes and provides an aggregated price to consumers. See [WINkLink Price Feed Service](./pricing.md#winklink-price-feed-service-introduction) and [API Reference](./api-reference.md).

- **Median** — The aggregation method: the final on-chain price is the median of prices submitted by 7 nodes.

- **Heartbeat** — A fixed time interval that forces a price update even when the price is stable, keeping on-chain freshness predictable.

- **Deviation Threshold** — A percentage threshold; when the off-chain price moves beyond this versus the last on-chain price, an on-chain update is triggered.

- **Round / RoundId** — A round is one price update cycle; each round has a unique `uint80` identifier returned by Aggregator methods. See [Acquire Price History](./pricing.md#acquire-price-history) and [API Reference](./api-reference.md).

## Join the WINkLink Ecosystem

Welcome to the WINkLink ecosystem! Collaborate with WINkLink to create a trusted on-chain data network.

**Community Channels:**
- Telegram: [Join channel](https://t.me/WINkLink_Oracle_official)
- GitHub Project: [GitHub - wink-link/winklink](https://github.com/wink-link/winklink)

**How to Participate:**

Whether you are a data consumer, data provider, or node operator, you can contribute to the WINkLink ecosystem.

- Become a Data Consumer — Trusted Price Feeds for DeFi Security<br> 👉 [Apply Here](https://docs.google.com/forms/d/e/1FAIpQLSd-YWewuQcKDTEeL-IitHFUEAy6mXaRj_yLic2vtXi8FhFaVw/viewform)

- Become a Data Provider — Unlock Value for Trusted Data Sources<br> 👉 [Apply Here](https://docs.google.com/forms/d/e/1FAIpQLScasXYrYtSG9VC9LK_QUEbXPL76jSVZd26dy-Z4T5IV76h2Kg/viewform)

- Run a WINkLink Node — Join the node network to enhance the ecosystem’s security and decentralization.<br> 👉 [View Node Deployment Guide](https://doc.winklink.org/v2/doc/node.html)