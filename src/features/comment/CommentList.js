import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getComments } from "./commentSlice";
import { COMMENTS_PER_POST } from "../../app/config";
import { Pagination, Stack, Typography } from "@mui/material";
import CommentCard from "./CommentCard";
import LoadingScreen from "../../components/LoadingScreen";

function CommentList({ postId }) {
  const {
    commentsByPost,
    commentsById,
    totalComments,
    isLoading,
    currentPage,
  } = useSelector(
    (state) => ({
      commentsByPost: state.comment.commentsByPost[postId],
      totalComments: state.comment.totalCommentsByPost[postId],
      currentPage: state.comment.currentPageByPost[postId] || 1,
      commentsById: state.comment.commentsById,
      isLoading: state.comment.isLoading,
    }),
    shallowEqual
  );
 

  const toltalPages = Math.ceil(totalComments / COMMENTS_PER_POST);

  const dispatch = useDispatch();
  let renderComment;
  if (commentsById) {
    const comments = commentsByPost?.map((commentId) => commentsById[commentId]);
    renderComment = (
      <Stack spacing={1.5}>
        {comments?.map((comment) => (
          <CommentCard key={comment._id} comment={comment} postId = {postId} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    renderComment = <LoadingScreen />;
  }

  useEffect(() => {
    if (postId) dispatch(getComments({ postId }));
  }, [postId, dispatch]);
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalComments > 1
            ? `${totalComments} comments`
            : totalComments === 1
            ? `${totalComments} comment`
            : "No comment"}
        </Typography>
        {totalComments > COMMENTS_PER_POST && (
          <Pagination
            count={toltalPages}
            page={currentPage}
            onChange={(e, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComment}
    </Stack>
  );
}

export default CommentList;
