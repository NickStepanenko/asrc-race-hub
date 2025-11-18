"use client";
import React from "react";
import { Image } from "antd";

import styles from './ModdingTeamsList.module.css';

import {
  Item,
  ModItemsModdingTeams,
} from "types";

export default function ModdingTeamsList({ item }: { item: Item }) {
  return (
    <div className={styles.teams}>
      {item.authorTeams.map((t: ModItemsModdingTeams, idx) => (
        <a key={`team-${idx}`} target='_blank' href={t.team.url || ""} className={styles.team} style={{ background: t.team?.backgroundColor || '#333' }}>
          {t.team?.logo && 
            <Image
              src={t.team.logo}
              className={styles.teamLogo}
              alt={t.team.name || ""}
              preview={false}
              width={20}
            />}
          <span style={{ color: t.team?.textColor || '#000' }}>{t.team?.shortName}</span>
        </a>
      ))}
    </div>
  )
}
