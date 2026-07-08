import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ConfirmProvider } from '@/components/ConfirmDialog';
import { SplashScreen } from '@/components/SplashScreen';

const appName = import.meta.env.VITE_APP_NAME || 'INSKYLXSTR';

// Turn unexpected server errors (500, 413, etc.) into a readable message
// instead of Inertia's blank error modal. 419 = session/CSRF expired.
router.on('invalid', (event) => {
    const status = event.detail.response?.status;
    if (status === 419) {
        event.preventDefault();
        alert('Your session expired. The page will reload — please try again.');
        window.location.reload();
    } else if (status && status >= 500) {
        event.preventDefault();
        alert('Something went wrong on the server. Please try again — if it keeps happening, the file may be too large.');
    } else if (status === 413) {
        event.preventDefault();
        alert('That file is too large. Please upload a smaller image.');
    }
});

createInertiaApp({
    // Storefront tabs read just "INSKYLXSTR"; admin pages keep their page name so
    // several open admin tabs stay tellable apart.
    title: (title) => (title?.startsWith('Admin') ? `${title} — ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <ConfirmProvider>
                <SplashScreen />
                <App {...props} />
            </ConfirmProvider>,
        );
    },
    progress: {
        color: '#000000',
    },
});
