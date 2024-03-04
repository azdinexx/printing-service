import {create} from 'zustand';

export const usePrint = create((set) => ({
  printer: 'HP LaserJet 1020',
  location: 'Room 101',
  status: 'Ready',
  pagesPerSide: 1,
  orientation: 'portrait',
  color: 'B&W',
  setPrinter: (printer: string) => set({printer}),
  setLocation: (location: string) => set({location}),
  setStatus: (status: string) => set({status}),
  setPagesPerSide: (pagesPerSide: number) => set({pagesPerSide}),
  setOrientation: (orientation: string) => set({orientation}),
  setColor: (color: string) => set({color}),
  print: () => {
    console.log('Printing...');
  },
}));
