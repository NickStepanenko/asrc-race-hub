"use client";

import { useEffect, useState } from "react";
import { Button, Select, Space, Empty, message, Row } from 'antd';

import {
  Championship,
  Car,
  Race,
  ChampionshipsListItem,
  RacesListItem,
  Styles,
  SpotterProps,
} from "types";

import CarCard from "../CarElement";
import SpotterSidebar from "../SpotterSidebar";
import TrackSidebar from "../TrackSidebar";

export default function Spotter(params: SpotterProps) {
  const {
    selectedChamp,
    selectedRace
  } = params;

  const [messageApi, contextHolder] = message.useMessage();
  const error = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  const handleSaveToImage = (): void => {
    const node = document.getElementById('spotter-area');
    if (!node) {
      error("Element is missing on the page");
      return;
    }

    import('html-to-image').then((htmlToImage) => {
      htmlToImage.toJpeg(node, { quality: 1.0 }).then(function (dataUrl: string) {
        const link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
      }).catch(() => {
        error('Failed to export image');
      });
    }).catch(() => {
      error('Failed to load image export library');
    });
  };

  return (
    <div style={styles.mainArea}>
      <Space direction="vertical" size={12}>
        <Space>
          <Button type="primary" onClick={handleSaveToImage}>Save image</Button>
        </Space>
        {(!selectedChamp ? <Empty /> :
        <div style={styles.spotterArea} id="spotter-area">
          <SpotterSidebar
            title={selectedChamp?.title || ""}
          />
          <div style={styles.spotterCars}>
            {selectedChamp?.cars?.map((car: Car) => {
              const key = `${car?.carNumber}-${car?.driverFirstName}-${car?.driverLastName}`;
              return (
                <CarCard
                  key={key}
                  carNumber={car?.carNumber}
                  firstName={car?.driverFirstName}
                  lastName={car?.driverLastName}
                  teamName={car?.teamName}
                  teamLogo={car?.teamLogo}
                  carImage={car?.carImage}
                  flagImage={car?.flagImage}
                  championshipLogo={selectedChamp?.logo ?? ''}
                />
              );
            })}
          </div>
          <TrackSidebar
            trackInfo={selectedRace}
            serverName={selectedChamp.serverName}
            serverPass={selectedChamp.serverPass}
            serverJoinQr={selectedChamp.leagueJoinQr}
          />
        </div>
        )}
      </Space>
    </div>
  );
}

const styles: Styles = {
  mainArea: {
    display: 'block',
    height: '100%',
  },
  filterArea: {
    margin: "1rem 0",
  },
  spotterCars: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 20rem))',
    gridTemplateRows: 'repeat(auto-fill, minmax(10rem, 10rem))',
    gap: '.5rem',
    alignItems: 'start',
    justifyContent: 'center',
    margin: '2rem 0',
  },
  spotterArea: {
    backgroundColor: '#fff',
    display: 'grid',
    gridTemplate: '1fr / 5% 70% 25%',
  },
};
