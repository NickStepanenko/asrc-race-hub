"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Layout } from "antd";

const { Header } = Layout;

const headerMenuItems = [
  { key: "downloads", label: "Downloads" },
  { key: "online_racing", label: "Online Racing" },
  { key: "contact", label: "Contact" },
];

export default function MainHeader() {
  const router = useRouter();
  const pathname = usePathname() || "/";

  const getKeyFromPath = (p: string) => {
    if (p.startsWith("/downloads")) return "downloads";
    if (p.startsWith("/online_racing")) return "online_racing";
    if (p.startsWith("/contact")) return "contact";
    return "downloads";
  };

  const selectedKey = getKeyFromPath(pathname);

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "downloads":
        router.push("/downloads");
        break;
      case "online_racing":
        router.push("/online_racing");
        break;
      case "contact":
        router.push("/contact");
        break;
      default:
        break;
    }
  };

  return (
    <Header style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src="/img/logo_advanced_simulation_wy.png"
        alt="Advanced Simulation"
        style={{ maxHeight: '50%' }}
      />

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick as any}
        items={headerMenuItems}
        style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
      />
    </Header>
  );
}
