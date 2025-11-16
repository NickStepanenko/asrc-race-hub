"use client"
import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import styles from './Downloads.module.css';
import { isNewItem, ItemCard } from '../components/client/ItemCard';
import { Checkbox, Col, Select, Space } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';

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

const DEFAULT_SORT_FIELD = "releaseDate";

export default function DownloadsListPage() {
  const searchParams = useSearchParams();

  const [contentData, setContentData] = useState<any[]>([]);
  const [teamsData, setTeamsData] = useState<any[]>([]);

  const [selectedClasses, setSelectedClasses] = useState<Record<string, boolean>>({});
  const [selectedTeams, setSelectedTeams] = useState<Record<string, boolean>>({});
  const [categoriesAdded, setCategoriesAdded] = useState(true);
  const [newItemsOnly, setNewItemsOnly] = useState(false);
  const [sortFieldName, setSortFieldName] = useState(DEFAULT_SORT_FIELD);

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
    const teams: any[] = [];

    contentData.forEach((item) => {
      item.authorTeams.forEach((author: any) => {
        const teamFound = teams.find((team) => team.id === author.team.id);
        if (!teamFound) teams.push(author.team);
      }
      );
    });
    setTeamsData(teams.sort((a, b) => a.id - b.id));

    return contentData
      .filter((it) => {
        const teamsCheck = activeTeamFilters.length ?
          [...it.authorTeams.filter((author: any) => 
            activeTeamFilters.indexOf(author.team.id.toString()) > -1)].length > 0
          : true;
        const carClassCheck = activeFilters.length ? activeFilters.includes(it.carClass) : true;
        const isNewCheck = newItemsOnly ? isNewItem(it) : true;

        return carClassCheck && teamsCheck && isNewCheck;
      })
      .sort((a, b) => {
        const av = a[sortFieldName];
        const bv = b[sortFieldName];

        switch (sortFieldName) {
          case "releaseDate":
            return new Date(bv).getTime() - new Date(av).getTime();
          case undefined:
            return 0;
          default:
            return String(av).localeCompare(String(bv));
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
                        <ItemCard key={item.id} item={item as any} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>)
            : <div className={styles.grid}>
                {filtered.map((item) => (
                  <ItemCard key={item.id} item={item as any} />
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
