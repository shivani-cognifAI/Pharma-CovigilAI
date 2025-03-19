import { systemMessage } from "@/common/constants";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Toast from "@/common/Toast";
import { AppDispatch, useAppSelector } from "@/redux/store";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { LocalStorage } from "../../../../utils/localstorage";
import {
  CreateDrugOfChoiceAsync,
  GetDrugOfChoiceAsync,
} from "../general.slice";
import { IDrugOfChoice } from "../general.model";
import LoadingSpinner from "@/common/LoadingSpinner";
import * as XLSX from "xlsx";

interface AddDrugOfChoiceProps {
  handelClose?: () => void;
}

const AddDrugOfChoice: React.FC<AddDrugOfChoiceProps> = ({ handelClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const initialValues: IDrugOfChoice = {
    file_type: "",
    data_file: "",
  };
  const [fileColumns, setFileColumns] = useState<string[]>([]);

  const [formValues, setFormValues] = useState<IDrugOfChoice>(initialValues);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const FormSchema = Yup.object().shape({
    fileName: Yup.string(),
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        if (e) {
          var data = e.target.result;
          let readedData = XLSX.read(data, { type: "binary" });
          const wsname = readedData.SheetNames[0];
          const ws = readedData.Sheets[wsname];
          const dataParse: string[][] = XLSX.utils.sheet_to_json(ws, {
            header: 1,
          });
          setFileColumns(dataParse[0].slice().sort());
        }
      };
      reader.readAsBinaryString(file);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {

    const formData = new FormData();

    if (selectedFile) {
setIsLoading(true);
      formData.append("data_file", selectedFile);
    } else {
      Toast("Please select file", { type: "error" });
      return;
    }

    try {
      const payload = {
        file_type: "Drug Of Choice File",
        formData: formData,
      };
      const response = await dispatch(CreateDrugOfChoiceAsync(payload));
      
      if (CreateDrugOfChoiceAsync.fulfilled.match(response)) {
        await dispatch(GetDrugOfChoiceAsync());
        Toast(systemMessage.DrugOfChoiceAddSuccessfully, {
          type: "success",
        });

        if (handelClose) {
          handelClose();
          setIsLoading(false);
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error: unknown) {
      Toast("An error occurred. Please try again.", { type: "error" });
    }
  };

  return (
    <React.Fragment>
      <section className="body-font tenant-box mx-3 mt-4 text-14 bg-white tenant-box-shadow">
        <div className="container py-4 pr-4 divide-y-2 divide-blue-300">
          <div className="flex w-[97%] justify-between ">
 <span className="text-sm mt-2 ml-4 font-medium text-black font-archivo ">
               Add Product of your choice
            </span>
            <div className="flex gap-2">
              <div className="p-2 ">
                <button
                  className="font-Archivo cursor-pointer  text-dimgray bg-transparent rounded-sm"
                  onClick={handelClose}
                >
                  Cancel
                </button>
              </div>

              <button
                type="submit"
                className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                onClick={handleSubmit}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 " />
        {/* <section className=" body-font flex"> */}
        <div className="container">
          <div className="mr-4">
            <Formik
              initialValues={formValues}
              validationSchema={FormSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit }) => (
                <>
                  <Form onSubmit={handleSubmit}>
                    <div className="font-archivo text-archivo pb-4 ml-4 mt-4">
                      <div className="relative border-silver w-[350px] mb-2 item-center mr-12">
                        <div>
                          <section className="text-gray-600 body-font">
                            <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
                            <div className="mt-2 p-2">
                              <h4 className="ml-4 mt-2">Upload your File</h4>
                              <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />

                              <div className="action-button-left flex flex-col items-start justify-start ml-4">
                                <div className="mt-4">
                                  <input
                                    id="fileUpload"
                                    type="file"
                                    accept=".xls, .xlsx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                  />
                                  <label
                                    htmlFor="fileUpload"
                                    className="cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                                  >
                                    Upload File
                                  </label>
                                  {selectedFile && (
                                    <p className="mt-2 text-black">
                                      {selectedFile.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </section>
      {isLoading && <LoadingSpinner />}
    </React.Fragment>
  );
};

export default AddDrugOfChoice;
