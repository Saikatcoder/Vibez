import Avatar from "../shared/Avatar"

import Input from "../shared/Input"

const Chat = () => {
  return (
    <div className="flex h-full flex-col bg-[#efeae2] lg:bg-transparent">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">

        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="space-y-4">

            {/* RECEIVED MESSAGE */}
            <div className="flex items-end gap-2 max-w-full">
              <Avatar image="/image/avtar.png" size="sm" />

              <div className="relative bg-gray-700 text-white px-4 py-2 rounded-2xl rounded-tl-sm
                max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] shadow">

                <p className="text-xs font-semibold mb-1">John Doe</p>

                {/* TEXT MESSAGE */}
                <p className="text-sm leading-relaxed wrap-break-word">
                  Lorem ipsum dolor sit amet.
                </p>

                {/* IMAGE MESSAGE */}
                {/* <img
                  src="/image/sample.jpg"
                  alt="chat"
                  className="mt-2 rounded-lg max-h-60 w-full object-cover"
                /> */}
              </div>
            </div>

            {/* SENT MESSAGE */}
            <div className="flex items-end gap-2 justify-end max-w-full">
              <div className="relative bg-green-500 text-white px-4 py-2 rounded-2xl rounded-tr-sm
                max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] shadow">

                <p className="text-xs font-semibold mb-1 text-right">
                  You
                </p>

                <p className="text-sm leading-relaxed wrap-break-word">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>

                {/* IMAGE MESSAGE */}
                {/* <img
                  src="/image/sample.jpg"
                  alt="chat"
                  className="mt-2 rounded-lg max-h-60 w-full object-cover"
                /> */}
              </div>

              <Avatar image="/image/avtar.png" size="sm" />
            </div>

          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white border-t p-2">
        <form className="flex items-center gap-2">

          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <i className="ri-attachment-line text-gray-500" />
          </button>

          <Input
            name="message"
            placeholder="Type a message..."
          />

          <button className="bg-green-500 text-white rounded py-2 px-9 gap-2 flex items-center hover:bg-green-600">
            Send
            <i className="ri-send-plane-fill text-white"></i>
          </button>

        </form>
      </div>

    </div>
  )
}

export default Chat
