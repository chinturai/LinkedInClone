import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import { LoaderIcon , Frown} from "lucide-react";

const PostPage = () => {
    const { postId } = useParams();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: post, isLoading } = useQuery({
        queryKey: ["post", postId],
        queryFn: () => axiosInstance.get(`/posts/${postId}`),
    });

    if (isLoading) return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />  
            </div>

            <div className='flex col-span-1 lg:col-span-3 items-center ml-16'>
                <LoaderIcon/>  
                <h1 className="font-bold text-2xl"> Loading</h1>
            </div>
        </div>
    )
    if (!post?.data) return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='hidden lg:block lg:col-span-1'>
            <Sidebar user={authUser} />  
        </div>

        <div className='flex col-span-1 lg:col-span-3 items-center ml-16'>
            <Frown />
            <h1 className="font-bold text-2xl"> Post Not Found</h1>
        </div>
    </div>
    );

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>

            <div className='col-span-1 lg:col-span-3'>
                <Post post={post.data} />
            </div>
        </div>
    );
};
export default PostPage;