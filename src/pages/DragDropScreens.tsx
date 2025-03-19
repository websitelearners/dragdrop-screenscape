import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Screen, SubScreen } from '@/types/screen';
import { reorder, convertSubScreenToScreen } from '@/utils/dragDropUtils';
import ScreenItem from '@/components/ScreenItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const initialScreens: Screen[] = [
  {
    id: 'screen-1',
    title: 'Home Screen',
    description: 'Main landing page of the application',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    subScreens: [
      {
        id: 'sub-1',
        title: 'Login Form',
        description: 'User login component',
        thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
      },
      {
        id: 'sub-2',
        title: 'Hero Section',
        description: 'Main promotional area',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475'
      }
    ]
  },
  {
    id: 'screen-2',
    title: 'Dashboard',
    description: 'User dashboard with analytics',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    subScreens: [
      {
        id: 'sub-3',
        title: 'Stats Panel',
        description: 'Key metrics visualization',
        thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
      }
    ]
  }
];

const DragDropScreens: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>(initialScreens);
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Handle screen reordering
    if (type === 'screen') {
      const reorderedScreens = reorder(
        screens,
        source.index,
        destination.index
      );
      
      setScreens(reorderedScreens);
      toast({
        title: "Screen reordered",
        description: "The screen has been moved to a new position",
      });
      return;
    }

    // Handle sub-screen reordering or promotion
    if (type === 'subscreen') {
      const screenId = source.droppableId.replace('subscreen-', '');
      
      // Check if the subscreen is dropped in the main screens container
      if (destination.droppableId === 'screens-droppable') {
        // This is the case where a subscreen is being promoted to a main screen
        // Find the source screen and the subscreen
        const sourceScreen = screens.find(s => s.id === screenId);
        if (!sourceScreen) return;
        
        const sourceSubScreens = [...sourceScreen.subScreens];
        const [movedSubScreen] = sourceSubScreens.splice(source.index, 1);
        
        // Convert the subscreen to a main screen
        const newScreen = convertSubScreenToScreen(movedSubScreen);
        
        // Create a new array of screens with the promoted subscreen
        let newScreens = [...screens];
        
        // Update the source screen without the moved subscreen
        newScreens = newScreens.map(s => 
          s.id === screenId ? { ...s, subScreens: sourceSubScreens } : s
        );
        
        // Add the new screen at the destination index
        newScreens.splice(destination.index, 0, newScreen);
        
        setScreens(newScreens);
        toast({
          title: "Sub-screen promoted",
          description: "The sub-screen has been converted to a main screen",
        });
        return;
      }
      
      const targetScreenId = destination.droppableId.replace('subscreen-', '');
      
      // If moving within the same screen
      if (screenId === targetScreenId) {
        const screen = screens.find(s => s.id === screenId);
        if (!screen) return;
        
        const reorderedSubScreens = reorder(
          screen.subScreens,
          source.index,
          destination.index
        );
        
        const updatedScreens = screens.map(s => 
          s.id === screenId ? { ...s, subScreens: reorderedSubScreens } : s
        );
        
        setScreens(updatedScreens);
        toast({
          title: "Sub-screen reordered",
          description: "The sub-screen has been moved to a new position",
        });
      } else {
        // Moving between different screens
        const sourceScreen = screens.find(s => s.id === screenId);
        const destScreen = screens.find(s => s.id === targetScreenId);
        
        if (!sourceScreen || !destScreen) return;
        
        const sourceSubScreens = [...sourceScreen.subScreens];
        const destSubScreens = [...destScreen.subScreens];
        
        const [movedSubScreen] = sourceSubScreens.splice(source.index, 1);
        destSubScreens.splice(destination.index, 0, movedSubScreen);
        
        const updatedScreens = screens.map(s => {
          if (s.id === screenId) {
            return { ...s, subScreens: sourceSubScreens };
          }
          if (s.id === targetScreenId) {
            return { ...s, subScreens: destSubScreens };
          }
          return s;
        });
        
        setScreens(updatedScreens);
        toast({
          title: "Sub-screen moved",
          description: "The sub-screen has been moved to another screen",
        });
      }
    }
  };

  const handleAddScreen = () => {
    const newScreen: Screen = {
      id: `screen-${Date.now()}`,
      title: `Screen ${screens.length + 1}`,
      description: 'Add description here...',
      thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      subScreens: []
    };

    setScreens([...screens, newScreen]);
    toast({
      title: "Screen added",
      description: "A new screen has been added to the list",
    });
  };

  const handleAddSubScreen = (screenId: string) => {
    const updatedScreens = screens.map(screen => {
      if (screen.id === screenId) {
        return {
          ...screen,
          subScreens: [
            ...screen.subScreens,
            {
              id: `sub-${Date.now()}`,
              title: `Sub-screen ${screen.subScreens.length + 1}`,
              description: 'Add description here...',
              thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
            }
          ]
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
    toast({
      title: "Sub-screen added",
      description: "A new sub-screen has been added",
    });
  };

  const handleDeleteScreen = (id: string) => {
    setScreens(screens.filter(screen => screen.id !== id));
    toast({
      title: "Screen deleted",
      description: "The screen has been removed",
    });
  };

  const handleUpdateScreenDescription = (id: string, description: string) => {
    const updatedScreens = screens.map(screen => 
      screen.id === id ? { ...screen, description } : screen
    );
    setScreens(updatedScreens);
  };

  const handleDeleteSubScreen = (screenId: string, subScreenId: string) => {
    const updatedScreens = screens.map(screen => {
      if (screen.id === screenId) {
        return {
          ...screen,
          subScreens: screen.subScreens.filter(sub => sub.id !== subScreenId)
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
    toast({
      title: "Sub-screen deleted",
      description: "The sub-screen has been removed",
    });
  };

  const handleUpdateSubScreenDescription = (
    screenId: string,
    subScreenId: string,
    description: string
  ) => {
    const updatedScreens = screens.map(screen => {
      if (screen.id === screenId) {
        return {
          ...screen,
          subScreens: screen.subScreens.map(sub => 
            sub.id === subScreenId ? { ...sub, description } : sub
          )
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Drag-n-Drop Screens</h1>
        <p className="text-muted-foreground">
          Arrange your screens and sub-screens by dragging them into the desired order.
          You can also promote a sub-screen to a main screen by dragging it to the main list.
        </p>
      </div>

      <div className="mb-6 flex justify-between">
        <Button onClick={handleAddScreen} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Screen
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="screens-droppable" type="screen">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {screens.map((screen, index) => (
                <div key={screen.id} className="relative">
                  <ScreenItem
                    screen={screen}
                    index={index}
                    onDelete={handleDeleteScreen}
                    onUpdateDescription={handleUpdateScreenDescription}
                    onDeleteSubScreen={handleDeleteSubScreen}
                    onUpdateSubScreenDescription={handleUpdateSubScreenDescription}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSubScreen(screen.id)}
                    className="absolute bottom-4 left-16 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Sub-screen
                  </Button>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragDropScreens;
