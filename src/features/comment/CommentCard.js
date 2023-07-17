import React from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { fDate } from "../../ultils/formatTime";
import CommentReaction from "./CommentReaction";
import { deleteComment } from "./commentSlice";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
function CommentCard({ comment, postId }) {
  const dispatch = useDispatch();

  const { user } = useAuth();
  const { currentPage } = useSelector((state) => ({
    currentPage: state.comment.currentPageByPost[postId] || 1,
  }));

  const handleDeleteComment = () => {
    const choice = window.confirm("Do you want to delete this comment ???");
    if (choice === true) {
      if (user._id === comment.author._id) {
        dispatch(
          deleteComment({
            commentId: comment._id,
            postId,
            currentPage,
          })
        );
      } else {
        toast.error("You can't delete other people's comment");
      }
    }
  };
  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Stack
            direction="row"
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            sx={{ mb: 0.5 }}
          >
            <Typography variant="caption" sx={{ color: "text.disables" }}>
              {fDate(comment.createdAt)}
            </Typography>
            <IconButton onClick={handleDeleteComment}>
              <Button>Delete</Button>
            </IconButton>
          </Stack>
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>
    </Stack>
  );
}

export default CommentCard;
