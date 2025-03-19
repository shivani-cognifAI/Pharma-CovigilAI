'use client';

import axiosInstance from '@/common/axios-interceptor';
import InputField from '@/common/InputField';
import Toast from '@/common/Toast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { IGetE2BR3Data, IReactionEventDetails } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

interface ReactionEventProps {
  savedDetails: IGetE2BR3Data;
}

const ReactionEvent = ({ savedDetails }: ReactionEventProps) => {
  const { nodes } = savedDetails;
  const { reaction } = nodes;

  const initialValues: IReactionEventDetails = {
    medraVersion: '',
    reactionCode: '',
    reactionName: '',
    reactionOutcome: '',
    isDeath: 'false',
    isLifeThreatening: 'false',
    isHospitalised: 'false',
    isDisabling: 'false',
    isCongenital: 'false',
    isOtherCondition: 'false',
  };

  const ReactionSchema = Yup.object().shape({
    medraVersion: Yup.string().required('MeDRA version required*'),
    reactionCode: Yup.string().required('Reaction/Event MeDRA code required*'),
    reactionName: Yup.string().required('Reaction/Event name required*'),
    reactionOutcome: Yup.string()
      .required('Reaction Outcame required*')
      .oneOf(['0', '1', '2', '3', '4', '5']),
  });

  const ReactionFieldData = [
    { label: 'MedDRA version*', value: 'medraVersion' },
    { label: 'Reaction/Event MeDRA code*', value: 'reactionCode' },
    { label: 'Reactio/Event Name*', value: 'reactionName' },
    { label: 'Outcome of reaction / event*', value: 'reactionOutcome' },
  ];

  const ReactionFieldCheckboxes = [
    { label: 'Results in death', value: 'isDeath' },
    { label: 'Life threatening', value: 'isLifeThreatening' },
    {
      label: 'Caused / prolonged hospitalisation',
      value: 'isHospitalised',
      type: 'checkbox',
    },
    {
      label: 'Disabling / incapacitating',
      value: 'isDisabling',
      type: 'checkbox',
    },
    {
      label: 'Congenital anomaly / birth defect',
      value: 'isCongenital',
      type: 'checkbox',
    },
    {
      label: 'Other medically important condition',
      value: 'isOtherCondition',
      type: 'checkbox',
    },
  ];

  const updateData = async (payload: Partial<IGetE2BR3Data>) => {
    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast('Reaction data saved', { type: 'success' });
        window.location.reload();
      }
    } catch (error: any) {
      Toast('Something went wrong', { type: 'error' });
    }
    updateData(payload);
  };

  const handleSubmit = async (values: IReactionEventDetails) => {
    const trimmedValue = ReactionSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, reaction: [...reaction, { ...trimmedValue }] },
    };
    updateData(payload);
  };

  const handleDelete = (reactionCode: string) => {
    const filteredReactions = reaction.filter(
      (item) => item.reactionCode !== reactionCode
    );
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, reaction: [...filteredReactions] },
    };

    updateData(payload);
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Reactions/Events</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={ReactionSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex flex-col relative mt-2">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-2 ml-1">
                  {ReactionFieldData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={`${item.value}`}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={
                          values[item.value as keyof IReactionEventDetails]
                        }
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

                <ul className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                  {ReactionFieldCheckboxes.map((item) => (
                    <li className="flex items-center gap-2" key={item.value}>
                      <input
                        type="checkbox"
                        id={item.value}
                        name={item.value}
                        className="border border-black"
                        onChange={(e) => {
                          const { checked } = e.target;
                          const isChecked = checked ? 'true' : 'false';
                          setValues((prev) => ({
                            ...prev,
                            [item.value]: isChecked,
                          }));
                        }}
                      ></input>
                      <label
                        htmlFor={item.value}
                        className="text-buttonGray text-[14px]"
                      >
                        {item.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="submit"
                className="bg-cornflowerblue py-2 px-6 rounded-md text-white"
              >
                Add Reaction
              </button>
            </Form>
          );
        }}
      </Formik>
      <div>
        <ul className="list-none space-y-4">
          {reaction.map((reactionItem, index) => (
            <li
              key={index}
              className="text-[14px] flex items-start gap-2 p-2 border border-dimgray"
              style={{ border: '1px solid lightgray', borderRadius: '10px' }}
            >
              <button
                className="bg-transparent py-2"
                onClick={() => {
                  handleDelete(reactionItem.reactionCode);
                }}
              >
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  color="red"
                  size="1x"
                  className="hover:cursor-pointer"
                />
              </button>
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {ReactionFieldData.map((field) => (
                    <p className="m-1 font-light" key={field.label}>
                      {field.label}:
                      <span className="ml-1 font-semibold">
                        {reactionItem[field.value]}
                      </span>
                    </p>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
                  {ReactionFieldCheckboxes.map((field) => (
                    <p className="m-1 font-light" key={field.label}>
                      {field.label}:
                      <span className="ml-1 font-semibold">
                        {reactionItem[field.value]}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ReactionEvent;
