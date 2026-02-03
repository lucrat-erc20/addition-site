// app/components/ui/CarbonFibreBackground.tsx

/**
 * Carbon fibre pattern background
 * Locked settings: tileSize:7 A:27→17 B:31→11
 * A = ↘ diagonal quads (top-left, bottom-right)
 * B = ↙ diagonal quads (top-right, bottom-left)
 */

interface CarbonFibreBackgroundProps {}

export default function CarbonFibreBackground({}: CarbonFibreBackgroundProps) {
  // Locked carbon fibre settings
  const tileSize = 7;
  const half = tileSize / 2;
  const colorA1 = 27; // A start
  const colorA2 = 17; // A end
  const colorB1 = 31; // B start
  const colorB2 = 11; // B end

  return (
    <svg
      className="absolute inset-0 w-full h-full rounded-3xl"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="quadA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${colorA1},${colorA1},${colorA1})`} />
          <stop offset="100%" stopColor={`rgb(${colorA2},${colorA2},${colorA2})`} />
        </linearGradient>

        <linearGradient id="quadB" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={`rgb(${colorB1},${colorB1},${colorB1})`} />
          <stop offset="100%" stopColor={`rgb(${colorB2},${colorB2},${colorB2})`} />
        </linearGradient>

        <pattern id="carbonTile" x="0" y="0" width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width={half} height={half} fill="url(#quadA)" />
          <rect x={half} y="0" width={half} height={half} fill="url(#quadB)" />
          <rect x="0" y={half} width={half} height={half} fill="url(#quadB)" />
          <rect x={half} y={half} width={half} height={half} fill="url(#quadA)" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" rx="24" fill="#111111" />
      <rect width="100%" height="100%" rx="24" fill="url(#carbonTile)" />
    </svg>
  );
}