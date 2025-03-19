"use client";
import Button from "@/common/Button";
import {
  CONSTANTS,
  systemMessage,
  tagsAbstract,
  SummaryTags,
  FullTextAttachmentDocumentType,
  STATUS,
} from "@/common/constants";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  CSVFileDetails,
  IAbstractDetails,
  IInQueue,
  IThirdPageAbstractData,
  MonitorData,
  payloadMonitorID,
  ReportSummary,
} from "../abstract.model";
import Modal from "@/common/modal/model";
import E2br2 from "@/common/modal/e2br2";
import { ReviewName } from "@/common/constants";
import {
  AbstractReviewDataState,
  AbstractReviewMonitorDetailAsync,
  AbstractReviewMoniterReviewAsync as AbstractReviewMonitorReviewAsync,
  FullTextRequiredAsync,
  abstractDetailsByIdAsync,
  PreviewURlAsync,
  pdfFileDataAPIAsync,
  GetArticleDetailsAsync,
  ProcuremetAbstractSendMailAsync,
} from "../abstract-review.slice";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import Details from "./Details";
import AIMLModal from "./AIMILModal";
import { useRouter } from "next/navigation";
import {
  GetAllCategoryAsync,
  GetAllClassificationAsync,
  generalState,
} from "@/components/system-settings/general.slice";
import { LocalStorage } from "../../../../utils/localstorage";
import { Utils } from "../../../../utils/utils";
import MeSHtermsModal from "@/common/modal/MeSHtermsModal";
import ExportDropdown from "@/common/exportDropdowns/ExportDropdwon";
import { Bars } from "react-loader-spinner";
import { format } from "date-fns";
import FullTextProcurementModal from "./ProcurementFullTextModal";
import QcEmailModal from "./QCEmail";
import { ReviewQcFeedbackAsync } from "@/components/advanced-review/advance-review.slice";

type tag = string;

type MergeField = { [key: string]: string };

interface FullTextProcurementPayload {
  emails: string[];
  merge_fields: MergeField[];
  message: string;
}

interface Entity {
  entity: string;
  start: number;
  end: number;
}

interface Tags {
  [key: tag]: Entity[];
}

interface ICheckboxState {
  [key: string]: boolean;
}
interface Option {
  map(arg0: (category: any) => any): any;
  label: string;
  value: string;
}
const Tag: string[] = [
  "Patient identified",
  "Suspected adverse event",
  "Suspected case",
];

export interface IFormValues {
  selectedTags: string;
  selectedCheckboxes: ICheckboxState;
  selectedReview: string;
  selectedCategories: { label: string; value: string }[];
  selectedClassification: { label: string; value: string }[];
  comment: string;
  monitor_id: string;
  pmid: string;
  case_id?: string;
}

const AbstractReviewThirdPage = (context: { params: payloadMonitorID }) => {
  const router = useRouter();
  const [isOpenProcurementFullTextBox, setIsOpenProcurementFullTextBox] =
    useState<boolean>(false);

  const [selectedAITags, setSelectedAITags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<tag[]>([]);
  const [activeTab, setActiveTab] = useState("Details");
  const [feedback, setFeedback] = useState(false);
  const [tagEntity, setTagEntity] = useState(true);
  const [fetchedInQueue, setInQueue] = useState<IInQueue>();
  const [title, setTitle] = useState<string>("");
  const [abstract, setAbstract] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [articleId, setArticleId] = useState<string>("");
  const [doi, setDOI] = useState<string>("");

  const [openMeSHterms, setOpenMeSHterms] = useState(false);
  const [MeSHtermsArray, setMeSHtermsArray] = useState<string[]>([]);
  const [generativeAIDecision, setGenerativeAIDecision] = useState<string>("");
  const [generativeAIDecisionScore, setGenerativeAIDecisionScore] =
    useState<number>(0);
  const [generativeAISummary, setGenerativeAISummary] = useState<string>("");
  const [casualityDecision, setCasualityDecision] = useState<string>("");
  const [casualityDecisionScore, setCasualityDecisionScore] =
    useState<number>(0);
  const [casualitySummary, setCasualitySummary] = useState<string>("");
  const [keys, setKeys] = useState<string[]>([]);
  const [toggleButton, setToggleButton] = useState<string>("");
  const [success, isSuccess] = useState<string>("");
  const [summaryTag, setSummaryTag] = useState<any>([]);
  const [drugOfChoiceTag, setdrugOfChoiceTag] = useState<any>([]);
  const [drugTag, setdrugTag] = useState<any>([]);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [highlightedContent, setHighlightedContent] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenE2bR2, setIsOpenE2bR2] = useState<boolean>(false);
  const [abstractDetail, setAbstractDetail] = useState<IAbstractDetails | null>(
    null
  );
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const {
    status,
    abstractStatus,
    abstractReviewDetail,
    AbstractDetails,
    previewURL,
    getArticleDetails,
  } = useAppSelector(AbstractReviewDataState);
  const dispatch = useAppDispatch();
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const pmid = params?.pmid as string;
  const [fetchAbstractReviewDetail, setFetchAbstractReviewDetail] =
    useState<IThirdPageAbstractData | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [classificationOptions, setClassificationOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [getArticleData, setGetArticleData] = useState<ReportSummary>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [qcEmail, setQcEmail] = useState(false);
  const [formValues, setFormValues] = useState<IFormValues>({
    selectedTags: "",
    selectedCheckboxes: {} as ICheckboxState,
    selectedReview: "",
    selectedCategories: [] as Option[],
    selectedClassification: [] as Option[],
    comment: "",
    monitor_id: "",
    pmid: "",
    case_id: "",
  });
  const [showResubmitForm, setShowResubmitForm] = useState(false);

  const [sourceCheckboxes, setSourceCheckboxes] = useState<ICheckboxState>({
    "Aggregate / PSUR reporting": false,
    "Signal Reporting": false,
    "Article of Interest": false,
  });
  const DataString: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.DATA_STORE
  );
  const Data: MonitorData[] | null = DataString
    ? (JSON.parse(DataString) as MonitorData[])
    : null;

  const indexString: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex
  );
  const Index: number | null = indexString
    ? (JSON.parse(indexString) as number)
    : 0;
  const [currentIndex, setCurrentIndex] = useState<number>(Index);
  const { Category, Classification } = useAppSelector(generalState);

  const handleClickLeft = async () => {
    setIsLoading(true);
    if (currentIndex !== null && currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      LocalStorage.setItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex,
        JSON.stringify(newIndex)
      );
      const currentRecord =
        Data && currentIndex !== null ? Data[newIndex] : null;
      if (currentRecord) {
        const id = currentRecord.id;
        await getDetails(id);
      }
    }
    setIsLoading(false);
  };

  const handleClickRight = async () => {
    setIsLoading(true);
    if (Data) {
      if (currentIndex !== null && currentIndex < Data.length) {
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex,
          JSON.stringify(newIndex)
        );

        const currentRecord =
          Data && currentIndex !== null ? Data[newIndex] : null;
        if (currentRecord) {
          const id = currentRecord.id;
          await getDetails(id);
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getDetails(pmid);
    formValues.monitor_id = monitor_id;
    formValues.pmid = pmid;
  }, [monitor_id, pmid]);

  useEffect(() => {
    setIsLoading(true);
    dispatch(GetAllCategoryAsync());
    dispatch(GetAllClassificationAsync());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const mappedCategoryOptions = Category.map((cat) => ({
      label: cat.name,
      value: cat.name,
    }));
    setCategoryOptions(mappedCategoryOptions);
  }, [Category]);

  useEffect(() => {
    setIsLoading(true);
    if (abstractDetail) {
      setAbstract(abstractDetail.abstract || "");
      setKeywords(abstractDetail.keywords);
      setArticleId(abstractDetail.article_id);
      setDOI(abstractDetail.doi);
    }
  }, [abstractDetail, status, fetchAbstractReviewDetail]);

  useEffect(() => {
    setIsLoading(true);
    if (status === STATUS.fulfilled && abstractDetail) {
      setGetArticleData(getArticleDetails);
      setIsLoading(false);
    }
  }, [isLoading, status, fetchAbstractReviewDetail, abstractDetail]);

  useEffect(() => {
    if (getArticleData?.aggregate_report?.summary?.length !== 0) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [getArticleData]);

  useEffect(() => {
    const mappedClassificationOptions = Classification.map((cat) => ({
      label: cat.name,
      value: cat.name,
    }));
    setClassificationOptions(mappedClassificationOptions);
  }, [Classification]);
  useEffect(() => {
    setLoading(true);
    if (fetchAbstractReviewDetail?.search_result_id) {
      const fetchData = async () => {
        try {
          const data = await dispatch(
            abstractDetailsByIdAsync(
              fetchAbstractReviewDetail?.search_result_id
            )
          );
          if (abstractDetailsByIdAsync.fulfilled.match(data)) {
            setAbstractDetail(data.payload);
          } else {
            setAbstractDetail(null);
          }
          const response = await dispatch(
            PreviewURlAsync(fetchAbstractReviewDetail.search_result_id)
          );
          if (PreviewURlAsync.fulfilled.match(response)) {
            if (response.payload?.status === 400) {
              Toast(systemMessage.FreeFullTextLinkNotAvailable, {
                type: "error",
              });
            }
          }
          dispatch(
            pdfFileDataAPIAsync(fetchAbstractReviewDetail.search_result_id)
          );
          dispatch(
            GetArticleDetailsAsync(fetchAbstractReviewDetail.search_result_id)
          );
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [fetchAbstractReviewDetail?.search_result_id]);

  useEffect(() => {
    if (fetchAbstractReviewDetail !== undefined && fetchAbstractReviewDetail) {
      const mergedTags = {
        ...fetchAbstractReviewDetail?.ai_tags,
        designated_medical_events:
          fetchAbstractReviewDetail?.designated_medical_events,
      };
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        comment: fetchAbstractReviewDetail?.comments || "",
        selectedReview: fetchAbstractReviewDetail?.expert_decision || "",
        selectedCategories:
          fetchAbstractReviewDetail?.categories?.map((cat) => ({
            label: cat,
            value: cat,
          })) || [],
        selectedClassification:
          fetchAbstractReviewDetail?.classifications?.map((cat) => ({
            label: cat,
            value: cat,
          })) || [],
      }));

      setSourceCheckboxes({
        "Aggregate / PSUR reporting":
          fetchAbstractReviewDetail?.is_aggregate_reporting || false,
        "Signal Reporting":
          fetchAbstractReviewDetail?.is_safety_signal || false,
        "Article of Interest":
          fetchAbstractReviewDetail?.is_serious_event || false,
      });

      setTitle(fetchAbstractReviewDetail?.title || "");
      setGenerativeAIDecision(fetchAbstractReviewDetail?.ai_decision || "");
      setGenerativeAIDecisionScore(
        fetchAbstractReviewDetail?.confidence_score || 0
      );
      setGenerativeAISummary(fetchAbstractReviewDetail?.reason || "");
      setCasualityDecision(fetchAbstractReviewDetail?.causality_decision || "");
      setCasualityDecisionScore(
        fetchAbstractReviewDetail?.causality_confidence_score || 0
      );
      setCasualitySummary(fetchAbstractReviewDetail?.causality_reason || "");
      setSelectedAITags(mergedTags || []);

      if (fetchAbstractReviewDetail?.tags) {
        setSummaryTag(Object?.keys(fetchAbstractReviewDetail?.tags));
      }
      if (fetchAbstractReviewDetail?.drug_of_choice) {
        setdrugOfChoiceTag(fetchAbstractReviewDetail?.drug_of_choice);
      }
      if (fetchAbstractReviewDetail?.drug) {
        setdrugTag(fetchAbstractReviewDetail?.drug);
      }

      highlightWords();
    }
  }, [fetchAbstractReviewDetail]);
  useEffect(() => {
    if (selectedAITags) {
      setKeys(Object.keys(selectedAITags));
      setSelectedTags(Object.keys(selectedAITags));
    }
  }, [selectedAITags]);

  /**
   * Highlights specific words or phrases within the abstract text based on selected tags.
   */
  const highlightWords = () => {
    let highlightedText = abstract;
    if (selectedTags.includes(tagsAbstract.Patient)) {
      const value = selectedAITags?.Patient[0]?.entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract.History)) {
      const value = selectedAITags?.History[0]?.entity;
      highlightedText = setTagColor(value, "history-text", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract["Multiple Patients"])) {
      const value = selectedAITags["Multiple Patients"][0]?.entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Interesting events / observations"])
    ) {
      const value =
        selectedAITags![tagsAbstract["Interesting events / observations"]][0]
          ?.entity;
      highlightedText = setTagColor(
        value,
        "interesting-events-observations-patient-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Animal/In-Vitro"])) {
      const value = selectedAITags!["Animal/In-Vitro"][0]?.entity;
      highlightedText = setTagColor(
        value,
        "animal-in-vitro-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Abuse/Drug misuse/drug dependence"])
    ) {
      const value =
        selectedAITags!["Abuse/Drug misuse/drug dependence"]![0]?.entity;
      highlightedText = setTagColor(
        value,
        "abuse-drug-misuse-drug-dependence-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Study/Review/Clinical trial"])) {
      const value = selectedAITags!["Study/Review/Clinical trial"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "study-review-clinical-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Occupational exposure(OC exposure)"])
    ) {
      const value =
        selectedAITags!["Occupational exposure(OC exposure)"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "occupational-exposure-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Lack of efficacy"])) {
      const value = selectedAITags!["Lack of efficacy"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "lack-of-efficacy-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Medication error"])) {
      const value = selectedAITags!["Medication error"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "medication-error-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Overdose"])) {
      const value = selectedAITags!["Overdose"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "overdose-in-vitro-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Drug interaction"])) {
      const value = selectedAITags!["Drug interaction"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "drug-interaction-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Special Keywords"])) {
      const value = selectedAITags!["Special Keywords"]![0]!.entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract.diagnosis)) {
      const value = selectedAITags![tagsAbstract.diagnosis]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "diagnosis-diagnostic-procedure-text",
        highlightedText
      );
    }

    if (
      selectedTags.includes(tagsAbstract["Diagnosis /Diagnostic Procedure"])
    ) {
      const value =
        selectedAITags!["Diagnosis /Diagnostic Procedure"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "diagnosis-diagnostic-procedure-text",
        highlightedText
      );
    }

    if (selectedTags.includes(tagsAbstract["Monitor (Target Drug)"])) {
      const value = selectedAITags!["Monitor (Target Drug)"]![0]!.entity;
      highlightedText = setTagColor(
        value,
        "highlight-skyblue",
        highlightedText
      );
    }
    if (selectedTags.includes(tagsAbstract.Medications)) {
      const value = selectedAITags?.Medications[0]?.entity;
      highlightedText = setTagColor(
        value,
        "highlight-medications",
        highlightedText
      );
    }

    if (
      selectedTags.includes(
        tagsAbstract["Interesting section / special section"]
      )
    ) {
      const value =
        selectedAITags!["Interesting section / special section"]![0]!.entity;
      highlightedText = setTagColor(value, "highlight-blue", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract.Elderly)) {
      const value = selectedAITags?.Elderly[0]?.entity;
      highlightedText = setTagColor(value, "elderly-text", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract.Pediatric)) {
      const value = selectedAITags?.Pediatric[0]?.entity;
      highlightedText = setTagColor(value, "pediatric-text", highlightedText);
    }

    if (selectedTags.includes(tagsAbstract["Pregnancy/fetus/foetus"])) {
      const value = selectedAITags!["Pregnancy/fetus/foetus"]![0]?.entity;
      highlightedText = setTagColor(
        value,
        "pregnancy-fetus-foetus-text",
        highlightedText
      );
    }
    if (selectedTags.includes(tagsAbstract.DesignatedEvent)) {
      const value = fetchAbstractReviewDetail?.designated_medical_events;
      highlightedText = setTagColor(
        value,
        "highlight-designated-medical-event",
        highlightedText
      );
    }

    if (
      toggleButton === tagsAbstract["Special Keywords"] &&
      selectedTags.includes(tagsAbstract["Special Keywords"])
    ) {
      const value = selectedAITags![toggleButton]?.entity;
      highlightedText = setTagColor(value, "special-keywords", highlightedText);
    }

    if (
      toggleButton === tagsAbstract["Branding"] ||
      selectedTags.includes(tagsAbstract["Branding"])
    ) {
      const value = selectedAITags!.Branding![0]!.entity;
      highlightedText = setTagColor(
        value,
        "highlight-branding",
        highlightedText
      );
    }
    if (
      toggleButton === tagsAbstract["Diseases"] &&
      selectedTags.includes(tagsAbstract["Diseases"])
    ) {
      const value = selectedAITags![toggleButton]?.entity;
      highlightedText = setTagColor(
        value,
        "highlight-diseases",
        highlightedText
      );
    }

    if (
      toggleButton === tagsAbstract["Multiple Patients"] &&
      selectedTags.includes(tagsAbstract["Multiple Patients"])
    ) {
      const value = selectedAITags![toggleButton]!.entity;
      highlightedText = setTagColor(
        value,
        "multiple-patients-text",
        highlightedText
      );
    }

    if (
      toggleButton === tagsAbstract["Patient population"] ||
      selectedTags.includes(tagsAbstract["Patient population"])
    ) {
      const value = selectedAITags!["Patient population"]![0]?.entity;
      highlightedText = setTagColor(
        value,
        "highlight-patient-population-text",
        highlightedText
      );
    }
    setHighlightedContent(highlightedText);
  };

  useEffect(() => {
    if (tagEntity === true) {
      highlightWords();
    } else {
      setHighlightedContent(abstract);
    }
  }, [tagEntity, abstract, toggleButton, selectedTags]);

  const getDetails = async (pmid: string) => {
    setLoading(true);
    const data = await dispatch(AbstractReviewMonitorDetailAsync(pmid));
    if (AbstractReviewMonitorDetailAsync.fulfilled.match(data)) {
      setFetchAbstractReviewDetail(data.payload);
    } else {
      setFetchAbstractReviewDetail(null);
    }
    setLoading(false);
  };

  /**
   * Sets the HTML color highlighting for specified entities within the given text.
   * @param value Array of entities to highlight
   * @param color CSS class for the highlighting
   * @param highlightedText Original text to apply highlighting to
   * @returns Text with specified entities highlighted in HTML
   */
  const setTagColor = (value: any, color: string, highlightedText: string) => {
    let modifiedText = highlightedText; // Create a copy to modify

    value?.forEach((entity: any) => {
      const highlightedTextHTML = `<span class=${color}>${entity}</span>`;
      // Escape special characters in the entity
      const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      modifiedText = modifiedText?.replace(
        new RegExp(escapedEntity, "gi"),
        highlightedTextHTML
      );
    });
    return modifiedText;
  };

  const handleFileUpload = async (file: React.SetStateAction<File | null>) => {
    setSelectedFile(file);
    setIsUploading(true);
    uploadFile(file);
    setIsUploading(false);
  };

  const uploadFile = (file: any) => {
    // setProcessing(true);
  };

  const handleProcessing = async () => {
    try {
      setIsLoading(true);
      if (formValues.selectedReview !== "Unencrypted Document") {
        if (password === "") {
          Toast(systemMessage.PasswordRequired, { type: "error" });
          return;
        }
      }
      setProcessing(true);
      const payload = {
        id: fetchAbstractReviewDetail?.search_result_id,
        password: password,
        file: selectedFile,
        date: format(selectedDate!, "yyyy-MM-dd") as unknown as Date,
      };
      const response = await dispatch(FullTextRequiredAsync(payload));
      if (FullTextRequiredAsync.fulfilled.match(response)) {
        Toast(systemMessage.FileUploadSuccessfully, { type: "success" });
        setIsLoading(false);
        isSuccess(response.payload.data.status);
      } else {
        setIsLoading(false);
        Toast("Process failed", { type: "error" });
      }
    } catch (error) {
      setIsLoading(false);
      Toast(`An error occurred during processing`, { type: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleCommentChange = (e: { target: { value: string } }) => {
    setFormValues({
      ...formValues,
      comment: e.target.value,
    });
  };
  const handleCaseNo = (e: { target: { value: string } }) => {
    setFormValues({
      ...formValues,
      case_id: e.target.value,
    });
  };

  const handleProcurementFullTextClose = () => {
    setIsOpenProcurementFullTextBox(false);
  };
  const handleSubmitFullTextProcurement = async (data: any) => {
    try {
      setIsLoading(true);

      const payload: FullTextProcurementPayload = {
        emails: data?.tags,
        merge_fields: [
          { ArticleId: data?.article_id },
          { DOI: data?.doi },
          { Title: data?.title },
        ],
        message: `Request for ${data?.actionType} purpose. ${data?.message}`,
      };

      const res = await dispatch(ProcuremetAbstractSendMailAsync(payload));
      if (ProcuremetAbstractSendMailAsync.fulfilled.match(res)) {
        setIsLoading(false);
        if (res.payload.status === 200) {
          Toast(systemMessage.SendMailSuccess, { type: "success" });
        } else {
          setIsLoading(false);
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      console.error("Error occurred during sending frrdback:", error);
      setIsLoading(false);
    }
  };

  const handleE2bR2Open = () => {
    setIsOpenE2bR2(true);
  };

  const handleE2bR2Close = () => {
    setIsOpenE2bR2(false);
  };

  const handleTabClick = (tabName: React.SetStateAction<string>) => {
    setActiveTab(tabName);
  };

  const handleSourceCheckboxChange = (e: { target: { name: string } }) => {
    const { name } = e.target;

    setSourceCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
  };

  const toggleTag = (tag: tag) => {
    if (
      keys.includes(tag) ||
      tag === "Interesting section / special section" ||
      tag === "Designated Medical Event"
    ) {
      if (selectedTags.includes(tag)) {
        setToggleButton("");
        setSelectedTags(selectedTags.filter((t) => t !== tag));
      } else {
        setToggleButton(tag);
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const isTagSelected = (tag: tag) => selectedTags.includes(tag);

  const handleCategoriesChange = (newValue: any) => {
    setFormValues({
      ...formValues,
      selectedCategories: newValue,
    });
  };

  const handleClassificationChange = (newValue: any) => {
    setFormValues({
      ...formValues,
      selectedClassification: newValue,
    });
  };

  const handleLink = async () => {
    setIsLoading(true);
    if (fetchAbstractReviewDetail?.search_result_id) {
      await dispatch(
        PreviewURlAsync(fetchAbstractReviewDetail.search_result_id)
      );
    }
    router.push(
      `${CONSTANTS.ROUTING_PATHS.PDFReader}/${monitor_id}/${pmid}/${fetchAbstractReviewDetail?.search_result_id}`
    );
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (fetchAbstractReviewDetail?.status === "Unassigned") {
      Toast(systemMessage.Marked_as_unassigned, { type: "error" });
      return true;
    }

    if (fetchAbstractReviewDetail?.status === "Completed") {
      Toast(systemMessage.Review_Already_Submitted, { type: "error" });
      return true;
    }
    const formValuesData = formValues;
    try {
      let validity = true;
      if (!formValuesData.comment) {
        const message = systemMessage.required.replace("#field#", "comment");
        Toast(message, { type: "error" });
        validity = false;
      }
      if (!formValuesData.selectedReview) {
        Toast(systemMessage.required.replace("#field#", "review"), {
          type: "error",
        });
        validity = false;
      }

      let payload: any = {
        expert_review_ids: [pmid],
        decision: formValuesData.selectedReview,
        is_aggregate_reporting: sourceCheckboxes["Aggregate / PSUR reporting"]
          ? sourceCheckboxes["Aggregate / PSUR reporting"]
          : false,
        is_safety_signal: sourceCheckboxes["Signal Reporting"]
          ? sourceCheckboxes["Signal Reporting"]
          : false,
        is_serious_event: sourceCheckboxes["Article of Interest"]
          ? sourceCheckboxes["Article of Interest"]
          : false,
        comments: formValuesData.comment,
        case_id: formValuesData.case_id || null,
      };

      if (formValuesData.selectedCategories) {
        payload.categories = formValuesData.selectedCategories.map(
          (category) => category.value
        );
      }

      if (formValuesData.selectedClassification) {
        payload.classifications = formValuesData.selectedClassification.map(
          (classification) => classification.value
        );
      }

      if (validity) {
        const response = await dispatch(
          AbstractReviewMonitorReviewAsync(payload)
        );
        if (AbstractReviewMonitorReviewAsync.fulfilled.match(response)) {
          Toast(systemMessage.review_successfully, { type: "success" });
          router.push(
            `${CONSTANTS.ROUTING_PATHS.AbstractReview2}/${monitor_id}`
          );
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const onRemove = () => {
    setSelectedFile(null);
    setPassword("");
    setShowPasswordInput(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setProcessing(false);
  };
  const handleResubmit = () => {
    setShowResubmitForm(!showResubmitForm);

    // Clear the form values when closing the form
    if (showResubmitForm) {
      setFormValues({
        ...formValues,
        selectedReview: "",
      });
      setPassword("");
      setSelectedFile(null);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const tabContents = {
    Details: (
      <Details
        detailsData={AbstractDetails}
        monitor_id={monitor_id}
        label={"Abstract"}
      />
    ),
    "AI-ML Model Results": <AIMLModal ai_tags={abstractReviewDetail.ai_tags} />,
    "Full Text Attachment": (
      <>
        {" "}
        <div className="flex items-center mt-4 ml-3">
          <div>Request: -</div>
          <div
            className="active ml-3 bg-blue w-fit p-2 text-white cursor-pointer"
            onClick={() => setIsOpenProcurementFullTextBox(true)}
          >
            Full Text Procurement/Translation
          </div>
        </div>
        {previewURL.status === 400 ? (
          <>
            <div className="ml-2 mt-5 flex">
              <div className="flex mt-2 text-14 cursor-pointer w-[230px]">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date) => handleDateChange(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Date received"
                  className="w-full relative text-14 h-4 rounded-md"
                  maxDate={new Date()}
                />
                <Image
                  className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                  alt=""
                  src="/assets/icons/calendarday-1.svg"
                  width={25}
                  height={25}
                />
              </div>
              <div className="mt-2 ml-1">
                <select
                  className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) => {
                    setFormValues({
                      ...formValues,
                      selectedReview: e.target.value,
                    });
                    setShowPasswordInput(
                      e.target.value === "Encrypted Document"
                    );
                  }}
                  value={formValues.selectedReview}
                >
                  <option>Select Option</option>
                  {FullTextAttachmentDocumentType.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div>
                  {showPasswordInput && (
                    <div className="mt-2">
                      <input
                        type="password"
                        placeholder="Enter Passcode"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block mb-2 text-14 cursor-pointer w-[85%] px-4 py-2 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="ml-2 mt-2 text-14 cursor-pointer">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="h-9 rounded-lg"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];

                      if (file) {
                        setSelectedFile(file);
                        handleFileUpload(file);
                      }
                    }}
                  />
                </div>
                {selectedFile && (
                  <div className="mt-1">
                    <div className="flex">
                      <button
                        className="ml-2 mt-2 font-Archivo text-14 cursor-pointer add-button-font py-2 px-8 bg-yellow text-white rounded-md"
                        onClick={handleProcessing}
                        disabled={processing}
                      >
                        {processing ? "Processing" : "Process"}
                      </button>
                      {success === "success" && (
                        <div
                          className="ml-3 mt-4 cursor-pointer"
                          onClick={handleLink}
                        >
                          <Image
                            alt="download"
                            src="/assets/icons/linkicon.png"
                            width={20}
                            height={20}
                            title="preview"
                          />
                        </div>
                      )}
                      <div
                        className="ml-4 mt-4 flex cursor-pointer"
                        onClick={onRemove}
                      >
                        <Image
                          src="/assets/icons/Vector.svg"
                          alt="close"
                          className="w-3 mt-1"
                          width={10}
                          height={10}
                        />
                        <div className="ml-2">Remove</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-2 mt-2">
              Note: Only support valid PDF files that are under 15MB in size and
              have a maximum of 50 pages
            </div>
          </>
        ) : (
          <>
            <div className="flex">
              <div className="mt-3 ml-4">
                Date received: {previewURL.processed_on}
              </div>
              <div className="ml-3 mt-2 cursor-pointer" onClick={handleLink}>
                <Image
                  alt="download"
                  src="/assets/icons/linkicon.png"
                  width={20}
                  height={20}
                  title="preview"
                />
              </div>
            </div>
            <div className="ml-3 mt-2 cursor-pointer" onClick={handleResubmit}>
              {showResubmitForm ? (
                <Image
                  src="/assets/icons/Vector.svg"
                  alt="close"
                  className="w-3 mt-1 "
                  width={10}
                  height={10}
                />
              ) : (
                <div className="active bg-blue w-fit p-2 text-white">
                  Resubmit
                </div>
              )}
            </div>

            {showResubmitForm && (
              <>
                <div className="ml-2 mt-2 flex">
                  <div className="flex mt-2 text-14 cursor-pointer w-[230px]">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date) => handleDateChange(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Date received"
                      className="w-full relative text-14 h-4 rounded-md"
                      maxDate={new Date()}
                    />
                    <Image
                      className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                      alt=""
                      src="/assets/icons/calendarday-1.svg"
                      width={25}
                      height={25}
                    />
                  </div>
                  <div className="mt-2 ml-1">
                    <select
                      className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                      onChange={(e) => {
                        setFormValues({
                          ...formValues,
                          selectedReview: e.target.value,
                        });
                        setShowPasswordInput(
                          e.target.value === "Encrypted Document"
                        );
                      }}
                      value={formValues.selectedReview}
                    >
                      <option>Select Option</option>
                      {FullTextAttachmentDocumentType.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <div>
                      {showPasswordInput && (
                        <div className="mt-2">
                          <input
                            type="password"
                            placeholder="Enter Passcode"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block mb-2 text-14 cursor-pointer w-[85%] px-4 py-2 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="ml-2 mt-2 text-14 cursor-pointer">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="h-9 rounded-lg"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];

                          if (file) {
                            setSelectedFile(file);
                            handleFileUpload(file);
                          }
                        }}
                      />
                    </div>
                    {selectedFile && (
                      <div className="mt-1">
                        <div className="flex">
                          <button
                            className="ml-2 mt-2 font-Archivo text-14 cursor-pointer add-button-font py-2 px-8 bg-yellow text-white rounded-md"
                            onClick={handleProcessing}
                            disabled={processing}
                          >
                            {processing ? "Processing" : "Process"}
                          </button>
                          {success === "success" && (
                            <div
                              className="ml-3 mt-4 cursor-pointer"
                              onClick={handleLink}
                            >
                              <Image
                                alt="download"
                                src="/assets/icons/linkicon.png"
                                width={20}
                                height={20}
                                title="preview"
                              />
                            </div>
                          )}
                          <div
                            className="ml-4 mt-4 flex cursor-pointer"
                            onClick={onRemove}
                          >
                            <Image
                              src="/assets/icons/Vector.svg"
                              alt="close"
                              className="w-3 mt-1"
                              width={10}
                              height={10}
                            />
                            <div className="ml-2">Remove</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-2 mt-2">
                  Note: Only support valid PDF files that are under 15MB in size
                  and have a maximum of 50 pages
                </div>
              </>
            )}
          </>
        )}
      </>
    ),
    E2BR3: "",
  };

  const handleCancel = () => {
    setFeedback(false);
  };

  const handleShowTags = () => {
    setTagEntity(true);
  };

  const handelMeSHtermsOpen = () => {
    setOpenMeSHterms(true);
  };

  function handleMeSHtermsClose() {
    setOpenMeSHterms(false);
  }

  let mergedDetails = { ...fetchAbstractReviewDetail, ...abstractDetail };
  let selectedData = [mergedDetails];

  // Extract AI tags

  const aiTagsSet = new Set<string>();
  selectedData.forEach((item) => {
    const aiTags = item.ai_tags;
    if (aiTags) {
      Object.keys(aiTags).forEach((tag) => aiTagsSet.add(tag));
    }
  });
  const aiTagsHeader = Array.from(aiTagsSet);

  const headers = [
    "Citation Db",
    "Assignee",
    "Review Type",
    "Status",
    "Expert Decision",
    "Aggregate Reporting",
    "Safety Signal",
    "Article of Interest",
    "Categories",
    "Classifications",
    "Comments",
    "Search Result Status",
    "Monitor Status",
    "Active",
    "Country",

    "Ai decision",
    // "Confidence Score",
    "Reason",
    "Causality Decision",
    // "Causality Confidence Score",
    "Causality Reason",
    "Designated Medical Events",
    "Created By",
    "Date Created",
    "Modified By",
    "Modified On",
    "Abstract",
    "Affiliation",
    "Author",
    "DOI",
    "Filter Type",
    "Keywords",
    "language",
    "Published On",
    "Publisher",
    "Updated On",
    "Patient",
    "Suspected",
    "Medications",
    "Diagnosis /Diagnostic Procedure",
    "Pediatric",
    "Special Keywords",
  ];
  const tableBodyKeys = [
    "filter_type",
    "assignee",
    "review_type",
    "status",
    "expert_decision",
    "is_aggregate_reporting",
    "is_safety_signal",
    "is_serious_event",
    "categories",
    "classifications",
    "comments",
    "search_result_status",
    "monitor_status",
    "is_active",
    "country",

    "ai_decision",
    // "confidence_score",
    "reason",
    "causality_decision",
    // "causality_confidence_score",
    "causality_reason",
    "designated_medical_events",
    "created_by",
    "created_on",
    "modified_by",
    "modified_on",
    "abstract",
    "affiliation",
    "author",
    "doi",
    "filter_type",
    "keywords",
    "language",
    "published_on",
    "publisher",
    "updated_on",
    ...aiTagsHeader.map((tag) => `ai_tags.${tag}`),
  ];

  /**
   * Recursively flattens a nested value into a string representation.
   * Arrays are flattened into comma-separated values.
   * Objects are flattened into key-value pairs joined by commas.
   * Null or undefined values are represented as '-'.
   * @param value The value to flatten
   * @returns A string representation of the flattened value
   */
  const flattenValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.map(flattenValue).join(", ");
    } else if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${flattenValue(val)}`)
        .join(", ");
    } else {
      return value ? value.toString() : "-";
    }
  };

  const processData = (items: any) => {
    return items.map((item: any) => {
      const country = item?.country || "-";
      const assignee = item?.assignee || "-";
      const status = item?.status || "-";
      const modifiedBy = item?.modified_by || "-";
      const aiTags = item?.ai_tags || {};

      const aiTagValues: { [key: string]: string } = {};
      aiTagsHeader.forEach((tag: string) => {
        aiTagValues[`ai_tags.${tag}`] = flattenValue(aiTags[tag]);
      });

      return {
        title: item?.title,

        assignee: assignee,
        review_type: item?.review_type,
        status: status,
        expert_decision: item?.expert_decision || "-",
        is_aggregate_reporting: item?.is_aggregate_reporting || "-",
        is_safety_signal: item?.is_safety_signal || "-",
        is_serious_event: item?.is_serious_event || "-",
        categories: item?.categories || "-",
        classifications: item?.classifications || "-",
        comments: item?.comments || "-",
        search_result_status: item?.search_result_status || "-",
        monitor_status: item?.monitor_status || "-",
        is_active: item?.is_active || "-",
        country: country,
        article_id: item?.article_id || "",
        ai_decision: item?.ai_decision,
        confidence_score: item.confidence_score,
        reason: item?.reason,
        causality_decision: item?.causality_decision,
        causality_confidence_score: item.causality_confidence_score,
        causality_reason: item?.causality_reason,
        designated_medical_events: item?.designated_medical_events || "-",
        created_by: item?.created_by || "-",
        created_on: item?.created_on || "-",
        modified_by: modifiedBy || "-",
        modified_on: item?.modified_on || "-",
        abstract: item?.abstract || "-",
        affiliation: item?.affiliation || "-",
        author: item?.author || "-",
        doi: item?.doi || "-",
        filter_type: item?.filter_type,
        keywords: keywords || "-",
        language: item?.language || "-",
        publisher: item?.publisher || "-",
        published_on: item?.published_on || "-",
        updated_on: item?.updated_on || "-",
        ...aiTagValues,
      };
    });
  };

  const data = processData(selectedData);
  const refreshPage = () => {
    setIsLoading(true);

    setTimeout(() => {
      setGetArticleData(getArticleDetails);
      setIsLoading(false);
    }, 4000);
  };
  const handleSubmitFeedback = async (data: any) => {
    try {
      setIsLoading(true);
      const payload = {
        feedback_type: "QC review required ",
        send_mail: true,
        feedback: {
          message: `Here is the qc review for Article id ${data?.article_id}  :   ${data?.comment}`,
          subject: `QC review required for ${data?.article_id}`,
          article_id: data?.article_id,
          to: data?.tags,
        },
      };

      const res = await dispatch(ReviewQcFeedbackAsync(payload));
      if (ReviewQcFeedbackAsync.fulfilled.match(res)) {
        setIsLoading(false);
        if (res.payload.status === 200) {
          Toast(systemMessage.SendMailSuccess, { type: "success" });
        } else {
          setIsLoading(false);
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      console.error("Error occurred during sending email:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!fetchAbstractReviewDetail && abstractStatus !== STATUS.fulfilled ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <>
          <div className="absolute top-[20px] flex -mr-2">
            <div>
              <div className="flex ml-2 mt-3 items-center">
                <Link
                  className="no-underline "
                  href={`${CONSTANTS.ROUTING_PATHS.AbstractReview2}/${monitor_id}`}
                  onClick={() => {
                    setFetchAbstractReviewDetail(null);
                    setAbstract("");
                    setKeywords("");
                  }}
                >
                  <div className="absolute w-[1.1rem]">
                    <Image
                      className="absolute mt-1 w-[100%]"
                      width={12}
                      height={12}
                      alt=""
                      src="/assets/icons/left-arrow.png"
                    />
                  </div>
                  <div className="left-[25px] text-black ml-8 top-[2%] capitalize">
                    <span className="no-underline text-14">Back</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-[500px] lg:w-[400px] xl:w-[700px] h-[40px] ml-12 bg-white header-box-shadow">
              <div className="flex flex-wrap justify-between">
                <div className="cursor-pointer">
                  <Image
                    src="/assets/icons/Group34 (1).png"
                    width={50}
                    height={50}
                    alt="left"
                    className={`w-6 mt-2 ml-2 h-6 ${
                      currentIndex === 0 ? "disabled-arrow" : ""
                    }`}
                    onClick={handleClickLeft}
                    aria-disabled={currentIndex === 0}
                  />
                </div>
                <div className="flex flex-wrap">
                  <p className="item-center text-14">Article Id: {articleId}</p>
                </div>
                <div className="float-right cursor-pointer">
                  <Image
                    src="/assets/icons/Group34 (2).png"
                    alt="left"
                    width={50}
                    height={50}
                    className={`right-0 mt-2 mr-2 w-6 h-6 ${
                      currentIndex + 1 === Data?.length ? "disabled-arrow" : ""
                    }`}
                    onClick={handleClickRight}
                    aria-disabled={currentIndex === Data?.length}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex mb-2 ">
            <div className="w-full abstract-box-style bg-gray-900 p-4 ">
              <div className="flex justify-end space-x-4">
                <div onClick={refreshPage} className="cursor-pointer">
                  <Image
                    src="/assets/icons/refresh.svg"
                    width={17}
                    height={17}
                    alt="refresh icon"
                    className=""
                    title="Refresh"
                  />
                </div>
                <div className="-mt-2">
                  <ExportDropdown
                    mandatoryHeaders={["Id", "Article Id"]}
                    mandatoryBodyKeys={["article_id", "title"]}
                    tableBodyKeys={tableBodyKeys}
                    data={data}
                    headers={headers}
                    fileNamePrefix="Article data"
                    fileSavedName={`${
                      Utils.getUserData()?.user_name
                    }_ArticleData_${Utils.getCurrentDateAndTime()}`}
                    disable={false}
                    searchRow={undefined}
                    startRow={undefined}
                    endRow={undefined}
                  />
                  <>
                    <div className="absolute cursor-pointer top-0 ml-2">
                      <Image
                        src="/assets/icons/download-white.svg"
                        alt="download icon"
                        width={15}
                        height={15}
                        className={`left-0 ml-2  mt-4 `}
                      />
                    </div>
                  </>
                </div>
                <div>
                  <div>
                    <Image
                      alt="email"
                      src="/assets/icons/noun-email-6146813.svg"
                      width={25}
                      onClick={() => setQcEmail(true)}
                      height={25}
                      title="Email QC Review"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div>
                  <div className="flex">
                    <span className="text-14 text-black font-bold ml-2 mt-1">
                      Title:
                    </span>
                    <span className="text-14 mx-2  text-dimgray capitalize leading-relaxed">
                      {title}
                    </span>
                    {fetchedInQueue && (
                      <div className="px-6 mb-2 text-14 py-2 rounded-2xl text-white status-style">
                        {fetchedInQueue?.Status}
                      </div>
                    )}
                  </div>
                  <span className="text-14 text-black font-bold ml-2 mt-2">
                    Publication types:{" "}
                    <span className="text-14 text-dimgray font-medium capitalize leading-relaxed">
                      {fetchAbstractReviewDetail?.publication_types ?? "-"}
                    </span>
                  </span>
                  <div className="flex ">
                    <div className="flex mt-2">
                      {summaryTag?.map((tag: string, tagIndex: number) => (
                        <div
                          key={tagIndex}
                          className={`inline-block text-14 ${
                            tagIndex > 0 ? "ml-2" : ""
                          } ${
                            tag === SummaryTags["PatientIdentified"]
                              ? "patient-identified-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag ===
                                SummaryTags["Suspected Adverse Event(AE)"]
                              ? "suspected-adverse-style auto-width text-center cursor-pointer border-violet-900 px-4 py-2"
                              : tag === SummaryTags["SuspectedCase"]
                              ? "suspected-case-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag === SummaryTags["Animal/In-Vitro"]
                              ? "animal-case-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag === SummaryTags["Pregnancy/fetus/foetus"]
                              ? "pregnancy-case-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag === SummaryTags["Elderly"]
                              ? "elderly-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag === SummaryTags["Pediatric"]
                              ? "pediatric-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag === SummaryTags["Abuse/Drug"]
                              ? "abuse-drug-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag === SummaryTags["OccupationalExposure"]
                              ? "occupational-exposure-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag === SummaryTags["OffLabel"]
                              ? "off-label-style auto-width text-center cursor-pointer px-4 py-2"
                              : tag ===
                                SummaryTags["Diagnosis /Diagnostic Procedure"]
                              ? "diagnosis-diagnostic-procedure-style auto-width text-center cursor-pointer px-4 py-2"
                              : ""
                          }`}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                    {drugOfChoiceTag && (
                      <div className="flex mt-2 ml-2">
                        {drugOfChoiceTag?.map(
                          (tag: string, tagIndex: number) => (
                            <div
                              key={tagIndex}
                              className={
                                "drug-of-choice-case-style auto-width text-center cursor-pointer px-4 py-2"
                              }
                            >
                              {tag}
                            </div>
                          )
                        )}
                      </div>
                    )}
                    {drugTag && (
                      <div className="flex mt-2 ml-2">
                        {drugTag.length > 0 && (
                          <div
                            className={
                              "drug-case-style auto-width text-center cursor-pointer px-4 py-2"
                            }
                          >
                            {drugTag}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {isLoading ? (
                  <>
                    <div className="custom-spinner mt-6">
                      <Bars color="#667acd" height={50} width={50} />
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-14 block text-black font-bold ml-2 mt-2">
                      Suspected Case:{" "}
                      <span className="text-14 text-dimgray capitalize font-medium leading-relaxed">
                        {fetchAbstractReviewDetail?.tags["Suspected Case"]?.[0]
                          ?.entity ?? "-"}
                      </span>
                    </span>
                    <div className="flex text-14 box-border-style rounded-lg mt-4">
                      <div className="w-full m-3">
                        <div className="ml-3 font-semibold flex text-black">
                          Generative AI Assisted Decision :
                          <span className="font-bold ml-2 text-violet">
                            {generativeAIDecision}
                          </span>
                        </div>

                        <div className="mt-4 ml-3 content-box">
                          Reasons: {generativeAISummary}
                        </div>
                      </div>
                      <div className="border-right-box"></div>
                      <div className="w-full m-3">
                        <div className="ml-3 font-semibold flex text-black">
                          Causality Assessment:{" "}
                          <span className="font-bold ml-2 text-violet">
                            {casualityDecision}
                          </span>
                        </div>

                        <div className="mt-4 ml-3 content-box">
                          Reasons: {casualitySummary}
                        </div>
                      </div>
                    </div>
                    <>
                      <div className="flex text-14 box-border-style rounded-lg mt-4">
                        <div className="w-full m-3">
                          <div className="ml-3 font-semibold flex text-black">
                            Aggregate / PSUR reporting:{" "}
                            <span className="font-bold ml-2 text-violet">
                              {getArticleData?.aggregate_report
                                ?.aggregate_report ?? "-"}
                            </span>
                          </div>
                          <div className="mt-4 ml-3 content-box">
                            Summary:{" "}
                            {getArticleData?.aggregate_report?.summary ?? "-"}
                          </div>
                        </div>
                        <div className="border-right-box"></div>

                        <div className="w-full m-3">
                          <div className="ml-3 font-semibold flex text-black">
                            Signal Reporting:{" "}
                            <span className="font-bold ml-2 text-violet">
                              {getArticleData?.signal_report
                                ?.signal_reporting ?? "-"}
                            </span>
                          </div>
                          <div className="mt-4 ml-3 content-box">
                            Summary:{" "}
                            {getArticleData?.signal_report?.summary ?? "-"}
                          </div>
                        </div>
                        <div className="border-right-box"></div>
                      </div>
                    </>
                  </>
                )}

                <div className="mt-2">
                  <span className="text-14 text-black font-bold ml-2 mt-4">
                    Abstract
                  </span>
                  {highlightedContent ? (
                    <div
                      className="ml-2 mt-2 text-14 content-style"
                      dangerouslySetInnerHTML={{ __html: highlightedContent }}
                    ></div>
                  ) : (
                    <span className="ml-4">-</span>
                  )}
                  <div className="ml-2 mt-4 text-14 mb-2">
                    <span className="font-bold ">Keywords: </span>
                    <span className="ml-2">
                      {keywords ? <span>{keywords}</span> : <span>-</span>}
                    </span>
                  </div>
                  <div className="mb-4 ml-2 w-max-content">
                    <div
                      className="capitalize underline cursor-pointer text-violet font-sm font-light"
                      onClick={() => {
                        handelMeSHtermsOpen();
                        setMeSHtermsArray(
                          fetchAbstractReviewDetail?.mesh_terms
                            ? fetchAbstractReviewDetail?.mesh_terms
                            : []
                        );
                      }}
                    >
                      MeSH terms
                    </div>
                  </div>
                  <div className="flex">
                    <div className="my-8 p-2">
                      <Link
                        href={`/e2br3-report/${fetchAbstractReviewDetail?.search_result_id}?article=${fetchAbstractReviewDetail?.article_id}`}
                        className="my-4 text-[14px] py-3 px-6 bg-cornflowerblue text-white no-underline rounded-md"
                        target="_blank"
                      >
                        E2BR3 Reporting
                      </Link>
                    </div>
                    <div className="my-8 p-2">
                      <Link
                        href={`/e2br2-report/${fetchAbstractReviewDetail?.search_result_id}?article=${fetchAbstractReviewDetail?.article_id}`}
                        className="my-4 text-[14px] py-3 px-6 bg-cornflowerblue text-white no-underline rounded-md"
                        target="_blank"
                      >
                        E2BR2 Reporting
                      </Link>
                    </div>
                  </div>

                <div className="ml-2">
  <div className="bg-white text-14 rounded-[15px] ml-2">
    <ul className="flex flex-wrap bg-tabColor cursor-pointer text-sm font-medium text-center border-b border-gray-200 mb-0">
      {/* Details Tab */}
      <span
        className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all 
        ${
          activeTab === "Details"
            ? "bg-white text-violet shadow-md"
            : "bg-tabColor text-buttonGray hover:bg-gray-100"
        } rounded-t-md`}
        onClick={() => handleTabClick("Details")}
      >
        Details
      </span>

      {/* AI-ML Model Results Tab */}
      <span
        className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all 
        ${
          activeTab === "AI-ML Model Results"
            ? "bg-white text-violet shadow-md"
            : "bg-tabColor text-buttonGray hover:bg-gray-100"
        } rounded-t-md`}
        onClick={() => handleTabClick("AI-ML Model Results")}
      >
        AI-ML Model Results
      </span>

      {/* Full Text Attachment Tab with Permission Check */}
      <span>
        <div
          className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all
          ${
            activeTab === "Full Text Attachment"
              ? "bg-white text-violet shadow-md"
              : "bg-tabColor text-buttonGray hover:bg-gray-100"
          } rounded-t-md 
          ${
            !Utils.isPermissionGranted("full_text_attachment")
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-disabled={!Utils.isPermissionGranted("full_text_attachment")}
          onClick={() =>
            Utils.isPermissionGranted("full_text_attachment")
              ? handleTabClick("Full Text Attachment")
              : undefined
          }
        >
          Full Text Attachment
        </div>
      </span>
    </ul>
  </div>
  <div className="text-14">
    {tabContents[activeTab as keyof typeof tabContents]}
  </div>
</div>

                </div>
              </div>
            </div>
            {!feedback ? (
              <div className="w-full tagging-box text-14 bg-red-900 py-4 px-4">
                {tagEntity ? (
                  <div>
                    <div className="text-14">
                      <div>
                        <p className="text-14 font-semibold ml-2 text-silvers">
                          Main entities
                        </p>
                        <div className="flex flex-wrap mb-2">
                          <div
                            className={`flex flex-wrap patient-tagging cursor-pointer px-1 py-1 ${
                              isTagSelected("Patient") ? "patient-selected" : ""
                            } ${
                              !keys.includes("Patient") ? "disable-div" : ""
                            }`}
                            onClick={() => toggleTag("Patient")}
                          >
                            Patient
                            <div
                              className={`${
                                !keys.includes("Patient")
                                  ? "disable-circle"
                                  : "bg-[#FF0000]                                                                                    ]"
                              } rounded-lg w-4 h-4`}
                            ></div>{" "}
                          </div>
                          <div
                            className={`flex flex-wrap animal-in-vitro-tagging ml-1 cursor-pointer px-1 py-1 ${
                              isTagSelected("Animal/In-Vitro")
                                ? "animal-in-vitro-selected"
                                : ""
                            } ${
                              keys.includes("Animal/In-Vitro")
                                ? ""
                                : "disable-div"
                            }`}
                            onClick={() =>
                              toggleTag(tagsAbstract["Animal/In-Vitro"])
                            }
                          >
                            Animal/In-Vitro
                            <div
                              className={`${
                                keys.includes("Animal/In-Vitro")
                                  ? "bg-[#050ADD]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>
                          </div>
                        </div>
                        <div className="flex flex-wrap mb-2">
                          <div
                            className={`flex flex-wrap interesting-events-tagging cursor-pointer px-1 py-1 ${
                              isTagSelected(
                                tagsAbstract[
                                  "Interesting events / observations"
                                ]
                              )
                                ? "interesting-events-selected"
                                : ""
                            }${
                              keys.includes(
                                tagsAbstract[
                                  "Interesting events / observations"
                                ]
                              )
                                ? ""
                                : "disable-div"
                            }`}
                            onClick={() =>
                              toggleTag(
                                tagsAbstract[
                                  "Interesting events / observations"
                                ]
                              )
                            }
                          >
                            Adverse event
                            <div
                              className={`${
                                keys.includes(
                                  tagsAbstract[
                                    "Interesting events / observations"
                                  ]
                                )
                                  ? "bg-[#800000]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>
                          </div>
                          <div
                            className={`flex flex-wrap  medications-tagging ml-1 cursor-pointer px-1 py-1 ${
                              isTagSelected("Medications")
                                ? "medications-selected"
                                : ""
                            } ${
                              keys.includes("Medications") ? "" : "disable-div"
                            }`}
                            onClick={() =>
                              toggleTag(tagsAbstract["Medications"])
                            }
                          >
                            Medications
                            <div
                              className={`${
                                keys.includes("Medications")
                                  ? "bg-[#808000]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>{" "}
                          </div>
                        </div>
                        <div className="flex flex-wrap">
                          <div
                            className={`flex flex-wrap branding-tagging cursor-pointer mb-2 px-1 py-1 ${
                              isTagSelected("Branding")
                                ? "branding-selected"
                                : ""
                            } ${
                              keys.includes("Branding") ? "" : "disable-div"
                            }`}
                            onClick={() => toggleTag("Branding")}
                          >
                            Branding
                            <div
                              className={`${
                                keys.includes("Branding")
                                  ? "bg-[#00CC00]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>{" "}
                          </div>
                          <div
                            className={`flex flex-wrap pediatric-tagging cursor-pointer mb-2 mt-1 ml-1 px-1 py-2 ${
                              isTagSelected(tagsAbstract.Pediatric)
                                ? "pediatric-selected"
                                : ""
                            } ${
                              keys.includes("Pediatric") ? "" : "disable-div"
                            }`}
                            onClick={() => toggleTag(tagsAbstract.Pediatric)}
                          >
                            Pediatric
                            <div
                              className={`${
                                keys.includes("Pediatric")
                                  ? "bg-[#CCC504]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>{" "}
                          </div>
                        </div>
                        <div className="flex flex-wrap mb-2">
                          <div
                            className={`flex flex-wrap pregnancy-fetus-foetus-tagging cursor-pointer px-1 py-1 ${
                              isTagSelected(
                                tagsAbstract["Pregnancy/fetus/foetus"]
                              )
                                ? "pregnancy-fetus-foetus-selected"
                                : ""
                            } ${
                              keys.includes("Pregnancy/fetus/foetus")
                                ? ""
                                : "disable-div"
                            }`}
                            onClick={() =>
                              toggleTag(tagsAbstract["Pregnancy/fetus/foetus"])
                            }
                          >
                            Pregnancy/fetus/foetus
                            <div
                              className={`${
                                keys.includes("Pregnancy/fetus/foetus")
                                  ? "bg-[#ed6060]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>{" "}
                          </div>
                          <div
                            className={`flex flex-wrap elderly-tagging cursor-pointer ml-1 px-1 py-1 ${
                              isTagSelected(tagsAbstract.Elderly)
                                ? "elderly-selected"
                                : ""
                            } ${keys.includes("Elderly") ? "" : "disable-div"}`}
                            onClick={() => toggleTag(tagsAbstract.Elderly)}
                          >
                            Elderly
                            <div
                              className={`${
                                keys.includes("Elderly")
                                  ? "bg-[#005A92]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>{" "}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-14 font-semibold ml-2 text-silvers">
                          Medical Event
                        </p>
                        <div className="flex flex-wrap mb-2">
                          <div
                            className={`flex mb-2 flex-wrap designated-medical-event-tagging cursor-pointer px-1 py-1 ${
                              isTagSelected(tagsAbstract.DesignatedEvent) &&
                              fetchAbstractReviewDetail?.designated_medical_events &&
                              fetchAbstractReviewDetail
                                .designated_medical_events.length > 0
                                ? "designated-medical-event-selected"
                                : ""
                            }  ${
                              keys.includes(tagsAbstract.DesignatedEvent) &&
                              fetchAbstractReviewDetail?.designated_medical_events &&
                              fetchAbstractReviewDetail
                                .designated_medical_events.length > 0
                                ? ""
                                : "disable-div"
                            }`}
                            onClick={() =>
                              toggleTag(tagsAbstract.DesignatedEvent)
                            }
                          >
                            Designated Medical Event
                            <div
                              className={`${
                                keys.includes(tagsAbstract.DesignatedEvent) &&
                                fetchAbstractReviewDetail?.designated_medical_events &&
                                fetchAbstractReviewDetail
                                  .designated_medical_events.length > 0
                                  ? "bg-[#F3AD47]"
                                  : "disable-circle"
                              } rounded-lg w-4 h-4`}
                            ></div>{" "}
                          </div>
                        </div>
                      </div>
                      <p className="text-14 font-semibold ml-2 text-silvers">
                        Additional entities{" "}
                      </p>
                    </div>

                    <div className="flex flex-wrap">
                      <div
                        className={`flex flex-wrap  diseases-tagging ml-1 cursor-pointer mb-2 px-1 py-1 ${
                          isTagSelected("Diseases") ? "diseases-selected" : ""
                        }${keys.includes("Diseases") ? "" : "disable-div"}`}
                        onClick={() => toggleTag("Diseases")}
                      >
                        Diseases
                        <div
                          className={`${
                            keys.includes("Diseases")
                              ? "bg-[#C595F5]"
                              : "disable-circle"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                      <div
                        className={`flex flex-wrap overdose-tagging cursor-pointer ml-1 mb-2 px-1 py-1 ${
                          isTagSelected(tagsAbstract["Overdose"])
                            ? "overdose-selected"
                            : ""
                        } ${keys.includes("Overdose") ? "" : "disable-div"}`}
                        onClick={() => toggleTag("Overdose")}
                      >
                        Overdose
                        <div
                          className={`${
                            keys.includes("Overdose")
                              ? "bg-[#40e0d0]"
                              : "disable-circle"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap reviewed-tagging cursor-pointer px-1 py-1 ${
                          isTagSelected(
                            tagsAbstract["Study/Review/Clinical trial"]
                          )
                            ? "reviewed-selected"
                            : ""
                        }${
                          keys.includes(
                            tagsAbstract["Study/Review/Clinical trial"]
                          )
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() =>
                          toggleTag(tagsAbstract["Study/Review/Clinical trial"])
                        }
                      >
                        Study / Review / Clinical Trial
                        <div
                          className={`${
                            !keys.includes(
                              tagsAbstract["Study/Review/Clinical trial"]
                            )
                              ? "disable-circle"
                              : "bg-[#492007]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap special-keywords-tagging cursor-pointer px-1 py-1 ${
                          isTagSelected("Special Keywords")
                            ? "special-keywords-selected"
                            : ""
                        }${
                          keys.includes("Special Keywords") ? "" : "disable-div"
                        }`}
                        onClick={() => toggleTag("Special Keywords")}
                      >
                        Special Keywords
                        <div
                          className={`${
                            !keys.includes("Special Keywords")
                              ? "disable-circle"
                              : "bg-[#950595]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap  patient-population-tagging ml-1 cursor-pointer px-1 py-1 ${
                          isTagSelected("Patient population")
                            ? "patient-population-selected"
                            : ""
                        }  ${
                          keys.includes("Patient population")
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() => toggleTag("Patient population")}
                      >
                        Patient population
                        <div
                          className={`${
                            !keys.includes("Patient population")
                              ? "disable-circle"
                              : "bg-[#23666F]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap multiple-patients-tagging cursor-pointer px-1 py-1 ${
                          isTagSelected("Multiple Patients")
                            ? "multiple-patients-selected"
                            : ""
                        }  ${
                          keys.includes("Multiple Patients")
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() => toggleTag("Multiple Patients")}
                      >
                        Multiple Patients
                        <div
                          className={`${
                            !keys.includes("Multiple Patients")
                              ? "disable-circle"
                              : "bg-[#8E859B]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                      <div
                        className={`flex flex-wrap history-tagging cursor-pointer px-1 py-1 ml-1 ${
                          isTagSelected(tagsAbstract["History"])
                            ? "history-selected"
                            : ""
                        }  ${
                          keys.includes(tagsAbstract["History"])
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() => toggleTag(tagsAbstract["History"])}
                      >
                        {tagsAbstract["History"]}
                        <div
                          className={`${
                            !keys.includes(tagsAbstract["History"])
                              ? "disable-circle"
                              : "bg-[#F541D3]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap diagnosis-diagnostic-procedure-tagging cursor-pointer px-1 py-1 ml-1 ${
                          isTagSelected(
                            tagsAbstract["Diagnosis /Diagnostic Procedure"]
                          )
                            ? "diagnosis-diagnostic-procedure-selected"
                            : ""
                        }  ${
                          keys.includes(
                            tagsAbstract["Diagnosis /Diagnostic Procedure"]
                          )
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() =>
                          toggleTag(
                            tagsAbstract["Diagnosis /Diagnostic Procedure"]
                          )
                        }
                      >
                        {tagsAbstract["Diagnosis /Diagnostic Procedure"]}
                        <div
                          className={`${
                            !keys.includes(
                              tagsAbstract["Diagnosis /Diagnostic Procedure"]
                            )
                              ? "disable-circle"
                              : "bg-[#5443CF]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap occupational-exposure-tagging cursor-pointer px-1 py-1 ml-1 ${
                          isTagSelected(
                            tagsAbstract["Occupational exposure(OC exposure)"]
                          )
                            ? "occupational-exposure-selected"
                            : ""
                        }  ${
                          keys.includes(
                            tagsAbstract["Occupational exposure(OC exposure)"]
                          )
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() =>
                          toggleTag(
                            tagsAbstract["Occupational exposure(OC exposure)"]
                          )
                        }
                      >
                        {tagsAbstract["Occupational exposure(OC exposure)"]}
                        <div
                          className={`${
                            !keys.includes(
                              tagsAbstract["Occupational exposure(OC exposure)"]
                            )
                              ? "disable-circle"
                              : "bg-[#D07C00]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap lack-of-efficacy-tagging cursor-pointer px-1 py-1 ml-1 ${
                          isTagSelected(tagsAbstract["Lack of efficacy"])
                            ? "lack-of-efficacy-selected"
                            : ""
                        }  ${
                          keys.includes(tagsAbstract["Lack of efficacy"])
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() =>
                          toggleTag(tagsAbstract["Lack of efficacy"])
                        }
                      >
                        {tagsAbstract["Lack of efficacy"]}
                        <div
                          className={`${
                            !keys.includes(tagsAbstract["Lack of efficacy"])
                              ? "disable-circle"
                              : "bg-[#000000]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                      <div
                        className={`flex flex-wrap drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 ${
                          isTagSelected(tagsAbstract["Drug interaction"])
                            ? "drug-interaction-selected"
                            : ""
                        }  ${
                          keys.includes(tagsAbstract["Drug interaction"])
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() =>
                          toggleTag(tagsAbstract["Drug interaction"])
                        }
                      >
                        {tagsAbstract["Drug interaction"]}
                        <div
                          className={`${
                            !keys.includes(tagsAbstract["Drug interaction"])
                              ? "disable-circle"
                              : "bg-[#a85d67]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 ${
                          isTagSelected(
                            tagsAbstract["Abuse/Drug misuse/drug dependence"]
                          )
                            ? "drug-interaction-selected"
                            : ""
                        }  ${
                          keys.includes(
                            tagsAbstract["Abuse/Drug misuse/drug dependence"]
                          )
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() =>
                          toggleTag(
                            tagsAbstract["Abuse/Drug misuse/drug dependence"]
                          )
                        }
                      >
                        {tagsAbstract["Abuse/Drug misuse/drug dependence"]}
                        <div
                          className={`${
                            !keys.includes(
                              tagsAbstract["Abuse/Drug misuse/drug dependence"]
                            )
                              ? "disable-circle"
                              : "bg-[#2B7FCB]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                    <div className="flex flex-wrap mb-2">
                      <div
                        className={`flex flex-wrap medication-error-tagging cursor-pointer px-1 py-1 ml-1 ${
                          isTagSelected(tagsAbstract["Medication error"])
                            ? "medication-error-selected"
                            : ""
                        }  ${
                          keys.includes(tagsAbstract["Medication error"])
                            ? ""
                            : "disable-div"
                        }`}
                        onClick={() =>
                          toggleTag(tagsAbstract["Medication error"])
                        }
                      >
                        {tagsAbstract["Medication error"]}
                        <div
                          className={`${
                            !keys.includes(tagsAbstract["Medication error"])
                              ? "disable-circle"
                              : "bg-[#BD290B]"
                          } rounded-lg w-4 h-4`}
                        ></div>{" "}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {" "}
                    <input
                      type="button"
                      value="Generate Entities"
                      className=" w-full submit-font px-2 py-3 bg-violet-600 cursor-pointer text-center font-bold justify-center text-sm text-white rounded shadow-sm font-Montserrat focus:outline-none leading-6"
                      onClick={handleShowTags}
                    />
                  </div>
                )}
                <div className="border-bottom"></div>
                <p className="text-14 font-semibold ml-2 text-silvers">
                  Expert Review
                </p>
                <div className="mt-2">
                  <select
                    className="block mb-2 text-[14px] cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        selectedReview: e.target.value,
                      })
                    }
                    value={formValues.selectedReview}
                  >
                    <option value={""}>Review Decision</option>
                    {ReviewName.map((review) => (
                      <option key={review} value={review}>
                        {review}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="review-decision-font">
                  {Object.keys(sourceCheckboxes).map((source, index) => (
                    <label className="flex text-14 items-center" key={index}>
                      <input
                        type="checkbox"
                        className="form-checkbox mt-1 m-2 border cursor-pointer uppercase border-black mr-4 text-violet bg-white-900 rounded-md"
                        name={source}
                        checked={sourceCheckboxes[source]}
                        onChange={handleSourceCheckboxChange}
                      />
                      <span className="ml-0">
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-1">
                  <CreatableSelect
                    isClearable
                    placeholder={"Categories"}
                    isDisabled={isLoading}
                    isLoading={isLoading}
                    onChange={handleCategoriesChange}
                    options={categoryOptions}
                    value={formValues.selectedCategories}
                    isMulti
                  />
                </div>
                <div className="mt-2">
                  <CreatableSelect
                    isClearable
                    isDisabled={isLoading}
                    placeholder={"Classifications"}
                    isLoading={isLoading}
                    onChange={handleClassificationChange}
                    options={classificationOptions}
                    value={formValues.selectedClassification}
                    isMulti
                  />
                </div>
                <div className="mt-2 w-full">
                  <textarea
                    required
                    className="w-[90%] rounded-md text-14 font-archivo text-black"
                    placeholder="Comments*"
                    onChange={handleCommentChange}
                    value={formValues.comment}
                  />
                </div>
                <div className="mt-2 w-full">
                  <textarea
                    required
                    className="w-[90%] rounded-md text-14 font-archivo text-black h-6"
                    placeholder="Case No."
                    onChange={handleCaseNo}
                    value={formValues.case_id}
                  />
                </div>
                <div className="mt-1">
                  <Button
                    customClasses={" w-full text-14 px-2 py-3 bg-yellow"}
                    buttonText="Submit"
                    buttonType="submit"
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full feedback-box feedback-scroll justify-between h-[700px] tagging-font bg-red-900 py-1 px-3">
                <div className="mt-96 w-full">
                  <textarea
                    className="w-[90%] h-[120px] text-14 rounded-md font-archivo text-black"
                    placeholder="Comment*"
                    onChange={handleCommentChange}
                    value={formValues.comment}
                  />
                </div>
                <div className="">
                  <div className="mt-4 bottom-[]">
                    <p
                      className="cmb-2 w-3/4 text-14 submit-font px-4 py-3 bg-blue ml-4 cursor-pointer text-center text-white rounded-md"
                      onClick={() => handleCancel()}
                    >
                      Cancel
                    </p>
                  </div>
                  <div className="mt-4 bottom-[]">
                    <Button
                      customClasses={
                        "mb-2 w-full text-14 px-4 py-3 bg-orange-500"
                      }
                      buttonText="Submit"
                      buttonType="submit"
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <Modal
        isOpen={isOpenProcurementFullTextBox}
        childElement={
          <FullTextProcurementModal
            onClose={handleProcurementFullTextClose}
            onSubmit={handleSubmitFullTextProcurement}
            article_id={articleId}
            doi={doi}
            title={title}
          />
        }
      />

      <Modal
        isOpen={qcEmail}
        childElement={
          <QcEmailModal
            onClose={() => setQcEmail(false)}
            onSubmit={handleSubmitFeedback}
            article_id={articleId}
          />
        }
      />

      <Modal
        isOpen={isOpenE2bR2}
        childElement={
          <E2br2
            abstract={abstract}
            selectedAITags={selectedAITags}
            selectedTags={selectedTags}
            isOpen={false}
            title={title}
            articleId={articleId}
            abstractReviewDetail={abstractReviewDetail}
            detailsData={AbstractDetails}
            handelClose={() => {
              handleE2bR2Close();
            }}
          />
        }
      />

      <Modal
        isOpen={openMeSHterms}
        childElement={
          <MeSHtermsModal
            items={MeSHtermsArray}
            handelClose={() => {
              handleMeSHtermsClose();
            }}
          />
        }
      />

      {isExportLoading && <LoadingSpinner text={"Downloading"} />}
    </div>
  );
};

export default AbstractReviewThirdPage;
