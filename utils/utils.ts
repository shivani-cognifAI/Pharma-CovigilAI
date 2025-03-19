import { TenantData, UserData } from "@/common/helper/common.modal";
import { CONSTANTS } from "../src/common/constants";
import { LocalStorage } from "./localstorage";
import { Configuration } from "@/components/settings/systemConfiguration/systemConfiguration.model";

export class Utils {
  public static handleError = (error: string | string[]) => {
    return typeof error === "string" ? error : error;
  };
  public static getToken = () => {
    return LocalStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.TOKEN);
  };

  /**
   * Returns the current date and time formatted as DD_MM_YYYY_HH_mm_ss.
   * @returns Formatted string representing the current date and time.
   */
  public static getCurrentDateAndTime = () => {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();

    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");

    return `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
  };
  /**
   * Formats a given date object into a string in the format "DD-MM-YYYY".
   * If no date is provided, defaults to the current date.
   * @param date Optional date object to format.
   * @returns Formatted date string.
   */
  public static formatDate = (date: Date | null) => {
    if (!date) {
      date = new Date();
    }
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  public static getTrueKeys = (config: Configuration): string[] => {
    const trueKeys: string[] = [];

    for (const key in config) {
      if (config.hasOwnProperty(key) && typeof config[key as keyof Configuration] === 'boolean' && config[key as keyof Configuration] === true) {
        trueKeys.push(key);
      }
    }

    return trueKeys;
  };

   /**
   * Checks if a given permission is granted.
   * @param permission The permission to check.
   * @returns True if the permission is granted, otherwise false.
   */
   public static isPermissionGranted = (permission: string): boolean => {
    const userDataString = LocalStorage.getItem(CONSTANTS.LOCAL_STORAGE_KEYS.USERDATA);
    if (userDataString) {
      const userData: UserData = JSON.parse(userDataString);
      const email = userData.email;
      if (email === 'admin@covigilai.com') {
        return true
      }
    }
    const systemConfiguration: string | null = LocalStorage.getItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.SystemConfiguration
    );
    const systemConfigurationArray: string[] | null = systemConfiguration
      ? (JSON.parse(systemConfiguration) as string[])
      : null;
    if (!systemConfigurationArray) {
      return false;
    }
    return systemConfigurationArray.includes(permission);
  };

  public static getUserData = (): UserData | null => {
    const userDataString: string | null = LocalStorage.getItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.USERDATA
    );
    const userData: UserData | null = userDataString
      ? (JSON.parse(userDataString) as UserData)
      : null;
    return userData;
  };

  public static getTenantData = (): TenantData | null => {
    const tenantDataString: string | null = LocalStorage.getItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.TENANT_USER_ID
    );
    const tenantData: TenantData | null = tenantDataString
      ? (JSON.parse(tenantDataString) as TenantData)
      : null;
    return tenantData;
  };

  public static getFormattedXMLDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  /**
   * Scrolls the window to the top of the page smoothly.
   */
  public static scrollToTopSmooth = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
