import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
    //Load the env variables that are prefixed with VITE_
    const env = loadEnv(mode, process.cwd(), '')
    return {
        server: {
            hmr: {
                protocol: 'wss',
                host: env.VITE_APP_URL,
            },
        },
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js'],
                refresh: true,
            }),
        ],
    }
})
