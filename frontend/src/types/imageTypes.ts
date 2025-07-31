export type ImageDataType = {
  _id: string;
  name: string;
  isRoot: boolean;
  createdAt: string;
  updatedAt: string;
  parent?: string;
  url: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
  };
}

 