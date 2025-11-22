"use client";
import React from "react";
import { Button, Checkbox, Col, Select, Space } from "antd";
import { SortAscendingOutlined } from "@ant-design/icons";

import styles from './DownloadFilters.module.css';

import {
  CarClass,
  ModdingTeam,
  SortFieldName,
} from "types";

type FilterParams = {
  carClasses: string[];
  selectedClasses: Record<string, boolean>;
  teamsData: ModdingTeam[];
  selectedTeams: Record<string, boolean>
  categoriesAdded: boolean;
  newItemsOnly: boolean;
  defaultSortField: SortFieldName;
  creatingAvailable: boolean;
  toggle: (a: CarClass) => void;
  toggleTeams: (a: number) => void;
  setCategoriesAdded: (a: boolean) => void;
  setNewItemsOnly: (a: boolean) => void;
  setSortFieldName: (a: SortFieldName) => void;
};

export default function DownloadFilters(params: FilterParams) {
  const {
    carClasses,
    selectedClasses,
    toggle,
    teamsData,
    selectedTeams,
    toggleTeams,
    categoriesAdded,
    setCategoriesAdded,
    newItemsOnly,
    setNewItemsOnly,
    defaultSortField,
    setSortFieldName,
    creatingAvailable,
  } = params;

  return (
    <Col xs={24} sm={12} md={8} lg={8} xl={6} xxl={4}>
      <aside className={styles.sidebar}>
        <Space direction='vertical' size={20}>
          <Col>
            <h3 className={styles.filtersTitle}>Car classes</h3>
            {carClasses.map((c) => (
              <div key={c}>
                <Checkbox checked={!!selectedClasses[c]} onChange={() => toggle(c as CarClass)}>{c}</Checkbox>
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
              defaultValue={defaultSortField}
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
    </Col>
  )
}
