# md-editor-rt Configuration Optimization

このドキュメントでは、`md-editor-rt`パッケージの設定最適化のために実装した変更について説明します。

## 実装した最適化

### 1. 静的インポートへの変更（Static Imports）
- **目的**: シンプルな実装と安定性の向上
- **実装**: `ConfiguredMdEditor`コンポーネントを作成し、静的設定を適用
- **効果**: 複雑な動的読み込みロジックを削除し、保守性を向上

```tsx
// モジュールレベルで設定を実行（一度だけ設定される）
import { config } from 'md-editor-rt'
import JP_JP from '@vavt/cm-extension/dist/locale/jp-JP'
import { lineNumbers } from '@codemirror/view'

config({
  editorConfig: {
    languageUserDefined: {
      'jp-JP': JP_JP
    }
  },
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers()]
  }
})
```

### 2. 事前設定の適用
- **設定場所**: `ConfiguredMdEditor.tsx`のモジュールレベル
- **効果**: 日本語ロケールとCodeMirror拡張が自動的に設定される

```typescript
config({
  editorConfig: {
    languageUserDefined: {
      'jp-JP': JP_JP
    }
  },
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers()]
  }
})
```

### 3. 型安全性の向上
- **実装**: md-editor-rtの公式型定義を使用
- **効果**: カスタム型定義を削除し、ライブラリとの互換性を向上

## ファイル構成

```
src/components/
├── ConfiguredMdEditor.tsx     # 事前設定済みエディタ
├── MdPreview.tsx             # プレビューコンポーネント
└── MarkdownViewer.tsx        # メインコンポーネント（更新済み）

src/hooks/
```

## パフォーマンス効果

### Before（動的インポート使用時）
- 複雑な動的読み込みロジック
- Suspense、lazy loading、エラーハンドリングが必要
- プリロード機能の実装が複雑

### After（静的インポート使用時）
- **シンプルな実装**: 複雑な動的読み込みロジックを削除
- **安定性向上**: 静的インポートによる確実な読み込み
- **型安全性**: md-editor-rtの公式型定義を使用
- **保守性**: プリロードやSuspenseの複雑さを排除

## 使用方法

### 基本使用（事前設定済み）
```tsx
<MarkdownViewer 
  generatedList={list}
  copyToClipboard={copyFn}
/>
```

### ConfiguredMdEditorの直接使用
```tsx
<ConfiguredMdEditor
  value={markdownContent}
  onChange={setMarkdownContent}
  id="my-editor"
/>
```

## 注意事項

1. **設定**: モジュールレベルで一度だけ設定が実行される
2. **TypeScript**: md-editor-rtの公式型定義を使用し型安全性を向上
3. **CSS**: スタイルは静的にインポートされる
4. **日本語対応**: JP_JPロケールとCodeMirror拡張が自動適用

## 今後の改善点

静的インポートにより実装がシンプルになりましたが、必要に応じて以下の改善も検討可能です：

- バンドルサイズが問題になる場合は動的インポートに戻す
- チャンク分割の最適化
- プリロード機能の再実装（必要に応じて）
