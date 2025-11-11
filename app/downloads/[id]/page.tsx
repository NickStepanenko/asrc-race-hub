import React from 'react';
import { Image } from 'antd';
import styles from './DownloadsItem.module.css';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

import DownloadButton from '../DownloadButton';
import PerformanceBar from '@/app/components/PerformanceBar';
import DownloadBreadcrumbs from '../../components/DownloadBreadcrumbs';

type Props = { params: { id: string } };

export default async function DownloadItemPage({ params }: Props) {
	const { id } = params;

	const item = await prisma.contentItem.findUnique({
		where: { id },
		include: {
			authors: { include: { author: true } },
			authorTeams: { include: { team: true } },
		},
	});

	if (!item) return notFound();

	// normalize features/specs
	const features: any = item.features || {};
	const specs: any = item.specs || {};
  // normalize screenshots: can be stored as array or JSON string or null
  let screenshotsArr: string[] = [];
  try {
    const raw = item.screenshots;
    if (Array.isArray(raw)) screenshotsArr = raw as string[];
    else if (typeof raw === 'string') screenshotsArr = JSON.parse(raw as string) as string[];
    else if (raw) screenshotsArr = raw as unknown as string[];
  } catch (e) {
    screenshotsArr = [];
  }

	return (
		<main className={styles.container}>
			<DownloadBreadcrumbs currentLabel={item?.name || 'Item'} />

      <div className={styles.contentBody}>
        <div className={styles.carInfo}>
          <div className={styles.header}>
            <div className={styles.heroWrap}>
              {item.image && <img src={item.image} alt={item.name} className={styles.hero} />}
              {item.logo && (
                <img
                  src={item.logo}
                  alt={`${item.name} logo`}
                  className={styles.logoAbsolute}
                />
              )}
              <PerformanceBar 
                powerHp={specs.Power}
                weightKg={specs['Minimum Dry Weight']}
              />
            </div>

            <div className={styles.headerMeta}>
              <h1 style={{ marginTop: 0 }}>{item.name}</h1>

              {/* teams display if any */}
              {item.authorTeams && item.authorTeams.length > 0 && (
                <div className={styles.teams}>
                  {item.authorTeams.map((t: any) => (
                    <div key={t.id} className={styles.team} style={{ background: t.team?.backgroundColor || '#333' }}>
                      {t.team?.logo && <img src={t.team.logo} className={styles.teamLogo} alt={t.team.name} />}
                      <span>{t.team?.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                {/* client download button */}
                <DownloadButton item={item} />
              </div>

              {/* features as checkboxes */}
              <div style={{ marginTop: 12 }}>
                <ul className={styles.features}>
                  {Array.isArray(features)
                    ? features.map((f: string) => (
                        <li key={f}><label><input type="checkbox" checked readOnly /> <span style={{ marginLeft: 8 }}>{f}</span></label></li>
                      ))
                    : Object.entries(features).map(([k, v]) => (
                        <li key={k}><label><input type="checkbox" checked={Boolean(v)} readOnly /> <span style={{ marginLeft: 8 }}>{k}</span></label></li>
                      ))}
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.contentRow}>
            <aside className={styles.leftCol}>
              <h3>Specs</h3>
              <table className={styles.specs}>
                <tbody>
                  {Object.entries(specs).map(([k, v]) => (
                    <tr key={k}><td style={{ fontWeight: 600 }}>{k}</td><td>{String(v)}</td></tr>
                  ))}
                </tbody>
              </table>
            </aside>

            <section className={styles.rightCol}>
              <h3>Authors</h3>
              <ul className={styles.authors}>
                {item.authors && item.authors.length > 0 ? (
                  item.authors.map((a: any) => (
                    <li key={a.id}><strong>{a.author?.name}</strong> — <span>{a.role}</span>{a.author?.url && (<span> — <a href={a.author.url} target="_blank" rel="noreferrer">link</a></span>)}</li>
                  ))
                ) : (
                  <li>No authors listed</li>
                )}
              </ul>
            </section>
          </div>
        </div>
        {screenshotsArr.length > 0 && (
          <div>
            <h3>Screenshots</h3>
            <div className={styles.screenshots}>
              {screenshotsArr.map((src, idx) => (
                <Image
                  key={idx}
                  alt={`screenshot-${idx}`} 
                  width={200}
                  src={src}
                />
              ))}
            </div>
          </div>
        )}
      </div>
		</main>
	);
}