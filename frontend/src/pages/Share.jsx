import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getSharedChat } from "@/api/getSharedChat"
import { useParams } from "react-router-dom"
import { toast } from "@/components/CustomSonner"
import { Loader } from "lucide-react"
import MarkdownRender from "@/components/MarkdownRender"
import ResponseInfo from "@/components/ResponseInfo"
import Linkedin from "@/components/icon/linkedin"
import { GithubDark, GithubLight } from "@/components/icon/github"

export default function ShareChat() {
    const { shareToken } = useParams()
    const [chatData, setChatData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch the shared chat data using the shareToken
        const fetchChatData = async () => {
            setLoading(true)
            try {
                const { chat, messages } = await getSharedChat(shareToken)
                setChatData({ chat, messages })
                console.log("Fetched shared chat data:", chatData)
                console.log("Fetched shared:", { chat, messages })
            } catch (error) {
                toast({
                    title: error.response?.data?.message || 'Failed to load shared chat',
                    description: 'An error occurred while trying to load the shared chat. Please try again later.',
                });
            } finally {
                setLoading(false)
            }
        }
        fetchChatData()
    }, [])

    return (
        <>
            {loading ? <div className="absolute top-1/2 left-1/2"><Loader className="animate-spin" /></div> : <div className=" h-full">
                <header className="flex justify-between h-14 items-center border-b px-4 sticky top-0 right-0 left-0 z-10 bg-background">
                    <p>{chatData?.chat?.title || "Shared Chat"}</p>
                    <div className="flex items-center gap-2">
                        <Link to="https://github.com/akbar506/chatgpt" target="_blank" rel="noopener noreferrer">
                            <span className="hidden dark:inline"><GithubDark w="25px" h="25px" /></span>
                            <span className="dark:hidden"><GithubLight w="25px" h="25px" /></span>
                        </Link>
                        <Link to="https://www.linkedin.com/in/akber-ali-dev/" target="_blank" rel="noopener noreferrer">
                            <span><Linkedin w="30px" h="30px" /></span>
                        </Link>
                        |
                        <Button asChild>
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link to="/register">Register</Link>
                        </Button>
                    </div>
                </header>
                <main className="flex flex-col items-center">
                    <p className="text-muted-foreground text-xs text-center mt-3">
                        This is a copy of a shared ChatGPT Clone conversation
                    </p>
                    <div className="p-2 w-full max-w-2xl md:max-w-3xl mt-4 lg:max-w-4xl mt pb-32">
                        {chatData?.messages.map((message) => (
                            <div key={message._id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                                <div className={` ${message.role === "user" ? "bg-[#f3f3f3] dark:bg-[#212121] px-4 py-2 rounded-3xl max-w-10/12 sm:max-w-1/2" : ""}`}>
                                    <MarkdownRender content={message.content} role={message.role} />
                                    <div className={`mt-2 ${message.role === "user" ? "hidden" : ""}`}>
                                        <ResponseInfo content={message.content} promptTokens={message.promptTokens} completionTokens={message.completionTokens} totalTokens={message.totalTokens} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>}

        </>
    )
}