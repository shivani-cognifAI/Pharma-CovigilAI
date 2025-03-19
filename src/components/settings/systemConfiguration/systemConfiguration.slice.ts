import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import {
  AddSystemConfiguration,
  getSystemConfiguration,
} from "./systemConfiguration.api";
import {
  Configuration,
  MappingConfiguration,
} from "./systemConfiguration.model";
import { LocalStorage } from "../../../../utils/localstorage";
import { CONSTANTS } from "@/common/constants";
import { Utils } from "../../../../utils/utils";

const initialState = {
  loading: "idle",
  getSystemConfiguration: <Configuration>{},
};

export const systemConfigurationAsync = createAsyncThunk(
  "add/systemConfiguration",
  async (payload: MappingConfiguration) => {
    try {
      const response = await AddSystemConfiguration(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const GetSystemConfigurationAsync = createAsyncThunk(
  "GetSystemConfiguration",
  async (id: string) => {
    try {
      const response = await getSystemConfiguration(id);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

const systemConfigurationSlice = createSlice({
  name: "systemConfiguration",
  initialState,
  reducers: {
    systemConfiguration: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(systemConfigurationAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(systemConfigurationAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(systemConfigurationAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetSystemConfigurationAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetSystemConfigurationAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        const data = action.payload.data;
        const keysWithTrueValues = Utils.getTrueKeys(data);
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.SystemConfiguration,
          JSON.stringify(keysWithTrueValues)
        );
      })
      .addCase(GetSystemConfigurationAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export default systemConfigurationSlice.reducer;
export const systemConfigurationState = (state: AppState) =>
  state.systemConfiguration;
export const systemConfigurationAction = systemConfigurationSlice.actions;
