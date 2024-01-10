import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdOutgoingMail } from "react-icons/md";
import { Link } from "react-router-dom";

const ModernProfile = ({ profile }) => {
    return (
        <div className="bg-white hover:bg-blue-50 text-black flex-wrap w-[20rem] md:w-[16rem] h-[26rem] md:h-[22rem] rounded-lg overflow-hidden relative shadow-lg">
            <div className="h-[18rem] md:h-[16rem]  w-[22rem] md:w-[18rem] bg-red-500/20 rounded-b-[50%] absolute top-0 -left-[5%] overflow-hidden  border-b-8 border-red-400 ">
                <img src={profile.img ?? "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"} alt="Person" className="-z-10 w-full h-full flex items-center  transition-all duration-300 hover:scale-110 cursor-pointer" />
            </div>
            <div className=" mt-[18rem] md:mt-[15rem] px-5 py-4 ">
                <div className="flex gap-2 mb-2 ">
                    <Link to={"#"} target="_blank">
                        <FaLinkedinIn className="transition-all duration-400 bg-[#0077b5] border  hover:bg-transparent hover:text-[#0077b5]  
                        hover:border-[#0077b5] p-1 text-white rounded-sm" size={24} />
                    </Link>
                    <Link to={'#'} target="_blank">
                        <FaInstagram className="transition-all duration-400 bg-[#cd486b] border hover:bg-transparent hover:text-[#cd486b]  
                        hover:border-[#cd486b] p-1 text-white rounded-sm" size={24} />
                    </Link>
                    <Link to={'#'} target="_blank">
                        <FaFacebookF className="transition-all duration-400 bg-[#316FF6] border hover:bg-transparent hover:text-[#316FF6]  
                        hover:border-[#316FF6] p-1 text-white rounded-sm" size={24} />
                    </Link>
                </div>
                <h3 className="text-xl font-bold mb-.5">{profile?.name}</h3>
                <div className="flex justify-between items-center">
                    <h4 className="text-red-600">{profile?.role}</h4>
                    <Link to={`mailto:${profile?.email ?? "abc@gmail.com"}`} > <MdOutgoingMail className="cursor-pointer text-red-600 hover:bg-red-200 h-8 w-8 p-1 rounded-full " title="Write an Email " /></Link>
                </div>
            </div>
        </div>
    )
}

export default ModernProfile