import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')
    console.log(mode)
    console.log(env.DDEV_HOSTNAME)
    return {
        server: {
          host: '0.0.0.0',
            base: env.DDEV_HOSTNAME,
        },
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js'],
                refresh: true,
            }),
        ],
        // vite config
        define: {
            __APP_ENV__: env.APP_URL
        }
    }
})
