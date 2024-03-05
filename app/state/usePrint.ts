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
}
export const useFiles = create(
  persist<Store>(
    (set) => ({
      files: [
        {
          name: 'sample.pdf',
          size: 100,
          type: 'application/pdf',
          lastModified: 1627781060000,
          uploaded: false,
          url: '',
        },
        {
          name: 'sample.docx',
          size: 100,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          lastModified: 1627781060000,
          uploaded: false,
          url: '',
        },
      ],
    }),
    {
      name: 'files',
    },
  ),
);
