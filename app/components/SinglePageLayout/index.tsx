"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Button, Tooltip, Table, Carousel, Space } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  EyeOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Option } = Select;

import {
  Championship,
  Car,
  Race,
  ChampionshipsListItem,
  RacesListItem,
  Styles,
} from "types";

import Spotter from "../Spotter";

const NAV_ITEMS: { key: string; icon: React.ReactNode; title: string }[] = [
  { key: "home", icon: <HomeOutlined />, title: "Home" },
  { key: "hub", icon: <AppstoreOutlined />, title: "Hub" },
  { key: "standings", icon: <AppstoreOutlined />, title: "Standings" },
  { key: "spotter", icon: <EyeOutlined />, title: "Spotter" },
  { key: "stewards", icon: <TeamOutlined />, title: "Stewards" },
  { key: "content", icon: <FileTextOutlined />, title: "Content" },
];

export default function SinglePageLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = searchParams?.get("page") || "home";

  const [page, setPage] = useState<string>(initialPage);
  
  const [champData, setChampData] = useState<Championship[]>([]);
  const [champList, setChampList] = useState<ChampionshipsListItem[]>([]);
  const [selectedChamp, setSelectedChamp] = useState<Championship | null>(null);

  const [racesData, setRacesData] = useState<Race[]>([]);
  const [racesList, setRacesList] = useState<RacesListItem[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const handleChampionshipSelection = (id: number) => {
    const champ = champData.find((item) => item.id === id) || null;
    setSelectedChamp(champ);
    setRacesData(champ?.races || []);
  };
  const handleRaceSelection = (id: number) => {
    const race = racesData.find((item) => item.id === id) || null;
    setSelectedRace(race);
  };
  
  useEffect(() => {
    const items = champData.map((champ: Championship) => ({
      value: champ.id,
      label: (<span>{champ.title}</span>),
    }));

    setChampList([ { value: -1, label: (<span>Select championship</span>) }, ...items ]);
  }, [champData]);

  useEffect(() => {
    const items = racesData.map((race: Race) => ({
      value: race.id,
      label: (<span>{race.name}</span>),
    }));

    setRacesList([ { value: -1, label: (<span>Select race</span>) }, ...items ]);
  }, [racesData]);

  useEffect(() => {
    fetch('/api/championships')
      .then((res) => res.json())
      .then(setChampData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    // keep in sync with URL
    const urlPage = searchParams?.get("page") || "home";
    setPage(urlPage);
  }, [searchParams]);

  function navigateTo(key: string) {
    setPage(key);
    // update URL so it's shareable
    router.push(`/?page=${key}`);
  }

  return (
    <div className="sp-root">
      <aside className="sp-sidenav">
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.key} title={item.title} placement="right">
            <Button
              type={page === item.key ? "primary" : "text"}
              shape="circle"
              size="large"
              style={{ width: 48, height: 48 }}
              onClick={() => navigateTo(item.key)}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
            </Button>
          </Tooltip>
        ))}
      </aside>

      <main className="sp-main">
        <div style={styles.filterArea}>
          <Space>
            <Select
              value={selectedChamp ? selectedChamp.id : null}
              placeholder="Select championship"
              optionFilterProp="label"
              options={champList}
              onChange={handleChampionshipSelection}
              popupMatchSelectWidth
              style={{ width: 300 }} />
            <Select
              value={selectedRace ? selectedRace.id : null}
              placeholder="Select race"
              optionFilterProp="label"
              options={racesList}
              onChange={handleRaceSelection}
              popupMatchSelectWidth
              style={{ width: 300 }} />
          </Space>
        </div>

        <div className="sp-content">
          {page === "home" && <Placeholder title="Home" />}

          {page === "hub" && (
            <div>
              <h3>Overview table</h3>
              <Table
                pagination={false}
                dataSource={[
                  { key: 1, name: "Driver 1", team: "Team A", pts: 120 },
                  { key: 2, name: "Driver 2", team: "Team B", pts: 98 },
                ]}
                columns={[
                  { title: "#", dataIndex: "key", key: "key", width: 50 },
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Team", dataIndex: "team", key: "team" },
                  { title: "Points", dataIndex: "pts", key: "pts", width: 100 },
                ]}
              />
            </div>
          )}

          {page === "spotter" && (
            <div>
              <h3>Spotter</h3>
              <Spotter
                selectedChamp={selectedChamp}
                selectedRace={selectedRace}
              />
            </div>
          )}

          {page === "standings" && (
            <div className="standings-grid">
              <div className="standings-col">
                <h2>Driver Standings</h2>
                <div className="scrollable">
                  <Table
                    pagination={false}
                    dataSource={[
                      { key: 1, pos: 1, name: "Driver 1", pts: 120 },
                      { key: 2, pos: 2, name: "Driver 2", pts: 98 },
                      { key: 3, pos: 3, name: "Driver 3", pts: 72 },
                      { key: 4, pos: 4, name: "Driver 4", pts: 62 },
                    ]}
                    columns={[
                      { title: "Pos", dataIndex: "pos", key: "pos", width: 60 },
                      { title: "Name", dataIndex: "name", key: "name" },
                      { title: "Points", dataIndex: "pts", key: "pts", width: 100 },
                    ]}
                    scroll={{ y: 300 }}
                  />
                </div>
              </div>

              <div className="standings-col">
                <h2>Team Standings</h2>
                <div className="scrollable">
                  <Table
                    pagination={false}
                    dataSource={[
                      { key: 1, pos: 1, team: "Team A", pts: 210 },
                      { key: 2, pos: 2, team: "Team B", pts: 150 },
                      { key: 3, pos: 3, team: "Team C", pts: 120 },
                    ]}
                    columns={[
                      { title: "Pos", dataIndex: "pos", key: "pos", width: 60 },
                      { title: "Team", dataIndex: "team", key: "team" },
                      { title: "Points", dataIndex: "pts", key: "pts", width: 100 },
                    ]}
                    scroll={{ y: 300 }}
                  />
                </div>
              </div>
            </div>
          )}

          {page === "stewards" && <Placeholder title="Stewards" />}
          {page === "content" && <Placeholder title="Content" />}
        </div>
      </main>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
      <p style={{ marginTop: 12, color: "#666" }}>
        This is a placeholder for the <strong>{title}</strong> page. We'll add
        the real content later.
      </p>
    </div>
  );
}

const styles: Styles = {
  filterArea: {
    margin: "1rem 0",
  },
};
