import { setShowProfile } from "@/store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

export default function ShowProfile() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.profile);
    const showProfile = useSelector((state) => state.user.showProfile);

    const handleClose = () => {
        dispatch(setShowProfile(false));
    };

    if (!user) {
        return null;
    }

    if (showProfile) {
        return (
            <>
                <div className="fixed inset-0 z-50 flex items-center bg-black/10 backdrop-blur-xs p-2 justify-center ">
                    <div className="bg-white dark:bg-[#212121] rounded-lg p-4 w-96  ">
                        <h2 className="text-lg  mb-4">User Profile</h2>

                        <Avatar className="h-28 w-28 mx-auto rounded-full">
                            <AvatarImage src={""} alt={user.fullName.firstName} />
                            <AvatarFallback className="rounded-full text-4xl">{user.fullName.firstName.charAt(0)}{user.fullName.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-y-3 mt-4 font-light">
                            <span className="truncate border-2 rounded-lg px-3 py-2">
                                <p className="text-xs">Display Name</p>
                                {user.fullName.firstName} {user.fullName.lastName}
                            </span>
                            <span className="truncate  border-2 rounded-lg px-3 py-2">
                                <p className="text-xs">Email</p>
                                {user.email}
                            </span>
                        </div>
                        <Button
                            onClick={handleClose}
                            className="mt-4 px-4 py-2 rounded-xl"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </>
        )
    }
}