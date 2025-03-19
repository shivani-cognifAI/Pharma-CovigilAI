import React from "react";

interface IDelete {
  label: string;
  isOpen: boolean;
  onClose: () => void;
  onSendingMail: () => void;
}

const EmailConfirmModal: React.FC<IDelete> = ({
  label,
  onClose,
  onSendingMail,
}) => {
  return (
    <div>
      <div className="delete-modal p-4">
        <div>
          <div className="text-14 text-black">Send Invitation mail </div>
          <div className="border-bottom mt-3"></div>
          <div className="text-14 text-black mt-4">
            Are you sure to send ivitation mail to {label}?
          </div>
          <div className="flex mt-4 float-right mb-2">
            <button
              className="px-4 py-2 border-none bg-violet text-white rounded-md cursor-pointer"
              onClick={onSendingMail}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 ml-2 border-none bg-violet text-white rounded-md cursor-pointer"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmModal;
