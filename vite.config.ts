import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    /*
     * O nome do segundo elemento do array environmentMatchGlobs ("prisma"), deve ser exatament o nome ao final de vitest-environmemnt-[name]
     * Nesse caso, vitest-environment-prisma
     */
    environmentMatchGlobs: [['src/infra/http/controllers/**', 'prisma']],
  },
});
