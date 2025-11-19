"use client"
import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import styles from './Downloads.module.css';
import { isNewItem, ItemCard } from '@/app/components/client/ItemCard';
import { Button, Checkbox, Col, Select, Space } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';
import { useAuth } from '@/app/components/server/AuthProvider';
import { Item, ModdingTeam, ModItemsModdingTeams } from '@/types';

type CarClass =
  | 'Open Wheelers'
  | 'Touring Cars'
  | 'Prototypes'
  | 'Le Mans Hypercars'
  | 'Stock Cars'
  | 'GT Cars'
  | 'Drift Cars'
  | 'Skinpacks'
  | 'GT500';

const CAR_CLASSES: CarClass[] = [
  'Le Mans Hypercars',
  'Open Wheelers',
  'Touring Cars',
  'Stock Cars',
  'Prototypes',
  'GT500',
  'GT Cars',
  'Drift Cars',
  'Skinpacks',
];

type SortFieldName = 'releaseDate' | 'name' | 'carClass' | 'type';
const DEFAULT_SORT_FIELD = "releaseDate";

export default function DownloadsListPage() {
  const searchParams = useSearchParams();
  const { user: authUser } = useAuth();

  const [contentData, setContentData] = useState<Item[]>([]);
  const [teamsData, setTeamsData] = useState<ModdingTeam[]>([]);

  const [selectedClasses, setSelectedClasses] = useState<Record<string, boolean>>({});
  const [selectedTeams, setSelectedTeams] = useState<Record<string, boolean>>({});
  const [categoriesAdded, setCategoriesAdded] = useState(true);
  const [newItemsOnly, setNewItemsOnly] = useState(false);
  const [sortFieldName, setSortFieldName] = useState<SortFieldName>("releaseDate");

  const [creatingAvailable, setCreatingAvailable] = useState(false);

  const toggle = (c: CarClass) => {
    setSelectedClasses((s) => ({ ...s, [c]: !s[c] }));
  };
  const toggleTeams = (id: number) => {
    setSelectedTeams((teams) => ({ ...teams, [id]: !teams[id] }));
  };

  const activeFilters = useMemo(() => Object.keys(selectedClasses).filter((k) => selectedClasses[k]), [selectedClasses]);
  const activeTeamFilters = useMemo(() => Object.keys(selectedTeams).filter((k) => selectedTeams[k]), [selectedTeams]);

  // Filtering data
  const filtered = useMemo(() => {
    const teams: ModdingTeam[] = [];

    contentData.forEach((item) => {
      item.authorTeams.forEach((author: ModItemsModdingTeams) => {
        const teamFound = teams.find((team) => team.id === author.team.id);
        if (!teamFound) teams.push(author.team);
      }
      );
    });
    setTeamsData(teams.sort((a, b) => a.id - b.id));

    return contentData
      .filter((it) => {
        const teamsCheck = activeTeamFilters.length ?
          [...it.authorTeams.filter((author: ModItemsModdingTeams) => 
            activeTeamFilters.indexOf(author.team.id.toString()) > -1)].length > 0
          : true;
        const carClassCheck = activeFilters.length ? activeFilters.includes(it.carClass) : true;
        const isNewCheck = newItemsOnly ? isNewItem(it) : true;

        return carClassCheck && teamsCheck && isNewCheck;
      })
      .sort((a: Item, b: Item) => {
        switch (sortFieldName) {
          case "releaseDate":
            const av = a[sortFieldName] || Date();
            const bv = b[sortFieldName] || Date();
            return new Date(bv).getTime() - new Date(av).getTime();
          case undefined:
            return 0;
          default:
            const aValue = a[sortFieldName];
            const bValue = b[sortFieldName];
            return String(aValue).localeCompare(String(bValue));
        }
      });
  }, [contentData, activeFilters, activeTeamFilters, newItemsOnly, sortFieldName]);

  const sort = searchParams.get('sort') ?? '';

  useEffect(() => {
    const qs = sort ? `?sort=${encodeURIComponent(sort)}` : '';
    fetch(`/api/downloads${qs}`)
      .then((res) => res.json())
      .then(setContentData)
      .catch(console.error);
  }, [sort]);

  useEffect(() => setCreatingAvailable(authUser?.role === "ADMIN"), [authUser]);

  return (
    <>
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <Space direction='vertical' size={20}>
          <Col>
            <h3 className={styles.filtersTitle}>Car classes</h3>
            {CAR_CLASSES.map((c) => (
              <div key={c}>
                <Checkbox checked={!!selectedClasses[c]} onChange={() => toggle(c)}>{c}</Checkbox>
                <br />
              </div>
            ))}
          </Col>
          <Col>
            <div className={styles.filtersTitle}>Modding Teams</div>
            {teamsData.map((team) => (
              <div key={team.id}>
                <Checkbox checked={!!selectedTeams[team.id]} onChange={() => toggleTeams(team.id)}>{team.name}</Checkbox>
                <br />
              </div>
            ))}
          </Col>
          <Col>
            <div className={styles.filtersTitle}>Other</div>
            <Checkbox checked={!!categoriesAdded} onChange={() => setCategoriesAdded(!categoriesAdded)}>Separated By Categories</Checkbox>
            <Checkbox checked={!!newItemsOnly} onChange={() => setNewItemsOnly(!newItemsOnly)}>Only NEW Items</Checkbox>
          </Col>
          <Col>
            <div className={styles.filtersTitle}>Sort by</div>
            <Select
              defaultActiveFirstOption
              popupMatchSelectWidth
              defaultValue={DEFAULT_SORT_FIELD}
              style={{ width: "100%" }}
              prefix={<SortAscendingOutlined />}
              onChange={setSortFieldName}
              options={[
                {
                  label: <span>Release Date</span>,
                  value: "releaseDate"
                },
                {
                  label: <span>Name</span>,
                  value: "name"
                },
                {
                  label: <span>Car Class</span>,
                  value: "carClass"
                },
                {
                  label: <span>Type</span>,
                  value: "type"
                },
              ]} />
          </Col>
          {creatingAvailable && <Col>
            <Button
              type='dashed'
              href={"downloads/edit/new"}
            >Create New</Button>
          </Col>}
        </Space>
      </aside>

      <main className={styles.main}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>No items match the selected filters.</div>
        ) : (
          <div>
            {categoriesAdded ?
              (<div>
              {CAR_CLASSES.map((c) => {
                const itemsInClass = filtered.filter((it) => it.carClass === c);
                if (itemsInClass.length === 0) return null;

                return (
                  <section key={c} className={styles.section} aria-labelledby={`section-${c}`}>
                    <div id={`section-${c}`} className={styles.sectionHeader}>{c}</div>
                    <div className={styles.grid}>
                      {itemsInClass.map((item) => (
                        <ItemCard key={item.id} item={item as Item} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>)
            : <div className={styles.grid}>
                {filtered.map((item) => (
                  <ItemCard key={item.id} item={item as Item} />
                ))}
              </div>
            }
          </div>
        )}
      </main>
    </div>
    </>
  );
}
