import Feed from "@/components/feed";
import Input from "@/components/input";
import { getallPosts } from "@/lib/actions/post";

const data=getallPosts()

export default async function Home() {
  
const data= await getallPosts()

  return (
    <div className='min-h-screen max-w-xl mx-auto border-r border-l'>
      <div className='py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'>
        <h2 className='text-lg sm:text-xl font-bold'>Home</h2>
      </div>
      <Input />
      <Feed data={data} />
    </div>
  );  
}
