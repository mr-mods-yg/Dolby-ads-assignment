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
import { useRef, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Plus } from "lucide-react";
import type { AxiosError } from "axios";

function DialogForm({ fetchData, isRoot, folderId }: { fetchData: () => void, isRoot: boolean, folderId?: string }) {
  const [folderName, setFolderName] = useState("Untitled");
  const closeRef = useRef<HTMLButtonElement>(null);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const submitForm = async () => {
    setCreatingFolder(true);
    const formBody : {
        folderName: string;
        isRoot: boolean,
        parent?: string;
    }= {
      folderName,
      isRoot: isRoot
    };
    if(!isRoot){
        formBody.parent = folderId;
    }
    try {
      await axiosInstance.post("/folder/create", formBody);
      fetchData();
    } catch (error) {
      console.error("Error while making folder : "+(error as AxiosError).message);
    }
    closeRef.current?.click();
    setCreatingFolder(false);
  }
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="flex gap-2 items-center" size="lg" variant={"secondary"}><Plus /> Create New Folder</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              It will create a new folder. Click the button when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Folder Name</Label>
              <Input id="name-1" name="name" value={folderName} onChange={(e) => { setFolderName(e.target.value) }} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose ref={closeRef} asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={creatingFolder} onClick={() => { submitForm() }}>{creatingFolder ? "Creating Folder" : "Create Folder"}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
export default DialogForm