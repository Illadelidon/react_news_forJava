export interface ICategoryCreate{
    name:string;
    description:string;
}

export interface ICategoryItem{
    id:number;
    name:string;
}
export interface ICategoryEdit {
    id: number;
    name: string;
}
export interface IGetCategories{
    content:ICategoryItem[]
    totalPages: number,
    totalElements: number,
}
// export interface ICategorySearch{
//     keyword?: string,
//     page: number,
//     size: number
// }