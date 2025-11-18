import React from 'react';
import { Image } from 'antd';

type SidebarProps = {
  title: string;
};

const SpotterSidebar: React.FC<SidebarProps> = (params) => {
  const {
    title,
  } = params;

  return(
    <div style={styles.sidebar}>
      <div style={styles.sidebarLogoBox}>
        <Image
          src="/img/asrc_wy.png"
          alt="ASRC"
          style={styles.sidebarLogo}
          preview={false}
          width={50}
        />
      </div>
      <div style={styles.sidebarText}>
        <span>{title}</span>
        <span>Championship entry list</span>
      </div>
    </div>
  );
};

// Define a type for the style object to enable inline styles safely
type Styles = {
  [key: string]: React.CSSProperties;
};

const styles: Styles = {
  sidebar: {
    backgroundColor: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    height: '100%',
  },
  sidebarText: {
    color: '#fff',
    fontFamily: "'Orbitron', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '22pt',
    fontWeight: '800',
  },
};

export default SpotterSidebar;
