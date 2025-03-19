import { IMedicalhistoryepisode } from "./medicalhistoryepisode";
import { IPatientPastDrugTherapy } from "./patientPastDrugTherapy";

export interface IStatus {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
}

export interface IData extends IStatus {
  E2BR2Data: IGetE2BR2Data;
  E2BR2Summary: IE2BR2DataSummary
E2BR2FullTextNaration:IE2BR2DataFullTextNaration
}

export interface IPatient {
  patientinitial?: string;
  patientonsetage?: string;
  patientonsetageunit?: string;
  patientsex?: string;
  resultstestsprocedures?: string;
  medicalhistoryepisode? :IMedicalhistoryepisode;
  patientpastdrugtherapy? : IPatientPastDrugTherapy
}

export interface IPrimarySource {
  reportergivename?: string;
  reporterfamilyname?: string;
  reporterorganization?: string;
  reporterdepartment?: string;
  reporterstreet?: string;
  reportercity?: string;
  reporterpostcode?: string;
  reportercountry?: string;
  qualification?: string;
  literaturereference?: string;
}

export interface IReaction {
  primarysourcereaction: string;
  reactionmeddraversionllt: string;
  reactionmeddrallt: string;
  reactionmeddraversionpt: string;
  reactionmeddrapt: string;
  reactionoutcome: string;
  seriousness: string
}

export interface IDrug {
  drugcharacterization?: string;
  medicinalproduct?: string;
  obtaindrugcountry?: string;
  drugauthorizationnumb?: string;
  drugauthorizationcountry?: string;
  drugauthorizationholder?: string;
  drugdosagetext?: string;
  drugdosageform?: string;
  drugindicationmeddraversion?: string;
  drugindication?: string;
  actiondrug?: string;
  drugreactionassesmeddraversion?: string;
  drugreactionasses?: string;
  drugassessmentsource?: string;
  drugassessmentmethod?: string;
  drugresult?: string;
}

export interface ISummary {
  narrativeincludeclinical?: string;
  senderdiagnosismeddraversion?: string;
  senderdiagnosis?: string;
}


export interface IfullTextNaration {
  narrativeincludeclinical?: string;
  senderdiagnosismeddraversion?: string;
  senderdiagnosis?: string;
}


export interface IE2BR2DataPayload {
  tenant_id: string | undefined;
  config_id: string | undefined
  nodes: {
    primary_source: IPrimarySource;
    patient: IPatient;
    reaction: IReaction[];
    drug: IDrug;
    summary: ISummary;
  };
  etb_type: string
}

export interface DownloadXML {
  tenant_id: string | undefined;
  config_id: string | undefined;
  type: string
}

export interface IUpdateE2BR2DataPayload {
  id: string;
  nodes: {
    primarysource: IPrimarySource;
    patient: IPatient;
    reaction: IReaction;
    drug: IDrug;
    summary: ISummary;
  };
  etb_type: string
}

export interface IGetE2BR2Data {
  id: string;
  tenant_id: string;
  config_id: string;
  nodes: {
    primary_source: IPrimarySource;
    patient: IPatient;
    reaction: IReaction[];
    drug: IDrug;
    summary: ISummary;
  fullTextNaration:IfullTextNaration
  };
  status?: string
}

export interface IE2BR2DataSummary {
  narrative: string,
  config_id: string
}


export interface IE2BR2DataFullTextNaration {
  narrative: string,
  config_id: string
}
export interface E2BR2Payload {
  id: string,
  type?: string
}