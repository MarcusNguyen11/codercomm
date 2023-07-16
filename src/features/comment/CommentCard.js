import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { fDate } from "../../ultils/formatTime";
import CommentReaction from "./CommentReaction";
import { deleteComment } from "./commentSlice";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";

function CommentCard({ comment }) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleDeleteComment = () => {
    const choice = window.confirm("Bạn có muốn xóa comment này không");
    if (choice === true) {
      if (user._id === comment.author._id)
        dispatch(deleteComment({ commentId: comment._id }));
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
