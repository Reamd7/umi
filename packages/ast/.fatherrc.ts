import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    output: 'lib',
    platform: 'node',
    transformer: "swc",
  },
})