import React, { useEffect, useState } from "react";
import Sender, { IE2BR3Sender, initialSenderValues } from "./Sender";
import Receiver, { IE2BR3Receiver, initialReceiverValues } from "./Receiver";
import { LocalStorage } from "../../../../utils/localstorage";
import { CONSTANTS, STATUS, systemMessage } from "@/common/constants";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import {
  GetE2BR2DataAsync,
  generalState,
  UpdateE2BR2DataAsync,
  AddE2BR3DataAsync,
  UpdateE2BR3DataAsync,
  GetE2BR3DataAsync,
} from "../general.slice";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface ITenantData {
  tenant_id: string;
}

const E2BR3Component = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [safetyReportOnChange, setSafetyReportOnChange] =
    useState<boolean>(true);

  const [senderValue, setSenderValue] =
    useState<IE2BR3Sender>(initialSenderValues);
  const [senderValueOnChange, setSenderValueOnChange] = useState<boolean>(true);

  const [receiverValue, setReceiverValue] = useState<IE2BR3Receiver>(
    initialReceiverValues
  );
  const [receiverValueOnChange, setReceiverValueOnChange] =
    useState<boolean>(true);
  const { loading, E2BR3Data } = useAppSelector(generalState);
  const [E2BR3items, setE2BR3items] = useState<any>({});
  const [update, setUpdate] = useState<boolean>(true);

  const tenantData: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.TENANT_USER_ID
  );
  const tenant_id: ITenantData | null = tenantData
    ? (JSON.parse(tenantData) as ITenantData)
    : null;

  useEffect(() => {
    if (E2BR3items?.status === "error") {
      setUpdate(false);
    }
  }, [E2BR3items]);

  useEffect(() => {
    if (tenant_id) {
      const payload = {
        id: tenant_id?.tenant_id,
        type: "R3",
      };
      dispatch(GetE2BR3DataAsync(payload));
    }
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setE2BR3items(E2BR3Data);
    }
  }, [loading, E2BR3Data]);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setSenderValue(E2BR3items?.nodes?.sender);
      setReceiverValue(E2BR3items?.nodes?.receiver);
    }
  }, [loading, E2BR3items]);

  const handleSubmit = async () => {
    try {
      const payload = {
        tenant_id: tenant_id?.tenant_id,
        nodes: {
          sender: senderValue,
          receiver: receiverValue,
        },
        etb_type: "R3",
      };
      const response = await dispatch(AddE2BR3DataAsync(payload));
      if (AddE2BR3DataAsync.fulfilled.match(response)) {
        if (response.payload.status === 201) {
          if (tenant_id) {
            const getPayload = {
              id: tenant_id?.tenant_id,
              type: "R3",
            };
            dispatch(GetE2BR2DataAsync(getPayload));
          }
          Toast(systemMessage.E2br2AddSuccess, { type: "success" });
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      throw error;
    }
  };

  const handleOpenEdit = () => {
    setUpdate(false);
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const payload = {
        id: E2BR3items.id,
        nodes: {
          sender: senderValue,
          receiver: receiverValue,
        },
      };
      const response = await dispatch(UpdateE2BR3DataAsync(payload));
      if (UpdateE2BR3DataAsync.fulfilled.match(response)) {
        if (response.payload.status === 200) {
          Toast(systemMessage.E2br3UpdateSuccess, { type: "success" });
          setReceiverValueOnChange(true);
          setSafetyReportOnChange(true);
          setSenderValueOnChange(true);
          if (tenant_id) {
            const getPayload = {
              id: tenant_id?.tenant_id,
              type: "R3",
            };
            dispatch(GetE2BR2DataAsync(getPayload));
          }
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="bg-white custom-box-shadow scrollable-content-MyTeam w-full rounded-xl">
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <div className="mt-2 p-2">
            <div className="divide-y-2">
              <h4 className="ml-4 mt-2">Sender</h4>
              <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
              <Sender
                disabled={update}
                senderValue={senderValue}
                setSenderValueOnChange={setSenderValueOnChange}
                onChange={(value: IE2BR3Sender) => setSenderValue(value)}
              />
            </div>
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <div className="mt-2 p-2">
            <div className="divide-y-2">
              <h4 className="ml-4 mt-2">Receiver</h4>
              <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
              <Receiver
                disabled={update}
                setReceiverValueOnChange={setReceiverValueOnChange}
                receiverValue={receiverValue}
                onChange={(value: IE2BR3Receiver) => setReceiverValue(value)}
              />
            </div>
          </div>
          <div className="rounded overflow-hidden mr-6 mb-2 float-right">
            {E2BR3items?.status == "error" ? (
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-yellow cursor-pointer text-sm font-archivo text-white px-5 py-3 "
              >
                Submit
              </button>
            ) : (
              <div className="flex">
                <div>
                  <button
                    disabled={update}
                    type="submit"
                    onClick={handleUpdate}
                    className={`bg-yellow rounded-md cursor-pointer text-sm font-archivo text-white px-6 py-3 ${
                      update ? "disabled-select" : ""
                    }`}
                  >
                    Update
                  </button>
                </div>
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
            )}
          </div>
        </div>
      </section>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default E2BR3Component;
