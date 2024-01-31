import ProductOne from "../../images/product/product-01.png";
import ProductTwo from "../../images/product/product-02.png";
import ProductThree from "../../images/product/product-03.png";
import ProductFour from "../../images/product/product-04.png";

const TableTwo = () => {
  return (
    <div className="border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white">
      <div className="xl:px-7.5 px-4 py-6 md:px-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Top Products
        </h4>
      </div>

      <div className="border-stroke py-4.5 dark:border-strokedark 2xl:px-7.5 grid grid-cols-6 border-t px-4 sm:grid-cols-8 md:px-6">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Price</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Sold</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Profit</p>
        </div>
      </div>

      <div className="border-stroke py-4.5 dark:border-strokedark 2xl:px-7.5 grid grid-cols-6 border-t px-4 sm:grid-cols-8 md:px-6">
        <div className="col-span-3 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-12.5 w-15 rounded-md">
              <img src={ProductOne} alt="Product" />
            </div>
            <p className="text-sm text-black dark:text-white">
              Apple Watch Series 7
            </p>
          </div>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white">Electronics</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">$269</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">22</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-meta-3 text-sm">$45</p>
        </div>
      </div>
      <div className="border-stroke py-4.5 dark:border-strokedark 2xl:px-7.5 grid grid-cols-6 border-t px-4 sm:grid-cols-8 md:px-6">
        <div className="col-span-3 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-12.5 w-15 rounded-md">
              <img src={ProductTwo} alt="Product" />
            </div>
            <p className="text-sm text-black dark:text-white">Macbook Pro M1</p>
          </div>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white">Electronics</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">$546</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">34</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-meta-3 text-sm">$125</p>
        </div>
      </div>
      <div className="border-stroke py-4.5 dark:border-strokedark 2xl:px-7.5 grid grid-cols-6 border-t px-4 sm:grid-cols-8 md:px-6">
        <div className="col-span-3 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-12.5 w-15 rounded-md">
              <img src={ProductThree} alt="Product" />
            </div>
            <p className="text-sm text-black dark:text-white">
              Dell Inspiron 15
            </p>
          </div>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white">Electronics</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">$443</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">64</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-meta-3 text-sm">$247</p>
        </div>
      </div>
      <div className="border-stroke py-4.5 dark:border-strokedark 2xl:px-7.5 grid grid-cols-6 border-t px-4 sm:grid-cols-8 md:px-6">
        <div className="col-span-3 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-12.5 w-15 rounded-md">
              <img src={ProductFour} alt="Product" />
            </div>
            <p className="text-sm text-black dark:text-white">HP Probook 450</p>
          </div>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="text-sm text-black dark:text-white">Electronics</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">$499</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-sm text-black dark:text-white">72</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-meta-3 text-sm">$103</p>
        </div>
      </div>
    </div>
  );
};

export default TableTwo;
