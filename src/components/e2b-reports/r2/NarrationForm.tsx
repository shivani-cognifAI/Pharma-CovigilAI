'use client';

import axiosInstance from '@/common/axios-interceptor';
import Toast from '@/common/Toast';
import { ErrorMessage, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IGetE2BR2Data, INarrationDetail } from './types';

interface NarrationFormProps {
  savedDetails: IGetE2BR2Data;
  savedNarration: string;
}

const NarrationForm = ({
  savedNarration,
  savedDetails,
}: NarrationFormProps) => {
  const { nodes } = savedDetails;
  const { fullTextNarration } = nodes;
  const initialValues: INarrationDetail = {
    summary: fullTextNarration?.summary || savedNarration,
  };

  const NarrationSchema = Yup.object().shape({
    summary: Yup.string().min(10, 'Summary text required'),
  });

  const NarrationFieldData = [{ label: 'Summary Text*', value: 'summary' }];

  const handleSubmit = async (values: INarrationDetail) => {
    const trimmedValue = NarrationSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, fullTextNarration: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast('Summary text saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 bg-white">
      <h4>Summary</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={NarrationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex relative mt-2">
                <div className="mb-2 w-full">
                  {NarrationFieldData?.map((item, index) => (
                    <div className="relative mt-1 w-full" key={index}>
                      <label
                        htmlFor={item.value}
                        className="absolute label-font text-buttonGray duration-300  font-archivo 
                transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  peer-focus:px-1
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-[-6px] peer-placeholder-shown:top-[14%]  
                 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-2 left-3"
                      >
                        {item.label}
                      </label>
                      <textarea
                        name={`${item.value}`}
                        id={item.value}
                        value={values[item.value as keyof INarrationDetail]}
                        rows={8}
                        className="p-2 block px-3 w-11/12 font-archivo text-sm text-14 text-black bg-transparent rounded-md border-1 border-gray appearance-none
                        focus:outline-none focus:ring-0 focus:border-black peer"
                        onChange={(e) => {
                          const { value } = e.target;
                          setValues((prev) => ({
                            ...prev,
                            [item.value]: value,
                          }));
                        }}
                      />
                      <ErrorMessage name={item.value}>
                        {(errorMessage) => (
                          <div
                            className={
                              'text-red relative z-50 mt-2 font-archivo mb-2 ml-1 errorMessage-font'
                            }
                          >
                            {errorMessage}
                          </div>
                        )}
                      </ErrorMessage>
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

export default NarrationForm;
