import React, { useState } from "react";
import { mediaSrc } from "../../utils/mediaSrc";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import CustomButton from "../../components/CustomButton";

const Profile = ({ profileData }) => {
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12 border-b border-[#E4E6EA] pb-8 fade-up">
        <div className="flex items-center gap-6 sm:gap-8">
          <img
            src={mediaSrc(profileData.profile)}
            alt="Profile"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-[#FFB020]/40 ring-offset-4 ring-offset-[#EFF0F2]"
          />
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#6E7178]">
              Profile
            </p>
            <h1 className="font-['Plus Jakarta Sans'] text-3xl sm:text-4xl font-semibold tracking-tight mb-2 text-[#16181D]">
              {`${profileData.firstName} ${profileData.lastName}`}
            </h1>
            <p className="text-sm text-[#6E7178] mb-1">
              Employee ID: {profileData.employeeId}
            </p>
            <p className="text-[#B45309] font-medium">
              {profileData.designation}
              {profileData.isSuperAdmin && " (Super Admin)"}
            </p>
          </div>
        </div>
        <CustomButton onClick={() => setShowUpdatePasswordModal(true)}>
          Update Password
        </CustomButton>
        {showUpdatePasswordModal && (
          <UpdatePasswordLoggedIn
            onClose={() => setShowUpdatePasswordModal(false)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Personal Information */}
        <div className="rounded-lg border border-[#E4E6EA] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E6EA]">
          <h2 className="mb-6 pb-3 font-['Plus Jakarta Sans'] text-xl font-semibold border-b border-[#E4E6EA] text-[#16181D]">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">Email</label>
              <p className="text-[#16181D]">{profileData.email}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">Phone</label>
              <p className="text-[#16181D]">{profileData.phone}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Gender
              </label>
              <p className="text-[#16181D] capitalize">{profileData.gender}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Blood Group
              </label>
              <p className="text-[#16181D]">{profileData.bloodGroup}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Date of Birth
              </label>
              <p className="text-[#16181D]">{formatDate(profileData.dob)}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Joining Date
              </label>
              <p className="text-[#16181D]">
                {formatDate(profileData.joiningDate)}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Salary
              </label>
              <p className="text-[#16181D]">
                ₹{profileData.salary.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Status
              </label>
              <p className="text-[#16181D] capitalize">{profileData.status}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">Role</label>
              <p className="text-[#16181D] capitalize">
                {profileData.isSuperAdmin ? "Super Admin" : "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="rounded-lg border border-[#E4E6EA] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E6EA]">
          <h2 className="mb-6 pb-3 font-['Plus Jakarta Sans'] text-xl font-semibold border-b border-[#E4E6EA] text-[#16181D]">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Address
              </label>
              <p className="text-[#16181D]">{profileData.address}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">City</label>
              <p className="text-[#16181D]">{profileData.city}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">State</label>
              <p className="text-[#16181D]">{profileData.state}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Pincode
              </label>
              <p className="text-[#16181D]">{profileData.pincode}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Country
              </label>
              <p className="text-[#16181D]">{profileData.country}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="rounded-lg border border-[#E4E6EA] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E6EA]">
          <h2 className="mb-6 pb-3 font-['Plus Jakarta Sans'] text-xl font-semibold border-b border-[#E4E6EA] text-[#16181D]">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">Name</label>
              <p className="text-[#16181D]">
                {profileData.emergencyContact.name}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">
                Relationship
              </label>
              <p className="text-[#16181D]">
                {profileData.emergencyContact.relationship}
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase tracking-widest text-[#6E7178]">Phone</label>
              <p className="text-[#16181D]">
                {profileData.emergencyContact.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
