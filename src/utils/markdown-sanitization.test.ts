import { marked } from 'marked'
import { htmlSanitize } from 'umaki'
import { describe, expect, it } from 'vitest'

describe('PDF Export HTML Sanitization Impact', () => {
  it('マークダウンからHTMLへの変換後のサニタイズの影響を確認', async () => {
    const testMarkdown = `# Test Document

## Table Example
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

## Link Example
[Google](https://google.com)

## Emphasis
**Bold text** and *italic text*

## List
- Item 1
- Item 2
- Item 3

## Code
\`inline code\` and:

\`\`\`javascript
console.log('hello world')
\`\`\`
`

    const htmlContent = await marked.parse(testMarkdown, {
      gfm: true,
      breaks: false,
      pedantic: false
    })

    const sanitizedHtml = htmlSanitize(htmlContent)

    // 差分を詳細に確認
    if (htmlContent !== sanitizedHtml) {
      const originalLines = htmlContent.split('\n')
      const sanitizedLines = sanitizedHtml.split('\n')

      for (
        let i = 0;
        i < Math.max(originalLines.length, sanitizedLines.length);
        i++
      ) {
        const orig = originalLines[i] || ''
        const san = sanitizedLines[i] || ''
        if (orig !== san) {
          // Log differences for debugging if needed
        }
      }
    }

    // テーブル、リンク、太字、リストが保持されているかチェック
    expect(sanitizedHtml).toContain('<table>')
    expect(sanitizedHtml).toContain('<a href="https://google.com"')
    expect(sanitizedHtml).toContain('<strong>')
    expect(sanitizedHtml).toContain('<ul>')
    expect(sanitizedHtml).toContain('<code>')
  })
})
