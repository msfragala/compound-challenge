import portfolio from "./data/portfolio_allocation_current.json";
import fundPrices from "./fund_prices.json";
import funds from "./data/fund_information.json";

const fundsMap: Record<string, typeof funds[number]> = funds.reduce(
  (map, fund) => {
    map[fund.symbol] = fund;
    return map;
  },
  {}
);

const pricesMap: Record<string, number> = fundPrices.reduce(
  (map, priceInfo) => {
    map[priceInfo.symbol] = priceInfo.price;
    return map;
  },
  {}
);

function formatPercentage(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value);
}

let total = 0;
let assetClassTotals: Record<string, number> = {};

portfolio.forEach(({ symbol, shares }) => {
  const { assetClass } = fundsMap[symbol];
  const price = pricesMap[symbol];

  if (!assetClassTotals[assetClass]) {
    assetClassTotals[assetClass] = 0;
  }

  assetClassTotals[assetClass] += price * shares;
  total += price * shares;
});

let output = "\nAsset Class Breakdown";

Object.keys(assetClassTotals)
  .sort((a, b) => a.localeCompare(b))
  .forEach((assetClass) => {
    const amount = assetClassTotals[assetClass];
    const percentage = amount / total;
    output += `\n  ${assetClass}: ${formatPercentage(percentage)}`;
  });

console.log(output);
