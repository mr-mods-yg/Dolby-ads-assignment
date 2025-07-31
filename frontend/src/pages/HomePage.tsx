import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { Link } from "react-router"

function HomePage() {
    return (
        <div className="flex flex-col justify-center items-center text-white  h-screen gap-4">
            <h1 className="text-5xl font-bold">Image Drive</h1>
            <div className="flex gap-2 items-center text-lg">
                <Upload/> Upload your images now!!
            </div>
            <Link to={"/dashboard"}><Button size={"lg"}>GET STARTED</Button></Link>
        </div>
    )
}

export default HomePage
