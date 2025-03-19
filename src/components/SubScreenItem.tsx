
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
  onPromoteToScreen: (screenId: string, subScreenId: string) => void;
}

const SubScreenItem: React.FC<SubScreenItemProps> = ({
  subScreen,
  index,
  screenId,
  onDelete,
  onUpdateDescription,
  onPromoteToScreen
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(subScreen.title);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(subScreen.description);

  const handleSaveTitle = () => {
    // Currently there's no onUpdateTitle prop, so we would need to add that
    // For now, just reset the UI state
    setIsEditingTitle(false);
    setTempTitle(subScreen.title);
  };

  const handleCancelTitleEdit = () => {
    setTempTitle(subScreen.title);
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    onUpdateDescription(screenId, subScreen.id, tempDescription);
    setIsEditingDescription(false);
  };

  const handleCancelDescriptionEdit = () => {
    setTempDescription(subScreen.description);
    setIsEditingDescription(false);
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
                  <div className="flex items-center gap-2">
                    <Input 
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="h-7 text-sm font-medium"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleSaveTitle}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleCancelTitleEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <h3 className="flex items-center gap-2 font-medium">
                    {subScreen.title}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      <Pencil className="h-2 w-2" />
                    </Button>
                  </h3>
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
                
                {isEditingDescription ? (
                  <div className="flex flex-1 flex-col">
                    <Textarea
                      className="flex-1 text-sm"
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      placeholder="Describe this sub-screen..."
                      autoFocus
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveDescription}
                        className="h-6"
                      >
                        <Check className="mr-1 h-2 w-2" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelDescriptionEdit}
                        className="h-6"
                      >
                        <X className="mr-1 h-2 w-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex-1">
                    <Textarea
                      className="flex-1 text-sm"
                      value={subScreen.description}
                      readOnly
                      placeholder="Describe this sub-screen..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-5 w-5"
                      onClick={() => {
                        setTempDescription(subScreen.description);
                        setIsEditingDescription(true);
                      }}
                    >
                      <Pencil className="h-2 w-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default SubScreenItem;
