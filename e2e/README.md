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
pnpm install
```

2. Playwrightブラウザをインストール:
```bash
npx playwright install
```

### テストの実行

```bash
# 全てのテストを実行
pnpm run test:e2e

# UIモードでテストを実行（対話的）
pnpm run test:e2e:ui

# 特定のブラウザのみでテスト
pnpm run test:e2e -- --project=chromium

# 特定のテストファイルのみ実行
pnpm run test:e2e -- basic.spec.ts

# ヘッドモードで実行（ブラウザが見える状態）
pnpm run test:e2e -- --headed
```

### レポートの確認

```bash
# HTMLレポートを表示
pnpm run test:e2e:report
```

## CI/CD

GitHubActions（`.github/workflows/e2e-tests.yml`）により、以下のタイミングで自動実行されます：

- 毎週日曜日の午前0時（JST）に定期実行
- 必要に応じて手動実行が可能

テスト結果はArtifactsとしてアップロードされ、失敗時にはビルドが停止します。

### CI最適化

E2EテストのCI実行時間を短縮するため、以下の最適化を実装：

- **シャーディング**: テストを4つのシャードに分割し、並列実行
- **キャッシュ最適化**: pnpm依存関係とPlaywrightブラウザの積極的キャッシュ
- **ブラウザマトリックス最適化**: CI環境では4ブラウザ（Chromium、Firefox、WebKit、Mobile Chrome）
- **レポート統合**: Blob形式でレポートを収集し、最終的に統合HTML報告書を生成

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
pnpm run test:e2e -- --timeout=60000
```

### デバッグモード
```bash
pnpm run test:e2e -- --debug
```