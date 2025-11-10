"use client"
import React from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import {  Breadcrumb, Layout, Menu, theme  } from "antd";
const { Header, Content, Footer, Sider } = Layout;

import Contact from './layouts/Contact';
import Downloads from './layouts/Downloads';
import OnlineRacing from './layouts/OnlineRacing';

export default function Home() {
  const router = useRouter();
  const [pageContent, setPageContent] = React.useState<React.ReactNode>(<></>);

  const headerMenuItems = [
    {
      key: 'downloads',
      label: 'Downloads',
      onClick: () => {
        setPageContent(<Downloads />);
      },
    },
    {
      key: 'online_racing',
      label: 'Online Racing',
      onClick: () => {
        setPageContent(<OnlineRacing />);
      },
    },
    {
      key: 'contact',
      label: 'Contact',
      onClick: () => {
        setPageContent(<Contact />);
      },
    },
  ];

  return (
    <>
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/img/logo_advanced_simulation_wy.png"
        alt="Advanced Simulation"
        style={{ maxHeight: '50%' }}
      />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['downloads']}
        items={headerMenuItems}
        style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
      />
    </Header>
    <main style={{ padding: 16 }}>
      {pageContent}
    </main>
    </>
  );
}
