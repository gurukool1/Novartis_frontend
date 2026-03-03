import { NavLink, useLocation } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { MdOutlineAssignmentInd } from 'react-icons/md';
import { LuUserRound } from 'react-icons/lu';
import { AiOutlineFileDone } from 'react-icons/ai';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { MdOutlineAppRegistration } from "react-icons/md";
import { MdOutlineFactCheck } from "react-icons/md";
const SidePanel = ({ onLinkClick }) => {
  const location = useLocation();
  const [showSettingsOptions, setShowSettingsOptions] = useState(false);

  useEffect(() => {
    if (
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/admin/assigned-cases')
    ) {
      setShowSettingsOptions(true);
    }
  }, [location.pathname]);

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setShowSettingsOptions(prev => !prev);
  };



  return (
    <div className='side-link'>
      <ul>
        <li><NavLink to="/admin/dashboard" onClick={onLinkClick}><span><RxDashboard /> <div>Dashboard</div></span></NavLink></li>
        <li><NavLink to="/admin/upload" onClick={onLinkClick}><span><RiUploadCloud2Line /> <div>Upload Case</div></span></NavLink></li>


     <li>
  <NavLink to="/admin/answer-sheet" onClick={onLinkClick}>
    <span>
      <MdOutlineFactCheck /> 
      <div>Answer Sheet</div>
    </span>
  </NavLink>
</li>

        <li>
          <a href="#" onClick={handleSettingsClick} style={{ cursor: "pointer" }}>
            <span className='w-100'>
              <MdOutlineAssignmentInd />
              <div className='d-flex align-items-center justify-content-between w-100'>
                <span>Assign Cases</span>
                {showSettingsOptions ? <FaAngleDown /> : <FaAngleRight />}
              </div>
            </span>
          </a>

          <div style={{ display: showSettingsOptions ? "block" : "none", paddingLeft: "20px" }}>
            <NavLink className="mb-2 mt-2" to="/admin/documents/assign" onClick={onLinkClick}>
              <span><LuUserRound /> <div>Assign</div></span>
            </NavLink>
            <NavLink to="/admin/assigned-cases" onClick={onLinkClick}>
              <span><LuUserRound /> <div>Assigned Cases</div></span>
            </NavLink>
          </div>
        </li>
        <li><NavLink to="/admin/register"><span><MdOutlineAppRegistration /><div>Add User</div></span></NavLink></li>
        <li><NavLink to="/admin/User-management" onClick={onLinkClick}><span><LuUserRound /> <div>Users</div></span></NavLink></li>
        <li><NavLink to="/admin/submissions"><span><AiOutlineFileDone /> <div>Submitted Cases</div></span></NavLink></li>
        <li><NavLink to="/admin/reports"><span><HiOutlineDocumentReport /> <div>Reports</div></span></NavLink></li>
        <li><NavLink to="/admin/faq"><span><MdOutlineQuestionAnswer /> <div>FAQ</div></span></NavLink></li>

      </ul>
    </div>
  );
};

export default SidePanel;
