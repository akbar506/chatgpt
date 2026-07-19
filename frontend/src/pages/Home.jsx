import { useSelector } from "react-redux";

export default function Home() {
    const auth = useSelector((state) => state.auth);
        console.log("auth:", auth);
    return (
        <>
            Home Page
        </>
    )
}