import path from 'path';
import { build } from 'vite';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const packageJSON = JSON.parse(await fs.readFile('package.json', 'utf-8'));
const VALID_NAME = /^[a-zA-Z0-9_-]+$/;
if (!VALID_NAME.test(packageJSON.name)) {
    throw new Error('Please use valid name for the CLI in your package.json. Satisfying the constraint: ' + VALID_NAME);
}

// https://vitejs.dev/config/
await build({
    build: {
        lib: {
            entry: path.resolve('src/main.ts'),
            fileName: (_format) => 'cli.cjs',
            formats: ['cjs'],
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: Object.keys(packageJSON.dependencies),
            output: {
                dir: 'build',
            },
        },
    },
});

// create execution wrapper
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runFile = path.join(__dirname, 'run.cjs');
const binDir = path.resolve('./build/bin');
const binFile = path.join(binDir, packageJSON.name);
await fs.mkdir(binDir, { recursive: true });
await fs.cp(runFile, binFile);
await fs.chmod(binFile, '744');

if (!process.env.PATH.split(':').includes(binDir)) console.log(`
To make the CLI ${packageJSON.name} globally accessible, you have to run this:
PATH="${binDir}:$PATH"`);