import React, { ChangeEvent } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/InputField";
import { E2BR3SenderData, SenderData } from "@/common/constants";
import Toast from "@/common/Toast";

export interface IE2BR3Sender {
  classCode?: string;
  determinerCode?: string;
  extension?: string;
}

export const initialSenderValues: IE2BR3Sender = {
  classCode: "",
  determinerCode: "",
  extension: "",
};

interface Props {
  senderValue: IE2BR3Sender;
  setSenderValueOnChange: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (values: IE2BR3Sender) => void;
  disabled: boolean;
}
const Sender: React.FC<Props> = ({
  senderValue,
  setSenderValueOnChange,
  onChange,
  disabled,
}) => {
  if (senderValue) {
    (initialSenderValues.classCode = senderValue?.classCode),
      (initialSenderValues.determinerCode = senderValue?.determinerCode),
      (initialSenderValues.extension =
        senderValue?.extension)
  }

  const validationSchema = Yup.object({
    classCode: Yup.string(),
    determinerCode: Yup.string(),
    extension: Yup.string(),
  });

  const handleSubmit = (values: IE2BR3Sender) => {
    try {
      const trimmedValue = validationSchema.cast(values);
      if (onChange) {
        setSenderValueOnChange(false);
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
        initialValues={initialSenderValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                  {E2BR3SenderData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        disabled={disabled}
                        name={item.value}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IE2BR3Sender]}
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

export default Sender;
