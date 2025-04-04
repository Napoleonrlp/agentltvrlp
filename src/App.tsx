import './App.css';
import { useState } from 'react';

export default function AgentLTVCalculator() {
  type RevenueKey =
    | 'rlpsphereFees'
    | 'smartleadsProgram'
    | 'redMarket'
    | 'trainingEvents'
    | 'referralRevenue'
    | 'partnerCommissions';

  type RevenueSource = {
    [key in RevenueKey]: {
      enabled: boolean;
      value: number;
    };
  };

  const [gci, setGCI] = useState(120000);
  const [royaltyRate, setRoyaltyRate] = useState(1);
  const [royaltyCap, setRoyaltyCap] = useState(1525);
  const [marketingFranchiseFeePct, setMarketingFranchiseFeePct] = useState(5);
  const [tenure, setTenure] = useState(5);

  const membershipFee = 144 * 12;

  const [extras, setExtras] = useState<RevenueSource>({
    rlpsphereFees: { enabled: false, value: 600 },
    smartleadsProgram: { enabled: false, value: 400 },
    redMarket: { enabled: false, value: 250 },
    trainingEvents: { enabled: false, value: 300 },
    referralRevenue: { enabled: false, value: 500 },
    partnerCommissions: { enabled: false, value: 400 },
  });

  const calculateRoyalty = () => Math.min(gci * (royaltyRate / 100), royaltyCap);
  const calculateFranchiseMarketing = () => gci * (marketingFranchiseFeePct / 100);
  const calculateExtras = () => Object.values(extras).filter(e => e.enabled).reduce((sum, e) => sum + e.value, 0);

  const annualRevenue = calculateRoyalty() + membershipFee + calculateFranchiseMarketing() + calculateExtras();
  const lifetimeValue = annualRevenue * tenure;

  return (
    <main className="min-h-screen bg-[var(--rlp-light)] py-10 px-4 flex justify-center items-start">
      <section className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[var(--rlp-red)] mb-10">Agent LTV Calculator</h1>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Agent GCI ($)" value={gci} onChange={setGCI} />
            <Input label="Royalty Rate (%)" value={royaltyRate} onChange={setRoyaltyRate} />
            <Input label="Royalty Cap ($)" value={royaltyCap} onChange={setRoyaltyCap} />
            <Input label="Marketing + Franchise Fee (% of GCI)" value={marketingFranchiseFeePct} onChange={setMarketingFranchiseFeePct} />
            <Input label="Tenure (Years)" value={tenure} onChange={setTenure} full />
          </div>

          <div className="pt-4">
            <h2 className="font-semibold text-lg text-[var(--rlp-red)] mb-4">Optional Revenue Sources:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(extras).map(([key, { enabled, value }]) => {
                const typedKey = key as RevenueKey;
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={e => setExtras({
                          ...extras,
                          [typedKey]: {
                            ...extras[typedKey],
                            enabled: e.target.checked
                          }
                        })}
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                    <input
                      type="number"
                      value={value}
                      disabled={!enabled}
                      onChange={e => setExtras({
                        ...extras,
                        [typedKey]: {
                          ...extras[typedKey],
                          value: +e.target.value
                        }
                      })}
                      className="input w-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        <div className="mt-12 p-6 border-4 border-[var(--rlp-red)] rounded-xl bg-white shadow-xl text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--rlp-red)] mb-2 uppercase tracking-wide">Estimated LTV to RLP</h3>
          <p className="text-5xl sm:text-6xl font-extrabold text-[var(--rlp-dark)] leading-tight">${lifetimeValue.toLocaleString()}</p>
          <p className="text-sm text-[var(--rlp-dark)] mt-2">Based on {tenure} year(s) tenure</p>
        </div>
      </section>
    </main>
  );
}

function Input({ label, value, onChange, full = false }: { label: string; value: number; onChange: (v: number) => void; full?: boolean }) {
  return (
    <label className={`block text-sm font-medium ${full ? 'sm:col-span-2' : ''}`}>{label}
      <input
        type="number"
        value={value}
        onChange={e => onChange(+e.target.value)}
        className="input w-full"
      />
    </label>
  );
}
