import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Blog Redux Slice
 * Blog CRUD işlemleri için Redux Thunk actions
 * 
 * Async Thunk Açıklaması:
 * - createAsyncThunk: API çağrıları için özel Redux action oluşturur
 * - Otomatik olarak pending, fulfilled, rejected durumları oluşturur
 * - Loading ve error state'lerini yönetir
 */

// Fetch all blogs
export const fetchBlogs = createAsyncThunk('blog/fetchBlogs', async () => {
  const response = await axios.get(`${API_URL}/blogs`);
  return response.data.data;
});

// Fetch single blog
export const fetchBlogById = createAsyncThunk('blog/fetchById', async (id) => {
  const response = await axios.get(`${API_URL}/blogs/${id}`);
  return response.data.data;
});

// Create new blog
export const createBlog = createAsyncThunk('blog/create', async (blogData, { getState }) => {
  const { auth } = getState();
  const response = await axios.post(`${API_URL}/blogs`, blogData, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.data;
});

// Update blog
export const updateBlog = createAsyncThunk('blog/update', async ({ id, blogData }, { getState }) => {
  const { auth } = getState();
  const response = await axios.put(`${API_URL}/blogs/${id}`, blogData, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.data;
});

// Delete blog
export const deleteBlog = createAsyncThunk('blog/delete', async (id, { getState }) => {
  const { auth } = getState();
  await axios.delete(`${API_URL}/blogs/${id}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return id;
});

// Like blog
export const likeBlog = createAsyncThunk('blog/like', async (id, { getState }) => {
  const { auth } = getState();
  const response = await axios.post(`${API_URL}/blogs/${id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.data;
});

// Increment blog view count
export const incrementViewCount = createAsyncThunk('blog/incrementView', async (id) => {
  const response = await axios.post(`${API_URL}/blogs/${id}/view`);
  return response.data.data;
});

const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    blogs: [],
    currentBlog: null,
    isLoading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
    // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
    // Create blog
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs.unshift(action.payload); // Yeni blog'u listenin başına ekle
        state.success = 'Blog başarıyla oluşturuldu!';
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
    // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        // Listedeki blog'u güncelle
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        state.currentBlog = action.payload;
        state.success = 'Blog başarıyla güncellendi!';
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
    // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        // Silinen blog'u listeden çıkar
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload);
        state.success = 'Blog başarıyla silindi!';
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
    // Like blog
      .addCase(likeBlog.fulfilled, (state, action) => {
        // Beğeni sayısını güncelle
        if (state.currentBlog && state.currentBlog._id === action.payload._id) {
          state.currentBlog.likesCount = action.payload.likesCount;
        }
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index].likesCount = action.payload.likesCount;
        }
      })
    // Increment view count
      .addCase(incrementViewCount.fulfilled, (state, action) => {
        // Görüntülenme sayısını güncelle
        if (state.currentBlog) {
          state.currentBlog.views = action.payload.views;
        }
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index].views = action.payload.views;
        }
      });
  },
});

export const { clearCurrentBlog, clearError, clearSuccess } = blogSlice.actions;
export default blogSlice.reducer;

