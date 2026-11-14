import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import axiosWrapper from "../utils/AxiosWrapper";
import Heading from "../components/Heading";
import DeleteConfirm from "../components/DeleteConfirm";
import CustomButton from "../components/CustomButton";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const Exam = () => {
  const [data, setData] = useState({
    name: "",
    date: "",
    semester: "",
    examType: "mid",
    timetableLink: "",
    totalMarks: "",
  });
  const [exams, setExams] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const userData = useSelector((state) => state.userData);
  const loginType = localStorage.getItem("userType");
  const [processLoading, setProcessLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getExamsHandler();
  }, []);

  const getExamsHandler = async () => {
    try {
      setDataLoading(true);
      let link = "/exam";
      if (userData.semester) {
        link = `/exam?semester=${userData.semester}`;
      }
      const response = await axiosWrapper.get(link, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setExams(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setExams([]);
        return;
      }
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching exams");
    } finally {
      setDataLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const addExamHandler = async () => {
    if (
      !data.name ||
      !data.date ||
      !data.semester ||
      !data.examType ||
      !data.totalMarks
    ) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setProcessLoading(true);
      toast.loading(isEditing ? "Updating Exam" : "Adding Exam");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      let response;
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("semester", data.semester);
      formData.append("examType", data.examType);
      formData.append("totalMarks", data.totalMarks);
      if (file) {
        formData.append("file", file);
      }
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/exam/${selectedExamId}`,
          formData,
          {
            headers: headers,
          }
        );
      } else {
        response = await axiosWrapper.post(`/exam`, formData, {
          headers: headers,
        });
      }
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        getExamsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setProcessLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      name: "",
      date: "",
      semester: "",
      examType: "mid",
      timetableLink: "",
      totalMarks: "",
    });
    setShowModal(false);
    setIsEditing(false);
    setSelectedExamId(null);
  };

  const deleteExamHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedExamId(id);
  };

  const editExamHandler = (exam) => {
    setData({
      name: exam.name,
      date: new Date(exam.date).toISOString().split("T")[0],
      semester: exam.semester,
      examType: exam.examType,
      timetableLink: exam.timetableLink,
      totalMarks: exam.totalMarks,
    });
    setSelectedExamId(exam._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Exam");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      const response = await axiosWrapper.delete(`/exam/${selectedExamId}`, {
        headers: headers,
      });
      toast.dismiss();
      if (response.data.success) {
        toast.success("Exam has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        getExamsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Exam Details" />
        {!dataLoading && loginType !== "Student" && (
          <CustomButton
            onClick={() => setShowModal(true)}
            className="!rounded-full !p-2.5 !bg-[#1A1D21] !text-white !shadow-none hover:!bg-[#16181D] active:scale-95"
          >
            <IoMdAdd className="text-2xl" />
          </CustomButton>
        )}
      </div>

      {!dataLoading ? (
        <div className="fade-up mt-8 w-full overflow-hidden rounded-2xl border border-[#E4E6EA] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          <table className="text-sm min-w-full w-full bg-transparent">
            <thead>
              <tr className="border-b border-[#EEF0F3] text-xs uppercase tracking-widest text-[#6E7178]">
                <th className="py-4 px-6 text-left font-medium">Exam Name</th>
                <th className="py-4 px-6 text-left font-medium">Date</th>
                <th className="py-4 px-6 text-left font-medium">Semester</th>
                <th className="py-4 px-6 text-left font-medium">Exam Type</th>
                <th className="py-4 px-6 text-left font-medium">
                  Total Marks
                </th>
                {loginType !== "Student" && (
                  <th className="py-4 px-6 text-center font-medium">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {exams && exams.length > 0 ? (
                exams.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#EEF0F3] hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-[#16181D]">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-[#6E7178]">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-[#6E7178]">
                      {item.semester}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
                          item.examType === "mid"
                            ? "border-[#E4E6EA] bg-white text-[#6E7178]"
                            : "border-[#FFB020]/30 bg-[#FFB020]/10 text-[#B45309]"
                        }`}
                      >
                        {item.examType === "mid" ? "Mid Term" : "End Term"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#6E7178]">
                      {item.totalMarks}
                    </td>
                    {loginType !== "Student" && (
                      <td className="py-4 px-6 text-center flex justify-center items-center gap-4">
                        <CustomButton
                          variant="secondary"
                          className="!p-2 !rounded-lg !bg-black/[0.06] hover:!bg-white/10 !text-[#6E7178]"
                          onClick={() => editExamHandler(item)}
                        >
                          <MdEdit />
                        </CustomButton>
                        <CustomButton
                          variant="danger"
                          className="!p-2 !rounded-lg"
                          onClick={() => deleteExamHandler(item._id)}
                        >
                          <MdOutlineDelete />
                        </CustomButton>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={loginType !== "Student" ? 6 : 5}
                    className="text-center text-base pt-10 pb-10 text-[#6E7178]"
                  >
                    No Exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <Loading />
      )}

      {/* Add/Edit Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="fade-up bg-white border border-[#E4E6EA] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-[0_4px_16px_rgba(22,24,29,0.10)] text-[#16181D]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold font-['Plus Jakarta Sans']">
                {isEditing ? "Edit Exam" : "Add New Exam"}
              </h2>
              <CustomButton
                onClick={resetForm}
                variant="secondary"
                className="!rounded-lg !bg-white hover:!bg-white/10 !text-[#6E7178] border border-[#E4E6EA]"
              >
                <AiOutlineClose size={24} />
              </CustomButton>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6E7178] mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6E7178] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) => setData({ ...data, date: e.target.value })}
                    className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition [color-scheme:dark]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6E7178] mb-1">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={data.semester}
                    onChange={(e) =>
                      setData({ ...data, semester: e.target.value })
                    }
                    className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
                    required
                  >
                    <option value="" className="bg-white text-[#6E7178]">
                      Select Semester
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option
                        key={sem}
                        value={sem}
                        className="bg-white text-[#16181D]"
                      >
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#6E7178] mb-1">
                    Exam Type
                  </label>
                  <select
                    value={data.examType}
                    onChange={(e) =>
                      setData({ ...data, examType: e.target.value })
                    }
                    className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
                    required
                  >
                    <option value="mid" className="bg-white text-[#16181D]">
                      Mid Term
                    </option>
                    <option value="end" className="bg-white text-[#16181D]">
                      End Term
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#6E7178] mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    value={data.totalMarks}
                    onChange={(e) =>
                      setData({ ...data, totalMarks: e.target.value })
                    }
                    className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#6E7178] mb-1">
                  Timetable File
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 cursor-pointer hover:border-[#E4E6EA] transition text-sm text-[#6E7178]">
                    <span className="flex items-center justify-center">
                      <FiUpload className="mr-2" />
                      {file ? file.name : "Choose File"}
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {file && (
                    <CustomButton
                      onClick={() => setFile(null)}
                      variant="danger"
                      className="!p-2 !rounded-lg"
                    >
                      <AiOutlineClose size={20} />
                    </CustomButton>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <CustomButton
                  onClick={resetForm}
                  variant="secondary"
                  className="!rounded-lg !bg-white hover:!bg-white/10 !text-[#6E7178] border border-[#E4E6EA]"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addExamHandler}
                  disabled={processLoading}
                  className="!rounded-lg !px-5 !py-2.5 bg-[#FFB020] text-[#16181D] font-medium hover:opacity-90 active:scale-95"
                >
                  {isEditing ? "Update Exam" : "Add Exam"}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this exam?"
      />
    </div>
  );
};

export default Exam;
