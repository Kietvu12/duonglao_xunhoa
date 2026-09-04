import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Helper function to extract image URLs from HTML content
function extractImagesFromHTML(htmlContent) {
  if (!htmlContent) return [];
  
  const imageUrls = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const imageUrl = match[1];
    if (imageUrl && !imageUrls.includes(imageUrl)) {
      imageUrls.push(imageUrl);
    }
  }
  
  return imageUrls;
}

export const getAllBaiVietSuKien = async (req, res, next) => {
  try {
    const { page = 1, limit = 1000, search, category, trang_thai, id_su_kien } = req.query; // Đổi mặc định từ 10 thành 1000
    
    // Nếu limit = -1 hoặc 'all', lấy tất cả
    const shouldGetAll = limit === '-1' || limit === 'all' || limit === -1;
    
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = shouldGetAll ? null : sanitizeLimit(limit, 1000);
    const offset = shouldGetAll ? 0 : (safePage - 1) * limitValue;

    let query = `
      SELECT bvsk.*, tk.ho_ten as ten_tac_gia, sk.tieu_de as ten_su_kien
      FROM bai_viet_su_kien bvsk
      LEFT JOIN tai_khoan tk ON bvsk.id_tac_gia = tk.id
      LEFT JOIN su_kien sk ON bvsk.id_su_kien = sk.id
      WHERE bvsk.da_xoa = 0
    `;
    const params = [];

    if (search) {
      query += ' AND (bvsk.tieu_de LIKE ? OR bvsk.noi_dung LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND bvsk.category = ?';
      params.push(category);
    }

    if (trang_thai) {
      query += ' AND bvsk.trang_thai = ?';
      params.push(trang_thai);
    }

    if (id_su_kien) {
      query += ' AND bvsk.id_su_kien = ?';
      params.push(id_su_kien);
    }

    query += ' ORDER BY bvsk.ngay_dang DESC, bvsk.ngay_tao DESC';
    
    // Chỉ thêm LIMIT nếu không phải lấy tất cả
    if (!shouldGetAll) {
      query += buildLimitOffsetClause(limitValue, offset);
    }

    const [baiViets] = await pool.execute(query, params);

    res.json({
      success: true,
      data: baiViets
    });
  } catch (error) {
    next(error);
  }
};

export const getBaiVietSuKienById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [baiViets] = await pool.execute(
      `SELECT bvsk.*, tk.ho_ten as ten_tac_gia, sk.tieu_de as ten_su_kien
       FROM bai_viet_su_kien bvsk
       LEFT JOIN tai_khoan tk ON bvsk.id_tac_gia = tk.id
       LEFT JOIN su_kien sk ON bvsk.id_su_kien = sk.id
       WHERE bvsk.id = ? AND bvsk.da_xoa = 0`,
      [id]
    );

    if (baiViets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết sự kiện'
      });
    }

    // Update view count if published
    if (baiViets[0].trang_thai === 'xuat_ban') {
      await pool.execute(
        'UPDATE bai_viet_su_kien SET luot_xem = luot_xem + 1 WHERE id = ?',
        [id]
      );
      baiViets[0].luot_xem += 1;
    }

    // Get comments
    const [comments] = await pool.execute(
      'SELECT * FROM binh_luan_bai_viet_su_kien WHERE id_bai_viet = ? AND duyet = 1 ORDER BY ngay_binh_luan DESC',
      [id]
    );
    baiViets[0].binh_luan = comments;

    // Get media (images/videos)
    const [media] = await pool.execute(
      'SELECT * FROM media_bai_viet_su_kien WHERE id_bai_viet = ? ORDER BY thu_tu ASC, ngay_upload ASC',
      [id]
    );
    baiViets[0].media = media;

    res.json({
      success: true,
      data: baiViets[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createBaiVietSuKien = async (req, res, next) => {
  try {
    const {
      id_su_kien, tieu_de, slug, noi_dung, anh_dai_dien, meta_title, meta_description,
      mo_ta_ngan, category, tags, trang_thai, ngay_dang
    } = req.body;

    if (!tieu_de || !noi_dung) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Generate slug if not provided
    const finalSlug = slug || tieu_de.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug exists
    const [existing] = await pool.execute(
      'SELECT id FROM bai_viet_su_kien WHERE slug = ?',
      [finalSlug]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại, vui lòng chọn slug khác'
      });
    }

    // Sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO bai_viet_su_kien 
       (id_su_kien, tieu_de, slug, noi_dung, anh_dai_dien, meta_title, meta_description, 
        mo_ta_ngan, category, tags, trang_thai, ngay_dang, id_tac_gia, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizeValue(id_su_kien),
        tieu_de,
        finalSlug,
        noi_dung,
        sanitizeValue(anh_dai_dien),
        sanitizeValue(meta_title),
        sanitizeValue(meta_description),
        sanitizeValue(mo_ta_ngan),
        sanitizeValue(category),
        sanitizeValue(tags),
        trang_thai || 'nhap',
        sanitizeValue(ngay_dang),
        req.user?.id || null,
        ngayTaoVN
      ]
    );

    // Extract and save images from content
    const imageUrls = extractImagesFromHTML(noi_dung);
    if (imageUrls.length > 0) {
      for (let i = 0; i < imageUrls.length; i++) {
        await pool.execute(
          'INSERT INTO media_bai_viet_su_kien (id_bai_viet, loai, url, thu_tu) VALUES (?, ?, ?, ?)',
          [result.insertId, 'anh', imageUrls[i], i]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thêm bài viết sự kiện thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBaiVietSuKien = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_su_kien, tieu_de, slug, noi_dung, anh_dai_dien, meta_title, meta_description,
      mo_ta_ngan, category, tags, trang_thai, ngay_dang
    } = req.body;

    // Check if slug exists (excluding current article)
    if (slug) {
      const [existing] = await pool.execute(
        'SELECT id FROM bai_viet_su_kien WHERE slug = ? AND id != ?',
        [slug, id]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Slug đã tồn tại, vui lòng chọn slug khác'
        });
      }
    }

    // Sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const updateFields = [];
    const updateValues = [];

    if (id_su_kien !== undefined) {
      updateFields.push('id_su_kien = ?');
      updateValues.push(sanitizeValue(id_su_kien));
    }
    if (tieu_de !== undefined) {
      updateFields.push('tieu_de = ?');
      updateValues.push(tieu_de);
    }
    if (slug !== undefined) {
      updateFields.push('slug = ?');
      updateValues.push(slug);
    }
    if (noi_dung !== undefined) {
      updateFields.push('noi_dung = ?');
      updateValues.push(noi_dung);
    }
    if (anh_dai_dien !== undefined) {
      updateFields.push('anh_dai_dien = ?');
      updateValues.push(sanitizeValue(anh_dai_dien));
    }
    if (meta_title !== undefined) {
      updateFields.push('meta_title = ?');
      updateValues.push(sanitizeValue(meta_title));
    }
    if (meta_description !== undefined) {
      updateFields.push('meta_description = ?');
      updateValues.push(sanitizeValue(meta_description));
    }
    if (mo_ta_ngan !== undefined) {
      updateFields.push('mo_ta_ngan = ?');
      updateValues.push(sanitizeValue(mo_ta_ngan));
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(sanitizeValue(category));
    }
    if (tags !== undefined) {
      updateFields.push('tags = ?');
      updateValues.push(sanitizeValue(tags));
    }
    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }
    if (ngay_dang !== undefined) {
      updateFields.push('ngay_dang = ?');
      updateValues.push(sanitizeValue(ngay_dang));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    const ngayCapNhatVN = getNowForDB();
    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(ngayCapNhatVN);
    updateValues.push(id);

    await pool.execute(
      `UPDATE bai_viet_su_kien SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Update media if content changed
    if (noi_dung !== undefined) {
      // Delete old media
      await pool.execute('DELETE FROM media_bai_viet_su_kien WHERE id_bai_viet = ?', [id]);
      
      // Extract and save new images
      const imageUrls = extractImagesFromHTML(noi_dung);
      if (imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          await pool.execute(
            'INSERT INTO media_bai_viet_su_kien (id_bai_viet, loai, url, thu_tu) VALUES (?, ?, ?, ?)',
            [id, 'anh', imageUrls[i], i]
          );
        }
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật bài viết sự kiện thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBaiVietSuKien = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE bai_viet_su_kien SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa bài viết sự kiện thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Media management
export const addMediaBaiVietSuKien = async (req, res, next) => {
  try {
    const { id_bai_viet, loai, url, mo_ta, thu_tu } = req.body;

    if (!id_bai_viet || !url) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO media_bai_viet_su_kien (id_bai_viet, loai, url, mo_ta, thu_tu) VALUES (?, ?, ?, ?, ?)',
      [id_bai_viet, loai || 'anh', url, mo_ta || null, thu_tu || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm media thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMediaBaiVietSuKien = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM media_bai_viet_su_kien WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa media thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Comments management
export const getBinhLuanBaiVietSuKien = async (req, res, next) => {
  try {
    const { id_bai_viet } = req.query;

    let query = 'SELECT * FROM binh_luan_bai_viet_su_kien WHERE 1=1';
    const params = [];

    if (id_bai_viet) {
      query += ' AND id_bai_viet = ?';
      params.push(id_bai_viet);
    }

    query += ' ORDER BY ngay_binh_luan DESC';

    const [comments] = await pool.execute(query, params);

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

export const createBinhLuanBaiVietSuKien = async (req, res, next) => {
  try {
    const { id_bai_viet, ho_ten, email, noi_dung } = req.body;

    if (!id_bai_viet || !ho_ten || !email || !noi_dung) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO binh_luan_bai_viet_su_kien (id_bai_viet, ho_ten, email, noi_dung, ngay_tao) VALUES (?, ?, ?, ?, ?)',
      [id_bai_viet, ho_ten, email, noi_dung, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm bình luận thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const duyetBinhLuanBaiVietSuKien = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { duyet } = req.body;

    await pool.execute(
      'UPDATE binh_luan_bai_viet_su_kien SET duyet = ? WHERE id = ?',
      [duyet ? 1 : 0, id]
    );

    res.json({
      success: true,
      message: duyet ? 'Duyệt bình luận thành công' : 'Hủy duyệt bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBinhLuanBaiVietSuKien = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM binh_luan_bai_viet_su_kien WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
};

