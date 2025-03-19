import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import { exportToCSV, exportToExcel } from "react-easy-export";
import { Utils } from "../../../utils/utils";
import HeaderSelectionModal from "../HeaderSelectionModal";
import Modal from "../modal/model";

// FIX : for now keeping item type as any, Need to assign appropriate type here
interface ExportDropdownProps {
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
mandatoryHeaders:any;
mandatoryBodyKeys:any

}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
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
mandatoryHeaders,
mandatoryBodyKeys

}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [selectedHeaders, setSelectedHeaders] = useState(headers);
  const [selectedtableBodyKeys, setSelectedtableBodyKeys] = useState(tableBodyKeys);

 

  const dropdownRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleExportClick = (headers: any, tableBodyKeys: any) => {
    const finalHeaders = [...mandatoryHeaders, ...headers];
    const finalTableBodyKeys = [...mandatoryBodyKeys, ...tableBodyKeys];

    if (isPdfModalOpen) {
      handleDownloadPDF(finalHeaders, finalTableBodyKeys);
    } else if (isExcelModalOpen) {

      handleDownloadExcel(finalHeaders, finalTableBodyKeys);
    }
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

const handleDownloadPDF = (selectedHeaders: any, tableBodyKeys: any) => {
  setIsExportLoading(true);

  // Check if  'article_id' is included in the selected headers
  const hasArticleId = selectedHeaders.includes('Article Id')

  // Conditionally add 'Pubmed Link' header if  'article_id' is present
  const updatedHeaders = hasArticleId ? [...selectedHeaders, 'Pubmed Link'] : selectedHeaders;

  // Generate the table rows with data, and conditionally add 'Pubmed Link' value
  const dataRowsHTML = data
    .map((item) => {
      const pubmed_link = hasArticleId && item.article_id ? `https://pubmed.ncbi.nlm.nih.gov/${item.article_id}` : '';
      return hasArticleId
        ? `<tr>${tableBodyKeys.map((key: string) => `<td>${item[key]}</td>`).join("")}<td>${pubmed_link}</td></tr>`
        : `<tr>${tableBodyKeys.map((key: string) => `<td>${item[key]}</td>`).join("")}</tr>`;
    })
    .join("");

  // Construct the HTML content for the PDF export
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
           ${updatedHeaders.map((header: string) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>${dataRowsHTML}</tbody>
      </table>
    </div>`
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
            ${updatedHeaders.map((header: string) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map((item) => {
              const pubmed_link = hasArticleId && item.article_id ? `https://pubmed.ncbi.nlm.nih.gov/${item.article_id}` : '';
              return hasArticleId
                ? `<tr>${tableBodyKeys.map((key: string) => `<td>${item[key]}</td>`).join("")}<td>${pubmed_link}</td></tr>`
                : `<tr>${tableBodyKeys.map((key: string) => `<td>${item[key]}</td>`).join("")}</tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>`;

  // Export the constructed content as a PDF
  exportToPDF(content, `${fileSavedName}.pdf`);

  setIsExportLoading(false);
};

 const handleDownloadExcel = (headers: any, tableBodyKeys: any) => {
  setIsExportLoading(true);

  // Check if 'article_id' is included in the headers
  const hasArticleId = headers?.includes('Article Id');

  // Conditionally add 'Pubmed Link' header if  'article_id' is present
  const updatedHeaders = hasArticleId ? [...headers, 'Pubmed Link'] : headers;

  // Prepare data and add pubmed_link field only if 'article_id' exists in headers
  const renderdata = data?.map((item) => {
    const pubmed_link = hasArticleId && item.article_id ? `https://pubmed.ncbi.nlm.nih.gov/${item.article_id}` : '';
    return hasArticleId 
      ? [...tableBodyKeys?.map((key: any) => item[key]), pubmed_link]
      : tableBodyKeys?.map((key: any) => item[key]);
  });

  // Add optional rows like searchRow, startRow, etc.
  const additionalRows = [
     searchRow && searchRow?.concat(new Array(Math.max(0, updatedHeaders.length - searchRow.length)).fill("")),
     startRow && startRow?.concat(new Array(Math.max(0, updatedHeaders.length - startRow.length)).fill("")),
      endRow && endRow?.concat(new Array(Math.max(0, updatedHeaders.length - endRow.length)).fill("")),
   totalCountRow && totalCountRow?.concat(new Array(Math.max(0, updatedHeaders.length - totalCountRow.length)).fill("")),
     currentDateTimeRow && currentDateTimeRow?.concat(new Array(Math.max(0, updatedHeaders.length - currentDateTimeRow.length)).fill(""))
  ].filter(Boolean);  // Filter out undefined rows

  // Combine headers, additional rows, and the transformed data
  const finalRenderData = [
    updatedHeaders,
    ...additionalRows,
    ...renderdata
  ];

  exportToExcel(finalRenderData, `${fileSavedName}.xls`);
  setIsExportLoading(false);
};


  return (
    <div className="relative">
      <div ref={actionRef} onClick={toggleDropdown}>
         <button
          className={`rounded-md border ml-1 cursor-pointer border-gray text-sm font-medium font-archivo py-2 px-8 ${
           disable || Utils.isPermissionGranted("export_files") ? "bg-yellow text-white text-14" : "disabled-select"
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
              <div className="flex py-3 px-4 cursor-pointer" onClick={() => setIsPdfModalOpen(true)}>
                AS PDF
              </div>
              <div className="flex py-3 px-4 cursor-pointer" onClick={() => setIsExcelModalOpen(true)}>
                As Excel
              </div>
            </div>
          </div>
        </div>
      )}

      {isPdfModalOpen && (
        <Modal
          isOpen={true}
          childElement={
            <HeaderSelectionModal
              headers={headers.filter(header => !mandatoryHeaders.includes(header))}
              tableBodyKeys={tableBodyKeys}
              selectedHeaders={selectedHeaders}
              onClose={() => setIsPdfModalOpen(false)}
              onSave={(headers) => setSelectedHeaders(headers)}
              handleExportClickfunc={handleExportClick}
            />
          }
        />
      )}

      {isExcelModalOpen && (
        <Modal
          isOpen={true}
          childElement={
            <HeaderSelectionModal
              headers={headers.filter(header => !mandatoryHeaders.includes(header))}
              tableBodyKeys={tableBodyKeys}
              selectedHeaders={selectedHeaders}
              onClose={() => setIsExcelModalOpen(false)}
              onSave={(headers) => setSelectedHeaders(headers)}
              handleExportClickfunc={handleExportClick}
            />
          }
        />
      )}
    </div>
  );
};

export default ExportDropdown;

ExportDropdown.defaultProps = {
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
