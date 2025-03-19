import Toast from "@/common/Toast";
import React, { useState, useEffect } from "react";

interface FreeFullProcurementModalProps {
  article_id: string;
  doi: string;
  title: string;
  onSubmit: (freefullprocurementData: { tags: string[]; message: string; actionType: string }) => void;
  onClose: () => void;
}

const FullTextProcurementModal: React.FC<FreeFullProcurementModalProps> = ({
  article_id,
  doi,
  title,
  onSubmit,
  onClose,
}) => {
  const vendorEmails = process.env.NEXT_PUBLIC_FULLTEXT_VENDOR_EMAIL || "";
  const [email, setEmail] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [actionType, setActionType] = useState("");
  const [freefullprocurementData, setfreefullprocurementData] = useState({
    article_id: article_id,
doi:doi,
title:title,
actionType:actionType
  });

  useEffect(() => {
    // Initialize tags with vendor emails if available
    if (vendorEmails) {
      setTags(vendorEmails.split(",").map(email => email.trim()));
    }
  }, [vendorEmails]);

  const handleEmailValidation = () => {
    if (!email.trim()) {
      setValidationMessage("");
      setIsValidEmail(true);
      return;
    }

    const message = isValidEmailFormat(email);
    if (!message) {
      if (!tags.includes(email)) {
        setTags(prevTags => [...prevTags, email]);
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
    if (tags.length === 0 || message.length === 0) {
      Toast("Email tags and messages cannot be empty", { type: "error" });
      return;
    }
    onSubmit({  ...freefullprocurementData, tags, message,actionType });
    setTags([]);
    setMessage("");
    onClose();
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };
 return (
    <div className="feedback-modal p-10">
<div className="p-8"> <button className="close-button" onClick={onClose}>
        X
      </button>

      {/* Email Section */}
      <div className="email-section">
        <div className="email-row">
          <label htmlFor="procurement-input" className="email-label">
            Email to:
          </label>
          <input
            id="email-input"
            type="email"
            placeholder="Type email address.."
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setValidationMessage("");
              setIsValidEmail(true);
            }}
            onBlur={handleEmailValidation}
            className={`procurement-input ${!isValidEmail ? "error-border" : ""}`}
          />
          <button 
className="add-email-button"
 onClick={handleEmailValidation}
 disabled={!email}>
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
          {tags.map(tag => (
            <div key={tag} className="tag-item">
              <span>{tag}</span>
              <button className="remove-tag-button" onClick={() => handleRemoveTag(tag)}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message Section */}
      <div className="feedback-section">
        <div className="email-row">
          <label htmlFor="feedback-input" className="email-label">
            Message:
          </label>
          <textarea
            id="feedback-input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="feedback-input"
          />
        </div>
        <div className="email-row">
          <label htmlFor="procurement-input w-32" className="email-label">
            Purpose:
          </label>
          <select
            value={actionType}
            onChange={e => setActionType(e.target.value)}
            className="purpose-input p-1"
          >
            <option value="">Select purpose</option>
            <option value="translation">Translation</option>
            <option value="procurement">Procurement</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="submit-section">
        <button
          disabled={tags.length === 0 || message.length === 0 || !actionType}
          className={`submit-button ${tags.length === 0 || message.length === 0 || !actionType ? "disabled" : ""}`}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div></div>
     
    </div>
  );
};

export default FullTextProcurementModal;
