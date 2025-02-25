import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { Deal, PipelineStage } from '../../types';

interface KanbanBoardProps {
  stages: PipelineStage[];
  deals: Deal[];
  onDragEnd: (dealId: string, sourceStageId: string, destinationStageId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ stages, deals, onDragEnd }) => {
  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stageId === stageId);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      onDragEnd(draggableId, source.droppableId, destination.droppableId);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', p: 2 }}>
        {stages.map((stage) => (
          <Box key={stage.id} sx={{ minWidth: 320 }}>
            <Paper sx={{ p: 2, bgcolor: '#f7fafc' }}>
              <Typography variant="h6" gutterBottom>
                {stage.name}
                <Chip 
                  label={getDealsByStage(stage.id).length} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Droppable droppableId={stage.id}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: 400 }}
                  >
                    {getDealsByStage(stage.id).map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: 2,
                              mb: 1,
                              bgcolor: 'white',
                              transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                              transition: 'all 0.2s',
                              '&:hover': { transform: 'translateX(4px)' }
                            }}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {deal.title}
                            </Typography>
                            <Typography variant="body2" color="success.main">
                              ${deal.value.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {deal.probability}% probability
                            </Typography>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Box>
        ))}
      </Box>
    </DragDropContext>
  );
};