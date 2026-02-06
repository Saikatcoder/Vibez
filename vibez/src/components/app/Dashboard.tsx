import Avatar from "../shared/Avatar"
import Button from "../shared/Button"

const Dashboard = () => {
  return (
    <div className="p-4 lg:p-6 bg-gray-100 min-h-full">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Button type="primary">Create Post</Button>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Posts", count: "128" },
          { label: "Friends", count: "1.2K" },
          { label: "Messages", count: "86" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow text-center"
          >
            <h2 className="text-2xl font-bold">{item.count}</h2>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex flex-col items-center text-center">
            <Avatar image="/image/avtar.png" size="lg" />
            <h2 className="mt-3 font-semibold">John Doe</h2>
            <p className="text-sm text-gray-500">@johndoe</p>

            <div className="flex gap-6 mt-4">
              <div>
                <p className="font-semibold">820</p>
                <span className="text-xs text-gray-500">Followers</span>
              </div>
              <div>
                <p className="font-semibold">310</p>
                <span className="text-xs text-gray-500">Following</span>
              </div>
            </div>

            <Button className="mt-4 w-full">Edit Profile</Button>
          </div>
        </div>

        {/* CENTER: FEED PREVIEW */}
        <div className="lg:col-span-2 space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar image="/image/avtar.png" size="sm" />
                <div>
                  <p className="font-medium text-sm">John Doe</p>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                This is a sample post preview like Instagram / Facebook feed.
              </p>

              <div className="h-40 bg-gray-200 rounded-lg"></div>

              <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span>❤️ 120 Likes</span>
                <span>💬 45 Comments</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
