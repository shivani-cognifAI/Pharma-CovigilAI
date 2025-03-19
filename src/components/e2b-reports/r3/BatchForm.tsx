'use client';

import axiosInstance from '@/common/axios-interceptor';
import InputField from '@/common/InputField';

import Toast from '@/common/Toast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IBatchDetails, IGetE2BR3Data } from './types';
import { E2BR3DateTimeConvertZone } from '../utils';

interface BatchFormProps {
  savedDetails: IGetE2BR3Data;
}

const BatchForm = ({ savedDetails }: BatchFormProps) => {
  const { nodes } = savedDetails;
  const { batch } = nodes;

  const initialValues: IBatchDetails = {
    batchNumber: batch?.batchNumber || '',
    batchSender: batch?.batchSender || '',
    batchReceiver: batch?.batchReceiver || '',
    batchDate: batch?.batchDate || E2BR3DateTimeConvertZone(new Date()),
    messageId: batch?.messageId || '',
    messageSenderId: batch?.messageSenderId || '',
    messageReceiverId: batch?.messageReceiverId || '',
    messageDate: batch?.messageDate || E2BR3DateTimeConvertZone(new Date()),
  };

  const BatchSchema = Yup.object().shape({
    batchNumber: Yup.string().required('Batch Number required*'),
    batchSender: Yup.string().required('Batch Sender ID required*'),
    batchReceiver: Yup.string().required('Batch Receiver ID required*'),
    batchDate: Yup.string().required('Batch creation date required'),
    messageId: Yup.string().required('Message ID required'),
    messageSenderId: Yup.string().required('Message sender ID required'),
    messageReceiverId: Yup.string().required('Message receiver ID required'),
    messageDate: Yup.string().required('Message creation date required'),
  });

  const batchFieldData = [
    { label: 'Batch Number*', value: 'batchNumber' },
    { label: 'Batch Sender ID*', value: 'batchSender' },
    { label: 'Batch Receiver ID*', value: 'batchReceiver' },
    { label: 'Batch Date*', value: 'batchDate' },
    { label: 'Message Identifier*', value: 'messageId' },
    { label: 'Message Sender ID*', value: 'messageSenderId' },
    { label: 'Message Receiver ID*', value: 'messageReceiverId' },
    { label: 'Message Date*', value: 'messageDate' },
  ];

  const handleSubmit = async (values: IBatchDetails) => {
    const trimmedValue = BatchSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, batch: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast('Batch and message data saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Batch</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={BatchSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex relative mt-2">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-2 ml-1">
                  {batchFieldData?.map((item, index) => (
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
export default BatchForm;
