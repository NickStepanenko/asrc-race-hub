"use client";

import React from 'react';
import styles from './ItemCard.module.css';
import { Button } from 'antd';
import {
  ShoppingOutlined,
  ToolOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import {
  Item,
  ButtonConfig,
} from "types";

function SteamIcon() {
  return (
    <img
      src="/img/steam_logo_white.svg"
      alt="Steam"
      style={{ width: 16, height: 16, display: 'block' }}
    />
  );
}

const downloadButtonsMapping: Record<string, ButtonConfig> = {
  steam_store_item: {
    colorBkg: '#0e4f9fff',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'Steam Store',
    icon: <SteamIcon />,
  },
  steam_workshop_item: {
    colorBkg: '#1b2838',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'Steam Workshop',
    icon: <SteamIcon />,
  },
  urd_store_item: {
    colorBkg: '#555',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'URD Store',
    icon: <ShoppingOutlined />,
  },
  wip: {
    colorBkg: '#c7c7c7',
    colorText: '#000',
    buttonType: 'primary',
    buttonVariant: 'dashed',
    text: 'Release Info',
    icon: <ToolOutlined />,
  },
  soon: {
    colorBkg: '#c7c7c7',
    colorText: '#000',
    buttonType: 'primary',
    buttonVariant: 'dashed',
    text: 'Soon',
    icon: <LoadingOutlined />,
  },
};

export const isNewItem = (item: Item) => {
  const release = new Date(item.releaseDate);
  if (isNaN(release.getTime())) return false;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return (release >= sixMonthsAgo) || item?.released === false;
}

export default function ItemCard({ item }: { item: Item }) {
  let buttonConfig = item?.released ? downloadButtonsMapping[item?.type || 'wip'] : downloadButtonsMapping['wip'];
  switch (item?.released) {
    case false:
      buttonConfig = item?.url ? downloadButtonsMapping['wip'] : downloadButtonsMapping['soon'];
      break;
    case true:
      buttonConfig = downloadButtonsMapping[item?.type];
      break;
  }

  return (
    <div
      className={styles.card}
      data-testid={`item-${item.id}`}
      tabIndex={0}
      role="group"
      aria-labelledby={`item-name-${item.id}`}
    >
      <div className={styles.imageWrap}>
        {isNewItem(item) && <span className={styles.newBadge} aria-hidden="true">NEW</span>}
        <img src={item.image} alt={item.name} className={styles.photo} />
        <img src={item.logo} alt={`${item.name} logo`} className={styles.logo} />
      </div>

      <div className={styles.body}>
        <div id={`item-name-${item.id}`} className={styles.name}>{item.name}</div>
        <Button
          type={buttonConfig.buttonType}
          variant={buttonConfig.buttonVariant}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          iconPosition='start'
          icon={buttonConfig.icon}
          style={{ backgroundColor: buttonConfig.colorBkg, color: buttonConfig.colorText }}
          block
        >
          {buttonConfig.text}
        </Button>
      </div>
    </div>
  );
}
