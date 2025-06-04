import { MdPreview as MdEditorRtPreview } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'

interface MdPreviewProps {
  value: string
  className?: string
  style?: React.CSSProperties
  language?: string
  previewTheme?: string
}

export function MdPreview(props: MdPreviewProps) {
  return <MdEditorRtPreview data-testid='md-preview' {...props} />
}
