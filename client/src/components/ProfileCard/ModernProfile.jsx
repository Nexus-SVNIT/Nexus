import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";
import { SiGooglescholar } from "react-icons/si";
import { Link } from "react-router-dom";

const ModernProfile = ({ profile, isFaculty }) => {
  return (
    <div className="relative h-[23rem] w-[18rem] flex-wrap overflow-hidden rounded-lg bg-white text-black shadow-lg hover:bg-blue-50 md:w-[16rem]">
      <div className="absolute -left-[5%]  top-0 h-[16rem] w-[20rem] overflow-hidden rounded-b-[50%] border-b-8 border-red-400 bg-red-500/20  md:h-[16rem] md:w-[18rem] ">
        <img
          src={
            profile.img ??
            "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
          }
          alt="Person"
          className="-z-10 flex h-full w-full cursor-pointer  items-center transition-all duration-300 hover:scale-110"
        />
      </div>
      <div className=" mt-[15.5rem] px-5 py-4 ">
        <div className="mb-2 flex gap-2 ">
          {isFaculty ? (
            <>
              <Link to={"#"} target="_blank">
                <FaLinkedinIn
                  className="duration-400 rounded-sm border bg-[#0077b5]  p-1 text-white  
                        transition-all hover:border-[#0077b5] hover:bg-transparent hover:text-[#0077b5]"
                  size={24}
                />
              </Link>
              <Link to={"#"} target="_blank">
                <SiGooglescholar
                  className="duration-400 rounded-sm border bg-[#3865c5] p-1 text-white  
                        transition-all hover:border-[#3865c5] hover:bg-transparent hover:text-[#3865c5]"
                  size={24}
                />
              </Link>
              <Link to={"#"} target="_blank">
                <FaXTwitter
                  className="duration-400 rounded-sm border bg-[#75787B] p-1 text-white  
                        transition-all hover:border-[#75787B] hover:bg-transparent hover:text-[#75787B]"
                  size={24}
                />
              </Link>
            </>
          ) : (
            <>
              <Link to={"#"} target="_blank">
                <FaLinkedinIn
                  className="duration-400 rounded-sm border bg-[#0077b5]  p-1 text-white  
                        transition-all hover:border-[#0077b5] hover:bg-transparent hover:text-[#0077b5]"
                  size={24}
                />
              </Link>
              <Link to={"#"} target="_blank">
                <FaGithub
                  className="duration-400 rounded-sm border bg-[#24292e] p-1 text-white  
                        transition-all hover:border-[#24292e] hover:bg-transparent hover:text-[#24292e]"
                  size={24}
                />
              </Link>
              <Link to={"#"} target="_blank">
                <FaXTwitter
                  className="duration-400 rounded-sm border bg-[#75787B] p-1 text-white  
                        transition-all hover:border-[#75787B] hover:bg-transparent hover:text-[#75787B]"
                  size={24}
                />
              </Link>
            </>
          )}
        </div>
        <h3 className="mb-.5 text-xl font-bold">{profile?.name}</h3>
        <div className="flex items-center justify-between">
          <h4 className="text-red-600">{profile?.role}</h4>
          <Link to={`mailto:${profile?.email ?? "abc@gmail.com"}`}>
            {" "}
            <MdOutgoingMail
              className="h-8 w-8 cursor-pointer rounded-full p-1 text-red-600 hover:bg-red-200 "
              title="Write an Email "
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModernProfile;
