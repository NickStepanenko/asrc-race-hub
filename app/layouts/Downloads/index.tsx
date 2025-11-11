"use client";

import React, { useMemo, useState, useEffect } from 'react';

import styles from './Downloads.module.css';
import ItemCard from './ItemCard';

type CarClass =
  | 'Open Wheelers'
  | 'Touring Cars'
  | 'Prototypes'
  | 'Le Mans Hypercars'
  | 'Stock Cars'
  | 'GT Cars'
  | 'Drift Cars'
  | 'Skinpacks'
  | 'GT500';

const CAR_CLASSES: CarClass[] = [
  'Le Mans Hypercars',
  'Open Wheelers',
  'Touring Cars',
  'Stock Cars',
  'Prototypes',
  'GT500',
  'GT Cars',
  'Drift Cars',
  'Skinpacks',
];

export default function Downloads() {
  const [contentData, setContentData] = useState<any[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (c: CarClass) => {
    setSelected((s) => ({ ...s, [c]: !s[c] }));
  };

  const activeFilters = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

  const filtered = useMemo(() => {
    if (activeFilters.length === 0) return contentData;
    return contentData.filter((it) => activeFilters.includes(it.carClass));
  }, [contentData, activeFilters]);

  useEffect(() => {
    fetch('/api/downloads')
      .then((res) => res.json())
      .then(setContentData)
      .catch(console.error);
  }, []);

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.filtersTitle}>Filters</div>

        {CAR_CLASSES.map((c) => (
          <label key={c} className={styles.filterItem}>
            <input
              type="checkbox"
              checked={!!selected[c]}
              onChange={() => toggle(c)}
            />
            <span>{c}</span>
          </label>
        ))}
      </aside>

      <main className={styles.main}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No items match the selected filters.</div>
        ) : (
          <div>
            {CAR_CLASSES.map((c) => {
              const itemsInClass = filtered.filter((it) => it.carClass === c);
              if (itemsInClass.length === 0) return null;

              return (
                <section key={c} className={styles.section} aria-labelledby={`section-${c}`}>
                  <div id={`section-${c}`} className={styles.sectionHeader}>{c}</div>
                  <div className={styles.grid}>
                    {itemsInClass.map((item) => (
                      <ItemCard key={item.id} item={item as any} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

