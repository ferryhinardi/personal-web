import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function usePWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          // Show update notification
          if (window.confirm('New version available! Reload to update?')) {
            window.location.reload();
          }
        }
      });

      wb.addEventListener('waiting', () => {
        wb.messageSkipWaiting();
      });

      wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      wb.register()
        .then(() => {
          console.log('✅ Service Worker registered successfully');
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    }
  }, []);
}
