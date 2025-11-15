import React from 'react';

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
        <img
          src="/img/asrc_wy.png"
          alt="ASRC"
          style={styles.sidebarLogo}
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
    padding: '1.5rem',
  },
  sidebarText: {
    color: '#fff',
    fontFamily: "'Orbitron', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '28pt',
    fontWeight: '800',
  },
  sidebarLogoBox: {

  },
  sidebarLogo: {

  }
};

export default SpotterSidebar;
