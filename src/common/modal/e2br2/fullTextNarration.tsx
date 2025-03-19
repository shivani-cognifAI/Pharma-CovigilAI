import React, { ChangeEvent, useEffect, useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import InputField from "@/common/InputField";
import { STATUS, SummaryData } from "@/common/constants";
import Toast from "@/common/Toast";
import {
  IAbstractDetails,
  MonitorData,
} from "@/components/abstract-review/abstract.model";
import { IE2BR2DataFullTextNaration, IfullTextNaration } from "./e2br3.model";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { E2BR2FullTextNarationDetailsAsync, e2br2State } from "./e2br3.slice";
import LoadingSpinner from "@/common/LoadingSpinner";

interface Props {
  setfullTextNarrationOnChange: React.Dispatch<React.SetStateAction<boolean>>;
  fullTextNarationValue:  IfullTextNaration;
  onChange: (values:  IfullTextNaration) => void;
  abstractReviewDetail?: MonitorData;
  detailsData?: IAbstractDetails;
  E2BR2fullTextNaration?: IE2BR2DataFullTextNaration;
}

export const initialFullTextValues: IfullTextNaration = {
  narrativeincludeclinical: "",
  senderdiagnosismeddraversion: "",
  senderdiagnosis: "",
};

const FullTextNarration: React.FC<Props> = ({
  setfullTextNarrationOnChange,
  fullTextNarationValue,
  onChange,
  abstractReviewDetail,
  detailsData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, E2BR2FullTextNaration } = useAppSelector(e2br2State);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialFullTextValues, setInitialFullTextValues] = useState<IfullTextNaration>({
    narrativeincludeclinical: "-",
    senderdiagnosismeddraversion: "",
    senderdiagnosis: "",
  });



 

  useEffect(() => {
    dispatch(
      E2BR2FullTextNarationDetailsAsync({
        search_result_id: abstractReviewDetail?.search_result_id as string,
      })
    );
  }, [abstractReviewDetail?.search_result_id]);

  useEffect(() => {
    setIsLoading(true);
    if (loading === STATUS.fulfilled) {
      setIsLoading(false);
      setInitialFullTextValues({
        narrativeincludeclinical: E2BR2FullTextNaration?.narrative,
        senderdiagnosismeddraversion: "",
        senderdiagnosis: "",
      });
    }
    if(loading === STATUS.rejected) {
      setIsLoading(false)
    }
  }, [loading, E2BR2FullTextNaration]);

  if (fullTextNarationValue?.narrativeincludeclinical) {
    initialFullTextValues.narrativeincludeclinical =
      fullTextNarationValue.narrativeincludeclinical || "";
    initialFullTextValues.senderdiagnosis = fullTextNarationValue.senderdiagnosis || "";
    initialFullTextValues.senderdiagnosismeddraversion =
      fullTextNarationValue.senderdiagnosismeddraversion || "";
  }

  const SummarySchema = Yup.object().shape({
    narrativeincludeclinical: Yup.string(),
    senderdiagnosismeddraversion: Yup.string(),
    senderdiagnosis: Yup.string(),
  });

  const handleSubmit = (values: IfullTextNaration) => {
    try {
      const trimmedValue = SummarySchema.cast(values);
      if (onChange) {
        setfullTextNarrationOnChange(true);
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
        initialValues={initialFullTextValues}
        enableReinitialize={true}
        validationSchema={SummarySchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full text-14 mt-2 mb-2 ml-1">
                  {SummaryData?.map((item, index) => (
                    <div className="mr-12 text-14" key={index}>
                      {item?.value === "narrativeincludeclinical" ? (
                        <>
                          <textarea
                            name={item.value}
                            id={item.value}
                            value={values[item.value]}
                            onChange={(
                              event: ChangeEvent<{ value: string }>
                            ) => {
                              const { value } = event.target;
                              setValues({
                                ...values,
                                [item.value]: value,
                              });
                            }}
                            className="summary-inputs text-14 rounded-md relative w-[560px] h-48
                      block px-3 w-full font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none
        focus:outline-none focus:ring-0 focus:border-black peer
                      "
                          />
                          <label
                            className={`absolute label-font text-buttonGray duration-300  font-archivo 
                transform -translate-y-1 scale-75 top-2 z-10 origin-[0] bg-white  peer-focus:px-1
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-[-6px] peer-placeholder-shown:top-[14%]  
                 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-2 left-3
                 text-black"
                 }
                 `}
                          >
                            Narrative Include Clinical
                          </label>
                        </>
                      ) : (
                        <InputField
                          name={item.value}
                          id={item.value}
                          label={item.label}
                          type="text"
                          customClasses="summary-inputs"
                          value={values[item.value as keyof IfullTextNaration]}
                          onChange={(event: ChangeEvent<{ value: string }>) => {
                            const { value } = event.target;
                            setValues({
                              ...values,
                              [item.value]: value,
                            });
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
      {isLoading && <LoadingSpinner modelClass={"modelClass"} />}
    </>
  );
};

export default FullTextNarration;
