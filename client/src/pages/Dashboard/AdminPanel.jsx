import Card from "../../components/UI/CardFour";
import UserTable from "../../components/UI/UserTable";
const AdminPanel = () => {
  return (
    <>
      <div>
        <div>
          <Card />
        </div>
        <div className="2xl:mt-7.5 2xl:gap-7.5 mt-4 grid  gap-4 md:mt-6 md:gap-6">
            <UserTable />
          {/* <ChatCard /> */}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
