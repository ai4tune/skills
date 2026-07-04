#!/usr/bin/env node

/**
 * generate-report-pdf.mjs — 简历分析报告 PDF 生成工具
 *
 * 接收 JSON 格式的分析数据（通过 stdin），生成排版精美的 PDF 报告。
 *
 * 用法：echo '<JSON数据>' | node generate-report-pdf.mjs <输出PDF路径>
 *   或：node generate-report-pdf.mjs <输出PDF路径> < data.json
 */

import PDFDocument from 'pdfkit';
import { createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// ─── 颜色主题 ────────────────────────────────────────────────
const COLORS = {
  primary: '#1A56DB',      // 深蓝 - 主色
  primaryLight: '#E1EFFE',  // 浅蓝 - 背景
  accent: '#7C3AED',       // 紫色 - 强调
  success: '#059669',      // 绿色
  warning: '#D97706',      // 橙色
  danger: '#DC2626',       // 红色
  dark: '#111827',         // 深色文字
  body: '#374151',         // 正文
  muted: '#6B7280',        // 辅助文字
  light: '#F3F4F6',        // 浅灰背景
  border: '#E5E7EB',       // 边框
  white: '#FFFFFF',
  headerBg: '#1E3A5F',     // 深蓝色 header 背景
  scoreBg: '#F0F9FF',      // 评分区域背景
};

// ─── 字体路径（macOS 系统字体，优先使用支持中文的 TTF）────────
const FONT_CANDIDATES = [
  // macOS 上支持 CJK 的 TTF 字体（优先级从高到低）
  '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
  '/System/Library/Fonts/Supplemental/Songti.ttc',
  '/System/Library/Fonts/STHeiti Light.ttc',
  '/System/Library/Fonts/PingFang.ttc',
  // Linux 常见中文字体
  '/usr/share/fonts/truetype/wqy/wqy-microhei.ttc',
  '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
];

// ─── 辅助函数 ────────────────────────────────────────────────

function getScoreColor(score, maxScore) {
  const ratio = score / maxScore;
  if (ratio >= 0.8) return COLORS.success;
  if (ratio >= 0.6) return COLORS.primary;
  if (ratio >= 0.4) return COLORS.warning;
  return COLORS.danger;
}

function getMatchColor(percent) {
  if (percent >= 80) return COLORS.success;
  if (percent >= 60) return COLORS.primary;
  if (percent >= 40) return COLORS.warning;
  return COLORS.danger;
}

function getStarString(rating, maxRating) {
  return '★'.repeat(rating) + '☆'.repeat(maxRating - rating);
}

// ─── PDF 生成类 ───────────────────────────────────────────────

class ResumeReportPDF {
  constructor(outputPath) {
    this.outputPath = outputPath;
    this.doc = new PDFDocument({
      size: 'A4',
      margins: { top: 60, bottom: 60, left: 50, right: 50 },
      bufferPages: true,
      info: {
        Title: '简历分析报告',
        Author: 'Resume Analyzer',
        Creator: 'Resume Analyzer Skill',
      },
    });
    this.pageWidth = 595.28;
    this.pageHeight = 841.89;
    this.contentWidth = this.pageWidth - 100; // 50 left + 50 right
    this.pageNum = 0;
    this.currentY = 60;

    // 尝试加载中文字体
    this.fontRegular = 'Helvetica';
    this.fontBold = 'Helvetica-Bold';

    for (const fontPath of FONT_CANDIDATES) {
      try {
        if (!existsSync(fontPath)) continue;
        this.doc.registerFont('zh-regular', fontPath);
        this.doc.registerFont('zh-bold', fontPath);
        this.fontRegular = 'zh-regular';
        this.fontBold = 'zh-bold';
        break;
      } catch {
        continue;
      }
    }
  }

  // ─── 核心辅助方法 ──────────────────────────────

  ensureSpace(needed) {
    if (this.currentY + needed > this.pageHeight - 80) {
      this.doc.addPage();
      this.currentY = 60;
    }
  }

  drawPageFooter() {
    const pages = this.doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      this.doc.switchToPage(i);
      // 底部分隔线
      this.doc
        .strokeColor(COLORS.border)
        .lineWidth(0.5)
        .moveTo(50, this.pageHeight - 45)
        .lineTo(this.pageWidth - 50, this.pageHeight - 45)
        .stroke();
      // 页码
      this.doc
        .font(this.fontRegular)
        .fontSize(8)
        .fillColor(COLORS.muted)
        .text(
          `第 ${i + 1} / ${pages.count} 页`,
          0,
          this.pageHeight - 35,
          { align: 'center', width: this.pageWidth }
        );
      // 底部信息
      this.doc
        .text(
          'Resume Analyzer · 简历分析报告',
          50,
          this.pageHeight - 35,
          { align: 'left' }
        );
    }
  }

  drawSectionTitle(title, icon = '') {
    this.ensureSpace(50);
    const label = icon ? `${icon}  ${title}` : title;

    // 左侧色条
    this.doc
      .rect(50, this.currentY, 4, 24)
      .fill(COLORS.primary);
    // 底部线条
    this.doc
      .strokeColor(COLORS.primaryLight)
      .lineWidth(1)
      .moveTo(50, this.currentY + 30)
      .lineTo(50 + this.contentWidth, this.currentY + 30)
      .stroke();
    // 标题文字
    this.doc
      .font(this.fontBold)
      .fontSize(15)
      .fillColor(COLORS.dark)
      .text(label, 62, this.currentY + 3, { width: this.contentWidth - 12 });

    this.currentY += 42;
  }

  drawSubTitle(title) {
    this.ensureSpace(30);
    this.doc
      .font(this.fontBold)
      .fontSize(11)
      .fillColor(COLORS.primary)
      .text(title, 56, this.currentY, { width: this.contentWidth - 6 });
    this.currentY += 20;
  }

  drawText(text, options = {}) {
    const {
      fontSize = 10,
      color = COLORS.body,
      indent = 56,
      bold = false,
      lineGap = 4,
    } = options;

    this.doc
      .font(bold ? this.fontBold : this.fontRegular)
      .fontSize(fontSize)
      .fillColor(color);

    const textHeight = this.doc.heightOfString(text, {
      width: this.contentWidth - (indent - 50) - 6,
      lineGap,
    });

    this.ensureSpace(textHeight + 6);

    this.doc.text(text, indent, this.currentY, {
      width: this.contentWidth - (indent - 50) - 6,
      lineGap,
    });

    this.currentY += textHeight + 6;
  }

  drawBulletItem(text, bulletChar = '•', options = {}) {
    const { color = COLORS.body, indent = 64 } = options;
    this.ensureSpace(20);
    this.doc
      .font(this.fontRegular)
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text(bulletChar, indent - 10, this.currentY);

    const textHeight = this.doc.heightOfString(text, {
      width: this.contentWidth - (indent - 50) - 6,
      lineGap: 3,
    });

    this.doc
      .fillColor(color)
      .text(text, indent, this.currentY, {
        width: this.contentWidth - (indent - 50) - 6,
        lineGap: 3,
      });
    this.currentY += textHeight + 4;
  }

  drawScoreBar(label, score, maxScore, comment, y) {
    const barX = 160;
    const barWidth = 200;
    const barHeight = 12;
    const scoreColor = getScoreColor(score, maxScore);

    // 标签
    this.doc
      .font(this.fontRegular)
      .fontSize(10)
      .fillColor(COLORS.dark)
      .text(label, 56, y + 1, { width: 100 });

    // 背景条
    this.doc
      .roundedRect(barX, y, barWidth, barHeight, 6)
      .fill(COLORS.light);

    // 得分条
    const fillWidth = (score / maxScore) * barWidth;
    if (fillWidth > 0) {
      this.doc
        .roundedRect(barX, y, Math.max(fillWidth, 12), barHeight, 6)
        .fill(scoreColor);
    }

    // 分数
    this.doc
      .font(this.fontBold)
      .fontSize(10)
      .fillColor(scoreColor)
      .text(`${score}/${maxScore}`, barX + barWidth + 10, y + 1, { width: 40 });

    // 评语
    this.doc
      .font(this.fontRegular)
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(comment || '', barX + barWidth + 55, y + 1, { width: 180 });
  }

  drawTable(headers, rows, options = {}) {
    const {
      colWidths = null,
      headerBg = COLORS.headerBg,
      headerColor = COLORS.white,
      rowHeight = 28,
      headerHeight = 30,
      fontSize = 9,
    } = options;

    const totalWidth = this.contentWidth;
    const cols = headers.length;
    const widths = colWidths || headers.map(() => totalWidth / cols);
    const tableHeight = headerHeight + rows.length * rowHeight;

    this.ensureSpace(tableHeight + 10);

    let x = 50;

    // 表头背景
    this.doc
      .rect(x, this.currentY, totalWidth, headerHeight)
      .fill(headerBg);

    // 表头文字
    let cellX = x;
    headers.forEach((header, i) => {
      this.doc
        .font(this.fontBold)
        .fontSize(fontSize)
        .fillColor(headerColor)
        .text(header, cellX + 8, this.currentY + 8, {
          width: widths[i] - 16,
          align: 'left',
        });
      cellX += widths[i];
    });

    this.currentY += headerHeight;

    // 数据行
    rows.forEach((row, rowIdx) => {
      const bgColor = rowIdx % 2 === 0 ? COLORS.white : COLORS.light;
      this.doc.rect(x, this.currentY, totalWidth, rowHeight).fill(bgColor);

      // 行边框
      this.doc
        .strokeColor(COLORS.border)
        .lineWidth(0.5)
        .moveTo(x, this.currentY + rowHeight)
        .lineTo(x + totalWidth, this.currentY + rowHeight)
        .stroke();

      cellX = x;
      row.forEach((cell, i) => {
        this.doc
          .font(this.fontRegular)
          .fontSize(fontSize)
          .fillColor(COLORS.body)
          .text(String(cell || ''), cellX + 8, this.currentY + 7, {
            width: widths[i] - 16,
            align: 'left',
            ellipsis: true,
            height: rowHeight - 8,
          });
        cellX += widths[i];
      });

      this.currentY += rowHeight;
    });

    this.currentY += 10;
  }

  drawKVPair(key, value) {
    this.ensureSpace(20);
    this.doc
      .font(this.fontBold)
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text(`${key}：`, 64, this.currentY, { continued: true, width: this.contentWidth - 20 })
      .font(this.fontRegular)
      .fillColor(COLORS.dark)
      .text(String(value || '—'));
    this.currentY += 18;
  }

  drawDivider() {
    this.currentY += 6;
    this.doc
      .strokeColor(COLORS.border)
      .lineWidth(0.5)
      .moveTo(50, this.currentY)
      .lineTo(50 + this.contentWidth, this.currentY)
      .stroke();
    this.currentY += 12;
  }

  drawHighlightBox(text, bgColor = COLORS.scoreBg, textColor = COLORS.primary) {
    this.ensureSpace(40);
    const boxHeight = 36;
    this.doc
      .roundedRect(50, this.currentY, this.contentWidth, boxHeight, 6)
      .fill(bgColor);
    this.doc
      .font(this.fontBold)
      .fontSize(14)
      .fillColor(textColor)
      .text(text, 50, this.currentY + 10, {
        width: this.contentWidth,
        align: 'center',
      });
    this.currentY += boxHeight + 10;
  }

  drawMatchBar(label, percent, analysis, y) {
    const barX = 150;
    const barWidth = 160;
    const barHeight = 12;
    const pctColor = getMatchColor(percent);

    this.doc
      .font(this.fontRegular)
      .fontSize(10)
      .fillColor(COLORS.dark)
      .text(label, 56, y + 1, { width: 90 });

    this.doc
      .roundedRect(barX, y, barWidth, barHeight, 6)
      .fill(COLORS.light);

    const fillWidth = (percent / 100) * barWidth;
    if (fillWidth > 0) {
      this.doc
        .roundedRect(barX, y, Math.max(fillWidth, 12), barHeight, 6)
        .fill(pctColor);
    }

    this.doc
      .font(this.fontBold)
      .fontSize(10)
      .fillColor(pctColor)
      .text(`${percent}%`, barX + barWidth + 8, y + 1, { width: 40 });

    this.doc
      .font(this.fontRegular)
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(analysis || '', barX + barWidth + 50, y + 1, { width: 180 });
  }

  // ─── 各章节渲染 ──────────────────────────────

  renderCover(data) {
    // 顶部装饰条
    this.doc
      .rect(0, 0, this.pageWidth, 200)
      .fill(COLORS.headerBg);

    // 装饰线
    this.doc
      .rect(0, 196, this.pageWidth, 4)
      .fill(COLORS.primary);

    // 标题
    this.doc
      .font(this.fontBold)
      .fontSize(32)
      .fillColor(COLORS.white)
      .text('简历分析报告', 0, 70, {
        width: this.pageWidth,
        align: 'center',
      });

    // 副标题
    this.doc
      .font(this.fontRegular)
      .fontSize(13)
      .fillColor('#B0C4DE')
      .text('Resume Analysis Report', 0, 115, {
        width: this.pageWidth,
        align: 'center',
      });

    // 候选人名字
    const name = data.basicInfo?.name || '候选人';
    this.currentY = 260;
    this.doc
      .font(this.fontBold)
      .fontSize(22)
      .fillColor(COLORS.dark)
      .text(name, 0, this.currentY, {
        width: this.pageWidth,
        align: 'center',
      });
    this.currentY += 40;

    // 信息行
    const infoItems = [];
    if (data.basicInfo?.currentPosition) infoItems.push(data.basicInfo.currentPosition);
    if (data.basicInfo?.company) infoItems.push(`@ ${data.basicInfo.company}`);
    if (infoItems.length) {
      this.doc
        .font(this.fontRegular)
        .fontSize(12)
        .fillColor(COLORS.muted)
        .text(infoItems.join('  '), 0, this.currentY, {
          width: this.pageWidth,
          align: 'center',
        });
      this.currentY += 30;
    }

    // 分隔链
    this.doc
      .strokeColor(COLORS.border)
      .lineWidth(1)
      .moveTo(this.pageWidth / 2 - 60, this.currentY)
      .lineTo(this.pageWidth / 2 + 60, this.currentY)
      .stroke();
    this.currentY += 25;

    // 生成时间
    const now = new Date();
    const dateStr = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日`;
    this.doc
      .font(this.fontRegular)
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text(`报告生成日期：${dateStr}`, 0, this.currentY, {
        width: this.pageWidth,
        align: 'center',
      });
    this.currentY += 20;

    // 综合评分预览
    if (data.scoring) {
      this.currentY += 30;
      const rating = data.scoring.rating || '';
      const total = data.scoring.total || 0;
      this.doc
        .roundedRect(this.pageWidth / 2 - 120, this.currentY, 240, 80, 10)
        .fill(COLORS.scoreBg);
      this.doc
        .font(this.fontBold)
        .fontSize(36)
        .fillColor(COLORS.primary)
        .text(`${total}/40`, 0, this.currentY + 12, {
          width: this.pageWidth,
          align: 'center',
        });
      this.doc
        .font(this.fontRegular)
        .fontSize(11)
        .fillColor(COLORS.muted)
        .text(`综合评分  ${rating}`, 0, this.currentY + 55, {
          width: this.pageWidth,
          align: 'center',
        });
    }

    // 新页开始正文
    this.doc.addPage();
    this.currentY = 60;
  }

  renderBasicInfo(data) {
    if (!data.basicInfo) return;
    const info = data.basicInfo;

    this.drawSectionTitle('基本信息', '👤');

    const pairs = [
      ['姓名', info.name],
      ['年龄', info.age],
      ['学历', info.education],
      ['当前职位', info.currentPosition],
      ['所在公司', info.company],
      ['工作年限', info.yearsOfExperience ? `${info.yearsOfExperience} 年` : null],
    ];
    pairs.forEach(([k, v]) => { if (v) this.drawKVPair(k, v); });

    // 技能
    if (data.skills) {
      this.currentY += 4;
      if (data.skills.core?.length) this.drawKVPair('核心技能', data.skills.core.join('、'));
      if (data.skills.tools?.length) this.drawKVPair('工具/框架', data.skills.tools.join('、'));
      if (data.skills.languages?.length) this.drawKVPair('语言能力', data.skills.languages.join('、'));
    }

    // 职业轨迹
    if (data.career?.length) {
      this.currentY += 6;
      this.drawSubTitle('💼 职业轨迹');
      data.career.forEach((c, i) => {
        const line = `${c.company}（${c.period}）— ${c.title}`;
        this.drawBulletItem(line, `${i + 1}.`);
        if (c.achievement) {
          this.drawText(`  ${c.achievement}`, { fontSize: 9, color: COLORS.muted, indent: 78 });
        }
      });
    }

    // 教育
    if (data.education?.length) {
      this.currentY += 4;
      this.drawSubTitle('🎓 教育背景');
      data.education.forEach((e) => {
        this.drawBulletItem(`${e.school} — ${e.major} — ${e.degree}`);
      });
    }

    // 证书
    if (data.certifications?.length) {
      this.currentY += 4;
      this.drawSubTitle('📜 证书/荣誉');
      data.certifications.forEach((c) => {
        this.drawBulletItem(c);
      });
    }

    this.currentY += 8;
  }

  renderScoring(data) {
    if (!data.scoring) return;
    const scoring = data.scoring;

    this.drawSectionTitle('多维评分', '📊');

    // 综合分数高亮框
    const totalColor = getScoreColor(scoring.total, 40);
    this.drawHighlightBox(
      `综合评分：${scoring.total}/40    ${scoring.rating || ''}    ${scoring.suggestion || ''}`,
      COLORS.scoreBg,
      totalColor
    );

    // 各维度评分条
    if (scoring.dimensions?.length) {
      scoring.dimensions.forEach((dim) => {
        this.ensureSpace(24);
        this.drawScoreBar(dim.name, dim.score, dim.maxScore || 10, dim.comment, this.currentY);
        this.currentY += 24;
      });
    }

    this.currentY += 10;
  }

  renderStrengthsWeaknesses(data) {
    if (!data.strengths && !data.weaknesses && !data.improvements) return;

    this.drawSectionTitle('优势与劣势分析', '⚖️');

    if (data.strengths?.length) {
      this.drawSubTitle('✅ 核心优势');
      data.strengths.forEach((s, i) => {
        this.drawBulletItem(`${s.description}`, `${i + 1}.`);
        if (s.evidence) {
          this.drawText(`← 证据："${s.evidence}"`, { fontSize: 9, color: COLORS.muted, indent: 78 });
        }
      });
    }

    if (data.weaknesses?.length) {
      this.currentY += 4;
      this.drawSubTitle('⚠️ 潜在不足');
      data.weaknesses.forEach((w, i) => {
        this.drawBulletItem(`${w.description}`, `${i + 1}.`);
        if (w.evidence) {
          this.drawText(`← 依据："${w.evidence}"`, { fontSize: 9, color: COLORS.muted, indent: 78 });
        }
      });
    }

    if (data.improvements?.length) {
      this.currentY += 4;
      this.drawSubTitle('💡 改进建议');
      data.improvements.forEach((item, i) => {
        this.drawBulletItem(item, `${i + 1}.`);
      });
    }

    this.currentY += 8;
  }

  renderPersonality(data) {
    if (!data.personality) return;
    const p = data.personality;

    this.drawSectionTitle('大五人格特质推断', '🧠');

    // 免责声明
    if (p.disclaimer) {
      this.ensureSpace(40);
      this.doc
        .roundedRect(56, this.currentY, this.contentWidth - 12, 32, 4)
        .fill('#FFF7ED');
      this.doc
        .font(this.fontRegular)
        .fontSize(8)
        .fillColor(COLORS.warning)
        .text(`⚠️ ${p.disclaimer}`, 66, this.currentY + 10, {
          width: this.contentWidth - 32,
        });
      this.currentY += 40;
    }

    // 人格特质表
    if (p.traits?.length) {
      this.drawTable(
        ['维度', '倾向', '语言证据'],
        p.traits.map(t => [t.name, t.tendency, t.evidence || '']),
        { colWidths: [120, 60, this.contentWidth - 180], headerBg: COLORS.accent }
      );
    }

    // 性格画像
    if (p.summary) {
      this.drawSubTitle('📝 性格画像');
      this.drawText(p.summary);
    }
    if (p.suitableRoles) {
      this.drawSubTitle('🏢 适合的工作环境/岗位');
      this.drawText(p.suitableRoles);
    }

    this.currentY += 8;
  }

  renderMarketCompetitiveness(data) {
    if (!data.marketCompetitiveness) return;
    const mc = data.marketCompetitiveness;

    this.drawSectionTitle('市场竞争力评估', '🏆');

    // 星级评级
    const stars = getStarString(mc.rating || 0, mc.maxRating || 5);
    this.drawHighlightBox(
      `综合评级：${stars}  (${mc.rating}/${mc.maxRating})    ${mc.suggestion || ''}`,
      COLORS.scoreBg,
      COLORS.primary
    );

    // 详细评语
    if (mc.summary) {
      this.drawText(mc.summary, { fontSize: 10, lineGap: 5 });
    }

    this.currentY += 8;
  }

  renderJDMatch(data) {
    if (!data.jdMatch) return;
    const jd = data.jdMatch;

    this.drawSectionTitle('JD 匹配分析', '🎯');

    // 目标职位
    const target = [jd.targetPosition, jd.company].filter(Boolean).join(' — ');
    if (target) {
      this.drawHighlightBox(`📌 目标职位：${target}`, '#F0FDF4', COLORS.success);
    }

    // 综合匹配度
    if (jd.overallMatch != null) {
      const matchColor = getMatchColor(jd.overallMatch);
      this.ensureSpace(50);
      this.doc
        .roundedRect(50, this.currentY, this.contentWidth, 44, 8)
        .fill(COLORS.scoreBg);
      this.doc
        .font(this.fontBold)
        .fontSize(20)
        .fillColor(matchColor)
        .text(`综合匹配度：${jd.overallMatch}%`, 0, this.currentY + 12, {
          width: this.pageWidth,
          align: 'center',
        });
      this.currentY += 56;
    }

    // 各维度匹配条
    if (jd.dimensions?.length) {
      this.drawSubTitle('匹配维度分析');
      jd.dimensions.forEach((dim) => {
        this.ensureSpace(24);
        this.drawMatchBar(dim.name, dim.matchPercent, dim.analysis, this.currentY);
        this.currentY += 24;
      });
      this.currentY += 8;
    }

    // 匹配项
    if (jd.matched?.length) {
      this.drawSubTitle('✅ 匹配的关键要求');
      jd.matched.forEach((m, i) => {
        this.drawBulletItem(
          `JD: "${m.jdRequirement}" ↔ 简历: "${m.resumeEvidence}" ✓`,
          `${i + 1}.`,
          { color: COLORS.success }
        );
      });
    }

    // 缺失项
    if (jd.missing?.length) {
      this.currentY += 4;
      this.drawSubTitle('❌ 缺失的关键要求');
      jd.missing.forEach((m, i) => {
        const note = m.note ? ` — ${m.note}` : '';
        this.drawBulletItem(
          `JD 要求: "${m.requirement}"${note}`,
          `${i + 1}.`,
          { color: COLORS.danger }
        );
      });
    }

    // 关键词分析
    if (jd.keywords) {
      this.currentY += 4;
      this.drawSubTitle('🏷️ 关键词分析');
      if (jd.keywords.matched?.length) {
        this.drawKVPair('命中关键词', jd.keywords.matched.join('、'));
      }
      if (jd.keywords.missing?.length) {
        this.drawKVPair('缺失关键词', jd.keywords.missing.join('、'));
      }
    }

    // 面试建议
    if (jd.interviewSuggestions?.length) {
      this.currentY += 4;
      this.drawSubTitle('💡 面试建议');
      jd.interviewSuggestions.forEach((s, i) => {
        this.drawBulletItem(s, `${i + 1}.`);
      });
    }

    // ATS 优化建议
    if (jd.atsSuggestions?.length) {
      this.currentY += 4;
      this.drawSubTitle('📋 ATS 优化建议');
      jd.atsSuggestions.forEach((s, i) => {
        this.drawBulletItem(s, `${i + 1}.`);
      });
    }

    this.currentY += 8;
  }

  renderDisclaimer() {
    this.ensureSpace(80);
    this.drawDivider();

    this.doc
      .font(this.fontRegular)
      .fontSize(8)
      .fillColor(COLORS.muted);

    const disclaimers = [
      '本报告由 AI 辅助生成，分析结果仅供参考，不构成最终招聘决策依据。',
      '大五人格推断基于简历文本的语言特征分析，不替代专业心理评估工具。',
      '匹配度分析基于语义理解，实际能力需通过面试和实操验证。',
      '建议结合实际面试表现综合评估候选人。',
    ];

    this.doc.text('免责声明', 50, this.currentY, {
      width: this.contentWidth,
      align: 'left',
    });
    this.currentY += 14;

    disclaimers.forEach((d) => {
      this.doc.text(`• ${d}`, 56, this.currentY, {
        width: this.contentWidth - 12,
        lineGap: 2,
      });
      this.currentY += 14;
    });
  }

  // ─── 主生成方法 ──────────────────────────────

  async generate(data) {
    const stream = createWriteStream(this.outputPath);
    this.doc.pipe(stream);

    // 1. 封面
    this.renderCover(data);

    // 2. 基本信息
    this.renderBasicInfo(data);

    // 3. 多维评分
    this.renderScoring(data);

    // 4. 优势与劣势
    this.renderStrengthsWeaknesses(data);

    // 5. 大五人格
    this.renderPersonality(data);

    // 6. 市场竞争力
    this.renderMarketCompetitiveness(data);

    // 7. JD 匹配分析（如果有）
    this.renderJDMatch(data);

    // 8. 免责声明
    this.renderDisclaimer();

    // 页脚
    this.drawPageFooter();

    this.doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  }
}

// ─── 主函数 ────────────────────────────────────────────────

async function main() {
  const outputPath = process.argv[2];

  if (!outputPath) {
    console.error('用法: echo \'<JSON>\' | node generate-report-pdf.mjs <输出PDF路径>');
    console.error('  或: node generate-report-pdf.mjs <输出PDF路径> < data.json');
    process.exit(1);
  }

  const absOutputPath = resolve(outputPath);

  // 确保输出目录存在
  try {
    mkdirSync(dirname(absOutputPath), { recursive: true });
  } catch { /* ignore */ }

  // 从 stdin 读取 JSON
  let input = '';
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  if (!input.trim()) {
    console.error('❌ 未收到 JSON 数据。请通过 stdin 传入分析数据。');
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(input);
  } catch (err) {
    console.error(`❌ JSON 解析失败: ${err.message}`);
    process.exit(1);
  }

  try {
    const pdf = new ResumeReportPDF(absOutputPath);
    await pdf.generate(data);
    console.log(`✅ PDF 报告已生成：${absOutputPath}`);
  } catch (err) {
    console.error(`❌ PDF 生成失败: ${err.message}`);
    process.exit(1);
  }
}

main();
