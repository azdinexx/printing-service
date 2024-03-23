import React from 'react';
import {AddFile} from '~/icons/add-file';
import {Cancel} from '~/icons/cancel';
import {useFiles, File} from '~/state/usePrint';

function DetailsAndFiles() {
  const {files, numberOfPages, setNumberOfCopies, numberOfCopies} = useFiles();
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="bg-slate-50 p-2 rounded-lg shadow z-10">
        <p className="text-xs font-bold py-1  mb-2 border-gray-200 text-gray-700 ">
          Details
        </p>
        <ul className="flex flex-col gap-1">
          <li className="text-sm flex justify-between border-b pb-3 ">
            <span>Pages : </span>
            <span className="px-2 border flex justify-center items-center rounded-md bg-gray-100">
              {numberOfPages}
            </span>
          </li>
          <li className="text-sm flex justify-between ">
            <span>Copies : </span>
            <div className="flex gap-2">
              <button
                className="bg-gray-100 p-1 px-2 rounded-full"
                onClick={() => setNumberOfCopies(numberOfCopies + 1)}
              >
                +
              </button>
              <span className="px-2 border flex justify-center items-center rounded-full">
                {numberOfCopies}
              </span>
              <button
                className="bg-gray-100 p-1 px-3 rounded-full"
                onClick={() => {
                  if (numberOfCopies === 1) return;
                  setNumberOfCopies(numberOfCopies - 1);
                }}
              >
                -
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div className="bg-gray-50 p-2 rounded-lg  border">
        <p className="text-sm py-1 border-b border-gray-200 text-gray-700 mb-2">
          Files{' '}
          <span className="text-xs px-1 rounded bg-gray-200 ">
            {files.length}
          </span>
        </p>
        <ul>
          {files.length !== 0 &&
            files.map((file, index) => <FileItem file={file} key={index} />)}
          {!files.length && (
            <li>
              <p className="text-xs text-gray-500">
                No files uploaded yet. Click on the button below to upload a
                file.
              </p>
            </li>
          )}
          <li className="p-1 text-sm bg-blue-400/70 text-white  rounded-md px-2 flex gap-2">
            <AddFile height={18} width={18} />
            <span>Add More Files</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

const FileItem = ({file}: {file: File}) => {
  return (
    <li className="p-1 text-sm group hover:bg-gray-300/50 bg-gray-300/30 rounded-md px-2 flex justify-between">
      <span>{file.name}</span>
      <Cancel
        width={18}
        height={18}
        className="text-gray-400 group-hover:text-gray-600"
      />
    </li>
  );
};

export default DetailsAndFiles;
