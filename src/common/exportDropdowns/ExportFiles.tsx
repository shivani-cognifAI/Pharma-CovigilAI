import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import { exportToExcel } from "react-easy-export";
import { Utils } from "../../../utils/utils";

// FIX : for now keeping item type as any, Need to assign appropriate type here
interface ExportFilesProps {
  data: any[];
  headers: string[];
  fileNamePrefix: string;
  fileSavedName: string;
  tableBodyKeys: any[];
  disable: boolean;
  searchRow: any;
  startRow: any;
  endRow: any;
  totalCountRow?: any;
  currentDateTimeRow?: any;
}

const ExportFiles: React.FC<ExportFilesProps> = ({
  data,
  headers,
  fileNamePrefix,
  fileSavedName,
  tableBodyKeys,
  disable,
  searchRow,
  totalCountRow,
  currentDateTimeRow,
  startRow,
  endRow,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const actionRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const exportToPDF = (content: any, filename = "data.pdf") => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Please allow popups to print content.");
      return;
    }

    printWindow.document.write(content);
    printWindow.document.title = filename;
    printWindow.document.close();
    printWindow.onload = function () {
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };

  /**
   * Handles the download of data as a PDF file.
   */
  const handleDownloadPDF = (selectedHeaders: any, tableBodyKeys: any) => {
  setIsExportLoading(true);

  // Modify data to include pmid and pubmed_link
  const modifiedData = data.map((item: any) => {
    const { pmid, ...rest } = item;

    return {
      ...rest,
      pmid: pmid || "", // Rename pmid to pmid
      pubmed_link: pmid
        ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}`
        : "", // Generate pubmed link if pmid exists
    };
  });

  const dataRowsHTML = modifiedData
    .map(
      (item) => `
      <tr>
        ${tableBodyKeys.map((key: string) => `<td>${item[key]}</td>`).join("")}
      </tr>
    `
    )
    .join("");

  const content =
    searchRow || startRow || endRow || totalCountRow || currentDateTimeRow
      ? `
    <style>
      .table-container {
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        table-layout: auto;
        border-collapse: collapse;
      }
      th, td {
        padding: 6px;
        text-align: left;
        border: 1px solid #ddd;
        white-space: pre-wrap;
        overflow: hidden;
        word-wrap: break-word;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
    <h1>${fileNamePrefix}</h1>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            ${selectedHeaders
              .map((header: string) => `<th>${header}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${dataRowsHTML}
        </tbody>
      </table>
    </div>
    `
      : `
    <style>
      .table-container {
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        table-layout: auto;
        border-collapse: collapse;
      }
      th, td {
        padding: 6px;
        text-align: left;
        border: 1px solid #ddd;
        white-space: pre-wrap;
        overflow: hidden;
        word-wrap: break-word;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
    <h1>${fileNamePrefix}</h1>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            ${selectedHeaders
              .map((header: string) => `<th>${header}</th>`)
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${modifiedData
            .map(
              (item) => `
            <tr>
              ${tableBodyKeys
                .map((key: string) => `<td>${item[key]}</td>`)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    `;

  // Export the content to PDF
  exportToPDF(content, `${fileSavedName}.pdf`);

  setIsExportLoading(false);
};

  /**
   * Handles the download of data as a CSV file.
   */

  /**
   * Handles the download of data as an Excel file.
   */
  const handleDownloadExcel = (headers: any, tableBodyKeys: any) => {
  setIsExportLoading(true);

  // Modify data to include article_id and pubmed_link
  const modifiedData = data.map((item: any) => {
    const { pmid, ...rest } = item;

    return {
      ...rest,
      pmid: pmid || "", // Ensure pmid is not undefined
      pubmed_link: pmid
        ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}`
        : "", 
    };
  });

  const renderdata =
    searchRow || startRow || endRow || totalCountRow || currentDateTimeRow
      ? [
          searchRow.concat(
            new Array(Math.max(0, headers.length - searchRow.length)).fill("")
          ),
          startRow.concat(
            new Array(Math.max(0, headers.length - startRow.length)).fill("")
          ),
          endRow.concat(
            new Array(Math.max(0, headers.length - endRow.length)).fill("")
          ),
          totalCountRow.concat(
            new Array(Math.max(0, headers.length - totalCountRow.length)).fill(
              ""
            )
          ),
          currentDateTimeRow.concat(
            new Array(
              Math.max(0, headers.length - currentDateTimeRow.length)
            ).fill("")
          ),
          headers,
          ...modifiedData.map((item) =>
            tableBodyKeys.map((key: any) => item[key])
          ),
        ]
      : [
          headers,
          ...modifiedData.map((item) =>
            tableBodyKeys.map((key: any) => item[key])
          ),
        ];

  // Export to Excel
  exportToExcel(renderdata, `${fileSavedName}.xls`);

  setIsExportLoading(false);
};


  return (
    <div className="relative">
      <div
        ref={actionRef}
        onClick={() => {
          toggleDropdown();
        }}
      >
        <button
          className={`rounded-md border ml-1 cursor-pointer border-gray text-sm font-medium font-archivo py-2 px-8 ${
            disable || Utils.isPermissionGranted("export_files")
              ? "bg-yellow text-white text-14"
              : "disabled-select"
          }`}
          disabled={disable || !Utils.isPermissionGranted("export_files")}
        >
          Export
        </button>
      </div>

      {isDropdownOpen && (
        <div className="relative">
          <div className="relative z-10 top-[0px] right-0 mt-2 bg-white shadow-style rounded-[15px] border-gray-300">
            <div className="text-14">
              <div
                className="flex py-3 px-4 cursor-pointer"
                onClick={(e) => {
                  handleDownloadPDF(headers, tableBodyKeys);
                }}
              >
                AS PDF
              </div>

              <div
                className="flex py-3 px-4 cursor-pointer"
                onClick={(e: any) => {
                  handleDownloadExcel(headers, tableBodyKeys);
                }}
              >
                As Excel
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportFiles;

ExportFiles.defaultProps = {
  data: [],
  headers: [],
  fileNamePrefix: "Export",
  fileSavedName: "export",
  tableBodyKeys: [],
  disable: false,
  searchRow: null,
  startRow: null,
  endRow: null,
  totalCountRow: null,
  currentDateTimeRow: null,
};
