/* eslint-disable @next/next/no-img-element */
import { getPostsById } from '@/lib/actions/post';
import { getCommentsByPostId } from '@/lib/actions/comment';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Icons from '@/components/icons';
import moment from 'moment';

export default async function PostPage({ params }) {
  
  const { id } = await params;
  const post = await getPostsById(id);
  const comments = await getCommentsByPostId(id);
  // console.log(comments)
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get('user_id')?.value;

  if (!post || post.error) {
    return <div className="p-5 text-red-500 text-center">Post not found.</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex p-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition">
        <Link href={`/user/${post.username}`}>
          <img
            src={post?.profileImg}
            alt="user-img"
            className="h-11 w-11 rounded-full mr-4 object-cover"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-sm font-semibold">@{post.username}</span>
            <span className="text-xs text-gray-400">• {moment(post.createdAt).fromNow()}</span>
          </div>
          <p className="text-sm my-3 text-gray-800 leading-relaxed">{post.text}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="rounded-2xl border border-gray-100 max-h-[450px] object-cover"
            />
          )}
          <div className="mt-2">
            <Icons post={post} currentUserId={currentUserId} />
          </div>
        </div>
      </div>

      {/* 🔽 Comments Section */}
      <div className="mt-8 bg-gray-50 p-4 rounded-xl">
        <h2 className="font-semibold text-lg mb-4 text-gray-800">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start mb-4 bg-white p-3 rounded-lg shadow-sm"
            >
              <img
                src={comment.user.avatar}
                alt="comment-user"
                className="h-8 w-8 rounded-full mr-3 object-cover"
              />
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  @{comment.user.username}
                </div>
                <p className="text-sm text-gray-700 mb-1">{comment.comment}</p>
                <span className="text-xs text-gray-400">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
