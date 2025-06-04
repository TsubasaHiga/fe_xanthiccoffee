import {
  MdPreview as MdEditorRtPreview,
  type MdPreviewProps as MdEditorRtPreviewProps
} from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'

interface MdPreviewProps extends MdEditorRtPreviewProps {}

export function MdPreview(props: MdPreviewProps) {
  return <MdEditorRtPreview data-testid='md-preview' {...props} />
}
