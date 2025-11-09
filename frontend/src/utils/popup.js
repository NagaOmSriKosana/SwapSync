import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const showSuccess = (title, text = "") => {
  Swal.fire({
    icon: "success",
    title,
    text,
    showConfirmButton: false,
    timer: 2000,
    background: "#f9fbfc",
    color: "#2d5b8e",
  });
};

export const showError = (title, text = "") => {
  Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#2d5b8e",
    background: "#f9fbfc",
  });
};

export const showInfo = (title, text = "") => {
  Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonColor: "#2d5b8e",
    background: "#f9fbfc",
  });
};

export const showConfirm = async (title, text = "") => {
  const result = await Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#2d5b8e",
    cancelButtonColor: "#999",
    confirmButtonText: "Yes",
    background: "#f9fbfc",
  });
  return result.isConfirmed;
};
