export class SessionStorage {
  public static setItem(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }
  public static getItem(key: string) {
    return sessionStorage.getItem(key);
  }
  public static removeItem(key: string) {
    return sessionStorage.removeItem(key);
  }
  public static clearSessionStorage() {
    return sessionStorage.clear();
  };
}
