import Avatar from "../shared/Avatar"
import Button from "../shared/Button"

const Dashboard = () => {
  return (
    <div className="p-4 lg:p-6 bg-[#0d0d0d] min-h-full text-white">

      {/* TOP STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Posts", count: "128" },
          { label: "Friends", count: "1.2K" },
          { label: "Messages", count: "86" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#161616] border border-[#2a2a2a] p-4 rounded-xl text-center hover:scale-[1.02] transition"
          >
            <h2 className="text-2xl font-bold text-[#9acd32]">{item.count}</h2>
            <p className="text-sm text-gray-400">{item.label}</p>
          </div>
        ))}
      </div>

      {/* ACTION */}
      <div className="flex justify-between mb-6">
        <Button className="bg-[#9acd32] text-black hover:bg-[#86b82c]">
          Create Post
        </Button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar image="/image/avtar.png" size="lg" />
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#161616]"></span>
            </div>

            <h2 className="mt-3 font-semibold">John Doe</h2>
            <p className="text-sm text-gray-400">@johndoe</p>

            <div className="flex gap-6 mt-4">
              <div>
                <p className="font-semibold">820</p>
                <span className="text-xs text-gray-400">Followers</span>
              </div>
              <div>
                <p className="font-semibold">310</p>
                <span className="text-xs text-gray-400">Following</span>
              </div>
            </div>

            <Button className="mt-4 w-full bg-[#1f1f1f] hover:bg-[#2a2a2a]">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* FEED */}
        <div className="lg:col-span-2 space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-4 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar image="/image/avtar.png" size="sm" />
                  <div>
                    <p className="font-medium text-sm">John Doe</p>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-3">
                  This is a sample post preview like Instagram / Facebook feed.
                </p>

                <div className="h-40 bg-[#1f1f1f] rounded-lg"></div>

                <div className="flex justify-between mt-3 text-sm text-gray-400">
                  <span className="hover:text-[#9acd32] cursor-pointer">❤️ 120 Likes</span>
                  <span className="hover:text-[#9acd32] cursor-pointer">💬 45 Comments</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard