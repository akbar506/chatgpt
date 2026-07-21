import { toast as sonnerToast } from "sonner";
import { CheckCircle, CheckCircle2 } from "lucide-react";

function Toast(props) {
    const { title, description, button, id } = props;

    return (
        <div className="flex rounded-lg bg-black dark:bg-white shadow-lg  w-full md:max-w-91 items-center p-4">
            <div className="flex flex-1 gap-2">
                <CheckCircle2 className="text-white dark:text-black" />
                <div className="w-full">
                    <p className="text font-medium text-white dark:text-black">{title}</p>
                    <p className="mt-1  text-white dark:text-black">{description}</p>
                </div>
            </div>
        </div>
    );
}

export function toast(toast) {
    return sonnerToast.custom((id) => (
        <Toast
            id={id}
            title={toast.title}
            description={toast.description}
        />
    ));
}