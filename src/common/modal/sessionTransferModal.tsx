import React from "react";
import Image from "next/image";
import { CONSTANTS } from "../constants";

interface ISessionTransfer {
  isOpen: boolean;
  onClose: () => void;
  onSessionTransfer: () => void;
}

const SessionTransferModal: React.FC<ISessionTransfer> = ({ onClose, onSessionTransfer }) => {
  return (
    <div>
      <div className="sessionTransfer-modal p-4">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute cursor-pointer right-4 top-4 w-3"
          onClick={onClose}
          width={10}
          height={10}
        />
        <div>
        <div className="text-14 text-black">Session Transfer Confirmation</div>
          <div className="border-bottom mt-3"></div>
          <div className="text-14 text-black mt-4">
            {CONSTANTS.session_transfer_message_1}
          </div>
          <div className="text-14 text-black mt-1">
            {CONSTANTS.session_transfer_message_2}
          </div>
          <div className="flex mt-4 float-right mb-2">
            <button
              className="px-4 py-2 border-none bg-violet text-white rounded-md cursor-pointer"
              onClick={onSessionTransfer}
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

export default SessionTransferModal;
