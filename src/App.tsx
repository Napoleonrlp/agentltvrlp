import { useState } from 'react';

export default function RecruitmentROICalculator() {
  const [gci, setGCI] = useState(100000);
  const [retention, setRetention] = useState(3);
  const [cpa, setCPA] = useState(10126.99);
  const [monthlyFee, setMonthlyFee] = useState(144);
  const [royaltyRate, setRoyaltyRate] = useState(0.01);
  const [royaltyCap, setRoyaltyCap] = useState(1525);
  const [roi, setROI] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);

  const calculate = () => {
    const annualRoyalty = Math.min(gci * royaltyRate, royaltyCap);
    const annualRevenue = (monthlyFee * 12 + annualRoyalty) * retention;
    const roiValue = ((annualRevenue - cpa) / cpa) * 100;

    setRevenue(annualRevenue);
    setROI(roiValue);
  };

  const reset = () => {
    setGCI(100000);
    setRetention(3);
    setCPA(10126.99);
    setMonthlyFee(144);
    setRoyaltyRate(0.01);
    setRoyaltyCap(1525);
    setROI(null);
    setRevenue(null);
  };

  return (
    <main>
      <section>
        <h1>Recruitment ROI Calculator</h1>

        <form>
          <label>Agent Annual GCI ($):
            <input type="number" value={gci} onChange={(e) => setGCI(+e.target.value)} />
          </label>

          <label>Retention (Years):
            <input type="number" value={retention} onChange={(e) => setRetention(+e.target.value)} />
          </label>

          <label>Cost Per Agent Hired (CPA $):
            <input type="number" value={cpa} onChange={(e) => setCPA(+e.target.value)} />
          </label>

          <label>Monthly Membership Fee ($):
            <input type="number" value={monthlyFee} onChange={(e) => setMonthlyFee(+e.target.value)} />
          </label>

          <label>Royalty Rate (%):
            <input type="number" step="0.01" value={royaltyRate} onChange={(e) => setRoyaltyRate(+e.target.value)} />
          </label>

          <label>Royalty Cap ($):
            <input type="number" value={royaltyCap} onChange={(e) => setRoyaltyCap(+e.target.value)} />
          </label>

          <div className="button-group">
            <button type="button" className="primary" onClick={calculate}>Calculate ROI</button>
            <button type="button" className="secondary" onClick={reset}>Reset</button>
          </div>
        </form>

        {roi !== null && revenue !== null && (
          <div className="result-box">
            <h3>Total Revenue:</h3>
            <p className="result-amount">${revenue.toLocaleString()}</p>
            <h3>ROI:</h3>
            <p className="result-amount">{roi.toFixed(2)}%</p>
          </div>
        )}

        <p className="text-center" style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#777' }}>
          Created by Napoleon Jamir for Royal LePage
        </p>
      </section>
    </main>
  );
}
