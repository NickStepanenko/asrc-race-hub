"use client";
import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

type Props = {
  currentLabel?: string;
  className?: string;
};

export default function DownloadBreadcrumbs({ currentLabel = 'Item', className }: Props) {
  const items = [
    { title: (
        <Link href="/" aria-label="Home">
          <HomeOutlined />
        </Link>
      )
    },
    { title: <Link href="/downloads">Downloads</Link> },
    { title: currentLabel },
  ];

  return (
    <div className={className} style={{ marginBottom: 16 }}>
      <Breadcrumb items={items} />
    </div>
  );
}

