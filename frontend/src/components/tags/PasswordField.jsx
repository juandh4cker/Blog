import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Input from "./Input";

const PasswordField = ({
  confirm = false,
  ...props

}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full max-w-full box-border">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={confirm ? "Confirmar contraseña" : "Contraseña"}
        className="pr-10 w-full box-border"
        required
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 inset-y-0 my-auto bg-transparent opacity-50 hover:opacity-80 border-none p-0 m-0 flex items-center justify-center"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default PasswordField;
