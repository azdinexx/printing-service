import {ActionFunctionArgs} from '@remix-run/server-runtime';
import DetailsAndFiles from '~/components/print-page-components/DetailsAndFiles';
import PrintingOptions from '~/components/print-page-components/PrintingOptions';
import UploadForm from '~/components/print-page-components/UploadForm';

// return { status , data , error}
// status : 'UPLOADED' , 'ERROR'
// data : {url : string} | null
// error : null | string
export async function action({request, context}: ActionFunctionArgs) {
  const data = await request.formData();
  const file = data.get('file') as File;
  const formData = new FormData();
  formData.append('file', file as Blob);

  const checkFileExists = await fetch(`${context.env.UPLOAD_BASE_URL}`, {
    method: 'POST',
    body: formData,
  });
  if (checkFileExists.ok) {
    const data: {src: string} = (await checkFileExists.json()) as {
      src: string;
    };
    return {
      status: 'UPLOADED',
      data: {
        url: data.src,
      },
      error: null,
    };
  } else {
    // uploading the file :
  }
}
function Print() {
  return (
    <main className="max-w-6xl mx-auto flex flex-col  relative">
      <section className="flex-grow p-2 w-full">
        <h1 className="font-bold text-2xl mt-5 mb-8">Print Page</h1>
        <div className="flex justify-between  rounded-md p-2 gap-10">
          <UploadForm />
          <DetailsAndFiles />
          <PrintingOptions />
        </div>
      </section>
      <div className="p-2   flex justify-end">
        <button className="px-4 py-2 bg-gray-300 rounded-lg mx-3">Next</button>
      </div>
    </main>
  );
}

export default Print;
