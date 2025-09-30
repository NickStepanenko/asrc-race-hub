import { useEffect, useState } from "react";
import { Button, Select, Space, Empty, message } from 'antd';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

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

    htmlToImage
      .toJpeg(node, { quality: 1.00 })
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
      });
  };

  return (
    <div>
      <main>
        <div style={styles.mainArea}>
          <Space>
            <Button type="primary" onClick={handleSaveToImage}>Save image</Button>
          </Space>
          {(!selectedChamp ? <Empty /> :
          <div style={styles.spotterArea} id="spotter-area">
            <SpotterSidebar
              title={selectedChamp?.title || ""}
            />
            <div style={styles.spotterCars}>
              {selectedChamp?.cars?.map((car: Car, idx: number) => {
                return(
                  <CarCard
                    key={idx}
                    carNumber={car?.carNumber}
                    firstName={car?.firstName}
                    lastName={car?.lastName}
                    teamName={car?.teamName}
                    teamLogo={car?.teamLogo}
                    carImage={car?.carImage}
                    flagImage={car?.flagImage}
                    championshipLogo={selectedChamp?.logo}
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
        </div>
      </main>
      <footer className="">
        
      </footer>
    </div>
  );
}

const styles: Styles = {
  mainArea: {
    display: 'block',
    height: '100%',
    margin: '0 5rem',
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
