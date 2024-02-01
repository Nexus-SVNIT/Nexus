import { useQuery } from "@tanstack/react-query";
import ChatCard from "../../components/UI/ChatCard";
import TableThree from "../../components/UI/TableThree";
import Error from "../../components/Error/Error";
import HeadTags from "../../components/HeadTags/HeadTags";
import Loader from "../../components/Loader/Loader";
const AdminPanel = () => {
  const {
    isPending: loading,
    error,
    data,
  } = useQuery({
    queryKey: ["form-responses"],
    queryFn: () =>
      fetch(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/forms/get-responses/65b3b26107c28e11c75973d9`,
      ).then((res) => res.json()),
  });
  if (error) return <Error />;
  if (loading)
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <HeadTags title={"Loading Forms - Nexus NIT Surat"} />
        <Loader />
      </div>
    );
  return (
    <>
      <div className="2xl:mt-7.5 2xl:gap-7.5 mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6">
        <div className="col-span-12 xl:col-span-8">
          <TableThree data={data.responses} />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default AdminPanel;
