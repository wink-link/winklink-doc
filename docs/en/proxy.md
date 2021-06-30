# Proxy

Proxy contracts are on-chain proxies that store the most up-to-date Aggregator for a particular price feed. Using proxies enables the underlying Aggregator to be upgraded without any interruption of service for consuming contracts.

A trusted proxy is for updating where current answers are read from.
notice This contract provides a consistent address for the `CurrentAnwerInterface` but delegates where it reads from to the owner, who is trusted to update it.

|Pair|Contract|
|:--|:--|
|TRX/USD  | TVoALT2EWuYz61pSGk3vdaA2v7nDWkXcF5 |
|JST/USD  | TCfrPgHFNULydpUxarqXgGQ6nEkpao1g22 |
|WIN/USD  | TUe9QMxwBEXvpfKxBLmcrsHLEWCeqVjG1x |
|SUNOLD/USD  | TKXb4abDXFKoUa9H7HT7NShutYqpyS2KjJ |
|DICE/USD | TScYfxYxCVNo3YDDBhdS4nDCW573SGZHLC |
|BTC/USD  | TGH14QFybmBrpbF86MZ1UKXHZb3gJkufwh |
|USDJ/USD | TGDMT5GEieh5QkypNuZPZdkoUMuLnbRoNP |
|USDT/USD | TKEP3W34Ax46VG5qWwz3JEaHT3sd6nwhum |
|LIVE/USD | TAuP3UiVv3bsCEXKP3ZFfQoqbXnWKnFfpA |
|BTT/USD  | TNEWUFk4dBfqeBXBHnnLWUimsN8gDQgS8o |
|TUSD/USD | THJwwJp3NPmUPkQqwPmstnoSAhTotghP1g |
|NFT/USD  | TEDMTefgJghimW5ZFFg4dWLZ6HNL4bWBsd |
|SUN/USD  | TNo43wgMc7TZWm8odPXNnYXp2EGx5WTxNT |
|JST/TRX  | TJBgJXjjTjWz9XVoE1G4MGUf9CuttSpnA3 |
|WIN/TRX  | TRE6DK5dMrPPntN5J7W4Y4dCZ6XdBABPmm |
|SUNOLD/TRX  | TDoQw5Kdvtb42c468UYFKHTtk5NuHGRMCy |
|DICE/TRX | TDtmDgv67sDmL7KkefBhQ9fbBGBPfEcWKx |
|BTC/TRX  | TVvW94Pg3nMdDERy2hn4BLqWaDhYZT2rPD |
|USDJ/TRX | TBSR4KnxqQYNpX7aBcgZxAV9uWQytywunb |
|USDT/TRX | TAVMLy2shiFGJgBpQHZbWPg1FDMQ1VAF15 |
|BTT/TRX  | TJyFLjXXNY2LQpxeZSKmaMe4YMYb8K78LQ |
|ETH/TRX  | TJ4gcqPg4PCCvds8CEGjPC8RCZQuaMEKhH |
|TUSD/TRX | TFoqeWwf3vFcbCqdU8ZjzGVgZ4TYK8nHPa |
|NFT/TRX  | TYH5pXgks8YJAnFqWjbkxFdN4QBj12vM2i |
|SUN/TRX  | TFC7kdChdTnY2C7de3Qn5J9boKkRJNCjFy |
