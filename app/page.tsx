"use client"
import React, { Suspense } from 'react';
import Downloads from './downloads/page';

export default function Home() {
  return (
    <main style={{ padding: 16 }}>
      <Suspense fallback={null}>
        <Downloads />
      </Suspense>
    </main>
  );
}
