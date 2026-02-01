import Avatar from "../shared/Avatar"
import Button from "../shared/Button"
import Input from "../shared/Input"

const Chat = () => {
  return (
    <div className="flex h-full flex-col">

      {/* CHAT BODY */}
      <div className="h-125 flex-1 overflow-auto space-y-12 px-2
        bg-[#efeae2] lg:bg-transparent">

        {Array(20).fill(0).map((_, index) => (
          <div className="space-y-8" key={index}>

            {/* RECEIVED */}
            <div className="flex gap-3 items-start">
              <Avatar image="/image/avtar.png" size="sm" />

              <div
                className="bg-gray-600 px-4 py-2 flex-1 relative text-white
                rounded-2xl rounded-tl-sm
                lg:rounded-xl"
              >
                <h1 className="font-medium text-white text-sm">John Doe</h1>
                <label className="text-sm">
                  Lorem ipsum
                </label>

                {/* arrow only desktop */}
                <i className="ri-arrow-left-s-fill absolute top-2 -left-6 text-4xl text-gray-600 hidden lg:block"></i>
              </div>
            </div>

            {/* SENT */}
            <div className="flex gap-3 items-start justify-end">
              <div
                className="bg-green-400 px-4 py-2 flex-1 relative text-white
                rounded-2xl rounded-tr-sm
                lg:rounded-xl"
              >
                <h1 className="font-medium text-white text-sm text-right">
                  John Doe
                </h1>
                <label className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </label>

                {/* arrow only desktop */}
                <i className="ri-arrow-right-s-fill absolute top-1 -right-6 text-4xl text-green-400 hidden lg:block"></i>
              </div>

              <Avatar image="/image/avtar.png" size="sm" />
            </div>

          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="p-3 sticky bottom-0 bg-white lg:static">
        <form className="flex items-center gap-2">
          <Input
            name="message"
            placeholder="Type a message..."
            
          />
          <Button type="success" icon="send-plane-fill" >
            Send
          </Button>
        </form>
      </div>

    </div>
  )
}

export default Chat
