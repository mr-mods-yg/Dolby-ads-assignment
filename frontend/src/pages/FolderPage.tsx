import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
import { Folder, Image } from "lucide-react";
import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import DialogForm from "@/components/custom/DialogForm";
import { useNavigate, useParams } from "react-router";
import type { FolderDataType } from "@/types/folderTypes";
import ImageUploadForm from "@/components/custom/ImageUploadForm";
import type { ImageDataType } from "@/types/imageTypes";
import { PhotoProvider, PhotoView } from "react-photo-view";

function FolderPage() {
    const { folderId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<FolderDataType>();
    const [folderData, setFolderData] = useState<FolderDataType[]>();
    const [imageData, setImageData] = useState<ImageDataType[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const fetchData = async () => {
        try {
            const res = await axiosInstance.get('/folder/' + folderId);
            if (res.status === 200) {
                setData(res.data.allData);
                setFolderData(res.data.allData?.child);
                setImageData(res.data.allData?.childImages);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setError((err as AxiosError).message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folderId])
    const totalItems = (folderData?.length ?? 0) + (imageData?.length ?? 0);

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;
    return (
        <div className="h-screen flex flex-col justify-start items-center text-white gap-5 sm:mx-20 lg:mx-30 mt-30">
            <h1 className="text-2xl poppins-bold">Image Drive</h1>
            <DialogForm fetchData={fetchData} isRoot={false} folderId={folderId} />
            <ImageUploadForm fetchData={fetchData} isRoot={false} folderId={folderId} />
            <PhotoProvider
                toolbarRender={({ index }) => {
                    if (!imageData || !imageData[index]) return null;
                    return (
                        <div className="text-white text-lg font-medium opacity-70">
                            {imageData[index].name}
                        </div>
                    );
                }}
            >
                <Table>
                    <TableCaption>A list of all your folders and images.</TableCaption>
                    <TableHeader>
                        <TableRow >
                            <TableHead className="w-[150px] text-white">Name</TableHead>
                            <TableHead className="text-white">Owner</TableHead>
                            <TableHead className="text-white">UpdatedAt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow key={"back"} onClick={() => navigate(data?.parent ? "/folder/" + data.parent : "/dashboard")} className="w-full">
                            <TableCell className="font-medium flex gap-2 items-center"><Folder /> ..</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {folderData?.map((dataItem) => (
                            <TableRow key={dataItem._id} onClick={() => navigate("/folder/" + dataItem._id)}>
                                <TableCell className="font-medium flex gap-2 items-center"><Folder /> {dataItem.name}</TableCell>
                                <TableCell>{dataItem.owner.fullname}</TableCell>
                                <TableCell>{dataItem.updatedAt}</TableCell>
                            </TableRow>
                        ))}
                        {imageData?.map((dataItem) => (
                            <PhotoView
                                src={dataItem.url}
                                key={dataItem._id}
                            >
                                <TableRow className="cursor-pointer">
                                    <TableCell className="font-medium flex gap-2 items-center">
                                        <Image /> {dataItem.name}
                                    </TableCell>
                                    <TableCell>{dataItem.owner.fullname}</TableCell>
                                    <TableCell>{dataItem.updatedAt}</TableCell>
                                </TableRow>
                            </PhotoView>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total Items : {totalItems}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </PhotoProvider>

        </div>
    )
}

export default FolderPage