
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { SubScreen } from '@/types/screen';
import { Grip, Trash2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SubScreenItemProps {
  subScreen: SubScreen;
  index: number;
  screenId: string;
  onDelete: (screenId: string, subScreenId: string) => void;
  onUpdateDescription: (screenId: string, subScreenId: string, description: string) => void;
}

const SubScreenItem: React.FC<SubScreenItemProps> = ({
  subScreen,
  index,
  screenId,
  onDelete,
  onUpdateDescription
}) => {
  return (
    <Draggable draggableId={`sub-${subScreen.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`rounded-md border border-border bg-card p-3 ${
            snapshot.isDragging 
              ? "ring-2 ring-blue-500 shadow-lg z-50" 
              : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div 
              {...provided.dragHandleProps} 
              className="flex h-8 w-8 items-center justify-center rounded bg-muted text-muted-foreground"
            >
              <Grip className="h-4 w-4" />
            </div>
            
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium">{subScreen.title}</h3>
                <div className="flex items-center gap-1">
                  {snapshot.isDragging && (
                    <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>Drag to promote</span>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onDelete(screenId, subScreen.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="h-24 w-36 overflow-hidden rounded-md border border-border">
                  <img 
                    src={subScreen.thumbnail} 
                    alt={subScreen.title}
                    className="h-full w-full object-cover" 
                  />
                </div>
                
                <Textarea
                  className="flex-1 text-sm"
                  value={subScreen.description}
                  onChange={(e) => onUpdateDescription(screenId, subScreen.id, e.target.value)}
                  placeholder="Describe this sub-screen..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default SubScreenItem;
