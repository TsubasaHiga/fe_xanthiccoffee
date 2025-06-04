import { lineNumbers } from '@codemirror/view'
import JP_JP from '@vavt/cm-extension/dist/locale/jp-JP'
import { type EditorProps, MdEditor, config } from 'md-editor-rt'
import { forwardRef } from 'react'

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

interface ConfiguredMdEditorProps extends EditorProps {
  onLoad?: () => void
}

export const ConfiguredMdEditor = forwardRef<
  HTMLDivElement,
  ConfiguredMdEditorProps
>(({ onLoad, ...props }, ref) => {
  return <MdEditor data-testid='md-editor' {...props} ref={ref} />
})
