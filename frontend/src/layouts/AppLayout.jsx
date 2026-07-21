import { Outlet } from "react-router-dom"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { GithubDark, GithubLight } from "@/components/icon/github"
import LinkedinIcon from "@/components/icon/linkedin"
import AppSidebar from "@/components/app-sidebar"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { deleteChat } from "@/store/chat/chatActions"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader, Share, Trash2 } from "lucide-react"
import { toast } from "@/components/CustomSonner"
import { Button } from "@/components/ui/button"
import { shareChat } from "@/api/shareChat"

export default function AppLayout() {
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatId = useSelector((state) => state.chat.currentConversation);

  const handleDeleteChat = async () => {
    if (!chatId) return;
    setDeleting(true);

    try {
      dispatch(deleteChat(chatId));
      setDeleting(false);
      navigate("/");
      toast({
        title: 'Chat deleted successfully',
        description: 'The chat has been deleted permanently. You can create a new chat or select another conversation.',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete chat',
        description: 'An error occurred while trying to delete the chat. Please try again later.',
      });
    }
  }

  const handleShareChat = async () => {
    if (!chatId) return;
    setLoading(true);
    try {
      const result = await shareChat(chatId);
      if (result.success) {
        navigator.clipboard.writeText(result.link);
        toast({
          title: 'Link copied to clipboard',
          description: 'Anyone with this link can see this conversation.',
        });
      } else {
        toast({
          title: 'Failed to share chat',
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to share chat',
        description: 'An error occurred while trying to share the chat. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 items-center border-b px-4 sticky top-0 right-0 left-0 z-10 bg-background">
          <SidebarTrigger />
          <div className="flex items-center gap-4 ml-auto mr-6 sm:mr-10">
            <Link to="https://github.com/akbar506/chatgpt" target="_blank" rel="noopener noreferrer">
              <span className="hidden dark:inline"><GithubDark w="25px" h="25px" /></span>
              <span className="dark:hidden"><GithubLight w="25px" h="25px" /></span>
            </Link>
            <Link to="https://www.linkedin.com/in/akber-ali-dev/" target="_blank" rel="noopener noreferrer">
              <span><LinkedinIcon w="30px" h="30px" /></span>
            </Link>
            {chatId && (<>
              |
              <div className="flex items-center gap-2">
                <Button size="sm" className="flex items-center" disabled={loading} onClick={handleShareChat}>
                  {loading ? <Loader className="animate-spin" /> : <Share />} <span>Share</span>
                </Button>
                <Button variant="destructive" size="sm" className="flex items-center" onClick={handleDeleteChat} disabled={deleting}>
                  <Trash2 /> <span>Delete</span>
                </Button>
              </div>
            </>)}
          </div>
        </header>

        <main className="p-2 sm:p-6 h-full">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}