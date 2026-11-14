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
    <div className="fade-up max-w-6xl mx-auto p-8 text-[#16181D]">
      {/* Header Section */}
      <Reveal
        index={0}
        className="flex items-center gap-8 mb-12 border-b border-[#E4E6EA] pb-8 justify-between flex-wrap"
      >
        <div className="flex items-center gap-8">
          <img
            src={mediaSrc(profileData.profile)}
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover ring-4 ring-[#FFB020]/70 ring-offset-4 ring-offset-[#EFF0F2]"
          />
          <div>
            <h1 className="text-4xl font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-[#16181D] mb-2">
              {`${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`}
            </h1>
            <p className="mb-2">
              <span className="inline-flex items-center rounded-full border border-[#1A1D21] bg-[#1A1D21] px-3 py-1 text-sm font-medium text-white">
                {profileData.enrollmentNo}
              </span>
            </p>
            <p className="text-lg font-medium text-[#16181D]">
              {profileData.branchId.name}
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

      <div className="grid grid-cols-1 gap-8">
        {/* Personal Information */}
        <Reveal
          index={1}
          className="rounded-2xl border border-[#E4E6EA] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,24,40,0.10)]"
        >
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold tracking-tight text-[#16181D] mb-6 pb-3 border-b border-[#EEF0F3]">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Email
              </label>
              <p className="mt-1.5 text-[#16181D] break-words">
                {profileData.email}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Phone
              </label>
              <p className="mt-1.5 text-[#16181D]">{profileData.phone}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Gender
              </label>
              <p className="mt-1.5 text-[#16181D] capitalize">
                {profileData.gender}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Blood Group
              </label>
              <p className="mt-1.5 text-[#16181D]">{profileData.bloodGroup}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Date of Birth
              </label>
              <p className="mt-1.5 text-[#16181D]">
                {formatDate(profileData.dob)}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Semester
              </label>
              <p className="mt-1.5 text-[#16181D]">{profileData.semester}</p>
            </div>
          </div>
        </Reveal>

        {/* Address Information */}
        <Reveal
          index={2}
          className="rounded-2xl border border-[#E4E6EA] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,24,40,0.10)]"
        >
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold tracking-tight text-[#16181D] mb-6 pb-3 border-b border-[#EEF0F3]">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Address
              </label>
              <p className="mt-1.5 text-[#16181D] break-words">
                {profileData.address}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                City
              </label>
              <p className="mt-1.5 text-[#16181D]">{profileData.city}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                State
              </label>
              <p className="mt-1.5 text-[#16181D]">{profileData.state}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Pincode
              </label>
              <p className="mt-1.5 text-[#16181D]">{profileData.pincode}</p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Country
              </label>
              <p className="mt-1.5 text-[#16181D]">{profileData.country}</p>
            </div>
          </div>
        </Reveal>

        {/* Emergency Contact */}
        <Reveal
          index={3}
          className="rounded-2xl border border-[#E4E6EA] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,24,40,0.10)]"
        >
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-semibold tracking-tight text-[#16181D] mb-6 pb-3 border-b border-[#EEF0F3]">
            Emergency Contact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Name
              </label>
              <p className="mt-1.5 text-[#16181D]">
                {profileData.emergencyContact.name}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Relationship
              </label>
              <p className="mt-1.5 text-[#16181D]">
                {profileData.emergencyContact.relationship}
              </p>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#6E7178]">
                Phone
              </label>
              <p className="mt-1.5 text-[#16181D]">
                {profileData.emergencyContact.phone}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

export default Profile;
