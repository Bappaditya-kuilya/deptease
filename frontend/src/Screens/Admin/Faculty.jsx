import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";

const Faculty = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    dob: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "active",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    bloodGroup: "",
    branchId: "",
  });

  const [branch, setBranches] = useState([]);

  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [file, setFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(null);

  useEffect(() => {
    getFacultyHandler();
    getBranchHandler();
  }, []);

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
        console.error(error);
        toast.error(error.response?.data?.message || "Error fetching subjects");
      }
    } finally {
      setDataLoading(false);
    }
  };

  const getFacultyHandler = async () => {
    try {
      toast.loading("Loading faculty...");
      const response = await axiosWrapper.get(`/faculty`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setFaculty(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setFaculty([]);
      } else {
        toast.error(error.response?.data?.message || "Error fetching faculty");
      }
    } finally {
      toast.dismiss();
    }
  };

  const addFacultyHandler = async () => {
    try {
      toast.loading(isEditing ? "Updating Faculty" : "Adding Faculty");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      };

      const formData = new FormData();
      for (const key in data) {
        if (key === "emergencyContact") {
          for (const subKey in data.emergencyContact) {
            formData.append(
              `emergencyContact[${subKey}]`,
              data.emergencyContact[subKey]
            );
          }
        } else {
          formData.append(key, data[key]);
        }
      }

      if (file) {
        formData.append("file", file);
      }

      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/faculty/${selectedFacultyId}`,
          formData,
          {
            headers,
          }
        );
      } else {
        response = await axiosWrapper.post(`/faculty/register`, formData, {
          headers,
        });
      }

      toast.dismiss();
      if (response.data.success) {
        if (!isEditing) {
          toast.success(
            `Faculty created successfully! Default password: faculty123`
          );
        } else {
          toast.success(response.data.message);
        }
        resetForm();
        getFacultyHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const deleteFacultyHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedFacultyId(id);
  };

  const editFacultyHandler = (faculty) => {
    setData({
      firstName: faculty.firstName || "",
      lastName: faculty.lastName || "",
      email: faculty.email || "",
      phone: faculty.phone || "",
      profile: faculty.profile || "",
      address: faculty.address || "",
      city: faculty.city || "",
      state: faculty.state || "",
      pincode: faculty.pincode || "",
      country: faculty.country || "",
      gender: faculty.gender || "",
      dob: faculty.dob?.split("T")[0] || "",
      designation: faculty.designation || "",
      joiningDate: faculty.joiningDate?.split("T")[0] || "",
      salary: faculty.salary || "",
      status: faculty.status || "active",
      emergencyContact: {
        name: faculty.emergencyContact?.name || "",
        relationship: faculty.emergencyContact?.relationship || "",
        phone: faculty.emergencyContact?.phone || "",
      },
      bloodGroup: faculty.bloodGroup || "",
      branchId: faculty.branchId || "",
    });
    setSelectedFacultyId(faculty._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Faculty");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axiosWrapper.delete(
        `/faculty/${selectedFacultyId}`,
        {
          headers,
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Faculty has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        getFacultyHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const resetForm = () => {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      gender: "",
      dob: "",
      designation: "",
      joiningDate: "",
      salary: "",
      status: "active",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      bloodGroup: "",
      branchId: "",
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedFacultyId(null);
  };

  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleEmergencyContactChange = (field, value) => {
    setData({
      ...data,
      emergencyContact: { ...data.emergencyContact, [field]: value },
    });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative px-4 sm:px-6">
      <div className="flex justify-between items-center w-full fade-up">
        <Heading title="Faculty Management" />
        <CustomButton
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          <IoMdAdd className="text-2xl" />
        </CustomButton>
      </div>

      {dataLoading && <Loading />}

      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto rounded-lg border border-[#E4E6EA] bg-white p-8 shadow-2xl">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 rounded-full p-1 text-[#6E7178] transition-colors hover:bg-white/5 hover:text-[#16181D]"
            >
              <IoMdClose className="text-2xl" />
            </button>
            <h2 className="mb-6 font-['Plus Jakarta Sans'] text-2xl font-semibold text-[#16181D]">
              {isEditing ? "Edit Faculty" : "Add New Faculty"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFacultyHandler();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    accept="image/*"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Gender
                  </label>
                  <select
                    value={data.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={data.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Blood Group
                  </label>
                  <select
                    value={data.bloodGroup}
                    onChange={(e) =>
                      handleInputChange("bloodGroup", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={data.designation}
                    onChange={(e) =>
                      handleInputChange("designation", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={data.joiningDate}
                    onChange={(e) =>
                      handleInputChange("joiningDate", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Salary
                  </label>
                  <input
                    type="number"
                    value={data.salary}
                    onChange={(e) =>
                      handleInputChange("salary", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Branch
                  </label>
                  <select
                    value={data.branchId}
                    onChange={(e) =>
                      handleInputChange("branchId", e.target.value)
                    }
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

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Address
                  </label>
                  <input
                    type="text"
                    value={data.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    City
                  </label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    State
                  </label>
                  <input
                    type="text"
                    value={data.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={data.pincode}
                    onChange={(e) =>
                      handleInputChange("pincode", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-[#6E7178]">
                    Country
                  </label>
                  <input
                    type="text"
                    value={data.country}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <h3 className="mb-4 font-['Plus Jakarta Sans'] text-lg font-semibold text-[#16181D]">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm text-[#6E7178]">
                        Name
                      </label>
                      <input
                        type="text"
                        value={data.emergencyContact.name}
                        onChange={(e) =>
                          handleEmergencyContactChange("name", e.target.value)
                        }
                        className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-[#6E7178]">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={data.emergencyContact.relationship}
                        onChange={(e) =>
                          handleEmergencyContactChange(
                            "relationship",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-[#6E7178]">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={data.emergencyContact.phone}
                        onChange={(e) =>
                          handleEmergencyContactChange("phone", e.target.value)
                        }
                        className="w-full rounded-lg border border-[#E4E6EA] bg-white px-4 py-2.5 text-sm text-[#16181D] placeholder:text-[#6E7178] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/50 [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-[#6E7178]">
                    Default password will be{" "}
                    <span className="font-semibold text-[#16181D]">faculty123</span>
                  </p>
                </div>
                <div className="flex gap-4">
                  <CustomButton
                    type="button"
                    variant="secondary"
                    onClick={resetForm}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton type="submit" variant="primary">
                    {isEditing ? "Update Faculty" : "Add Faculty"}
                  </CustomButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {!dataLoading && !showAddForm && (
        <div className="mt-8 w-full overflow-x-auto rounded-lg border border-[#E4E6EA] bg-white">
          <table className="text-sm min-w-full">
            <thead>
              <tr className="border-b border-[#E4E6EA] bg-black/[0.04]">
                <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                  Name
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                  Email
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                  Phone
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                  Employee ID
                </th>
                <th className="py-4 px-6 text-left text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                  Designation
                </th>
                <th className="py-4 px-6 text-center text-xs font-medium uppercase tracking-widest text-[#6E7178]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {faculty && faculty.length > 0 ? (
                faculty.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#EEF0F3] transition-colors last:border-b-0 hover:bg-white/5"
                  >
                    <td className="py-4 px-6 font-medium text-[#16181D]">{`${item.firstName} ${item.lastName}`}</td>
                    <td className="py-4 px-6 text-[#6E7178]">{item.email}</td>
                    <td className="py-4 px-6 text-[#6E7178]">{item.phone}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center rounded-full border border-[#E4E6EA] bg-white/5 px-2.5 py-1 text-xs text-[#6E7178]">
                        {item.employeeId}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#6E7178]">
                      {item.designation}
                    </td>
                    <td className="py-4 px-6 text-center flex justify-center gap-4">
                      <CustomButton
                        variant="secondary"
                        className="!p-2 !rounded-lg"
                        onClick={() => editFacultyHandler(item)}
                      >
                        <MdEdit />
                      </CustomButton>
                      <CustomButton
                        variant="danger"
                        className="!p-2 !rounded-lg"
                        onClick={() => deleteFacultyHandler(item._id)}
                      >
                        <MdOutlineDelete />
                      </CustomButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-base pt-10 pb-10 text-[#6E7178]"
                  >
                    No Faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this faculty?"
      />
    </div>
  );
};

export default Faculty;
