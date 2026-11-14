import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "student info", label: "Student Info", component: StudentFinder },
  { id: "marks", label: "Marks", component: Marks },
  { id: "exam", label: "Exam", component: Exam },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  // Traveling amber route marker for the tab strip
  const tabRefs = useRef([]);
  const tabListRef = useRef(null);
  const [marker, setMarker] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const list = tabListRef.current;
    const activeIndex = MENU_ITEMS.findIndex(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `text-center px-6 py-2.5 cursor-pointer font-medium text-sm w-full rounded-full transition-all duration-300 font-['Plus_Jakarta_Sans'] tracking-wide ${
      isSelected
        ? "text-white bg-[#1A1D21]"
        : "text-[#6E7178] hover:text-[#16181D] hover:bg-black/40[0.04]"
    }`;
  };

  const renderContent = () => {
    if (selectedMenu === "Home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    const menuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    );

    if (menuItem && menuItem.component) {
      const Component = menuItem.component;
      return <Component />;
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6"
      >
        <ul
          ref={tabListRef}
          className="relative fade-up flex justify-evenly items-center gap-2 w-full mx-auto my-8 p-1.5 rounded-full border border-[#E4E6EA] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
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
              onClick={() => setSelectedMenu(item.label)}
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
