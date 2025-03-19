
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

// Convert a main screen to a sub-screen
export const convertScreenToSubScreen = (screen: any) => {
  return {
    id: `sub-${Date.now()}-${screen.id}`,
    title: screen.title,
    description: screen.description,
    thumbnail: screen.thumbnail,
  };
};
