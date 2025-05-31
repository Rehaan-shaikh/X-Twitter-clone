import { HiArrowLeft } from 'react-icons/hi';
import Link from 'next/link';
import { getUserByUsername } from '@/lib/actions/user';
import Post from '@/components/Posts';
import FollowButton from '@/components/FollowButton';
import { getPostsByUserId } from '@/lib/actions/post';
import { cookies } from 'next/headers';

export default async function UserPage({ params }) {
  let data = null;

  const cookieStore = await cookies(); // ✅ await here
  const userId = cookieStore.get('user_id')?.value;

  try {
    const username = params.username; // ✅ Fix: No await needed
    data = await getUserByUsername(username);  //the data VAriable INCLUDES FOLLOWERS, FOLLOWING TOO

    if (data) {
      const posts = await getPostsByUserId(data.id);
      data.posts = posts;
    }
  } catch (error) {
    console.error('Failed to fetch user or posts:', error);
  }

  return (
    <div className="max-w-xl mx-auto border-r border-l min-h-screen">
      <div className="flex items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <Link href="/" className="hover:bg-gray-100 rounded-full p-2">
          <HiArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="sm:text-lg">Back</h2>
      </div>

      {!data && (
        <h2 className="text-center mt-5 text-lg text-red-500">
          User not found
        </h2>
      )}

      {data && (
        <div className="flex items-center space-x-2 p-3 border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={data.avatar}
                alt="Profile"
                className="h-16 w-16 rounded-full object-cover"
              />
              
              <div>
                <h2 className="text-xl font-bold">
                  {data.firstName
                    ? `${data.firstName} ${data.lastName}`
                    : data.username}
                </h2>
                <p className="text-gray-500">@{data.username}</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <div>
                <span className="font-bold">{data.following.length}</span>{' '}
                Following
              </div>
              <div>
                <span className="font-bold">{data.followers.length}</span>{' '}
                Followers
              </div>
            </div>

            <div className="mt-4 flex-1">
              <FollowButton profileUser={data} userId={userId} />
            </div>
          </div>
        </div>
      )}

      {data?.posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
