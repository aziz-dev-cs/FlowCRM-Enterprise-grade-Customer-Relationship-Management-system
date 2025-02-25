import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Task } from '../../types';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  filter: 'all' | 'today' | 'week' | 'overdue';
}

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  filter: 'all',
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (workspaceId: string) => {
    const response = await axios.get(`/api/tasks?workspaceId=${workspaceId}`);
    return response.data;
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: Partial<Task>) => {
    const response = await axios.post('/api/tasks', taskData);
    return response.data;
  }
);

export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async (taskId: string) => {
    const response = await axios.patch(`/api/tasks/${taskId}/complete`);
    return response.data;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'all' | 'today' | 'week' | 'overdue'>) => {
      state.filter = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      });
  },
});

export const { setFilter, addTask } = tasksSlice.actions;
export default tasksSlice.reducer;