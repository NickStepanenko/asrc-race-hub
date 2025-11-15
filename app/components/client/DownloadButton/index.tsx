"use client";
import React, { useState } from 'react';
import { Button } from 'antd';
import { ShoppingOutlined, ToolOutlined, LoadingOutlined } from '@ant-design/icons';

type Item = any;

function SteamIcon() {
  return <img src="/img/steam_logo_white.svg" alt="Steam" style={{ width: 16, height: 16 }} />;
}

const downloadButtonsMapping: Record<string, any> = {
  steam_store_item: {
    colorBkg: '#5c9e1a',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'Steam Store',
    icon: <SteamIcon />,
  },
  steam_workshop_item: {
    colorBkg: '#154b7a',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'Steam Workshop',
    icon: <SteamIcon />,
  },
  urd_shop_item: {
    colorBkg: '#111',
    colorText: '#fff',
    buttonType: 'primary',
    buttonVariant: 'solid',
    text: 'URD Store',
    icon: <ShoppingOutlined />,
  },
  wip: {
    colorBkg: '#c7c7c7',
    colorText: '#000',
    buttonType: 'link',
    buttonVariant: 'outlined',
    text: 'Release Info',
    icon: <ToolOutlined />,
  },
  soon: {
    colorBkg: '#c7c7c7',
    colorText: '#000',
    buttonType: 'link',
    buttonVariant: 'outlined',
    text: 'Soon',
    icon: <LoadingOutlined />,
  },
};

export default function DownloadButton({ item }: { item: Item }) {
  let buttonConfig = item?.released ? downloadButtonsMapping[item?.type || 'wip'] : downloadButtonsMapping['wip'];

  switch (item?.released) {
    case false:
      buttonConfig = item?.url ? downloadButtonsMapping['wip'] : downloadButtonsMapping['soon'];
      break;
    case true:
      buttonConfig = downloadButtonsMapping[item?.type] || downloadButtonsMapping['wip'];
      break;
  }

  const href = item?.downloadUrl || item?.url || '#';

  // Hover / focus state to change visual appearance for mouse & keyboard users
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);
  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  // helper: darken a hex color by a fraction (0..1)
  const darkenHex = (hex: string, amount = 0.08) => {
    try {
      const c = hex.replace('#', '');
      const bigint = parseInt(c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c, 16);
      const r = Math.max(0, ((bigint >> 16) & 255) - Math.round(255 * amount));
      const g = Math.max(0, ((bigint >> 8) & 255) - Math.round(255 * amount));
      const b = Math.max(0, (bigint & 255) - Math.round(255 * amount));
      return `rgb(${r}, ${g}, ${b})`;
    } catch (e) {
      return hex;
    }
  };
  const baseBg = buttonConfig.colorBkg;
  const hoverBg = darkenHex(baseBg, 0.06);

  return (
    <Button
      type={buttonConfig.buttonType}
      variant={buttonConfig.buttonVariant}
      icon={buttonConfig.icon}
      href={href}
      target="_blank"
      rel="noreferrer"
      block
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        backgroundColor: baseBg,
        opacity: isActive ? 1 : 0.85,
        color: buttonConfig.colorText,
        transition: 'opacity 160ms ease, box-shadow 160ms ease',
      }}
    >
      {buttonConfig.text}
    </Button>
  );
}
