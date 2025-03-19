import React, { useEffect, useState } from "react";
import { systemConfigurationAsync } from "./systemConfiguration.slice";
import { useAppDispatch } from "@/redux/store";
import LoadingSpinner from "@/common/LoadingSpinner";
import Toast from "@/common/Toast";
import { CONSTANTS, systemMessage } from "@/common/constants";
import { LocalStorage } from "../../../../utils/localstorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const SystemConfiguration = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(true);

  const items = [
    { key: "non_english", label: "Non english - Language specific" },


    { key: "schedule_research_update", label: "Schedule research update" },
    {
      key: "full_text_attachment",
      label: "Full text attachment - Process, summary and decision",
    },
    { key: "e2b_xml", label: "E2B XML" },
    { key: "email", label: "Email" },
    { key: "user_management", label: "User management" },
    { key: "system_management", label: "System management" },
    { key: "search_builder", label: "Search builder" },
    { key: "audit_log", label: "Audit log" },
    { key: "export_files", label: "Export files" },
   { key: "duplicates", label: "Duplicates" },
   { key: "aoi", label: "Article of Interest" },
  ];

  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    setCheckedItems((prevCheckedItems) =>
      event.target.checked
        ? [...prevCheckedItems, key]
        : prevCheckedItems.filter((checkedItem) => checkedItem !== key)
    );
  };

  const handleOpenEdit = () => {
    setUpdate(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const payload = {
        mapping_id: process.env.NEXT_PUBLIC_MAPPING_ID,
        configurations: checkedItems,
      };
      const res = await dispatch(systemConfigurationAsync(payload));
      if (systemConfigurationAsync.fulfilled.match(res)) {
        if (res?.payload?.status === 200) {
          Toast(systemMessage.systemConfigurationUpdate, { type: "success" });
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const systemConfiguration: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.SystemConfiguration
  );
  const systemConfigurationArray: string[] | null = systemConfiguration
    ? (JSON.parse(systemConfiguration) as string[])
    : null;

  useEffect(() => {
    setCheckedItems(systemConfigurationArray ?? []);
  }, []);

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container h-80 bg-white text-14 custom-box-shadow rounded-xl border border-gray-300">
          <h3 className="ml-4">Configuration</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4 p-4">
              {items.map((item) => (
                <div key={item.key}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      disabled={update}
                      name={item.key}
                      className={`${update ? "disabled-select" : ""} border cursor-pointer ml-4 border-black text-violet bg-white-900 rounded-md`}
                      checked={checkedItems.includes(item.key)}
                      onChange={handleCheckboxChange}
                    />
                    <div className="mx-2">{item.label}</div>
                  </label>
                </div>
              ))}
            </div>
            <div className="float-right flex mt-12 mr-4">
              <button
                disabled={update}
                type="submit"
                className={`${
                  update ? "disabled-select" : ""
                } bg-yellow rounded-md cursor-pointer text-sm font-archivo text-white px-6 py-3`}
              >
                Submit
              </button>
              <div
                className="mt-2 ml-2 cursor-pointer"
                onClick={() => handleOpenEdit()}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  color={"#F39200"}
                  size="xl"
                  title="Edit"
                />
              </div>
            </div>
          </form>
        </div>
      </section>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default SystemConfiguration;
