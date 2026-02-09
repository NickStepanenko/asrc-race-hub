"use client";
import React from "react";
import { Button, Space, Empty, message, Row, Col } from 'antd';

import {
  Car,
  Styles,
  SpotterProps,
} from "types";

import CarCard from "@/app/components/client/CarElement";
import SpotterSidebar from "@/app/components/client/Spotter/SpotterSidebar";
import TrackSidebar from "@/app/components/client/TrackSidebar";

export default function Spotter(params: SpotterProps) {
  const {
    selectedChamp,
    selectedRace
  } = params;

  const [messageApi] = message.useMessage();
  const error = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  const handleSaveToImage = (): void => {
    const node = document.getElementById('spotterArea');
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
        <Row gutter={[18, 12]} id="spotterArea">
          <Col xxl={2}>
            <SpotterSidebar
              title={selectedChamp?.title || ""}
            />
          </Col>
          <Col xxl={15}>
            <Row gutter={[12, 6]} wrap justify={"center"}>
              {selectedChamp?.cars?.map((car: Car) => {
                const key = `${car?.carNumber}-${car?.driverFirstName}-${car?.driverLastName}`;
                return (
                  <Space key={key} style={{ margin: '0 4px'}}>
                    <CarCard
                      carNumber={car?.carNumber}
                      firstName={car?.driverFirstName}
                      lastName={car?.driverLastName}
                      teamName={car?.teamName}
                      teamLogo={car?.teamLogo}
                      carImage={car?.carImage}
                      flagImage={car?.flagImage}
                      championshipLogo={selectedChamp?.logo ?? ''}
                    />
                  </Space>
                );
              })}
            </Row>
          </Col>
          <Col xxl={7}>
            <TrackSidebar
              trackInfo={selectedRace}
              serverName={selectedChamp.serverName}
              serverPass={selectedChamp.serverPass}
              serverJoinQr={selectedChamp.leagueJoinQr}
            />
          </Col>
        </Row>

        )}
      </Space>
    </div>
  );
}

const styles: Styles = {
  mainArea: {
    height: '100%',
    width: '100%',
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
