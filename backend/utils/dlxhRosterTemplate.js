import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** File mẫu roster DLXH (ma trận Họ và tên × ngày) — dùng cho tải mẫu & import */
export const DLXH_ROSTER_TEMPLATE_FILENAME = 'DLXH_ROSTER  2026.xlsx';

export const getDlxhRosterTemplatePath = () =>
  path.join(__dirname, '..', DLXH_ROSTER_TEMPLATE_FILENAME);

export const readDlxhRosterTemplateBuffer = () => {
  const filePath = getDlxhRosterTemplatePath();
  if (!existsSync(filePath)) {
    throw new Error(
      `Không tìm thấy file mẫu "${DLXH_ROSTER_TEMPLATE_FILENAME}" trong thư mục backend`
    );
  }
  return readFileSync(filePath);
};
