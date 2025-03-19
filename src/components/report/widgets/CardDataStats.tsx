import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";

interface CardDataStatsProps {
  title: string;
  total: number;
  icon: IconProp;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
}) => {
  /**
 * Determines and returns a CSS class based on the provided title.
 * @param title The title string to determine the CSS class for.
 * @returns The corresponding CSS class name.
 */
  const getColorClass = (title: string) => {
    if (title === "Abstract Screened") return "abstract-screened font-bold mt-6";
    if (title === "Valid ICSR - Generative AI") return "text-green-500";
    if (title === "Invalid ICSR - Generative AI") return "text-red";
    if (title === "Duplicate Identified") return "text-red";

    if(title === "XML Generated E2B R3") return "text-violet mt-6"
    return " text-violet";
  };

  const formattedTitle = title.replace(" - ", " -<br/>");
  return (
    <div className="border-right   p-2 flex flex-col justify-between h-30">
      <div className="mt-2 ml-1 items-end justify-between">
        <div>
          <span
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: formattedTitle }}
          ></span>
        </div>
      </div>
      <div className="flex h-10 w-11.5 ml-1  flex items-center justify-start  h-10  ">
        <div className={` flex  text-title-md text-5xl dark:text-white   ${getColorClass(title)}`}>
          {total}
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
