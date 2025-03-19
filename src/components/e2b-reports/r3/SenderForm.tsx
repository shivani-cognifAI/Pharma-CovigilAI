'use client';
import axiosInstance from '@/common/axios-interceptor';
import InputField from '@/common/InputField';
import { IBatchDetails, IGetE2BR3Data, ISenderDetails } from './types';
import Toast from '@/common/Toast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

interface SenderFormProps {
  savedDetails: IGetE2BR3Data;
}

const SenderForm = ({ savedDetails }: SenderFormProps) => {
  const { nodes } = savedDetails;
  const { sender } = nodes;

  const initialValues: ISenderDetails = {
    senderType: sender?.senderType || '',
    senderOrganization: sender?.senderOrganization || '',
    senderDepartment: sender?.senderDepartment || '',
    senderQualification: sender?.senderQualification || '',
    senderTitle: sender?.senderTitle || '',
    senderGivenName: sender?.senderGivenName || '',
    senderFamilyName: sender?.senderFamilyName || '',
    senderCountryCode: sender?.senderCountryCode || '',
  };

  const SenderSchema = Yup.object().shape({
    senderType: Yup.string()
      .required('Sender type required*')
      .oneOf(['1', '2', '3', '4', '5', '6', '7']),
    senderOrganization: Yup.string().required('Sender Organization required*').max(60),
    senderDepartment: Yup.string().max(60),
    senderTitle: Yup.string(),
    senderGivenName: Yup.string().max(60),
    senderFamilyName: Yup.string().max(60),
    senderCountryCode: Yup.string().max(
      2,
      'Country code should be ISO 3166-1 alpha-2'
    ),
  });

  const SenderFieldData = [
    { label: 'Sender Type*', value: 'senderType' },
    { label: 'Sender Organization*', value: 'senderOrganization' },
    { label: 'Sender Department', value: 'senderDepartment' },
    { label: 'Sender Title', value: 'senderTitle' },
    { label: 'Sender Given Name', value: 'senderGivenName' },
    { label: 'Sender Family Name', value: 'senderFamilyName' },
    { label: 'Sender Country Code', value: 'senderCountryCode' },
  ];

  const handleSubmit = async (values: IBatchDetails) => {
    const trimmedValue = SenderSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, sender: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast('Sender data saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Sender</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={SenderSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex relative mt-2">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-2 ml-1">
                  {SenderFieldData?.map((item, index) => (
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
                              item.value === 'senderCountryCode'
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

export default SenderForm;
