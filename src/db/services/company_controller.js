import { Company } from "../schema/companySchema";
import { Friends } from "../schema/friendSchema";
import APIResponseBuilder from "./response_builder";
import { GraphQLError } from "graphql/index";
import HttpStatus from "http-status-codes";
const APIResponse = new APIResponseBuilder();

class CompanyController {
  create_new_company = async (parent, { input }) => {
    const current_company = await Company.findOne({
      email: input.email,
    });

    if (!current_company) {
      const newCompany = new Company({
        company_name: input.company_name,
        email: input.email,
        building: input.building,
        locality: input.locality,
        city: input.city,
        state: input.state,
        primary_contact: input.primary_contact,
        secondary_contact: input.secondary_contact,
      });

      const current_company = await newCompany.save();
      return APIResponse.auth_response(
        "Company created success",
        current_company,
        {},
      );
    }

    throw new GraphQLError("Company for this email already exists.", {
      extensions: {
        name: "ServiceException",
        status: HttpStatus.BAD_REQUEST,
      },
    });
  };
}

export default CompanyController;
