#!/usr/bin/env node

/**
 * parse-resume.mjs — 简历文件文本提取工具
 *
 * 支持 PDF (.pdf) 和 Word (.docx) 格式
 * 输出纯文本到 stdout，供 LLM 后续分析
 *
 * 用法：node parse-resume.mjs <文件路径>
 */

import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

async function parsePDF(buffer) {
  const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
  const data = await pdfParse(buffer);
  return data.text;
}

async function parseDocx(buffer) {
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error('用法: node parse-resume.mjs <简历文件路径>');
    console.error('支持格式: .pdf, .docx');
    process.exit(1);
  }

  const absPath = resolve(filePath);
  const ext = extname(absPath).toLowerCase();

  let buffer;
  try {
    buffer = await readFile(absPath);
  } catch (err) {
    console.error(`❌ 无法读取文件: ${absPath}`);
    console.error(`   ${err.message}`);
    process.exit(1);
  }

  let text;
  try {
    switch (ext) {
      case '.pdf':
        text = await parsePDF(buffer);
        break;
      case '.docx':
        text = await parseDocx(buffer);
        break;
      case '.doc':
        console.error('⚠️ 不支持 .doc 格式（旧版 Word），请转换为 .docx 或 .pdf');
        process.exit(1);
        break;
      default:
        console.error(`⚠️ 不支持的文件格式: ${ext}`);
        console.error('   支持: .pdf, .docx');
        process.exit(1);
    }
  } catch (err) {
    console.error(`❌ 解析失败: ${err.message}`);
    process.exit(1);
  }

  // 清理文本：去除多余空行，保留结构
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (cleaned.length < 50) {
    console.error('⚠️ 提取的文本过短（少于 50 字符），文件可能是扫描件或图片格式。');
    console.error('   建议：提供 Word 版本或直接粘贴简历文本。');
    process.exit(1);
  }

  console.log(cleaned);
}

main().catch(err => {
  console.error(`❌ 未知错误: ${err.message}`);
  process.exit(1);
});
