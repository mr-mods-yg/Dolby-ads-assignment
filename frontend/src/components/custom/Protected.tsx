import useAuthStore, { type AuthStore } from "@/store/useAuthStore";
import { useEffect, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type ProtectedProps = {
    children: ReactNode
}

function Protected(props: ProtectedProps) {
    const [userValid, setUserValid] = useState(false);
    const navigate = useNavigate();
    const { user, check, isChecking } = useAuthStore() as AuthStore;
    useEffect(() => {
        if(user){
            setUserValid(true);
            return;
        }
        const token = localStorage.getItem("token");
        if (!token || typeof token != "string") {
            toast.error("Session not found")
            navigate("/login");
            return;
        }
        check(token).then((res) => {
            if (!res) {
                localStorage.removeItem("token");
                navigate("/login");
            }
            else {
                setUserValid(res);
            }
        });
    }, [user, check, navigate])

    if (userValid) return props.children;
    else if (isChecking) {
        return <div className="w-screen h-screen flex justify-center items-center text-white text-2xl poppins-bold">Please wait, Checking your account details...</div>
    }
    return <div className="w-screen h-screen flex justify-center items-center text-white text-2xl poppins-bold">UnAuthorized, Please go and login again!</div>;

}

export default Protected
