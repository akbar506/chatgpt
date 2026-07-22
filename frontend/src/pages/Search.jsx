import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Search() {
    usePageTitle("Search");
    const [searchQuery, setSearchQuery] = useState("");
    const conversations = useSelector((state) => state.chat.conversations)

    return (
        <>
            <div className="flex flex-col items-center h-full mt-20">
                <div className="mb-32 w-full max-w-xl space-y-6">
                    <div className="flex items-center rounded-4xl justify-between border-2 px-3 py-2 relative dark:bg-[#212121]">
                        <SearchIcon />
                        <Input
                            placeholder="Search by title"
                            className="border-0 focus-visible:ring-0 dark:bg-[#212121] field-sizing-content max-h-40 overflow-y-auto rounded-4xl min-h-8 font-normal resize-none outline-none text-lg sm:text-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            id="form-rhf-demo-title"
                            autoComplete="off"
                        />
                    </div>
                    {/* Filter out the conversation which includes the characters of user input */}
                    <div className="flex flex-col gap-4">
                        <p className="text-lg font-semibold ml-2 text-muted-foreground">Recent</p>
                        {conversations.filter((conversation) =>
                            conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((conversation) => (
                            <Link to={`/chat/${conversation._id}`} key={conversation._id} className="bg-[#212121] p-4 rounded-4xl">
                                <div>
                                    <h3 className=" ">{conversation.title}</h3>
                                    <p className="text-gray-400">{conversation.lastMessage}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </>
    )
}
