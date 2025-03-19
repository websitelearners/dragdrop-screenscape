
export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// Convert a sub-screen to a full screen
export const convertSubScreenToScreen = (subScreen: any, index: number = -1) => {
  return {
    id: `screen-${Date.now()}-${subScreen.id}`,
    title: subScreen.title,
    description: subScreen.description,
    thumbnail: subScreen.thumbnail,
    subScreens: [],
  };
};

// Check if item is a sub-screen being dragged to become a screen
export const isPromotingSubScreen = (source: any, destination: any) => {
  return (
    source.droppableId.startsWith('subscreen-') && 
    destination?.droppableId === 'screens-droppable'
  );
};
