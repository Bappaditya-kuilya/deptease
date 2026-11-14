import React, { useEffect, useState } from "react";
import { IoMdLink, IoMdAdd, IoMdClose } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import DeleteConfirm from "../components/DeleteConfirm";
import Loading from "../components/Loading";

const Notice = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "student",
    link: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [token, navigate]);

  const getNotices = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/notice", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setNotices(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setNotices([]);
      } else {
        toast.error(error.response?.data?.message || "Failed to load notices");
      }
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getNotices();
  }, [router.pathname]);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      description: "",
      type: "student",
      link: "",
    });
    setShowAddModal(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      type: notice.type || "student",
      link: notice.link || "",
    });
    setShowAddModal(true);
  };

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    const { title, description, type } = formData;

    if (!title || !description || !type) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }

    try {
      toast.loading(editingNotice ? "Updating Notice" : "Adding Notice");

      const response = await axiosWrapper[editingNotice ? "put" : "post"](
        `/notice${editingNotice ? `/${editingNotice._id}` : ""}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getNotices();
        setShowAddModal(false);
        setEditingNotice(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting Notice");
      const response = await axiosWrapper.delete(
        `/notice/${selectedNoticeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Notice deleted successfully");
        setIsDeleteConfirmOpen(false);
        getNotices();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to delete notice");
    }
  };

  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col my-10 text-[#16181D]">
      <div className="relative flex justify-between items-center w-full">
        <Heading title="Notices" />
        {!dataLoading &&
          (router.pathname === "/faculty" || router.pathname === "/admin") && (
            <CustomButton
              onClick={openAddModal}
              className="!rounded-full !p-2.5 !bg-[#1A1D21] !text-white !shadow-none hover:!bg-[#16181D] active:scale-95"
            >
              <IoMdAdd className="text-2xl" />
            </CustomButton>
          )}
      </div>

      {dataLoading && <Loading />}

      {!dataLoading && (
        <div className="mt-8 w-full">
          {notices.length === 0 ? (
            <div className="text-center py-10 text-[#6E7178] rounded-2xl border border-dashed border-[#E4E6EA] bg-white">
              No notices found
            </div>
          ) : (
            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notices?.map((notice, index) => (
                <div
                  key={notice._id}
                  className={`${
                    ["fade-up", "fade-up-1", "fade-up-2", "fade-up-3"][
                      index % 4
                    ]
                  } rounded-lg border border-[#E4E6EA] bg-white transition-all duration-300 overflow-hidden hover:-translate-y-0.5 hover:border-[#E4E6EA]`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className={`text-lg font-semibold font-['Plus Jakarta Sans'] line-clamp-2 group flex items-start ${
                          notice.link
                            ? "cursor-pointer text-[#16181D] hover:text-[#B45309] transition-colors"
                            : "text-[#16181D]"
                        }`}
                        onClick={() => notice.link && window.open(notice.link)}
                      >
                        {notice.title}
                        {notice.link && (
                          <IoMdLink className="ml-2 flex-shrink-0 text-xl opacity-70 group-hover:opacity-100 text-[#B45309]" />
                        )}
                      </h3>
                      {(router.pathname === "/faculty" ||
                        router.pathname === "/admin") && (
                        <div className="flex gap-2 ml-2 flex-shrink-0">
                          <CustomButton
                            onClick={() => {
                              setSelectedNoticeId(notice._id);
                              setIsDeleteConfirmOpen(true);
                            }}
                            variant="danger"
                            className="!p-1.5 !rounded-full"
                            title="Delete Notice"
                          >
                            <MdDeleteOutline size={18} />
                          </CustomButton>
                          <CustomButton
                            onClick={() => handleEdit(notice)}
                            variant="secondary"
                            className="!p-1.5 !rounded-full !bg-black/[0.06] hover:!bg-white/10 !text-[#6E7178]"
                            title="Edit Notice"
                          >
                            <MdEditNote size={18} />
                          </CustomButton>
                        </div>
                      )}
                    </div>

                    <p className="text-[#6E7178] text-sm line-clamp-3 mb-4">
                      {notice.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-[#6E7178]">
                      <div className="flex items-center">
                        <HiOutlineCalendar className="mr-1" />
                        {new Date(notice.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                      {notice.type !== "both" && (
                        <span className="inline-flex items-center rounded-full border border-[#FFB020]/30 bg-[#FFB020]/10 px-3 py-1 font-medium text-[#B45309]">
                          {notice.type === "student" ? "Student" : "Faculty"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal UI */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="fade-up bg-white border border-[#E4E6EA] rounded-lg w-[500px] max-w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-[0_4px_16px_rgba(22,24,29,0.10)]">
            <div className="flex justify-between items-center p-6 border-b border-[#E4E6EA]">
              <h2 className="text-xl font-semibold font-['Plus Jakarta Sans'] text-[#16181D]">
                {editingNotice ? "Edit Notice" : "Add New Notice"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingNotice(null);
                }}
                className="text-[#6E7178] hover:text-[#16181D] transition"
              >
                <IoMdClose className="text-3xl" />
              </button>
            </div>

            <form onSubmit={handleSubmitNotice} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6E7178] mb-2">
                  Notice Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6E7178] mb-2">
                  Notice Description
                </label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6E7178] mb-2">
                  Notice Link (Optional)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6E7178] mb-2">
                  Type Of Notice
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full rounded-lg bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 transition"
                >
                  <option value="" className="bg-white text-[#6E7178]">
                    Select Type
                  </option>
                  <option value="student" className="bg-white text-[#16181D]">
                    Student
                  </option>
                  <option value="faculty" className="bg-white text-[#16181D]">
                    Faculty
                  </option>
                  <option value="both" className="bg-white text-[#16181D]">
                    Both
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-[#E4E6EA]">
                <CustomButton
                  variant="secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNotice(null);
                  }}
                  className="!rounded-lg !bg-white hover:!bg-white/10 !text-[#6E7178] border border-[#E4E6EA]"
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="submit"
                  variant="primary"
                  className="!rounded-lg !px-5 !py-2.5 bg-[#FFB020] text-[#16181D] font-medium hover:opacity-90 active:scale-95"
                >
                  {editingNotice ? "Update" : "Add"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this notice?"
      />
    </div>
  );
};

export default Notice;
