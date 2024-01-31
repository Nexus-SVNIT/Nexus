import ChatCard from "../../components/UI/ChatCard";
import TableThree from "../../components/UI/TableThree";
const AdminPanel = () => {
  return (
    <>
      <div className="2xl:mt-7.5 2xl:gap-7.5 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <TableThree />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default AdminPanel;
