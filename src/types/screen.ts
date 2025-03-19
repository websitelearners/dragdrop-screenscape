
export interface SubScreen {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface Screen {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subScreens: SubScreen[];
}
