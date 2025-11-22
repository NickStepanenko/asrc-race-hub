"use client";
import React from 'react';
import styles from './ItemCard.module.css';

import {
  Item,
} from "types";

import DownloadButton from '@/app/components/client/DownloadButton';
import { Image } from 'antd';

export const isNewItem = (item: Item) => {
  const release = item.releaseDate ? new Date(item.releaseDate as Date) : new Date(NaN);
  if (isNaN(release.getTime())) return true;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);

  return (release >= sixMonthsAgo) || !item?.released;
}

export const ItemCard = ({ item }: { item: Item }) => {
  return (
    <div
      className={styles.card}
      data-testid={`item-${item.id}`}
      tabIndex={0}
      role="group"
      aria-labelledby={`item-name-${item.id}`}
    >
      <a className={styles.imageWrap} href={`/downloads/${item.id}`} style={{ cursor: 'pointer' }}>
        {isNewItem(item) && <span className={styles.newBadge} aria-hidden="true">NEW</span>}
        {item.logo && (
          <div className={styles.logo}>
            <Image
              src={item.logo}
              alt={`${item.name} logo`}
              preview={false}
              rootClassName={styles.logoImg}
              height={20}
            />
          </div>
        )}
        {item.image && (
          <Image src={item.image} alt={item.name} className={styles.photo} preview={false} />
        )}
      </a>

      <div className={styles.body}>
        <a href={`/downloads/${item.id}`}>
          <div id={`item-name-${item.id}`} className={styles.name}>{item.name}</div>
        </a> 
        <DownloadButton item={item} />
      </div>
    </div>
  );
}
