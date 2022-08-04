# Laravel + vite + DDEV
Huge thanks to [Rob Thorne](https://github.com/torenware) for both figuring this out and creating the ddev vite-serve add-on! To get Vite and Laravel to work nicely with DDEV you must set up a few alternative things.

## Create a DDEV project
For this you can simply follow the [DDEV docs](https://ddev.readthedocs.io/en/stable/users/quickstart/) for a laravel project.
```
mkdir my-laravel-app
cd my-laravel-app
ddev config --project-type=laravel --docroot=public --create-docroot
ddev start
ddev composer create --prefer-dist laravel/laravel
ddev exec "cat .env.example | sed  -E 's/DB_(HOST|DATABASE|USERNAME|PASSWORD)=(.*)/DB_\1=db/g' > .env"
ddev exec 'sed -i "s#APP_URL=.*#APP_URL=${DDEV_PRIMARY_URL}#g" .env'
ddev exec "php artisan key:generate"
ddev launch
```
This will create a laravel boilerplate project in the my-laravel-app directory.
Next run a NPM install by doing `ddev npm i`

## Installing the vite-serve add-on
This is an [add-on to ddev created and maintained by torenware](https://github.com/torenware/ddev-viteserve) it creates a vite dev server on your container.
```
ddev get torenware/ddev-viteserve
ddev restart
ddev vite-serve start
```
In .ddev/.env change `VITE_PROJECT_DIR=frontend` to `VITE_PROJECT_DIR=.`

## Configure .ddev/config.yaml
We must add the `VITE_APP_URL` variable to your .env. The simplest way to do this is to add it to your .ddev/config.yaml.
```yaml
web_environment:
    - VITE_APP_URL=${DDEV_HOSTNAME}
```
This basically exposes the DDEV_HOSTNAME env variable to vite.

## Configure laravel

### vite.config.js
To make laravel talk to our vite dev server (created with the vite-serve add-on) we must alter the default vite.config.js
```
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
```
Besides the server settings you are free to alter this to your needs.

### Add the vite entrypoints
head over to your `welcome.blade.php` file and add `@vite(['resources/css/app.css', 'resources/js/app.js'])` to the `<head>`.

Restart your ddev.

Any changes to the app.js or app.css files will be reflected immediately.

**You do not need to run `npm run dev` ddev vite-serve will handle the HMR side of things**.
