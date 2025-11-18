"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter, usePathname } from "next/navigation";
import { Menu, Layout } from "antd";
import Link from "next/link";

import styles from './MainHeader.module.css';
import { useAuth } from "@/app/components/server/AuthProvider";

const { Header } = Layout;

export default function MainHeader() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { user: authUser, loading } = useAuth();
  const [headerMenuItemsRight, setHeaderMenuItemsRight] = useState<{ key: string; label: string }[]>([]);
  
  const headerMenuItemsLeft = [
    { key: "downloads", label: "Downloads" },
    { key: "online_racing", label: "Online Racing" },
    { key: "contact", label: "Contact" },
  ];

  useEffect(() => {
    switch (authUser) {
      case null:
        setHeaderMenuItemsRight([
          { key: "login", label: "Log In" },
          { key: "register", label: "Register" },
        ]);
        break;
      default:
        setHeaderMenuItemsRight([
          { key: "logout", label: "Log Out" },
        ]);
    }
  }, [authUser, loading]);

  const getKeyFromPath = (p: string) => {
    if (p.startsWith("/downloads")) return "downloads";
    if (p.startsWith("/online_racing")) return "online_racing";
    if (p.startsWith("/contact")) return "contact";
    if (p.startsWith("/login")) return "login";
    if (p.startsWith("/logout")) return "logout";
    if (p.startsWith("/register")) return "register";
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
      case "login":
        router.push("/login");
        break;
      case "logout":
        router.push("/logout");
        break;
      case "register":
        router.push("/register");
        break;
      default:
        router.push("/downloads");
        break;
    }
  };

  return (
    <Header className={styles.sticky}>
      <Link href="/downloads" className={styles.logo} aria-label="Home">
        <Image
          src="/img/logo_advanced_simulation_wy.png"
          alt="Advanced Simulation"
          width={100}
          height={28}
          priority
        />
      </Link>

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={headerMenuItemsLeft}
        style={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', backgroundColor: '#111' }}
      />

      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={headerMenuItemsRight}
        style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end', backgroundColor: '#111' }}
      />
    </Header>
  );
}
