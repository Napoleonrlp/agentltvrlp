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
  const membershipFee = 144 * 12;
  const [marketingFranchiseFeePct, setMarketingFranchiseFeePct] = useState(5);
  const [tenure, setTenure] = useState(5);

  const [extras, setExtras] = useState<RevenueSource>({
    rlpsphereFees: { enabled: false, value: 600 },
    smartleadsProgram: { enabled: false, value: 400 },
    redMarket: { enabled: false, value: 250 },
    trainingEvents: { enabled: false, value: 300 },
    referralRevenue: { enabled: false, value: 500 },
    partnerCommissions: { enabled: false, value: 400 },
  });

  const calculateRoyalty = () => {
    const royalty = gci * (royaltyRate / 100);
    return royalty > royaltyCap ? royaltyCap : royalty;
  };

  const calculateFranchiseMarketing = () => gci * (marketingFranchiseFeePct / 100);

  const calculateExtras = () => {
    return Object.values(extras)
      .filter(extra => extra.enabled)
      .reduce((sum, extra) => sum + (extra.value || 0), 0);
  };

  const annualRevenue = calculateRoyalty() + membershipFee + calculateFranchiseMarketing() + calculateExtras();
  const lifetimeValue = annualRevenue * tenure;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--rlp-light)] px-4 py-8">
      <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-2xl space-y-6 text-[var(--rlp-dark)] font-sans border border-gray-200 sm:mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[var(--rlp-red)] mb-4">Agent LTV Calculator</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">Agent GCI ($):
            <input type="number" value={gci} onChange={e => setGCI(+e.target.value)} className="input w-full" />
          </label>

          <label className="block">Royalty Rate (%):
            <input type="number" value={royaltyRate} onChange={e => setRoyaltyRate(+e.target.value)} className="input w-full" />
          </label>

          <label className="block">Royalty Cap ($):
            <input type="number" value={royaltyCap} onChange={e => setRoyaltyCap(+e.target.value)} className="input w-full" />
          </label>

          <label className="block">Marketing + Franchise Fee (% of GCI):
            <input type="number" value={marketingFranchiseFeePct} onChange={e => setMarketingFranchiseFeePct(+e.target.value)} className="input w-full" />
          </label>

          <label className="block">Tenure (Years):
            <input type="number" value={tenure} onChange={e => setTenure(+e.target.value)} className="input w-full" />
          </label>
        </div>

        <div>
          <h3 className="font-semibold text-lg mt-4 text-[var(--rlp-red)]">Optional Revenue Sources:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(extras).map(([key, { enabled, value }]) => {
              const typedKey = key as RevenueKey;
              return (
                <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={e =>
                        setExtras({
                          ...extras,
                          [typedKey]: {
                            ...extras[typedKey],
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={e =>
                      setExtras({
                        ...extras,
                        [typedKey]: {
                          ...extras[typedKey],
                          value: +e.target.value,
                        },
                      })
                    }
                    className="input w-full sm:w-24"
                    disabled={!enabled}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 p-6 border-4 border-[var(--rlp-red)] rounded-xl bg-white shadow-lg text-center">
          <h4 className="text-2xl sm:text-3xl font-bold text-[var(--rlp-red)] mb-2 uppercase">Estimated LTV to RLP</h4>
          <p className="text-5xl sm:text-6xl font-extrabold text-[var(--rlp-dark)] tracking-tight leading-tight">${lifetimeValue.toLocaleString()}</p>
          <p className="text-sm text-[var(--rlp-dark)] mt-2">Based on {tenure} year(s) tenure</p>
        </div>
      </div>
    </div>
  );
}
