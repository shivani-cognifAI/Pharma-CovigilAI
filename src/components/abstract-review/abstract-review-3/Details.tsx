import { IAbstractDetails, IThirdPageAbstractData } from "../abstract.model";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  AbstractReviewDataState,
  PreviewURlAsync,
} from "../abstract-review.slice";
import { CONSTANTS, STATUS, systemMessage } from "@/common/constants";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/common/LoadingSpinner";
import Modal from "@/common/modal/model";
import QcEmailModal from "./QCEmail";
import { ReviewQcFeedbackAsync } from "@/components/advanced-review/advance-review.slice";
import Toast from "@/common/Toast";

// DetailsTabContent.tsx
interface DetailsTabContentProps {
  detailsData: IAbstractDetails;
  monitor_id: string;
  label: string;
}

const DetailsTabContent: React.FC<DetailsTabContentProps> = ({
  detailsData,
  monitor_id,
  label,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toauthorMail, setToauthormail] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const router = useRouter();
  const { status, abstractReviewDetail, previewURL } = useAppSelector(
    AbstractReviewDataState
  );
  const dispatch = useAppDispatch();
  const [fetchAbstractReviewDetail, setFetchAbstractReviewDetail] =
    useState<IThirdPageAbstractData | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (status === STATUS.fulfilled && abstractReviewDetail) {
      setFetchAbstractReviewDetail(abstractReviewDetail);
    }
    setIsLoading(false);
  }, [abstractReviewDetail, status]);

  useEffect(() => {
    if (fetchAbstractReviewDetail?.search_result_id) {
      dispatch(PreviewURlAsync(fetchAbstractReviewDetail.search_result_id));
    }
  }, [fetchAbstractReviewDetail?.search_result_id]);
  const handleLink = async () => {
    setIsLoading(true);
    if (fetchAbstractReviewDetail?.search_result_id) {
      await dispatch(
        PreviewURlAsync(fetchAbstractReviewDetail.search_result_id)
      );
    }
    router.push(`${CONSTANTS.ROUTING_PATHS.PDFReaderFromTable}/${monitor_id}`);
    setIsLoading(false);
  };

const handleAuthorMail  =async (data: any) =>{
    try {
      setIsLoading(true);
      const payload = {
        feedback_type: 'QC review required ',
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
          Toast(systemMessage.SendMailSuccess, { type: 'success' });
        } else {
          setIsLoading(false);
          Toast(systemMessage.Something_Wrong, { type: 'error' });
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: 'error' });
      }
    } catch (error) {
      console.error('Error occurred during sending email:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 ml-2 flex ">
      <div>
        <div className="mb-4 w-max-content">
          <div className="text-black mb-2">Author(s)</div>
          <ul className="list-disc pl-5">
            {detailsData?.author?.split(",").map((author, index) => (
              <li key={index} className="text-dimgray">
                {author.trim()}
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <div className="text-black mb-2">Article Literature ID</div>
          <div className="text-violet">
            {detailsData.filter_type === "PubMed Search" ||
            detailsData.filter_type === "PubMed Nbib Reference Format" ||
            detailsData.filter_type === "PubMed Email Alerts File" ? (
              <Link
                legacyBehavior
                className="text-violet"
                href={`https://pubmed.ncbi.nlm.nih.gov/${detailsData?.article_id}`}
              >
                <a target="_blank">{detailsData?.article_id}</a>
              </Link>
            ) : (
              <>{detailsData?.article_id}</>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-black mb-2">Publication</div>
          <div className="text-dimgray">{detailsData?.publisher}</div>
        </div>
        {label === "Qc" && (
          <div className="mb-4">
            <div className="text-black mb-2">Processed Fulltext Link</div>
            <div className="text-dimgray">
              {previewURL.status === 400 ? (
                <>{"-"}</>
              ) : (
                <>
                  <div
                    className="ml-3 mt-2 cursor-pointer"
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="ml-8">
        <div>
          <div className="mb-4">
            <div className="text-black mb-2">Full text and DOI</div>
            {detailsData?.doi !== "None" ? (
              <Link
                legacyBehavior
                className="text-violet"
                href={`https://doi.org/${detailsData?.doi
                  ?.replace("[doi]", "")
                  .replace(/\s/g, "")}`}
              >
                <a target="_blank">
                  {detailsData?.doi?.replace("[doi]", "").replace(/\s/g, "")}
                </a>
              </Link>
            ) : (
              <span>{detailsData?.doi} </span>
            )}
          </div>
          <div className="mb-4">
            <div className="text-black mb-2">Article Published Country</div>
            <div className="text-dimgray">{detailsData?.country}</div>
          </div>
          <div className="mb-4">
            <div className="text-black mb-2">Database</div>
            <div className="text-dimgray">{detailsData?.filter_type}</div>
          </div>
          <div className="mb-4">
            <div className="text-black mb-2">Published on</div>
            <div className="text-violet">{detailsData?.published_on}</div>
          </div>
          <div className="mb-4">
            <div className="flex">
              <div className="text-black mb-2">Affiliation</div>
              <div className="ml-5 -mt-1 cursor-pointer">
                <div>
                  <Image
                    alt="email"
                    src="/assets/icons/noun-email-6146813.svg"
                    width={25}
                    onClick={(event: any) => {
                      setToauthormail(true);
                      const rect = event.target.getBoundingClientRect();
                      setModalPosition({
                        top: rect.top + window.scrollY - 980,
                        left: rect.right + window.scrollX - 390,
                      });
                    }}
                    height={25}
                    title="send email to author / Follow up"
                  />
                </div>
              </div>
            </div>

            <div className="text-violet">{detailsData?.affiliation}</div>
          </div>
        </div>
      </div>
      <div></div>
      {toauthorMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="relative z-50 transform  p-4"
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <QcEmailModal
              onClose={() => setToauthormail(false)}
              onSubmit={handleAuthorMail}
              article_id={detailsData?.article_id}
            />
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default DetailsTabContent;
