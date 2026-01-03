import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainWrapper from '../../../CommonComponents/MainWrapper';
import { Header } from '../../../CommonComponents/Header';
import Pagination from "../../../CommonComponents/Pagination";
import { Link } from 'react-router-dom';
import { getDashboardData } from '../../../Redux/Actions/userActions';
import { getAllCases, getAssignedCases, getAllTotalCases } from '../../../Redux/Actions/CaseAction';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import ExportExcel from '../../../CommonComponents/ExportExcel';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = React.useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { dashboardData } = useSelector(state => state.users);
  const { submittedCasesData } = useSelector(state => state.case);
  // const { cases, assignedCases } = useSelector(state => state.case);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const COLORS = ['#7974D7', '#82CA9D', '#FF8042'];
  const DashboardView = dashboardData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(dashboardData.length / itemsPerPage);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US',{
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            timeZone: "America/Los_Angeles"
        });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getModuleName = (formTypeObj = {}) => {
    const map = {
      Physician: "PhGA",
      AllForms: "All Modules",
    };

    return Object.values(formTypeObj)
      .map(v => map[v] || v)
      .join(", ");
  };


  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'begin': return 'red';
      case 'resume': return 'yellow';
      case 'submitted': return 'green';
      default: return 'red';
    }
  };

  const caseStats = useMemo(() => {
    return [
      { name: 'Total Cases', value: submittedCasesData.totalCases },
      { name: 'Assigned Cases', value: submittedCasesData.assignedCasesCount },
      { name: 'Unassigned Cases', value: submittedCasesData.unassignedCasesCount }
    ];
  }, [submittedCasesData]);



  const exportData = useMemo(() => {
    if (!dashboardData || !Array.isArray(dashboardData) || dashboardData.length === 0) {
      return [];
    }

    return dashboardData.flatMap((item) =>
      item.caseAssignments && item.caseAssignments.length > 0 ?
        item.caseAssignments.map((assignment) => ({
          "company Name": item.user.company_name,
          "Study Name": item.user.study_name,
          "Case Title": assignment.case.title,
          // "Module Name": Object.values(assignment.formType).join(", "),
          "Module Name": getModuleName(assignment.formType),
          "Username": item.user.username,
          "Email": item.user.email,
          "Country": item.user.country,
          "Assigned Date": formatDate(assignment.assignedAt),
          //  "Submitted Date": formatDate(assignment.completedAt),
          "Submitted Date": assignment.completedAt ? formatDate(assignment.completedAt) : 'N/A',
          "Status": assignment.status,
          "percentage": assignment.percentage
        })) :
        [{
          "company Name": "N/A",
          "Study Name": "N/A",
          "Case Title": "N/A",
          "Module Name": "N/A",
          "Username": item.user.username,
          "Email": item.user.email,
          "Country": item.user.country,
          "Assigned Date": "N/A",
          "Submitted Date": "N/A",
          "Status": "No Cases Assigned",
          "percentage": "N/A"
        }]
    );
  }, [dashboardData]);

  useEffect(() => {
    setLoader(true);
    dispatch(getAllTotalCases());
    dispatch(getDashboardData(setLoader));
  }, []);

  return (
    <MainWrapper>
      <div className="title-header mt-3">
        <div className='d-flex align-items-center justify-content-between flex-wrap gap-3'>
          <h3>Cases Over View</h3>
          <div className='d-flex gap-3'>
            <div className='d-flex align-items-center gap-2'>
              <Link to="/admin/upload">
                <button className='site-link'><span>Upload A New Case</span></button>
              </Link>
              <Link to="/admin/documents">
                <button className='site-link'><span>View All Cases</span></button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container mt-5">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={caseStats}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {caseStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} cases`, 'Count']} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="d-flex align-items-center justify-content-between gap-2">
          <h3>Cases Management</h3>
          <ExportExcel
            data={exportData}
            fileName="summary_report"
            className="green"
          />
        </div>

        <div className="table-outer mt-4">
          <div className='table-responsive scrollbar-clr'>
            <table className='table theme-table bdr'>
              <thead>
                <tr>
                  <th className='text-start'>Company Name</th>
                  <th className='text-start'>Study Name</th>
                  <th className='text-start'>Case Title</th>
                  <th className='text-start'>Module Name</th>
                  <th className='text-center'>Username</th>
                  <th className='text-center'>Email</th>
                  <th className='text-start'>Country</th>
                  <th className='text-center'>Assigned Date</th>
                  <th className='text-center'>Submitted Date</th>
                  <th className='text-center'>Status</th>
                  <th className='text-center'>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {loader ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) :
                  DashboardView.length > 0 ? (
                    DashboardView.map((item, index) => {
                      // If the user has case assignments
                      if (item.caseAssignments.length > 0) {
                        return item.caseAssignments.map((assignment, idx) => (
                          <tr key={idx}>
                            <td className='text-start'>
                              {item.user.company_name || 'N/A'}
                            </td>
                            <td className='text-start'>
                              {item.user.study_name || 'N/A'}
                            </td>
                            <td className='text-start'>
                              {assignment.case.title || 'N/A'}
                            </td>
                            {/* // <tr key={`${index}-${idx}`}>
                          //   <td className='text-start'>
                          //     {index + idx + 1}
                          //   </td> */}
                            <td className='text-start'>{getModuleName(assignment.formType)}</td>
                            <td className='text-center'>
                              {item.user.username || 'N/A'}
                            </td>
                            <td className='text-center'>
                              {item.user.email || 'N/A'}
                            </td>
                            <td className='text-start'>
                              {item.user.country || 'N/A'}
                            </td>
                            <td className='text-center'>
                              {formatDate(assignment.assignedAt)}
                            </td>
                            {/* <td className='text-center'>
                              {formatDate(assignment.completedAt || '-')}
                            </td> */}
                            <td className='text-center'>
                              {assignment.completedAt ? formatDate(assignment.completedAt) : '-'}
                            </td>

                            <td className='text-center'>
                              <span className={`badge ${getStatusBadgeClass(assignment.status)}`}>
                                {assignment.status.toLowerCase() === 'submitted' ? 'Completed' : assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                              </span>
                            </td>
                            <td className='text-center'>

                              {assignment.percentage}%
                            </td>
                          </tr>
                        ));
                      } else {
                        return (
                          <tr key={index}>
                            {/* <td className='text-start'>-</td> */}
                            <td className='text-start'>{item.user.company_name || '-'}</td>
                            <td className='text-start'>{item.user.study_name || '-'}</td>
                            <td className='text-start'>{'-'}</td>
                            <td className='text-start'>{'-'}</td>
                            <td className='text-center'>{item.user.username || '-'}</td>
                            <td className='text-center'>{item.user.email || '-'}</td>
                            <td className='text-start'>{item.user.country || '-'}</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                            <td className='text-center'>-</td>
                          </tr>
                        );
                      }
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No assigned cases found
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {!loader && totalPages >= 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </MainWrapper>
  );
};
