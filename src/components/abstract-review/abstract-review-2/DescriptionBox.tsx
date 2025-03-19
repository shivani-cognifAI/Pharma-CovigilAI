import Modal from "@/common/modal/model";
import { useState } from "react";

interface DescriptionBoxProps {
  description: string;
}

export const DescriptionBox: React.FC<DescriptionBoxProps> = ({
  description,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div
        className="text-dimgray mb-2 w-[250px] h-[60px] overflow-hidden text-ellipsis whitespace-pre-line break-words"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3, 
          WebkitBoxOrient: "vertical",
        }}
      >
        <span>Description :</span>{" "}
        {description?.length > 100
          ? description.slice(0, 100) + "..."
          : description}
      </div>

      {description?.length > 100 && (
        <button
          className="text-blue-500 text-xs underline"
          onClick={() => setIsModalOpen(true)}
        >
          Read more
        </button>
      )}
      {isModalOpen && (
        <Modal
          childElement={
            <div className="feedback-modal">
              <div className="p-4">
                <button
                  className="close-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  X
                </button>
                <h2 className="text-lg font-bold mb-4">Full Description</h2>
                <p className="text-gray-700">{description}</p>
              </div>
            </div>
          }
          isOpen={true}
        />
      )}
    </div>
  );
};
