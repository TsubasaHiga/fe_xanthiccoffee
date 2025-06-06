/**
 * Extract title from markdown content
 */
function extractTitle(content: string): string | null {
  const lines = content.split('\n').filter((line) => line.trim())
  const titleLine = lines.find((line) => line.startsWith('#'))
  return titleLine ? titleLine.replace(/^#+\s*/, '') : null
}

/**
 * Export as Markdown file
 */
export function exportAsMarkdown(content: string): void {
  const title = extractTitle(content) || 'マークダウンファイル'

  // Create and download markdown file
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${title}.md`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export as PDF using browser print functionality
 */
export function exportAsPDF(content: string): void {
  const title = extractTitle(content) || 'マークダウンコンテンツ'

  // Convert markdown to HTML with basic formatting
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: 'Arial', 'Meiryo', sans-serif; 
          margin: 20px; 
          line-height: 1.6;
          color: #333;
        }
        h1, h2, h3, h4, h5, h6 { 
          color: #333; 
          border-bottom: 1px solid #ddd; 
          padding-bottom: 5px; 
          margin-top: 20px;
        }
        ul, ol { padding-left: 20px; }
        li { margin: 5px 0; }
        p { margin: 10px 0; }
        code { 
          background: #f4f4f4; 
          padding: 2px 4px; 
          border-radius: 3px; 
        }
        pre { 
          background: #f4f4f4; 
          padding: 10px; 
          border-radius: 5px; 
          overflow-wrap: break-word;
        }
        @media print {
          body { margin: 0; }
          * { -webkit-print-color-adjust: exact !important; }
        }
      </style>
    </head>
    <body>
      ${markdownToHTML(content)}
    </body>
    </html>
  `

  // Open in new window and trigger print
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()

    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

/**
 * Simple markdown to HTML converter
 */
function markdownToHTML(markdown: string): string {
  return markdown
    .split('\n')
    .map((line) => {
      // Headers
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.startsWith('#### ')) return `<h4>${line.slice(5)}</h4>`
      if (line.startsWith('##### ')) return `<h5>${line.slice(6)}</h5>`
      if (line.startsWith('###### ')) return `<h6>${line.slice(7)}</h6>`

      // List items
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
      if (/^\d+\.\s/.test(line))
        return `<li>${line.replace(/^\d+\.\s/, '')}</li>`

      // Empty lines
      if (line.trim() === '') return '<br>'

      // Regular paragraphs
      return `<p>${line}</p>`
    })
    .join('\n')
}
