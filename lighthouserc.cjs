module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: 'npm run start -- --hostname 127.0.0.1 --port 3000',
      startServerReadyPattern: 'Ready|Local',
      startServerReadyTimeout: 60000,
      url: [
        'http://127.0.0.1:3000/',
        'http://127.0.0.1:3000/ctem/',
        'http://127.0.0.1:3000/attack-surface-management/',
        'http://127.0.0.1:3000/open-source/',
        'http://127.0.0.1:3000/docs/',
      ],
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:seo': ['error', { minScore: 1 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }],
        canonical: 'error',
        'document-title': 'error',
        hreflang: 'error',
        'is-crawlable': 'error',
        'meta-description': 'error',
        'robots-txt': 'error',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
