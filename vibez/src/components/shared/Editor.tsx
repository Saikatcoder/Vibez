import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import type { FC } from 'react'

const toolbars: string[] = [
  'heading',
  '|',
  'bold',
  'italic',
  'link',
  'bulletedList',
  'numberedList',
  '|',
  'undo',
  'redo'
]

interface EditorInterface {
  value?: string
  onChange?: (value: string) => void
}

const Editor: FC<EditorInterface> = ({ value, onChange }) => {

  const handleChange = (_: any, editor: any) => {
    const data = editor.getData()
    onChange?.(data)   // 🔥 yaha state update hoga
  }

  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={value || ""}
      config={{ toolbar: toolbars }}
      onChange={handleChange}   
    />
  )
}

export default Editor