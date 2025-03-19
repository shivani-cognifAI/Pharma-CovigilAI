import Toast from "@/common/Toast";
import React, { useState } from "react";

interface RouteBackModalProps {
  expert_review_id: string;
  search_result_id: string;
  expertdecision: string;
  comments: string;
  onSubmit: (routeBackData: {
    remarks: string;
    search_result_id: string;
    expert_review_id: string;
  }) => void;
  onClose: () => void;
}

const RouteBackModal: React.FC<RouteBackModalProps> = ({
  search_result_id,
  expertdecision,
  expert_review_id,
  comments,
  onSubmit,
  onClose,
}) => {
  const [remarks, setRemarks] = useState<string>("");
  const [routeBackData, setRouteBackData] = useState({
    search_result_id: search_result_id,
    expert_review_id: expert_review_id,
  });

  const handleSubmit = () => {
    if (remarks.length === 0) {
      Toast("Remark cannot be empty ", { type: "error" });
      return;
    }

    onSubmit({ ...routeBackData, remarks });

    setRemarks("");
    onClose();
  };

  return (
    <div className="feedback-modal">
      <button className="close-button" onClick={onClose}>
        X
      </button>

      <div className="email-section">
        <div className="mt-3">Decision: {expertdecision} </div>

        <div className="mt-3 font-archivo">Comment: {comments}</div>
      </div>

      <div className="email-section ">
        <div className="flex   mb-4 z-10 relative ">
          <div className="mt-3">Remark:</div>
          <div className="ml-6  w-100px">
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter your remark.."
              className="font-archivo comment-input"
            />
          </div>
        </div>

        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default RouteBackModal;
