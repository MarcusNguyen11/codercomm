import React, { useCallback, useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  alpha,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../ultils/formatTime";
import PostReaction from "./PostReaction";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, editPost } from "./postSlice";
import useAuth from "../../hooks/useAuth";
import {
  FTextField,
  FUploadingImage,
  FormProvider,
} from "../../components/form";
import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";

function PostCard({ post }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  const { isLoading } = useSelector((state) => state.post);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDeletePost = () => {
    const choice = window.confirm("Do you want to delete this Post ???");
    if (choice === true) {
      if (user._id === post.author._id)
        dispatch(deletePost({ postId: post._id }));
    }
  };
  const handleEdit = () => {
    setEdit(true);
  };

  const onSubmit = (data) => {
    dispatch(editPost(post._id, data)).then(() => reset());
    setEdit(false);
  };

  const yupSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
  });

  const defaultValues = {
    content: post.content,
    image: post.image,
  };

  const methods = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          "image",
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );
  const renderOptionPost = (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
    >
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle2" noWrap></Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
          noWrap
        ></Typography>
      </Box>

      <Divider sx={{ borderStyle: "dashed" }} />
      <IconButton onClick={handleProfileMenuClose}>
        <MenuItem onClick={handleDeletePost} sx={{ mx: 1 }}>
          Delete
        </MenuItem>
      </IconButton>
      <Divider sx={{ borderStyle: "dashed" }} />
      <IconButton onClick={handleProfileMenuClose}>
        {" "}
        <MenuItem onClick={handleEdit} sx={{ mx: 1 }}>
          Edit
        </MenuItem>
      </IconButton>
    </Menu>
  );
  if (edit === false) {
    return (
      <Card>
        <CardHeader
          disableTypography
          avatar={
            <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
          }
          title={
            <Link
              variant="subtitle2"
              color="text.primary"
              component={RouterLink}
              sx={{ fontWeight: 600 }}
              to={`/user/${post.author._id}`}
            >
              {post?.author?.name}
            </Link>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {fDate(post.createdAt)}
            </Typography>
          }
          action={
            <IconButton onClick={handleProfileMenuOpen}>
              <MoreVertIcon sx={{ fontSize: 30 }} />
            </IconButton>
          }
        />
        {renderOptionPost}
        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography>{post.content}</Typography>
          {post.image && (
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                height: 300,
                "& img": { objectFit: "cover", width: 1, height: 1 },
              }}
            >
              <img src={post.image} alt="post" />
            </Box>
          )}
          <PostReaction post={post} />
          <CommentList postId={post._id} />
          <CommentForm postId={post._id} />
        </Stack>
      </Card>
    );
  }
  if (edit === true) {
    return (
      <Card>
        <CardHeader
          disableTypography
          avatar={
            <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
          }
          title={
            <Link
              variant="subtitle2"
              color="text.primary"
              component={RouterLink}
              sx={{ fontWeight: 600 }}
              to={`/user/${post.author._id}`}
            >
              {post?.author?.name}
            </Link>
          }
          subheader={
            <Typography
              variant="caption"
              sx={{ display: "block", color: "text.secondary" }}
            >
              {fDate(post.createdAt)}
            </Typography>
          }
          action={
            <IconButton onClick={handleProfileMenuOpen}>
              <MoreVertIcon sx={{ fontSize: 30 }} />
              {renderOptionPost}
            </IconButton>
          }
        />
        <Stack spacing={2} sx={{ p: 3 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <FTextField
                name="content"
                multiline
                fullWidth
                rows={4}
                placeholder="Share what you are thinking here..."
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              {/* <FTextField name="image" placeholder="Image" /> */}
              {/* <input type="file" ref={fileInput} onChange={handleFile} /> */}
              <FUploadingImage
                name="image"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={isSubmitting || isLoading}
                >
                  Post
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
          <PostReaction post={post} />
          <CommentList postId={post._id} />
          <CommentForm postId={post._id} />
        </Stack>
      </Card>
    );
  }
}

export default PostCard;
