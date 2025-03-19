// checkboxUtils.ts

interface ICheckboxState {
  [key: string]: boolean;
}

/**
 * Handles the change in auto checkbox state and updates individual checkboxes accordingly.
 * @param checkboxes The current state of individual checkboxes.
 * @param setCheckboxes React state setter for individual checkboxes.
 * @param setAutoCheckbox React state setter for the auto checkbox.
 * @param newState The new state value to set for all checkboxes.
 */
export const handleAutoCheckboxChange = (
  checkboxes: ICheckboxState,
  setCheckboxes: React.Dispatch<React.SetStateAction<ICheckboxState>>,
  setAutoCheckbox: React.Dispatch<React.SetStateAction<boolean>>,
  newState: boolean
) => {
  if (Object.values(checkboxes).some((value) => value === true)) {
    setAutoCheckbox(false);
    const updatedCheckboxes = Object.keys(checkboxes).reduce(
      (acc: ICheckboxState, item: string) => {
        acc[item] = false;
        return acc;
      },
      {} as ICheckboxState
    );

    setCheckboxes(updatedCheckboxes);
  } else {
    setAutoCheckbox(newState);
    const updatedCheckboxes = Object.keys(checkboxes).reduce(
      (acc: ICheckboxState, item: string) => {
        acc[item] = newState;
        return acc;
      },
      {} as ICheckboxState
    );

    setCheckboxes(updatedCheckboxes);
  }
};

/**
 * Handles the change for a specific checkbox, toggles auto checkbox state, and invokes the callback for checkbox change.
 * @param name The name of the checkbox being changed.
 * @param checked The new checked state of the checkbox.
 * @param setAutoCheckbox React state setter for the auto checkbox.
 * @param handleCheckboxChange Callback function to handle checkbox change event.
 */
export const handleOtherCheckboxChange = (
  name: string,
  checked: boolean,
  setAutoCheckbox: React.Dispatch<React.SetStateAction<boolean>>,
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void
) => {
  if (checked) {
    setAutoCheckbox(true);
  } else {
    setAutoCheckbox(false);
  }
  handleCheckboxChange({
    target: { name, checked },
  } as React.ChangeEvent<HTMLInputElement>);
};
/**
 * Handles the change event for checkboxes, updating checkboxes state and form values.
 * @param e The change event triggered by the checkbox.
 * @param checkboxes The current state of checkboxes.
 * @param setCheckboxes React state setter for checkboxes.
 * @param formValues The current form values object.
 * @param setFormValues React state setter for form values.
 * @param selectedCheckboxesKey The key representing the selected checkboxes.
 */
export const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkboxes: ICheckboxState,
    setCheckboxes: React.Dispatch<React.SetStateAction<ICheckboxState>>,
    formValues: any,
    setFormValues: React.Dispatch<React.SetStateAction<any>>,
    selectedCheckboxesKey: string
  ) => {
    const { name, checked } = e.target;
  
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  
    setFormValues((prevFormValues: { [x: string]: any; }) => ({
      ...prevFormValues,
      [selectedCheckboxesKey]: {
        ...prevFormValues[selectedCheckboxesKey],
        [name]: checked,
      },
    }));
  };
