import React from 'react';
import { Image } from 'antd';
import styles from './DownloadsItem.module.css';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

import DownloadButton from '../DownloadButton';
import PerformanceBar from '@/app/components/PerformanceBar';
import DownloadBreadcrumbs from '../../components/DownloadBreadcrumbs';
import CarFeaturesGrid from '@/app/components/CarFeaturesGrid';

type Props = { params: { id: number } };
import {
  ItemAuthor,
  FormattedAuthorsList,
} from '@/types';

export default async function DownloadItemPage({ params }: Props) {
	const { id } = await params;
  const parsedId = parseInt(id as any);

	const item = await prisma.modItems.findUnique({
		where: { id: parsedId },
		include: {
			authors: { include: { author: true } },
			authorTeams: { include: { team: true } },
		},
	});

	if (!item) return notFound();

	// normalize features/specs
	const specs: any = item.specs || {};

  const authors: ItemAuthor[] = item.authors;
  const authorRoles: FormattedAuthorsList = {};
  authors.forEach((a: ItemAuthor) => {
    authorRoles[a.role] ? authorRoles[a.role].push(a.author) : (authorRoles[a.role] = [a.author]);
  });
  
  // normalize screenshots: can be stored as array or JSON string or null
  let screenshotsArr: string[] = [];
  const raw = item.screenshots;
  if (Array.isArray(raw)) screenshotsArr = raw as string[];
  else if (typeof raw === 'string') screenshotsArr = JSON.parse(raw as string) as string[];
  else if (raw) screenshotsArr = raw as unknown as string[];

	return (
		<main className={styles.container}>
			<DownloadBreadcrumbs currentLabel={item?.name || 'Item'} />

      <div className={styles.contentBody}>
        <div className={styles.carInfo}>
          <div className={styles.header}>
            <div className={styles.heroWrap}>
              {item.image && <img src={item.image} alt={item.name} className={styles.hero} />}
              <PerformanceBar 
                powerHp={specs.Power}
                weightKg={specs['Minimum Dry Weight']}
              />
            </div>

            <div className={styles.headerMeta}>
              <div className={styles.itemNameWithLogo}>
                {item.logo && (
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className={styles.logoAbsolute}
                  />
                )}
                <h1 style={{ margin: 0 }}>{item.name}</h1>
              </div>

              {/* teams display if any */}
              {item.authorTeams && item.authorTeams.length > 0 && (
                <div className={styles.teams}>
                  {item.authorTeams.map((t: any) => (
                    <a key={t.id} target='_blank' href={t.team.url} className={styles.team} style={{ background: t.team?.backgroundColor || '#333' }}>
                      {t.team?.logo && <img src={t.team.logo} className={styles.teamLogo} alt={t.team.name} />}
                      <span style={{ color: t.team?.textColor || '#000' }}>{t.team?.shortName}</span>
                    </a>
                  ))}
                </div>
              )}

              <div>
                {/* client download button */}
                <DownloadButton item={item} />
              </div>

              <CarFeaturesGrid item={item} />
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
              
              <table className={styles.specs}>
                <tbody>
                {item.authors && item.authors.length > 0 ? (
                  Object.keys(authorRoles).map((role) => (
                    <tr key={role} className={styles.authorItem}>
                      <td>
                        <strong className={styles.authorRoleLabel}>{role}: </strong>
                        {authorRoles[role].map((a, idx) => {
                          const displayName = a.name || 'Unknown author';
                          return (
                            <React.Fragment key={a.id}>
                              {a.url ? (
                                <a
                                  href={a.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={styles.authorLink}
                                >
                                  {displayName}
                                </a>
                              ) : (
                                <span className={styles.authorName}>{displayName}</span>
                              )}
                              {idx !== authorRoles[role].length - 1 && (
                                <span className={styles.authorSeparator}>,&nbsp;</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td>No authors listed</td></tr>
                )}
                </tbody>
              </table>

              <ul className={styles.authors}>
                
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
