"use client";
import axiosInstance from "@/common/axios-interceptor";
import InputField from "@/common/InputField";
import { IBatchDetails, IGetE2BR2Data, IReceiverDetails } from "./types";
import Toast from "@/common/Toast";
import { Form, Formik } from "formik";
import * as Yup from "yup";

interface ReceiverFormProps {
  savedDetails: IGetE2BR2Data;
}

const RecievierForm = ({ savedDetails }: ReceiverFormProps) => {
  const { nodes } = savedDetails;
  const { receiver } = nodes;

  const initialValues: IReceiverDetails = {
    receiverType: receiver?.receiverType || "",
    receiverOrganization: receiver?.receiverOrganization || "",
    receiverGivename: receiver?.receiverGivename || "",
    receiverFamilyname: receiver?.receiverFamilyname || "",
    receiverStreetaddress: receiver?.receiverStreetaddress || "",
    receiverCity: receiver?.receiverCity || "",
    receiverState: receiver?.receiverState || "",


    receiverPostcode: receiver?.receiverPostcode || "",
    receiverCountrycode: receiver?.receiverCountrycode || "",

    receiverTelphone: receiver?.receiverTelphone || "",
receiverTelcountrycode: receiver?.receiverTelcountrycode || "",
    receiverEmail: receiver?.receiverEmail || "",
  };

  const receiverSchema = Yup.object().shape({
    receiverType: Yup.string()
      .required("Receiver type required*")
      .oneOf(["1", "2", "3", "4", "5", "6", "7"]),
    receiverOrganization: Yup.string()
      .required("Receiver Organization required*")
      .max(60),
receiverEmail: Yup.string().email("Invalid email format"),
receiverTelcountrycode:Yup.string()
    .matches(/^\d+$/, "Telephone Country code must be numeric"),
receiverCountrycode: Yup.string().max(
          2,'Country should be ISO 3166-1 alpha-2'
        ),
receiverTelphone: Yup
    .string()
    .matches(/^\d{6,14}$/, "Invalid phone number format")
    .required("Telephone number is required"),

  });

  const ReceiverFieldData = [
    { label: "Receiver Type*", value: "receiverType" },
    { label: "Receiver Organization*", value: "receiverOrganization" },
    { label: "Receiver Given Name", value: "receiverGivename" },
    { label: "Receiver Family Name", value: "receiverFamilyname" },
    { label: "Receiver Street Address", value: "receiverStreetaddress" },

    { label: "Receiver City", value: "receiverCity" },
    { label: "Receiver State", value: "receiverState" },



    { label: "Receiver Postcode", value: "receiverPostcode" },

    { label: "Receiver Country Code", value: "receiverCountrycode" },
    { label: "Receiver TelePhone No.", value: "receiverTelphone" },

    {
      label: "Receiver Telephone Country Code",
      value: "receiverTelcountrycode",
    },
    { label: "Receiver Email", value: "receiverEmail" },
  ];

  const handleSubmit = async (values: IBatchDetails) => {
    const trimmedValue = receiverSchema.cast(values);
    const payload = {
      id: savedDetails.id,
      nodes: { ...nodes, receiver: { ...trimmedValue } },
    };

    try {
      const response = await axiosInstance.post(`xml/nodes/update`, payload);
      if (response) {
        Toast("Receiver data saved", { type: "success" });
        window.location.reload();
      }
    } catch (error: any) {
      Toast("Something went wrong", { type: "error" });
    }
  };

  return (
    <div className="space-y-4 rounded-md p-2 lg:p-6 border-2 bg-white">
      <h4>Receiver</h4>
      <Formik
        initialValues={initialValues}
        validationSchema={receiverSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setValues }) => {
          return (
            <Form className="space-y-4">
              <div className="flex relative mt-2">
                <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-2 ml-1">
                  {ReceiverFieldData?.map((item, index) => (
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
                              item.value === "senderCountryCode"
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

export default RecievierForm;
