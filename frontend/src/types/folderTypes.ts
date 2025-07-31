export type FolderDataType = {
  _id: string;
  name: string;
  isRoot: boolean;
  createdAt: string;
  updatedAt: string;
  child?: FolderDataType[];
  parent?: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
  };
}

 