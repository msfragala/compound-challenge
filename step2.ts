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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

let total = 0;
let output = "";

portfolio.forEach((portfolio) => {
  const fund = fundsMap[portfolio.symbol];
  const price = pricesMap[portfolio.symbol];
  const sharePrice = formatCurrency(price);
  const sharesTotal = formatCurrency(portfolio.shares * price);

  output += `\n${fund.name}: ${portfolio.shares} shares at ${sharePrice} ea. -- ${sharesTotal}`;
  total += portfolio.shares * price;
});

output += `\nTotal: ${formatCurrency(total)}`;
console.log(output);
