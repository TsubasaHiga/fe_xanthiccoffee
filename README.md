# MarkDays

<https://markdays.vercel.app/>

このリポジトリは、Vite・React・TypeScript を用いたフロントエンドプロジェクトです。

## 必要要件

- Node.js (推奨: v18以上)
- pnpm

## セットアップ

1. 依存パッケージのインストール

```bash
pnpm install
```

2. 開発サーバーの起動

```bash
pnpm dev
```

- ブラウザで `http://localhost:5173` にアクセスしてください。

## ビルド

本番用ビルドを作成するには:

```bash
pnpm build
```

- 出力は `dist/` ディレクトリに生成されます。

## テスト

### ユニットテスト

（ユニットテストのセットアップがある場合、ここに記載）

### E2Eテスト（Playwright）

1. Playwright の依存をインストール（初回のみ）

```bash
pnpm install
```

2. 本番ビルドでのE2Eテスト実行

```bash
pnpm test:e2e
```

3. ローカル開発サーバーでのE2Eテスト実行

```bash
pnpm test:e2e:dev
# またはUIモード
pnpm test:e2e:dev:ui
```

- テスト結果は `playwright-report/` に出力されます。

## Lint

ESLint による静的解析を実行するには:

```bash
pnpm lint
```

## 主要スクリプト一覧

| コマンド         | 説明                       |
|------------------|----------------------------|
| pnpm dev         | 開発サーバー起動           |
| pnpm build       | 本番ビルド                 |
| pnpm preview     | ビルド後のローカルプレビュー|
| pnpm lint        | ESLint による静的解析      |
| pnpm test:e2e    | E2Eテスト（Playwright）    |

## ディレクトリ構成

- `src/` ... アプリケーション本体
- `e2e/` ... E2Eテスト（Playwright）
- `public/` ... 静的ファイル
- `docs/` ... ドキュメント
