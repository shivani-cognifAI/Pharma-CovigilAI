import { ChangeEvent, ReactNode } from "react";

export interface IButtonProp {
  buttonText: string;
  customClasses: string;
  buttonType: "submit" | "reset" | "button";
  onClick?: () => void;
  disabled?: boolean;
}

export interface UserData {
  user_id: string;
  role_name: string;
  user_name: string;
  access_level?: number;
  email?: string;
}

export interface TenantData {
  tenant_id: string;
  tenant_name: string;
}

export interface IInputFieldProps {
  name: string;
  label?: string;
  id: string;
  type: string;
  value?: string;
  customClasses?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

interface IAxiosErrorData {
  detail: string;
}

export interface IAxiosError {
  data: IAxiosErrorData;
  response: {
    data: {
      message: string;
      Detail: string;
      statusCode: number;
    };
  };
}
