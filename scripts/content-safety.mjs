const HTML_ENTITIES = Object.freeze({
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
});

export function decodeHtmlEntities(value) {
  return String(value ?? '')
    .replace(/&(?:quot|#x27|#39|amp|lt|gt);/gi, (entity) => HTML_ENTITIES[entity.toLowerCase()])
    .trim();
}

function isTagNameBoundary(character) {
  return character === undefined || character === '>' || character === '/' || /\s/.test(character);
}

function findTagStart(lowerValue, token, fromIndex) {
  let candidate = lowerValue.indexOf(token, fromIndex);
  while (candidate !== -1) {
    if (isTagNameBoundary(lowerValue[candidate + token.length])) return candidate;
    candidate = lowerValue.indexOf(token, candidate + token.length);
  }
  return -1;
}

function removeRawTextElements(value, tagName) {
  const lowerValue = value.toLowerCase();
  const openToken = `<${tagName}`;
  const closeToken = `</${tagName}`;
  let cursor = 0;
  let output = '';

  while (cursor < value.length) {
    const openStart = findTagStart(lowerValue, openToken, cursor);
    if (openStart === -1) return output + value.slice(cursor);

    output += `${value.slice(cursor, openStart)} `;
    const closeStart = findTagStart(lowerValue, closeToken, openStart + openToken.length);
    if (closeStart === -1) return output;

    const closeEnd = value.indexOf('>', closeStart + closeToken.length);
    if (closeEnd === -1) return output;
    cursor = closeEnd + 1;
  }

  return output;
}

function removeMarkupTags(value) {
  let output = '';
  let insideTag = false;
  for (const character of value) {
    if (!insideTag && character === '<') {
      insideTag = true;
      output += ' ';
    } else if (insideTag && character === '>') {
      insideTag = false;
    } else if (!insideTag) {
      output += character;
    }
  }
  return output;
}

export function htmlToText(value) {
  const withoutScripts = removeRawTextElements(String(value ?? ''), 'script');
  const withoutStyles = removeRawTextElements(withoutScripts, 'style');
  return decodeHtmlEntities(removeMarkupTags(withoutStyles).replace(/\s+/g, ' '));
}

function httpUrl(value) {
  try {
    const parsed = new URL(String(value ?? ''));
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed : null;
  } catch {
    return null;
  }
}

export function isInternalSiteLink(value, siteOrigin) {
  const link = String(value ?? '');
  if (link.startsWith('/')) return true;
  const parsedLink = httpUrl(link);
  const parsedSite = httpUrl(siteOrigin);
  return Boolean(parsedLink && parsedSite && parsedLink.origin === parsedSite.origin);
}

export function isExternalHttpLink(value, siteOrigin) {
  const parsedLink = httpUrl(value);
  const parsedSite = httpUrl(siteOrigin);
  return Boolean(parsedLink && parsedSite && parsedLink.origin !== parsedSite.origin);
}

export function escapeMarkdownCell(value, whitespacePattern = /\s+/g) {
  return String(value ?? '')
    .replace(/[\\|]/g, (character) => (character === '\\' ? '\\\\' : '\\|'))
    .replace(whitespacePattern, ' ')
    .trim();
}
