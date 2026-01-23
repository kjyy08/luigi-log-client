import { useQuery } from "@tanstack/react-query";
import { commentQueries } from "@/entities/comment/model/comment.queries";
import { CommentItem } from "./comment-item";

interface CommentListProps {
    postId: string;
    postAuthorUsername?: string;
}

export const CommentList = ({ postId, postAuthorUsername }: CommentListProps) => {
    const { data: comments, isLoading, isError } = useQuery(commentQueries.list(postId));

    if (isLoading) {
        return <div className="py-8 text-center text-muted-foreground">Loading comments...</div>;
    }

    if (isError) {
        return <div className="py-8 text-center text-red-500">Failed to load comments</div>;
    }

    if (!comments || comments.length === 0) {
        return null;
    }

    return (
        <div className="space-y-8">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.commentId}
                    comment={comment}
                    postId={postId}
                    postAuthorUsername={postAuthorUsername}
                />
            ))}
        </div>
    );
};
