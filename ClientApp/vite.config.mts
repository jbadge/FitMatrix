import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
// import checker from 'vite-plugin-checker'

import { EsLinter, linterPlugin } from 'vite-plugin-linter'
// import react from '@vitejs/plugin-react'
// import path from 'path'

export default defineConfig((configEnv) => ({
  plugins: [
    reactRefresh(),
    // checker({
    // TypeScript config
    // typescript: { tsconfigPath: './tsconfig.json' },
    // }),
    // react(),
    linterPlugin({
      build: {
        disable: true,
      },
      include: ['./src/**/*.ts', './src/**/*.tsx'],
      linters: [
        new EsLinter({
          configEnv: configEnv,
          serveOptions: { cache: false, formatter: 'visualstudio' },
        }),
      ],
    }),
  ],
  server: {
    port: 3000,
    WDS_SOCKET_PORT: 0,
    hmr: {
      port: 3000, // Ensure HMR is set to the correct port
      protocol: 'ws', // Use 'wss' if serving over HTTPS
    },
  },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
}))
