const User = require("../../../../common/models/user.model");
const HttpStatusCode = require("../../../../common/constants/HttpStatusCode");
const CustomError = require("../../../../common/utils/CustomError");
const Pagination = require("../../../../common/utils/Pagination");

class UserService {
  constructor() {
    this.userModel = User;
  }

  getUserList = async (req) => {
    const { query } = req;

    const [paginatedUserList, count] = new Pagination(this.userModel, query)
      .paginate()
      .sort()
      .select()
      .filter()
      .search(["name", "role", "email"])
      .run();

    return await Promise.all([paginatedUserList, count]);
  };

  getUser = async (req) => {
    return await this.userModel.findById(req.params.id);
  };

  #validatePatchUserRequest = (req) => {
    const patchAbleFields = ["name", "email"];

    const toPatchfields = Object.keys(req.body);

    for (const field of toPatchfields) {
      if (!patchAbleFields.includes(field)) {
        throw new CustomError(
          HttpStatusCode.BAD_REQUEST,
          `${field} is not allowed to be updated`
        );
      }
    }

    return;
  };

  patchUser = async (req) => {
    this.#validatePatchUserRequest(req);

    return await this.userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  };

  softDeleteUser = async (req) => {
    return await this.userModel.findByIdAndUpdate(req.params.id, {
      deleted: true,
      deletedAt: Date.now(),
    });
  };
}

module.exports = UserService;
