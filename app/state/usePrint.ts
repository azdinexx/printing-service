import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export interface File {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  uploaded: boolean;
  url: string;
}
interface Store {
  files: File[];
  numberOfPages: number;
  setNumberofPages: (pages: number) => void;
  numberOfCopies: number;
  setNumberOfCopies: (copies: number) => void;
  options: {
    pagesPerSide: 1 | 2;
    orientation: 'portrait' | 'landscape';
    color: 'B&W' | 'Colored';
  };
  setOptions: (options: Partial<Store['options']>) => void;
}
export const useFiles = create(
  persist<Store>(
    (set) => ({
      files: [] as File[],
      numberOfPages: 0,
      setNumberofPages: (pages) => {
        if (pages < 0) return;
        set({numberOfPages: pages});
      },
      numberOfCopies: 1,
      setNumberOfCopies: (copies) => set({numberOfCopies: copies}),
      options: {
        pagesPerSide: 1,
        orientation: 'portrait',
        color: 'B&W',
      },
      setOptions: (options) =>
        set((state) => ({options: {...state.options, ...options}})),
    }),
    {
      name: 'files',
    },
  ),
);
