import React, { useEffect } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { KanbanBoard } from '../components/ui/KanbanBoard';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchDeals, fetchPipelines, updateDealStage } from '../store/slices/dealsSlice';
import { useSocket } from '../hooks/useSocket';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { deals, stages, currentPipeline } = useAppSelector(state => state.deals);
  const { user, workspace } = useAppSelector(state => state.auth);
  const socket = useSocket(workspace?.id || null);

  useEffect(() => {
    if (workspace?.id) {
      dispatch(fetchDeals(workspace.id));
      dispatch(fetchPipelines(workspace.id));
    }
  }, [workspace, dispatch]);

  const handleDragEnd = (dealId: string, sourceStageId: string, destinationStageId: string) => {
    dispatch(updateDealStage({ dealId, stageId: destinationStageId }));
  };

  // Sample chart data
  const pipelineData = [
    { stage: 'Lead', value: 850000 },
    { stage: 'Qualified', value: 1200000 },
    { stage: 'Proposal', value: 950000 },
    { stage: 'Negotiation', value: 600000 },
    { stage: 'Closed Won', value: 450000 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}! 👋
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              ${deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Pipeline Value
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {deals.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Deals
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              68%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Win Rate
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              47
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tasks Completed
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Pipeline Analytics
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pipelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#667eea" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sales Pipeline - {currentPipeline?.name}
        </Typography>
        <KanbanBoard
          stages={stages}
          deals={deals}
          onDragEnd={handleDragEnd}
        />
      </Paper>
    </Box>
  );
};