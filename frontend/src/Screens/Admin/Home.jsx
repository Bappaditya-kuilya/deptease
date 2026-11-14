import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import Reveal from "../../components/Reveal";
import CountUp from "../../components/CountUp";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import Admin from "./Admin";
import Branch from "./Branch";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Profile from "./Profile";
import Exam from "../Exam";
import { useNavigate, useLocation } from "react-router-dom";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: Profile },
  { id: "student", label: "Student", component: Student },
  { id: "faculty", label: "Faculty", component: Faculty },
  { id: "branch", label: "Branch", component: Branch },
  { id: "notice", label: "Notice", component: Notice },
  { id: "exam", label: "Exam", component: Exam },
  { id: "subjects", label: "Subjects", component: Subjects },
  { id: "admin", label: "Admin", component: Admin },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    departments: 0,
    branches: [],
  });
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  // Traveling amber route marker for the tab strip
  const tabRefs = useRef([]);
  const tabListRef = useRef(null);
  const [marker, setMarker] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const list = tabListRef.current;
    const activeIndex = MENU_ITEMS.findIndex(
      (item) => item.id === selectedMenu
    );
    const activeTab = tabRefs.current[activeIndex];
    if (!list || !activeTab) return;
    const listRect = list.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    setMarker({
      left: tabRect.left - listRect.left + list.scrollLeft,
      top: tabRect.top - listRect.top + list.scrollTop,
      width: tabRect.width,
      height: tabRect.height,
    });
  }, [selectedMenu]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      toast.loading("Loading user details...");
      const response = await axiosWrapper.get(`/admin/my-details`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error fetching user details"
      );
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  useEffect(() => {
    // Dashboard figures: prefer the dedicated stats endpoint, silently fall
    // back to the regular list endpoints when it is unavailable.
    const loadStats = async () => {
      const headers = { headers: { Authorization: `Bearer ${userToken}` } };
      try {
        const [response, facultyResponse] = await Promise.all([
          axiosWrapper.get(`/branch/stats`, headers),
          axiosWrapper.get(`/faculty`, headers),
        ]);
        const payload = response.data?.data;
        if (response.data?.success && payload) {
          const branches = payload.branches || [];
          setStats({
            students: payload.totalStudents || 0,
            faculty: facultyResponse.data?.data?.length || 0,
            subjects: branches.reduce((total, b) => total + (b.subjects || 0), 0),
            departments: payload.totalBranches || branches.length,
            branches,
          });
          return;
        }
      } catch (error) {
        /* stats endpoint unavailable — fall back to list endpoints */
      }
      try {
        const results = await Promise.allSettled([
          axiosWrapper.get(`/student`, headers),
          axiosWrapper.get(`/faculty`, headers),
          axiosWrapper.get(`/subject`, headers),
          axiosWrapper.get(`/branch`, headers),
        ]);
        const rows = (result) =>
          result.status === "fulfilled" ? result.value.data?.data || [] : [];
        const students = rows(results[0]);
        const faculty = rows(results[1]);
        const subjects = rows(results[2]);
        const branches = rows(results[3]);
        const perBranch = {};
        students.forEach((s) => {
          const id = s.branchId?._id || s.branchId;
          if (id) {
            perBranch[id] = {
              ...perBranch[id],
              students: (perBranch[id]?.students || 0) + 1,
            };
          }
        });
        subjects.forEach((s) => {
          const id = s.branch?._id || s.branch;
          if (id) {
            perBranch[id] = {
              ...perBranch[id],
              subjects: (perBranch[id]?.subjects || 0) + 1,
            };
          }
        });
        setStats({
          students: students.length,
          faculty: faculty.length,
          subjects: subjects.length,
          departments: branches.length,
          branches: branches.map((b) => ({
            ...b,
            students: perBranch[b._id]?.students || 0,
            subjects: perBranch[b._id]?.subjects || 0,
          })),
        });
      } catch (error) {
        /* keep whatever figures we already have */
      }
    };
    loadStats();
  }, [userToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "home";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.pathname]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu === menuId;
    return `
      text-center px-5 py-2.5 cursor-pointer
      font-medium text-sm w-full
      rounded-full border
      transition-all duration-300 ease-in-out
      ${
        isSelected
          ? "bg-[#1A1D21] text-white font-medium border-transparent"
          : "border-transparent text-[#6E7178] hover:text-[#16181D]"
      }
    `;
  };

  const renderDashboard = () => {
    const cards = [
      { label: "Students", value: stats.students, unit: "enrolled" },
      { label: "Faculty", value: stats.faculty, unit: "teaching" },
      { label: "Subjects", value: stats.subjects, unit: "courses" },
      { label: "Departments", value: stats.departments, unit: "departments" },
    ];

    return (
      <div className="mb-12">
        <Reveal
          index={0}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-[#6E7178]">
              Overview
            </p>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl font-semibold tracking-tight text-[#16181D] sm:text-4xl">
              Admin Dashboard
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#E4E6EA] bg-white px-3 py-1.5 text-xs text-[#6E7178]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFB020]" />
            Updated just now
          </span>
        </Reveal>

        <Reveal index={1}>
          <p className="mb-3 text-sm font-medium text-[#6E7178]">
            Department summary
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#E4E6EA] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card, index) => (
                <div
                  key={card.label}
                  className={`p-6 ${
                    index === 1
                      ? "border-t border-[#E4E6EA] sm:border-t-0 sm:border-l"
                      : index === 2
                      ? "border-t border-[#E4E6EA] lg:border-t-0 lg:border-l"
                      : index === 3
                      ? "border-t border-[#E4E6EA] sm:border-l lg:border-t-0"
                      : ""
                  }`}
                >
                  <p className="text-[13px] text-[#6E7178]">{card.label}</p>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight tabular-nums text-[#16181D]">
                      <CountUp value={card.value} />
                    </span>
                    <span className="text-xl font-medium text-[#6E7178]">
                      {card.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal
          index={2}
          className="mt-8 overflow-hidden rounded-lg border border-[#E4E6EA] bg-white"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#E4E6EA] px-6 py-5">
            <div>
              <h2 className="font-['Plus Jakarta Sans'] text-lg font-semibold text-[#16181D]">
                Department Breakdown
              </h2>
              <p className="mt-1 text-xs text-[#6E7178]">
                Students and subjects grouped by department
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-[#FFB020]/30 bg-[#FFB020]/10 px-3 py-1 text-xs text-[#B45309]">
              {stats.departments} total
            </span>
          </div>

          {stats.branches.length > 0 ? (
            <div>
              {stats.branches.map((b, index) => (
                <div
                  key={b._id || b.branchId || index}
                  className="flex items-center gap-4 border-b border-[#EEF0F3] px-6 py-4 transition-colors last:border-b-0 hover:bg-white/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFB020] font-['Plus Jakarta Sans'] text-xs font-semibold text-[#16181D]">
                    {(b.name || "--").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#16181D]">{b.name}</p>
                    <p className="text-xs text-[#6E7178]">{b.branchId}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-6 text-xs text-[#6E7178]">
                    <span className="text-right">
                      <span className="mr-1 font-['Plus Jakarta Sans'] text-base text-[#16181D]">
                        {b.students ?? 0}
                      </span>
                      students
                    </span>
                    <span className="text-right">
                      <span className="mr-1 font-['Plus Jakarta Sans'] text-base text-[#16181D]">
                        {b.subjects ?? 0}
                      </span>
                      subjects
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-10 text-center text-sm text-[#6E7178]">
              No department data available yet.
            </p>
          )}
        </Reveal>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">Loading...</div>
      );
    }

    const MenuItem = MENU_ITEMS.find(
      (item) => item.id === selectedMenu
    )?.component;

    if (selectedMenu === "home") {
      return (
        <>
          {renderDashboard()}
          <Profile profileData={profileData} />
        </>
      );
    }

    return MenuItem && <MenuItem />;
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/admin?page=${menuId}`);
  };

  return (
    <>
      <Navbar />
      <div
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ul
          ref={tabListRef}
          className="relative flex justify-center items-center gap-2 sm:gap-3 w-full mx-auto my-8 overflow-x-auto"
        >
          <li
            aria-hidden="true"
            className="route-tab-marker"
            style={{
              left: marker.left,
              top: marker.top,
              width: marker.width,
              height: marker.height,
            }}
          />
          {MENU_ITEMS.map((item, index) => (
            <li
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className={`${getMenuItemClass(item.id)} relative z-10`}
              onClick={() => handleMenuClick(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {renderContent()}
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
