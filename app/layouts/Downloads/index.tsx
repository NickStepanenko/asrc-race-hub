"use client";

import React, { useMemo, useState } from 'react';
import styles from './Downloads.module.css';
import ItemCard from './ItemCard';

type CarClass =
  | 'Open Wheelers'
  | 'Touring Cars'
  | 'Prototypes'
  | 'Le Mans Hypercars'
  | 'StockCars'
  | 'GT Cars';

const CAR_CLASSES: CarClass[] = [
  'Open Wheelers',
  'Touring Cars',
  'Prototypes',
  'Le Mans Hypercars',
  'StockCars',
  'GT Cars',
];

const SAMPLE_ITEMS = [
  {
    id: '2',
    name: 'Touring Beast',
    carClass: 'Touring Cars',
    image: '/img/asrc_f1_2025/cars/car02.avif',
    logo: '/img/asrc_f1_2025/teams/team02.png',
    steamUrl: 'https://store.steampowered.com/',
  },
  {
    id: '3',
    name: 'Prototype X',
    carClass: 'Prototypes',
    image: '/img/asrc_f1_2025/cars/car03.avif',
    logo: '/img/asrc_f1_2025/teams/team03.png',
    steamUrl: 'https://store.steampowered.com/',
  },
  {
    id: '4',
    name: 'Hypercar 500',
    carClass: 'Le Mans Hypercars',
    image: '/img/asrc_f1_2025/cars/car04.avif',
    logo: '/img/asrc_f1_2025/teams/team04.png',
    steamUrl: 'https://store.steampowered.com/',
  },
  {
    id: '5',
    name: 'Stock Racer',
    carClass: 'StockCars',
    image: '/img/asrc_f1_2025/cars/car05.avif',
    logo: '/img/asrc_f1_2025/teams/team05.png',
    steamUrl: 'https://store.steampowered.com/',
  },
  {
    id: '6',
    name: 'GT Thunder',
    carClass: 'GT Cars',
    image: '/img/asrc_f1_2025/cars/car06.avif',
    logo: '/img/asrc_f1_2025/teams/team06.png',
    steamUrl: 'https://store.steampowered.com/',
  },
  {
    id: '7',
    name: 'Formula Hybrid-21',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/fh21.png',
    logo: '/downloads/img/brands/f1.png',
    steamUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2561872000',
  },
  {
    id: '8',
    name: 'Formula Hybrid-22',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/fh22.png',
    logo: '/downloads/img/brands/f1.png',
    steamUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2801611722',
  },
  {
    id: '9',
    name: 'Formula Hybrid-25',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/fh25.png',
    logo: '/downloads/img/brands/f1.png',
    steamUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3469128251',
  },
  {
    id: '10',
    name: 'Super Formula Pro 22',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/super_formula_pro22.png',
    logo: '/downloads/img/brands/super_formula_pro.png',
    steamUrl: null,
  },
];

export default function Downloads() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (c: CarClass) => {
    setSelected((s) => ({ ...s, [c]: !s[c] }));
  };

  const activeFilters = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

  const filtered = useMemo(() => {
    if (activeFilters.length === 0) return SAMPLE_ITEMS;
    return SAMPLE_ITEMS.filter((it) => activeFilters.includes(it.carClass));
  }, [activeFilters]);

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
          <div className={styles.grid}>
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item as any} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

