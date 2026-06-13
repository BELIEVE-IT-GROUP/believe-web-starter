import { Button, Table } from "flowbite-react";

type TradingRow = {
  name?: string
  ticker?: string
  price?: string
  change?: string
  changePositive?: boolean
  marketCap?: string
  tradeLabel?: string
  tradeHref?: string
}

type FinancialTradingCTASectionProps = {
  headline?: string
  description?: string
  signupNote?: string
  signupCta?: { label?: string; href?: string }
  rows?: TradingRow[]
}

const DEFAULT_ROWS: TradingRow[] = [
  { name: 'Bitcoin', ticker: 'BTC', price: '$38,716.43', change: '-10.82%', changePositive: false, marketCap: '$729,729,745,340.82', tradeLabel: 'Trade', tradeHref: '#' },
  { name: 'Ethereum', ticker: 'ETH', price: '$2,818.15', change: '-13.88%', changePositive: false, marketCap: '$333,396,739,452.23', tradeLabel: 'Trade', tradeHref: '#' },
  { name: 'Cardano', ticker: 'ADA', price: '$1.22', change: '+3.76%', changePositive: true, marketCap: '$40,465,663,783.16', tradeLabel: 'Trade', tradeHref: '#' },
  { name: 'Dogecoin', ticker: 'DOGE', price: '$0.153765', change: '+8.39%', changePositive: true, marketCap: '$729,729,745,340.82', tradeLabel: 'Trade', tradeHref: '#' },
  { name: 'Polkadot', ticker: 'DOT', price: '$22.24', change: '-13.17%', changePositive: false, marketCap: '$21,710,483,995.43', tradeLabel: 'Trade', tradeHref: '#' },
]

export function FinancialTradingCTASection(props: FinancialTradingCTASectionProps = {}) {
  const rows = props.rows?.length ? props.rows : DEFAULT_ROWS
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-4 py-8 text-center sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {props.headline ?? "Buy crypto at true cost"}
          </h2>
          <p className="mb-6 text-gray-500 dark:text-gray-400 md:text-lg lg:mb-16">
            {props.description ?? "Buy and sell 250+ cryptocurrencies with 20+ fiat currencies using bank transfers or your credit/debit card."}
          </p>
        </div>
        <div className="relative mb-8 w-full overflow-x-auto">
          <Table>
            <Table.Body className="divide-y">
              {rows.map((row, i) => (
                <Table.Row key={i} className={i > 0 ? "border-b dark:border-gray-700" : undefined}>
                  <Table.Cell
                    scope="row"
                    className="bg-transparent text-xl font-bold text-gray-900 dark:bg-transparent dark:text-white"
                  >
                    {row.name ?? DEFAULT_ROWS[i]?.name}&nbsp;
                    <span className="text-gray-500 dark:text-gray-400">{row.ticker ?? DEFAULT_ROWS[i]?.ticker}</span>
                  </Table.Cell>
                  <Table.Cell className="text-xl font-bold text-gray-900 dark:text-white">
                    {row.price ?? DEFAULT_ROWS[i]?.price}
                  </Table.Cell>
                  <Table.Cell className={`text-sm font-semibold ${(row.changePositive ?? DEFAULT_ROWS[i]?.changePositive) ? 'text-green-500' : 'text-red-500'}`}>
                    {row.change ?? DEFAULT_ROWS[i]?.change}
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-gray-900 dark:text-white">
                    {row.marketCap ?? DEFAULT_ROWS[i]?.marketCap}
                  </Table.Cell>
                  <Table.Cell className="flex justify-end">
                    <Button color="info" href={row.tradeHref ?? '#'}>{row.tradeLabel ?? "Trade"}</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <p className="mb-5 text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          {props.signupNote ?? "Sign up now to build your own portfolio for free!"}
        </p>
        <Button color="info" href={props.signupCta?.href ?? "#"} className="w-fit">
          {props.signupCta?.label ?? "Sign Up Now"}
        </Button>
      </div>
    </section>
  );
}

export default FinancialTradingCTASection
