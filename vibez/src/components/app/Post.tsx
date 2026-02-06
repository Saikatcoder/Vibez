import { useState } from "react"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"
import Input from "../shared/Input"
import Button from "../shared/Button"

const Post = () => {
  const [openComment, setOpenComment] = useState<number | null>(null)
  const [openEdit, setOpenEdit] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-xl space-y-5">

      {Array(5).fill(0).map((_, index) => (
        <Card
          key={index}
          className="relative p-0 overflow-visible rounded-2xl bg-white
          border border-gray-200 shadow-sm"
          title={
            <div className="relative flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar image="/image/avtar.png" size="sm" />
                <div>
                  <p className="text-sm font-semibold">John Doe</p>
                  <span className="text-xs text-gray-400">2h · Public</span>
                </div>
              </div>

              {/* 3 DOT BUTTON */}
              <button
                onClick={() =>
                  setOpenEdit(openEdit === index ? null : index)
                }
                className="text-gray-500 hover:text-black"
              >
                <i className="ri-more-2-fill text-lg"></i>
              </button>

              {/* EDIT / DELETE MENU */}
              {openEdit === index && (
                <div className="absolute right-4 top-12 z-50 w-32
                  bg-white border rounded-xl shadow-lg overflow-hidden">
                  <button
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                  >
                  Edit
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm hover:bg-gray-100
                    text-left text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          }
        >

          {/* POST CONTENT */}
          <div className="space-y-3">
            <p className="px-4 text-[15px] text-gray-800">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>

            <img
              src="/image/background.jpg"
              alt="post"
              className="w-full max-h-96 object-cover"
            />

            {/* ACTION BAR */}
            <div className="flex justify-around border-t text-sm font-medium text-gray-600">
              <button className="py-3 hover:text-red-500">❤️ Like</button>

              <button
                onClick={() =>
                  setOpenComment(openComment === index ? null : index)
                }
                className="py-3 hover:text-blue-500"
              >
                💬 Comment
              </button>

              <button className="py-3 hover:text-green-500">🔁 Share</button>
            </div>

            {/* COMMENT SECTION */}
            {openComment === index && (
              <div className="border-t px-4 py-3 space-y-4 bg-gray-50">

                <div className="space-y-3">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <Avatar image="/image/avtar.png" size="sm" />
                      <div className="bg-white rounded-xl px-3 py-2 shadow-sm">
                        <p className="text-xs font-medium">Saikat</p>
                        <p className="text-sm text-gray-700">
                          Nice post bhai 🔥
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Avatar image="/image/avtar.png" size="sm" />
                  <Input
                    name="comment"
                    placeholder="Write a comment..."
                  />
                  <Button size="sm">Post</Button>
                </div>

              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Post
