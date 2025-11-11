"use client";
import React from 'react';
import { Button } from 'antd';
import { ShoppingOutlined, ToolOutlined, LoadingOutlined } from '@ant-design/icons';

type Item = any;

function SteamIcon() {
  return <img src="/img/steam_logo_white.svg" alt="Steam" style={{ width: 16, height: 16 }} />;
}

const downloadButtonsMapping: Record<string, any> = {
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

export default function DownloadButton({ item }: { item: Item }) {
  let buttonConfig = item?.released ? downloadButtonsMapping[item?.type || 'wip'] : downloadButtonsMapping['wip'];

  switch (item?.released) {
    case false:
      buttonConfig = item?.downloadUrl ? downloadButtonsMapping['wip'] : downloadButtonsMapping['soon'];
      break;
    case true:
      buttonConfig = downloadButtonsMapping[item?.type] || downloadButtonsMapping['wip'];
      break;
  }

  const href = item?.downloadUrl || item?.url || '#';

  return (
    <Button
      type={buttonConfig.buttonType}
      icon={buttonConfig.icon}
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ backgroundColor: buttonConfig.colorBkg, color: buttonConfig.colorText, borderRadius: 6 }}
      block
    >
      {buttonConfig.text}
    </Button>
  );
}
