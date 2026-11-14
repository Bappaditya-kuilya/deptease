import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import Profile from "./Profile";
import Exam from "../Exam";
import ViewMarks from "./ViewMarks";
import { useNavigate, useLocation } from "react-router-dom";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "exam", label: "Exam", component: Exam },
  { id: "marks", label: "Marks", component: ViewMarks },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();

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
      const response = await axiosWrapper.get(`/student/my-details`, {
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

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `
      text-center px-5 py-2.5 cursor-pointer
      font-medium text-sm w-full
      rounded-full whitespace-nowrap
      transition-all duration-300 ease-in-out
      ${
        isSelected
          ? "text-white bg-[#1A1D21] font-semibold border border-[#1A1D21]"
          : "text-[#6E7178] bg-transparent border border-[#E4E6EA] hover:text-[#16181D] hover:border-[#C9CCD3] hover:bg-black/40[0.03]"
      }
    `;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <span className="text-sm text-[#6E7178] animate-pulse">
            Loading...
          </span>
        </div>
      );
    }

    if (selectedMenu === "home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    const MenuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    )?.component;

    return MenuItem && <MenuItem />;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "home";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.pathname]);

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/student?page=${menuId}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-[#EFF0F2] pb-16">
        <div
          id="main-content"
          tabIndex={-1}
          className="max-w-7xl mx-auto px-4"
        >
          <ul
            ref={tabListRef}
            className="relative flex items-center gap-2 w-full mx-auto my-8 p-2 rounded-full border border-[#E4E6EA] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
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

          <div key={selectedMenu} className="fade-up">
            {renderContent()}
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
