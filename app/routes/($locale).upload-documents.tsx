import {Form, useActionData} from '@remix-run/react';
import {ActionFunctionArgs} from '@remix-run/server-runtime';
import {useRef, useState} from 'react';

export async function action({request, context}: ActionFunctionArgs) {
  const data = await request.formData();
  const file = data.get('file') as File;
  const formData = new FormData();
  formData.append('file', file as Blob);
  try {
    const checkFileExists = await fetch(
      `http://localhost:3000/api/upload/${file.name as string}`,
    );
    if (checkFileExists.ok) {
      const data: {src: string} = (await checkFileExists.json()) as {
        src: string;
      };
      return data.src;
    }

    const res = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      console.log('file uploaded');
    }

    // get the public link for the uploaded file using key : file.name
    const getThePublicLink = await fetch(
      `http://localhost:3000/api/upload/${file.name as string}`,
    );

    if (getThePublicLink.ok) {
      const data: {src: string} = (await getThePublicLink.json()) as {
        src: string;
      };
      return data.src;
    }
  } catch (error) {
    console.error(error);
    return 'error';
  }
  return 'failure';
}

export default function UploadRoute() {
  return <UploadForm />;
}

function UploadForm() {
  const actionData = useActionData<typeof action>();
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFiles(Array.from(files));
  };
  return (
    <>
      {actionData && console.log('actionData', actionData)}
      {actionData === 'error' && (
        <p>There was an error uploading the file. Please try again.</p>
      )}
      {actionData === 'failure' && (
        <p>There was a failure uploading the file. Please try again.</p>
      )}
      <Form method="post" encType="multipart/form-data" className="m-5  p-3 ">
        <div className="bg-white  rounded-md  p-3  mb-3">
          <span> preview :</span>

          {files.map((file, index) => (
            <div key={index}>
              <p>{file.name}</p>
            </div>
          ))}
        </div>
        <input
          type="file"
          name="file"
          required
          ref={fileInput}
          onChange={handleFileChange}
          accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />

        <button type="submit">Upload</button>
      </Form>
      <div className="m-5 bg-white p-3">
        <h3>Instructions</h3>
        <p>
          1. Select a file to upload. <br />
          2. Click on the upload button. <br />
          3. The file will be uploaded to the server. <br />
          4. The public link for the file will be displayed below.
        </p>
      </div>
    </>
  );
}
