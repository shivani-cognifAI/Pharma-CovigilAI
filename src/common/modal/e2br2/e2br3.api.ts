import axiosInstance from "@/common/axios-interceptor";
import { IAxiosError } from "@/common/helper/common.modal";
import { DownloadXML, E2BR2Payload, IE2BR2DataPayload, IUpdateE2BR2DataPayload } from "./e2br3.model";
import { AxiosError } from "axios";
import { IAuditLogPayload } from "@/components/audit-log/auditLogDetails/auditLog.model";

export const getE2BR2Data = async (payload: E2BR2Payload) => {
  try {
    const { id, type } = payload
    const apiUrl = `xml/nodes/${id}?etb_type=${type}`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error) {
    const err = error as IAxiosError;
    return err.response;
  }
};

export const addE2BR2Data = async (payload: IE2BR2DataPayload) => {
  try {
    const apiUrl = `xml/nodes/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const FetchDownloadXMLDetail  = async (payload: DownloadXML) => {
  try {
    const apiUrl = `xml/nodes/${payload.tenant_id}/${payload.config_id}?etb_type=${payload.type}`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error) {
    return (error as AxiosError).response;
  }
};

export const updateE2BR2Data = async (payload: IUpdateE2BR2DataPayload) => {
  try {
    const apiUrl = `xml/nodes/update`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    
    throw error;
  }
};

export const E2BR2SummaryDetails = async (payload: IAuditLogPayload) => {
  try {
    const { search_result_id } = payload
    const apiUrl = `xml/generate/nodes/narrative/${search_result_id}`
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const E2BR2FullTextNarrationDetails = async (payload: IAuditLogPayload) => {
  try {
    const { search_result_id } = payload
    const apiUrl = `xml/generate/nodes/fte/narrative/${search_result_id}`
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
