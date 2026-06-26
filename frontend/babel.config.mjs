export default function createBabelConfig(api) {
    api.cache(true);

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        components: './components',
                        constants: './constants',
                        lib: './lib',
                        screens: './screens'
                    },
                    extensions: [
                        '.ios.ts',
                        '.ios.tsx',
                        '.android.ts',
                        '.android.tsx',
                        '.native.ts',
                        '.native.tsx',
                        '.web.ts',
                        '.web.tsx',
                        '.ts',
                        '.tsx'
                    ],
                    root: ['./']
                }
            ]
        ]
    };
}
