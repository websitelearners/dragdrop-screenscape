
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Screen, SubScreen } from '@/types/screen';
import { Grip, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import SubScreenItem from './SubScreenItem';

interface ScreenItemProps {
  screen: Screen;
  index: number;
  onDelete: (id: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onDeleteSubScreen: (screenId: string, subScreenId: string) => void;
  onUpdateSubScreenDescription: (screenId: string, subScreenId: string, description: string) => void;
  onPromoteSubScreen?: (screenId: string, subScreenId: string) => void;
  isDraggedOver?: boolean;
}

const ScreenItem: React.FC<ScreenItemProps> = ({
  screen,
  index,
  onDelete,
  onUpdateDescription,
  onDeleteSubScreen,
  onUpdateSubScreenDescription,
  onPromoteSubScreen,
  isDraggedOver = false
}) => {
  return (
    <Draggable draggableId={screen.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="mb-4 rounded-lg border border-border bg-card p-4"
        >
          <div className="flex items-start gap-4">
            <div {...provided.dragHandleProps} className="flex h-10 w-10 items-center justify-center rounded bg-muted text-muted-foreground">
              <Grip className="h-5 w-5" />
            </div>
            
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-semibold">{screen.title}</h3>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(screen.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mb-3 flex gap-4">
                <div className="h-32 w-48 overflow-hidden rounded-md border border-border">
                  <img 
                    src={screen.thumbnail} 
                    alt={screen.title}
                    className="h-full w-full object-cover" 
                  />
                </div>
                
                <Textarea
                  className="flex-1"
                  value={screen.description}
                  onChange={(e) => onUpdateDescription(screen.id, e.target.value)}
                  placeholder="Describe this screen..."
                />
              </div>

              <Droppable droppableId={`subscreen-${screen.id}`} type="subscreen">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`ml-6 space-y-3 border-l-2 border-muted pl-4 ${
                      isDraggedOver 
                        ? "py-2 px-2 rounded-lg outline-dashed outline-2 outline-green-500 bg-green-50 dark:bg-green-900/20 transition-all duration-200" 
                        : ""
                    }`}
                  >
                    <h4 className="font-medium text-muted-foreground">
                      Sub Screens
                      {isDraggedOver && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 px-2 py-1 rounded">
                          Drop to convert
                        </span>
                      )}
                    </h4>
                    
                    {screen.subScreens.map((subScreen: SubScreen, subIndex: number) => (
                      <SubScreenItem
                        key={subScreen.id}
                        subScreen={subScreen}
                        index={subIndex}
                        screenId={screen.id}
                        onDelete={onDeleteSubScreen}
                        onUpdateDescription={onUpdateSubScreenDescription}
                        onPromote={onPromoteSubScreen}
                      />
                    ))}
                    
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ScreenItem;
