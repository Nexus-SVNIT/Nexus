import Breadcrumb from "../components/UI/Breadcrumb.jsx";
import ChartFour from "../components/UI/ChartFour";
import ChartOne from "../components/UI/ChartOne.jsx";
import ChartThree from "../components/UI/ChartThree.jsx";
import ChartTwo from "../components/UI/ChartTwo.jsx";

const Chart = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="2xl:gap-7.5 grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ChartFour />
        </div>
        <ChartOne />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
