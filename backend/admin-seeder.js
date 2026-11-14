const adminDetails = require("./models/details/admin-details.model");
const facultyDetails = require("./models/details/faculty-details.model");
const studentDetails = require("./models/details/student-details.model");
const Branch = require("./models/branch.model");
const Subject = require("./models/subject.model");
const Notice = require("./models/notice.model");
const TimeTable = require("./models/timetable.model");
const Exam = require("./models/exam.model");
const Marks = require("./models/marks.model");
const Material = require("./models/material.model");
const ResetPassword = require("./models/reset-password.model");
const connectToMongo = require("./Database/db");
const mongoose = require("mongoose");

const ADMIN_PASSWORD = "admin123";
const FACULTY_PASSWORD = "faculty123";
const STUDENT_PASSWORD = "student123";

const branches = [
  { branchId: "CSE", name: "Computer Science and Engineering" },
  { branchId: "ECE", name: "Electronics and Communication Engineering" },
  { branchId: "MECH", name: "Mechanical Engineering" },
  { branchId: "IT", name: "Information Technology" },
];

const subjectTemplates = [
  { name: "Mathematics", code: "MATH", semester: 1, credits: 4 },
  { name: "Engineering Physics", code: "PHY", semester: 1, credits: 4 },
  { name: "Programming for Problem Solving", code: "CPS", semester: 2, credits: 3 },
  { name: "Digital Electronics", code: "DE", semester: 3, credits: 4 },
];

// 3 hand-picked demo students (credentials printed at the end) plus a
// deterministic pool of 65 more, so every branch/semester has a full class.
const STUDENT_FIRST = [
  ["Ananya", "female"], ["Arjun", "male"], ["Ishita", "female"],
  ["Kabir", "male"], ["Myra", "female"], ["Dev", "male"],
  ["Sana", "female"], ["Reyansh", "male"], ["Aadhya", "female"],
  ["Vivaan", "male"], ["Navya", "female"], ["Advait", "male"],
  ["Meera", "female"], ["Yash", "male"], ["Kiara", "female"],
  ["Atharv", "male"], ["Zara", "female"], ["Dhruv", "male"],
  ["Ira", "female"], ["Shaurya", "male"], ["Anika", "female"],
  ["Rudra", "male"], ["Sara", "female"], ["Om", "male"],
];
const STUDENT_LAST = ["Nair", "Kulkarni", "Reddy", "Menon", "Bose", "Kapoor", "Joshi", "Malhotra"];
const STUDENT_MIDDLE = ["Kumar", "Rajesh", "Amit", "Suresh", "Ramesh", "Vijay", "Ashish", "Deepak"];
const STUDENT_TOWNS = [
  ["Pune", "Maharashtra", "411001"], ["Jaipur", "Rajasthan", "302001"],
  ["Surat", "Gujarat", "395001"], ["Chennai", "Tamil Nadu", "600001"],
  ["Kochi", "Kerala", "682001"], ["Indore", "Madhya Pradesh", "452001"],
  ["Nagpur", "Maharashtra", "440001"], ["Patna", "Bihar", "800001"],
];

function makeStudentTemplates() {
  const templates = [
    {
      firstName: "Aarav",
      middleName: "Kumar",
      lastName: "Mehta",
      email: "aarav.mehta@example.com",
      profile: "Aarav_Mehta.svg",
      phone: "9876501001",
      semester: 1,
      gender: "male",
      dob: "2005-03-14",
      address: "12 Lake View Road",
      city: "Ahmedabad",
      state: "Gujarat",
      pincode: "380001",
      country: "India",
    },
    {
      firstName: "Diya",
      middleName: "Rajesh",
      lastName: "Sharma",
      email: "diya.sharma@example.com",
      profile: "Diya_Sharma.svg",
      phone: "9876501002",
      semester: 2,
      gender: "female",
      dob: "2004-07-22",
      address: "45 Rose Villa, MG Road",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      country: "India",
    },
    {
      firstName: "Rohan",
      middleName: "Amit",
      lastName: "Patel",
      email: "rohan.patel@example.com",
      profile: "Rohan_Patel.svg",
      phone: "9876501003",
      semester: 3,
      gender: "male",
      dob: "2004-01-09",
      address: "78 Green Avenue",
      city: "Surat",
      state: "Gujarat",
      pincode: "395001",
      country: "India",
    },
  ];
  for (let i = 0; i < 65; i++) {
    const [firstName, gender] = STUDENT_FIRST[i % STUDENT_FIRST.length];
    const lastName = STUDENT_LAST[Math.floor(i / STUDENT_FIRST.length) % STUDENT_LAST.length];
    const middleName = STUDENT_MIDDLE[i % STUDENT_MIDDLE.length];
    const [city, state, pincode] = STUDENT_TOWNS[i % STUDENT_TOWNS.length];
    templates.push({
      firstName,
      middleName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      profile: `${firstName}_${lastName}.svg`,
      phone: `9876501${100 + i}`,
      semester: (i % 3) + 1,
      gender,
      dob: `200${4 + (i % 3)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 28)).padStart(2, "0")}`,
      address: `${100 + i} Campus Hostel`,
      city,
      state,
      pincode,
      country: "India",
    });
  }
  return templates;
}

const studentTemplates = makeStudentTemplates();


// 4 hand-picked demo teachers plus a deterministic pool of 8 more
// (spread across branches in the seeding loop below).
const FACULTY_FIRST = [
  ["Meena", "female"], ["Arvind", "male"], ["Lakshmi", "female"],
  ["Priya", "female"], ["Rajesh", "male"], ["Kavita", "female"],
  ["Sanjay", "male"], ["Deepika", "female"],
];
const FACULTY_LAST = ["Krishnan", "Menon", "Venkat", "Nair", "Gupta", "Joshi", "Reddy", "Raman"];
const FACULTY_DESIGNATION = ["Professor", "Associate Professor", "Assistant Professor"];
const FACULTY_TOWNS = [
  ["Pune", "Maharashtra", "411001"], ["Chennai", "Tamil Nadu", "600001"],
  ["Kochi", "Kerala", "682001"], ["Mumbai", "Maharashtra", "400001"],
  ["Bhopal", "Madhya Pradesh", "462001"], ["Delhi", "Delhi", "110001"],
  ["Kolkata", "West Bengal", "700001"], ["Hyderabad", "Telangana", "500001"],
];

function makeFacultyTemplates() {
  const templates = [
    {
      employeeId: 2001,
      firstName: "Ritu",
      lastName: "Sharma",
      email: "ritu.sharma.faculty@example.com",
      profile: "Ritu_Sharma.svg",
      phone: "9876502001",
      designation: "Associate Professor",
      gender: "female",
      dob: "1985-05-12",
      address: "3 Faculty Quarters",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      country: "India",
    },
    {
      employeeId: 2002,
      firstName: "Suresh",
      lastName: "Iyer",
      email: "suresh.iyer.faculty@example.com",
      profile: "Suresh_Iyer.svg",
      phone: "9876502002",
      designation: "Assistant Professor",
      gender: "male",
      dob: "1987-09-30",
      address: "5 Faculty Quarters",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
      country: "India",
    },
    {
      employeeId: 2003,
      firstName: "Anita",
      lastName: "Desai",
      email: "anita.desai.faculty@example.com",
      profile: "Anita_Desai.svg",
      phone: "9876502003",
      designation: "Professor",
      gender: "female",
      dob: "1982-02-18",
      address: "9 Faculty Quarters",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    {
      employeeId: 2004,
      firstName: "Vikram",
      lastName: "Nair",
      email: "vikram.nair.faculty@example.com",
      profile: "Vikram_Nair.svg",
      phone: "9876502004",
      designation: "Assistant Professor",
      gender: "male",
      dob: "1989-11-05",
      address: "11 Faculty Quarters",
      city: "Kochi",
      state: "Kerala",
      pincode: "682001",
      country: "India",
    },
  ];
  for (let i = 0; i < 8; i++) {
    const [firstName, gender] = FACULTY_FIRST[i % FACULTY_FIRST.length];
    const lastName = FACULTY_LAST[i % FACULTY_LAST.length];
    const [city, state, pincode] = FACULTY_TOWNS[i % FACULTY_TOWNS.length];
    templates.push({
      employeeId: 2005 + i,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.faculty@example.com`,
      profile: `${firstName}_${lastName}.svg`,
      phone: `98765020${String(5 + i).padStart(2, "0")}`,
      designation: FACULTY_DESIGNATION[i % FACULTY_DESIGNATION.length],
      gender,
      dob: `198${2 + (i % 7)}-${String(1 + (i % 12)).padStart(2, "0")}-${String(1 + (i % 28)).padStart(2, "0")}`,
      address: `${13 + i} Faculty Quarters`,
      city,
      state,
      pincode,
      country: "India",
    });
  }
  return templates;
}

const facultyTemplates = makeFacultyTemplates();


const seedData = async () => {
  try {
    await connectToMongo();
    // wait for the connection to be established (connectToMongo is fire-and-forget)
    await mongoose.connection.asPromise();

    // Clear existing demo data (admin is cleared and re-seeded below as well)
    await Promise.all([
      adminDetails.deleteMany({}),
      facultyDetails.deleteMany({}),
      studentDetails.deleteMany({}),
      Branch.deleteMany({}),
      Subject.deleteMany({}),
      Notice.deleteMany({}),
      TimeTable.deleteMany({}),
      Exam.deleteMany({}),
      Marks.deleteMany({}),
      Material.deleteMany({}),
      ResetPassword.deleteMany({}),
    ]);

    // --- Admin (unchanged demo admin) ---
    const employeeId = 123456;
    const adminDetail = {
      employeeId: employeeId,
      firstName: "Sundar",
      middleName: "R",
      lastName: "Pichai",
      email: "admin@gmail.com",
      phone: "1234567890",
      profile: "Faculty_Profile_123456.jpg",
      address: "123 College Street",
      city: "College City",
      state: "State",
      pincode: "123456",
      country: "India",
      gender: "male",
      dob: new Date("1990-01-01"),
      designation: "System Administrator",
      joiningDate: new Date(),
      salary: 50000,
      status: "active",
      isSuperAdmin: true,
      emergencyContact: {
        name: "Emergency Contact",
        relationship: "Spouse",
        phone: "9876543210",
      },
      bloodGroup: "O+",
      password: ADMIN_PASSWORD,
    };
    await adminDetails.create(adminDetail);

    // --- Branches (departments) ---
    const branchDocs = await Branch.create(branches);

    // --- Subjects: 4 per branch, spread across semesters 1-3 ---
    const subjectInputs = [];
    for (const branch of branchDocs) {
      for (const template of subjectTemplates) {
        subjectInputs.push({
          name: template.name,
          code: `${branch.branchId}-${template.code}`,
          branch: branch._id,
          semester: template.semester,
          credits: template.credits,
        });
      }
    }
    const subjectDocs = await Subject.create(subjectInputs);

    // --- Students: 17 per branch (68 total), unique emails, semesters 1-3 ---
    const STUDENTS_PER_BRANCH = 17;
    let enrollmentNo = 100001;
    const studentDocs = [];
    branchDocs.forEach((branch, branchIndex) => {
      studentTemplates
        .slice(
          branchIndex * STUDENTS_PER_BRANCH,
          (branchIndex + 1) * STUDENTS_PER_BRANCH
        )
        .forEach((template) => {
          studentDocs.push({
            ...template,
            enrollmentNo: enrollmentNo++,
            branchId: branch._id,
            password: STUDENT_PASSWORD,
          });
        });
    });
    const createdStudents = await studentDetails.create(studentDocs);

    // --- Faculty: 3 per branch (12 total) ---
    const facultyDocs = facultyTemplates.map((template, index) => ({
      ...template,
      branchId: branchDocs[index % branchDocs.length]._id,
      joiningDate: new Date("2020-07-01"),
      salary: 75000 + index * 5000,
      status: "active",
      bloodGroup: "B+",
      password: FACULTY_PASSWORD,
    }));
    const createdFaculty = await facultyDetails.create(facultyDocs);

    // --- Notices ---
    await Notice.create([      {
        title: "Semester Registration Open",
        description:
          "Semester registration for the current academic session is now open. Students must complete registration before the last date via the department office.",
        type: "both",
      },
      {
        title: "Mid-Semester Exam Schedule Released",
        description:
          "The mid-semester examination schedule has been published. Check the exam section for dates, timings and the timetable download.",
        type: "student",
      },
    ]);

    // --- Timetables: one per branch per semester (1-3) ---
    const timetableDocs = [];
    for (const branch of branchDocs) {
      for (const semester of [1, 2, 3]) {
        timetableDocs.push({
          link: "Demo_Timetable.png",
          branch: branch._id,
          semester,
        });
      }
    }
    await TimeTable.create(timetableDocs);

    // --- Exams (global, not branch-scoped) ---
    const examDocs = await Exam.create([
      {
        name: "Mid Semester Test",
        date: new Date("2026-09-15"),
        semester: 1,
        examType: "mid",
        timetableLink: "Demo_Timetable.png",
        totalMarks: 100,
      },
      {
        name: "Mid Semester Test",
        date: new Date("2026-09-17"),
        semester: 2,
        examType: "mid",
        timetableLink: "Demo_Timetable.png",
        totalMarks: 100,
      },
      {
        name: "Mid Semester Test",
        date: new Date("2026-09-19"),
        semester: 3,
        examType: "mid",
        timetableLink: "Demo_Timetable.png",
        totalMarks: 100,
      },
      {
        name: "End Semester Exam",
        date: new Date("2026-11-20"),
        semester: 1,
        examType: "end",
        timetableLink: "Demo_Timetable.png",
        totalMarks: 100,
      },
    ]);
    const examBySemester = {};
    examDocs.forEach((exam) => {
      if (!examBySemester[exam.semester] || exam.examType === "mid") {
        examBySemester[exam.semester] = exam;
      }
    });

    // --- Marks: every student, their branch subjects, mid-term exam ---
    const marksDocs = [];
    for (const student of createdStudents) {
      const branchSubjects = subjectDocs.filter(
        (subject) =>
          String(subject.branch) === String(student.branchId) &&
          subject.semester === student.semester
      );
      const exam = examBySemester[student.semester];
      branchSubjects.forEach((subject, index) => {
        marksDocs.push({
          studentId: student._id,
          subjectId: subject._id,
          marksObtained: 55 + ((student.enrollmentNo + index * 7) % 40),
          semester: student.semester,
          examId: exam._id,
        });
      });
    }
    await Marks.create(marksDocs);

    // --- Materials: one notes file per branch (semester 1) ---
    const materialDocs = branchDocs.map((branch, index) => ({
      title: `${branch.branchId} Semester 1 - Lecture Notes`,
      subject: subjectDocs.find(
        (s) => String(s.branch) === String(branch._id) && s.semester === 1
      )._id,
      faculty: createdFaculty[index]._id,
      file: "Demo_Timetable.png",
      semester: 1,
      branch: branch._id,
      type: "notes",
    }));
    await Material.create(materialDocs);

    console.log("\n=== Demo Data Seeded ===");
    console.log(`Branches:   ${branchDocs.length}`);
    console.log(`Subjects:   ${subjectDocs.length}`);
    console.log(`Students:   ${createdStudents.length}`);
    console.log(`Faculty:    ${createdFaculty.length}`);
    console.log(`Notices:    2`);
    console.log(`Timetables: ${timetableDocs.length}`);
    console.log(`Exams:      ${examDocs.length}`);
    console.log(`Marks:      ${marksDocs.length}`);
    console.log(`Materials:  ${materialDocs.length}`);

    console.log("\n=== Demo Credentials ===");
    console.log("\n-- Admin --");
    console.log("Email:      ", adminDetail.email);
    console.log("Employee ID:", employeeId);
    console.log("Password:   ", ADMIN_PASSWORD);

    console.log("\n-- Faculty --");
    const demoFaculty = createdFaculty[0];
    console.log("Name:       ", `${demoFaculty.firstName} ${demoFaculty.lastName}`);
    console.log("Email:      ", demoFaculty.email);
    console.log("Employee ID:", demoFaculty.employeeId);
    console.log("Password:   ", FACULTY_PASSWORD);

    console.log("\n-- Student --");
    const demoStudent = createdStudents[0];
    console.log(
      "Name:       ",
      `${demoStudent.firstName} ${demoStudent.middleName} ${demoStudent.lastName}`
    );
    console.log("Email:      ", demoStudent.email);
    console.log("Enrollment: ", demoStudent.enrollmentNo);
    console.log("Password:   ", STUDENT_PASSWORD);
    console.log("=======================\n");

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error while seeding:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();
