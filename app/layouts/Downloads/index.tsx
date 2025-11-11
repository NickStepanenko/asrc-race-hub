"use client";

import React, { useMemo, useState } from 'react';

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
  | 'GT500';

const CAR_CLASSES: CarClass[] = [
  'Open Wheelers',
  'Touring Cars',
  'Prototypes',
  'Le Mans Hypercars',
  'Stock Cars',
  'GT Cars',
  'GT500',
  'Drift Cars',
];

const SAMPLE_ITEMS = [
  {
    id: '1',
    name: 'Vanwall Vandervell LMH',
    type: 'steam_store_item',
    carClass: 'Le Mans Hypercars',
    image: '/downloads/img/vanwall_vandervell_lmh.png',
    logo: '/downloads/img/brands/vanwall.png',
    url:'https://store.steampowered.com/itemstore/365960/detail/88/',
    released: true,
    releaseDate: '2015-03-25T12:00:00Z',
  },
  {
    id: '2',
    name: 'Porsche 963',
    type: 'steam_workshop_item',
    carClass: 'Le Mans Hypercars',
    image: '/downloads/img/porsche_963.png',
    logo: '/downloads/img/brands/porsche.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3088949297',
    released: true,
    releaseDate: '2023-10-19T12:00:00Z',
  },
  {
    id: '3',
    name: 'Ferrari 499P',
    type: 'steam_workshop_item',
    carClass: 'Le Mans Hypercars',
    image: '/downloads/img/ferrari_499p.png',
    logo: '/downloads/img/brands/ferrari.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3088947577',
    released: true,
    releaseDate: '2023-10-19T12:00:00Z',
  },
  {
    id: '4',
    name: 'Bayro M Hybrid V8',
    type: 'urd_store_item',
    carClass: 'Le Mans Hypercars',
    image: '/downloads/img/bayro_m_hybrid_v8.png',
    logo: '/downloads/img/brands/bayro.png',
    url:'https://unitedracingdesign.sellfy.store/p/rf2-bayro/',
    released: true,
    releaseDate: '2024-01-26T12:00:00Z',
  },
  {
    id: '5',
    name: 'Scuderia Glickenhaus SCG 007',
    type: 'urd_store_item',
    carClass: 'Le Mans Hypercars',
    image: '/downloads/img/scg_007.png',
    logo: '/downloads/img/brands/scg.png',
    url:'https://unitedracingdesign.sellfy.store/p/rf2-scuderia-glickenhaus-scg-007/',
    released: true,
    releaseDate: '2022-08-06T12:00:00Z',
  },
  {
    id: '6',
    name: 'Moyoda GR010 Hybrid',
    type: 'urd_store_item',
    carClass: 'Le Mans Hypercars',
    image: '/downloads/img/moyoda_gr010.png',
    logo: '/downloads/img/brands/moyoda.png',
    url:'https://unitedracingdesign.sellfy.store/p/rf2-moyoda-hypercar-2021/',
    released: true,
    releaseDate: '2022-08-23T12:00:00Z',
  },
  {
    id: '7',
    name: 'Alpine A480 LMH',
    type: 'steam_workshop_item',
    carClass: 'Le Mans Hypercars',
    image: '/downloads/img/alpine_a480.png',
    logo: '/downloads/img/brands/alpine.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2886924156',
    released: true,
    releaseDate: '2022-10-22T12:00:00Z',
  },
  {
    id: '10',
    name: 'Formula Hybrid-21',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/fh21.png',
    logo: '/downloads/img/brands/f1.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2561872000',
    released: true,
    releaseDate: '2021-07-31T12:00:00Z',
  },
  {
    id: '11',
    name: 'Formula Hybrid-22',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/fh22.png',
    logo: '/downloads/img/brands/f1.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2801611722',
    released: true,
    releaseDate: '2022-04-30T12:00:00Z',
  },
  {
    id: '12',
    name: 'Formula Hybrid-25',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/fh25.png',
    logo: '/downloads/img/brands/f1.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3469128251',
    released: true,
    releaseDate: '2025-05-07T12:00:00Z',
  },
  {
    id: '13',
    name: 'Super Formula Pro 22',
    type: 'steam_workshop_item',
    carClass: 'Open Wheelers',
    image: '/downloads/img/super_formula_pro22.png',
    logo: '/downloads/img/brands/super_formula_pro.png',
    url:null,
    released: true,
    releaseDate: null,
  },
  {
    id: '14',
    name: 'Honda HSV-010 GT500',
    type: 'steam_workshop_item',
    carClass: 'GT500',
    image: '/downloads/img/honda_hsv010_gt500.png',
    logo: '/downloads/img/brands/honda.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2370616440',
    released: true,
    releaseDate: '2021-01-23T12:00:00Z',
  },
  {
    id: '15',
    name: 'Lexus SC430 GT500',
    type: 'steam_workshop_item',
    carClass: 'GT500',
    image: '/downloads/img/lexus_sc430_gt500.png',
    logo: '/downloads/img/brands/lexus.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2370539183',
    released: true,
    releaseDate: '2021-01-23T12:00:00Z',
  },
  {
    id: '16',
    name: 'Moyoda JT5 GT500',
    type: 'urd_store_item',
    carClass: 'GT500',
    image: '/downloads/img/moyoda_gt500.png',
    logo: '/downloads/img/brands/moyoda.png',
    url:'https://shop.unitedracingdesign.com/p/rf2-jt5-pack/',
    released: true,
    releaseDate: '2024-01-25T12:00:00Z',
  },
  {
    id: '17',
    name: 'Shiro JT5 GT500',
    type: 'urd_store_item',
    carClass: 'GT500',
    image: '/downloads/img/shiro_gt500.png',
    logo: '/downloads/img/brands/shiro.png',
    url:'https://shop.unitedracingdesign.com/p/rf2-jt5-pack/',
    released: true,
    releaseDate: '2024-01-10T12:00:00Z',
  },
  {
    id: '18',
    name: 'Shiro Z JT5 GT500',
    type: 'urd_store_item',
    carClass: 'GT500',
    image: '/downloads/img/shiro_z_gt500.png',
    logo: '/downloads/img/brands/shiro.png',
    url:'https://shop.unitedracingdesign.com/p/rf2-jt5-pack/',
    released: true,
    releaseDate: '2024-01-10T12:00:00Z',
  },
  {
    id: '19',
    name: 'Zonda SNX JT5 GT500',
    type: 'urd_store_item',
    carClass: 'GT500',
    image: '/downloads/img/zonda_snx_gt500.png',
    logo: '/downloads/img/brands/zonda.png',
    url:'https://shop.unitedracingdesign.com/p/rf2-jt5-pack/',
    released: true,
    releaseDate: '2024-01-10T12:00:00Z',
  },
  {
    id: '20',
    name: 'Peugeot 908 2011',
    type: 'steam_workshop_item',
    carClass: 'Prototypes',
    image: '/downloads/img/peugeot_908.png',
    logo: '/downloads/img/brands/peugeot.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3284843106',
    released: true,
    releaseDate: '2024-07-08T12:00:00Z',
  },
  {
    id: '21',
    name: 'Mazda MX-5 Cup ND2',
    type: 'steam_workshop_item',
    carClass: 'Touring Cars',
    image: '/downloads/img/mazda_mx5_nd2.png',
    logo: '/downloads/img/brands/mazda.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3192055694',
    released: true,
    releaseDate: '2024-07-08T12:00:00Z',
  },
  {
    id: '22',
    name: 'Chevrolet Silverado',
    type: 'steam_workshop_item',
    carClass: 'Stock Cars',
    image: '/downloads/img/chevrolet_silverado.png',
    logo: '/downloads/img/brands/nascar_trucks23.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3041246710',
    released: true,
    releaseDate: '2023-09-25T12:00:00Z',
  },
  {
    id: '23',
    name: 'Ford F-150',
    type: 'steam_workshop_item',
    carClass: 'Stock Cars',
    image: '/downloads/img/ford_f150.png',
    logo: '/downloads/img/brands/nascar_trucks23.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3041246710',
    released: true,
    releaseDate: '2023-09-25T12:00:00Z',
  },
  {
    id: '24',
    name: 'Toyota Tundra',
    type: 'steam_workshop_item',
    carClass: 'Stock Cars',
    image: '/downloads/img/toyota_tundra.png',
    logo: '/downloads/img/brands/nascar_trucks23.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3041246710',
    released: true,
    releaseDate: '2023-09-25T12:00:00Z',
  },
  {
    id: '25',
    name: 'Renault Clio RS Cup V',
    type: 'steam_workshop_item',
    carClass: 'Touring Cars',
    image: '/downloads/img/renault_clio_rs_cup_v.png',
    logo: '/downloads/img/brands/renault.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2966779202',
    released: true,
    releaseDate: '2023-04-24T12:00:00Z',
  },
  {
    id: '26',
    name: 'Mini Cooper JCW F56 (GEN 3)',
    type: 'steam_workshop_item',
    carClass: 'Touring Cars',
    image: '/downloads/img/mini_jcw_f56.png',
    logo: '/downloads/img/brands/mini.png',
    url:null,
    released: false,
    releaseDate: null,
  },
  {
    id: '27',
    name: 'Honda Brio RS Cup',
    type: 'steam_workshop_item',
    carClass: 'Touring Cars',
    image: '/downloads/img/honda_brio_rs.png',
    logo: '/downloads/img/brands/honda.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2964153793',
    released: true,
    releaseDate: '2023-04-18T12:00:00Z',
  },
  {
    id: '28',
    name: 'Toyota GR Supra GT4',
    type: 'steam_workshop_item',
    carClass: 'GT Cars',
    image: '/downloads/img/toyota_supra_gt4.png',
    logo: '/downloads/img/brands/toyota.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2962890868',
    released: true,
    releaseDate: '2023-04-16T12:00:00Z',
  },
  {
    id: '29',
    name: 'Nissan Silvia S15 Drift Spec',
    type: 'steam_workshop_item',
    carClass: 'Drift Cars',
    image: '/downloads/img/nissan_silvia_s15_drift.png',
    logo: '/downloads/img/brands/nissan.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2510509012',
    released: true,
    releaseDate: '2023-04-08T12:00:00Z',
  },
  {
    id: '30',
    name: 'ENSO CLM P1/01 ByKolles',
    type: 'steam_workshop_item',
    carClass: 'Prototypes',
    image: '/downloads/img/bykolles_lmp1.png',
    logo: '/downloads/img/brands/enso.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2615221052',
    released: true,
    releaseDate: '2021-09-30T12:00:00Z',
  },
  {
    id: '31',
    name: 'Acura ARX-05 DPi',
    type: 'steam_workshop_item',
    carClass: 'Prototypes',
    image: '/downloads/img/acura_arx05.png',
    logo: '/downloads/img/brands/acura.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=2047429296',
    released: true,
    releaseDate: '2022-08-24T12:00:00Z',
  },
  {
    id: '32',
    name: 'Chevrolet Camaro SS',
    type: 'steam_workshop_item',
    carClass: 'Stock Cars',
    image: '/downloads/img/nascar_camaro23.png',
    logo: '/downloads/img/brands/nascar23.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3406937884',
    released: true,
    releaseDate: '2025-01-13T12:00:00Z',
  },
  {
    id: '33',
    name: 'Ford Mustang',
    type: 'steam_workshop_item',
    carClass: 'Stock Cars',
    image: '/downloads/img/nascar_mustang23.png',
    logo: '/downloads/img/brands/nascar23.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3406937884',
    released: true,
    releaseDate: '2025-01-13T12:00:00Z',
  },
  {
    id: '34',
    name: 'Toyota Camry TRD',
    type: 'steam_workshop_item',
    carClass: 'Stock Cars',
    image: '/downloads/img/nascar_camry23.png',
    logo: '/downloads/img/brands/nascar23.png',
    url:'https://steamcommunity.com/sharedfiles/filedetails/?id=3406937884',
    released: true,
    releaseDate: '2025-01-13T12:00:00Z',
  },
  {
    id: '35',
    name: 'Riley & Scott Mk III',
    type: 'steam_workshop_item',
    carClass: 'Prototypes',
    image: '/downloads/img/riley_scott_mkiii.png',
    logo: '/downloads/img/brands/imsa_gt.png',
    url:null,
    released: false,
    releaseDate: null,
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

