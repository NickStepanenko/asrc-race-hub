import React from 'react';
import styles from './ItemCard.module.css';
import { Button } from 'antd';
import {
  ShoppingOutlined,
  ToolOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import {
  Item,
  ButtonConfig,
} from "types";

export default function ItemDescription({ item }: { item: Item }) {
  return (
    <>
      <div>{item.name}</div>
    </>
  );
}
