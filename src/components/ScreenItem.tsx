
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Screen, SubScreen } from '@/types/screen';
import { ArrowDownRight, Check, Grip, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import SubScreenItem from './SubScreenItem';
import { Input } from '@/components/ui/input';

interface ScreenItemProps {
  screen: Screen;
  index: number;
  onDelete: (id: string) => void;
  onUpdateDescription: (id: string, description: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onDeleteSubScreen: (screenId: string, subScreenId: string) => void;
  onUpdateSubScreenDescription: (screenId: string, subScreenId: string, description: string) => void;
  onPromoteSubScreen: (screenId: string, subScreenId: string) => void;
  onConvertToSubScreen: (screenId: string) => void;
  totalScreens: number;
}

const ScreenItem: React.FC<ScreenItemProps> = ({
  screen,
  index,
  onDelete,
  onUpdateDescription,
  onUpdateTitle,
  onDeleteSubScreen,
  onUpdateSubScreenDescription,
  onPromoteSubScreen,
  onConvertToSubScreen,
  totalScreens
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(screen.title);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(screen.description);

  const handleSaveTitle = () => {
    onUpdateTitle(screen.id, tempTitle);
    setIsEditingTitle(false);
  };

  const handleCancelTitleEdit = () => {
    setTempTitle(screen.title);
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    onUpdateDescription(screen.id, tempDescription);
    setIsEditingDescription(false);
  };

  const handleCancelDescriptionEdit = () => {
    setTempDescription(screen.description);
    setIsEditingDescription(false);
  };

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
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="h-8 text-lg font-semibold"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleSaveTitle}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleCancelTitleEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <h3 className="flex items-center gap-2 text-xl font-semibold">
                    {screen.title}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsEditingTitle(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </h3>
                )}
                <div className="flex gap-2">
                  {totalScreens > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onConvertToSubScreen(screen.id)}
                      title="Convert to sub-screen"
                    >
                      <ArrowDownRight className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(screen.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-3 flex gap-4">
                <div className="h-32 w-48 overflow-hidden rounded-md border border-border">
                  <img 
                    src={screen.thumbnail} 
                    alt={screen.title}
                    className="h-full w-full object-cover" 
                  />
                </div>
                
                <div className="flex-1">
                  {isEditingDescription ? (
                    <div className="flex h-full flex-col">
                      <Textarea
                        className="flex-1 text-sm"
                        value={tempDescription}
                        onChange={(e) => setTempDescription(e.target.value)}
                        placeholder="Describe this screen..."
                        autoFocus
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSaveDescription}
                          className="h-7"
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelDescriptionEdit}
                          className="h-7"
                        >
                          <X className="mr-1 h-3 w-3" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full">
                      <Textarea
                        className="flex-1 text-sm"
                        value={screen.description}
                        readOnly
                        placeholder="Describe this screen..."
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={() => {
                          setTempDescription(screen.description);
                          setIsEditingDescription(true);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Droppable droppableId={`subscreen-${screen.id}`} type="subscreen">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="ml-6 space-y-3 border-l-2 border-muted pl-4"
                  >
                    <h4 className="font-medium text-muted-foreground">Sub Screens</h4>
                    
                    {screen.subScreens.map((subScreen: SubScreen, subIndex: number) => (
                      <SubScreenItem
                        key={subScreen.id}
                        subScreen={subScreen}
                        index={subIndex}
                        screenId={screen.id}
                        onDelete={onDeleteSubScreen}
                        onUpdateDescription={onUpdateSubScreenDescription}
                        onPromoteToScreen={onPromoteSubScreen}
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
