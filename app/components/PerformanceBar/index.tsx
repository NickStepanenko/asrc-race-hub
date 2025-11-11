import React from 'react';

type Props = {
  powerHp: string | null | undefined;
  weightKg: string | null | undefined;
  minHpPerTon?: number; // default lower bound of "low performance"
  maxHpPerTon?: number; // default upper bound of "high performance"
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PerformanceBar({
  powerHp,
  weightKg,
  minHpPerTon = 50,
  maxHpPerTon = 800,
}: Props) {
  const powerValue = powerHp ? parseInt(powerHp.split(" ")[0]) : null;
  const weightValue = weightKg ? parseInt(weightKg.split(" ")[0]) : null;

  const kgPerHp = weightValue! / powerValue!; // lower is better
  const hpPerTon = powerValue! / (weightValue! / 1000); // higher is better
  const pct = clamp((hpPerTon - minHpPerTon) / (maxHpPerTon - minHpPerTon), 0, 1) * 100;

  console.log({ powerValue, weightValue, kgPerHp, hpPerTon, pct });

  return (
    <div style={{ width: '100%'}}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <div style={{ fontSize: 14, color: '#666' }}>Performance</div>
        <div style={{ fontWeight: 600 }}>{kgPerHp.toFixed(2)} kg/hp</div>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 10,
          borderRadius: 999,
          background: '#e5e7eb',
          overflow: 'hidden',
        }}
        aria-label="Performance"
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            transition: 'width 400ms ease',
            background:
              'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%)',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
          fontSize: 12,
          color: '#888',
        }}
      >
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
}

