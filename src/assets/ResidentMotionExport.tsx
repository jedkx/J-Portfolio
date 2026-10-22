// ASCII Motion frame playback, with a controlled frame for visitor interactions.
import React, { useEffect, useState } from 'react';
import { residentFrames, trackedResidentLines, type ResidentGaze } from './residentBlockFrames';
export { residentFrames } from './residentBlockFrames';

interface ResidentMotionExportProps {
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
  frameIndex?: number;
  gaze?: ResidentGaze;
}

export const ResidentMotionExport: React.FC<ResidentMotionExportProps> = ({
  autoPlay = true,
  loop = true,
  className = '',
  frameIndex,
  gaze,
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  useEffect(() => {
    if (!autoPlay || frameIndex !== undefined) return;
    const timer = window.setTimeout(
      () =>
        setCurrentFrame((previous) => {
          const next = previous + 1;
          return next < residentFrames.length ? next : loop ? 0 : previous;
        }),
      residentFrames[currentFrame].duration
    );
    return () => window.clearTimeout(timer);
  }, [currentFrame, autoPlay, loop, frameIndex]);
  // Render the authored block cells geometrically: quadrant glyphs can fall
  // back to another font and develop gaps when the pupil changes direction.
  const quadrants = [
    ' ',
    '▘',
    '▝',
    '▀',
    '▖',
    '▌',
    '▞',
    '▛',
    '▗',
    '▚',
    '▐',
    '▜',
    '▄',
    '▙',
    '▟',
    '█',
  ];
  const path = trackedResidentLines(frameIndex ?? currentFrame, gaze)
    .flatMap((line, row) =>
      Array.from(line).flatMap((cell, col) => {
        const bits = Math.max(0, quadrants.indexOf(cell));
        return [0, 1, 2, 3]
          .filter((bit) => bits & (1 << bit))
          .map((bit) => `M${col * 2 + (bit % 2)} ${row * 2 + Math.floor(bit / 2)}h1v1h-1z`);
      })
    )
    .join('');
  return (
    <div className={className}>
      <svg
        className="resident-motion-frame resident-block-grid"
        viewBox="0 0 68 24"
        preserveAspectRatio="none"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path d={path} fill="currentColor" />
      </svg>
    </div>
  );
};
export default ResidentMotionExport;
