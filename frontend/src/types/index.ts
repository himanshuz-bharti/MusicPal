export interface Song{
    _id:string,
    title:string,
    artist:string,
    imageUrl:string,
    audioUrl:string,
    duration:number,
    albumId:string | null,
    year:number,
    createdAt:string,
    updatedAt:string

}
export interface Album{
    name:string,
    _id:string,
    imageUrl:string,
    artist:string,
    releaseYear:number,
    songs:Song[],
}
export interface User{
    fullname:string,
    image:string,
    clerkId:string,
}