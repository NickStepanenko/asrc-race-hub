"use client";

import React from 'react';
import styles from './Downloads.module.css';

type Item = {
  id: string;
  name: string;
  carClass: string;
  image: string;
  logo: string;
  steamUrl: string;
};

export default function ItemCard({ item }: { item: Item }) {
  return (
    <div
      className={styles.card}
      data-testid={`item-${item.id}`}
      tabIndex={0}
      role="group"
      aria-labelledby={`item-name-${item.id}`}
    >
      <div className={styles.imageWrap}>
        <img src={item.image} alt={item.name} className={styles.photo} />
        <img src={item.logo} alt={`${item.name} logo`} className={styles.logo} />
      </div>

      <div className={styles.body}>
        <div id={`item-name-${item.id}`} className={styles.name}>{item.name}</div>

        <a
          className={styles.downloadBtn}
          href={item.steamUrl}
          target="_blank"
          rel="noreferrer"
        >
          Download from Steam
        </a>
      </div>
    </div>
  );
}
