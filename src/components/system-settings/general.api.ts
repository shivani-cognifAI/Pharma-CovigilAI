import axiosInstance from "@/common/axios-interceptor";
import {
  E2BR3Payload,
  EditCategoryPayload,
  EditClassificationPayload,
  IAddCategoryPayload,
  IAddClassificationPayload,
  IE2BR2DataPayload,
  IE2BR3DataPayload,
  IUpdateE2BR2DataPayload,
  IUpdateE2BR3DataPayload,
  TotalCountGraphPayload,
} from "./general.model";
import { PaginationPayload } from "../abstract-review/abstract.model";
import { IAxiosError } from "@/common/helper/common.modal";

export const addCategoryData = async (payload: IAddCategoryPayload) => {
  try {
    const apiUrl = `review_category/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const addClassificationData = async (
  payload: IAddClassificationPayload
) => {
  try {
    const apiUrl = `review_classification/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};
export const addDrugOfChoice = async (
  payload: any
) => {
try {
    const { file_type, formData } = payload;
  
      const apiUrl = `module_configurations/upload_doc_file?file_type=${file_type}`;
    

    const response = await axiosInstance.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};


export const addDeduplicate = async (
  payload: any
) => {
try {
    const { file_type, formData } = payload;
  
      const apiUrl = `module_configurations/upload_duplicate_file?file_type=${file_type}`;
    

    const response = await axiosInstance.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};


export const getE2BR2Data = async (
 payload: E2BR3Payload
) => {
  try {
    const { id, type} = payload
    const apiUrl = `xml/static/nodes/${id}?etb_type=${type}`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error) {
    const err = error as IAxiosError
    return err.response;
  }
};

export const addE2BR2Data = async (
  payload: IE2BR2DataPayload
) => {
  try {
    const apiUrl = `xml/static/nodes/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const addE2BR3Data = async (
  payload: IE2BR3DataPayload
) => {
  try {
    const apiUrl = `xml/static/nodes/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateE2BR2Data = async (
  payload: IUpdateE2BR2DataPayload
) => {
  try {
    const apiUrl = `xml/static/nodes/update`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateE2BR3Data = async (
  payload: IUpdateE2BR3DataPayload
) => {
  try {
    const apiUrl = `xml/static/nodes/update`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCategoryData = async (payload: PaginationPayload) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `review_category/list?page=${pageNumber}&per_page=${perPage}&count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllCategoryData = async () => {
  try {
    const apiUrl = `review_category/list?count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCategoryCount = async () => {
  try {
    const apiUrl = `review_category/list?count=true`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCategoryByID = async (id: string) => {
  try {
    const apiUrl = `review_category/get_by_id/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const deleteCategoryByID = async (id: string) => {
  try {
    const apiUrl = `review_category/delete_by_id/${id}`;
    const response = await axiosInstance.delete(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const editCategoryByID = async (payload: EditCategoryPayload) => {
  try {
    const apiUrl = `review_category/update`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getClassificationData = async (payload: PaginationPayload) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `review_classification/list?page=${pageNumber}&per_page=${perPage}&count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllClassificationData = async () => {
  try {
    const apiUrl = `review_classification/list?count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getClassificationCount = async () => {
  try {
    const apiUrl = `review_classification/list?count=true`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
export const getDrugOfChoice = async () => {
  try {
    const apiUrl = `module_configurations/get-docs_settings`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
export const getDeduplicate = async () => {
  try {
    const apiUrl = `module_configurations/get-duplicate-article-ids`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getClassificationByID = async (id: string) => {
  try {
    const apiUrl = `review_classification/get_by_id/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const deleteClassificationByID = async (id: string) => {
  try {
    const apiUrl = `review_classification/delete_by_id/${id}`;
    const response = await axiosInstance.delete(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const editClassificationByID = async (payload: EditClassificationPayload) => {
  try {
    const apiUrl = `review_classification/update`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getTotalCountGraphData = async (payload: TotalCountGraphPayload) => {
  try {
    const { selectedDropdown, month_name } = payload;
    const apiUrl = `chart/dashboard/individual/processed/record?type=${selectedDropdown}&month_name=${month_name}`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};
export const getIndividualGraphData = async () => {
  try {
    const apiUrl = `chart/dashboard/individual?type=Yearly`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};


export const getUserProductivityGraphData = async (payload: any) => {
  try {
    const { selectedDropdown, month_name } = payload;
    const apiUrl = `chart/dashboard/user/active/session/daily?type=${selectedDropdown}&month_name=${month_name}`
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
}
export const getMonitorStatusGraphData = async (payload: any) => {
  try {
const { selectedDropdown,monitor_id } = payload;
if(monitor_id!==null){
const apiUrl = `chart/dashboard/user/expert/decision/${selectedDropdown}?monitor_id=${monitor_id}`
    const response = await axiosInstance.get(apiUrl);
    return response;
}
else {
const apiUrl = `chart/dashboard/user/expert/decision/${selectedDropdown}`
    const response = await axiosInstance.get(apiUrl);
    return response;
}
    
    
  } catch (error: unknown) {
    throw error;
  }
}


export const getMonitorIdData = async () => {
  try {
const apiUrl = `monitor/list/lite?expert_review_type=Abstract&count=false`
    const response = await axiosInstance.get(apiUrl);
    return response;
} catch (error: unknown) {
    throw error;
  }
}

