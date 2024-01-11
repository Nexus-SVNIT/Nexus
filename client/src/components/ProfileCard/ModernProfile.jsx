import { FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiGooglescholar } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";
import { MdOutgoingMail } from "react-icons/md";
import { Link } from "react-router-dom";

const ModernProfile = ({ profile, isFaculty }) => {
    return (
        <div className="bg-white hover:bg-blue-50 text-black flex-wrap w-[20rem] md:w-[16rem] h-[26rem] md:h-[22rem] rounded-lg overflow-hidden relative shadow-lg">
            <div className="h-[18rem] md:h-[16rem]  w-[22rem] md:w-[18rem] bg-red-500/20 rounded-b-[50%] absolute top-0 -left-[5%] overflow-hidden  border-b-8 border-red-400 ">
                <img src={profile.img ?? "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"} alt="Person" className="-z-10 w-full h-full flex items-center  transition-all duration-300 hover:scale-110 cursor-pointer" />
            </div>
            <div className=" mt-[18rem] md:mt-[15rem] px-5 py-4 ">
                <div className="flex gap-2 mb-2 ">
                    {isFaculty ?
                        <>
                            <Link to={"#"} target="_blank">
                                <FaLinkedinIn className="transition-all duration-400 bg-[#0077b5] border  hover:bg-transparent hover:text-[#0077b5]  
                        hover:border-[#0077b5] p-1 text-white rounded-sm" size={24} />
                            </Link>
                            <Link to={'#'} target="_blank">
                                <SiGooglescholar className="transition-all duration-400 bg-[#3865c5] border hover:bg-transparent hover:text-[#3865c5]  
                        hover:border-[#3865c5] p-1 text-white rounded-sm" size={24} />
                            </Link>
                            <Link to={'#'} target="_blank">
                                <FaXTwitter className="transition-all duration-400 bg-[#75787B] border hover:bg-transparent hover:text-[#75787B]  
                        hover:border-[#75787B] p-1 text-white rounded-sm" size={24} />
                            </Link>
                        </> :
                        <>
                            <Link to={"#"} target="_blank">
                                <FaLinkedinIn className="transition-all duration-400 bg-[#0077b5] border  hover:bg-transparent hover:text-[#0077b5]  
                        hover:border-[#0077b5] p-1 text-white rounded-sm" size={24} />
                            </Link>
                            <Link to={'#'} target="_blank">
                                <FaGithub className="transition-all duration-400 bg-[#24292e] border hover:bg-transparent hover:text-[#24292e]  
                        hover:border-[#24292e] p-1 text-white rounded-sm" size={24} />
                            </Link>
                            <Link to={'#'} target="_blank">
                                <FaXTwitter className="transition-all duration-400 bg-[#75787B] border hover:bg-transparent hover:text-[#75787B]  
                        hover:border-[#75787B] p-1 text-white rounded-sm" size={24} />
                            </Link>
                        </>}
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