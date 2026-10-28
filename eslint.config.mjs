import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  { files: ['src/context/cart-context.tsx'], rules: { 'react-hooks/set-state-in-effect': 'off' } },
];

export default config;
