import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Card,
  Box,
  Pagination,
  Grid,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getRequestsSend } from "./friendSlice";
import UserCard from "./UserCard";
import SearchInput from "../../components/SearchInput";

function RequestsSend() {
  const [filterName, setFilterName] = useState("");
  const [page, setPage] = useState(1);

  const { currentPageUsers, usersById, totalUsers, totalPages } =
    useSelector((state) => state.friend);
  const users = currentPageUsers.map((userId) => usersById[userId]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRequestsSend({ filterName, page }));
  }, [filterName, page, dispatch]);
  const handleSubmid = (searchQuery) => {
    setFilterName(searchQuery);
  };
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Requests Send
      </Typography>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center">
            <SearchInput handleSubmit={handleSubmid} />
            <Box sx={{ flexGrow: 1 }} />
            <Typography
              variant="subtitle"
              sx={{ color: "text.secondary", ml: 1 }}
            >
              {totalUsers > 1
                ? `${totalUsers} requests sended`
                : totalUsers === 1
                ? `${totalUsers} request sended`
                : "No friend found"}
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, page) => setPage(page)}
            />
          </Stack>
        </Stack>
        <Grid spacing={3} my={1}>
          {users.map((user) => (
            <Grid key={user._id} item xs={12} md={4} mt={2}>
              <UserCard profile={user} />
            </Grid>
          ))}
        </Grid>
      </Card>
    </Container>
  );
}

export default RequestsSend;
