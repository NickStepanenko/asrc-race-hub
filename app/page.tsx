"use client"
import React from 'react';
import Downloads from './downloads/page';

const defaultPageComponent = <Downloads />;

export default function Home() {
  return (
    <main style={{ padding: 16 }}>
      {defaultPageComponent}
    </main>
  );
}
