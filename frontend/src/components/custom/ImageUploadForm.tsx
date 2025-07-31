import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { LoaderCircle, Upload } from "lucide-react";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

function ImageUploadForm({ fetchData, isRoot, folderId }: { fetchData: () => void, isRoot: boolean, folderId?: string }) {
    const [imageName, setImageName] = useState("Untitled");
    const [imageFormat, setImageFormat] = useState("");
    const closeRef = useRef<HTMLButtonElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [image, setImage] = useState<File>();
    useEffect(()=>{
        if(!image){
            setImageName("Untitled");
        }
    },[image])
    const submitForm = async () => {
        setUploadingImage(true)
        if (!image || !imageName || imageFormat.trim()=="") {
            setUploadingImage(false);
            console.warn("No image found!");
            return;
        }
        const formBody: {
            fileName: string;
            isRoot: boolean;
            folderId?: string;
            file?: File;
        } = { fileName: imageName+"."+imageFormat, isRoot: isRoot };
        if (folderId) formBody.folderId = folderId;
        formBody.file = image;
        try {
            const res = await axiosInstance.post("/image", formBody, {
                timeout: 60*1000, // 60 seconds timeout
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(res.status==200){
                toast.success("Image Uploaded!");
                fetchData();
            }
        } catch (error) {
            console.error("Error while uploading image : " + (error as AxiosError).message);
        }
        closeRef.current?.click();
        setUploadingImage(false);
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button className="flex gap-2 items-center" size="lg" variant={"secondary"}><Upload /> Upload Image</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload New Image</DialogTitle>
                        <DialogDescription>
                            It will create a new image. Click the button when you&apos;re
                            done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Image Name</Label>
                            <div className="flex">
                                <Input id="name-1" className="flex-[4]" name="imageName" value={imageName} onChange={(e) => { setImageName(e.target.value) }} />
                                <Input id="name-2" className="flex-[1]" name="imageFormat" value={"."+imageFormat} disabled/>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-3">
                                <Label htmlFor="picture">Image</Label>
                                <Input id="picture" type="file" accept="image/*" onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    if (selectedFile) {
                                        console.log("File Selected : " + selectedFile.name);
                                        setImageFormat(selectedFile.name.split(".")[1]);
                                        setImageName(selectedFile.name.split(".")[0]);
                                        setImage(selectedFile);
                                    } else {
                                        setImage(undefined);
                                        setImageFormat("");
                                        setImageName("Untitled");

                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose ref={closeRef} asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={uploadingImage} onClick={() => { submitForm() }}>{uploadingImage ? "Uploading Image" : "Upload Image"} {uploadingImage && <LoaderCircle className="animate-spin"/>}</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
export default ImageUploadForm