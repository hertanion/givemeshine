import jsonPlugin from '@rollup/plugin-json';
import typescriptPlugin from 'rollup-plugin-typescript2';
import ShinePkg from './package.json';

import { tmpdir } from 'os';

const srcDir = `${__dirname}/src`;
const buildDir = `${__dirname}/build`;
const cacheRoot = `${tmpdir()}/.rpt2_cache`;

export default {
    input: `${__dirname}/src/shine.ts`,
    plugins: [
        jsonPlugin(),
        typescriptPlugin({
            cacheRoot,

            useTsconfigDeclarationDir: false,

            tsconfigOverride: {
                outDir: buildDir,
                rootDir: srcDir,
                include: [srcDir]
            }
        }),
    ],
    external: [
        ...Object.keys(ShinePkg.dependencies || {}),
        ...Object.keys(ShinePkg.peerDependencies || {}),
    ],
    output: [
        {
            file: `${__dirname}/build/shine.js`,
            format: 'cjs',
            exports: 'named'
        },
        {
            file: `${__dirname}/build/shine.mjs`,
            format: 'esm'
        }
    ]
};