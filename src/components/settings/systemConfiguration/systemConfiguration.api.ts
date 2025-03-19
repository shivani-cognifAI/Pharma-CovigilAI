import axiosInstance from "@/common/axios-interceptor";
import { MappingConfiguration } from "./systemConfiguration.model";

export const AddSystemConfiguration = async (payload: MappingConfiguration) => {
  try {
    const apiUrl = 'module_configurations/createOrUpdate'
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    console.log("error")
    throw error;
  }
};

export const getSystemConfiguration = async (id: string) => {
    try {
      const apiUrl = `module_configurations/get-configurations/${id}`
      const response = await axiosInstance.get(apiUrl);
      return response;
    } catch (error: unknown) {
      console.log("error")
      throw error;
    }
  };