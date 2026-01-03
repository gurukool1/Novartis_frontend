import React from 'react';
import * as XLSX from 'xlsx';
import { TbTableExport } from 'react-icons/tb';
import { setAlert } from "../Redux/Actions/AlertActions";
import { useDispatch } from 'react-redux';
const ExportExcel = ({ data, fileName, buttonText = "Export Excel", className = "" }) => {
    const dispatch = useDispatch();
    const exportToExcel = () => {
        if (data.length === 0) {
            dispatch(setAlert("No data to export!", "warning"));
            return;
        }

        const ws = XLSX.utils.json_to_sheet(data);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Data");

        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <button className={`site-link ${className}`} onClick={exportToExcel}>
            <span><TbTableExport /> {buttonText}</span>
        </button>
    );
};

export default ExportExcel;