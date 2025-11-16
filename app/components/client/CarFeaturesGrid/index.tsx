"use client";
import React from 'react';
import { Item } from '@/types';
import { CheckSquareFilled, MinusSquareFilled } from '@ant-design/icons';

const CarFeaturesGrid = ({ item }: { item: Item }) => {
  // Normalize features to a plain object
  const raw = (item as Item)?.features as unknown;
  let features = raw as Record<string, unknown>;
  const featureKeys = Object.keys(features as object);

  const featureOrder = [
    'Supported by Studio397',
    'Tested by professional drivers',
    'Detailed tyre model',
    'New sound engine',
    'Rain effects',
    'Latest IBL shaders and materials',
    'S397 driver hands and animation',
    'Detailed LCD dashboard',
    'New UI icons and graphics',
    'Tweaked AI for offline racing',
    'Paintable car parts',
  ];
  const rank = new Map(featureOrder.map((k, i) => [k, i]));

  const sortedKeys = [...featureKeys].sort((a, b) => {
    const aHas = !!features[a];
    const bHas = !!features[b];
    if (aHas !== bHas) return aHas ? -1 : 1;

    const aRank = rank.has(a) ? rank.get(a)! : Number.MAX_SAFE_INTEGER;
    const bRank = rank.has(b) ? rank.get(b)! : Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;

    return a.localeCompare(b);
  });

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Features</h3>
      <table style={{ margin: '1rem 0 0 .8rem' }}>
        <tbody>
          {sortedKeys.map((feature, idx) => (
            <tr key={idx}>
              <td>
                {features[feature] ? <CheckSquareFilled style={styles.featurePresent} /> : <MinusSquareFilled style={styles.featureMissing} />}
                <span>{feature}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Define a type for the style object to enable inline styles safely
type Styles = {
  [key: string]: React.CSSProperties;
};

const styles: Styles = {
  featurePresent: {
    color: '#19b765ff',
    marginRight: '0.5rem',
  },
  featureMissing: {
    color: '#828282ff',
    marginRight: '0.5rem',
  },
};

export default CarFeaturesGrid;
