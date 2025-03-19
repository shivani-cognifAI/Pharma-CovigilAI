import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import {
  GetSearchResultId,
  HistoryDetails,
  HistoryXmlDetails,
  RouteBackDetails,
} from "./auditLog.api";
import {
  HistoryResult,
  IAuditLogPayload,
  RouteBackAuditLogPayload,
  RouteBackResult,
  XmlData,
} from "./auditLog.model";
import RouteBack from "../routeBack";

const initialState = {
  loading: "idle",
  HistoryData: <HistoryResult[]>[],
  HistoryXmlData: <XmlData>{},
  RouteBackData: <RouteBackResult[]>[],
getSearchResultId:'',
MonitorStatus:'',
monitor_id :''
};

export const HistoryDataAsync = createAsyncThunk(
  "get/HistoryDetails",
  async (payload: IAuditLogPayload) => {
    try {
      const response = await HistoryDetails(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);
export const RouteBackDataAsync = createAsyncThunk(
  "get/routeBackDetails",
  async (payload: RouteBackAuditLogPayload) => {
    try {
      const response = await RouteBackDetails(payload);

      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);
export const ArticleIdDataAsync = createAsyncThunk(
  "get/searchResultId",
  async (payload: any) => {
    try {
      const response = await GetSearchResultId(payload);
       return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);


export const HistoryXmlDataAsync = createAsyncThunk(
  "get/HistoryXmlDetails",
  async (payload: IAuditLogPayload) => {
    try {
      const response = await HistoryXmlDetails(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

const AuditLogSlice = createSlice({
  name: "auditLog",
  initialState,
  reducers: {
    auditLog: (state) => {
      return state;
    },
    resetSearchResultId: (state) => {
      state.getSearchResultId = ''; // Reset getSearchResultId
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HistoryDataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(HistoryDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.HistoryData = action.payload;
      })
      .addCase(HistoryDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(RouteBackDataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(RouteBackDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.RouteBackData = action.payload;
      })
      .addCase(RouteBackDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
.addCase(ArticleIdDataAsync.pending, (state) => {
        state.loading = "pending";
      })
     .addCase(ArticleIdDataAsync.fulfilled, (state, action) => {
  state.loading = "fulfilled";
  state.getSearchResultId = action?.payload?.search_result?.id;
  state.MonitorStatus = action?.payload?.monitors?.[0]?.status;
  state.monitor_id = action?.payload?.monitors?.[0]?.id;
})
.addCase(ArticleIdDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })

      .addCase(HistoryXmlDataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(HistoryXmlDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.HistoryXmlData = action.payload;
      })
      .addCase(HistoryXmlDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export default AuditLogSlice.reducer;
export const AuditLogState = (state: AppState) => state.auditLog;
export const AuditLogAction = AuditLogSlice.actions;
export const { resetSearchResultId } = AuditLogSlice.actions;
