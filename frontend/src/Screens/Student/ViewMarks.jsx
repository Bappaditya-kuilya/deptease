import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";

const ViewMarks = () => {
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    userData?.semester || 1
  );
  const [marks, setMarks] = useState([]);
  const userToken = localStorage.getItem("userToken");

  const fetchMarks = async (semester) => {
    setDataLoading(true);
    toast.loading("Loading marks...");
    try {
      const response = await axiosWrapper.get(
        `/marks/student?semester=${semester}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data.success) {
        setMarks(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching marks");
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchMarks(userData?.semester || 1);
  }, []);

  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    setSelectedSemester(semester);
    fetchMarks(semester);
  };

  const midTermMarks = marks.filter((mark) => mark.examId.examType === "mid");
  const endTermMarks = marks.filter((mark) => mark.examId.examType === "end");

  const scoreTone = (obtained, total) => {
    const isHigh = total > 0 && obtained / total >= 0.75;
    return isHigh
      ? {
          score: "text-[#15803D]",
          chip: "border-[#86EFAC]/50 bg-[#86EFAC]/20 text-[#15803D]",
        }
      : {
          score: "text-[#16181D]",
          chip: "border-[#E4E6EA] bg-[#EFF0F2] text-[#6E7178]",
        };
  };

  const scorePercent = (obtained, total) =>
    total > 0 ? Math.round((obtained / total) * 100) : 0;

  const renderMarkRow = (mark) => {
    const tone = scoreTone(mark.marksObtained, mark.examId.totalMarks);
    return (
      <div
        key={mark._id}
        className="flex items-center justify-between gap-4 rounded-2xl border border-[#E4E6EA] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,24,40,0.10)]"
      >
        <div className="min-w-0">
          <p className="font-['Plus_Jakarta_Sans'] text-base font-semibold text-[#16181D] truncate">
            {mark.subjectId.name}
          </p>
          <p className="text-sm text-[#6E7178]">{mark.examId.name}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${tone.chip}`}
          >
            {scorePercent(mark.marksObtained, mark.examId.totalMarks)}%
          </span>
          <div className="text-right">
            <p
              className={`font-['Plus_Jakarta_Sans'] text-4xl font-bold leading-none tracking-tight tabular-nums ${tone.score}`}
            >
              {mark.marksObtained}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-[#6E7178]">
              out of {mark.examId.totalMarks}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-up w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 text-[#16181D]">
      <div className="flex justify-between items-center w-full mb-6 gap-4 flex-wrap">
        <Heading title="View Marks" />
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-[#6E7178]">
            Semester:
          </label>
          <select
            value={selectedSemester || ""}
            onChange={handleSemesterChange}
            className="rounded-2xl bg-white border border-[#E4E6EA] px-4 py-2.5 text-sm text-[#16181D] focus:outline-none focus:ring-2 focus:ring-[#FFB020]/60 focus:border-[#FFB020]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="rounded-2xl border border-[#E4E6EA] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,24,40,0.10)]">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#FFB020]" />
            <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-[#16181D]">
              Mid Term Marks
            </h2>
            <span className="ml-auto rounded-full border border-[#E4E6EA] bg-[#FFF4E5] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#B45309]">
              {midTermMarks.length}
            </span>
          </div>
          {dataLoading ? (
            <p className="text-sm text-[#6E7178] animate-pulse">Loading...</p>
          ) : midTermMarks.length > 0 ? (
            <div className="space-y-4">{midTermMarks.map(renderMarkRow)}</div>
          ) : (
            <p className="text-sm text-[#6E7178]">
              No mid term marks available
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-[#E4E6EA] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(16,24,40,0.10)]">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[#FFB020]" />
            <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-[#16181D]">
              End Term Marks
            </h2>
            <span className="ml-auto rounded-full border border-[#E4E6EA] bg-[#FFF4E5] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#B45309]">
              {endTermMarks.length}
            </span>
          </div>
          {dataLoading ? (
            <p className="text-sm text-[#6E7178] animate-pulse">Loading...</p>
          ) : endTermMarks.length > 0 ? (
            <div className="space-y-4">{endTermMarks.map(renderMarkRow)}</div>
          ) : (
            <p className="text-sm text-[#6E7178]">
              No end term marks available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewMarks;
