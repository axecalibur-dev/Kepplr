import xlsx from "xlsx";
import { Users } from "../models/users";

class ReportingService {
  generate_user_report = async () => {
    const users = await Users.findAll();

    const workBook = xlsx.utils.book_new();
    const data = users.map((user) => ({
      ID: String(user.id),
      FirstName: user.firstName,
      LastName: user["lastName"],
      Email: user["email"],
    }));

    const workSheet = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(workBook, workSheet, "Users");
    xlsx.writeFile(workBook, "output.xlsx");

    return true;
  };
}

export default ReportingService;
