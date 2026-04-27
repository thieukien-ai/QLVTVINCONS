/**
 * TOÀN BỘ MÃ NGUỒN APPS SCRIPT CHO HỆ THỐNG QUẢN LÝ VẬT TƯ
 * Thay thế toàn bộ mã cũ bằng mã này.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

/**
 * Xử lý yêu cầu GET (Truy vấn dữ liệu)
 */
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    switch (action) {
      case 'login':
        return login(ss, e.parameter.User, e.parameter.Pass);
      
      case 'getUsers':
        return response(getData(ss, 'NguoiDung'));
        
      case 'getOrders':
        return response(getData(ss, 'DonHangVatTu'));
        
      case 'getCategories':
        return response(getData(ss, 'DanhMucVatTu'));
        
      case 'getProjects':
        return response(getData(ss, 'DuAn'));
        
      case 'getIssues':
        return response(getData(ss, 'SuVuToiUu'));

      case 'getPermissions':
        return response(getData(ss, 'CauHinhQuyen'));

      case 'getDashboard':
        return response(getDashboardData(ss));

      default:
        return response({ error: 'Invalid GET action: ' + action });
    }
  } catch (err) {
    return response({ error: err.toString() });
  }
}

/**
 * Xử lý yêu cầu POST (Lưu/Cập nhật dữ liệu)
 */
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const data = params.data;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    switch (action) {
      case 'saveOrder':
        return response(saveRow(ss, 'DonHangVatTu', data));
      
      case 'saveIssue':
        return response(saveRow(ss, 'SuVuToiUu', data));
        
      case 'saveCategory':
        return response(saveRow(ss, 'DanhMucVatTu', data));
        
      case 'saveProject':
        return response(saveRow(ss, 'DuAn', data));
        
      case 'saveUser':
        return response(saveRow(ss, 'NguoiDung', data));
        
      case 'deleteUser':
        return response(deleteRow(ss, 'NguoiDung', data.id));

      case 'deleteOrder':
        return response(deleteRow(ss, 'DonHangVatTu', data.id));

      case 'deleteProject':
        return response(deleteRow(ss, 'DuAn', data.id));

      case 'deleteCategory':
        return response(deleteRow(ss, 'DanhMucVatTu', data.id));

      case 'deleteIssue':
        return response(deleteRow(ss, 'SuVuToiUu', data.id));

      case 'changePassword':
        return response(changePassword(ss, data.username, data.oldPass, data.newPass));

      default:
        return response({ error: 'Invalid POST action: ' + action });
    }
  } catch (err) {
    return response({ error: err.toString() });
  }
}

/**
 * Hàm Đăng Nhập
 */
function login(ss, user, pass) {
  const users = getData(ss, 'NguoiDung');
  // Tìm user theo cột 'User' và 'Pass' (Khớp với mapping trong api.ts)
  const found = users.find(u => String(u.User) === String(user) && String(u.Pass) === String(pass));
  
  if (found) {
    // Trả về thông tin user (loại bỏ password để bảo mật nếu cần)
    return response(found);
  } else {
    return response({ error: 'Tài khoản hoặc mật khẩu không đúng' });
  }
}

/**
 * Hàm Lấy Dữ Liệu từ Sheet
 */
function getData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const results = [];
  
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[i][index];
    });
    results.push(obj);
  }
  return results;
}

/**
 * Hàm Lưu hoặc Cập Nhật Dòng (Dựa vào trường 'id')
 */
function saveRow(ss, sheetName, data) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet ' + sheetName + ' không tồn tại.');
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  
  // Nếu không có id, tạo id mới dựa trên timestamp
  if (!data.id) {
    data.id = 'ID_' + new Date().getTime();
  }
  
  const rowIndex = values.findIndex(row => row[headers.indexOf('id')] === data.id);
  
  const newRow = headers.map(header => data[header] !== undefined ? data[header] : "");
  
  if (rowIndex > -1) {
    // Cập nhật dòng cũ
    sheet.getRange(rowIndex + 1, 1, 1, headers.length).setValues([newRow]);
  } else {
    // Thêm dòng mới
    sheet.appendRow(newRow);
  }
  
  return { success: true, data: data };
}

/**
 * Hàm Xóa Dòng
 */
function deleteRow(ss, sheetName, id) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { error: 'Sheet not found' };
  
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy ID' };
}

/**
 * Hàm đổi mật khẩu
 */
function changePassword(ss, user, oldPass, newPass) {
  const sheet = ss.getSheetByName('NguoiDung');
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const userIndex = headers.indexOf('User');
  const passIndex = headers.indexOf('Pass');
  
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][userIndex]) === String(user) && String(values[i][passIndex]) === String(oldPass)) {
      sheet.getRange(i + 1, passIndex + 1).setValue(newPass);
      return { success: true };
    }
  }
  return { error: 'Mật khẩu cũ không chính xác' };
}

/**
 * Hàm lấy dữ liệu Dashboard (KPIs, rủi ro, sự vụ mới nhất)
 */
function getDashboardData(ss) {
  const orders = getData(ss, 'DonHangVatTu');
  const issues = getData(ss, 'SuVuToiUu');
  
  const kpis = {
    totalOrders: orders.length,
    delayedOrders: orders.filter(o => o.TrangThai === 'Cham').length,
    ongoingIssues: issues.filter(i => i.TrangThai !== 'Hoan thanh').length,
    urgentOrders: orders.filter(o => o.IsKhanCap === true || o.IsKhanCap === 'TRUE').length
  };
  
  // Hàm tính rủi ro đơn giản
  const calculateRisk = (order) => {
    if (order.TrangThai === 'Hoan thanh') return 'Xanh';
    const today = new Date();
    const deadline = new Date(order.NgayCanHang);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 3 || order.TrangThai === 'Cham') return 'Do';
    if (diffDays < 7) return 'Vang';
    return 'Xanh';
  };

  return { 
    kpis, 
    topRisks: orders.filter(o => calculateRisk(o) === 'Do').slice(0, 5), 
    latestIssues: issues.slice(0, 5) 
  };
}

/**
 * Helper chuẩn hóa phản hồi JSON
 */
function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}