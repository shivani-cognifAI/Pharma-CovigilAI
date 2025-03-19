'use client';

import axiosInstance from '@/common/axios-interceptor';
import InputField from '@/common/InputField';
import Toast from '@/common/Toast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IGetE2BR3Data, IReportDetails } from './types';
import { E2BR3DateTimeConvertZone } from '../utils';

interface ReportFormProps {
  savedDetails: IGetE2BR3Data;
}

const ReportForm = ({ savedDetails }: ReportFormProps) => {
  const { nodes } = savedDetails;
  const { report } = nodes;

  const initialValues: IReportDetails = {
    safetyReportId: report?.safetyReportId || '',
    creationDate: report?.creationDate || E2BR3DateTimeConvertZone(new Date()),
    reportType: report?.reportType || '',
    dateFirstReceived:
      report?.dateFirstReceived || E2BR3DateTimeConvertZone(new Date()),
    dateMostRecent:
      report?.dateMostRecent || E2BR3DateTimeConvertZone(new Date()),
    caseIdNumber: report?.caseIdNumber || '',
    firstSender: report?.firstSender || '',
  };

  const ReportSchema = Yup.object().shape({
    safetyReportId: Yup.string().required('Safety report unique ID required*'),
    creationDate: Yup.string().required('Creation date required*'),
    reportType: Yup.string()
      .required('Report type required*')
      .oneOf(['1', '2', '3', '4']),
    dateFirstReceived: Yup.string().required('Date first received required*'),
    dateMostRecent: Yup.string().required(
      'Date of most recent information required*'
    ),
    caseIdNumber: Yup.string().required(
      'Worldwide unique case identifier required*'
    ),
    firstSender: Yup.string()
      .required('First sender of this case required*')
      .oneOf(['1', '2']),
  });

  const ReportFieldData = [
    {
      label: `Safety report unique ID*`,
      value: 'safetyReportId',
    },
    { label: 'Worldwide unique case identifier*', value: 'caseIdNumber' },
    { label: 'Date Created*', value: 'creationDate' },
    { label: 'Report Type*', value: 'reportType' },
    { label: 'Date first received*', value: 'dateFirstReceived' },
    { label: 'Date of most recent information*', value: 'dateMostRecent' },
    { label: 'First sender of this case*', value: 'firstSender' },
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
        Toast('Safety report data saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
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
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-2 ml-1">
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
