import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Deal, Pipeline, PipelineStage } from '../../types';

interface DealsState {
  deals: Deal[];
  pipelines: Pipeline[];
  currentPipeline: Pipeline | null;
  stages: PipelineStage[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DealsState = {
  deals: [],
  pipelines: [],
  currentPipeline: null,
  stages: [],
  isLoading: false,
  error: null,
};

export const fetchDeals = createAsyncThunk(
  'deals/fetchDeals',
  async (workspaceId: string) => {
    const response = await axios.get(`/api/deals?workspaceId=${workspaceId}`);
    return response.data;
  }
);

export const fetchPipelines = createAsyncThunk(
  'deals/fetchPipelines',
  async (workspaceId: string) => {
    const response = await axios.get(`/api/pipelines?workspaceId=${workspaceId}`);
    return response.data;
  }
);

export const updateDealStage = createAsyncThunk(
  'deals/updateDealStage',
  async ({ dealId, stageId }: { dealId: string; stageId: string }) => {
    const response = await axios.patch(`/api/deals/${dealId}/stage`, { stageId });
    return response.data;
  }
);

export const createDeal = createAsyncThunk(
  'deals/createDeal',
  async (dealData: Partial<Deal>) => {
    const response = await axios.post('/api/deals', dealData);
    return response.data;
  }
);

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    addDeal: (state, action: PayloadAction<Deal>) => {
      state.deals.push(action.payload);
    },
    removeDeal: (state, action: PayloadAction<string>) => {
      state.deals = state.deals.filter(deal => deal.id !== action.payload);
    },
    updateDeal: (state, action: PayloadAction<Deal>) => {
      const index = state.deals.findIndex(deal => deal.id === action.payload.id);
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    },
    setCurrentPipeline: (state, action: PayloadAction<Pipeline>) => {
      state.currentPipeline = action.payload;
      state.stages = action.payload.stages.sort((a, b) => a.orderIndex - b.orderIndex);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deals = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch deals';
      })
      .addCase(fetchPipelines.fulfilled, (state, action) => {
        state.pipelines = action.payload;
        if (action.payload.length > 0 && !state.currentPipeline) {
          state.currentPipeline = action.payload.find((p: Pipeline) => p.isDefault) || action.payload[0];
          if (state.currentPipeline) {
            state.stages = state.currentPipeline.stages.sort((a, b) => a.orderIndex - b.orderIndex);
          }
        }
      })
      .addCase(updateDealStage.fulfilled, (state, action) => {
        const index = state.deals.findIndex(deal => deal.id === action.payload.id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
      });
  },
});

export const { addDeal, removeDeal, updateDeal, setCurrentPipeline } = dealsSlice.actions;
export default dealsSlice.reducer;