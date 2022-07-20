import funds from "./data/fund_information.json";
import fetch from "node-fetch";
import fs from "node:fs/promises";

async function main() {
  const symbols = funds.map((f) => f.symbol);
  const stocks = await fetchStocks(symbols);
  const content = stocks.map((data: any) => ({
    symbol: data.value.symbol,
    price: data.value.last.price,
  }));

  fs.writeFile("fund_prices.json", JSON.stringify(content, null, 2));
}

async function fetchStocks(symbols: string[]) {
  return Promise.allSettled(
    symbols.map(async (symbol) => {
      const response = await fetch(
        `https://interview-api-proxy.herokuapp.com/v1/last/stocks/${symbol}`
      );
      const data = await response.json();
      return data;
    })
  );
}

main().catch(console.error);
