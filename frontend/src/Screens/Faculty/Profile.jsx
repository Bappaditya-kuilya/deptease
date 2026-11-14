import React, { useState } from "react";
import { mediaSrc } from "../../utils/mediaSrc";
import CustomButton from "../../components/CustomButton";
import Reveal from "../../components/Reveal";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";

const Profile = ({ profileData }) => {
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8 fade-up">
      {/* Header Section */}
      <Reveal
        index={0}
        className="flex items-center gap-8 mb-12 border-b border-[#EEF0F3] pb-8 justify-between"
      >
        <div className="flex items-center gap-8">
          <img
            src={mediaSrc(profileData.profile)}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover ring-4 ring-[#FFB020]/60 ring-offset-4 ring-offset-[#EFF0F2] border border-[#E4E6EA]"
          />
          <div>
            <h1 className="text-4xl font-bold text-[#16181D] mb-2 font-['Plus_Jakarta_Sans'] tracking-tight">
              {`${profileData.firstName} ${profileData.lastName}`}
            </h1>
            <p className="text-lg text-[#6E7178] mb-1 font-['Plus Jakarta Sans']">
              Employee ID: {profileData.employeeId}
            </p>
            <p className="inline-block text-sm font-medium text-[#16181D] bg-[#FFB020] px-3 py-1 rounded-full">
              {profileData.designation}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8 justify-end">
          <CustomButton
            onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
            variant="primary"
          >
            {showPasswordUpdate ? "Hide" : "Update Password"}
          </CustomButton>
        </div>
        {showPasswordUpdate && (
          <UpdatePasswordLoggedIn
            onClose={() => setShowPasswordUpdate(false)}
          />
        )}
      </Reveal>

      <div className="grid grid-cols-1 gap-12">
        {/* Personal Information */}
        <Reveal
          index={1}
          className="rounded-lg p-6 border border-[#E4E6EA] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E6EA]"
        >
          <h2 className="text-xl font-bold text-[#16181D] mb-6 pb-3 border-b border-[#E4E6EA] font-['Plus Jakarta Sans'] tracking-tight">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">Email</label>
              <p className="text-[#16181D]">{profileData.email}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">Phone</label>
              <p className="text-[#16181D]">{profileData.phone}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Gender
              </label>
              <p className="text-[#16181D] capitalize">{profileData.gender}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Blood Group
              </label>
              <p className="text-[#16181D]">{profileData.bloodGroup}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Date of Birth
              </label>
              <p className="text-[#16181D]">{formatDate(profileData.dob)}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Joining Date
              </label>
              <p className="text-[#16181D]">
                {formatDate(profileData.joiningDate)}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Salary
              </label>
              <p className="text-[#16181D]">
                ₹{profileData.salary?.toLocaleString?.() ?? "-"}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Status
              </label>
              <p className="text-[#16181D] capitalize">{profileData.status}</p>
            </div>
          </div>
        </Reveal>

        {/* Address Information */}
        <Reveal
          index={2}
          className="rounded-lg p-6 border border-[#E4E6EA] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E6EA]"
        >
          <h2 className="text-xl font-bold text-[#16181D] mb-6 pb-3 border-b border-[#E4E6EA] font-['Plus Jakarta Sans'] tracking-tight">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Address
              </label>
              <p className="text-[#16181D]">{profileData.address}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">City</label>
              <p className="text-[#16181D]">{profileData.city}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">State</label>
              <p className="text-[#16181D]">{profileData.state}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Pincode
              </label>
              <p className="text-[#16181D]">{profileData.pincode}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Country
              </label>
              <p className="text-[#16181D]">{profileData.country}</p>
            </div>
          </div>
        </Reveal>

        {/* Emergency Contact */}
        <Reveal
          index={3}
          className="rounded-lg p-6 border border-[#E4E6EA] bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E4E6EA]"
        >
          <h2 className="text-xl font-bold text-[#16181D] mb-6 pb-3 border-b border-[#E4E6EA] font-['Plus Jakarta Sans'] tracking-tight">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">Name</label>
              <p className="text-[#16181D]">
                {profileData.emergencyContact?.name}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">
                Relationship
              </label>
              <p className="text-[#16181D]">
                {profileData.emergencyContact?.relationship}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178] mb-1 block">Phone</label>
              <p className="text-[#16181D]">
                {profileData.emergencyContact?.phone}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Profile;
