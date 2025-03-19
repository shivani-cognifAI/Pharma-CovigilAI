'use client';
import axiosInstance from '@/common/axios-interceptor';
import InputField from '@/common/InputField';
import { IBatchDetails, IGetE2BR3Data, IReporterDetails } from './types';
import Toast from '@/common/Toast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

interface ReporterFormProps {
  savedDetails: IGetE2BR3Data;
}

const ReporterForm = ({ savedDetails }: ReporterFormProps) => {
  const { nodes } = savedDetails;
  const { reporter } = nodes;

  const initialValues: IReporterDetails = {
    reporterOrganization: reporter?.reporterOrganization || '',
    reporterDepartment: reporter?.reporterDepartment || '',
    reporterQualification: reporter?.reporterQualification || '',
    reporterTitle: reporter?.reporterTitle || '',
    reporterGivenName: reporter?.reporterGivenName || '',
    reporterFamilyName: reporter?.reporterFamilyName || '',
    reporterCountryCode: reporter?.reporterCountryCode || '',
  };

  const ReporterSchema = Yup.object().shape({
    reporterOrganization: Yup.string()
      .required('Reporter Organization required*')
      .max(60),
    reporterDepartment: Yup.string().max(60),
    reporterQualification: Yup.string()
      .oneOf(['1', '2', '3', '4', '5'])
      .required('Reporter qualification required'),
    reporterTitle: Yup.string(),
    reporterGivenName: Yup.string().max(60),
    reporterFamilyName: Yup.string().max(60),
    reporterCountryCode: Yup.string().max(
      2,
      'Country code should be ISO 3166-1 alpha-2'
    ),
  });

  const ReporterFieldData = [
    { label: 'Reporter Organization*', value: 'reporterOrganization' },
    { label: 'Reporter Department', value: 'reporterDepartment' },
    { label: 'Reporter Qualification*', value: 'reporterQualification' },
    { label: 'Reporter Title', value: 'reporterTitle' },
    { label: 'Reporter Given Name', value: 'reporterGivenName' },
    { label: 'Reporter Family Name', value: 'reporterFamilyName' },
    { label: 'Reporter Country Code', value: 'reporterCountryCode' },
  ];

  const handleSubmit = async (values: IBatchDetails) => {
    const trimmedValue = ReporterSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, reporter: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast('Reporter data saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Reporter</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={ReporterSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex relative mt-2">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-2 ml-1">
                  {ReporterFieldData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={`${item.value}`}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IBatchDetails]}
                        onChange={(e) => {
                          const { value } = e.target;
                          setValues((prev) => ({
                            ...prev,
                            [item.value]:
                              item.value === 'reporterCountryCode'
                                ? value.toUpperCase()
                                : value,
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

export default ReporterForm;
