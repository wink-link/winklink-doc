# Glossary

## Oracle

An entity that connects on-chain computation and off-chain resources .It consists of the Oracle node and Oracle contract.

## Oracle Contract

The on-chain component of Oracle. It is the interface for passing consumer contracts and receiving off-chain resources.

## Oracle Node

The off-chain component of Oracle.

## Consumer Contract

The recipient of Oracle's acquired results. For example, the `TronUser` price feed contract can request that multiple Oracles update to the latest prices and aggregate the results.

Generally, consumers are the contracts that initiate requests, but with exceptions.

For example, the `PriceConsumer` can inquire the latest prices using `AggregatorInterface`, not by requesting Oracle, but by inquiring the latest results on the price feed contract, which makes it a consumer contract as well.
