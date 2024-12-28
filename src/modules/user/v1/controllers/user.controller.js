const UserServices = require("../services/user.services");

const BaseController = require("../../../../common/controllers/base.controller");
const AsyncErrorHandler = require("../../../../common/utils/AsyncErrorHandler");

class UserController extends BaseController {
  constructor() {
    super();

    this.userServices = new UserServices();
  }

  getUserList = AsyncErrorHandler(async (req, res) => {
    const [userList, count] = await this.userServices.getUserList(req);

    if (!userList.length) {
      return this.notFound(res);
    }

    this.ok(res, "User list fetched successfully", { userList, count });
  });

  getUser = AsyncErrorHandler(async (req, res) => {
    const user = await this.userServices.getUser(req);

    if (!user) {
      return this.notFound(res);
    }

    this.ok(res, "User fetched successfully", { user });
  });

  patchUser = AsyncErrorHandler(async (req, res) => {
    const user = await this.userServices.patchUser(req);

    if (!user) {
      return this.notFound(res);
    }

    this.ok(res, "User updated successfully", { user });
  });

  deleteUser = AsyncErrorHandler(async (req, res) => {
    const user = await this.userServices.softDeleteUser(req);

    if (!user) {
      return this.notFound(res);
    }

    this.ok(res, "User deleted successfully");
  });
}

module.exports = UserController;
