import React, { useState } from "react";

const Form = ({
  fields = [],
  onSubmit = () => {},
  onChange = () => {},
  initialValues = {},
  submitLabel = "Enviar",
  actionsRender,
  formClassName = "",
  containerInputsClassName = "",
  buttonClassName = "",
}) => {

  const [values, setValues] = useState(() =>
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: initialValues[field.name] ?? field.defaultValue ?? "",
      }),
      {}
    )
  );

  const handleChange = (e, field) => {
    const value = field.type === "checkbox" ? e.target.checked : e.target.value;
    const newValues = { ...values, [field.name]: value };
    setValues(newValues);
    onChange(newValues, field);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form className={`${formClassName} w-full`} onSubmit={handleSubmit}>
      <div className={`${containerInputsClassName} space-y-4 overflow-y-auto`}>
        {fields.map((field, idx) => (
          <div
            key={field.name ?? idx}
            className={`flex flex-col ${field.fieldContainerClassName}`}
          >
            {field.label && (
              <label
                htmlFor={field.name}
                className={`mb-1 text-xs lg:text-sm font-semibold text-gray-900 ${field.labelClassName}`}
              >
                {field.label}
              </label>
            )}
            {field.render ? (
              field.render(field.value, handleChange)
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                className="border rounded p-2 text-xs lg:text-sm"
                value={values[field.name]}
                onChange={(e) => handleChange(e, field)}
                {...field.props}
              >
                <option value="" disabled>
                  {field.placeholder || "Seleccione una opción"}
                </option>
                {(field.options ?? []).map((opt) =>
                  typeof opt === "object" ? (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ) : (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  )
                )}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                className="border rounded p-2 text-xs lg:text-sm"
                value={values[field.name]}
                onChange={(e) => handleChange(e, field)}
                {...field.props}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                className={`border rounded p-2 text-xs lg:text-sm border-indigo-200 focus:border-indigo-500 outline-none transition ${field.inputClassName}`}
                value={values[field.name]}
                onChange={(e) => handleChange(e, field)}
                {...field.props}
              />
            )}
            {field.helperText && (
              <span className="mt-1 text-xs text-gray-500">{field.helperText}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 mt-6">
        {actionsRender && actionsRender(values)}
        <button
          type="submit"
          className={`bg-indigo-600 hover:bg-indigo-900 text-white button font-semibold focus:ring-black ${buttonClassName}`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default Form;