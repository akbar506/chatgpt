import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch"
import { messageSchema } from "@/schema/messageSchema";
import { getMessages } from "@/api/getMessages";
import MarkdownRender from "@/components/MarkdownRender";
import { animateScroll } from 'react-scroll';
import { socketClient } from "@/socket/socket";

export default function Chat() {

    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [generating, setGenerating] = useState(false);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const { initialMessage } = useSelector((state) => state.chat);
    const { accessToken } = useSelector((state) => state.auth);

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
            thinkingLevel: "Medium",
            stream: true,
        }
    });

    const options = {
        // Your options here, for example:
        duration: 500,
        smooth: true,
    };

    useEffect(() => {
        if (accessToken) {
            const socket = socketClient(accessToken);
            socket.connect();

            socket.on("connect", () => {
                console.log("Connected to the server via WebSocket");
            });
        }
    }, [id, accessToken]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsMessageLoading(true);
                const messages = await getMessages(id);
                setMessages(messages.messages || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setIsMessageLoading(false);
            }
        };
        fetchMessages();
        setTimeout(() => {
            animateScroll.scrollToBottom(options);
        }, 500);
    }, [id]);

    const onSubmit = (data) => {
        console.log("Form submitted with data:", data);
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
                    {messages.map((message) => (
                        <div key={message._id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}>
                            <div className={`p-3 rounded-lg ${message.role === "user" ? "bg-[#212121] max-w-10/12 sm:max-w-1/2  text-white" : ""}`}>
                                <MarkdownRender content={message.content} />
                                <div className={`mt-2 ${message.role === "user" ? "hidden" : ""}`}>
                                    <ResponseInfo content={message.content} promptTokens={message.promptTokens} completionTokens={message.completionTokens} totalTokens={message.totalTokens} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-2 w-full max-w-3xl bottom-4 space-y-3 fixed">
                    <p className="text-xs select-none text-muted-foreground text-center">ChatGPT Clone can make mistakes. Check important info</p>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 rounded-4xl border-2 px-3 py-2 relative bg-[#212121]">
                        <div className="flex items-center justify-between">
                            <Controller
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (

                                    <Textarea
                                        placeholder="Ask Anything"
                                        className="border-0 focus-visible:ring-0  bg-inherit] field-sizing-content max-h-40 overflow-y-auto rounded-4xl min-h-8 font-normal w-10/12 resize-none outline-none text-lg sm:text-xl"
                                        {...field}
                                        id="form-rhf-demo-title"
                                        autoComplete="off"
                                        rows="1"
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
