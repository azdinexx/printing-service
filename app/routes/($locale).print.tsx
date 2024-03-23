import DetailsAndFiles from '~/components/print-page-components/DetailsAndFiles';
import PrintingOptions from '~/components/print-page-components/PrintingOptions';
import UploadForm from '~/components/print-page-components/UploadForm';
import {AddFile} from '~/icons/add-file';
import {Cancel} from '~/icons/cancel';
import {Upload} from '~/icons/upload';
import {File, useFiles} from '~/state/usePrint';

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
