const env = import.meta.env
import { useState } from "react"
import Avatar from "../shared/Avatar"
import Input from "../shared/Input"
import Button from "../shared/Button"
import Editor from "../shared/Editor"
import { Card, message, Skeleton } from "antd"
import HttpInterceptor from "../../lib/Htttpinterceptor"
import { v4 as uuid } from 'uuid'
import CatchError from "../../lib/CatchError"
import moment from "moment"
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/fetcher"

interface FileDataInterface {
  url: string
  file: File
}

const Post = () => {
  //FIXED SWR
  const { data, error, isLoading } = useSWR('/post/get-post', Fetcher)

  const [openComment, setOpenComment] = useState<number | null>(null)
  const [openEdit, setOpenEdit] = useState<number | null>(null)
  const [value, setValue] = useState('Whats in your mind ?')
  const [fileData, setFileData] = useState<FileDataInterface | null>(null)

  const attachfile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*, video/*'
    input.click()

    input.onchange = () => {
      if (!input.files || input.files.length === 0) return
      const file = input.files[0]
      input.remove()
      const url = URL.createObjectURL(file)
      setFileData({ url, file })
    }
  }

  const createPost = async () => {
    try {
      let path = null

      if (fileData) {
        const ext = fileData.file.name.split('.').pop()
        const filename = `${uuid()}.${ext}`
        path = `/posts/${filename}`

        const payload = {
          path: path,
          status: 'public-read',
          type: fileData.file.type,
        }

        const options = {
          headers: {
            'Content-Type': fileData.file.type
          }
        }

        const { data } = await HttpInterceptor.post("/storage/upload", payload)
        await HttpInterceptor.put(data.url, fileData.file, options)
      }

      const fromdata = {
        attachment: path,
        type: path ? fileData?.file.type : null,
        content: value
      }

      await HttpInterceptor.post('/post', fromdata)
      mutate('/post')
      message.success('Post created successfully')
      setFileData(null)
      setValue('Whats in your mind ?')

    } catch (error) {
      CatchError(error, 'top-center')
    }
  }

  const likeCount = () => {
      message.info('Like feature is coming soon!')

  }

  const deletePost =async()=>{
   try {
     await HttpInterceptor.delete(`/post/${data[0]._id}`)
     mutate('/post')
     message.success('Post deleted successfully')

   } catch (error) {
    CatchError(error, 'top-center')
   }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-3 pt-16 md:pt-20 text-black">

      {/* EDITOR */}
      <div className="bg-[#000000] border border-[#2a2a2a] rounded-2xl p-3 sm:p-4 flex flex-col gap-5">
        <h1 className="text-white font-medium">Write your post here...</h1>

        {value.length > 0 && (
          <Card>
            <div className="space-y-4">

              {
              fileData && fileData.file.type.startsWith('image/') && (
                <img src={fileData.url} className="w-20 rounded-lg" />
              )}

              {
              fileData && fileData.file.type.startsWith('video/') && (
                <video controls className="w-40 rounded-lg">
                  <source src={fileData.url} />
                </video>
              )}

              {/*LIVE PREVIEW */}
              <div
                dangerouslySetInnerHTML={{ __html: value }}
                className="hard-reset text-black"
              />

              <label>{moment().format('MMM Do YYYY, h:mm:ss a')}</label>
            </div>
          </Card>
        )}

        <Editor value={value} onChange={setValue} />

        <div className="flex gap-2 justify-end">
          <Button loading={false} onClick={attachfile} size="sm" type="primary">Attach</Button>

          {
          fileData && (
            <Button loading={false} onClick={() => setFileData(null)} size="sm" type="warning">
              Remove
            </Button>
          )}

          <Button loading={false} size="sm" type="info" onClick={createPost}>
            Post
          </Button>
        </div>
      </div>

      {/* POSTS */}

      {
      isLoading && <Skeleton active />}

      {
      error && <h1 className="text-red-500">{error.message}</h1>}

      {/* FIXED MAP */}
      {data && data.map((item: any, index: number) => (
        
        <div
          key={index}
          className="bg-[#000000] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow hover:bg-[#1f1f1f] transition"
        >

          {/* HEADER */}
          <div className="relative flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar image="/image/avtar.png" size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {item.user?.name || "User"}
                </p>
                <span className="text-xs text-gray-400">
                  {moment(item.createdAt).fromNow()}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                setOpenEdit(openEdit === index ? null : index)
              }
              className="text-gray-400 hover:text-white"
            >
              <i className="ri-more-2-fill text-lg"></i>
            </button>

            {
            openEdit === index && (
              <div className="absolute right-4 top-12 z-50 w-32 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl">
                <button className="w-full px-4 py-2 text-sm hover:bg-[#2a2a2a] text-left text-gray-300">
                  Edit
                </button>
                <button className="w-full px-4 py-2 text-sm hover:bg-[#2a2a2a] text-left text-red-400" onClick={deletePost}>
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="space-y-3">

            {/*  FIXED CONTENT */}
            <div
              className="px-4 text-sm text-gray-300 hard-reset"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            {/* IMAGE / VIDEO */}
            {item.attachment && item.type?.startsWith("image/") && (
              <img
                src={`${env.VITE_S3_URL}/${item.attachment}`}
                className="w-full max-h-80 sm:max-h-96 object-cover"
              />
            )}

            {item.attachment && item.type?.startsWith("video/") && (
              <video controls className="w-full">
                <source
                  src={`${env.VITE_S3_URL}/${item.attachment}`}
                />
              </video>
            )}

            {/* ACTION */}
            <div className="flex justify-around border-t border-[#2a2a2a] text-xs sm:text-sm text-gray-400">
              <button onClick={likeCount} className="py-3 hover:text-red-500">❤️ {item.like || 0}</button>

              <button
                onClick={() =>
                  setOpenComment(openComment === index ? null : index)
                }
                className="py-3 hover:text-[#9acd32]"
              >
                💬 {item.comment || 0}
              </button>

              <button className="py-3 hover:text-blue-400">🔁 Share</button>
            </div>

            {/* COMMENT */}
            {openComment === index && (
              <div className="border-t px-3 py-3 bg-[#121212]">

                <div className="flex gap-2">
                  <Avatar image="/image/avtar.png" size="sm" />
                  <Input name="comment" placeholder="Write a comment..." />
                  <Button loading={false} size="sm">
                    Post
                  </Button>
                </div>

              </div>
            )}

          </div>
        </div>
      ))}
    </div>
  )
}

export default Post