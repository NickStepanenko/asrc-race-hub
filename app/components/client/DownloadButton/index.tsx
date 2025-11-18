"use client";
import React, { ReactElement, useState } from 'react';
import { Button, Image } from 'antd';
import { ShoppingOutlined, ToolOutlined, LoadingOutlined } from '@ant-design/icons';
import { Item } from '@/types';

function SteamIcon() {
  return <Image src="/img/steam_logo_white.svg" alt="Steam" width={16} preview={false} />;
}

type ButtonDescProps = {
  colorBkg: string;
  colorText: string;
  buttonType: "default" | "link" | "primary" | "text" | "dashed" | undefined;
  buttonVariant: "link" | "text" | "dashed" | "solid" | "outlined" | "filled" | undefined;
  text: string;
  icon: ReactElement;
};

const downloadButtonsMapping: Record<string, ButtonDescProps> = {
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

  const href = item?.url || '#';

  // Hover / focus state to change visual appearance for mouse & keyboard users
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);
  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  const baseBg = buttonConfig.colorBkg;

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
