/**
 * WeChat-compatible themes extracted from Raphael Publish.
 * Each theme maps CSS selectors to inline style strings.
 */

export const themes = {
  wechat: {
    id: 'wechat',
    name: '微信原生',
    description: '微信绿色原生风，通用',
    styles: {
      container: 'max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.75; color: #333333; background-color: #ffffff; word-wrap: break-word;',
      h1: 'font-size: 28px; font-weight: 700; color: #111; line-height: 1.3; margin: 38px 0 16px; letter-spacing: -0.015em;',
      h2: 'font-size: 22px; font-weight: 600; color: #111; line-height: 1.35; margin: 32px 0 16px; padding-left: 12px; border-left: 4px solid #07c160;',
      h3: 'font-size: 18px; font-weight: 600; color: #333333; line-height: 1.4; margin: 28px 0 14px;',
      h4: 'font-size: 16px; font-weight: 600; color: #333333; line-height: 1.4; margin: 24px 0 12px;',
      p: 'margin: 18px 0; line-height: 1.75; color: #333333;',
      strong: 'font-weight: 700; color: #07c160; background-color: rgba(7,193,96,0.08); padding: 0 4px; border-radius: 4px;',
      em: 'font-style: italic; color: #666;',
      a: 'color: #07c160; text-decoration: none; border-bottom: 1px solid #07c160; padding-bottom: 1px;',
      ul: 'margin: 16px 0; padding-left: 28px;',
      ol: 'margin: 16px 0; padding-left: 28px;',
      li: 'margin: 8px 0; line-height: 1.75; color: #333333;',
      blockquote: 'margin: 24px 0; padding: 16px 20px; background-color: #f0f7f2; border-left: 4px solid #07c160; color: #555; border-radius: 4px;',
      code: 'font-family: "SF Mono", Consolas, monospace; padding: 3px 6px; background-color: #f0f7f2; color: #07c160; border-radius: 4px; font-size: 13px; line-height: 1.5;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #f0f7f2; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5;',
      hr: 'margin: 36px auto; border: none; height: 1px; background-color: #eaeaea; width: 100%;',
      img: 'max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 8px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;',
      th: 'background-color: #f0f7f2; padding: 12px 16px; text-align: left; font-weight: 600; color: #333333; border: 1px solid #d8e8dc;',
      td: 'padding: 12px 16px; border: 1px solid #d8e8dc; color: #333333;',
      tr: 'border: none;',
    }
  },

  mac: {
    id: 'mac',
    name: 'Mac 极简',
    description: '纯净现代的极致留白',
    styles: {
      container: 'max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.75; color: #1d1d1f; background-color: #ffffff; word-wrap: break-word;',
      h1: 'font-size: 28px; font-weight: 700; color: #111; line-height: 1.3; margin: 38px 0 16px; letter-spacing: -0.015em;',
      h2: 'font-size: 22px; font-weight: 600; color: #111; line-height: 1.35; margin: 32px 0 16px;',
      h3: 'font-size: 18px; font-weight: 600; color: #1d1d1f; line-height: 1.4; margin: 28px 0 14px;',
      h4: 'font-size: 16px; font-weight: 600; color: #1d1d1f; line-height: 1.4; margin: 24px 0 12px;',
      p: 'margin: 18px 0; line-height: 1.75; color: #1d1d1f;',
      strong: 'font-weight: 700; color: #000;',
      em: 'font-style: italic; color: #666;',
      a: 'color: #0066cc; text-decoration: none; border-bottom: 1px solid #0066cc; padding-bottom: 1px;',
      ul: 'margin: 16px 0; padding-left: 28px;',
      ol: 'margin: 16px 0; padding-left: 28px;',
      li: 'margin: 8px 0; line-height: 1.75; color: #1d1d1f;',
      blockquote: 'margin: 24px 0; padding: 16px 20px; background-color: #f5f5f7; border-left: 4px solid #0066cc; color: #555; border-radius: 4px;',
      code: 'font-family: "SF Mono", Consolas, monospace; padding: 3px 6px; background-color: #f5f5f7; color: #0066cc; border-radius: 4px; font-size: 13px; line-height: 1.5;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #f5f5f7; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5;',
      hr: 'margin: 36px auto; border: none; height: 1px; background-color: #eaeaea; width: 100%;',
      img: 'max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 12px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;',
      th: 'background-color: #f5f5f7; padding: 12px 16px; text-align: left; font-weight: 600; color: #1d1d1f; border: 1px solid #e0e0e0;',
      td: 'padding: 12px 16px; border: 1px solid #e0e0e0; color: #1d1d1f;',
      tr: 'border: none;',
    }
  },

  medium: {
    id: 'medium',
    name: 'Medium 博客',
    description: '简约柔和的西式博客排版',
    styles: {
      container: 'max-width: 100%; margin: 0 auto; padding: 24px 20px 48px 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; line-height: 1.85; color: #242424; background-color: #fcfcfc; word-wrap: break-word;',
      h1: 'font-size: 28px; font-weight: 700; color: #111; line-height: 1.3; margin: 38px 0 16px; letter-spacing: -0.015em;',
      h2: 'font-size: 22px; font-weight: 600; color: #111; line-height: 1.35; margin: 32px 0 16px;',
      h3: 'font-size: 18px; font-weight: 600; color: #242424; line-height: 1.4; margin: 28px 0 14px;',
      h4: 'font-size: 16px; font-weight: 600; color: #242424; line-height: 1.4; margin: 24px 0 12px;',
      p: 'margin: 24px 0; line-height: 1.85; color: #242424;',
      strong: 'font-weight: 700; color: #000;',
      em: 'font-style: italic; color: #666;',
      a: 'color: #1a8917; text-decoration: none; border-bottom: 1px solid #1a8917; padding-bottom: 1px;',
      ul: 'margin: 16px 0; padding-left: 28px;',
      ol: 'margin: 16px 0; padding-left: 28px;',
      li: 'margin: 10px 0; line-height: 1.85; color: #242424;',
      blockquote: 'margin: 24px 0; padding: 16px 20px; background-color: transparent; border-left: 3px solid #1a8917; color: #555; border-radius: 0;',
      code: 'font-family: "SF Mono", Consolas, monospace; padding: 3px 6px; background-color: #f2f3f5; color: #1a8917; border-radius: 4px; font-size: 13px; line-height: 1.5;',
      pre: 'margin: 24px 0; padding: 20px; background-color: #f2f3f5; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.5;',
      hr: 'margin: 36px auto; border: none; height: 1px; background-color: #eaeaea; width: 100%;',
      img: 'max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 4px;',
      table: 'width: 100%; margin: 24px 0; border-collapse: collapse; font-size: 15px;',
      th: 'background-color: #f2f3f5; padding: 12px 16px; text-align: left; font-weight: 600; color: #242424; border: 1px solid #e0e0e0;',
      td: 'padding: 12px 16px; border: 1px solid #e0e0e0; color: #242424;',
      tr: 'border: none;',
    }
  }
};
