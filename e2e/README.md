# E2E Tests with Playwright

このディレクトリには、MarkDaysアプリケーションのE2Eテストが含まれています。

## テストファイル構成

- `basic.spec.ts` - 基本的なページ表示とナビゲーションのテスト
- `date-list-settings.spec.ts` - 日付リスト設定機能のテスト
- `generated-list.spec.ts` - 生成されたリストの機能テスト
- `form-validation.spec.ts` - フォームバリデーションのテスト
- `advanced-settings.spec.ts` - 詳細設定機能のテスト

## ローカル実行

### 必要な準備

1. 依存関係をインストール:
```bash
npm install
```

2. Playwrightブラウザをインストール:
```bash
npx playwright install
```

### テストの実行

```bash
# 全てのテストを実行
npm run test:e2e

# UIモードでテストを実行（対話的）
npm run test:e2e:ui

# 特定のブラウザのみでテスト
npm run test:e2e -- --project=chromium

# 特定のテストファイルのみ実行
npm run test:e2e -- basic.spec.ts

# ヘッドモードで実行（ブラウザが見える状態）
npm run test:e2e -- --headed
```

### レポートの確認

```bash
# HTMLレポートを表示
npm run test:e2e:report
```

## CI/CD

GitHubActions（`.github/workflows/e2e-tests.yml`）により、以下のタイミングで自動実行されます：

- `main`、`develop`ブランチへのプッシュ
- これらのブランチへのプルリクエスト

テスト結果はArtifactsとしてアップロードされ、失敗時にはビルドが停止します。

## テスト設計方針

- **堅牢性**: 実際のUI要素に依存しつつ、柔軟なセレクタを使用
- **独立性**: 各テストは独立して実行可能
- **カバレッジ**: 主要なユーザーフローを網羅
- **保守性**: 実装の詳細に依存しない、機能ベースのテスト

## トラブルシューティング

### ブラウザが見つからない場合
```bash
npx playwright install
```

### テストがタイムアウトする場合
ネットワークやCIの状況により、タイムアウトを延長できます：
```bash
npm run test:e2e -- --timeout=60000
```

### デバッグモード
```bash
npm run test:e2e -- --debug
```