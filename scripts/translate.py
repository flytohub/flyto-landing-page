#!/usr/bin/env python3
"""
Translate landing page HTML files using OpenAI API.
Usage: python translate.py [--lang zh] [--file index.html] [--all]
"""

import os
import re
import json
import argparse
from pathlib import Path
from openai import OpenAI

# Language configurations
LANGUAGES = {
    'zh': {'name': '繁體中文', 'code': 'zh-TW'},
    'ja': {'name': '日本語', 'code': 'ja'},
    'ko': {'name': '한국어', 'code': 'ko'},
    'de': {'name': 'Deutsch', 'code': 'de'},
    'es': {'name': 'Español', 'code': 'es'},
    'fr': {'name': 'Français', 'code': 'fr'},
    'it': {'name': 'Italiano', 'code': 'it'},
    'pt': {'name': 'Português', 'code': 'pt-BR'},
    'vi': {'name': 'Tiếng Việt', 'code': 'vi'},
    'id': {'name': 'Bahasa Indonesia', 'code': 'id'},
    'th': {'name': 'ไทย', 'code': 'th'},
    'tr': {'name': 'Türkçe', 'code': 'tr'},
    'pl': {'name': 'Polski', 'code': 'pl'},
    'hi': {'name': 'हिन्दी', 'code': 'hi'},
}

# HTML files to translate
HTML_FILES = [
    'index.html',
    'pricing.html',
    'product.html',
    'compare.html',
    'faq.html',
    'contact.html',
    'download.html',
    'use-cases.html',
    'about.html',
    'philosophy.html',
    'app.html',
    'blog.html',
    'buy-offline.html',
    'language-packs.html',
]

def extract_translatable_text(html_content):
    """Extract text content that needs translation from HTML."""
    # Pattern to match text inside tags (excluding script, style, etc.)
    # We'll extract text between > and < that contains actual content

    # List to store (original_text, context) tuples
    texts = []

    # Find all text content (simplified approach)
    # Match content between > and < that has actual text
    pattern = r'>([^<>]+)<'
    matches = re.findall(pattern, html_content)

    for match in matches:
        text = match.strip()
        # Skip empty, whitespace-only, or non-translatable content
        if not text:
            continue
        if text.isdigit():
            continue
        if len(text) < 3:
            continue
        # Skip if it's just symbols, numbers, or code-like content
        if re.match(r'^[\d\s\.\,\:\;\-\+\=\|\&\%\$\#\@\!\?\(\)\[\]\{\}\/\\\'\"]+$', text):
            continue
        # Skip CSS/JS content
        if '{' in text or '}' in text or ';' in text and ':' in text:
            continue
        # Skip URLs
        if text.startswith('http') or text.startswith('www.'):
            continue
        # Skip email
        if '@' in text and '.' in text:
            continue

        # Skip language names (they should stay in their native form)
        if text in ['English', 'Deutsch', 'Español', 'Français', 'Italiano', 'Português',
                    'Tiếng Việt', 'Bahasa Indonesia', 'Türkçe', 'Polski']:
            continue
        # Skip navigation/brand items that should stay in English
        if text in ['Flyto2 CLI', 'Flyto2', 'CLI', 'API', 'GitHub', 'Sign In', 'Sign Up',
                    'ZH', 'EN', 'JA', 'KO', 'DE', 'ES', 'FR', 'IT', 'PT', 'VI', 'ID', 'TH', 'TR', 'PL', 'HI']:
            continue
        # Skip meta content / title tags that are already handled
        if 'Flyto2 -' in text and 'Platform' in text:
            continue

        # Skip if already contains CJK characters (already translated)
        if re.search(r'[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]', text):
            continue
        # Skip GitHub/technical references
        if 'github.com' in text.lower() or 'flyto-core' in text.lower():
            continue
        # Skip copyright
        if 'Copyright' in text or '©' in text:
            continue

        # Check if it's English text (has Latin letters)
        if re.search(r'[a-zA-Z]{2,}', text):
            texts.append(text)

    # Remove duplicates while preserving order
    seen = set()
    unique_texts = []
    for t in texts:
        if t not in seen:
            seen.add(t)
            unique_texts.append(t)

    return unique_texts


def translate_batch(client, texts, target_lang, target_lang_name):
    """Translate a batch of texts using OpenAI."""
    if not texts:
        return {}

    # Create a numbered list for translation
    numbered_texts = "\n".join([f"{i+1}. {t}" for i, t in enumerate(texts)])

    prompt = f"""Translate the following English texts to {target_lang_name} ({target_lang}).

Rules:
1. Keep the same numbering format in your response
2. Translate naturally, not word-by-word
3. Keep brand names like "Flyto2" unchanged
4. Keep technical terms if they're commonly used in English in that language
5. For zh-TW (Traditional Chinese), use Traditional Chinese characters, not Simplified
6. Return ONLY the translations, one per line with the same numbering

Texts to translate:
{numbered_texts}"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a professional translator specializing in software and technology content."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
    )

    # Parse response
    translations = {}
    response_text = response.content[0].text if hasattr(response, 'content') else response.choices[0].message.content

    lines = response_text.strip().split('\n')
    for line in lines:
        # Match "1. translated text" format
        match = re.match(r'^(\d+)\.\s*(.+)$', line.strip())
        if match:
            idx = int(match.group(1)) - 1
            if 0 <= idx < len(texts):
                translations[texts[idx]] = match.group(2).strip()

    return translations


def translate_html_file(client, html_path, target_lang, target_lang_name, dry_run=False):
    """Translate a single HTML file."""
    print(f"\n{'='*60}")
    print(f"Processing: {html_path}")
    print(f"Target: {target_lang_name} ({target_lang})")
    print('='*60)

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Extract texts to translate
    texts = extract_translatable_text(html_content)
    print(f"Found {len(texts)} unique texts to translate")

    if not texts:
        print("No texts to translate!")
        return

    # Show sample
    print("\nSample texts to translate:")
    for t in texts[:5]:
        print(f"  - {t[:60]}{'...' if len(t) > 60 else ''}")

    if dry_run:
        print("\nAll texts to translate:")
        for i, t in enumerate(texts, 1):
            print(f"  {i}. {t}")
        print("\n[DRY RUN] Would translate these texts")
        return

    # Translate in batches of 50
    batch_size = 50
    all_translations = {}

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        print(f"\nTranslating batch {i//batch_size + 1}/{(len(texts)-1)//batch_size + 1} ({len(batch)} texts)...")

        translations = translate_batch(client, batch, target_lang, target_lang_name)
        all_translations.update(translations)
        print(f"  Translated {len(translations)} texts")

    # Replace texts in HTML
    translated_html = html_content
    replacements = 0

    for original, translated in all_translations.items():
        # Escape special regex characters
        escaped_original = re.escape(original)
        # Replace only within tag content (between > and <)
        pattern = f'(>\\s*){escaped_original}(\\s*<)'
        new_content = f'\\g<1>{translated}\\g<2>'

        new_html, count = re.subn(pattern, new_content, translated_html)
        if count > 0:
            translated_html = new_html
            replacements += count

    print(f"\nReplaced {replacements} text occurrences")

    # Save translated file
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(translated_html)

    print(f"Saved: {html_path}")

    return all_translations


def main():
    parser = argparse.ArgumentParser(description='Translate landing page HTML files')
    parser.add_argument('--lang', type=str, help='Target language code (e.g., zh, ja, ko)')
    parser.add_argument('--file', type=str, help='Specific file to translate (e.g., index.html)')
    parser.add_argument('--all', action='store_true', help='Translate all languages')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be translated without actually translating')
    args = parser.parse_args()

    # Check for API key
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key and not args.dry_run:
        print("Error: OPENAI_API_KEY environment variable not set")
        print("Set it with: export OPENAI_API_KEY='your-key-here'")
        return 1

    client = OpenAI(api_key=api_key) if api_key else None

    # Determine base path
    script_dir = Path(__file__).parent
    base_path = script_dir.parent

    # Determine which languages to process
    if args.all:
        langs = list(LANGUAGES.keys())
    elif args.lang:
        if args.lang not in LANGUAGES:
            print(f"Error: Unknown language '{args.lang}'")
            print(f"Available: {', '.join(LANGUAGES.keys())}")
            return 1
        langs = [args.lang]
    else:
        # Default to zh for testing
        langs = ['zh']

    # Determine which files to process
    if args.file:
        files = [args.file]
    else:
        files = HTML_FILES

    print(f"Languages: {langs}")
    print(f"Files: {files}")
    print(f"Dry run: {args.dry_run}")

    # Process each language and file
    for lang in langs:
        lang_info = LANGUAGES[lang]
        lang_dir = base_path / lang

        if not lang_dir.exists():
            print(f"Warning: Directory {lang_dir} does not exist, skipping")
            continue

        for filename in files:
            file_path = lang_dir / filename
            if not file_path.exists():
                print(f"Warning: File {file_path} does not exist, skipping")
                continue

            translate_html_file(
                client,
                file_path,
                lang_info['code'],
                lang_info['name'],
                dry_run=args.dry_run
            )

    print("\n" + "="*60)
    print("Translation complete!")
    print("="*60)
    return 0


if __name__ == '__main__':
    exit(main())
