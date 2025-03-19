'use client';

import axiosInstance from '@/common/axios-interceptor';
import InputField from '@/common/InputField';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IDrugDetails, IGetE2BR2Data } from './types';
import Toast from '@/common/Toast';

interface DrugFormProps {
  savedDetails: IGetE2BR2Data;
}

const DrugForm = ({ savedDetails }: DrugFormProps) => {
  const { nodes } = savedDetails;
  const { drug } = nodes;

  const initialValues: IDrugDetails = {
    productName: drug?.productName || '',
    drugCharacterisation: drug?.drugCharacterisation || '',

    
  };


  const ReportSchema = Yup.object().shape({
    productName: Yup.string().required('Product name required*'),
   
  });

  const ReportFieldData = [
    {
      label: `Product Name*`,
      value: 'productName',
    },
    { label: 'Characterisation of drug role', value: 'drugCharacterisation' },

  ];

  const handleSubmit = async (values: IDrugDetails) => {
    const trimmedValue = ReportSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, drug: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast('Drug data saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Drug</h4>
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
                        value={values[item.value as keyof IDrugDetails]}
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
export default DrugForm;
