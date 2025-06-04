import { lineNumbers } from '@codemirror/view'
import { type EditorProps, MdEditor, config } from 'md-editor-rt'
import { forwardRef } from 'react'
import 'md-editor-rt/lib/style.css'
import JP_JP from '@vavt/cm-extension/dist/locale/jp-JP'

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
  showToolbarName?: boolean
  onLoad?: () => void
  minHeight?: number
}

export const ConfiguredMdEditor = forwardRef<
  HTMLDivElement,
  ConfiguredMdEditorProps
>(({ onLoad, minHeight, ...props }, ref) => {
  return <MdEditor data-testid='md-editor' {...props} ref={ref} />
})
