import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = { params: { id: string } };

export default async function DownloadItemPage({ params }: Props) {
	const { id } = params;

	const item = await prisma.contentItem.findUnique({
		where: { id },
	});

	if (!item) return notFound();

	return (
		<div style={{ padding: 16 }}>
			<h1 style={{ marginTop: 0 }}>{item.name}</h1>
			{item.image && (
				<img src={item.image} alt={item.name} style={{ maxWidth: '100%', borderRadius: 8 }} />
			)}
			<p style={{ marginTop: 12 }}>{item.description}</p>

			<div style={{ marginTop: 18 }}>
				<strong>Type:</strong> {item.type} — <strong>Class:</strong> {item.carClass}
			</div>

			{/* {item.screenshots && (
				<div style={{ marginTop: 18 }}>
					<h3>Screenshots</h3>
					<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
						{JSON.parse(item?.screenshots as unknown as string).map((src: string) => (
							<img key={src} src={src} alt="screenshot" style={{ width: 200, borderRadius: 6 }} />
						))}
					</div>
				</div>
			)} */}
		</div>
	);
}