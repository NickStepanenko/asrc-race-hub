'use client';
import { Carousel, Image } from 'antd';
import styles from './ScreenshotsCarousel.module.css'

export default function ScreenshotsCarousel({ screenshots }: { screenshots: string[] }) {
  return (
    <div className={styles.screenshotsCarousel}>
      <Carousel arrows autoplay>
        {screenshots.map((src, idx) => (
          <div key={src ?? idx}>
            <Image alt={`screenshot-carousel-${idx}`} src={src} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
