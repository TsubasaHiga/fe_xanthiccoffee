/**
 * Test data and utilities for E2E tests
 */

export const testData = {
  validForm: {
    title: 'テスト用日付リスト',
    startDate: '2024-01-01',
    endDate: '2024-01-07'
  },

  invalidForm: {
    title: '',
    startDate: '2024-01-07',
    endDate: '2024-01-01' // End date before start date
  },

  longPeriodForm: {
    title: '長期間テスト',
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },

  shortPeriodForm: {
    title: '短期間テスト',
    startDate: '2024-01-01',
    endDate: '2024-01-03'
  }
}

export const selectors = {
  titleInput: 'input[type="text"]',
  dateInputs: 'input[type="date"]',
  generateButton: 'button:has-text("生成"), button:has-text("リスト")',
  resetButton: 'button:has-text("リセット"), button:has-text("クリア")',
  expandButton:
    'summary, button:has-text("詳細"), button:has-text("オプション")',
  copyButton: 'button:has-text("コピー"), button:has-text("copy")',
  toast: '[data-sonner-toast], div:has-text("コピー")'
}

export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 }
}
