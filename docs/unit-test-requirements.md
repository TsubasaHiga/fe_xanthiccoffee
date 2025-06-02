# ユニットテスト要件定義（Vitest）

## 目的
- 各関数・ロジック・コンポーネント単位での正確な動作を保証し、バグの早期発見・リグレッション防止を図る。
- ビルド時やCI/CDパイプラインで自動実行し、失敗時はビルド・デプロイを停止できるようにする。

## 対象範囲
- ユーティリティ関数（例：dateUtils.ts, utils.ts など）
- Reactコンポーネント（UIのレンダリング・propsの受け渡し・イベントハンドリング）
- カスタムフック（useDateListGenerator など）
- コンテキスト（DateListSettingsContext など）
- 外部APIや副作用を持つ処理（必要に応じてモック化）

## ユニットテストが必要な主なファイル一覧
- src/utils/dateUtils.ts
- src/lib/utils.ts
- src/hooks/useDateListGenerator.ts
- src/contexts/DateListSettingsContext.tsx
- src/components/DateListSettingsCard.tsx
- src/components/GeneratedListCardV3.tsx
- src/components/ui/button.tsx
- src/components/ui/card.tsx
- src/components/ui/collapsible.tsx
- src/components/ui/input.tsx
- src/components/ui/label.tsx
- src/components/ui/separator.tsx
- src/components/ui/switch.tsx
- src/pages/DateListGeneratorPage.tsx

## テスト内容例
- 各ユーティリティ関数の正常系・異常系の返り値検証
- useDateListGeneratorの状態遷移・関数の動作（例：プリセット選択、リセット、コピー、リスト生成）
- DateListSettingsCard/GeneratedListCardV3等のコンポーネントがpropsや状態に応じて正しく描画・動作するか
- バリデーション・エラーハンドリングのロジック
- コンテキストの値が正しく伝播・更新されるか
- イベントハンドラ（onClick, onChange等）が正しく動作するか
- 外部依存（クリップボード、トースト等）のモック・スタブ化

## 実行タイミング
- ローカル開発時に手動で実行可能
- ビルド時（CI/CDパイプライン）に自動実行し、失敗時はビルドを失敗させる

## 技術要件
- Vitest（TypeScript）を利用
- テストコードは `src/` 配下の各ディレクトリに `*.test.ts(x)` 形式で配置
- 必要に応じてReact Testing Library等を併用
- 外部依存はモック・スタブでテスト可能にする

## レポート
- テスト結果は標準出力およびHTMLレポートで確認可能とする
