import { Friends } from "../db/schema/friendSchema";
import xlsx from "xlsx";

class ReportingService {
  generate_user_report = async () => {
    const users = await Friends.find().populate("_id firstName lastName email");

    const workBook = xlsx.utils.book_new();
    const data = users.map((user) => ({
      ID: String(user._id),
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
