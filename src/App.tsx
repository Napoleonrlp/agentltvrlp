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

  const [ltv, setLTV] = useState<number | null>(null);

  const calculate = () => {
    const royalty = Math.min(gci * (royaltyRate / 100), royaltyCap);
    const franchiseMarketing = gci * (marketingFranchiseFeePct / 100);
    const optionalRevenue = Object.values(extras)
      .filter(extra => extra.enabled)
      .reduce((sum, extra) => sum + extra.value, 0);
    const annualRevenue = royalty + franchiseMarketing + membershipFee + optionalRevenue;
    const totalLTV = annualRevenue * tenure;
    setLTV(totalLTV);
  };

  const reset = () => {
    setGCI(120000);
    setRoyaltyRate(1);
    setRoyaltyCap(1525);
    setMarketingFranchiseFeePct(5);
    setTenure(5);
    setExtras({
      rlpsphereFees: { enabled: false, value: 600 },
      smartleadsProgram: { enabled: false, value: 400 },
      redMarket: { enabled: false, value: 250 },
      trainingEvents: { enabled: false, value: 300 },
      referralRevenue: { enabled: false, value: 500 },
      partnerCommissions: { enabled: false, value: 400 },
    });
    setLTV(null);
  };

  return (
    <main>
      <section>
        <h1>Agent LTV Calculator</h1>

        <form>
          <label>Agent GCI ($):
            <input type="number" value={gci} onChange={e => setGCI(+e.target.value)} />
          </label>

          <label>Royalty Rate (%):
            <input type="number" value={royaltyRate} onChange={e => setRoyaltyRate(+e.target.value)} />
          </label>

          <label>Royalty Cap ($):
            <input type="number" value={royaltyCap} onChange={e => setRoyaltyCap(+e.target.value)} />
          </label>

          <label>Marketing + Franchise Fee (% of GCI):
            <input type="number" value={marketingFranchiseFeePct} onChange={e => setMarketingFranchiseFeePct(+e.target.value)} />
          </label>

          <label>Tenure (Years):
            <input type="number" value={tenure} onChange={e => setTenure(+e.target.value)} />
          </label>

          <h3>Optional Revenue Sources:</h3>
          <div className="optional-grid">
            {Object.entries(extras).map(([key, { enabled, value }]) => {
              const typedKey = key as RevenueKey;
              return (
                <div key={key} className="optional-item">
                  <label>
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
                    />{' '}
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
                    disabled={!enabled}
                  />
                </div>
              );
            })}
          </div>

          <div className="button-group">
            <button type="button" className="primary" onClick={calculate}>Calculate LTV</button>
            <button type="button" className="secondary" onClick={reset}>Reset</button>
          </div>
        </form>

        {ltv !== null && (
          <div className="result-box">
            <h3>Estimated LTV to RLP</h3>
            <p className="result-amount">${ltv.toLocaleString()}</p>
            <p>Based on {tenure} year(s) tenure</p>
          </div>
        )}
      </section>
    </main>
  );
}
