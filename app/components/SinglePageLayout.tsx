"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, Button, Tooltip, Table, Carousel } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  EyeOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const NAV_ITEMS: { key: string; icon: React.ReactNode; title: string }[] = [
  { key: "home", icon: <HomeOutlined />, title: "Home" },
  { key: "hub", icon: <AppstoreOutlined />, title: "Hub" },
  { key: "standings", icon: <AppstoreOutlined />, title: "Standings" },
  { key: "spotter", icon: <EyeOutlined />, title: "Spotter" },
  { key: "stewards", icon: <TeamOutlined />, title: "Stewards" },
  { key: "content", icon: <FileTextOutlined />, title: "Content" },
];

const DEFAULT_CHAMPIONSHIPS = [
  "Championship A",
  "Championship B",
  "Championship C",
];

export default function SinglePageLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = searchParams?.get("page") || "home";

  const [page, setPage] = useState<string>(initialPage);
  const [variant, setVariant] = useState<string>(() => {
    try {
      return typeof window !== "undefined" ? window.localStorage.getItem("variant") ?? "airy" : "airy";
    } catch {
      return "airy";
    }
  });

  useEffect(() => {
    try {
      window.document.documentElement.classList.remove("variant-compact", "variant-airy");
      window.document.documentElement.classList.add(`variant-${variant}`);
      window.localStorage.setItem("variant", variant);
    } catch {}
  }, [variant]);
  const [championship, setChampionship] = useState<string | undefined>(() => {
    try {
      return typeof window !== "undefined"
        ? window.localStorage.getItem("championship") ?? DEFAULT_CHAMPIONSHIPS[0]
        : DEFAULT_CHAMPIONSHIPS[0];
    } catch {
      return DEFAULT_CHAMPIONSHIPS[0];
    }
  });

  useEffect(() => {
    // keep in sync with URL
    const urlPage = searchParams?.get("page") || "home";
    setPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    try {
      if (championship) window.localStorage.setItem("championship", championship);
    } catch {}
  }, [championship]);

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
        <div className="sp-topbar">
          <Select
            value={championship}
            onChange={(val) => setChampionship(val)}
            style={{ width: 280 }}
            size="middle"
          >
            {DEFAULT_CHAMPIONSHIPS.map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>

          <div style={{ marginLeft: 16 }}>
            <Select value={variant} onChange={(v) => setVariant(v)} size="small" style={{ width: 120 }}>
              <Option value="airy">Airy</Option>
              <Option value="compact">Compact</Option>
            </Select>
          </div>
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
              <p style={{ color: "#666" }}>Spotter content will be added later.</p>
            </div>
          )}

          {page === "standings" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
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
              <div>
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
