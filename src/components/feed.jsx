import Post from "./Posts";

export default function Feed({ data }) {
    // console.log(data,'i am data')
  return (
    <div>
      {data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
