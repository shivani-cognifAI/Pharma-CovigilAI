"use client";
import React, { useEffect, useState } from "react";
import { CONSTANTS, STATUS, tagsAbstract } from "@/common/constants";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import {
  AbstractReviewDataState,
  pdfFileDataAPIAsync,
  RegeneratefullTextReportAPIAsync,
} from "../abstract-review.slice";
import { IThirdPageAbstractData } from "../abstract.model";

import { Bars } from "react-loader-spinner";
const PDFReader = (context: { params: any }) => {
  const dispatch = useAppDispatch();
  type tag = string;
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const pmid = params?.pmid as string;
  const search_result_id = params?.search_result_id as string;
  const File = useSelector((state: AppState) => state.selectedItemData.file);
  const [selectedAITags, setSelectedAITags] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [regenerateBtnClick, setRegenerateBtnClick] = useState<boolean>(false);

  const [keys, setKeys] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<tag[]>([]);
  const { status, previewURL } = useAppSelector(AbstractReviewDataState);

  const {
    abstractReviewDetail,
    pdfFileDetils,
    RegeneratefullTextReportDetails,
  } = useAppSelector(AbstractReviewDataState);
  const [fetchAbstractReviewDetail, setFetchAbstractReviewDetail] =
    useState<IThirdPageAbstractData | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (status === STATUS.fulfilled && abstractReviewDetail) {
      setFetchAbstractReviewDetail(abstractReviewDetail);
      setIsLoading(false);
    }
  }, [abstractReviewDetail, status]);

  useEffect(() => {
    if (selectedAITags) {
      setKeys(Object.keys(selectedAITags));
      setSelectedTags(Object.keys(selectedAITags));
    }
  }, [selectedAITags]);

  useEffect(() => {
    if (search_result_id) {
      dispatch(pdfFileDataAPIAsync(search_result_id));
    }
  }, [search_result_id]);

  useEffect(() => {
    if (fetchAbstractReviewDetail !== undefined) {
      if (fetchAbstractReviewDetail) {
        setSelectedAITags(fetchAbstractReviewDetail.ai_tags);
      }
    }
  }, [fetchAbstractReviewDetail]);
  const handleRegenrate = async () => {
    setIsLoading(true);
    setRegenerateBtnClick(true);
    await dispatch(RegeneratefullTextReportAPIAsync(search_result_id));
    setIsLoading(false);
  };

  return (
    <div className="my-component relative flex justify-between">
      <div className="flex absolute items-center mt-2">
        <Link
          className="no-underline"
          href={`${CONSTANTS.ROUTING_PATHS.AbstractReview3}/${monitor_id}/${pmid}`}
        >
          <div className="absolute w-[1.1rem] top-0">
            <Image
              className="absolute w-[100%] top-[-65px]"
              width={15}
              height={15}
              alt=""
              src="/assets/icons/left-arrow.png"
            />
          </div>
          <div className="left-[25px] text-black  top-[-66px] capitalize relative">
            <span className="no-underline">Back</span>
          </div>
        </Link>
      </div>
      {/* left */}
      <div className="abstract-box-style">
        <div className="bg-gray-900 p-4">
          <iframe
            src={previewURL.file_path}
            style={{ width: "100%", height: "600px", border: "none" }}
          ></iframe>
        </div>
        {isLoading ? (
          <div className="custom-spinner">
            <Bars
              color="#667acd"
              wrapperClass="absolute bottom-[-100px]"
              height={50}
              width={50}
            />
          </div>
        ) : (
          <>
            <div className="text-14 absolute box-border-style w-fit rounded-lg mt-4 border ">
              <div className="w-auto flex m-3">
                <div className="ml-1 font-semibold flex text-black">
                  Generative AI Assisted Decision :
                  <span className="font-bold ml-2 text-violet">
                    {regenerateBtnClick
                      ? RegeneratefullTextReportDetails?.decision
                      : pdfFileDetils?.decision ?? "-"}
                  </span>
                </div>

                <div className="mx-1">|</div>
                <div className="ml-1">
                  <span className="font-semibold text-black ">Reasons :</span>
                  {regenerateBtnClick
                    ? RegeneratefullTextReportDetails?.reason
                    : pdfFileDetils?.reason ?? "-"}
                </div>

                <div className="mx-1">|</div>
                <div className="ml-1">
                  <span className="font-semibold text-black">
                    <div onClick={handleRegenrate} className="cursor-pointer">
                      <Image
                        src="/assets/icons/refresh.svg"
                        width={17}
                        height={17}
                        alt="refresh icon"
                      
                        title="Regenerate"

                      />
                    </div>
                  </span>
                </div>
              </div>
              <div className="mt-4 ml-6 mb-2 mr-2 content-box text-14">
                Summary :{" "}
                {regenerateBtnClick
                  ? RegeneratefullTextReportDetails?.summary
                  : pdfFileDetils?.summary ?? "-"}
              </div>
            </div>
          </>
        )}
      </div>
      {/* right */}
      <div className="w-full tagging-box text-14 bg-red-900 py-4 px-4">
        <div>
          <div className="text-14">
            <div>
              <p className="text-14 font-semibold ml-2 text-silvers">
                Main entities
              </p>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap patient-tagging cursor-pointer px-1 py-1 patient-selected`}
                >
                  Patient
                  <div className={`bg-[#FF0000] rounded-lg w-4 h-4`}></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap animal-in-vitro-tagging ml-1 cursor-pointer px-1 py-1 animal-in-vitro-selected`}
                >
                  Animal/In-Vitro
                  <div className={`bg-[#050ADD] rounded-lg w-4 h-4`}></div>
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap interesting-events-tagging cursor-pointer px-1 py-1 interesting-events-selected`}
                >
                  Adverse event
                  <div className={` bg-[#800000] rounded-lg w-4 h-4`}></div>
                </div>
                <div
                  className={`flex flex-wrap  medications-tagging medications-selected ml-1 cursor-pointer px-1 py-1 `}
                >
                  Medications
                  <div className={`bg-[#808000] rounded-lg w-4 h-4`}></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap">
                <div
                  className={`flex flex-wrap branding-tagging cursor-pointer mb-2 px-1 branding-selected`}
                >
                  Branding
                  <div className={`bg-[#00CC00] rounded-lg w-4 h-4`}></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap pediatric-tagging cursor-pointer mb-2 mt-1 ml-1 px-1 py-2 pediatric-selected`}
                >
                  Pediatric
                  <div className={`bg-[#CCC504] rounded-lg w-4 h-4`}></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap pregnancy-fetus-foetus-tagging cursor-pointer px-1 pregnancy-fetus-foetus-selected`}
                >
                  Pregnancy/fetus/foetus
                  <div className={`bg-[#ED6060] rounded-lg w-4 h-4`}></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap elderly-tagging cursor-pointer ml-1 px-1 py-1 elderly-selected`}
                >
                  Elderly
                  <div className={`bg-[#005A92] rounded-lg w-4 h-4`}></div>{" "}
                </div>
              </div>
            </div>
            <div>
              <p className="text-14 font-semibold ml-2 text-silvers">
                Medical Event
              </p>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex mb-2 flex-wrap designated-medical-event-tagging cursor-pointer px-1 py-1 designated-medical-event-selected

                  `}
                >
                  Designated Medical Event
                  <div
                    className={`bg-[#F3AD47]
                      
                   rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
            </div>
            <p className="text-14 font-semibold ml-2 text-silvers">
              Additional entities{" "}
            </p>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap  diagnosis-tagging ml-1 cursor-pointer px-1 py-1 diagnosis-selected
                  : ""
              } ${
                keys.includes("Diagnosis /Diagnostic Procedure")
                  ? ""
                  : "disable-div"
              }`}
            >
              Diagnosis
              <div
                className={`bg-[#9b769c]
                   rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
            <div
              className={`flex flex-wrap off-label-tagging cursor-pointer px-1 py-1 ml-1 off-label-selected
                 `}
            >
              {tagsAbstract["Off label"]}
              <div
                className={`bg-[#7A727A]
          
              rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap">
            <div
              className={`flex flex-wrap  diseases-tagging ml-1 cursor-pointer mb-2 px-1 py-1 
              diseases-selected`}
            >
              Diseases
              <div className={`bg-[#C595F5] rounded-lg w-4 h-4`}></div>{" "}
            </div>
            <div
              className={`flex flex-wrap overdose-tagging cursor-pointer ml-1 mb-2 px-1 py-1 overdose-selected`}
            >
              Overdose
              <div className={`bg-[#40e0d0] rounded-lg w-4 h-4`}></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap reviewed-tagging cursor-pointer px-1 py-1 reviewed-selected
                
              `}
            >
              Study / Review /Clinical trial
              <div
                className={`
                    bg-[#492007]
                rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap special-keywords-tagging cursor-pointer px-1 py-1 special-keywords-selected`}
            >
              Special Keywords
              <div
                className={`bg-[#950595]
            rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap  patient-population-tagging ml-1 cursor-pointer px-1 py-1 patient-population-selected
               `}
            >
              Patient population
              <div className={`bg-[#23666F] rounded-lg w-4 h-4`}></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap multiple-patients-tagging cursor-pointer px-1 py-1 multiple-patients-selected`}
            >
              Multiple Patients{" "}
              <div className={`bg-[#8E859B] rounded-lg w-4 h-4`}></div>{" "}
            </div>
            <div
              className={`flex flex-wrap history-tagging cursor-pointer px-1 py-1 ml-1 history-selected `}
            >
              {tagsAbstract["History"]}
              <div className={"bg-[#F541D3] rounded-lg w-4 h-4"}></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap diagnosis-diagnostic-procedure-tagging cursor-pointer px-1 py-1 ml-1 diagnosis-diagnostic-procedure-selected`}
            >
              {tagsAbstract["Diagnosis /Diagnostic Procedure"]}
              <div className={`bg-[#5443CF]rounded-lg w-4 h-4`}></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap occupational-exposure-tagging cursor-pointer px-1 py-1 ml-1 occupational-exposure-selected`}
            >
              {tagsAbstract["Occupational exposure(OC exposure)"]}
              <div className={`bg-[#D07C00] rounded-lg w-4 h-4`}></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap lack-of-efficacy-tagging cursor-pointer px-1 py-1 ml-1 lack-of-efficacy-selected`}
            >
              {tagsAbstract["Lack of efficacy"]}
              <div
                className={`bg-[#000000]
                rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
            <div
              className={`flex flex-wrap drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 
                  drug-interaction-selected`}
            >
              {tagsAbstract["Drug interaction"]}
              <div
                className={`
                 bg-[#a85d67]
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap abuse-drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 abuse-drug-interaction-selected

                
               `}
            >
              {tagsAbstract["Abuse/Drug misuse/drug dependence"]}
              <div className={`bg-[#2B7FCB] rounded-lg w-4 h-4`}></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap medication-error-tagging cursor-pointer px-1 py-1 ml-1 medication-error-selected`}
            >
              {" "}
              {tagsAbstract["Medication error"]}
              <div className={`bg-[#BD290B] rounded-lg w-4 h-4`}></div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
