import React, { useRef, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export const CtrlInput = {
  Normal: React.forwardRef((props, ref) => (
    <NormalInput {...props} ref={ref} />
  )),
  MultiLine: React.forwardRef((props, ref) => (
    <MultiLine {...props} ref={ref} />
  )),
  Password: React.forwardRef((props, ref) => (
    <PasswordInput {...props} ref={ref} />
  )),
  File: React.forwardRef((props, ref) => <FileInput {...props} ref={ref} />),
  Select: React.forwardRef((props, ref) => (
    <SelectInput {...props} ref={ref} />
  )),
};

const NormalInput = React.forwardRef((props, ref) => {
  const { formik = {}, name, className, ...rest } = props;
  const { values, errors, touched, handleChange, handleBlur } = formik;
  return (
    <>
      {rest?.label && (
        <p style={{ fontSize: "13px", marginBottom: "5px" }}>{rest?.label}</p>
      )}
      <input
        ref={ref}
        name={name}
        value={values?.[`${name}`] ? values[`${name}`] : ""}
        onChange={(val) => {
          handleChange && handleChange(val);
        }}
        onBlur={(event) => handleBlur && handleBlur(event)}
        {...rest}
        className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ring-1 ring-border-lightgray ${className}`}
      />
      <p className="text-red-500 text-xs text-left w-full">
        {errors?.[`${name}`] && touched[`${name}`] ? errors[`${name}`] : ""}
      </p>
    </>
  );
});

const MultiLine = React.forwardRef((props, ref) => {
  const { formik = {}, name, className, ...rest } = props;
  const { values, errors, touched, handleChange, handleBlur } = formik;
  return (
    <>
      {rest?.label && (
        <p style={{ fontSize: "13px", marginBottom: "5px" }}>{rest?.label}</p>
      )}
      <textarea
        ref={ref}
        name={name}
        value={values?.[`${name}`] ? values[`${name}`] : ""}
        onChange={(val) => {
          handleChange && handleChange(val);
        }}
        onBlur={(event) => handleBlur && handleBlur(event)}
        {...rest}
        className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ring-1 ring-border-lightgray resize-none ${className}`}
      />
      <p className="text-red-500 text-xs text-left w-full">
        {errors?.[`${name}`] && touched[`${name}`] ? errors[`${name}`] : ""}
      </p>
    </>
  );
});

const PasswordInput = React.forwardRef((props, ref) => {
  const { formik, name, className, ...rest } = props;
  const { values, errors, touched, handleChange, handleBlur } = formik;
  const [viewPass, setViewPass] = useState(false);

  return (
    <>
      {rest?.label && (
        <p style={{ fontSize: "13px", marginBottom: "5px" }}>{rest?.label}</p>
      )}
      <div className="flex justify-between items-center relative">
        <input
          type={viewPass ? "text" : "password"}
          name={name}
          value={values[`${name}`] ? values[`${name}`] : ""}
          onChange={(val) => {
            handleChange(val);
          }}
          onBlur={handleBlur}
          {...rest}
          className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ring-1 ring-border-lightgray ${className}`}
        />
        {viewPass ? (
          <IoMdEyeOff
            className="absolute right-3 text-gray-500 cursor-pointer hover:text-gray-700"
            size={20}
            onClick={() => setViewPass(!viewPass)}
          />
        ) : (
          <IoMdEye
            className="absolute right-3 text-gray-500 cursor-pointer hover:text-gray-700"
            size={20}
            onClick={() => setViewPass(!viewPass)}
          />
        )}
      </div>
      <p className="text-red-500 text-xs text-left w-full">
        {errors[`${name}`] && touched[`${name}`] ? errors[`${name}`] : ""}
      </p>
    </>
  );
});

const FileInput = React.forwardRef((props, ref) => {
  const {
    formik = {},
    name,
    className,
    accept,
    handleFileChangeProp,
    multiple,
    ...rest
  } = props;
  const { setFieldValue, errors, touched, handleBlur } = formik;
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileName(multiple ? `${files.length} files selected` : files[0].name);
      setFieldValue(name, multiple ? files : files[0]);
      handleFileChangeProp && handleFileChangeProp(event);
    } else {
      setFileName("");
      setFieldValue(name, null);
    }
  };

  return (
    <>
      {rest?.label && <p className="text-xs mb-1">{rest?.label}</p>}
      <div className="flex items-center w-full">
        <input
          type="file"
          ref={fileInputRef}
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          onBlur={handleBlur}
          className="hidden"
          {...rest}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className={`flex-shrink-0 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ring-1 ring-border-lightgray ${className}`}
        >
          Choose File
        </button>
        <div className="ml-2 flex-grow min-w-0">
          <p className="text-sm truncate" title={fileName || "No file chosen"}>
            {fileName || "No file chosen"}
          </p>
        </div>
      </div>
      {errors?.[`${name}`] && touched?.[`${name}`] && (
        <p className="text-red-500 text-xs mt-1">{errors[`${name}`]}</p>
      )}
    </>
  );
});

const SelectInput = React.forwardRef((props, ref) => {
  const { formik = {}, name, className, options = [], ...rest } = props;
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <>
      {rest?.label && (
        <p style={{ fontSize: "13px", marginBottom: "5px" }}>{rest?.label}</p>
      )}
      <select
        ref={ref}
        name={name}
        value={values?.[`${name}`] ? values[`${name}`] : ""}
        onChange={(val) => {
          handleChange && handleChange(val);
        }}
        onBlur={(event) => handleBlur && handleBlur(event)}
        {...rest}
        className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ring-1 ring-border-lightgray ${className}`}
      >
        <option value="" disabled>
          {rest?.placeholder || "Select an option"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <p className="text-red-500 text-xs text-left w-full">
        {errors?.[`${name}`] && touched?.[`${name}`] ? errors[`${name}`] : ""}
      </p>
    </>
  );
});
