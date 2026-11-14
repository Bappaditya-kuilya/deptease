import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";
const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const getTimetable = async () => {
      try {
        setDataLoading(true);
        const response = await axiosWrapper.get(
          `/timetable?semester=${userData.semester}&branch=${userData.branchId?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        if (response.data.success && response.data.data.length > 0) {
          setTimetable(response.data.data[0].link);
        } else {
          setTimetable("");
        }
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          setTimetable("");
          return;
        }
        toast.error(
          error.response?.data?.message || "Error fetching timetable"
        );
        console.error(error);
      } finally {
        setDataLoading(false);
      }
    };
    userData && getTimetable();
  }, [userData, userData.branchId, userData.semester]);

  return (
    <div className="fade-up w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 text-[#16181D]">
      <div className="flex justify-between items-center w-full gap-4 flex-wrap">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {!dataLoading && timetable && (
          <p
            className="flex justify-center items-center gap-2 rounded-full px-5 py-2.5 bg-[#1A1D21] text-white font-medium text-sm cursor-pointer hover:opacity-90 active:scale-95 transition"
            onClick={() =>
              window.open(process.env.REACT_APP_MEDIA_LINK + "/" + timetable)
            }
          >
            Download
            <span className="ml-2">
              <FiDownload />
            </span>
          </p>
        )}
      </div>
      {dataLoading && <Loading />}
      {!dataLoading && timetable && (
        <img
          className="mt-8 rounded-2xl border border-[#E4E6EA] bg-white p-2 shadow-[0_1px_3px_rgba(16,24,40,0.06)] w-[70%] mx-auto"
          src={process.env.REACT_APP_MEDIA_LINK + "/" + timetable}
          alt="timetable"
        />
      )}
      {!dataLoading && !timetable && (
        <p className="mt-10 w-full rounded-2xl border border-dashed border-[#E4E6EA] bg-white px-8 py-10 text-center text-[#6E7178]">
          No Timetable Available At The Moment!
        </p>
      )}
    </div>
  );
};

export default Timetable;
