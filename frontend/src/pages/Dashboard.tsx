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
import { useNavigate } from "react-router";
import ImageUploadForm from "@/components/custom/ImageUploadForm";
import type { ImageDataType } from "@/types/imageTypes";
import { PhotoProvider, PhotoView } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
import { Input } from "@/components/ui/input";

type FolderDataType = {
  _id: string;
  name: string;
  isRoot: boolean;
  createdAt: string;
  updatedAt: string;
  child?: string;
  parent?: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
  };
}

function Dashboard() {
  const [folderData, setFolderData] = useState<FolderDataType[]>();
  const [imageData, setImageData] = useState<ImageDataType[]>();
  const [searchImageData, setSearchImageData] = useState<ImageDataType[]>();
  const [search, setSearch] = useState<string>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get('/folder/root');
      if (res.status === 200) {
        if (res.data.folders) {
          setFolderData(res.data.folders);
          setImageData(res.data.images);
        }
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
  }, [])
   useEffect(() => {
    const counter = setTimeout(()=>{
      if(search) axiosInstance.get("/image/search/"+search).then((res)=>{
        setSearchImageData(res.data.searchData);
      })
    }, 1000);
      return ()=>{
        clearTimeout(counter);
      }
  }, [search])
  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  
  const totalItems = (folderData?.length ?? 0) + (imageData?.length ?? 0);
  
  return (
    <div className="h-screen flex flex-col justify-start items-center text-white gap-5 sm:mx-20 lg:mx-30 mt-30 mb-40">
      <h1 className="text-2xl poppins-bold">Image Drive</h1>
      <DialogForm fetchData={fetchData} isRoot={true} />
      <ImageUploadForm fetchData={fetchData} isRoot={true} />
      <Input placeholder="Search for Images across all your folders" value={search} onChange={(e)=>{
        if(e.target.value!="") setSearch(e.target.value)
        else setSearch(undefined);
        }}/>
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
        {search && searchImageData && <Table>
          <TableCaption>Search results that were found</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-white">Name</TableHead>
              <TableHead className="text-white">Owner</TableHead>
              <TableHead className="text-white">UpdatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {searchImageData?.map((dataItem) => (
              <PhotoView 
                src={dataItem.url} 
                key={dataItem._id}
              >
                <TableRow className="cursor-pointer">
                  <TableCell className="font-medium flex gap-2 items-center max-w-50 lg:max-w-150 truncate">
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
              <TableCell colSpan={3}>Found Images : {searchImageData?.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>}

        <Table>
          <TableCaption>A list of all your folders and images.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] text-white">Name</TableHead>
              <TableHead className="text-white">Owner</TableHead>
              <TableHead className="text-white">UpdatedAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {folderData?.map((dataItem) => (
              <TableRow key={dataItem._id} onClick={() => navigate("/folder/" + dataItem._id)}>
                <TableCell className="font-medium flex gap-2 items-center max-w-50 lg:max-w-150 truncate">
                  <Folder /> {dataItem.name}
                </TableCell>
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
                  <TableCell className="font-medium flex gap-2 items-center max-w-50 lg:max-w-150 truncate">
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

export default Dashboard