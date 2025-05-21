'use client';

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-gray-500">No comments yet.</p>;
  }

  return (
    <div className="mt-6 space-y-4 max-h-64 overflow-y-auto">
      {comments.map((cmt) => (
        <div key={cmt.id} className="flex gap-3 items-start border-b pb-2">
          <img
            src={cmt.profileImg}
            alt={cmt.username}
            className="w-8 h-8 rounded-full object-cover mt-1"
          />
          <div>
            <p className="font-semibold">{cmt.username}</p>
            <p className="text-sm text-gray-700">{cmt.comment}</p>
            <p className="text-xs text-gray-400">
              {new Date(cmt.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
