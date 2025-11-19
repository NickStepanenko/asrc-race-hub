import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

import { Empty, Image } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';

import inlineStyles from './TrackSidebar.module.css';

type TrackInfo = {
  name: string;
  round: number;
  laps: number;
  mins: number;
  tyres: [string];
  trackMap: string;
  trackLogo: string;
  raceDateTime: string;
};

type SidebarProps = {
  trackInfo: TrackInfo | null;
  serverName: string;
  serverPass: string;
  serverJoinQr: string;
};

const TrackSidebar: React.FC<SidebarProps> = (params) => {
  const {
    trackInfo,
    serverName,
    serverPass,
    serverJoinQr,
  } = params;

  const [raceDate, setRaceDate] = useState<string | null>(null);
  const [raceStartTime, setRaceStartTime] = useState<string | null>(null);

  useEffect(() => {
    const raceDateTime = dayjs(trackInfo?.raceDateTime);
    raceDateTime.set('hour', raceDateTime.get('hour') + 2);
    setRaceDate(raceDateTime.format("ll"));
    setRaceStartTime(raceDateTime.format("LT"));
  }, [trackInfo]);

  return(
    <>
      {!trackInfo ? <Empty /> :
      <div style={styles.trackSidebar}>
        <div style={styles.comingRace}>
          <span>Coming race</span>
          <DoubleRightOutlined
            style={styles.comingRaceIcon}
          />
        </div>
        <span style={styles.raceName}>Round {trackInfo.round} - {trackInfo.name}</span>
        <div style={styles.trackImageBox}>
          <Image
            src={trackInfo.trackLogo}
            style={styles.trackLogo}
            alt="Track Logo"
            preview={false}
          />
          <Image
            src={trackInfo.trackMap}
            style={styles.trackImage}
            alt="Track Layout Image"
            preview={false}
          />
        </div>
        <div style={styles.raceDescription}>
          <div style={styles.descBox}>
            <div style={styles.descPair}>
              <span style={styles.descHeader}>Date:</span>
              <span>{raceDate}</span>
            </div>
            <div style={styles.descPair}>
              <span style={styles.descHeader}>Event Start:</span>
              <span>{raceStartTime} CEST</span>
            </div>
          </div>
          <div style={styles.descBox}>
            <div style={styles.descPair}>
              <span style={styles.descHeader}>Race Length:</span>
              <span>{trackInfo.laps} laps or {trackInfo.mins} mins</span>
            </div>
            <div style={styles.descPair}>
              <span style={styles.descHeader}>Tyres:</span>
              <div className={inlineStyles.compoundsList}>
                {trackInfo.tyres.map((compound, idx) => (
                  <span key={idx} className={inlineStyles.compoundBadge}>{compound}</span>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.descBox}>
            <div style={styles.descPair}>
              <span style={styles.descHeader}>Server Name:</span>
              <span>{serverName}</span>
            </div>
            <div style={styles.descPair}>
              <span style={styles.descHeader}>Password:</span>
              <span>{serverPass}</span>
            </div>
          </div>
        </div>
        <div style={styles.descBox}>
          <div style={styles.standingsBox}>
            
            <div style={styles.standingsSection}>
              <div style={styles.standingsTitle}>Drivers Championship</div>
              <div style={styles.standingsList}>
                <div style={styles.standingsItem}>
                  <span>1.</span>
                  <span><Image
                    src="/img/asrc_f1_2025/teams/wi.png"
                    className={inlineStyles.teamLogoImage}
                    alt="Team Logo"
                    preview={false}
                  /></span>
                  <span>Y. Shelomanov</span>
                  <span>204</span>
                </div>
                <div style={styles.standingsItem}>
                  <span>2.</span>
                  <span><Image
                    src="/img/asrc_f1_2025/teams/fe.png"
                    className={inlineStyles.teamLogoImage}
                    alt="Team Logo"
                    preview={false}
                  /></span>
                  <span>A. Paparinopoulos</span>
                  <span>165</span>
                </div>
                <div style={styles.standingsItem}>
                  <span>3.</span>
                  <span><Image
                    src="/img/asrc_f1_2025/teams/bt.png"
                    className={inlineStyles.teamLogoImage}
                    alt="Team Logo"
                    preview={false}
                  /></span>
                  <span>F. Zongoli</span>
                  <span>147</span>
                </div>
              </div>
            </div>

            <div style={styles.standingsSection}>
              <div style={styles.standingsTitle}>Teams Championship</div>
              <div style={styles.standingsList}>
                <div style={styles.standingsItem}>
                  <span>1.</span>
                  <span><Image
                    src="/img/asrc_f1_2025/teams/wi.png"
                    className={inlineStyles.teamLogoImage}
                    alt="Team Logo"
                    preview={false}
                  /></span>
                  <span>Williams</span>
                  <span>232</span>
                </div>
                <div style={styles.standingsItem}>
                  <span>2.</span>
                  <span><Image
                    src="/img/asrc_f1_2025/teams/bt.png"
                    className={inlineStyles.teamLogoImage}
                    alt="Team Logo"
                    preview={false}
                  /></span>
                  <span>BlueBolt Tigers</span>
                  <span>224</span>
                </div>
                <div style={styles.standingsItem}>
                  <span>3.</span>
                  <span><Image
                    src="/img/asrc_f1_2025/teams/bl.png"
                    className={inlineStyles.teamLogoImage}
                    alt="Team Logo"
                    preview={false}
                  /></span>
                  <span>BlueBolt Lions</span>
                  <span>188</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div style={styles.qrCodeArea}>
          <span>Join our Discord community!</span>
          <Image
            src={serverJoinQr}
            style={styles.qrCode}
            alt="Discord QR Code"
            preview={false}
          />
        </div>
      </div>
      }
    </>
  );
};

// Define a type for the style object to enable inline styles safely
type Styles = {
  [key: string]: React.CSSProperties;
};

const styles: Styles = {
  trackSidebar: {
    fontFamily: "'Kanit', sans-serif",
    backgroundColor: '#fff',
    display: 'grid',
    gridTemplate: '1rem 4rem 25rem 10rem 10rem 14rem / 1fr',
    alignItems: 'center',
    padding: '1.5rem',
  },
  comingRace: {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: '700',
    textTransform: "uppercase",
    display: 'flex',
    gap: '.25rem',
    fontSize: '14pt',
  },
  comingRaceIcon: {
    color: 'red',
  },
  raceName: {
    fontFamily: "'Orbitron', sans-serif",
    fontWeight: '800',
    fontSize: '18pt',
  },
  trackImageBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    gap: '2rem',
  },
  trackLogo: {
    width: '8rem',
  },
  trackImage: {
    maxWidth: '80%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  raceDescription: {
    display: 'grid',
    gridTemplate: '8rem / 25% 40% 35%',
  },
  descBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  descPair: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.25rem',
  },
  descHeader: {
    fontWeight: '700',
  },
  standingsBox: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  standingsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '.25rem',
  },
  standingsTitle: {
    fontWeight: '700',
  },
  standingsItem: {
    display: 'grid',
    gridTemplate: '2rem / 1.5rem 2rem 10rem 2rem',
    alignItems: 'center',
  },
  qrCodeArea: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '.5rem',
    fontWeight: '700',
  },
  qrCode: {
    width: '10rem',
    height: '10rem',
  },
};

export default TrackSidebar;
