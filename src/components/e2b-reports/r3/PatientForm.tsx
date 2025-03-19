'use client';

import InputField from '@/common/InputField';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import axiosInstance from '@/common/axios-interceptor';
import Toast from '@/common/Toast';
import { IGetE2BR3Data, IPatientDetails } from './types';

interface PatientFormProps {
  savedDetails: IGetE2BR3Data;
}

const PatientForm = ({ savedDetails }: PatientFormProps) => {
  const { nodes } = savedDetails;
  const { patient } = nodes;

  const initialValues: IPatientDetails = {
    patientName: patient?.patientName || '',
    age: patient?.age || '',
    weight: patient?.weight || '',
    height: patient?.height || '',
    sex: patient?.sex || '',
    ageGroup: patient?.ageGroup || '',
  };

  const PatientSchema = Yup.object().shape({
    patientName: Yup.string().required('Patient name required*'),
    age: Yup.string(),
    weight: Yup.string(),
    height: Yup.string().max(3,'Maximum length is 3 characters'),
    sex: Yup.string().oneOf(['1', '2']),
    ageGroup: Yup.string().oneOf(['0', '1', '2', '3', '4', '5']),
  });

  const PatientFieldData = [
    { label: 'Patient Name or Initials*', value: 'patientName' },
    {
      label: 'Age',
      value: 'age',
    },
    { label: 'Body Weight (kg)', value: 'weight' },
    { label: 'Height (cm)', value: 'height' },
    { label: 'Sex', value: 'sex' },
    { label: 'Age Group', value: 'ageGroup' },
  ];

  const handleSubmit = async (values: IPatientDetails) => {
    const trimmedValue = PatientSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, patient: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast('Patient data saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Patient Information</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={PatientSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex relative mt-2">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-2 ml-1">
                  {PatientFieldData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={`${item.value}`}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IPatientDetails]}
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

export default PatientForm;
