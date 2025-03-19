import React, { ChangeEvent } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/InputField";
import { E2BR3ReciverData, ReceiverData } from "@/common/constants";
import Toast from "@/common/Toast";

export interface IE2BR3Receiver {
    classCode?: string;
    determinerCode?: string;
    extension?: string;
}

export const initialReceiverValues: IE2BR3Receiver = {
    classCode: "",
    determinerCode: "",
    extension: "",
};

interface Props {
  disabled: boolean;
  receiverValue: IE2BR3Receiver;
  setReceiverValueOnChange: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (values: IE2BR3Receiver) => void;
}
const Receiver: React.FC<Props> = ({
  receiverValue,
  setReceiverValueOnChange,
  onChange,
  disabled,
}) => {

  if (receiverValue) {
    (initialReceiverValues.classCode = receiverValue?.classCode),
      (initialReceiverValues.determinerCode = receiverValue?.determinerCode),
      (initialReceiverValues.extension =
        receiverValue?.extension)
  }

  const validationSchema = Yup.object({
    classCode: Yup.string(),
    determinerCode: Yup.string(),
    extension: Yup.string(),
  });

  const handleSubmit = (values: IE2BR3Receiver) => {
    try {
      const trimmedValue = validationSchema.cast(values);
      if (onChange) {
        setReceiverValueOnChange(false);
        onChange(trimmedValue);
      }
    } catch (error: unknown) {
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialReceiverValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                  {E2BR3ReciverData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        disabled={disabled}
                        name={item.value}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IE2BR3Receiver]}
                        onChange={(event: ChangeEvent<{ value: string }>) => {
                          const { value } = event.target;
                          setValues({
                            ...values,
                            [item.value]: value,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Receiver;
