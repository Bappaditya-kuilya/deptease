import React, { useEffect, useState } from "react";
import { mediaSrc } from "../../utils/mediaSrc";
import { FiUpload } from "react-icons/fi";
import { MdOutlineDelete, MdEdit, MdViewComfy, MdLink } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";

const AddTimetableModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  branches,
}) => {
  const [formData, setFormData] = useState({
    branch: initialData?.branch || "",
    semester: initialData?.semester || "",
    file: null,
    previewUrl: initialData?.file || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white border border-[#E4E6EA] p-8 rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#16181D] font-['Plus Jakarta Sans'] tracking-tight">
            {initialData ? "Edit Timetable" : "Add New Timetable"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#6E7178] hover:text-[#16181D] transition-colors"
          >
            <IoMdClose className="text-3xl" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-xs uppercase tracking-widest text-[#6E7178]">
              Branch
            </label>
            <select
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50"
            >
              <option className="bg-white text-[#16181D]" value="">Select Branch</option>
              {branches?.map((b) => (
                <option className="bg-white text-[#16181D]" key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-xs uppercase tracking-widest text-[#6E7178]">
              Semester
            </label>
            <select
              value={formData.semester}
              onChange={(e) =>
                setFormData({ ...formData, semester: e.target.value })
              }
              className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50"
            >
              <option className="bg-white text-[#16181D]" value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option className="bg-white text-[#16181D]" key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-xs uppercase tracking-widest text-[#6E7178]">
              Timetable File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-[#6E7178] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-[#16181D] hover:file:bg-white/20 cursor-pointer"
            />
          </div>

          {formData.previewUrl && (
            <div className="mt-4">
              <img
                src={formData.previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg border border-[#E4E6EA]"
              />
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <CustomButton variant="secondary" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton variant="primary" onClick={handleSubmit}>
              {initialData ? "Update" : "Add"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const Timetable = () => {
  const [branch, setBranch] = useState();
  const [timetables, setTimetables] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTimetableId, setSelectedTimetableId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranchHandler();
    getTimetablesHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setBranch(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching branches");
    }
  };

  const getTimetablesHandler = async () => {
    try {
      const response = await axiosWrapper.get(`/timetable`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setTimetables(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching timetables");
    }
  };

  const handleSubmitTimetable = async (formData) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userToken}`,
    };

    const submitData = new FormData();
    submitData.append("branch", formData.branch);
    submitData.append("semester", formData.semester);
    if (formData.file) {
      submitData.append("file", formData.file);
    }

    try {
      toast.loading(
        editingTimetable ? "Updating Timetable" : "Adding Timetable"
      );

      let response;
      if (editingTimetable) {
        response = await axiosWrapper.put(
          `/timetable/${editingTimetable._id}`,
          submitData,
          { headers }
        );
      } else {
        response = await axiosWrapper.post("/timetable", submitData, {
          headers,
        });
      }

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getTimetablesHandler();
        setShowAddModal(false);
        setEditingTimetable(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error with timetable");
    }
  };

  const deleteTimetableHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedTimetableId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Timetable");
      const response = await axiosWrapper.delete(
        `/timetable/${selectedTimetableId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Timetable deleted successfully");
        setIsDeleteConfirmOpen(false);
        getTimetablesHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error deleting timetable");
    }
  };

  const editTimetableHandler = (timetable) => {
    setEditingTimetable(timetable);
    setShowAddModal(true);
  };

  return (
    <div className="fade-up w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative">
      <div className="flex justify-between items-center w-full">
        <Heading title="Timetable Management" />
        <CustomButton onClick={() => setShowAddModal(true)}>
          <IoMdAdd className="text-2xl" />
        </CustomButton>
      </div>

      <div className="mt-8 w-full overflow-x-auto">
        <table className="text-sm min-w-full bg-white border border-[#E4E6EA] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          <thead>
            <tr className="bg-white text-[#6E7178]">
              <th className="py-4 px-6 text-left text-xs uppercase tracking-widest font-semibold border-b border-[#E4E6EA]">View</th>
              <th className="py-4 px-6 text-left text-xs uppercase tracking-widest font-semibold border-b border-[#E4E6EA]">Branch</th>
              <th className="py-4 px-6 text-left text-xs uppercase tracking-widest font-semibold border-b border-[#E4E6EA]">Semester</th>
              <th className="py-4 px-6 text-left text-xs uppercase tracking-widest font-semibold border-b border-[#E4E6EA]">Created At</th>
              <th className="py-4 px-6 text-center text-xs uppercase tracking-widest font-semibold border-b border-[#E4E6EA]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#EEF0F3] hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-6 text-[#6E7178]">
                  <a
                    className="text-xl text-[#B45309] hover:text-[#B45309] transition-colors"
                    href={mediaSrc(item.link)}
                    download={`timetable-sem${item.semester}`}
                    rel="noopener noreferrer"
                  >
                    <MdLink />
                  </a>
                </td>
                <td className="py-4 px-6 text-[#6E7178]">{item.branch?.name}</td>
                <td className="py-4 px-6 text-[#6E7178] font-['Plus Jakarta Sans']">
                  {item.semester}
                </td>
                <td className="py-4 px-6 text-[#6E7178]">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-[#6E7178] text-center flex justify-center gap-4">
                  <CustomButton
                    variant="secondary"
                    onClick={() => editTimetableHandler(item)}
                  >
                    <MdEdit />
                  </CustomButton>
                  <CustomButton
                    variant="danger"
                    onClick={() => deleteTimetableHandler(item._id)}
                  >
                    <MdOutlineDelete />
                  </CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTimetableModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTimetable(null);
        }}
        onSubmit={handleSubmitTimetable}
        initialData={editingTimetable}
        branches={branch}
      />

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this timetable?"
      />
    </div>
  );
};

export default Timetable;
