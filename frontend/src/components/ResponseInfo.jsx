import { Copy } from "lucide-react";
import { Button } from "./ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ResponseInfo({ content, totalResponseTime, promptTokens, completionTokens, totalTokens }) {
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Text copied to clipboard successfully!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
    return (
        <div className="flex flex-col justify-center mt-2">

            <div className="flex space-x-2 items-center">

                <Tooltip>
                    <TooltipTrigger>
                        <Button size="xs" variant="outline" className="p-3" onClick={() => copyToClipboard(content)}><Copy /></Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-primary-foreground text-primary">
                        <p>Copy to Clipboard</p>
                    </TooltipContent>
                </Tooltip>

                {/* <Tooltip>
                    <TooltipTrigger>
                        <Button size="xs" variant="outline" className="p-3 text-muted-foreground cursor-default">{totalResponseTime}s</Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-primary-foreground text-primary">
                        <p>Total Response Time</p>
                    </TooltipContent>
                </Tooltip> */}

                <Tooltip>
                    <TooltipTrigger>
                        <Button size="xs" variant="outline" className="p-3 text-muted-foreground cursor-default">{promptTokens} </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-primary-foreground text-primary">
                        <p>Prompt Tokens</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <Button size="xs" variant="outline" className="p-3 cursor-default text-muted-foreground">{completionTokens}</Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-primary-foreground text-primary">
                        <p>Completion Tokens</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <Button size="xs" variant="outline" className="p-3 cursor-default text-muted-foreground">{totalTokens}</Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-primary-foreground text-primary">
                        <p>Total Tokens</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}