"use client";

import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import getDominantColorHexIgnoringWhite from './colorPicker';

import inlineStyles from './CarElement.module.css';

type CarCardProps = {
  carNumber: number;
  firstName: string;
  lastName: string;
  teamName: string;
  teamLogo: string;
  carImage: string;
  championshipLogo: string;
  flagImage: string;
};

const defNumberBoxStyles = {
  display: 'flex',
  fontWeight: 'bold',
  backgroundColor: '#000',
};

type NumberBoxStyle = {
  display: string;
  fontWeight: string;
  backgroundColor: string;
};

const CarCard: React.FC<CarCardProps> = (params) => {
  const {
    carNumber,
    firstName,
    lastName,
    teamName,
    teamLogo,
    carImage,
    championshipLogo,
    flagImage,
  } = params;

  const [numberBoxStyles, setNumberBoxStyles] = useState<NumberBoxStyle>(defNumberBoxStyles);
  const [loading, setLoading] = useState(true);
  
  const [zoomed, setZoomed] = useState(false);
  const toggleZoom = () => setZoomed(!zoomed);

  useEffect(() => {
    (async () => {
      const backgroundColor = await getDominantColorHexIgnoringWhite(teamLogo);
      setNumberBoxStyles({
        display: 'flex',
        fontWeight: 'bold',
        backgroundColor: backgroundColor,
      });
      setLoading(false);
    })();
  }, []);

  const cardContent = (
    <div className={inlineStyles.card} onClick={toggleZoom}>
      <Skeleton loading={loading} active>
        <div className={inlineStyles.header}>
          <div style={numberBoxStyles}>
            <span className={inlineStyles.number}>{carNumber}</span>
          </div>
          
          <div className={inlineStyles.driverInfo}>
            <div className={inlineStyles.topImages}>
              <img
                src="/img/asrc_b.png"
                alt="ASRC"
                className={inlineStyles.logoImg}
              />
              <img
                src="/img/advanced_simulation_b.png"
                alt="Advanced Simulation"
                className={inlineStyles.logoImg}
              />
              <img
                src="/img/irw_colored_inline.png"
                alt="iVRA Racing Wheels"
                className={inlineStyles.logoImg}
              />
            </div>
            <div className={inlineStyles.nameRow}>
              <img
                src={flagImage}
                className={inlineStyles.flag}
              />
              <span className={inlineStyles.driverNameShort}>{abbreviateLastName(lastName)}</span>
            </div>
            <div className={inlineStyles.driverName}>
              <span>{firstName} {lastName}</span>
            </div>
          </div>

          <div className={inlineStyles.championshipLogoBox}>
            <img
              src={championshipLogo}
              className={inlineStyles.logoImage}
            />
          </div>
          
          <div className={inlineStyles.teamLogoImageBox}>
            <img
              src={teamLogo}
              className={inlineStyles.teamLogoImage}
            />
          </div>
        </div>

        <div className={inlineStyles.carImageBox}>
          <img
            src={carImage}
            className={inlineStyles.carImage}
          />
        </div>

        <div data-testid="card-team-name" className={inlineStyles.teamName}>{teamName}</div>
      </Skeleton>
    </div>
  );

  return (
    <>
      {zoomed && (
        <div className={inlineStyles.zoomOverlay} onClick={toggleZoom}>
          <div className={inlineStyles.zoomedCard}>
            {cardContent}
          </div>
        </div>
      )}

      {!zoomed && (
        <div>
          {cardContent}
        </div>
      )}
    </>
  );
};

export function abbreviateLastName(lastname: string = ""): string {
  const cleanName = lastname.replace(/[^a-zA-Z]/g, '')?.toUpperCase();

  if (cleanName.length >= 3) {
    return cleanName.slice(0, 3);
  }
  else {
    const padChar = cleanName.charAt(cleanName.length - 1) || 'X';
    return (cleanName + padChar.repeat(3)).slice(0, 3);
  }
}

export default CarCard;
