import {useFiles} from '~/state/usePrint';

function PrintingOptions() {
  const {options, setOptions} = useFiles();
  return (
    <div className="relative w-full  border-x px-2 flex flex-col justify-center after:absolute after:top-10 after:-right-[5%] after:w-[110%] after:h-1 after:bg-transparent after:border-b  before:absolute before:bottom-10 before:-right-[5%] before:w-[110%] before:h-1 before:bg-transparent before:border-b before:border-gray-300 border-gray-300 after:border-gray-300">
      <div className="bg-gray-200 shadow-sm border border-gray-300 rounded-lg p-2 text-sm flex flex-col gap-2">
        <h2 className="font-bold capitalize">printing Options</h2>
        <ul className="flex flex-col   border-gray-300 capitalize">
          <li className="flex justify-between items-center  ">
            <span>page per side</span>
            <div className="flex gap-2">
              <button
                title={options.pagesPerSide === 1 ? 'Selected' : ''}
                className={`py-1 px-2 rounded-md ${
                  options.pagesPerSide === 1
                    ? 'bg-gray-100 text-gray-500 border border-gray-300'
                    : 'bg-gray-50'
                }`}
                onClick={() => setOptions({pagesPerSide: 1})}
              >
                1
              </button>
              <button
                title={options.pagesPerSide === 2 ? 'Selected' : ''}
                className={`py-1 px-2 rounded-md ${
                  options.pagesPerSide === 2
                    ? 'bg-gray-100 text-gray-500 border border-gray-300'
                    : 'bg-gray-50'
                }`}
                onClick={() => setOptions({pagesPerSide: 2})}
              >
                2
              </button>
            </div>
          </li>
          <li className="flex justify-between items-center border-y border-gray-300 py-2">
            <span>orientation</span>
            <div className="flex gap-2">
              <button
                title={options.orientation === 'portrait' ? 'Selected' : ''}
                className={`py-1 px-2 rounded-md ${
                  options.orientation === 'portrait'
                    ? 'bg-gray-100 text-gray-500 border border-gray-300'
                    : 'bg-gray-50'
                }`}
                onClick={() => setOptions({orientation: 'portrait'})}
              >
                portrait
              </button>
              <button
                title={options.orientation === 'landscape' ? 'Selected' : ''}
                className={`py-1 px-2 rounded-md ${
                  options.orientation === 'landscape'
                    ? 'bg-gray-100 text-gray-500 border border-gray-300'
                    : 'bg-gray-50'
                }`}
                onClick={() => setOptions({orientation: 'landscape'})}
              >
                landscape
              </button>
            </div>
          </li>
          <li className="flex justify-between items-center">
            <span>color</span>
            <div className="flex gap-2">
              <button
                title={options.color === 'B&W' ? 'Selected' : ''}
                className={`py-1 px-2 rounded-md ${
                  options.color === 'B&W'
                    ? 'bg-gray-100 text-gray-500 border border-gray-300'
                    : 'bg-gray-50'
                }`}
                onClick={() => setOptions({color: 'B&W'})}
              >
                B&W
              </button>
              <button
                title={options.color === 'Colored' ? 'Selected' : ''}
                className={`py-1 px-2 rounded-md ${
                  options.color === 'Colored'
                    ? 'bg-gray-100 text-gray-500 border border-gray-300'
                    : 'bg-gray-50'
                }`}
                onClick={() => setOptions({color: 'Colored'})}
              >
                Colored
              </button>
            </div>
          </li>
        </ul>
      </div>{' '}
    </div>
  );
}

export default PrintingOptions;
