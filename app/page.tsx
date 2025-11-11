"use client"
import React from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import {  Breadcrumb, Layout, Menu, theme  } from "antd";
const { Header, Content, Footer, Sider } = Layout;

import Contact from './contact/page';
import Downloads from './downloads/page';
import OnlineRacing from './online_racing/page';

const defaultPageComponent = <Downloads />;

export default function Home() {
  const router = useRouter();
  const [pageContent, setPageContent] = React.useState<React.ReactNode>(defaultPageComponent);

  const headerMenuItems = [
    {
      key: 'downloads',
      label: 'Downloads',
    },
    {
      key: 'online_racing',
      label: 'Online Racing',
    },
    {
      key: 'contact',
      label: 'Contact',
    },
    
  ];

  const [selectedKey, setSelectedKey] = React.useState<string>('downloads');

  const handleMenuClick = (info: { key: string }) => {
    const key = info.key;
    setSelectedKey(key);

    switch (key) {
      case 'downloads':
        router.push('/downloads');
        setPageContent(<Downloads />);
        break;
      case 'online_racing':
        router.push('/online_racing');
        setPageContent(<OnlineRacing />);
        break;
      case 'contact':
        router.push('/contact');
        setPageContent(<Contact />);
        break;
      default:
        break;
    }
  };

  return (
    <main style={{ padding: 16 }}>
      {pageContent}
    </main>
  );
}
