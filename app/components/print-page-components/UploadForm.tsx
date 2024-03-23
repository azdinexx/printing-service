import {Form, useActionData} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {Upload} from '~/icons/upload';
import {action} from '~/routes/($locale).print';
import {useFiles} from '~/state/usePrint';

const UploadForm = () => {
  const {files, AddFile} = useFiles();
  const {status, data, error} = useActionData<typeof action>();

  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3  w-full bg-gray-200 shadow p-2 rounded-lg border-gray-300 border-r-2 relative after:absolute after:top-8 after:-right-12 after:w-14 after:h-14  after:border-b-2 after:rounded-b-full after:border-l-2 after:border-gray-300 after:-z-10 before:absolute before:top-[12rem] before:rotate-3 before:-right-12 before:w-14 before:h-14  before:border-b-2 before:rounded-b-full before:border-l-2 before:border-gray-200 before:-z-10">
      <h1 className="font-semibold pb-1 border-b border-gray-300 mb-1">
        Printing Service
      </h1>
      <p className="text-sm text-gray-500">
        upload your files and have them by tomorrow. We are the fastest printing
        service around.
      </p>
      <Form method="POST">
        {status}
        <input ref={fileInput} type="file" className="file-input mb-3" />
        <button
          onClick={() => {
            if (fileInput && fileInput.current && fileInput.current.files) {
              const file = fileInput.current.files[0];
              const fileObj = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                url: '',
              };
              AddFile(fileObj);
            }
          }}
          type="submit"
          className="bg-gray-50 py-2 px-4 rounded-2xl flex gap-2 w-fit"
        >
          <Upload width={20} height={20} />
          Upload File
        </button>
      </Form>
      <p className="text-xs text-gray-400 max-w-[30ch]">
        Allowed file types: .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx
      </p>
    </div>
  );
};

export default UploadForm;
