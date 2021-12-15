import babel from "@rollup/plugin-babel";

const input = './js/index.js';

export default [
    {
        input,
        plugins: [
            babel({
                babelHelpers: 'bundled'
            })
        ],
        output: {
            format: 'umd',
            name: 'HEvent',
            file: './dist/3h-event.umd.js'
        }
    },
    {
        input,
        output: {
            format: 'esm',
            file: './dist/3h-event.js'
        }
    }
];
