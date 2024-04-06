import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";

function PostItem({ post }) {
  return (
    <div>
      <img src={post.imageUrl} alt="Post" />
      <p>{post.description}</p>
      <LikeButton postId={post.id} />
      <CommentSection postId={post.id} />
    </div>
  );
}

export default PostItem;
