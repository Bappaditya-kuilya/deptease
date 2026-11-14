const Branch = require("../models/branch.model");
const Subject = require("../models/subject.model");
const StudentDetails = require("../models/details/student-details.model");
const ApiResponse = require("../utils/ApiResponse");

const getBranchStatsController = async (req, res, next) => {
  try {
    const [branches, studentCounts, subjectCounts] = await Promise.all([
      Branch.find().sort({ name: 1 }).lean(),
      StudentDetails.aggregate([
        { $group: { _id: "$branchId", count: { $sum: 1 } } },
      ]),
      Subject.aggregate([
        { $group: { _id: "$branch", count: { $sum: 1 } } },
      ]),
    ]);

    const studentMap = new Map(
      studentCounts.map((item) => [String(item._id), item.count])
    );
    const subjectMap = new Map(
      subjectCounts.map((item) => [String(item._id), item.count])
    );

    const data = {
      totalBranches: branches.length,
      totalStudents: studentCounts.reduce((sum, item) => sum + item.count, 0),
      branches: branches.map((branch) => ({
        branchId: branch.branchId,
        name: branch.name,
        students: studentMap.get(String(branch._id)) || 0,
        subjects: subjectMap.get(String(branch._id)) || 0,
      })),
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const getBranchController = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const branches = await Branch.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { branchId: { $regex: search, $options: "i" } },
      ],
    });
    if (!branches || branches.length === 0) {
      return ApiResponse.error("No Branches Found", 404).send(res);
    }

    return ApiResponse.success(branches, "All Branches Loaded!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const addBranchController = async (req, res, next) => {
  let { name, branchId } = req.body;
  try {
    let existingBranch = await Branch.findOne({
      $or: [{ name }, { branchId }],
    });

    if (existingBranch) {
      return ApiResponse.error(
        "Branch with this name or ID already exists!",
        409
      ).send(res);
    }

    const newBranch = await Branch.create(req.body);
    return ApiResponse.created(newBranch, "Branch Added Successfully!").send(
      res
    );
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const updateBranchController = async (req, res, next) => {
  try {
    const { name, branchId } = req.body;

    if (name || branchId) {
      const existingBranch = await Branch.findOne({
        _id: { $ne: req.params.id },
        $or: [{ name: name || undefined }, { branchId: branchId || undefined }],
      });

      if (existingBranch) {
        return ApiResponse.error(
          "Branch with this name or ID already exists!",
          409
        ).send(res);
      }
    }

    let branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!branch) {
      return ApiResponse.error("Branch Not Found!", 404).send(res);
    }

    return ApiResponse.success(branch, "Branch Updated Successfully!").send(
      res
    );
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

const deleteBranchController = async (req, res, next) => {
  try {
    let branch = await Branch.findById(req.params.id);
    if (!branch) {
      return ApiResponse.error("Branch Not Found!", 404).send(res);
    }

    await Branch.findByIdAndDelete(req.params.id);
    return ApiResponse.success(null, "Branch Deleted Successfully!").send(res);
  } catch (error) {
    return ApiResponse.error(error.message).send(res);
  }
};

module.exports = {
  getBranchController,
  addBranchController,
  updateBranchController,
  deleteBranchController,
  getBranchStatsController,
};
