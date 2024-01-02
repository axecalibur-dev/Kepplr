import xlsx from "xlsx";
import { Users } from "../models/users";
import CloudinaryService from "../cloudinary/cloudinary";
import Utils from "../utils/utils";
const Cloud = new CloudinaryService();
const utils = new Utils();
class ReportingService {
  generate_system_wide_report = async () => {
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
    const fileName = `System_Wide_Report__${new Date()
      .toDateString()
      .replace(/\s/g, "_")}___${new Date().getTime()}`;

    xlsx.writeFile(workBook, `src/reports/media/${fileName}.xlsx}`);
    const cloudinaryMeta = await Cloud.upload_to_cloudinary_from_project(
      `src/reports/media/${fileName}.xlsx}`,
    );

    // try {
    //   const emailReport = await utils.send_system_wide_report_via_mail(
    //     "jaibhattwebdev@gmail.com",
    //     cloudinaryMeta.secure_url,
    //   );
    // } catch (error) {
    //   return cloudinaryMeta.secure_url;
    // }

    return cloudinaryMeta.secure_url;
  };
}

export default ReportingService;
