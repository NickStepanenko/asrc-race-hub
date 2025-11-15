import React from 'react';
import { Button, Col, Image, Row, Space } from 'antd';
import styles from './DownloadsItem.module.css';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

import DownloadButton from '../../components/client/DownloadButton';
import PerformanceBar from '@/app/components/client/PerformanceBar';
import DownloadBreadcrumbs from '../../components/client/DownloadBreadcrumbs';
import CarFeaturesGrid from '@/app/components/client/CarFeaturesGrid';

const AUTHORS_CAT_ORDER_LIST: string[] = [
  "3d",
  "Assets & materials",
  "Animations",
  "Sounds",
  "Physics",
  "Testing",
  "Textures",
  "Liveries",
  "Helmet",
];

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
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  let isAdmin = false;

  try {
    const decoded = jwt.verify(token || "", process.env.JWT_SECRET!) as JwtPayload & { role?: string };
    isAdmin = decoded ? (decoded.role === 'ADMIN') : false;
  }
  catch (err) {
    isAdmin = false;
  }

	const specs: any = item.specs || {};
  const authors: ItemAuthor[] = item.authors;
  const authorRoles: FormattedAuthorsList = {};
  const orderedAuthors = authors.sort((a, b) => {
    return AUTHORS_CAT_ORDER_LIST.indexOf(a.role) - AUTHORS_CAT_ORDER_LIST.indexOf(b.role);
  });
  
  orderedAuthors.forEach((a: ItemAuthor) => {
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

      <Row gutter={[24, 24]}>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
            <Row gutter={[24, 24]} style={{ marginBottom: '2rem' }}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <div className={styles.heroWrap}>
                  {item.image && <img src={item.image} alt={item.name} className={styles.hero} />}
                  <PerformanceBar 
                    powerHp={specs.Power}
                    weightKg={specs['Minimum Dry Weight']}
                  />
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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

                  <Space direction="vertical" size={10}>
                    <div>
                      <DownloadButton item={item} />
                    </div>
                    {isAdmin && (
                      <div>
                        <Button
                          color="orange"
                          variant="solid"
                          block
                          href={`/downloads/edit/${item.id}`}
                        >
                          Edit Item
                        </Button>
                      </div>
                    )}
                    <CarFeaturesGrid item={item} />
                  </Space>
                </div>
              </Col>
            </Row>
            
            <Row gutter={[24, 24]} style={{ marginBottom: '2rem' }}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
                                    <span>{displayName}</span>
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
                </section>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
            {screenshotsArr.length > 0 && (
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
            )}
          </Col>
        </Row>
      </Row>
		</main>
	);
}
