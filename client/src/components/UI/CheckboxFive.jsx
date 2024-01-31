import { useState } from "react";

const CheckboxFive = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <label
        htmlFor="checkboxLabelFive"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelFive"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`box border-primary mr-4 flex h-5 w-5 items-center justify-center rounded-full border ${
              isChecked && "!border-4"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-white dark:bg-transparent"></span>
          </div>
        </div>
        Checkbox Text
      </label>
    </div>
  );
};

export default CheckboxFive;
