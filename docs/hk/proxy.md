# 代理合約

代理合約是鏈上代理，它存儲了某一特定餵價的最新Aggregator。使用代理可以使底層Aggregator無縫升級，而不會中斷對消費合約的服務。

注意，代理合約為 `CurrentAnwerInterface` 提供了一個一致的地址，但底層是由 owner 去更新被代理到的合約地址。

| Pair       | Contract                           |
|:-----------|:-----------------------------------|
| TRX/USD    | TVoALT2EWuYz61pSGk3vdaA2v7nDWkXcF5 |
| JST/USD    | TCfrPgHFNULydpUxarqXgGQ6nEkpao1g22 |
| WIN/USD    | TUe9QMxwBEXvpfKxBLmcrsHLEWCeqVjG1x |
| SUNOLD/USD | TKXb4abDXFKoUa9H7HT7NShutYqpyS2KjJ |
| BTC/USD    | TGH14QFybmBrpbF86MZ1UKXHZb3gJkufwh |
| USDJ/USD   | TGDMT5GEieh5QkypNuZPZdkoUMuLnbRoNP |
| USDT/USD   | TKEP3W34Ax46VG5qWwz3JEaHT3sd6nwhum |
| LIVE/USD   | TAuP3UiVv3bsCEXKP3ZFfQoqbXnWKnFfpA |
| BTTOLD/USD | TNEWUFk4dBfqeBXBHnnLWUimsN8gDQgS8o |
| TUSD/USD   | THJwwJp3NPmUPkQqwPmstnoSAhTotghP1g |
| NFT/USD    | TEDMTefgJghimW5ZFFg4dWLZ6HNL4bWBsd |
| SUN/USD    | TNo43wgMc7TZWm8odPXNnYXp2EGx5WTxNT |
| JST/TRX    | TJBgJXjjTjWz9XVoE1G4MGUf9CuttSpnA3 |
| WIN/TRX    | TRE6DK5dMrPPntN5J7W4Y4dCZ6XdBABPmm |
| SUNOLD/TRX | TDoQw5Kdvtb42c468UYFKHTtk5NuHGRMCy |
| BTC/TRX    | TVvW94Pg3nMdDERy2hn4BLqWaDhYZT2rPD |
| USDJ/TRX   | TBSR4KnxqQYNpX7aBcgZxAV9uWQytywunb |
| USDT/TRX   | TAVMLy2shiFGJgBpQHZbWPg1FDMQ1VAF15 |
| BTTOLD/TRX | TJyFLjXXNY2LQpxeZSKmaMe4YMYb8K78LQ |
| ETH/TRX    | TJ4gcqPg4PCCvds8CEGjPC8RCZQuaMEKhH |
| TUSD/TRX   | TFoqeWwf3vFcbCqdU8ZjzGVgZ4TYK8nHPa |
| NFT/TRX    | TYH5pXgks8YJAnFqWjbkxFdN4QBj12vM2i |
| SUN/TRX    | TFC7kdChdTnY2C7de3Qn5J9boKkRJNCjFy |
| USDC/USD   | TRD4xaVdMefgbrk13brFZpM7JxMxUgrFLP |
| USDC/TRX   | TAHJuuuNVVsZtxLiHuvPmJJvFPA2NVkdVo |
| BTT/USD    | TRzbLXUwQCT93bxMnphugmZkzHAVWug4h4 |
| BTT/TRX    | TDWaNo684w5VGS1vWd3d2aCRfdPuNjxxtJ |
| ETH/USD    | TJFwQstZKR6qUr5Mts6SVsAKrSoq1jx1MS |
