import funds from "./data/fund_information.json";
import fetch from "node-fetch";
import fs from "node:fs/promises";

async function fetchHistoricalPrices(symbols: string[]) {
  return Promise.allSettled(
    symbols.map(async (symbol) => {
      const response = await fetch(
        `https://interview-api-proxy.herokuapp.com/v2/aggs/ticker/${symbol}/range/1/day/2020-01-01/2021-01-01`
      );
      const data = await response.json();
      return data;
    })
  );
}

async function main() {
  const symbols = funds.map((f) => f.symbol);
  const data = (await fetchHistoricalPrices(symbols)) as any;
  const dates: Array<{ symbol: string; price: number; date: string }> = [];

  data.forEach((entry) => {
    const symbol = entry.value.ticker;
    entry.value.results.forEach((result) => {
      const date = new Date(result.t);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      dates.push({ symbol, price: result.c, date: `${year}-${month}-${day}` });
    });
  });

  return fs.writeFile(
    "portfolio_breakdown.json",
    JSON.stringify(dates, null, 2)
  );
}

main().catch(console.error);
