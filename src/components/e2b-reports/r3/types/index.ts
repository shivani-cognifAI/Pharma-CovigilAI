export interface IBatchDetails {
  [key: string]: string;
}

export interface ISenderDetails {
  [key: string]: string;
}

export interface IReporterDetails {
  [key: string]: string;
}

export interface IReportDetails {
  [key: string]: string;
}

export interface IDrugDetails {
  [key: string]: string;
}

export interface IReactionEventDetails {
  [key: string]: string;
}

export interface IPatientDetails {
  [key: string]: string;
}

export interface INarrationDetail {
  [key: string]: string;
}

export type INodeTypes =
  | ISenderDetails
  | IReporterDetails
  | IReportDetails
  | IDrugDetails
  | IReactionEventDetails
  | IPatientDetails
  | INarrationDetail;

export interface IGetE2BR3Data {
  id: string;
  tenant_id: string;
  config_id: string;
  nodes: {
    patient: IPatientDetails;
    reaction: IReactionEventDetails[];
    drug: IDrugDetails;
    fullTextNarration: INarrationDetail;
    batch: IBatchDetails;
    report: IReportDetails;
    sender: ISenderDetails;
    reporter: IReporterDetails;
  };
  status?: string;
}
