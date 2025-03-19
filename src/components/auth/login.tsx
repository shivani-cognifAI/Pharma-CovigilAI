import Button from "@/common/Button";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { ILoginPayload } from "./auth.model";
import * as Yup from "yup";
import {
  CONSTANTS,
  CURRENT_VERSION,
  emailRegexPattern,
  STATUS,
  systemMessage,
} from "@/common/constants";
import {
  ListUserTeamAsync,
  LoginAsync,
  SessionTransferAsync,
  TenantUserDetailAsync,
  getByEmailAsync,
  userDetailAsync,
} from "./auth.slice";
import { useRouter } from "next/navigation";
import InputField from "@/common/InputField";
import Image from "next/image";
import LoadingSpinner from "@/common/LoadingSpinner";
import Toast from "@/common/Toast";
import ForgotPassword from "./ForgotPassword";
import Modal from "@/common/modal/model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import SessionTransferModal from "@/common/modal/sessionTransferModal";
import { GetSystemConfigurationAsync, systemConfigurationState } from "../settings/systemConfiguration/systemConfiguration.slice";
import { Configuration } from "../settings/systemConfiguration/systemConfiguration.model";
import { Utils } from "../../../utils/utils";
import { LocalStorage } from "../../../utils/localstorage";

interface IProps {
  children?: ReactElement;
  setTab: any;
}
const Login: React.FC<IProps> = ({ setTab }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, getSystemConfiguration } = useAppSelector(
    systemConfigurationState
  );
  const [systemConfigurationDetails, setSystemConfigurationDetails] = useState<Configuration>()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [openModals, setOpenModals] = useState(false);
  const [openSessionTransfer, setOpenSessionTransfer] =
    useState<boolean>(false);
  const [userEmail, setUserEmail] = useState("");
  const handleSend = () => {
    setOpenModals(false);
  };

  const handleClose = () => {
    setOpenModals(false);
  };

  const initialValues: ILoginPayload = {
    email: "",
    password: "",
  };

  const signInSchema = Yup.object().shape({
    email: Yup.string()
      .matches(
        emailRegexPattern,
        CONSTANTS.signInConstants.email.invalidEmailFormat
      )
      .email(CONSTANTS.signInConstants.email.IsEmail)
      .required(CONSTANTS.signInConstants.email.requireEmail)
      .trim(),
    password: Yup.string()
      .required(CONSTANTS.signInConstants.password.requirePassword)
      .trim(),
  });

  const handleSubmit = async (values: ILoginPayload) => {
    const trimmedValue = signInSchema.cast(values);
    const { email, password } = trimmedValue;
    setUserEmail(email);
    const payload = {
      email: email.toLowerCase(),
      password,
    };
    setIsLoading(true);

    try {
      const response = await dispatch(LoginAsync(payload));
      if (!response.payload.is_active_session) {
        if (LoginAsync.fulfilled.match(response)) {
          const emailData = await dispatch(getByEmailAsync(email));
          await dispatch(userDetailAsync(emailData.payload?.id));
          await dispatch(ListUserTeamAsync(emailData.payload?.id));
          await dispatch(TenantUserDetailAsync(emailData.payload?.id));
          await dispatch(GetSystemConfigurationAsync(process.env.NEXT_PUBLIC_MAPPING_ID!))
          router.push(CONSTANTS.ROUTING_PATHS.journalSearch);
          setTab("login");
        } else {
          Toast(systemMessage.InvalidCredentials, { type: "error" });
        }
      } else {
        setOpenSessionTransfer(true);
      }
    } catch (error) {
      Toast(systemMessage.InvalidCredentials, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  const handleSessionTransferClose = () => {
    setOpenSessionTransfer(false);
  };

  const handleSessionTransfer = async () => {
    try {
      const token = localStorage.getItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.OLD_TOKEN
      );
      if (token) {
        setIsLoading(true);
        const response = await dispatch(SessionTransferAsync(token));
        if (SessionTransferAsync.fulfilled.match(response)) {
          const emailData = await dispatch(getByEmailAsync(userEmail));
          await dispatch(userDetailAsync(emailData.payload?.id));
          await dispatch(ListUserTeamAsync(emailData.payload?.id));
          await dispatch(TenantUserDetailAsync(emailData.payload?.id));
          await dispatch(GetSystemConfigurationAsync(process.env.NEXT_PUBLIC_MAPPING_ID!))
          router.push(CONSTANTS.ROUTING_PATHS.journalSearch);
          setTab("login");
          setOpenSessionTransfer(false);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <div className="">
      <Formik
        initialValues={initialValues}
        validationSchema={signInSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setValues }) => (
          <>
            <Form onSubmit={handleSubmit}>
              <div className="  mt-4 flex flex-col space-y-4 mx-3 p-6">
                <div className="flex mb-[-12px]">
                  <label className="text-16 ml-1">Email</label>
                  <span className="ml-1 text-red">*</span>
                </div>
                <InputField
                  name="email"
                  id="email"
                  type="text"
                  value={values.email}
                  onChange={(event: ChangeEvent<{ value: string }>) => {
                    const { value } = event.target;
                    setValues({ ...values, email: value });
                  }}
                  customClasses="custom-width-login"
                  icon={
                    <Image
                      src="/assets/icons/person.svg"
                      alt="Email Icon"
                      width={20}
                      height={20}
                    />
                  }
                />









                <div className="relative ">
                  <div className="flex ">
                    <label className="text-16 ml-1">Password</label>
                    <span className="ml-1 text-red">*</span>
                  </div>
                  <InputField
                    name="password"
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={values.password}
                    onChange={(event: ChangeEvent<{ value: string }>) => {
                      const { value } = event.target;
                      setValues({ ...values, password: value });
                    }}
                    customClasses="custom-width-login"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 bg-eyeWhite right-2 mt-6 cursor-pointer items-center text-grey-600"
                    onClick={togglePasswordVisibility}
                  >
                    {!isPasswordVisible ? (
                      <FontAwesomeIcon
                        icon={faEyeSlash}
                        color="black"
                        size="1x"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faEye} color="black" size="1x" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between mt-4">
                  <div
                    className="forgot-password-font cursor-pointer font-medium no-underline mt-3 text-violet text-left"
                    onClick={() => {
                      setOpenModals(true);
                    }}
                  >
                    Reset password?
                  </div>
                </div>
                <div className="mt-36">
                  <Button
                    customClasses={
                      "w-full text-[18px] mt-56 text-white font-Archivo text-16 font-medium capitalize px-4 py-3 bg-violet"
                    }
                    buttonText="Sign in"
                    buttonType="submit"
                  />
                </div>
              </div>
            </Form>
            <div className="login-version-text">{CURRENT_VERSION}</div>
          </>
        )}
      </Formik>
      <Modal
        isOpen={openModals}
        childElement={
          <ForgotPassword
            onClose={handleClose}
            isOpen={false}
          />
        }
      />
      {isLoading && <LoadingSpinner />}
      <Modal
        isOpen={openSessionTransfer}
        childElement={
          <SessionTransferModal
            onClose={handleSessionTransferClose}
            isOpen={false}
            onSessionTransfer={ handleSessionTransfer}
          />
        }
      />
    </div>
  );
};

export default Login;
