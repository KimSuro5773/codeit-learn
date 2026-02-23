// app/posts/[id]/page.tsx

type Props = {
  params: Promise<{ id: string }>;
};

const getPost = async (id: string) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );
  console.log("getPost 요청");
  return response.json();
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  return { title: `게시글 | ${post.title}` };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  return <div>{post.title}</div>;
}
