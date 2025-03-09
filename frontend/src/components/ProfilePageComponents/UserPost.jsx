import Post from '../Post'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { axiosInstance } from '../../lib/axios'
import { Users } from 'lucide-react'

const UserPost = ({ userData }) => {
    const { userId } = useParams();
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: userPosts, isLoading } = useQuery({
        queryKey: ["userPosts", userId || userData?._id],
        queryFn: () => axiosInstance.get(`/posts/${userId || userData?._id}`),
        enabled: !!(userId || userData?._id)
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader className="animate-spin" />
            </div>
        );
    }

    if (!userPosts?.data?.length) {
        return (
            <div className='bg-white rounded-lg shadow p-8 text-center'>
            <div className='mb-6'>
              <Users size={64} className='mx-auto text-blue-500' />
            </div>
            <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
            <p className='text-gray-600 mb-6'> This user has not made any posts yet !</p>
          </div>
        );
    }

    return (
        <div className='bg-white shadow rounded-lg p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Posts</h2>
            {userPosts?.data?.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
}

export default UserPost