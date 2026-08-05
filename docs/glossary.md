# Glossary

## Data Service

An entity that connects on-chain computation and off-chain resources. It consists of the data service node and data service contract.

## Data Service Contract

The on-chain component of a data service. It is the interface for passing consumer contracts and receiving off-chain resources.

## Data Service Node

The off-chain component of a data service.

## Consumer Contract

The recipient of the data service's acquired results. For example, the `TronUser` price feed contract can request that multiple data service nodes update to the latest prices and aggregate the results.

Generally, consumers are the contracts that initiate requests, but with exceptions.

For example, the `PriceConsumer` can inquire the latest prices using `AggregatorInterface`, not by requesting the data service, but by inquiring the latest results on the price feed contract, which makes it a consumer contract as well.
