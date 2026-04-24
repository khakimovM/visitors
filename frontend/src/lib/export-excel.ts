import { BranchInfo, VisitorDataPoint } from "@/types/analytics";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const exportToExcel = (data: VisitorDataPoint[] | BranchInfo[], filename = "hisobot.xlsx") => {
    if (!data || data.length === 0) {
        toast.warning("Ma'lumot yo‘q, eksport qilinmaydi.");
        return;
    }

    // 1️⃣ JSON → Sheet (jadval)
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2️⃣ Yangi workbook yaratish
    const workbook = XLSX.utils.book_new();

    // 3️⃣ Workbookga jadvalni qo‘shish
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hisobot");

    // 4️⃣ Faylni to‘g‘ridan-to‘g‘ri yuklab olish
    XLSX.writeFile(workbook, filename);
};
