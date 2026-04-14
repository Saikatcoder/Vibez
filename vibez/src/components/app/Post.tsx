import { useState } from "react"
import Avatar from "../shared/Avatar"
import Card from "../shared/Card"
import Input from "../shared/Input"
import Button from "../shared/Button"

const Post = () => {
  const [openComment, setOpenComment] = useState<number | null>(null)
  const [openEdit, setOpenEdit] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-xl space-y-6">

      {Array(5).fill(0).map((_, index) => (
        <div
          key={index}
          className="bg-[#161616] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow hover:bg-[#1f1f1f] transition"
        >

          {/* HEADER */}
          <div className="relative flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar image="/image/avtar.png" size="sm" />
              <div>
                <p className="text-sm font-semibold text-white">John Doe</p>
                <span className="text-xs text-gray-400">2h · Public</span>
              </div>
            </div>

            {/* 3 DOT */}
            <button
              onClick={() =>
                setOpenEdit(openEdit === index ? null : index)
              }
              className="text-gray-400 hover:text-white"
            >
              <i className="ri-more-2-fill text-lg"></i>
            </button>

            {/* DROPDOWN */}
            {openEdit === index && (
              <div className="absolute right-4 top-12 z-50 w-32 bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg">
                <button className="w-full px-4 py-2 text-sm hover:bg-[#2a2a2a] text-left text-gray-300">
                  Edit
                </button>
                <button className="w-full px-4 py-2 text-sm hover:bg-[#2a2a2a] text-left text-red-400">
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="space-y-3">
            <p className="px-4 text-sm text-gray-300">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>

            <img
              src="/image/background.jpg"
              alt="post"
              className="w-full max-h-96 object-cover"
            />

            {/* ACTION BAR */}
            <div className="flex justify-around border-t border-[#2a2a2a] text-sm font-medium text-gray-400">
              <button className="py-3 hover:text-red-500 transition">
                ❤️ Like
              </button>

              <button
                onClick={() =>
                  setOpenComment(openComment === index ? null : index)
                }
                className="py-3 hover:text-[#9acd32] transition"
              >
                💬 Comment
              </button>

              <button className="py-3 hover:text-blue-400 transition">
                🔁 Share
              </button>
            </div>

            {/* COMMENT SECTION */}
            {openComment === index && (
              <div className="border-t border-[#2a2a2a] px-4 py-3 space-y-4 bg-[#121212]">

                {/* COMMENTS */}
                <div className="space-y-3">
                  {Array(2).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <Avatar image="/image/avtar.png" size="sm" />
                      <div className="bg-[#1f1f1f] rounded-xl px-3 py-2">
                        <p className="text-xs font-medium text-white">
                          Saikat
                        </p>
                        <p className="text-sm text-gray-300">
                          Nice post bhai 🔥
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* COMMENT INPUT */}
                <div className="flex items-center gap-2">
                  <Avatar image="/image/avtar.png" size="sm" />
                  <Input
                    name="comment"
                    placeholder="Write a comment..."
                  />
                  <Button
                    size="sm"
                  loading={false}
                  >
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