import React, { useEffect, useState } from "react";
import Image from "next/image";
import Patient, { initialPatientValues } from "./patient";
import Drugs, { initialDrugsValues } from "./drugs";
import Reaction, { initialReactionValues } from "./reaction";
import Summary, { initialSummaryValues } from "./summary";
import PrimarySource, { initialPrimarySourceValues } from "./primarySource";
import {
  CONSTANTS,
  STATUS,
  systemMessage,
  tagsAbstract,
} from "@/common/constants";
import { Utils } from "../../../../utils/utils";
import { e2br3Fields, updatedValues } from "@/common/e2br3_constants";
import {
  IMedicalhistoryepisode,
  initialMedicalHistoryEpisodeValues,
} from "./medicalhistoryepisode";
import {
  IPatientPastDrugTherapy,
  initialPatientPastDrugTherapyValues,
} from "./patientPastDrugTherapy";
import {
  IAbstractDetails,
  MonitorData,
} from "@/components/abstract-review/abstract.model";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  AddE2BR2DataAsync,
  E2BR2FullTextNarationDetailsAsync,
  E2BR2SummaryDetailsAsync,
  FetchXMLDetailAsync,
  GetE2BR2DataAsync,
  UpdateE2BR2DataAsync,
  e2br2State,
} from "./e2br3.slice";
import { LocalStorage } from "../../../../utils/localstorage";
import Toast from "@/common/Toast";
import {
  IDrug,
  IE2BR2DataPayload,
  IfullTextNaration,
  IGetE2BR2Data,
  IPatient,
  IPrimarySource,
  IReaction,
  ISummary,
  IUpdateE2BR2DataPayload,
} from "./e2br3.model";
import LoadingSpinner from "@/common/LoadingSpinner";
import FullTextNarration, { initialFullTextValues } from "./fullTextNarration";

interface IE2bR2ModalProps {
  abstract?: string;
  isOpen: boolean;
  selectedAITags?: any;
  selectedTags?: string[];
  title?: string;
  articleId?: string;
  abstractReviewDetail?: MonitorData;
  detailsData?: IAbstractDetails;
  handelClose: () => void;
}

interface ITenantData {
  tenant_id: string;
}

const E2br2: React.FC<IE2bR2ModalProps> = ({
  abstract,
  selectedAITags,
  selectedTags,
  title,
  articleId,
  abstractReviewDetail,
  detailsData,
  handelClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [highlightedContent, setHighlightedContent] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tabs, setTabs] = useState(1);
  const [primarySourceValue, setPrimarySourceValue] = useState<IPrimarySource>(
    initialPrimarySourceValues
  );
  const [primarySourceOnChange, setPrimarySourceOnChange] =
    useState<boolean>(false);

  const [patientValue, setPatientValue] =
    useState<IPatient>(initialPatientValues);
  const [patientOnChange, setPatientOnChange] = useState<boolean>(false);

  const [drugsValue, setDrugsValue] = useState<IDrug>(initialDrugsValues);
  const [drugsOnChange, setDrugsOnChange] = useState<boolean>(false);

  const [summaryValue, setSummaryValue] =
    useState<ISummary>(initialSummaryValues);
  const [summaryOnChange, setSummaryOnChange] = useState<boolean>(false);

 const [fullTextNarationValue, setfullTextNarationValue] =
    useState<IfullTextNaration>(initialFullTextValues);
  const [fullTextNarrationOnChange, setfullTextNarationOnChange] = useState<boolean>(false);

  const [reactionValue, setReactionValue] = useState<IReaction[]>([
    initialReactionValues,
  ]);
  const [reactionOnChange, setReactionOnChange] = useState<boolean>(false);

  const [MedicalHistoryEpisodeDataValue, setMedicalHistoryEpisodeDataValue] =
    useState<IMedicalhistoryepisode>(initialMedicalHistoryEpisodeValues);
  const [
    MedicalHistoryEpisodeDataOnChange,
    setMedicalHistoryEpisodeDataOnChange,
  ] = useState<boolean>(false);

  const [PatientPastDrugTherapyValue, setPatientPastDrugTherapyValue] =
    useState<IPatientPastDrugTherapy[]>([initialPatientPastDrugTherapyValues]);
  const [PatientPastDrugTherapyOnChange, setPatientPastDrugTherapyOnChange] =
    useState<boolean>(false);
  const [E2BR2items, setE2BR2items] = useState<IGetE2BR2Data>();
  const { loading, E2BR2Data, E2BR2Summary,E2BR2FullTextNaration } = useAppSelector(e2br2State);

  const tenantData: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.TENANT_USER_ID
  );
  const tenant_id: ITenantData | null = tenantData
    ? (JSON.parse(tenantData) as ITenantData)
    : null;
  useEffect(() => {
    if (abstractReviewDetail) {
      const payload = {
        id: abstractReviewDetail?.search_result_id,
        type: "R2"
      }
      dispatch(GetE2BR2DataAsync(payload));
      dispatch(
        E2BR2SummaryDetailsAsync({
          search_result_id: abstractReviewDetail.search_result_id,
        })
      );
 dispatch(
        E2BR2FullTextNarationDetailsAsync({
          search_result_id: abstractReviewDetail.search_result_id,
        })
      );

    }
  }, []);


  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setE2BR2items(E2BR2Data);
    }
  }, [loading, E2BR2Data]);

  useEffect(() => {
    if (loading === STATUS.fulfilled && E2BR2items?.nodes) {
      const { primary_source, patient, reaction, drug, summary,fullTextNaration } =
        E2BR2items.nodes;
      setPrimarySourceValue(primary_source);
      setDrugsValue(drug);
      setReactionValue(reaction);
      setSummaryValue(summary);
setfullTextNarationValue(fullTextNaration)
      setPatientValue(patient);
      if (patient && patient.medicalhistoryepisode) {
        setMedicalHistoryEpisodeDataValue(patient.medicalhistoryepisode);
      }
      setPatientPastDrugTherapyValue(
        patient?.patientpastdrugtherapy ? [patient.patientpastdrugtherapy] : []
      );
    }
  }, [loading, E2BR2items]);

    /**
 * Highlights specific words in the abstract text based on selected tags.
 * Each tag corresponds to a specific entity which is then highlighted using a distinct CSS class.
 * 
 * @returns {void} - This function does not return a value. It updates the highlighted content in place.
 */
  const highlightWords = () => {
    let highlightedText = abstract!;
    if (selectedTags!.includes(tagsAbstract.Patient)) {
      const value = selectedAITags.Patient[0].entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract.History)) {
      const value = selectedAITags.History[0].entity;
      highlightedText = setTagColor(value, "history-text", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract["Multiple Patients"])) {
      const value = selectedAITags["Multiple Patients"][0].entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(tagsAbstract["Interesting events / observations"])
    ) {
      const value =
        selectedAITags[tagsAbstract["Interesting events / observations"]][0]
          .entity;
      highlightedText = setTagColor(
        value,
        "interesting-events-observations-patient-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Animal/In-Vitro"])) {
      const value = selectedAITags["Animal/In-Vitro"][0].entity;
      highlightedText = setTagColor(
        value,
        "animal-in-vitro-text",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(tagsAbstract["Abuse/Drug misuse/drug dependence"])
    ) {
      const value =
        selectedAITags["Abuse/Drug misuse/drug dependence"][0].entity;
      highlightedText = setTagColor(
        value,
        "abuse-drug-misuse-drug-dependence-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Study/Review/Clinical trial"])) {
      const value = selectedAITags["Study/Review/Clinical trial"][0].entity;
      highlightedText = setTagColor(
        value,
        "study-review-clinical-text",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(tagsAbstract["Occupational exposure(OC exposure)"])
    ) {
      const value =
        selectedAITags["Occupational exposure(OC exposure)"][0].entity;
      highlightedText = setTagColor(
        value,
        "occupational-exposure-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Lack of efficacy"])) {
      const value = selectedAITags["Lack of efficacy"][0].entity;
      highlightedText = setTagColor(
        value,
        "lack-of-efficacy-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Medication error"])) {
      const value = selectedAITags["Medication error"][0].entity;
      highlightedText = setTagColor(
        value,
        "medication-error-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Overdose"])) {
      const value = selectedAITags["Overdose"][0].entity;
      highlightedText = setTagColor(
        value,
        "overdose-in-vitro-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Drug interaction"])) {
      const value = selectedAITags["Drug interaction"][0].entity;
      highlightedText = setTagColor(
        value,
        "drug-interaction-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Special Keywords"])) {
      const value = selectedAITags["Special Keywords"][0].entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract.diagnosis)) {
      const value = selectedAITags[tagsAbstract.diagnosis][0].entity;
      highlightedText = setTagColor(
        value,
        "diagnosis-diagnostic-procedure-text",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(tagsAbstract["Diagnosis /Diagnostic Procedure"])
    ) {
      const value = selectedAITags["Diagnosis /Diagnostic Procedure"][0].entity;
      highlightedText = setTagColor(
        value,
        "diagnosis-diagnostic-procedure-text",
        highlightedText
      );
    }
    if (selectedTags!.includes(tagsAbstract["Monitor (Target Drug)"])) {
      const value = selectedAITags["Monitor (Target Drug)"][0].entity;
      highlightedText = setTagColor(
        value,
        "highlight-skyblue",
        highlightedText
      );
    }
    if (selectedTags!.includes(tagsAbstract.Medications)) {
      const value = selectedAITags.Medications[0].entity;
      highlightedText = setTagColor(
        value,
        "highlight-medications",
        highlightedText
      );
    }

    if (
      selectedTags!.includes(
        tagsAbstract["Interesting section / special section"]
      )
    ) {
      const value =
        selectedAITags["Interesting section / special section"][0].entity;
      highlightedText = setTagColor(value, "highlight-blue", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract["Special Keywords"])) {
      const value = selectedAITags["Special Keywords"].entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }
    if (selectedTags!.includes(tagsAbstract["Branding"])) {
      const value = selectedAITags["Branding"].entity;
      highlightedText = setTagColor(
        value,
        "highlight-branding",
        highlightedText
      );
    }
    if (selectedTags!.includes(tagsAbstract["Diseases"])) {
      const value = selectedAITags["Diseases"].entity;
      highlightedText = setTagColor(
        value,
        "highlight-diseases",
        highlightedText
      );
    }
    if (selectedTags!.includes(tagsAbstract["Multiple Patients"])) {
      const value = selectedAITags["Multiple Patients"].entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract.Elderly)) {
      const value = selectedAITags.Elderly[0].entity;
      highlightedText = setTagColor(value, "elderly-text", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract.Pediatric)) {
      const value = selectedAITags.Pediatric[0].entity;
      highlightedText = setTagColor(value, "pediatric-text", highlightedText);
    }

    if (selectedTags!.includes(tagsAbstract["Pregnancy/fetus/foetus"])) {
      const value = selectedAITags["Pregnancy/fetus/foetus"][0].entity;
      highlightedText = setTagColor(
        value,
        "pregnancy-fetus-foetus-text",
        highlightedText
      );
    }

    if (selectedTags!.includes(tagsAbstract["Patient population"])) {
      const value = selectedAITags["Patient population"].entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient-population-text",
        highlightedText
      );
    }
    setHighlightedContent(highlightedText);
  };

  const setTagColor = (value: any, color: string, highlightedText: string) => {
    let modifiedText = highlightedText; // Create a copy to modify

    value?.forEach((entity: any) => {
      const highlightedTextHTML = `<span class=${color}>${entity}</span>`;
      // Escape special characters in the entity
      const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      modifiedText = modifiedText.replace(
        new RegExp(escapedEntity, "gi"),
        highlightedTextHTML
      );
    });
    return modifiedText;
  };

  useEffect(() => {
    highlightWords();
  }, [abstract]);

  const medications = abstractReviewDetail?.ai_tags?.Medications
    ? abstractReviewDetail?.ai_tags?.Medications?.map(
        (medication: { entity: any[] }) =>
          medication?.entity?.map((entity: any) => [entity])
      )
        .join(", ")
        .split(", ")
    : "";

  const medicationsArray = medications[0]
    ?.split(",")
    .map((item: string) => item.trim());

  const patientsValue = () => {
    const patient = {
      patientinitial: patientOnChange
        ? patientValue.patientinitial
        : abstractReviewDetail?.ai_tags?.Patient
        ? abstractReviewDetail?.ai_tags?.Patient.map(
            (medication: { entity: any[] }) =>
              medication?.entity?.map((entity: any) => entity)
          ).join(", ")
        : "",
      patientonsetage: patientOnChange ? patientValue.patientonsetage : "",
      patientonsetageunit: patientOnChange
        ? patientValue.patientonsetageunit
        : "",
      patientsex: patientOnChange ? patientValue.patientsex : "",
      resultstestsprocedures: patientOnChange
        ? patientValue.resultstestsprocedures
        : "",
      medicalhistoryepisode: MedicalHistoryEpisodeDataOnChange
        ? MedicalHistoryEpisodeDataValue
        : [
            {
              patientepisodenamemeddraversion: "",
              patientepisodename: "",
              patientmedicalcontinue: "",
            },
          ],
      patientpastdrugtherapy: PatientPastDrugTherapyOnChange
        ? PatientPastDrugTherapyValue
        : medicationsArray?.map((medication: any) => ({
            patientdrugname: medication,
          })),
    };
    return patient;
  };

  const primarySourcesValue = () => {
    const primarysource = {
      reportergivename: primarySourceOnChange
        ? primarySourceValue.reportergivename
        : "",
      reporterfamilyname: primarySourceOnChange
        ? primarySourceValue.reporterfamilyname
        : "",
      reporterorganization: primarySourceOnChange
        ? primarySourceValue.reporterorganization
        : "",
      reporterdepartment: primarySourceOnChange
        ? primarySourceValue.reporterdepartment
        : "",
      reporterstreet: primarySourceOnChange
        ? primarySourceValue.reporterstreet
        : "",
      reportercity: primarySourceOnChange
        ? primarySourceValue.reportercity
        : "",
      reporterpostcode: primarySourceOnChange
        ? primarySourceValue.reporterpostcode
        : "",
      reportercountry: primarySourceOnChange
        ? primarySourceValue.reportercountry
        : "",
      qualification: primarySourceOnChange
        ? primarySourceValue.qualification
        : "",
      literaturereference: primarySourceValue
        ? primarySourceValue.literaturereference
        : "",
    };
    return primarysource;
  };

  const drugValue = () => {
    const drug = {
      drugcharacterization: drugsOnChange
        ? drugsValue.drugcharacterization
        : "",
      medicinalproduct: drugsOnChange ? drugsValue.medicinalproduct : "",
      obtaindrugcountry: drugsOnChange ? drugsValue.obtaindrugcountry : "",
      drugauthorizationnumb: drugsOnChange
        ? drugsValue.drugauthorizationnumb
        : "",
      drugauthorizationcountry: drugsOnChange
        ? drugsValue.drugauthorizationcountry
        : "",
      drugauthorizationholder: drugsOnChange
        ? drugsValue.drugauthorizationholder
        : "",
      drugdosagetext: drugsOnChange ? drugsValue.drugdosagetext : "",
      drugdosageform: drugsOnChange ? drugsValue.drugdosageform : "",
      drugindicationmeddraversion: drugsOnChange
        ? drugsValue.drugindicationmeddraversion
        : "",
      drugindication: drugsOnChange ? drugsValue.drugindication : "",
      actiondrug: drugsOnChange ? drugsValue.actiondrug : "",
      drugreactionassesmeddraversion: drugsOnChange
        ? drugsValue.drugreactionassesmeddraversion
        : "",
      drugreactionasses: drugsOnChange ? drugsValue.drugreactionasses : "",
      drugassessmentsource: drugsOnChange
        ? drugsValue.drugassessmentsource
        : "",
      drugassessmentmethod: drugsOnChange
        ? drugsValue.drugassessmentmethod
        : "",
      drugresult: drugsOnChange ? drugsValue.drugresult : "",
    };
    return drug;
  };

  const SuspectedAdverseEvent = abstractReviewDetail?.ai_tags![
    "Suspected Adverse Event(AE)"
  ]
    ? abstractReviewDetail?.ai_tags["Suspected Adverse Event(AE)"]
        ?.map((event: { entity: any[] }) =>
          event?.entity?.map((entity: any) => [entity])
        )
        .join(", ")
        .split(", ")
    : [];

  const SuspectedAdverseEventArray =
    SuspectedAdverseEvent?.[0]?.split(",").map((item: string) => item.trim()) ||
    [];
  const reaction = () => {
    const reaction = reactionOnChange
      ? reactionValue
      : SuspectedAdverseEventArray.length > 0
      ? SuspectedAdverseEventArray.map((event: any) => ({
          primarysourcereaction: event || "",
          reactionmeddraversionllt: "",
          reactionmeddrallt: "",
          reactionmeddraversionpt: "",
          reactionmeddrapt: "",
          reactionoutcome: "",
          seriousness: "",
        }))
      : [
          {
            primarysourcereaction: "",
            reactionmeddraversionllt: "",
            reactionmeddrallt: "",
            reactionmeddraversionpt: "",
            reactionmeddrapt: "",
            reactionoutcome: "",
            seriousness: "",
          },
        ];
    return reaction;
  };


  const summary = () => {
    const summary = {
      narrativeincludeclinical: summaryOnChange
        ? summaryValue.narrativeincludeclinical
        : E2BR2Summary.narrative,
      senderdiagnosismeddraversion: summaryOnChange
        ? summaryValue.senderdiagnosismeddraversion
        : "",
      senderdiagnosis: summaryOnChange ? summaryValue.senderdiagnosis : "",
    };
    return summary;
  };
 const fullTextNarration = () => {
    const fullTextNarration = {
      narrativeincludeclinical: fullTextNarrationOnChange
        ? fullTextNarationValue?.narrativeincludeclinical
        : E2BR2FullTextNaration.narrative,
      senderdiagnosismeddraversion: fullTextNarrationOnChange
        ? fullTextNarationValue?.senderdiagnosismeddraversion
        : "",
      senderdiagnosis: fullTextNarrationOnChange ? fullTextNarationValue?.senderdiagnosis : "",
    };
    return fullTextNarration;
  };

  const combineValues = () => {
    return {
      tenant_id: tenant_id?.tenant_id,
      config_id: abstractReviewDetail?.search_result_id,
      nodes: {
        primary_source: primarySourcesValue(),
        patient: patientsValue(),
        reaction: reaction(),
        drug: drugValue(),
        summary: summary(),
fullTextNarration:fullTextNarration()
      },
      etb_type: "R2"
    };
  };

  const combineUpdateValues = () => {
    return {
      // nodeId
      id: E2BR2items?.id,
      // search result Id
      // id: abstractReviewDetail?.search_result_id,
      nodes: {
        primary_source: primarySourcesValue(),
        patient: patientsValue(),
        reaction: reaction(),
        drug: drugValue(),
        summary: summary(),
fullTextNarration:fullTextNarration()
      },
    };
  };

  const handleSubmit = async () => {
    try {
      const payload = combineValues();
      const response = await dispatch(
        AddE2BR2DataAsync(payload as unknown as IE2BR2DataPayload)
      );

      if (AddE2BR2DataAsync.fulfilled.match(response)) {
        if (response.payload.status === 201) {
          Toast(systemMessage.E2br2AddSuccess, { type: "success" });
          if (abstractReviewDetail) {
            const payload = {
              id: abstractReviewDetail?.search_result_id,
              type: "R2"
            }
            dispatch(GetE2BR2DataAsync(payload));
          }
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const payload = combineUpdateValues();
      const response = await dispatch(
        UpdateE2BR2DataAsync(payload as unknown as IUpdateE2BR2DataPayload)
      );
      if (UpdateE2BR2DataAsync.fulfilled.match(response)) {
        if (response.payload.status === 200) {
          Toast(systemMessage.E2br2UpdateSuccess, { type: "success" });
          if (abstractReviewDetail) {
            const payload = {
              id: abstractReviewDetail?.search_result_id,
              type: "R2"
            }
            dispatch(GetE2BR2DataAsync(payload));
          }
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  

/**
 * Converts JSON data to XML format with a specified root element.
 * Generates XML based on the structure of the input JSON object or array.
 * Adds XML declaration and specific namespaces for healthcare interoperability.
 * @param json The JSON object or array to convert to XML.
 * @param rootName The root element name for the XML structure.
 * @returns XML string representing the converted JSON data.
 */
  const jsonToXml = (json: any, rootName: any) => {
    let xml = "";
    const toXml = (json: any, name: any) => {
      let xmlString = "";
      if (Array.isArray(json)) {
        json.forEach((item) => {
          xmlString += `<${name}>${toXml(item, name.slice(0, -1))}</${name}>`;
        });
      } else if (typeof json === "object") {
        Object.keys(json).forEach((key) => {
          xmlString += `<${key}>${toXml(json[key], key)}</${key}>`;
        });
      } else {
        xmlString += json;
      }
      return xmlString;
    };
    xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<MCCI_IN200100UV01 ITSVersion="XML_1.0" xsi:schemaLocation="urn:hl7-org:v3 http://eudravigilance.ema.europa.eu/XSD/multicacheschemas/MCCI_IN200100UV01.xsd" xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`;
    xml += `<id root="2.16.840.1.113883.3.989.2.1.3.22" extension="ASSURED-767"/>`;
    xml += `<creationTime value="${Utils.getFormattedXMLDateTime()}+0000"/>`;
    xml += `<responseModeCode code="D"/>`;
    xml += `<interactionId root="2.16.840.1.113883.1.6" extension="MCCI_IN200100UV01"/>`;
    xml += `<${rootName}>${toXml(json, rootName)}</${rootName}>`;
    xml += `</MCCI_IN200100UV01>`;
    return xml;
  };

 

  // Function to rename keys recursively
  /**
 * Recursively renames keys in an object based on a key map.
 * 
 * @param data - The object whose keys need to be renamed.
 * @param keyMap - A mapping of old keys to new keys.
 */
  const renameKeys = (
    data: Record<string, any>,
    keyMap: Record<string, string>
  ): void => {
    if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (typeof data[key] === "object" && data[key] !== null) {
          // Recursively rename keys for nested objects
          renameKeys(data[key], keyMap);
        }
        if (key in keyMap) {
          data[keyMap[key]] = data[key];
          // Delete the key only if it's renamed
          if (key !== keyMap[key]) {
            delete data[key];
          }
        }
      }
    }
  };

  /**
 * Downloads XML data based on the current article ID and configuration details.
 */
  const downloadXML = async () => {
    const tenantId = tenant_id?.tenant_id;
    const configId = abstractReviewDetail?.search_result_id;
    try {
      const response = await dispatch(
        FetchXMLDetailAsync({ tenant_id: tenantId, config_id: configId, type: "R2" })
      );
      if (FetchXMLDetailAsync.fulfilled.match(response)) {
        if (response.payload?.status === 400) {
          Toast(response?.payload?.data?.message, { type: "error" });
        }

        if (response!.payload!.status === 200) {
          const data = response!.payload!.data;
          const configNode = data?.config_nodes;
          const staticNode = data?.static_nodes;
          const XMLJSONData = {
            ...configNode,
            ...staticNode,
          };

          if (updatedValues) {
            renameKeys(XMLJSONData, e2br3Fields);
          }
          const xmlData = jsonToXml(XMLJSONData, `articleId_${articleId}`);
          const xmlBlob = new Blob([xmlData], { type: "application/xml" });
          const anchor = document.createElement("a");
          anchor.href = URL.createObjectURL(xmlBlob);
          anchor.style.display = "inline-block";
          const fileName = articleId
            ? `xml_report_ArticleID_${articleId}_${Utils.getCurrentDateAndTime()}.xml`
            : `xml_report_${Utils.getCurrentDateAndTime()}.xml`;
          anchor.setAttribute("download", fileName);
          anchor.click();
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      throw error;
    }
  };

 

  const handleTab = (tabIndex: React.SetStateAction<number>) => {
    setTabs(tabIndex);
  };


  return (
    <React.Fragment>
      <div className="e2br2-modal text-14 e2br2-modal-scrollable-content">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute cursor-pointer right-4 top-4 w-3"
          onClick={handelClose}
          width={12}
          height={12}
        />
        <div>
          <p className="col-6 mx-4 my-2">
            Title:<span className="text-violet capitalize"> {title}</span>
          </p>
          <div className="flex mx-4 my-2">
            <div className="text-black mb-2">Author(s): </div>
          <div> 
             {detailsData?.author
              ?.split(",")
              .map((author: string, index: number) => (
                <span key={index} className="text-dimgray">
                  {author.trim()}
          {index < detailsData.author.split(",").length - 1 ? ', ' : ''}

                </span>
              ))}</div>
           
          </div>
        </div>
        <div className="flex mx-4 my-2">
          <div className="text-black mb-2">Affiliation:</div>
          <div className="text-violet">{detailsData?.affiliation}</div>
        </div>
        <div className="flex m-2">
          <div className="w-1/3 container-with-line">
            <p className="text-black font-bold ml-4 mt-2">Abstract</p>
            <div
              className="ml-4 mr-4 mt-0 text-14 content-style"
              dangerouslySetInnerHTML={{ __html: highlightedContent }}
            ></div>
          </div>
          <div className="bg-white w-full m-2 text-14 rounded-[15px]">
            <ul className="flex flex-wrap bg-tabColor cursor-pointer text-sm font-medium text-center border-b border-gray-200 mb-0">
              <span
                className={`inline-block text-14 p-4 -ml-[40px] ${
                  tabs === 1 ? "bg-white" : "bg-tabColor"
                } ${
                  tabs === 1 ? "text-violet" : "text-buttonGray"
                } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
                onClick={() => handleTab(1)}
              >
                {" "}
                Primary source
              </span>
              <span
                className={`inline-block text-14 p-4 text-tabText  ${
                  tabs === 2 ? "bg-white" : "bg-tabColor"
                } ${
                  tabs === 2 ? "text-violet" : "text-buttonGray"
                } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
                onClick={() => handleTab(2)}
              >
                {" "}
                Patient
              </span>
              <span
                className={`inline-block text-14 p-4 text-tabText  ${
                  tabs === 3 ? "bg-white" : "bg-tabColor"
                } ${
                  tabs === 3 ? "text-violet" : "text-buttonGray"
                } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
                onClick={() => handleTab(3)}
              >
                {" "}
                Reaction
              </span>
              <span
                className={`inline-block text-14 p-4 text-tabText  ${
                  tabs === 4 ? "bg-white" : "bg-tabColor"
                } ${
                  tabs === 4 ? "text-violet" : "text-buttonGray"
                } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
                onClick={() => handleTab(4)}
              >
                {" "}
                Drug
              </span>
              <span
                className={`inline-block text-14 p-4 text-tabText  ${
                  tabs === 5 ? "bg-white" : "bg-tabColor"
                } ${
                  tabs === 5 ? "text-violet" : "text-buttonGray"
                } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
                onClick={() => handleTab(5)}
              >
                {" "}
                Summary
              </span>
   <span
                className={`inline-block text-14 p-4 text-tabText  ${
                  tabs === 6 ? "bg-white" : "bg-tabColor"
                } ${
                  tabs === 6 ? "text-violet" : "text-buttonGray"
                } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
                onClick={() => handleTab(6)}
              >
                {" "}
                Full text naration
              </span>
            </ul>
            {tabs === 1 ? (
              <PrimarySource
                setPrimarySourceOnChange={setPrimarySourceOnChange}
                primarySourceValue={primarySourceValue}
                onChange={(value: IPrimarySource) =>
                  setPrimarySourceValue(value)
                }
              />
            ) : tabs === 2 ? (
              <Patient
                onChange={(value: IPatient) => setPatientValue(value)}
                patientValue={patientValue}
                MedicalHistoryEpisodeDataValue={MedicalHistoryEpisodeDataValue}
                PatientPastDrugTherapyValue={PatientPastDrugTherapyValue}
                abstractReviewDetail={abstractReviewDetail}
                detailsData={detailsData}
                setMedicalHistoryEpisodeDataValue={
                  setMedicalHistoryEpisodeDataValue
                }
                setPatientPastDrugTherapyValue={setPatientPastDrugTherapyValue}
                setPatientOnChange={setPatientOnChange}
                setMedicalHistoryEpisodeDataOnChange={
                  setMedicalHistoryEpisodeDataOnChange
                }
                setPatientPastDrugTherapyOnChange={
                  setPatientPastDrugTherapyOnChange
                }
              />
            ) : tabs === 3 ? (
              <Reaction
                setReactionOnChange={setReactionOnChange}
                reactionValue={reactionValue[0]}
                onChange={(value: IReaction) => setReactionValue([value])}
                abstractReviewDetail={abstractReviewDetail}
              />
            ) : tabs === 4 ? (
              <Drugs
                setDrugsOnChange={setDrugsOnChange}
                drugsValue={drugsValue}
                onChange={(value: IDrug) => setDrugsValue(value)}
              />
            ) :tabs === 5 ? (
              <Summary
                setSummaryOnChange={setSummaryOnChange}
                summaryValue={summaryValue}
                onChange={(value: ISummary) => setSummaryValue(value)}
                abstractReviewDetail={abstractReviewDetail}
                detailsData={detailsData}
            
              />):(<FullTextNarration
                setfullTextNarrationOnChange={setfullTextNarationOnChange}
                fullTextNarationValue={fullTextNarationValue}
                onChange={(value: IfullTextNaration) => setfullTextNarationValue(value)}
                abstractReviewDetail={abstractReviewDetail}
                detailsData={detailsData}
              />
            )}
            <div className="float-right">
              {E2BR2items?.status == "error" ? (
                <button
                  className="font-Archivo mt-2 cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              ) : (
                <button
                  className="font-Archivo mt-2 cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  type="submit"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              )}
              <button
                onClick={downloadXML}
                disabled={E2BR2items?.status == "error" || !Utils.isPermissionGranted("export_files")}
                className={`font-Archivo mt-2 ml-2  bg-white  cursor-pointer py-2 px-8 text-yellow border border-yellow  rounded-md ${
                  E2BR2items?.status == "error" || Utils.isPermissionGranted("export_files")
                    ? ""
                    : "disabled-select border-none"
                }`}
              >
                Export XML
              </button>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
    </React.Fragment>
  );
};

export default E2br2;
