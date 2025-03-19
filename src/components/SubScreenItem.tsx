
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { SubScreen } from '@/types/screen';
import { ArrowUpRight, Check, Grip, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface SubScreenItemProps {
  subScreen: SubScreen;
  index: number;
  screenId: string;
  onDelete: (screenId: string, subScreenId: string) => void;
  onUpdateDescription: (screenId: string, subScreenId: string, description: string) => void;
  onUpdateTitle: (screenId: string, subScreenId: string, title: string) => void;
  onPromoteToScreen: (screenId: string, subScreenId: string) => void;
}

const SubScreenItem: React.FC<SubScreenItemProps> = ({
  subScreen,
  index,
  screenId,
  onDelete,
  onUpdateDescription,
  onUpdateTitle,
  onPromoteToScreen
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(subScreen.title);

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateTitle(screenId, subScreen.id, titleInput);
      setIsEditingTitle(false);
    }
  };

  const handleCancelTitleEdit = () => {
    setTitleInput(subScreen.title);
    setIsEditingTitle(false);
  };

  return (
    <Draggable draggableId={`sub-${subScreen.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="rounded-md border border-border bg-card p-3"
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
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="h-7 font-medium"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveTitle}
                      className="h-6 w-6"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelTitleEdit}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{subScreen.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditingTitle(true)}
                      className="h-6 w-6"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onPromoteToScreen(screenId, subScreen.id)}
                    title="Promote to main screen"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
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
