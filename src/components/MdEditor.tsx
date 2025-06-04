import MDEditor, { commands } from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { forwardRef } from 'react'

interface MdEditorProps {
  value: string
  onChange?: (value?: string) => void
  preview?: 'live' | 'edit' | 'preview'
  className?: string
  readOnly?: boolean
}

const minimalCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.divider,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
  commands.divider,
  commands.code,
  commands.codeBlock
]

export const MdEditor = forwardRef<HTMLDivElement, MdEditorProps>(
  ({
    value,
    onChange,
    preview = 'preview',
    className = '',
    readOnly = false,
    ...props
  }) => {
    return (
      <MDEditor
        value={value}
        onChange={readOnly ? undefined : onChange}
        preview={preview}
        commands={readOnly || preview === 'preview' ? [] : minimalCommands}
        hideToolbar={readOnly || preview === 'preview'}
        data-color-mode='light'
        style={{ fontVariantNumeric: 'tabular-nums' }}
        extraCommands={[]}
        height='100%'
        visibleDragbar={false}
        className={className}
        {...props}
      />
    )
  }
)

MdEditor.displayName = 'MdEditor'
