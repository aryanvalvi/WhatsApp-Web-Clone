import Image from "next/image"
import React from "react"

const SearchResult = ({
  value,
  friends,
  onlineUsers,
  unReadMessage,
  handleAddPerson,
  formatTime,
}: {
  value: any
  friends: any
  onlineUsers: any
  unReadMessage: any
  handleAddPerson: any
  formatTime: any
}) => {
  const searchResult = friends.filter(e =>
    e.name.toLowerCase().startsWith(value)
  )

  return (
    <div>
      {searchResult.length > 0
        ? searchResult.map((e: any) => {
            return (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                  Messages
                </h3>

                <div className="space-y-1 max-h-[calc(100vh-240px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {searchResult.map((person: any) => {
                    let img1: any, img2: any
                    if (person.group) {
                      ;[img1, img2] = person.participants
                        .map((p: any) => p.user?.userImage)
                        .splice(0, 2)
                    }
                    const isOnline = onlineUsers.includes(person.id)
                    const isUnread = unReadMessage?.find(
                      (e: any) => e.roomid === person.roomId
                    )
                    // console.log(isUnread)
                    return (
                      <div
                        key={person.id}
                        className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 cursor-pointer transition-all duration-300 border border-transparent hover:border-white/10"
                        onClick={() =>
                          handleAddPerson(
                            person.id,
                            person.name,
                            person.email,
                            person.roomId,
                            person.userImage,
                            {img1, img2},
                            person.group,
                            person.id
                          )
                        }
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          {person.group === true ? (
                            <div className="relative flex items-center justify-center">
                              <Image
                                src={img1}
                                height={100}
                                width={100}
                                alt="group avatar"
                                className="h-12 w-12 rounded-full z-1 border-2 border-white"
                              ></Image>
                              <Image
                                src={img2}
                                height={100}
                                width={100}
                                alt="group avatar"
                                className="h-12 w-12 rounded-full absolute mr-5 mb-5 border-2 border-white"
                              ></Image>
                            </div>
                          ) : (
                            <Image
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 border-2 border-white"
                              src={person.userImage || "/images/user.svg"}
                              width={100}
                              height={100}
                              alt={person.name}
                            />
                          )}
                          {isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-black "></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 relative">
                          <div className="flex justify-between items-start mb-1">
                            <span className="w-full">
                              <section className="flex justify-between w-full  items-center">
                                <h4 className="font-semibold text-white truncate group-hover:text-white/90">
                                  {person.name}
                                </h4>
                                <span className="text-white text-sm">
                                  {formatTime(person.lastMessageAt)}
                                </span>
                              </section>
                              {isUnread ? (
                                <section className="flex justify-between w-full  items-center">
                                  <h4 className="text-xs text-neutral-300 mt-1">
                                    {isUnread?.latestUnreadMessage?.content}
                                  </h4>

                                  <span className="text-white rounded-full h-5 w-5 bg-[#FF8001] font-bold text-sm  -right-2 top-2 flex items-center justify-center">
                                    {unReadMessage.length}
                                  </span>
                                </section>
                              ) : (
                                <h4 className="text-xs text-neutral-300 mt-1">
                                  {person.lastMessage}
                                </h4>
                              )}
                              {/* <h4 className="text-xs text-neutral-300 mt-1">
                                     {person.email}
                                   </h4> */}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-white/60 group-hover:text-white/70">
                                {person.time}
                              </span>
                              {person.unread > 0 && (
                                <div className="bg-white text-black text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                                  {person.unread}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-white/70 truncate group-hover:text-white/80">
                            {person.message}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        : null}
    </div>
  )
}

export default SearchResult
