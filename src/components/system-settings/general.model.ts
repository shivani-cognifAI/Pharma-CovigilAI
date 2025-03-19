import { IReceiver } from "./E2BR2R2Component/Receiver";
import { ISafetyReport } from "./E2BR2R2Component/SafetyReport";
import { ISender } from "./E2BR2R2Component/Sender";
import { IE2BR3Receiver } from "./E2BR2R3Component/Receiver";
import { IE2BR3Sender } from "./E2BR2R3Component/Sender";

export interface IStatus {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
}

export default interface TenantUserData {
  tenant_id: string;
}

export interface IAddCategoryPayload {
  tenant_id: string;
  name: string;
  description?: string;
}

export interface IAddClassificationPayload {
  tenant_id: string;
  name: string;
  description?: string;
}

export interface ICategory {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  created_on: string;
  modified_on: string;
}
export interface IDrugOfChoice {
  file_type: string;
  data_file: string;
}
export interface IClassification {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  created_on: string;
  modified_on: string;
}
export interface IGetDrugOfChoice {
  toLowerCase(): unknown;
  drug_of_choices: string[];

 
}
export interface IGetDeduplicate {
  
  duplicate_id: string;

 
}

export interface IData extends IStatus {
deduplicates: IGetDeduplicate[];
  drug_of_choices: IGetDrugOfChoice[];
  Category: ICategory[];
  Classification: IClassification[];
  TotalCategory: number;
  TotalClassification: number;
  getCategory: ICategory;
  getClassification: IClassification;
  E2BR2Data: IGetE2BR2Data;
  E2BR3Data: IGetE2BR3Data;
 TotalCountGraphData:[],
IndividualGraphData:[],
UserProductivityGraphData:[],
MonitorStatusGraphData:[],
monitorIdData:[]
}

export interface IE2BR2DataPayload {
  tenant_id: string | undefined;
  nodes: {
    safety_report?: ISafetyReport;
    sender: ISender;
    receiver: IReceiver;
  };
  etb_type: string;
}

export interface IE2BR3DataPayload {
  tenant_id: string | undefined;
  nodes: {
    sender: IE2BR3Sender;
    receiver: IE2BR3Receiver;
  };
  etb_type: string;
}

export interface IUpdateE2BR2DataPayload {
  id: string;
  nodes: {
    safety_report: ISafetyReport;
    sender: ISender;
    receiver: IReceiver;
  };
  etb_type?: string;
}

export interface IUpdateE2BR3DataPayload {
  id: string;
  nodes: {
    sender: IE2BR3Sender;
    receiver: IE2BR3Receiver;
  };
  etb_type?: string;
}

export interface IGetE2BR2Data {
  id: string;
  tenant_id: string;
  nodes: {
    safety_report: ISafetyReport;
    sender: ISender;
    receiver: IReceiver;
  };
}

export interface IGetE2BR3Data {
  id: string;
  tenant_id: string;
  nodes: {
    sender: IE2BR3Sender;
    receiver: IE2BR3Receiver;
  };
}

export interface EditCategoryPayload {
  review_category_id: string;
  name?: string;
  description?: string;
}

export interface EditClassificationPayload {
  review_classification_id: string;
  name?: string;
  description?: string;
}

export interface E2BR3Payload {
  id: string;
  type?: string;
}
export interface TotalCountGraphPayload {
  selectedDropdown: String,
      month_name: String
}
