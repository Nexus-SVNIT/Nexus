

import { useCallback, useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
// import { Document, Page, pdfjs } from 'https://esm.sh/react-pdf@9.1.0';
// const ANNOTATION_LAYER_CSS = 'https://esm.sh/react-pdf@9.1.0/dist/Page/AnnotationLayer.css';
// const TEXT_LAYER_CSS = 'https://esm.sh/react-pdf@9.1.0/dist/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;


const PDFViewer = ({ pdf }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1.0);
  const [isPageVisible, setIsPageVisible] = useState(false);

  const onPageLoadSuccess = (page) => {
    const containerWidth = containerRef.current?.clientWidth;
    if (containerWidth){
        const newScale = containerWidth / page.originalWidth;
        setScale(newScale);
        setPageWidth(page.originalWidth);
    }
    setIsPageVisible(true);
  };

  const handlePageChange = (newPageNumber) => {
    setIsPageVisible(false);
    setPageNumber(newPageNumber);
  }

//   const fitToWidth = () => {
//     const containerWidth = containerRef.current?.clientWidth;
//     if (containerWidth && pageWidth){
//         setScale(containerWidth / pageWidth);
//     }
//   };
  
//   useEffect(() => {
//     const handleResize = () => fitToWidth();
//     window.addEventListener('resize', handleResize);
//     return () => {
//         window.removeEventListener('resize', handleResize);
//     }
//   }, [pageWidth]);

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    setPageNumber(1);
  };

//   const onResize = useCallback(() => {
//     if (containerRef.current) {
//         setContainerWidth(containerRef.current.getBoundingClientRect().width);
//     }
//   }, []);


  const goToPreviousPage = () => handlePageChange(prevPage => Math.max(prevPage - 1, 1));
  const goToNextPage = () => handlePageChange(nextPage => Math.min(nextPage + 1, numPages));

  const zoomIn = () => setScale(prevScale => prevScale + 0.1);
  const zoomOut = () => setScale(prevScale => Math.max(0.5, prevScale - 0.1));
//   const resetZoom = () => setScale(1.0);

  return (
    <div className='mt-12 p-4 md:p-12 w-full flex flex-col items-center gap-4'>
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4 p-2 bg-gray-800 rounded-lg sticky top-0 z-10">
        <button 
            onClick={goToPreviousPage} 
            disabled={!numPages || pageNumber<=1} 
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
            Previous
        </button>
        <span className='text-white font-medium'>
            Page {pageNumber} of {numPages || '--'}
        </span>
        <button 
            onClick={goToNextPage} 
            disabled={!numPages || pageNumber>=numPages} 
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
            Next
        </button>
        <div className='w-px h-6 bg-gray-600 mx-2'></div>
        <button onClick={zoomOut} className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'>
          Zoom Out
        </button>
        {/* <button onClick={fitToWidth} className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'>
          Fit
        </button> */}
        <button onClick={zoomIn} className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'>
          Zoom In
        </button>
      </div>
      <div className='w-full max-w-4xl h-[80vh] overflow-y-auto border-4 border-gray-700 rounded-lg bg-gray-600'>
        <Document
          file={pdf}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p className="text-white text-center p-4">Loading PDF...</p>}
          error={<p className='text-red-400 text-center p-4'>Failed to load PDF.</p>}
        >
            <Page
                key={`page_${pageNumber}`}
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onPageLoadSuccess}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className={isPageVisible ? '' : 'invisible'}
            />
        </Document>
      </div>
    </div>
  );
}

export default PDFViewer;