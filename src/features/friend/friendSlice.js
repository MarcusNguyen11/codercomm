import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  error: null,
  currentPageUsers: [],
  usersById: {},
  totalPages: 1,
};

const slice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { users, count, totalPages } = action.payload;
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalUsers = count;
      state.totalPages = totalPages;
    },
    sendFriendRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    declinedRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    acceptRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId, ...friendship } = action.payload;
      state.usersById[targetUserId].friendship = friendship;
    },
    cancelRequestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId } = action.payload;
      state.usersById[targetUserId].friendship = null;
      state.totalUsers = state.totalUsers - 1;
      state.totalPages = parseInt(state.totalUsers / 12) + 1;
      state.currentPageUsers = state.currentPageUsers.filter(
        (user) => user !== targetUserId
      );
    },
    removeFriendSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { targetUserId } = action.payload;
      state.usersById[targetUserId].friendship = null;
    },
    getFriendsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const { users, count, totalPages } = action.payload;
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalUsers = count;
      state.totalPages = totalPages;
    },
    getFriendRequestsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { users, count, totalPages } = action.payload;
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalUsers = count;
      state.totalPages = totalPages;
    },
    getRequestsSendSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { users, count, totalPages } = action.payload;
      console.log(action.payload);
      users.forEach((user) => (state.usersById[user._id] = user));
      state.currentPageUsers = users.map((user) => user._id);
      state.totalUsers = count;
      state.totalPages = totalPages;
      // const userId = action.payload.users._id;
      // state.currentPageUsers = state.currentPageUsers.filter(
      //   (user) => user !== userId
      // );
    },
  },
});

export default slice.reducer;

export const getUsers =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/users", { params });
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendFriendRequest = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const response = await apiService.post(`/friends/requests`, {
      to: targetUserId,
    });
    dispatch(
      slice.actions.sendFriendRequestSuccess({ ...response.data, targetUserId })
    );
    toast.success("Request sent");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const declinedRequest = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const reponse = await apiService.put(`/friends/requests/${targetUserId}`, {
      status: "declined",
    });
    dispatch(
      slice.actions.declinedRequestSuccess({ ...reponse.data, targetUserId })
    );
    toast.success("Request declined");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const acceptRequest = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const reponse = await apiService.put(`/friends/requests/${targetUserId}`, {
      status: "accepted",
    });
    dispatch(
      slice.actions.acceptRequestSuccess({ ...reponse.data, targetUserId })
    );
    toast.success("Request accepted");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const cancelRequest = (targetUserId, page) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const reponse = await apiService.delete(
      `/friends/requests/${targetUserId}`
    );
    dispatch(
      slice.actions.cancelRequestSuccess({ ...reponse.data, targetUserId })
    );
    toast.success("Request cancelled");
    // dispatch(getRequestsSend({ page }));
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const removeFriend = (targetUserId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    const reponse = await apiService.delete(`/friends/${targetUserId}`);
    dispatch(
      slice.actions.removeFriendSuccess({ ...reponse.data, targetUserId })
    );
    toast.success("Friend removed");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const getFriends =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/friends", { params });
      dispatch(slice.actions.getFriendsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getFriendRequest =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/friends/requests/incoming", {
        params,
      });
      dispatch(slice.actions.getFriendRequestsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getRequestsSend =
  ({ filterName, page = 1, limit = 12 }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = { page, limit };
      if (filterName) params.name = filterName;
      const response = await apiService.get("/friends/requests/outgoing", {
        params,
      });
      dispatch(slice.actions.getRequestsSendSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };
