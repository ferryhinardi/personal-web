import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function usePWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      wb.addEventListener('waiting', () => {
        wb.messageSkipWaiting();
      });

      wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      wb.register()
        .then(() => wb.update())
        .catch((error) => {
          console.warn('PWA registration failed:', error);
        });
    }
  }, []);
}
