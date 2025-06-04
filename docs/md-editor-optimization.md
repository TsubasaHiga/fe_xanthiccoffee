# md-editor-rt Bundle Size Optimization

このドキュメントでは、`md-editor-rt`パッケージのバンドルサイズ最適化のために実装した変更について説明します。

## 実装した最適化

### 1. 動的インポート（Dynamic Imports）
- **目的**: 編集機能が必要な時のみ`md-editor-rt`を読み込む
- **実装**: `DynamicMdEditor`と`DynamicMdPreview`コンポーネントを作成
- **効果**: 初期バンドルサイズの大幅削減

```tsx
// 編集ボタンを押下したときのみMdEditorが読み込まれる
const MdEditor = lazy(async () => {
  const [{ MdEditor }, { config }, { lineNumbers }] = await Promise.all([
    import('md-editor-rt'),
    import('md-editor-rt'),
    import('@codemirror/view')
  ])
  // ...設定も動的に読み込み
  return { default: MdEditor }
})
```

### 2. コード分割（Code Splitting）
- **設定場所**: `vite.config.ts`の`build.rollupOptions.output.manualChunks`
- **効果**: ライブラリごとに独立したチャンクを作成し、キャッシュ効率を向上

```typescript
manualChunks: {
  'md-editor': ['md-editor-rt'],
  'codemirror': ['@codemirror/view'],
  'vavt-cm': ['@vavt/cm-extension'],
  'react-vendor': ['react', 'react-dom'],
  'ui-vendor': ['lucide-react', '@radix-ui/react-*']
}
```

### 3. プリロード機能
- **実装**: `useMdEditorPreload`カスタムフック
- **UX改善**: 編集ボタンのホバー/フォーカス時に事前読み込み
- **効果**: 実際の編集開始時の待機時間短縮

```tsx
const { preloadMdEditor } = useMdEditorPreload()

<Button
  onMouseEnter={preloadMdEditor} // ホバー時にプリロード
  onFocus={preloadMdEditor}     // フォーカス時にプリロード
>
  編集する
</Button>
```

## ファイル構成

```
src/components/
├── DynamicMdEditor.tsx        # 動的読み込みエディタ（編集時のみ）
├── DynamicMdPreview.tsx       # プレビュー（メインバンドルに含む）
└── GeneratedListCardV3.tsx    # メインコンポーネント（更新済み）

src/hooks/
└── useMdEditorPreload.ts      # プリロード用フック
```

## パフォーマンス効果

### Before（最適化前）
- `md-editor-rt`が初期バンドルに含まれる
- 編集機能を使わなくてもフルライブラリが読み込まれる
- 初期読み込み時間が長い

### After（最適化後）
- **初期バンドル**: プレビューのみ（軽量プレビュー使用時はさらに軽量）
- **編集時**: 必要な時のみ動的読み込み
- **プリロード**: UX向上のため事前読み込み可能
- **キャッシュ**: チャンク分割により効率的なキャッシュ

## 使用方法

### 基本使用（動的読み込み有効）
```tsx
<GeneratedListCardV3 
  generatedList={list}
  copyToClipboard={copyFn}
/>
```

### 軽量プレビュー使用
```tsx
<GeneratedListCardV3 
  generatedList={list}
  copyToClipboard={copyFn}
  useLitePreview={true}  // md-editor-rtを使わない軽量プレビュー
/>
```

## 注意事項

1. **テスト**: 動的インポートのため、テストでは適切なモックが必要
2. **TypeScript**: 型の互換性を保つため`Record<string, unknown>`でキャスト
3. **CSS**: スタイルも動的読み込みで必要時のみ適用
4. **フォールバック**: ローディング中はスケルトンコンポーネントを表示

## バンドル分析

最適化効果を確認するには以下のコマンドでバンドル分析を実行：

```bash
pnpm analyze
```

これにより`analyze/stats.html`が生成され、チャンクサイズとロード戦略を視覚的に確認できます。
