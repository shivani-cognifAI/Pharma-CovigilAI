"use client";

import axiosInstance from "@/common/axios-interceptor";
import InputField from "@/common/InputField";
import Toast from "@/common/Toast";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IGetE2BR2Data, IReportDetails } from "./types";
import {  E2BR3DateTimeConvertZone } from "../utils";

interface ReportFormProps {
  savedDetails: IGetE2BR2Data;
}

const ReportForm = ({ savedDetails }: ReportFormProps) => {
  const { nodes } = savedDetails;
  const { report } = nodes;

  const initialValues: IReportDetails = {
    safetyReportId: report?.safetyReportId || "",
    primarySourceCountry: report?.primarySourceCountry || "",
    eventCountry: report?.eventCountry || "",
    transmissionDate:
      report?.transmissionDate || '',
   transmissionDateFormat:report?.transmissionDateFormat|| '',
    reportType: report?.reportType || "",
    serious: report?.serious || "",
recieveDateFormat:report?.recieveDateFormat||'',
    dateFirstReceived:
      report?.dateFirstReceived ||'',
    dateMostRecent:
      report?.dateMostRecent || E2BR3DateTimeConvertZone(new Date()),
    expeditedCriteria:
      report?.expeditedCriteria ||''
  };

 
   

  const ReportSchema = Yup.object().shape({
    safetyReportId: Yup.string().required("Safety report unique ID required*"),
    primarySourceCountry: Yup.string().max(
          2,' Primary Country should be ISO 3166-1 alpha-2'
        ).required("Primary source country required*"),
    eventCountry: Yup.string().max(
          2,' Event source should be ISO 3166-1 alpha-2'
        ).required("Event source country required*"),
    transmissionDate: Yup.string().required("Transmission date required*"),
transmissionDateFormat: Yup.string().required("Transmission date format required*"),
    reportType: Yup.string()
          .required('Report type required*')
          .oneOf(['1', '2', '3', '4']),
    serious: Yup.string().required("Seriousness type required*").oneOf(['1', '2', '3', '4']),
expeditedCriteria: Yup.string().oneOf(['1', '2', '3', '4']),
recieveDateFormat:Yup.string().required('Recieve date format required'),
    dateFirstReceived: Yup.string().required("Date first received required*"),
    dateMostRecent: Yup.string().required(
      "Date of most recent information required*"
    ),
  });

  const ReportFieldData = [
    {
      label: `Sender's (case) safety report unique identifier*`,
      value: "safetyReportId",
    },
    {
      label: "Identification of the country of the primary source*",
      value: "primarySourceCountry",
    },
    {
      label: "Identification of the country where the reaction/event occurred*",
      value: "eventCountry",
    },
  
{
      label: "Transmission date format*",
      value: "transmissionDateFormat",
    },
    {
      label: "Date of this transmission*",
      value: "transmissionDate",
    },
    {
      label: "Type of report*",
      value: "reportType",
    },
    {
      label: "Serious*",
      value: "serious",
    },

 {
      label: "Recieve date format*",
      value: "recieveDateFormat",
    },
    {
      label: "Date report was first received from source*",
      value: "dateFirstReceived",
    },
    {
      label: "Date of receipt of the most recent information*",
      value: "dateMostRecent",
    },

    {
      label:
        "Does this case fulfill the local criteria for an expedited report?",
      value: "expeditedCriteria",
    },
  ];

  const handleSubmit = async (values: IReportDetails) => {
    const trimmedValue = ReportSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, report: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast("Safety report data saved", { type: "success" });
        window.location.reload();
      }
    } catch (error: any) {
      Toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Case Safety Report</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={ReportSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex relative mt-2">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-3 mb-2 ml-1">
                  {ReportFieldData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={`${item.value}`}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IReportDetails]}
                        onChange={(e) => {
                          const { value } = e.target;
                          setValues((prev) => ({
                            ...prev,
                            [item.value]: value,
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="bg-cornflowerblue py-2 px-6 rounded-md text-white"
              >
                Save
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default ReportForm;
