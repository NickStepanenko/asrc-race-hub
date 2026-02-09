import React from 'react';
import { Button, Col, Image, Row, Space } from 'antd';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

import { getCached, setCached } from "@/server/redis/cache";

import styles from './DownloadsItem.module.css';

import DownloadButton from '@/app/components/client/DownloadButton';
import PerformanceBar from '@/app/components/client/PerformanceBar';
import DownloadBreadcrumbs from '@/app/components/client/DownloadBreadcrumbs';
import CarFeaturesGrid from '@/app/components/client/CarFeaturesGrid';
import ScreenshotsCarousel from '@/app/components/client/ScreenshotsCarousel';
import ModdingTeamsList from '@/app/components/client/ModdingTeamsList';

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

const getItem = async (id: number) => {
  const cacheKey = `downloads:v1:item-${id}`;
  const cached = await getCached(cacheKey);
  if (cached) return cached as Item;

  const item = await prisma.modItems.findUnique({
		where: { id },  
		include: {
			authors: {
        include: {
          author: true, // pulls the actual Author row for each join row
        },
      },
      authorTeams: {
        include: { team: true }, // keep any other relations you need
      },
		},
	});

  await setCached(cacheKey, item);
  return item as Item;
}

type Props = { params: { id: string } };
import {
  Item,
  ItemAuthor,
  FormattedAuthorsList,
  ItemSpecs,
} from '@/types';
import { BgColorsOutlined, EditFilled, ToolFilled } from '@ant-design/icons';

export default async function DownloadItemPage({ params }: Props) {
	const { id } = await params;
  const parsedId = parseInt(id);

  const item = await getItem(parsedId);

	if (!item) return notFound();

	// normalize features/specs
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  let isAdmin = false;

  try {
    const decoded = jwt.verify(token || "", process.env.JWT_SECRET!) as JwtPayload & { role?: string };
    isAdmin = decoded ? (decoded.role === 'ADMIN') : false;
  }
  catch {
    isAdmin = false;
  }

	const specs: ItemSpecs = item.specs as ItemSpecs;
  const authors: ItemAuthor[] = item.authors;
  const authorRoles: FormattedAuthorsList = {};
  const orderedAuthors = authors.sort((a, b) => {
    return AUTHORS_CAT_ORDER_LIST.indexOf(a.role) - AUTHORS_CAT_ORDER_LIST.indexOf(b.role);
  });
  
  orderedAuthors.forEach((a: ItemAuthor) => {
    if (!authorRoles[a.role]) authorRoles[a.role] = [];
    authorRoles[a.role].push(a.author);
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
        <Row gutter={[24, 12]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
            <Row gutter={[24, 24]} style={{ marginBottom: '2rem' }}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <div className={styles.heroWrap}>
                  {item.image &&
                    <Image
                      src={item.image}
                      alt={item.name}
                      className={styles.hero}
                      preview={false}
                    />}
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
                      <Image
                        src={item.logo}
                        alt={`${item.name} logo`}
                        className={styles.logoAbsolute}
                        preview={false}
                      />
                    )}
                    <h1 style={{ margin: 0 }}>{item.name}</h1>
                    {isAdmin && (
                      <Button
                        variant="filled"
                        icon={<EditFilled />}
                        href={`/downloads/edit/${item.id}`}
                      />
                    )}
                  </div>

                  <ModdingTeamsList item={item} />

                  <Space direction="vertical" size={10}>
                    <h3>Download</h3>
                    <Row gutter={[6, 12]}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <DownloadButton item={item} />
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Button
                          variant="link"
                          icon={<BgColorsOutlined />}
                          iconPosition='start'
                          href={item.templatesUrl || ""}
                          target='_blank'
                          disabled={!item.templatesUrl}
                          block
                        >Templates</Button>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <Button
                          variant="link"
                          icon={<ToolFilled />}
                          iconPosition='start'
                          href={item.setupsUrl || ""}
                          target='_blank'
                          disabled={!item.setupsUrl}
                          block
                        >Setups</Button>
                      </Col>
                    </Row>
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
                      {Object.entries(specs).map(([k, v], idx) => (
                        <tr key={`specs-${idx}`}><td style={{ fontWeight: 600 }}>{k}</td><td>{String(v)}</td></tr>
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
                      Object.keys(authorRoles).map((role, idx) => (
                        <tr key={`role-${idx}`} className={styles.authorItem}>
                          <td>
                            <strong className={styles.authorRoleLabel}>{role}: </strong>
                            {authorRoles[role].map((a, idx) => {
                              const displayName = a.name || 'Unknown author';
                              return (
                                <React.Fragment key={`role-${idx}`}>
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
              <>
                <ScreenshotsCarousel screenshots={screenshotsArr} />
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
              </>
            )}
          </Col>
        </Row>
      </Row>
		</main>
	);
}
