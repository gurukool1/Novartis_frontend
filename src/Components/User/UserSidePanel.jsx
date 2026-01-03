import { NavLink } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { LuFolderOpen } from 'react-icons/lu';
import { MdOutlineQuestionAnswer } from "react-icons/md";
const UserSidePanel = () => {
  return (
    <>
      <div className='side-link'>
        <ul>
          <li><NavLink to="/user/dashboard"><span><RxDashboard /> <div>Dashboard</div></span></NavLink></li>
          <li><NavLink to="/user/my-cases"><span><LuFolderOpen /> <div>My Cases</div></span></NavLink></li>
          <li><NavLink to="/user/instruction"><span><AiOutlineInfoCircle /> <div>Instruction</div></span></NavLink></li>
          {/* <li><NavLink to="/user/faq"><span><MdOutlineQuestionAnswer /> <div>FAQ</div></span></NavLink></li> */}
        </ul>
      </div >

    </>
  )
}

export default UserSidePanel