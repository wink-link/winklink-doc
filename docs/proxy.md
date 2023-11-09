# Proxy

Proxy contracts are on-chain proxies that store the most up-to-date Aggregator for a particular price feed. Using proxies enables the underlying Aggregator to be upgraded without any interruption of service for consuming contracts.

A trusted proxy is for updating where current answers are read from. notice This contract provides a consistent address for the `CurrentAnwerInterface` but delegates where it reads from to the owner, who is trusted to update it.
:::warning
Please do note that effective from 01 July onwards, the proxy contract address will be switched over to the V2 Version as indicated in the following table.
:::

| Pair       | Proxy Address (FluxAggregator)     | Proxy Address (`AccessControlledOCRAggregator`) |
|:-----------|:-----------------------------------|:------------------------------------------------|
| TRX/USD    | TVoALT2EWuYz61pSGk3vdaA2v7nDWkXcF5 | TR5HtpPK4gX4RFC4DCBUHfFgsGkGFEzSAb              |
| JST/USD    | TCfrPgHFNULydpUxarqXgGQ6nEkpao1g22 | TE5rKoDzKmpVAQp1sn7x6V8biivR3d5r47              |
| WIN/USD    | TUe9QMxwBEXvpfKxBLmcrsHLEWCeqVjG1x | TSCef3LT3jpLwwXCWhZe3hZoMsYk1ZLif2              |
| SUNOLD/USD | TKXb4abDXFKoUa9H7HT7NShutYqpyS2KjJ | TEEuSdqyv2NFREtNoUXMTDSmJVK3KCuLac              |
| BTC/USD    | TGH14QFybmBrpbF86MZ1UKXHZb3gJkufwh | TQoijQ1iZKRgJsAAWNPMu6amgtCJ3WMUV7              |
| USDJ/USD   | TGDMT5GEieh5QkypNuZPZdkoUMuLnbRoNP | TB1MyT7pDCNg8w7cSW1QvYKs4WPzErzP5k              |
| USDT/USD   | TKEP3W34Ax46VG5qWwz3JEaHT3sd6nwhum | TKePc46n5CiUCR8LL788TFeKA4kjvNnuem              |
| LIVE/USD   | TAuP3UiVv3bsCEXKP3ZFfQoqbXnWKnFfpA | TNdLmxVhdj1H1yGjhhSp33cMaAJKjyTAM4              |
| BTTOLD/USD | TNEWUFk4dBfqeBXBHnnLWUimsN8gDQgS8o | TEEnwU47Fgx4Ehii7Xs9bLWK3XKo4fs6sV              |
| TUSD/USD   | THJwwJp3NPmUPkQqwPmstnoSAhTotghP1g | TBc3yBP8xcyQ1E3hDTUhRxToMrgekLH2kh              |
| NFT/USD    | TEDMTefgJghimW5ZFFg4dWLZ6HNL4bWBsd | TGosrYP5feJ18mtB1afh5cz6GMXafUKtyR              |
| SUN/USD    | TNo43wgMc7TZWm8odPXNnYXp2EGx5WTxNT | TWbptpQjkDjAfBhoUD84BvRHnALHPGiRgk              |
| JST/TRX    | TJBgJXjjTjWz9XVoE1G4MGUf9CuttSpnA3 | TC19QPF2mjP1ZhXxD8JNKJs4ksxMZkCuNP              |
| WIN/TRX    | TRE6DK5dMrPPntN5J7W4Y4dCZ6XdBABPmm | TQvCG1U2jGTVwXLqvFWR27LDtEJZVgRbEg              |
| SUNOLD/TRX | TDoQw5Kdvtb42c468UYFKHTtk5NuHGRMCy | TWAob1YsNzh7bfgkjfAD9MAdarcoSWScWw              |
| BTC/TRX    | TVvW94Pg3nMdDERy2hn4BLqWaDhYZT2rPD | TX4rin6u2SaF3TqANqRgzfSCGi95azQNVY              |
| USDJ/TRX   | TBSR4KnxqQYNpX7aBcgZxAV9uWQytywunb | TCBKyYMP4YQFHxYznuUaResHDTaEWLuJNW              |
| USDT/TRX   | TAVMLy2shiFGJgBpQHZbWPg1FDMQ1VAF15 | TUfV7S4RYtdmBvtHzedfFPVsK9nvndtETp              |
| BTTOLD/TRX | TJyFLjXXNY2LQpxeZSKmaMe4YMYb8K78LQ | TUjTmKMxGmH78t5DmY7YsfJFoGw6XyX9VZ              |
| ETH/TRX    | TJ4gcqPg4PCCvds8CEGjPC8RCZQuaMEKhH | TXZ9AUk6nC2454NSDGUWvPB72JxSNJrezX              |
| TUSD/TRX   | TFoqeWwf3vFcbCqdU8ZjzGVgZ4TYK8nHPa | TLXMULb1SRpv841Q54C4DhWkmmGfRA2rUH              |
| NFT/TRX    | TYH5pXgks8YJAnFqWjbkxFdN4QBj12vM2i | TKtc1V6QAY1Gpy511QjzXkLUphG8Dre8CY              |
| SUN/TRX    | TFC7kdChdTnY2C7de3Qn5J9boKkRJNCjFy | TLLyqXr5cbYEMjzeThe1esss1SVBbxxubu              |
| USDC/USD   | TRD4xaVdMefgbrk13brFZpM7JxMxUgrFLP | TNu3zS55MP4KnBBP6Maw1nHSzRpc3CXAxm              |
| USDC/TRX   | TAHJuuuNVVsZtxLiHuvPmJJvFPA2NVkdVo | TNTm5ezUGHxYc9Mvst58yYTAjxDmqWWGZc              |
| BTT/USD    | TRzbLXUwQCT93bxMnphugmZkzHAVWug4h4 | TBAAW545oJ6iTxqzezGvagrSUzCpz1S8eR              |
| BTT/TRX    | TDWaNo684w5VGS1vWd3d2aCRfdPuNjxxtJ | TS26cn4GmmipyGTcgvRRwqL6AyEU6vK4rw              |
| ETH/USD    | TJFwQstZKR6qUr5Mts6SVsAKrSoq1jx1MS | TR2yWYWovJaSM7TfZq7L7sT7ZRugdJJQmL              |
| BUSD/TRX   |                                    | TNjd3CCfdbpYZVNz6Tzf7LtjU3wT4Pit8w              |
| BUSD/USD   |                                    | TTwxWVbsLfQTBLqWiremnZtzddeUCYDC8r              |
| USDD-TRX   |                                    | TWW4P2pck8rFcxx3H8NfnH4qhNPu1V35Pb              |