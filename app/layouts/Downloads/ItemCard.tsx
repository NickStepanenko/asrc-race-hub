"use client";

import React from 'react';
import styles from './Downloads.module.css';
import { Button } from 'antd';
import {
  ShoppingOutlined,
  ToolOutlined,
  ShopOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

type Item = {
  id: string;
  name: string;
  type: string;
  carClass: string;
  image: string;
  logo: string;
  url: string;
  released: boolean
  releaseDate: Date;
};

type ButtonConfig = {
  colorBkg?: string;
  colorText: string;
  buttonType: "primary" | "dashed" | "link" | "text" | "default" | undefined;
  buttonVariant: "dashed" | "link" | "text" | "solid" | "outlined" | "filled" | undefined;
  text: string;
  icon: React.ReactElement;
};

const downloadButtonsMapping: Record<string, ButtonConfig> = {
  steam_store_item: {
    colorBkg: '#0e4f9fff',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'Buy from Steam Store',
    icon: <ShopOutlined />,
  },
  steam_workshop_item: {
    colorBkg: '#1b2838',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'Get from Steam Workshop',
    icon: <DownloadOutlined />,
  },
  urd_store_item: {
    colorBkg: '#555',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'Buy from URD Store',
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
};

export default function ItemCard({ item }: { item: Item }) {
  const buttonConfig = item?.released ? downloadButtonsMapping[item?.type] : downloadButtonsMapping['wip'];

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
        <Button
          type={buttonConfig.buttonType}
          variant={buttonConfig.buttonVariant}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          iconPosition='start'
          icon={buttonConfig.icon}
          style={{ backgroundColor: buttonConfig.colorBkg, color: buttonConfig.colorText }}
        >{buttonConfig.text}</Button>
      </div>
    </div>
  );
}
