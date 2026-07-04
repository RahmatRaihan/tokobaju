import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

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
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#000000',
    },
});
