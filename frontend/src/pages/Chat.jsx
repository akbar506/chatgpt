import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader, Loader2 } from "lucide-react";
import ResponseInfo from "@/components/ResponseInfo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Switch } from "@/components/ui/switch"
import { messageSchema } from "@/schema/messageSchema";
import { getMessages } from "@/api/getMessages";
import MarkdownRender from "@/components/MarkdownRender";
import { animateScroll } from 'react-scroll';
import { socketClient } from "@/socket/socket";
import { toast } from "@/components/CustomSonner";
import { setInitialMessage, setCurrentConversation } from "@/store/chat/chatSlice";
import { nanoid } from 'nanoid'
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Chat() {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [chunkedResponse, setChunkedResponse] = useState("");
    const [generating, setGenerating] = useState(false);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const { initialMessage, conversations } = useSelector((state) => state.chat);
    const { accessToken } = useSelector((state) => state.auth);
    const chatTitle = conversations.find((conversation) => conversation._id === id)?.title;

    usePageTitle(chatTitle || "Chat");

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
            thinkingLevel: "Medium",
            stream: true,
        }
    });

    // Scroll options for react-scroll
    const options = {
        duration: 500,
        smooth: true,
    };

    // Handle Enter key press to submit the form
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            form.handleSubmit(onSubmit)();
        }
    };

    // If there's an initial message, submit it after a short delay
    useEffect(() => {
        if (initialMessage) {
            const data = {
                content: initialMessage,
                thinkingLevel: "Medium",
                stream: true,
                chat: id,
            }
            setTimeout(() => {
                onSubmit(data);
                dispatch(setInitialMessage(null));
            }, 500);
        }
    }, [id, initialMessage, dispatch]);

    // Fetch messages for the current conversation when the component mounts or when the conversation ID changes
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsMessageLoading(true);
                const messages = await getMessages(id);
                setMessages(messages.messages || []);

            } catch (error) {
                toast({
                    title: 'Error fetching messages',
                    description: error.message || 'An error occurred while trying to fetch messages. Please try again later.',
                    type: "error",
                });
                navigate("/");
            } finally {
                setIsMessageLoading(false);
            }
        };
        fetchMessages();
        // Save the current conversation id in chat slice (store)
        dispatch(setCurrentConversation(id));
        setTimeout(() => {
            // After 500 ms, it will scroll down the page to bottom
            // Why animate after 500 ms? Because content in component not fully render immediately.
            animateScroll.scrollToBottom(options);
        }, 500);

        return () => {
            // When the component unmount, then set the current conversation to null
            dispatch(setCurrentConversation(null));
        }
    }, [id]);

    const onSubmit = (data) => {
        setGenerating(true);
        try {
            if (accessToken) {
                // If access token exists, connect to server
                const socket = socketClient(accessToken);
                socket.connect();

                socket.on("connect", () => { });

                // Send the MessagePayload to the server when the form is submitted
                let messagePayload = {
                    chat: id,
                    content: data.content,
                    thinkingLevel: data.thinkingLevel,
                    stream: data.stream,
                }
                socket.emit("ai-message", messagePayload);

                // save the new user prompt to messages
                setMessages((prevMessages) => [...prevMessages, { _id: nanoid(), role: "user", content: messagePayload.content }]);

                animateScroll.scrollToBottom(options); // Scroll down to bottom

                // If user turn on the streaming response, then it receives the chunks from server
                if (messagePayload.stream) {
                    socket.on("ai-chunk", (chunk) => {
                        setChunkedResponse((prev) => prev + chunk.content); // Temporary save chunks to chunk state 
                        animateScroll.scrollToBottom(options); // After each receive, it scroll down
                    })
                }
                // It receive full response from the server with response detail
                socket.on("ai-response", (response) => {
                    setMessages((prevMessages) => [...prevMessages, { _id: nanoid(), ...response }]);
                    setChunkedResponse("");
                    form.reset({ content: "", thinkingLevel: form.getValues("thinkingLevel"), stream: form.getValues("stream") });
                    setGenerating(false);
                    animateScroll.scrollToBottom(options);
                    socket.disconnect();
                });
                // If any error occured, "ai-response-error" event will receive the error message and display on screen.
                socket.on("ai-response-error", (error) => {
                    toast({
                        title: error.title || 'Failed to generate response',
                        description: 'An error occurred while trying to generate the response. Please try again later.',
                        type: "error",
                    });
                    socket.disconnect();
                    setGenerating(false);
                });
            }
        } catch (error) {
            setGenerating(false);
        }
    }

    if (isMessageLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center h-full">
                <div className="p-2 w-full max-w-3xl pb-32">
                    {/* Render all the messges. If role is user then message is placed on right side with background color and if role is model then it is placed on left side with no background color but with response detail. */}
                    {messages.map((message) => (
                        <div key={message._id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                            <div className={` ${message.role === "user" ? "bg-[#f3f3f3] dark:bg-[#212121] px-4 py-2 rounded-3xl max-w-10/12 sm:max-w-1/2" : ""}`}>
                                <MarkdownRender content={message.content} role={message.role} />
                                <div className={`mt-2 ${message.role === "user" ? "hidden" : ""}`}>
                                    <ResponseInfo content={message.content} promptTokens={message.promptTokens} completionTokens={message.completionTokens} totalTokens={message.totalTokens} />
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* It will start displayed when user submit prompt, from that time to the first token will be received. */}
                    {generating && (<div className="min-h-96">
                        {generating && !chunkedResponse && (
                            <Marker role="status">
                                <MarkerIcon>
                                    <Loader2 className="animate-spin" />
                                </MarkerIcon>
                                <MarkerContent className="shimmer">Thinking...</MarkerContent>
                            </Marker>
                        )}
                        {/* It will only be display during AI response Text Streaming */}
                        {generating && chunkedResponse && (
                            <div className="flex justify-start mb-2">
                                <div className="rounded-lg">
                                    <MarkdownRender content={chunkedResponse} />
                                    <span className={`inline-block w-4 h-4 bg-current align-middle rounded-full`} />
                                </div>
                            </div>
                        )}
                    </div>)}
                </div>
                {/* User Input */}
                <div className="p-2 w-full max-w-3xl bottom-4 space-y-3 fixed">
                    <p className="text-xs select-none text-muted-foreground text-center">ChatGPT Clone can make mistakes. Check important info</p>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 bg-white rounded-4xl border-2 px-3 py-2 relative dark:bg-[#212121]">
                        <div className="flex items-center justify-between">
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (

                                    <Textarea
                                        placeholder="Ask Anything"
                                        className="border-0 focus-visible:ring-0 dark:bg-[#212121] field-sizing-content max-h-40 overflow-y-auto rounded-4xl min-h-8 font-normal w-10/12 resize-none outline-none text-lg sm:text-xl"
                                        {...field}
                                        id="form-rhf-demo-title"
                                        autoComplete="off"
                                        rows="1"
                                        onKeyDown={handleKeyDown}
                                    />
                                )}
                            />
                            <Button
                                type="submit"
                                className="rounded-full h-9 absolute bottom-9 right-2.5"
                                disabled={generating}
                            >
                                {generating ? <Loader2 className="animate-spin" /> : <ArrowUp />}
                            </Button>
                            <Controller
                                name="thinkingLevel"
                                control={form.control}
                                render={({ field }) => (
                                    <Select {...field} onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full max-w-20 rounded-xl absolute bottom-9 right-12 border-0 focus-visible:ring-0 outline-none bg-transparent hover:bg-transparent">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Thinking Level</SelectLabel>
                                                <SelectItem key={"high"} value={"High"}>
                                                    High
                                                </SelectItem>
                                                <SelectItem key={"medium"} value={"Medium"}>
                                                    Medium
                                                </SelectItem>
                                                <SelectItem key={"low"} value={"Low"}>
                                                    Low
                                                </SelectItem>
                                            </SelectGroup>
                                            <SelectSeparator />
                                            <SelectGroup>
                                                <SelectItem key={"minimal"} value={"Minimal"}>
                                                    Minimal
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="flex items-center space-x-2 pl-2">
                            <Controller
                                name="stream"
                                control={form.control}
                                render={({ field }) => (
                                    <Switch
                                        id="stream"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="stream">Stream</Label>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
