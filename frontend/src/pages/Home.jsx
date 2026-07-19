import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createChat } from "@/store/chat/chatActions";
import { chatSchema } from "@/schema/chatSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function Home() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const [placeholder, setPlaceholder] = useState("Ask Anything");
    
    const form = useForm({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const onSubmit = async (data) => {
        const createdChat = await dispatch(createChat(data));
        if (createdChat?._id) {
            navigate(`/chat/${createdChat._id}`);
        }
        form.reset();
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-32 w-full max-w-2xl space-y-6">
                    <h1 className="text-center font-semibold text-xl sm:text-3xl">Get Ready to take off?</h1>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>

                        <Controller
                            name="prompt"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <div className="flex items-start px-3 py-2 relative">
                                        {field.value === "" && <span className="text-muted-foreground absolute left-13.5 bottom-6 text-sm">
                                            {placeholder}
                                        </span>}
                                        <Textarea
                                            placeholder=""
                                            className="border-0 focus-visible:ring-0 pl-10 bg-transparent min-h-11 max-h-40 overflow-y-auto rounded-4xl font-normal w-full resize-none outline-none text-lg sm:text-xl"
                                            {...field}
                                            id="form-rhf-demo-title"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        <Button
                                            type="submit"
                                            className="rounded-full h-9 absolute right-6 bottom-3"
                                        >
                                            <ArrowUp />
                                        </Button>
                                    </div>
                                </Field>
                            )}
                        />

                    </form>
                </div>
            </div>
        </>
    )
}