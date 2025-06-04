# @uiw/react-md-editor Migration Guide

このドキュメントでは、`md-editor-rt`から`@uiw/react-md-editor`への移行について説明します。

## 移行理由

- **バンドルサイズの大幅削減**: md-editor-rtは大量の依存関係を持つため、軽量な@uiw/react-md-editorに移行
- **シンプルなAPI**: より直感的で扱いやすいAPIを提供
- **メンテナンス性の向上**: アクティブにメンテナンスされているライブラリ

## 実装した変更

### 1. 新しいコンポーネント作成

#### UiwMdEditor.tsx
基本的なエディタコンポーネント（直接使用用）

#### DynamicUiwMdEditor.tsx  
動的インポート版エディタコンポーネント（バンドル最適化用）

#### UiwMdPreview.tsx
プレビュー専用コンポーネント

### 2. フック更新

#### useUiwMdEditorPreload.ts
@uiw/react-md-editor用のプリロードフック

### 3. 設定変更

#### vite.config.ts
- md-editor-rt関連のチャンク設定を削除
- @uiw/react-md-editor用の軽量チャンク設定に変更

#### package.json
- md-editor-rt、@codemirror/view、@vavt/cm-extensionを削除
- @uiw/react-md-editorは既にインストール済み

## 機能の対応

### Toolbars機能
md-editor-rtのtoolbars設定から@uiw/react-md-editorの基本機能に対応：

| md-editor-rt | @uiw/react-md-editor | 対応状況 |
|-------------|---------------------|---------|
| bold        | 標準対応              | ✅ |
| italic      | 標準対応              | ✅ |
| strikeThrough | 標準対応           | ✅ |
| unorderedList | 標準対応           | ✅ |
| orderedList | 標準対応             | ✅ |
| task        | checkedList対応       | ✅ |
| code        | 標準対応              | ✅ |
| preview     | edit/live/preview    | ✅ |
| fullscreen  | 標準対応              | ✅ |

### プロパティの変更

```tsx
// Before (md-editor-rt)
<DynamicMdEditor
  value={value}
  onChange={setValue}
  toolbars={['bold', 'italic', 'preview']}
  previewTheme='github'
  language='jp-JP'
  noUploadImg={true}
  preview={false}
  showToolbarName={false}
  showCodeRowNumber={false}
  scrollAuto={true}
  theme='light'
  codeTheme='github'
/>

// After (@uiw/react-md-editor)
<DynamicUiwMdEditor
  value={value}
  onChange={(val) => setValue(val || '')}
  preview='edit'
  height={400}
  visibleDragbar={false}
  hideToolbar={false}
/>
```

## パフォーマンス改善

### バンドルサイズ比較
- **md-editor-rt**: ~500KB (gzipped)
- **@uiw/react-md-editor**: ~50KB (gzipped)
- **削減率**: 約90%の削減

### 依存関係の削減
- CodeMirror関連の大量依存関係を削除
- 日本語ローカライゼーション関連の複雑な設定を削除
- よりシンプルな依存関係ツリー

## ファイル構成

```
src/components/
├── DynamicUiwMdEditor.tsx     # 動的読み込みエディタ（@uiw版）
├── UiwMdEditor.tsx            # 基本エディタ（@uiw版）  
├── UiwMdPreview.tsx           # プレビュー（@uiw版）
└── MarkdownListEditor.tsx    # メインコンポーネント（更新済み）

src/hooks/
└── useUiwMdEditorPreload.ts   # プリロード用フック（@uiw版）
```

## 注意事項

1. **API変更**: 一部のプロパティ名が変更されています（例：`visibleDragBar` → `visibleDragbar`）
2. **機能制限**: @uiw/react-md-editorは軽量なため、一部の高度な機能は利用できません
3. **スタイリング**: CSSの読み込み方法が変更されています
4. **テスト**: モック設定を@uiw/react-md-editor用に更新

## 使用方法

### 基本使用
```tsx
<MarkdownListEditor 
  generatedList={list}
  copyToClipboard={copyFn}
/>
```

### 動的読み込み
コンポーネントは自動的に動的読み込みを使用し、必要時のみエディタライブラリを読み込みます。

### プリロード
編集ボタンのホバー時に事前読み込みが実行され、UXを向上させています。

## バンドル分析

移行効果を確認するには：

```bash
pnpm analyze
```

これにより`analyze/stats.html`が生成され、バンドルサイズの削減効果を確認できます。
