const fs = require('fs');

function normalizeEnvValue(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];
  const hasMatchingQuotes =
    (quote === '"' || quote === "'") && trimmed.endsWith(quote) && trimmed.length >= 2;

  return hasMatchingQuotes ? trimmed.slice(1, -1) : trimmed;
}

function loadEnv(envPath) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};

    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;

      const key = trimmed.slice(0, idx).trim();
      env[key] = normalizeEnvValue(trimmed.slice(idx + 1));
    }

    return env;
  } catch {
    return {};
  }
}

module.exports = { loadEnv, normalizeEnvValue };
