import { useState } from 'react';

export default function AgentLTVCalculator() {
  const [gci, setGCI] = useState(120000);
  const [royaltyRate, setRoyaltyRate] = useState(1);
  const [royaltyCap, setRoyaltyCap] = useState(1525);
  const [membershipFee, setMembershipFee] = useState(144 * 12); // $144 monthly
  const [marketingFranchiseFeePct, setMarketingFranchiseFeePct] = useState(5); // industry average

  const [extras, setExtras] = useState({
    rlpsphereFees: { enabled: false, value: 600 },
    smartleadsProgram: { enabled: false, value: 400 },
    redMarket: { enabled: false, value: 250 },
    trainingEvents: { enabled: false, value: 300 },
    referralRevenue: { enabled: false, value: 500 },
    partnerCommissions: { enabled: false, value: 400 },
  });

  const calculateRoyalty = () => {
    const royalty = (gci * (royaltyRate / 100));
    return royalty > royaltyCap ? royaltyCap : royalty;
  };

  const calculateFranchiseMarketing = () => gci * (marketingFranchiseFeePct / 100);

  const calculateExtras = () => {
    return Object.values(extras)
      .filter(extra => extra.enabled)
      .reduce((sum, extra) => sum + (extra.value || 0), 0);
  };

  const totalAnnualRevenue = calculateRoyalty() + membershipFee + calculateFranchiseMarketing() + calculateExtras();

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4 text-[var(--rlp-dark)] bg-[var(--rlp-light)] font-sans">
      <h2 className="text-2xl font-bold text-[var(--rlp-red)]">Agent LTV Calculator</h2>

      <div className="space-y-2">
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
      </div>

      <div>
        <h3 className="font-semibold text-lg mt-4">Optional Revenue Sources:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(extras).map(([key, { enabled, value }]) => (
            <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={e => setExtras({ ...extras, [key]: { ...extras[key], enabled: e.target.checked } })}
                />
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </label>
              <input
                type="number"
                value={value}
                onChange={e => setExtras({ ...extras, [key]: { ...extras[key], value: +e.target.value } })}
                className="input w-full sm:w-24"
                disabled={!enabled}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 border rounded bg-white shadow text-center">
        <h4 className="text-xl font-semibold text-[var(--rlp-red)]">Estimated Annual Value to RLP</h4>
        <p className="text-3xl font-bold">${totalAnnualRevenue.toLocaleString()}</p>
      </div>
    </div>
  );
}
