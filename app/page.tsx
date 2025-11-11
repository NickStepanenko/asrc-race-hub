"use client"
import React from 'react';
import Downloads from './downloads/page';

const defaultPageComponent = <Downloads />;

export default function Home() {
  const [pageContent, setPageContent] = React.useState<React.ReactNode>(defaultPageComponent);

  return (
    <main style={{ padding: 16 }}>
      {pageContent}
    </main>
  );
}
