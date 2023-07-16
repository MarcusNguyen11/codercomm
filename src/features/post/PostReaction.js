import { IconButton, Stack, Typography } from "@mui/material";
import ThumbUpRoundedICon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import React from "react";
import { useDispatch } from "react-redux";
import { sendPostReaction } from "./postSlice";

function PostReaction({ post }) {
  const dispatch = useDispatch();
  const handleClick = (emoji) => {
    dispatch(sendPostReaction({ postId: post._id, emoji }));
  };
  return (
    <Stack direction="row" alignItems="center">
      <IconButton onClick={() => handleClick("like")}>
        <ThumbUpRoundedICon
          sx={{ fontSize: 20, color: "primary.main" }}
        ></ThumbUpRoundedICon>
      </IconButton>
      <Typography variant="h6" mr={1}>
        {post?.reactions?.like}
      </Typography>

      <IconButton onClick={() => handleClick("dislike")}>
        <ThumbDownAltRoundedIcon
          sx={{ fontSize: 20, color: "error.main" }}
        ></ThumbDownAltRoundedIcon>
      </IconButton>
      <Typography variant="h6">{post?.reactions?.dislike}</Typography>
    </Stack>
  );
}

export default PostReaction;
