# SVG Pipeline for Expo (React Native)

This project renders SVG assets natively through `react-native-svg` and `react-native-svg-transformer`.
Follow the guidelines below to add new vector art without breaking Metro or TypeScript.

## Installation (already configured)

Dependencies live in `apps/mobile/package.json`:

```jsonc
{
  "devDependencies": {
    "react-native-svg-transformer": "1.5.0"
  },
  "dependencies": {
    "react-native-svg": "15.2.0"
  }
}
```

No extra steps are required after running `npm install` inside `apps/mobile`.

## Metro Configuration

`apps/mobile/metro.config.js` wires the SVG transformer and enforces the Node builtin guardrail:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

const disallowedNodeBuiltins = new Set([
  'fs',
  'path',
  'url',
  'http',
  'https',
  'zlib',
  'stream',
  'crypto',
  'util',
  'net',
  'tls',
  'events'
]);

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (disallowedNodeBuiltins.has(moduleName)) {
    throw new Error(`Node builtin \"${moduleName}\" is not available in React Native. Use platform-safe alternatives.`);
  }

  return resolve(context, moduleName, platform);
};

module.exports = config;
```

## TypeScript Declaration

`apps/mobile/src/types/svg.d.ts`

```typescript
declare module '*.svg' {
  import type { FunctionComponent } from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: FunctionComponent<SvgProps>;
  export default content;
}
```

Import the declaration from `tsconfig.json` via the `types` array (already set up).

## Rendering Example

Place SVG assets in `apps/mobile/assets/` and import them directly inside components:

```tsx
import MarketingLanding from '@/assets/MarketingLanding.svg';

export function Hero() {
  return (
    <MarketingLanding
      accessibilityRole="image"
      width="100%"
      height={312}
      preserveAspectRatio="xMidYMid meet"
      style={{ aspectRatio: 1200 / 1566 }}
    />
  );
}
```

The style ensures a 1200×1566 ratio while scaling responsively.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| **Metro throws about `fs`, `path`, etc.** | The guardrail blocked a Node builtin. Replace it with a browser/React Native friendly module or move logic to a server workspace. |
| **SVG renders blank.** | Confirm the SVG paths are valid and that the file uses absolute colors (no CSS). For complex assets, preprocess them through SVGO. |
| **TypeScript cannot find module '*.svg'.** | Ensure `apps/mobile/src/types/svg.d.ts` exists and that the `tsconfig.json` `typeRoots` includes `./src/types`. Restart the TS server after creating the declaration. |

For more help, refer to Expo's [SVG guide](https://docs.expo.dev/guides/using-svgs/).
