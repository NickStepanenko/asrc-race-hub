"use client"
import React, { useMemo, useState, useEffect, Suspense } from 'react';
import { Button, Col, Row, Grid, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';

import { isNewItem, ItemCard } from '@/app/components/client/ItemCard';
import DownloadFilters from '@/app/components/client/DownloadFilters';
import { useAuth } from '@/app/components/server/AuthProvider';

import { CarClass, Item, ModdingTeam, ModItemsModdingTeams, SortFieldName } from '@/types';

import styles from './Downloads.module.css';

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

function DownloadsListContent() {
  const screens = Grid.useBreakpoint();
  const [open, setOpen] = useState(false);

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

  const DownloadFiltersComponent = <>
    <DownloadFilters
      carClasses={CAR_CLASSES}
      selectedClasses={selectedClasses}
      toggle={toggle}
      teamsData={teamsData}
      selectedTeams={selectedTeams}
      toggleTeams={toggleTeams}
      categoriesAdded={categoriesAdded}
      setCategoriesAdded={setCategoriesAdded}
      newItemsOnly={newItemsOnly}
      setNewItemsOnly={setNewItemsOnly}
      defaultSortField={DEFAULT_SORT_FIELD}
      setSortFieldName={setSortFieldName}
      creatingAvailable={creatingAvailable}
    />
  </>;

  return (
    <div className={styles.page}>
      {!screens.lg && 
        <Button
          icon={<FilterOutlined />}
          type="dashed"
          onClick={() => setOpen(true)}
        >
          Filters
        </Button>}
      <Row gutter={[12, 12]}>
        <>
          {screens.lg ? (
            <>{DownloadFiltersComponent}</>
          ) : (
            <Drawer
              title="Filters"
              placement="left"
              open={open}
              onClose={() => setOpen(false)}
              style={{ padding: 0 }}
            >
              {DownloadFiltersComponent}
            </Drawer>
          )}
        </>
        <Col xs={24} sm={24} md={24} lg={16} xl={18} xxl={20}>
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
        </Col>
      </Row>
    </div>
  );
}

export default function DownloadsListPage() {
  return (
    <Suspense fallback={null}>
      <DownloadsListContent />
    </Suspense>
  );
}
