type ServiceWorkerNavigator = Pick<Navigator, "serviceWorker">;
type ServiceWorkerWindow = Pick<Window, "addEventListener"> & {
  navigator: ServiceWorkerNavigator;
};

/**
 * Register the minimal installability service worker in production builds.
 * No-op in dev (avoids touching dev assets) and where service workers are
 * unsupported. Never throws: registration failure only disables installation.
 */
export function registerServiceWorker(
  target: ServiceWorkerWindow = window,
  isProduction: boolean = import.meta.env.PROD,
): void {
  if (!isProduction) return;
  if (!("serviceWorker" in target.navigator)) return;
  target.navigator.serviceWorker.register("/sw.js").catch(() => {
    // Installability is best-effort; the app works the same without it.
  });
}
