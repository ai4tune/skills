#!/usr/bin/env node
/**
 * wechat-format: Markdown → WeChat-compatible HTML converter
 * 
 * Inspired by Raphael Publish (https://github.com/liuxiaopai-ai/raphael-publish)
 * 
 * Usage:
 *   node format.mjs < article.md                    # default theme (wechat)
 *   node format.mjs --theme=mac < article.md        # specify theme
 *   node format.mjs --theme=medium < article.md > output.html
 */

import MarkdownIt from 'markdown-it';
import { themes } from './themes.mjs';
import { readFileSync } from 'fs';

// --- Parse CLI args ---
const args = process.argv.slice(2);
let themeId = 'wechat';
let inputFile = null;

for (const arg of args) {
    if (arg.startsWith('--theme=')) {
        themeId = arg.split('=')[1];
    } else if (!arg.startsWith('--')) {
        inputFile = arg;
    }
}

// --- Read input ---
let markdown;
if (inputFile) {
    markdown = readFileSync(inputFile, 'utf-8');
} else if (!process.stdin.isTTY) {
    markdown = readFileSync(0, 'utf-8'); // read from stdin
} else {
    console.error('Usage: node format.mjs [--theme=wechat|mac|medium] [file.md]');
    console.error('  or:  cat article.md | node format.mjs --theme=mac');
    process.exit(1);
}

// --- Setup markdown-it ---
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
});

// --- Parse Markdown → HTML ---
const rawHtml = md.render(markdown);

// --- Apply theme (inline CSS to every element) ---
const theme = themes[themeId] || themes.wechat;
const style = theme.styles;

/**
 * Simple DOM-like inline CSS injector.
 * Since we don't have a real DOM in Node.js, we use regex-based
 * tag matching to inject inline styles. This is simpler and more
 * portable than importing jsdom.
 */
function applyInlineStyles(html, styles) {
    let result = html;

    // Map of tag names to their CSS styles
    const tagMap = {
        'h1': styles.h1,
        'h2': styles.h2,
        'h3': styles.h3,
        'h4': styles.h4,
        'h5': styles.h4, // reuse h4 style
        'h6': styles.h4,
        'p': styles.p,
        'ul': styles.ul,
        'ol': styles.ol,
        'li': styles.li,
        'blockquote': styles.blockquote,
        'pre': styles.pre,
        'hr': styles.hr,
        'img': styles.img,
        'table': styles.table,
        'th': styles.th,
        'td': styles.td,
        'tr': styles.tr,
        'a': styles.a,
    };

    // Apply styles to each tag type
    for (const [tag, css] of Object.entries(tagMap)) {
        if (!css) continue;

        // Handle self-closing tags (hr, img)
        if (tag === 'hr') {
            result = result.replace(/<hr\s*\/?>/gi, `<hr style="${css}" />`);
            continue;
        }
        if (tag === 'img') {
            result = result.replace(/<img\s/gi, `<img style="${css}" `);
            continue;
        }

        // Handle opening tags - inject style attribute
        const tagRegex = new RegExp(`<${tag}(\\s|>)`, 'gi');
        result = result.replace(tagRegex, (match, after) => {
            return `<${tag} style="${css}"${after}`;
        });
    }

    // Apply inline code style (but not code inside pre)
    if (styles.code) {
        // First, protect code inside pre blocks
        const preBlocks = [];
        result = result.replace(/<pre[\s>][\s\S]*?<\/pre>/gi, (match) => {
            preBlocks.push(match);
            return `__PRE_BLOCK_${preBlocks.length - 1}__`;
        });

        // Apply code style to inline code
        result = result.replace(/<code([\s>])/gi, `<code style="${styles.code}"$1`);

        // Restore pre blocks
        preBlocks.forEach((block, i) => {
            result = result.replace(`__PRE_BLOCK_${i}__`, block);
        });
    }

    // Apply strong/em styles
    if (styles.strong) {
        result = result.replace(/<strong([\s>])/gi, `<strong style="${styles.strong}"$1`);
    }
    if (styles.em) {
        result = result.replace(/<em([\s>])/gi, `<em style="${styles.em}"$1`);
    }

    return result;
}

/**
 * Make the HTML WeChat-compatible:
 * - Wrap in a section with container styles
 * - Force font inheritance on text elements
 * - Ensure list markers are visible
 */
function makeWeChatCompatible(html, styles) {
    let result = html;

    // Force list styles (WeChat often strips them)
    result = result.replace(/<ul\s/gi, (match) => {
        return match.replace(/style="([^"]*)"/, 'style="$1 list-style-type: disc !important; list-style-position: outside;"');
    });
    result = result.replace(/<ol\s/gi, (match) => {
        return match.replace(/style="([^"]*)"/, 'style="$1 list-style-type: decimal !important; list-style-position: outside;"');
    });

    // Wrap in section with container style
    result = `<section style="${styles.container}">\n${result}\n</section>`;

    return result;
}

// --- Process ---
const styledHtml = applyInlineStyles(rawHtml, style);
const wechatHtml = makeWeChatCompatible(styledHtml, style);

// --- Output ---
const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>公众号文章预览</title>
<style>
  body { margin: 0; padding: 20px; background: #f5f5f5; display: flex; justify-content: center; }
  section { max-width: 580px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
</style>
</head>
<body>
${wechatHtml}
</body>
</html>`;

console.log(fullHtml);
