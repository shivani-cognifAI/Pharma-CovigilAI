import Toast from "@/common/Toast";
import React, { useState } from "react";

interface QcEmailModalProps {
  article_id: string;
  onSubmit: (QcEmailData: { tags: string[]; comment: string }) => void;
  onClose: () => void;
}

const QcEmailModal: React.FC<QcEmailModalProps> = ({
  article_id,
  onSubmit,
  onClose,
}) => {
  const [email, setEmail] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [feedbackData, setFeedbackData] = useState({
    article_id: article_id,
  });


const handleEmailValidation = () => {
  if (!email.trim()) {
    setValidationMessage(""); // Clear validation message if the input is empty
    setIsValidEmail(true);
    return;
  }

  const message = isValidEmailFormat(email);
  if (!message) {
    if (!tags.includes(email)) {
      setTags((prevTags) => [...prevTags, email]);
    }
    setEmail("");
    setValidationMessage("");
    setIsValidEmail(true);
  } else {
    setValidationMessage(message);
    setIsValidEmail(false);
  }
};


  const isValidEmailFormat = (email: string): string => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    return "";
  };

  const handleSubmit = () => {
    if (tags.length === 0 || comment.length === 0) {
      Toast("Email tags and Feedback cannot be empty", { type: "error" });
      return;
    }
    onSubmit({ ...feedbackData, tags, comment });
    setTags([]);
    setComment("");
    onClose();
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };
 return (
    <div className="feedback-modal ">
<div className=" p-7">
<button className="close-button" onClick={onClose}>
        X
      </button>

      {/* Email Section */}
      <div className="email-section">
        <div className="email-row">
          <label htmlFor="email-input" className="email-label">
            Email to:
          </label>
          <input
            id="email-input"
            type="email"
            placeholder="Type email address.."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationMessage("");
              setIsValidEmail(true);
            }}
            onBlur={handleEmailValidation}
            className={`email-input ${!isValidEmail ? "error-border" : ""}`}
          />
          <button
            className="add-email-button"
            onClick={handleEmailValidation}
            disabled={!email}
          >
            Add
          </button>
        </div>
        {validationMessage && (
          <p className="validation-message">{validationMessage}</p>
        )}
      </div>

      {/* Display Tags */}
      {tags.length > 0 && (
        <div className="tags-container">
          {tags.map((tag) => (
            <div key={tag} className="tag-item">
              <span>{tag}</span>
              <button
                className="remove-tag-button"
                onClick={() => handleRemoveTag(tag)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Section */}
      <div className="feedback-section">
 <div className="email-row">
 <label htmlFor="feedback-input" className="email-label">
          Message:
        </label>
        <textarea
          id="feedback-input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type your message..."
          className="feedback-input"
        /></div>
       
      </div>

      {/* Submit Button */}
      <div className="submit-section">
        <button
          disabled={tags.length === 0 || comment.length === 0}
          className={`submit-button ${
            tags.length === 0 || comment.length === 0 ? "disabled" : ""
          }`}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div></div>
      
    </div>
  );
};

export default QcEmailModal;
