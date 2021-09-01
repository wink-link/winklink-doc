# Proxy

Proxy contracts are on-chain proxies that store the most up-to-date Aggregator for a particular price feed. Using proxies enables the underlying Aggregator to be upgraded without any interruption of service for consuming contracts.

A trusted proxy is for updating where current answers are read from.
notice This contract provides a consistent address for the `CurrentAnwerInterface` but delegates where it reads from to the owner, who is trusted to update it.

|Pair|Contract|
|:--|:--|
|TRX/USD  | TXwZqjjw4HtphG4tAm5i1j1fGHuXmYKeeP |
|JST/USD  | TPMkqBh7kU16Zmv9EAtm6vfWYrTax4Aucb |
|WIN/USD  | TQU2nPFvemv6hbtmJ48Z749a7VcAmacV4D |
|SUNOLD/USD  | TYzFE7fC46yjs3p5JUidvxzg9XMFT7qWZy |
|DICE/USD | TP4nTfoGu9pTdMR4PNc6rH1NM7AS7MGWLm |
|BTC/USD  | TTzPaLxJMy8nwXe9NRfHopHW4KyUeavLdF |
|USDJ/USD | TBxnH94m2Zsp869QpiAoCHt54wCsFSUsSP |
|USDT/USD | TYWY6L4mECH2Gtiq3sg4zY4fvD1XZpwGrb |
|LIVE/USD | TFFVcMViFUn3UEXVMPeuWjb4xo6TwUacog |
|BTT/USD  | TM2CEasFpeREBtLWgkzMqASkn5mvtf12He |
|JST/TRX  | TXMSfKwBfvY6THwnTzRRteYHdB125rKBKK |
|TUSD/USD | TXyKzmu2J2eXcVspbLnnzuQmU2krLxb8dG |
|NFT/USD  | TS15kJyth5F7vAE5bpzAUumEGFDsnYkEGF |
|SUN/USD  | TAKUV2gwwmAG7fCtwSW9VwSrGnPikuuw5p |
|WIN/TRX  | TFtL1Kdb2n5yrVTxa6qYgwnNEAAGnKiuDT |
|SUNOLD/TRX  | TGoKRdiC9TrEoVZcKNFRa7oDEdC4S6Ra9r |
|DICE/TRX | TW4VZcEmjSBZLWjQiWr4jNitVGB2Bn3dCo |
|BTC/TRX  | TPdsKCrr3SJ2HMvt9tTVy3CjhN1CuvEUqc |
|USDJ/TRX | TRTpP7TN186YAncgn5Yfjnw4Kds56BneAc |
|USDT/TRX | TRf25FSQQzHQ7j1Td7dtYUBPb8R5yVCx2L |
|BTT/TRX  | TEDsjLSWQjERk4baV2NjPUDAzfxxACBgQE |
|ETH/TRX  | TBnthNeA1wjNDquD6kXYY2zTRLFyg5eMmj |
|ETH/USD  | TZCPyp7fWW3xnQ6gv5LG9v7S7VYbr4h2H1 |
|TUSD/TRX | TDtUKwNXhFp7HrKcAGR5jYEJBEURod8s2f |
|NFT/TRX  | TXSf7X1Dw7CGmykSQeNBDgKhCPw8Ehvggq |
|SUN/TRX  | TPVW4azkkthtLdYGLUPdQGLvU9Tciuhq5a |
|USDC/USD  | THL5y573nNXkHbHY8ZkZNLPZTMXdkq9aFr |
|USDC/TRX  | TSLmB88ek8npjBKeQRzdYZJMpabwfvj2PT |
