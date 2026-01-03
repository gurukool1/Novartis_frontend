import React, { useState, useEffect } from 'react'
import MainWrapper from '../../../CommonComponents/MainWrapper'
import { Header } from '../../../CommonComponents/Header'
import { LuUserRound } from 'react-icons/lu'
import { FaAngleRight, FaCheck, FaRegClock } from 'react-icons/fa6'
import { Nav, Tab } from 'react-bootstrap'
import { TotalUser } from './TotalUser'
import { AssignedUsers } from './AssignedUsers'
import { UnassignedUsers } from './UnassignedUsers'
import { Case1Assigned } from './Case1Assigned'
import { TbTag } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../../Redux/Actions/userActions';
import { getAssignedCases } from '../../../Redux/Actions/CaseAction';
import { getAssignedUsersByCaseId } from '../../../Redux/Actions/userActions';
export const Reports = () => {
  const [activeTab, setActiveTab] = useState("first");
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const [selectedCase, setSelectedCase] = useState(null);
  const { assignedCases } = useSelector(state => state.case);
  const { assignedUsersByCaseId } = useSelector(state => state.users.users);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getAssignedCases());
  }, []);
  const uniqueCaseIds = [...new Set(assignedCases.map(item => item.caseId))];
  //   // Get unique case IDs from assigned cases
  const uniqueCaseNumber = [...new Set(assignedCases.map(item => item.caseNumber))];
  //const totalUsers = users.filter(user => user.role === 'user' && user.isDeleted === 0).length;
  const totalUsers = users.filter(user => user.role === 'user').length;
  // Calculate case 1 assigned count
  //const case1AssignedCount = case1AssignedUsers.length;

  const assignedCasesData = assignedCases

  const uniqueUserEmails = [...new Set(assignedCasesData.map(item => item.userEmail))];
  const assignedUserCount = uniqueUserEmails.length;


  const assignedUserEmails = new Set(assignedCasesData.map(item => item.userEmail));

  const unassignedUsers = users.filter(user =>
    user.role === 'user' && !assignedUserEmails.has(user.email)
  );
  const unassignedUsersCount = unassignedUsers.length;

  // Get the count of assigned cases (unique case IDs)
  const assignedCasesCount = uniqueCaseIds.length;
  return (
    <>
      <MainWrapper active={false}>
        <div className="title-header mt-3">
          <Tab.Container id="left-tabs-example" activeKey={activeTab}>
            <Nav variant="v" className="tab-style-1">
              <Nav.Item className="w-100">
                <div className="row g-3">
                  <Nav.Link eventKey="first" className="col-md-6 col-lg-4 col-xl-3">
                    <div className="theme-card-1 text-center blue">
                      <div className="head blue d-flex align-items-center justify-content-between gap-3">
                        <h6>Total Users</h6>
                        <LuUserRound fontSize={24} />
                      </div>
                      <h4 className="mt-3 text-dark">{totalUsers}</h4>
                      <button className="site-link blue my-3" onClick={() => setActiveTab("first")}>
                        <span>View Details <FaAngleRight /></span>
                      </button>
                    </div>
                  </Nav.Link>

                  <Nav.Link eventKey="second" className="col-md-6 col-lg-4 col-xl-3">
                    <div className="theme-card-1 text-center green">
                      <div className="head green d-flex align-items-center justify-content-between gap-3">
                        <h6>Assigned Users</h6>
                        <FaCheck fontSize={24} />
                      </div>
                      <h4 className="mt-3 text-dark">{assignedUserCount}</h4>
                      <button className="site-link green my-3" onClick={() => setActiveTab("second")}>
                        <span>View Details <FaAngleRight /></span>
                      </button>
                    </div>
                  </Nav.Link>

                  <Nav.Link eventKey="third" className="col-md-6 col-lg-4 col-xl-3">
                    <div className="theme-card-1 text-center yellow">
                      <div className="head yellow d-flex align-items-center justify-content-between gap-3">
                        <h6>Unassigned Users</h6>
                        <FaRegClock fontSize={24} />
                      </div>
                      <h4 className="mt-3 text-dark">{unassignedUsersCount}</h4>
                      <button className="site-link yellow my-3" onClick={() => setActiveTab("third")}>
                        <span>View Details <FaAngleRight /></span>
                      </button>
                    </div>
                  </Nav.Link>

                  <Nav.Link eventKey="fourth" className="col-md-6 col-lg-4 col-xl-3">
                    <div className="theme-card-1 text-center light-blue">
                      <div className="head light-blue d-flex align-items-center justify-content-between gap-3">
                        <h6>Case  Assigned</h6>
                        <TbTag fontSize={24} />
                      </div>
                      <h4 className="mt-3 text-dark">{assignedCasesCount}</h4>
                      <button className="site-link light-blue my-3" onClick={() => setActiveTab("fourth")}>
                        <span>View Details <FaAngleRight /></span>
                      </button>
                    </div>
                  </Nav.Link>
                </div>
              </Nav.Item>
            </Nav>

            <Tab.Content className="pt-3">
              <Tab.Pane eventKey="first">
                <TotalUser users={users} />
              </Tab.Pane>

              <Tab.Pane eventKey="second">
                <AssignedUsers assignedCases={assignedCasesData} />
              </Tab.Pane>

              <Tab.Pane eventKey="third">
                <UnassignedUsers users={users} assignedCases={assignedCasesData} />
              </Tab.Pane>

              <Tab.Pane eventKey="fourth">
                <Case1Assigned
                  uniqueCaseNumber={uniqueCaseNumber}
                  selectedCase={selectedCase}
                  setSelectedCase={setSelectedCase}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </MainWrapper>
    </>
  );
}
