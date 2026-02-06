import Card from "../shared/Card"

const Friends = () => {
  return (
    <div
      className="
        grid gap-5
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
      "
    >
      {Array(20).fill(0).map((_, index) => (
        <Card
          key={index}
        >
          <div className="flex flex-col items-center p-5">

            {/* AVATAR */}
            <img
              src="/image/avtar.png"
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />

            {/* NAME */}
            <h2 className="mt-3 text-base font-semibold text-gray-900">
              Saikat
            </h2>

            {/* USERNAME / META */}
            <p className="text-sm text-gray-500">
              @saikat
            </p>

            {/* ACTION BUTTON */}
            <button
              className="
                mt-4 w-full py-2 rounded-lg
                text-sm font-medium
                bg-blue-500 text-white
                hover:bg-blue-600 transition
              "
            >
              Unfollow
            </button>

          </div>
        </Card>
      ))}
    </div>
  )
}

export default Friends
