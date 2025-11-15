"use client"
import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import styles from './Downloads.module.css';
import ItemCard from '../ItemCard';
import { Checkbox } from 'antd';

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
  const [selectedClasses, setSelectedClasses] = useState<Record<string, boolean>>({});
  const searchParams = useSearchParams();

  const toggle = (c: CarClass) => {
    setSelectedClasses((s) => ({ ...s, [c]: !s[c] }));
  };

  const activeFilters = useMemo(() => Object.keys(selectedClasses).filter((k) => selectedClasses[k]), [selectedClasses]);

  const filtered = useMemo(() => {
    if (activeFilters.length === 0) return contentData;
    return contentData.filter((it) => activeFilters.includes(it.carClass));
  }, [contentData, activeFilters]);

  const sort = searchParams.get('sort') ?? '';

  useEffect(() => {
    const qs = sort ? `?sort=${encodeURIComponent(sort)}` : '';
    fetch(`/api/downloads${qs}`)
      .then((res) => res.json())
      .then(setContentData)
      .catch(console.error);
  }, [sort]);

  return (
    <>
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.filtersTitle}>Car classes</div>

        {CAR_CLASSES.map((c) => (
          <div key={c}>
            <Checkbox checked={!!selectedClasses[c]} onChange={() => toggle(c)}>{c}</Checkbox>
            <br />
          </div>
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
    </>
  );
}

