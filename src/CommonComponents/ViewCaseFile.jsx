import { FaRegFileLines } from "react-icons/fa6"
import { Header } from "./Header"
import MainWrapper from "./MainWrapper"


export const ViewCaseFile = () => {
  return (
    <>
      <MainWrapper>
        <div className="title-header mt-3">
          <div className='d-flex align-items-center justify-content-between'>
            <h3 className="d-flex align-items-center gap-2"><FaRegFileLines /> Viewing Case File: Case 2</h3>
          </div>
        </div>
      </MainWrapper>
    </>
  )
}
