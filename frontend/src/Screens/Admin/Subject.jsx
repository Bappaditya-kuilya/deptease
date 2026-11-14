import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { CgDanger } from "react-icons/cg";
import Loading from "../../components/Loading";

const Subject = () => {
  const [data, setData] = useState({
    name: "",
    code: "",
    branch: "",
    semester: "",
    credits: "",
  });
  const [subject, setSubject] = useState([]);
  const [branch, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    getSubjectHandler();
    getBranchHandler();
  }, []);

  const getSubjectHandler = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/subject`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setSubject(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSubject([]);
      } else {
        toast.error(error.response?.data?.message || "Error fetching subjects");
      }
    } finally {
      setDataLoading(false);
    }
  };

  const getBranchHandler = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setBranches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setBranches([]);
      } else {
        toast.error(error.response?.data?.message || "Error fetching branches");
      }
    } finally {
      setDataLoading(false);
    }
  };

  const addSubjectHandler = async () => {
    if (
      !data.name ||
      !data.code ||
      !data.branch ||
      !data.semester ||
      !data.credits
    ) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setDataLoading(true);
      toast.loading(isEditing ? "Updating Subject" : "Adding Subject");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/subject/${selectedSubjectId}`,
          data,
          {
            headers: headers,
          }
        );
      } else {
        response = await axiosWrapper.post(`/subject`, data, {
          headers: headers,
        });
      }
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        getSubjectHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    } finally {
      setDataLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      name: "",
      code: "",
      branch: "",
      semester: "",
      credits: "",
    });
    setShowModal(false);
    setIsEditing(false);
    setSelectedSubjectId(null);
  };

  const deleteSubjectHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedSubjectId(id);
  };

  const editSubjectHandler = (subject) => {
    setData({
      name: subject.name,
      code: subject.code,
      branch: subject.branch?._id,
      semester: subject.semester,
      credits: subject.credits,
    });
    setSelectedSubjectId(subject._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDataLoading(true);
      toast.loading("Deleting Subject");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      const response = await axiosWrapper.delete(
        `/subject/${selectedSubjectId}`,
        {
          headers: headers,
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Subject has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        getSubjectHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 px-4 sm:px-6">
      <div className="flex justify-between items-center w-full fade-up">
        <Heading title="Subject Details" />
        {branch.length > 0 && (
          <CustomButton onClick={() => setShowModal(true)}>
            <IoMdAdd className="text-2xl" />
          </CustomButton>
        )}
      </div>
      {dataLoading && <Loading />}

      {!dataLoading && branch.length == 0 && (
        <div className="flex justify-center items-center flex-col w-full mt-24 fade-up">
          <CgDanger className="w-16 h-16 text-yellow-500 mb-4" />
          <p className="text-center text-lg text-[#6E7178]">
            Please add branches before adding a subject.
          </p>
        </div>
      )}

      {!dataLoading && branch.length > 0 && (
        <div className="mt-8 w-full">
          {subject.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#E4E6EA] bg-white py-16 text-center text-[#6E7178]">
              No subjects found
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#E4E6EA] bg-white">
              <table className="text-sm min-w-full">
                <thead>
                  <tr className="border-b border-[#E4E6EA] bg-black/[0.04]">
                    <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                      Name
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                      Code
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                      Branch
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                      Semester
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                      Credits
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subject &&
                    subject.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-[#EEF0F3] transition-colors last:border-b-0 hover:bg-white/5"
                      >
                        <td className="py-4 px-6 font-medium text-[#16181D]">
                          {item.name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center rounded-full border border-[#E4E6EA] bg-white/5 px-2.5 py-1 text-xs text-[#6E7178]">
                            {item.code}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#6E7178]">
                          {item.branch?.name}
                        </td>
                        <td className="py-4 px-6 text-[#6E7178]">
                          {item.semester}
                        </td>
                        <td className="py-4 px-6 text-[#6E7178]">
                          {item.credits}
                        </td>
                        <td className="py-4 px-6 text-center flex justify-center gap-4">
                          <CustomButton
                            variant="secondary"
                            className="!p-2 !rounded-lg"
                            onClick={() => editSubjectHandler(item)}
                          >
                            <MdEdit />
                          </CustomButton>
                          <CustomButton
                            variant="danger"
                            className="!p-2 !rounded-lg"
                            onClick={() => deleteSubjectHandler(item._id)}
                          >
                            <MdOutlineDelete />
                          </CustomButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm z-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#E4E6EA] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex justify-between items-center gap-4 border-b border-[#E4E6EA] pb-4">
              <h2 className="font-['Plus Jakarta Sans'] text-xl font-semibold text-[#16181D]">
                {isEditing ? "Edit Subject" : "Add New Subject"}
              </h2>
              <CustomButton onClick={resetForm} variant="secondary">
                <AiOutlineClose size={24} />
              </CustomButton>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-[#6E7178]">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-[#6E7178]">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={data.code}
                  onChange={(e) => setData({ ...data, code: e.target.value })}
                  className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-[#6E7178]">
                  Branch
                </label>
                <select
                  value={data.branch}
                  onChange={(e) => setData({ ...data, branch: e.target.value })}
                  className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                  required
                >
                  <option value="">Select Branch</option>
                  {branch.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-[#6E7178]">
                  Semester
                </label>
                <select
                  value={data.semester}
                  onChange={(e) =>
                    setData({ ...data, semester: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-[#6E7178]">
                  Credits
                </label>
                <input
                  type="number"
                  value={data.credits}
                  onChange={(e) =>
                    setData({ ...data, credits: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <CustomButton onClick={resetForm} variant="secondary">
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addSubjectHandler}
                  disabled={dataLoading}
                >
                  {isEditing ? "Update Subject" : "Add Subject"}
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
        message="Are you sure you want to delete this subject?"
      />
    </div>
  );
};

export default Subject;
