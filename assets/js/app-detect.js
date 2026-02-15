/**
 * Flyto App Detection & Smart Launcher
 *
 * Detects available Flyto environments:
 * 1. Local web server (local.flyto2.com / localhost)
 * 2. Desktop app (flyto:// protocol) — future
 * 3. Cloud (always available)
 */

const FlytoDetect = (() => {
  const CONFIG = {
    LOCAL_ORIGINS: [
      'https://local.flyto2.com',
      'https://local.flyto2.com:3000',
      'http://local.flyto2.com:3000',
      'https://localhost:3000',
      'http://localhost:3000',
    ],
    CLOUD_URL: 'https://app.flyto2.com',
    HEALTH_PATH: '/api/health',
    DETECT_TIMEOUT: 2500,
    PROTOCOL: 'flyto',
  };

  /** @returns {Promise<{available: boolean, url: string, version: string}>} */
  async function detectLocalServer() {
    for (const origin of CONFIG.LOCAL_ORIGINS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), CONFIG.DETECT_TIMEOUT);

        const res = await fetch(origin + CONFIG.HEALTH_PATH, {
          signal: controller.signal,
          mode: 'cors',
          cache: 'no-store',
        });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          return { available: true, url: origin, version: data.version || '' };
        }
      } catch {
        // Try next origin
      }
    }

    // Fallback: no-cors mode (can detect "something is listening" but can't read response)
    for (const origin of CONFIG.LOCAL_ORIGINS) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), CONFIG.DETECT_TIMEOUT);

        await fetch(origin + CONFIG.HEALTH_PATH, {
          signal: controller.signal,
          mode: 'no-cors',
          cache: 'no-store',
        });
        clearTimeout(timer);

        // If we got here without throwing, something is listening
        return { available: true, url: origin, version: '' };
      } catch {
        // Connection refused = nothing listening
      }
    }

    return { available: false, url: CONFIG.LOCAL_ORIGINS[0], version: '' };
  }

  /**
   * Detect desktop app via custom protocol.
   * Uses hidden iframe + blur detection.
   * @returns {Promise<boolean>}
   */
  function detectDesktopApp() {
    return new Promise((resolve) => {
      // Skip if no protocol registered (most users won't have this yet)
      const timeout = setTimeout(() => {
        cleanup();
        resolve(false);
      }, 2500);

      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'display:none;width:0;height:0;border:0;';
      iframe.src = CONFIG.PROTOCOL + '://ping';

      function onBlur() {
        clearTimeout(timeout);
        cleanup();
        resolve(true);
      }

      function cleanup() {
        window.removeEventListener('blur', onBlur);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }

      window.addEventListener('blur', onBlur);
      document.body.appendChild(iframe);
    });
  }

  /**
   * Run all detections in parallel.
   * @returns {Promise<{local: object, desktop: boolean, cloud: string}>}
   */
  async function detectAll() {
    const [local, desktop] = await Promise.all([
      detectLocalServer(),
      // Desktop detection can cause focus issues, only run if explicitly requested
      Promise.resolve(false),
    ]);

    return {
      local,
      desktop,
      cloud: CONFIG.CLOUD_URL,
    };
  }

  return {
    CONFIG,
    detectLocalServer,
    detectDesktopApp,
    detectAll,
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlytoDetect;
}
