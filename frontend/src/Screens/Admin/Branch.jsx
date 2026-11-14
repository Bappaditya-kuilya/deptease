import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const Branch = () => {
  const [data, setData] = useState({
    name: "",
    branchId: "",
  });
  const [branch, setBranch] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  useEffect(() => {
    getBranchHandler();
  }, []);

  const getBranchHandler = async () => {
    setDataLoading(true);
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setBranch(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setBranch([]);
        return;
      }
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching branches");
    } finally {
      setDataLoading(false);
    }
  };

  const addBranchHandler = async () => {
    if (!data.name || !data.branchId) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }
    try {
      toast.loading(isEditing ? "Updating Branch" : "Adding Branch");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/branch/${selectedBranchId}`,
          data,
          {
            headers: headers,
          }
        );
      } else {
        response = await axiosWrapper.post(`/branch`, data, {
          headers: headers,
        });
      }
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", branchId: "" });
        setShowAddForm(false);
        setIsEditing(false);
        setSelectedBranchId(null);
        getBranchHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const deleteBranchHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedBranchId(id);
  };

  const editBranchHandler = (branch) => {
    setData({
      name: branch.name,
      branchId: branch.branchId,
    });
    setSelectedBranchId(branch._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Branch");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      const response = await axiosWrapper.delete(
        `/branch/${selectedBranchId}`,
        {
          headers: headers,
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Branch has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        getBranchHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const getMonogram = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "BR";

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative px-4 sm:px-6">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="fade-up">
          <Heading title="Branch Details" />
          <p className="mt-3 text-sm text-[#6E7178]">
            Academic departments — organize students, faculty and subjects.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#E4E6EA] bg-white px-4 py-2 text-xs uppercase tracking-widest text-[#6E7178]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
          {branch?.length || 0} departments
        </div>
      </div>
      <CustomButton
        onClick={() => {
          setShowAddForm(!showAddForm);
          if (!showAddForm) {
            setData({ name: "", branchId: "" });
            setIsEditing(false);
            setSelectedBranchId(null);
          }
        }}
        className="fixed bottom-8 right-8 !rounded-full !p-4"
      >
        {showAddForm ? (
          <IoMdClose className="text-3xl" />
        ) : (
          <IoMdAdd className="text-3xl" />
        )}
      </CustomButton>

      {dataLoading && <Loading />}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-lg border border-[#E4E6EA] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4E6EA] p-6">
              <h2 className="font-['Plus Jakarta Sans'] text-xl font-semibold text-[#16181D]">
                {isEditing ? "Edit Branch" : "Add New Branch"}
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-[#6E7178] transition-colors hover:text-[#16181D]"
              >
                <IoMdClose className="text-3xl" />
              </button>
            </div>

            <form onSubmit={addBranchHandler} className="space-y-4 p-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm text-[#6E7178]"
                >
                  Branch Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50"
                />
              </div>

              <div>
                <label
                  htmlFor="branchId"
                  className="mb-2 block text-sm text-[#6E7178]"
                >
                  Branch ID
                </label>
                <input
                  type="text"
                  id="branchId"
                  value={data.branchId}
                  onChange={(e) =>
                    setData({ ...data, branchId: e.target.value })
                  }
                  placeholder="e.g. CSE"
                  className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50"
                />
              </div>

              <div className="flex justify-end gap-4 border-t border-[#E4E6EA] pt-4">
                <CustomButton
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </CustomButton>
                <CustomButton variant="primary" onClick={addBranchHandler}>
                  {isEditing ? "Update" : "Add"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {!dataLoading && (
        <div className="mt-8 w-full">
          {branch && branch.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {branch.map((item, index) => (
                <div
                  key={index}
                  className="fade-up flex flex-col rounded-lg border border-[#E4E6EA] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E6EA]"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FFB020] font-['Plus Jakarta Sans'] text-lg font-semibold text-[#16181D] shadow-lg shadow-[#FFB020]/20">
                      {getMonogram(item.name)}
                    </div>
                    <div className="flex gap-2">
                      <CustomButton
                        variant="secondary"
                        className="!p-2 !rounded-lg"
                        onClick={() => editBranchHandler(item)}
                      >
                        <MdEdit />
                      </CustomButton>
                      <CustomButton
                        variant="danger"
                        className="!p-2 !rounded-lg"
                        onClick={() => deleteBranchHandler(item._id)}
                      >
                        <MdOutlineDelete />
                      </CustomButton>
                    </div>
                  </div>

                  <h3 className="font-['Plus Jakarta Sans'] text-lg font-semibold leading-snug text-[#16181D]">
                    {item.name}
                  </h3>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-[#E4E6EA] bg-white/5 px-2.5 py-1 text-xs text-[#6E7178]">
                      {item.branchId}
                    </span>
                    <span className="text-xs text-[#6E7178]">
                      Added {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#EEF0F3] pt-4 text-xs uppercase tracking-widest text-[#6E7178]">
                    <span>Department</span>
                    <span className="text-[#B45309]">Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#E4E6EA] bg-white p-16 text-center">
              <p className="font-['Plus Jakarta Sans'] text-lg text-[#16181D]">
                No branches found.
              </p>
              <p className="mt-1 text-sm text-[#6E7178]">
                Add your first department to get started.
              </p>
            </div>
          )}
        </div>
      )}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this branch?"
      />
    </div>
  );
};

export default Branch;
