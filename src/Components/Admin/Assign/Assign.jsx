import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
//import MainWrapper from '../CommonComponents/MainWrapper'
import MainWrapper from "../../../CommonComponents/MainWrapper";
//import { Header } from './CommonComponents/Header';
import { Header } from "../../../CommonComponents/Header";
import { IoSearchOutline } from "react-icons/io5";
import { getAllCases } from "../../../Redux/Actions/CaseAction";
//import { getUsers } from '../../../Redux/Actions/userActions';
import Pagination from "../../../CommonComponents/Pagination";
//import { showLoader, hideLoader } from '../../../Redux/Actions/LoaderAction';
export const Assign = () => {
  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const { cases } = useSelector((state) => state.case);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignCase = cases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cases.length / itemsPerPage);
  const [loading, setLoading] = useState(true);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getAllCases(setLoading));
    // dispatch(getUsers());
  }, []);

  return (
    <>
      <MainWrapper>
        <div className="title-header mt-3">
          <div className="d-flex align-items-center justify-content-between">
            <h3>Assign Cases to Users</h3>
            <div className="d-flex align-items-center gap-2 justify-content-between justify-content-sm-end">
              <div className="table-search">
                <input
                  className="input"
                  type="text"
                  placeholder="Search"
                  name="search"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <span className="search-icon">
                  <IoSearchOutline className="fs-5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="table-outer mt-3">
          <div className="table-responsive scrollbar-clr">
            <table className="table theme-table bdr">
              <thead>
                <tr>
                  <th className="text-start">Title</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Time</th>
                  <th className="text-center">Assign</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : cases && currentAssignCase.length > 0 ? (
                  currentAssignCase
                    .filter((caseItem) =>
                      caseItem.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((caseItem) => (
                      <tr key={caseItem.id}>
                        <td>{caseItem.title}</td>
                        <td className="text-center">
                          {new Date(caseItem.createdAt).toLocaleDateString('en-US',{
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                              timeZone: "America/Los_Angeles"
                          })}
                                          </td>
                                          <td className="text-center">
                                            {new Date(caseItem.createdAt).toLocaleTimeString('en-US', { 
                              hour: "2-digit", 
                              minute: "2-digit",
                              timeZone: "America/Los_Angeles"
                          })}
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/admin/documents/${caseItem.id}/assign`}
                            state={{ caseTitle: caseItem.title }}
                          >
                            <span className="badge yellow me-1 mb-1">
                              Assign
                            </span>
                          </Link>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No assign cases available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && totalPages >= 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </MainWrapper>
    </>
  );
};
