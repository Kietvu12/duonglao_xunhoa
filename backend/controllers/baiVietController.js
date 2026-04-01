import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { createNotificationForAdmins } from '../services/notificationService.js';
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

function slugifyText(value = '') {
  const normalized = String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return normalized || 'bai-viet';
}

async function generateUniqueSlug(baseSlug) {
  let candidateSlug = baseSlug;
  let index = 1;

  while (true) {
    const [existing] = await pool.execute(
      'SELECT id FROM bai_viet WHERE slug = ? LIMIT 1',
      [candidateSlug]
    );

    if (existing.length === 0) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${index}`;
    index += 1;
  }
}

export const getAllBaiViet = async (req, res, next) => {
  try {
    const { page = 1, limit = 9, search, category, trang_thai, start_date, end_date } = req.query;
    
    // Nếu limit = -1 hoặc 'all', lấy tất cả
    const shouldGetAll = limit === '-1' || limit === 'all' || limit === -1;
    
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = shouldGetAll ? null : sanitizeLimit(limit, 9);
    const offset = shouldGetAll ? 0 : (safePage - 1) * limitValue;

    let query = `
      SELECT bv.*, tk.ho_ten as ten_tac_gia
      FROM bai_viet bv
      LEFT JOIN tai_khoan tk ON bv.id_tac_gia = tk.id
      WHERE bv.da_xoa = 0
    `;
    const params = [];

    if (search) {
      query += ' AND (bv.tieu_de LIKE ? OR bv.noi_dung LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (category) {
      query += ' AND bv.category = ?';
      params.push(category);
    }

    if (trang_thai) {
      query += ' AND bv.trang_thai = ?';
      params.push(trang_thai);
    }

    if (start_date) {
      query += ' AND DATE(bv.ngay_dang) >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND DATE(bv.ngay_dang) <= ?';
      params.push(end_date);
    }

    // Get total count
    const countQuery = query.replace('SELECT bv.*, tk.ho_ten as ten_tac_gia', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.execute(countQuery, params);
    const total = countResult[0].total;

    query += ' ORDER BY bv.ngay_dang DESC, bv.ngay_tao DESC';
    
    if (!shouldGetAll) {
      query += buildLimitOffsetClause(limitValue, offset);
    }

    const [baiViets] = await pool.execute(query, params);

    res.json({
      success: true,
      data: baiViets,
      pagination: {
        page: safePage,
        limit: limitValue || total,
        total,
        totalPages: limitValue ? Math.ceil(total / limitValue) : 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBaiVietById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [baiViets] = await pool.execute(
      `SELECT bv.*, tk.ho_ten as ten_tac_gia
       FROM bai_viet bv
       LEFT JOIN tai_khoan tk ON bv.id_tac_gia = tk.id
       WHERE bv.id = ? AND bv.da_xoa = 0`,
      [id]
    );

    if (baiViets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    // Update view count if published
    if (baiViets[0].trang_thai === 'xuat_ban') {
      await pool.execute(
        'UPDATE bai_viet SET luot_xem = luot_xem + 1 WHERE id = ?',
        [id]
      );
      baiViets[0].luot_xem += 1;
    }

    // Get comments
    const [comments] = await pool.execute(
      'SELECT * FROM binh_luan_bai_viet WHERE id_bai_viet = ? AND duyet = 1 ORDER BY ngay_binh_luan DESC',
      [id]
    );
    baiViets[0].binh_luan = comments;

    // Get media (images/videos)
    const [media] = await pool.execute(
      'SELECT * FROM media_bai_viet WHERE id_bai_viet = ? ORDER BY thu_tu ASC, ngay_upload ASC',
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

export const createBaiViet = async (req, res, next) => {
  try {
    const {
      tieu_de, slug, noi_dung, anh_dai_dien, meta_title, meta_description,
      mo_ta_ngan, category, tags, trang_thai, ngay_dang
    } = req.body;

    console.log('Received data:', { tieu_de, anh_dai_dien, meta_title, meta_description });

    if (!tieu_de || !noi_dung) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Always generate a unique slug to avoid create conflicts.
    const requestedSlug = slugifyText(slug || tieu_de);
    const finalSlug = await generateUniqueSlug(requestedSlug);

    // Ensure all undefined values are converted to null for SQL
    // Convert empty strings to null for optional fields
    const finalAnhDaiDien = (anh_dai_dien && anh_dai_dien.trim()) ? anh_dai_dien.trim() : null;
    const finalMetaTitle = (meta_title && meta_title.trim()) ? meta_title.trim() : null;
    const finalMetaDescription = (meta_description && meta_description.trim()) ? meta_description.trim() : null;
    const finalMoTaNgan = (mo_ta_ngan && mo_ta_ngan.trim()) ? mo_ta_ngan.trim() : null;
    const finalCategory = (category && category.trim()) ? category.trim() : null;
    const finalTags = (tags && tags.trim()) ? tags.trim() : null;

    console.log('Inserting with values:', { 
      anh_dai_dien: finalAnhDaiDien, 
      meta_title: finalMetaTitle,
      category: finalCategory 
    });

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO bai_viet 
       (tieu_de, slug, noi_dung, anh_dai_dien, meta_title, meta_description, 
        mo_ta_ngan, category, tags, trang_thai, ngay_dang, id_tac_gia, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tieu_de || null,
        finalSlug || null,
        noi_dung || null,
        finalAnhDaiDien,
        finalMetaTitle,
        finalMetaDescription,
        finalMoTaNgan,
        finalCategory,
        finalTags,
        trang_thai || 'nhap',
        ngay_dang || null,
        req.user?.id || null,
        ngayTaoVN
      ]
    );

    const baiVietId = result.insertId;

    // Save thumbnail image (anh_dai_dien) to media_bai_viet if provided
    let mediaIndex = 0;
    if (finalAnhDaiDien) {
      // Check if thumbnail already exists
      const [existingThumbnail] = await pool.execute(
        'SELECT id FROM media_bai_viet WHERE id_bai_viet = ? AND url = ?',
        [baiVietId, finalAnhDaiDien]
      );
      
      if (existingThumbnail.length === 0) {
        await pool.execute(
          `INSERT INTO media_bai_viet 
           (id_bai_viet, loai, url, mo_ta, thu_tu)
           VALUES (?, ?, ?, ?, ?)`,
          [
            baiVietId || null,
            'anh',
            finalAnhDaiDien,
            'Ảnh đại diện',
            mediaIndex++
          ]
        );
      }
    }

    // Extract images from HTML content and save to media_bai_viet
    const imagesFromContent = extractImagesFromHTML(noi_dung);
    if (imagesFromContent.length > 0) {
      for (let i = 0; i < imagesFromContent.length; i++) {
        const imageUrl = imagesFromContent[i];
        // Skip if it's the thumbnail (already saved)
        if (imageUrl === finalAnhDaiDien) continue;
        
        // Check if image already exists
        const [existing] = await pool.execute(
          'SELECT id FROM media_bai_viet WHERE id_bai_viet = ? AND url = ?',
          [baiVietId, imageUrl]
        );
        
        if (existing.length === 0) {
          await pool.execute(
            `INSERT INTO media_bai_viet 
             (id_bai_viet, loai, url, mo_ta, thu_tu)
             VALUES (?, ?, ?, ?, ?)`,
            [
              baiVietId || null,
              'anh',
              imageUrl,
              null,
              mediaIndex++
            ]
          );
        }
      }
    }

    // Handle media gallery if provided (separate from embedded images)
    if (req.body.media && Array.isArray(req.body.media) && req.body.media.length > 0) {
      for (let i = 0; i < req.body.media.length; i++) {
        const mediaItem = req.body.media[i];
        // Check if already exists (from content extraction)
        const [existing] = await pool.execute(
          'SELECT id FROM media_bai_viet WHERE id_bai_viet = ? AND url = ?',
          [baiVietId, mediaItem.url]
        );
        
        if (existing.length === 0) {
          await pool.execute(
            `INSERT INTO media_bai_viet 
             (id_bai_viet, loai, url, mo_ta, thu_tu)
             VALUES (?, ?, ?, ?, ?)`,
            [
              baiVietId || null,
              mediaItem.loai || 'anh',
              mediaItem.url || null,
              mediaItem.mo_ta || null,
              (imagesFromContent.length + i)
            ]
          );
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Tạo bài viết thành công',
      data: { id: baiVietId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBaiViet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const allowedFields = [
      'tieu_de', 'slug', 'noi_dung', 'anh_dai_dien', 'meta_title', 'meta_description',
      'mo_ta_ngan', 'category', 'tags', 'trang_thai', 'ngay_dang'
    ];

    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        // Convert undefined to null for SQL
        const value = updateData[field] === undefined ? null : (updateData[field] || null);
        updateValues.push(value);
      }
    }

    // Handle thumbnail image (anh_dai_dien) update
    const newAnhDaiDien = updateData.anh_dai_dien;
    let thumbnailUrl = null;
    if (newAnhDaiDien !== undefined) {
      const finalAnhDaiDien = (newAnhDaiDien && newAnhDaiDien.trim()) ? newAnhDaiDien.trim() : null;
      thumbnailUrl = finalAnhDaiDien;
      
      if (finalAnhDaiDien) {
        // Check if thumbnail already exists in media_bai_viet
        const [existingThumbnail] = await pool.execute(
          'SELECT id FROM media_bai_viet WHERE id_bai_viet = ? AND url = ?',
          [id, finalAnhDaiDien]
        );
        
        if (existingThumbnail.length === 0) {
          // Get current max thu_tu
          const [maxOrder] = await pool.execute(
            'SELECT COALESCE(MAX(thu_tu), -1) + 1 as next_order FROM media_bai_viet WHERE id_bai_viet = ?',
            [id]
          );
          const nextOrder = maxOrder[0].next_order;
          
          await pool.execute(
            `INSERT INTO media_bai_viet 
             (id_bai_viet, loai, url, mo_ta, thu_tu)
             VALUES (?, ?, ?, ?, ?)`,
            [
              id || null,
              'anh',
              finalAnhDaiDien,
              'Ảnh đại diện',
              nextOrder
            ]
          );
        }
      }
    }

    // Extract images from HTML content if noi_dung is being updated
    const newNoiDung = updateData.noi_dung;
    let mediaIndex = 0;
    if (newNoiDung !== undefined) {
      // Get current max thu_tu for content images
      const [maxOrder] = await pool.execute(
        'SELECT COALESCE(MAX(thu_tu), -1) + 1 as next_order FROM media_bai_viet WHERE id_bai_viet = ?',
        [id]
      );
      mediaIndex = maxOrder[0].next_order;
      
      const imagesFromContent = extractImagesFromHTML(newNoiDung);
      
      // Get current images in database
      const [currentMedia] = await pool.execute(
        'SELECT url FROM media_bai_viet WHERE id_bai_viet = ?',
        [id]
      );
      const currentUrls = currentMedia.map(m => m.url);
      
      // Add new images from content
      if (imagesFromContent.length > 0) {
        for (let i = 0; i < imagesFromContent.length; i++) {
          const imageUrl = imagesFromContent[i];
          // Skip if it's the thumbnail (already saved) or already exists
          if (imageUrl === thumbnailUrl || currentUrls.includes(imageUrl)) continue;
          
          // Check if already exists (might have been added by media gallery)
          const [existing] = await pool.execute(
            'SELECT id FROM media_bai_viet WHERE id_bai_viet = ? AND url = ?',
            [id, imageUrl]
          );
          
          if (existing.length === 0) {
            await pool.execute(
              `INSERT INTO media_bai_viet 
               (id_bai_viet, loai, url, mo_ta, thu_tu)
               VALUES (?, ?, ?, ?, ?)`,
              [
                id || null,
                'anh',
                imageUrl,
                null,
                mediaIndex++
              ]
            );
          }
        }
      }
      
      // Note: We keep all existing media, even if removed from content
      // This allows users to manage media via gallery separately
    }

    // Handle media gallery update if provided (separate from embedded images)
    const hasMediaUpdate = updateData.media !== undefined;
    if (hasMediaUpdate) {
      // If media is an array, update media gallery
      if (Array.isArray(updateData.media)) {
        // Get images from content to avoid duplicates
        const imagesFromContent = newNoiDung ? extractImagesFromHTML(newNoiDung) : [];
        
        // Delete existing media gallery items (not from content)
        // Get all current media URLs
        const [allCurrentMedia] = await pool.execute(
          'SELECT url FROM media_bai_viet WHERE id_bai_viet = ?',
          [id]
        );
        const allCurrentUrls = allCurrentMedia.map(m => m.url);
        
        // Find URLs to delete (in gallery but not in new media list and not in content)
        const newMediaUrls = updateData.media.map(m => m.url);
        const urlsToDelete = allCurrentUrls.filter(url => 
          !newMediaUrls.includes(url) && !imagesFromContent.includes(url)
        );
        
        // Delete media that are no longer in gallery and not in content
        if (urlsToDelete.length > 0) {
          await pool.execute(
            `DELETE FROM media_bai_viet 
             WHERE id_bai_viet = ? 
             AND url IN (${urlsToDelete.map(() => '?').join(',')})`,
            [id, ...urlsToDelete]
          );
        }

        // Insert new media gallery items
        for (let i = 0; i < updateData.media.length; i++) {
          const mediaItem = updateData.media[i];
          // Check if already exists (from content extraction)
          const [existing] = await pool.execute(
            'SELECT id FROM media_bai_viet WHERE id_bai_viet = ? AND url = ?',
            [id, mediaItem.url]
          );
          
          if (existing.length === 0) {
            await pool.execute(
              `INSERT INTO media_bai_viet 
               (id_bai_viet, loai, url, mo_ta, thu_tu)
               VALUES (?, ?, ?, ?, ?)`,
              [
                id || null,
                mediaItem.loai || 'anh',
                mediaItem.url || null,
                mediaItem.mo_ta || null,
                (imagesFromContent.length + i)
              ]
            );
          }
        }
      }
    }

    if (updateFields.length === 0 && !hasMediaUpdate) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    // Update bài viết nếu có fields khác
    if (updateFields.length > 0) {
      const ngayCapNhatVN = getNowForDB();
      updateFields.push('ngay_cap_nhat = ?');
      updateValues.push(ngayCapNhatVN);
      updateValues.push(id);
      await pool.execute(
        `UPDATE bai_viet SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    res.json({
      success: true,
      message: 'Cập nhật bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBaiViet = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE bai_viet SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    // Media will be automatically deleted due to CASCADE foreign key

    res.json({
      success: true,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ========== Media Management Functions ==========

// Thêm media vào bài viết
export const addMediaToBaiViet = async (req, res, next) => {
  try {
    const { id } = req.params; // id của bài viết
    const { loai, url, mo_ta, thu_tu } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL là bắt buộc'
      });
    }

    // Kiểm tra bài viết tồn tại
    const [baiViets] = await pool.execute(
      'SELECT id FROM bai_viet WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (baiViets.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    // Lấy thứ tự cao nhất nếu không có thu_tu
    let finalThuTu = thu_tu;
    if (finalThuTu === undefined || finalThuTu === null) {
      const [maxOrder] = await pool.execute(
        'SELECT COALESCE(MAX(thu_tu), -1) + 1 as next_order FROM media_bai_viet WHERE id_bai_viet = ?',
        [id]
      );
      finalThuTu = maxOrder[0].next_order;
    }

    const [result] = await pool.execute(
      `INSERT INTO media_bai_viet 
       (id_bai_viet, loai, url, mo_ta, thu_tu)
       VALUES (?, ?, ?, ?, ?)`,
      [id, loai || 'anh', url, mo_ta || null, finalThuTu]
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

// Cập nhật media
export const updateMediaBaiViet = async (req, res, next) => {
  try {
    const { id, mediaId } = req.params; // id bài viết, mediaId media
    const updateData = req.body;

    const allowedFields = ['loai', 'url', 'mo_ta', 'thu_tu'];
    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        // Convert undefined to null for SQL
        const value = updateData[field] === undefined ? null : (updateData[field] || null);
        updateValues.push(value);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    // Kiểm tra media thuộc về bài viết
    const [media] = await pool.execute(
      'SELECT id FROM media_bai_viet WHERE id = ? AND id_bai_viet = ?',
      [mediaId, id]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy media'
      });
    }

    updateValues.push(mediaId);

    await pool.execute(
      `UPDATE media_bai_viet SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật media thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa media
export const deleteMediaBaiViet = async (req, res, next) => {
  try {
    const { id, mediaId } = req.params; // id bài viết, mediaId media

    // Kiểm tra media thuộc về bài viết
    const [media] = await pool.execute(
      'SELECT id FROM media_bai_viet WHERE id = ? AND id_bai_viet = ?',
      [mediaId, id]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy media'
      });
    }

    await pool.execute(
      'DELETE FROM media_bai_viet WHERE id = ?',
      [mediaId]
    );

    res.json({
      success: true,
      message: 'Xóa media thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách media của bài viết
export const getMediaBaiViet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [media] = await pool.execute(
      'SELECT * FROM media_bai_viet WHERE id_bai_viet = ? ORDER BY thu_tu ASC, ngay_upload ASC',
      [id]
    );

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    next(error);
  }
};

