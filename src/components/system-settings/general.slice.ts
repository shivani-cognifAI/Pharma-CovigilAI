import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { IAxiosError } from "@/common/helper/common.modal";

import {
  addCategoryData,
  addClassificationData,
  addDeduplicate,
  addDrugOfChoice,
  addE2BR2Data,
  addE2BR3Data,
  deleteCategoryByID,
  deleteClassificationByID,
  editCategoryByID,
  editClassificationByID,
  getAllCategoryData,
  getAllClassificationData,
  getCategoryByID,
  getCategoryCount,
  getCategoryData,
  getClassificationByID,
  getClassificationCount,
  getClassificationData,
  getDeduplicate,
  getDrugOfChoice,
  getE2BR2Data,
  updateE2BR2Data,
  updateE2BR3Data,
getTotalCountGraphData,
getUserProductivityGraphData,
getMonitorStatusGraphData,
getMonitorIdData,
getIndividualGraphData
} from "./general.api";
import {
  E2BR3Payload,
  EditCategoryPayload,
  EditClassificationPayload,
  IAddCategoryPayload,
  IAddClassificationPayload,
  ICategory,
  IClassification,
  IData,
  IE2BR2DataPayload,
  IE2BR3DataPayload,
  IGetE2BR2Data,
  IGetE2BR3Data,
  IUpdateE2BR2DataPayload,
  IUpdateE2BR3DataPayload,
  TotalCountGraphPayload,
} from "./general.model";
import { PaginationPayload } from "../abstract-review/abstract.model";

const initialState: IData = {
monitorIdData:[],
MonitorStatusGraphData:[],
TotalCountGraphData:[],
IndividualGraphData:[],
UserProductivityGraphData:[],
  Category: [],
  Classification: [],
drug_of_choices:[],
deduplicates:[],
  loading: "idle",
  TotalCategory: 0,
  TotalClassification: 0,
  getCategory: <ICategory>{},
  getClassification: <IClassification>{},
  E2BR2Data: <IGetE2BR2Data>{},
  E2BR3Data: <IGetE2BR3Data>{}
};

export const GetCategoryCountAsync = createAsyncThunk(
  "get/categoryCount",
  async () => {
    try {
      const response = await getCategoryCount();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetCategoryAsync = createAsyncThunk(
  "get/category",
  async (payload: PaginationPayload) => {
    try {
      const response = await getCategoryData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetAllCategoryAsync = createAsyncThunk(
  "getAllCategory",
  async () => {
    try {
      const response = await getAllCategoryData();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const CreateCategoryAsync = createAsyncThunk(
  "create/categoryData",
  async (payload: IAddCategoryPayload) => {
    try {
      const response = await addCategoryData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const CreateClassificationAsync = createAsyncThunk(
  "create/classification",
  async (payload: IAddClassificationPayload) => {
    try {
      const response = await addClassificationData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const CreateDrugOfChoiceAsync = createAsyncThunk(
  "create/DrugOfChoice",
  async (payload: any) => {
    try {
      const response = await addDrugOfChoice(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const CreateDeduplicateAsync = createAsyncThunk(
  "create/Deduplicate",
  async (payload: any) => {
    try {
      const response = await addDeduplicate(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetClassificationAsync = createAsyncThunk(
  "get/classificationData",
  async (payload: PaginationPayload) => {
    try {
      const response = await getClassificationData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const GetDrugOfChoiceAsync = createAsyncThunk(
  "get/DrugOfChoice",
  async () => {
    try {
      const response = await getDrugOfChoice();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const GetDeduplicateAsync = createAsyncThunk(
  "get/Deduplicate",
  async () => {
    try {
      const response = await getDeduplicate();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);


export const GetAllClassificationAsync = createAsyncThunk(
  "getAllClassificationData",
  async () => {
    try {
      const response = await getAllClassificationData();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetClassificationCountAsync = createAsyncThunk(
  "get/classificationCount",
  async () => {
    try {
      const response = await getClassificationCount();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetCategoryByIDAsync = createAsyncThunk(
  "GetCategoryByID",
  async (id: string) => {
    try {
      const response = await getCategoryByID(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetClassificationByIDAsync = createAsyncThunk(
  "GetClassificationByID",
  async (id: string) => {
    try {
      const response = await getClassificationByID(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetE2BR2DataAsync = createAsyncThunk(
  "fetE2BR2Data",
  async (payload: E2BR3Payload) => {
    try {
      const response = await getE2BR2Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetE2BR3DataAsync = createAsyncThunk(
  "fetE2BR3Data",
  async (payload: E2BR3Payload) => {
    try {
      const response = await getE2BR2Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const UpdateE2BR2DataAsync = createAsyncThunk(
  "UpdateE2BR2Data",
  async (payload: IUpdateE2BR2DataPayload) => {
    try {
      const response = await updateE2BR2Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const UpdateE2BR3DataAsync = createAsyncThunk(
  "UpdateE2BR3Data",
  async (payload: IUpdateE2BR3DataPayload) => {
    try {
      const response = await updateE2BR3Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const AddE2BR2DataAsync = createAsyncThunk(
  "E2BR2Data",
  async (payload: IE2BR2DataPayload) => {
    try {
      const response = await addE2BR2Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const AddE2BR3DataAsync = createAsyncThunk(
  "E2BR3Data",
  async (payload: IE2BR3DataPayload) => {
    try {
      const response = await addE2BR3Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "deleteCategory",
  async (id: string) => {
    try {
      const response = await deleteCategoryByID(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const EditCategoryAsync = createAsyncThunk(
  "EditCategory",
  async (payload: EditCategoryPayload) => {
    try {
      const response = await editCategoryByID(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const deleteClassificationAsync = createAsyncThunk(
  "deleteClassification",
  async (id: string) => {
    try {
      const response = await deleteClassificationByID(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const EditClassificationAsync = createAsyncThunk(
  "editClassification",
  async (payload: EditClassificationPayload) => {
    try {
      const response = await editClassificationByID(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetTotalCountGraphAsync = createAsyncThunk(
  "TotalCountGraphData",
  async (payload: TotalCountGraphPayload) => {
    try {
      const response = await getTotalCountGraphData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const GetIndividualtGraphAsync = createAsyncThunk(
  "IndividualtGraphData",
  async () => {
    try {
      const response = await getIndividualGraphData();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const GetUserProductivityAsync = createAsyncThunk(
  "UserProductivityGraphData",
  async (payload: any) => {
    try {
      const response = await getUserProductivityGraphData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetMonitorStatusGraphAsync = createAsyncThunk(
  "MonitorStatusGraphData",
  async (payload: any) => {
    try {
      const response = await getMonitorStatusGraphData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const GetMonitorIdDataAsync = createAsyncThunk(
  "MonitorIdDataData",
  async () => {
    try {
      const response = await getMonitorIdData();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);



const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    general: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateCategoryAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(CreateCategoryAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // Update the state with the payload data if needed
      })
      .addCase(CreateCategoryAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
      .addCase(CreateClassificationAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(CreateClassificationAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        // Update the state with the payload data if needed
      })
      .addCase(CreateClassificationAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
      .addCase(GetCategoryAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetCategoryAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Category = action.payload.data;
      })
      .addCase(GetCategoryAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
      .addCase(GetClassificationAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetClassificationAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Classification = action.payload.data;
      })
      .addCase(GetClassificationAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
  .addCase(GetDrugOfChoiceAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetDrugOfChoiceAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.drug_of_choices = action.payload?.drug_of_choices;
      })
      .addCase(GetDrugOfChoiceAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
 .addCase(GetTotalCountGraphAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetTotalCountGraphAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.TotalCountGraphData = action.payload.data;
      })
      .addCase(GetTotalCountGraphAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
 .addCase(GetIndividualtGraphAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetIndividualtGraphAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.IndividualGraphData = action.payload.data;
      })
      .addCase(GetIndividualtGraphAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
.addCase(GetMonitorStatusGraphAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetMonitorStatusGraphAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.MonitorStatusGraphData = action.payload.data;
      })
      .addCase(GetMonitorStatusGraphAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
.addCase(GetMonitorIdDataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetMonitorIdDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.monitorIdData = action.payload.data;
      })
      .addCase(GetMonitorIdDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })


 .addCase(GetUserProductivityAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetUserProductivityAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.UserProductivityGraphData = action.payload.data;
      })
      .addCase(GetUserProductivityAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
  

 .addCase(GetDeduplicateAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetDeduplicateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.deduplicates = action.payload;
      })
      .addCase(GetDeduplicateAsync.rejected, (state, action) => {
        state.loading = "rejected";
        // Handle rejection if needed
      })
      .addCase(GetCategoryCountAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetCategoryCountAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.TotalCategory = action.payload?.drug_of_choices;
      })
      .addCase(GetCategoryCountAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetClassificationCountAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetClassificationCountAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.TotalClassification = action.payload;
      })
      .addCase(GetClassificationCountAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetCategoryByIDAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetCategoryByIDAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getCategory = action.payload;
      })
      .addCase(GetCategoryByIDAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetClassificationByIDAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetClassificationByIDAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getClassification = action.payload;
      })
      .addCase(GetClassificationByIDAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetAllCategoryAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetAllCategoryAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Category = action.payload.data;
      })
      .addCase(GetAllCategoryAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetAllClassificationAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetAllClassificationAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.Classification = action.payload.data;
      })
      .addCase(GetAllClassificationAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(AddE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(AddE2BR2DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(AddE2BR2DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(AddE2BR3DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(AddE2BR3DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(AddE2BR3DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetE2BR2DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.E2BR2Data = action?.payload?.data
      })
      .addCase(GetE2BR2DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetE2BR3DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetE2BR3DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.E2BR3Data = action?.payload?.data
      })
      .addCase(GetE2BR3DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(UpdateE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(UpdateE2BR2DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(UpdateE2BR2DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(UpdateE2BR3DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(UpdateE2BR3DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(UpdateE2BR3DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(deleteClassificationAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(deleteClassificationAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(deleteClassificationAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(EditCategoryAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(EditCategoryAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(EditCategoryAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(EditClassificationAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(EditClassificationAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(EditClassificationAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export default generalSlice.reducer;
export const generalState = (state: AppState) => state.general;
export const productMonitorAction = generalSlice.actions;
