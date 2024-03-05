import {AddFile} from '~/icons/add-file';
import {Cancel} from '~/icons/cancel';
import {Upload} from '~/icons/upload';
import {File, useFiles} from '~/state/usePrint';

function Print() {
  return (
    <main className="max-w-6xl mx-auto flex flex-col  relative">
      <section className="flex-grow p-2 w-full">
        <h1 className="font-bold text-2xl my-4">Print Page</h1>
        <div className="flex justify-between  rounded-md p-2 gap-10">
          <FirstColumn />
          <ManageFiles />
          <div className="relative w-full border-x px-2 flex flex-col justify-center after:absolute after:top-10 after:-right-[5%] after:w-[110%] after:h-1 after:bg-transparent after:border-b  before:absolute before:bottom-10 before:-right-[5%] before:w-[110%] before:h-1 before:bg-transparent before:border-b before:border-gray-300 border-gray-300 after:border-gray-300">
            <div className="bg-gray-200/50 p-2 rounded-lg shadow mt-4">
              <p className="text-sm py-1 border-b border-gray-200 text-gray-700 ">
                Printing options
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pages per side</span>
                  <select className="px-2 py-1 rounded-md bg-gray-100">
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Orientation</span>
                  <select className="px-2 py-1 rounded-md bg-gray-100">
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Color</span>
                  <select className="px-2 py-1 rounded-md bg-gray-100">
                    <option value="portrait">B&W</option>
                    <option value="landscape">Colored</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="p-2 sticky bottom-0">
        <button className="px-4 py-2 bg-gray-300 rounded-lg">Print</button>
      </div>
    </main>
  );
}

export default Print;

const FirstColumn = () => {
  return (
    <div className="flex flex-col gap-3  w-full bg-gray-200 shadow p-2 rounded-lg border-gray-300 border-r-2 relative after:absolute after:top-8 after:-right-12 after:w-14 after:h-14  after:border-b-2 after:rounded-b-full after:border-l-2 after:border-gray-300 after:-z-10 before:absolute before:top-[12rem] before:rotate-3 before:-right-12 before:w-14 before:h-14  before:border-b-2 before:rounded-b-full before:border-l-2 before:border-gray-200 before:-z-10">
      <h1 className="font-semibold pb-1 border-b border-gray-300 mb-1">
        Printing Service
      </h1>
      <p className="text-sm text-gray-500">
        upload your files and have them by tomorrow. We are the fastest printing
        service around.
      </p>
      <button className="bg-gray-50 py-2 px-4 rounded-2xl flex gap-2 w-fit">
        <Upload width={20} height={20} />
        Upload File
      </button>
      <p className="text-xs text-gray-400 max-w-[30ch]">
        Allowed file types: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx
      </p>
    </div>
  );
};

function ManageFiles() {
  const {files} = useFiles();
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="bg-slate-50 p-2 rounded-lg shadow z-10">
        <p className="text-xs font-bold py-1 border-b border-gray-200 text-gray-700 ">
          Details
        </p>
        <ul className="flex flex-col gap-1">
          <li className="text-sm flex justify-between border-b p-1">
            <span>Pages : </span>
            <span>1</span>
          </li>
          <li className="text-sm flex justify-between border-b p-1">
            <span>Copies : </span>
            <span>1</span>
          </li>
          <li className="text-sm flex justify-between ">
            <span>Color :</span>{' '}
            <div className="flex gap-2">
              <button className="py-1 px-2 rounded-md bg-gray-100 text-gray-500">
                B&W
              </button>
              <button className="py-1 px-2 rounded-md bg-gray-50 ">
                Color
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
