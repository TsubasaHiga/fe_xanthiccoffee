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

### ユニットテスト（Vitest）

- 各関数・ロジック・コンポーネント単位での正確な動作を保証し、バグの早期発見・リグレッション防止を図ります。
- テスト対象や詳細要件は [`docs/unit-test-requirements.md`](docs/unit-test-requirements.md) を参照してください。
- テストコードは `src/` 配下に `*.test.ts(x)` 形式で配置します。
- 実行例：

```bash
pnpm test:unit
```

（Vitestのセットアップが必要です。未導入の場合は `pnpm add -D vitest @testing-library/react` などで導入してください）

### E2Eテスト（Playwright）

- ユーザー操作の主要フローを自動テストし、リグレッションやUI/UXの破壊を防ぎます。
- テスト対象や詳細要件は [`docs/e2e-test-requirements.md`](docs/e2e-test-requirements.md) を参照してください。

1. 依存パッケージのインストール（初回のみ）

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
