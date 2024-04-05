export interface IPostItem {
    id: number;
    name: string;
    description: string;
    category_id: number;
    files: string[];
}
export interface ICategoryName {
    id: number,
    name: string,
}
export interface IProductCreate {
    name: string;
    description: string;
    category_id: number;
    files: File[];
}
export interface IUploadedFile {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    originFileObj: File;
    percent: number;
    size: number;
    thumbUrl: string;
    type: string;
    uid: string;
}
export interface IGetPosts {
    list: IPostItem[],
    totalCount: number
}
export interface IPostSearch{
    name?: string,
    description?: string,
    categoryId?: number,
    page: number,
    size: number
    keyword?: string,
}
export interface IPostEditPhoto{
    photo: string | undefined,
    priority: number,
}

export interface IPostEdit {
    id?: number | undefined;
    name: string,
    description: string,
    newPhotos: IPostEditPhoto[] | null,
    oldPhotos: IPostEditPhoto[] | null,
    category_id: number,
}