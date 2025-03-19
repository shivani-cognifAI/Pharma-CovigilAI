import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { IAxiosError } from "@/common/helper/common.modal";
import { DownloadXML, E2BR2Payload, IData, IE2BR2DataFullTextNaration, IE2BR2DataPayload, IE2BR2DataSummary, IGetE2BR2Data, IUpdateE2BR2DataPayload } from "./e2br3.model";
import { E2BR2FullTextNarrationDetails, E2BR2SummaryDetails, FetchDownloadXMLDetail, addE2BR2Data, getE2BR2Data, updateE2BR2Data } from "./e2br3.api";
import { IAuditLogPayload } from "@/components/audit-log/auditLogDetails/auditLog.model";

const initialState: IData = {
  loading: "idle",
  E2BR2Data: <IGetE2BR2Data>{},
  E2BR2Summary: <IE2BR2DataSummary> {},
E2BR2FullTextNaration:<IE2BR2DataFullTextNaration> {}
};

export const GetE2BR2DataAsync = createAsyncThunk(
  "fetE2BR2Data",
  async (payload: E2BR2Payload) => {
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

export const FetchXMLDetailAsync = createAsyncThunk(
  "FetchXMLDetailAsync",
  async (payload: DownloadXML) => {
    try {
      const response = await FetchDownloadXMLDetail(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const E2BR2SummaryDetailsAsync = createAsyncThunk(
  "E2BR2SummaryDetails",
  async (payload: IAuditLogPayload) => {
    try {
      const response = await E2BR2SummaryDetails(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);
export const E2BR2FullTextNarationDetailsAsync = createAsyncThunk(
  "E2BR2FullTextNarationDetails",
  async (payload: IAuditLogPayload) => {
    try {
      const response = await E2BR2FullTextNarrationDetails(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

const e2br3Slice = createSlice({
  name: "e2br3",
  initialState,
  reducers: {
    e2br3: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(AddE2BR2DataAsync.fulfilled, (state, action) => {
        
        state.loading = "fulfilled";
      })
      .addCase(AddE2BR2DataAsync.rejected, (state, action) => {
        
        state.loading = "rejected";
      })
      .addCase(FetchXMLDetailAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(FetchXMLDetailAsync.fulfilled, (state, action) => {
        
        state.loading = "fulfilled";
      })
      .addCase(FetchXMLDetailAsync.rejected, (state, action) => {
        
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
      .addCase(UpdateE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(UpdateE2BR2DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(UpdateE2BR2DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(E2BR2SummaryDetailsAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(E2BR2SummaryDetailsAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.E2BR2Summary = action.payload?.data
      })
      .addCase(E2BR2SummaryDetailsAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
 .addCase(E2BR2FullTextNarationDetailsAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(E2BR2FullTextNarationDetailsAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.E2BR2FullTextNaration = action.payload?.data
      })
      .addCase(E2BR2FullTextNarationDetailsAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export default e2br3Slice.reducer;
export const e2br2State = (state: AppState) => state.e2br2;
export const e2br3SliceAction = e2br3Slice.actions;
