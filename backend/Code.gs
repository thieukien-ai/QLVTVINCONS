/**
 * Google Apps Script - VinCons Material Management Backend
 * Instructions:
 * 1. Create a Google Sheet.
 * 2. Rename sheets to: DonHangVatTu, DanhMucVatTu, DuAn, SuVuToiUu, NguoiDung, CauHinhQuyen.
 * 3. Open Extensions > Apps Script and paste this code.
 * 4. Deploy as Web App, set access to "Anyone".
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet(e) {
  const action = e.parameter.action;
  let data;
  
  try {
    switch (action) {
      case 'getDashboard':
        data = getDashboardData();
        break;
      case 'getOrders':
        data = getSheetData('DonHangVatTu');
        break;
      case 'getCategories':
        data = getSheetData('DanhMucVatTu');
        break;
      case 'getProjects':
        data = getSheetData('DuAn');
        break;
      case 'getIssues':
        data = getSheetData('SuVuToiUu');
        break;
      case 'getUsers':
        data = getSheetData('NguoiDung');
        break;
      case 'getPermissions':
        data = getSheetData('CauHinhQuyen');
        break;
      default:
        return response({ error: 'Invalid action' });
    }
    return response(data);
  } catch (err) {
    return response({ error: err.toString() });
  }
}

function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const action = params.action;
  
  try {
    switch (action) {
      case 'saveOrder':
        return response(saveRow('DonHangVatTu', params.data));
      case 'saveIssue':
        return response(saveRow('SuVuToiUu', params.data));
      case 'saveCategory':
        return response(saveRow('DanhMucVatTu', params.data));
      case 'saveProject':
        return response(saveRow('DuAn', params.data));
      default:
        return response({ error: 'Invalid POST action' });
    }
  } catch (err) {
    return response({ error: err.toString() });
  }
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const items = [];
  
  for (let i = 1; i < rows.length; i++) {
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = rows[i][j];
    }
    // Auto-calculate risk if item is an order
    if (sheetName === 'DonHangVatTu') {
      item.RuiRo = calculateRisk(item);
    }
    items.push(item);
  }
  return items;
}

function calculateRisk(order) {
  if (order.TrangThai === 'Hoan thanh') return 'Xanh';
  
  const today = new Date();
  const deadline = new Date(order.NgayCanHang);
  const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 3 || order.TrangThai === 'Cham') return 'Do';
  if (diffDays < 7) return 'Vang';
  return 'Xanh';
}

function saveRow(sheetName, item) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = headers.map(h => item[h] || '');
  
  // Find existing by ID or first column
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  const idKey = headers[0];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === item[idKey]) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }
  return { success: true };
}

function getDashboardData() {
  const orders = getSheetData('DonHangVatTu');
  const issues = getSheetData('SuVuToiUu');
  
  const kpis = {
    totalOrders: orders.length,
    delayedOrders: orders.filter(o => o.TrangThai === 'Cham').length,
    ongoingIssues: issues.filter(i => i.TrangThai !== 'Hoan thanh').length,
    urgentOrders: orders.filter(o => o.IsKhanCap === true || o.IsKhanCap === 'TRUE').length
  };
  
  return { kpis, topRisks: orders.filter(o => calculateRisk(o) === 'Do').slice(0, 5), latestIssues: issues.slice(0, 5) };
}

function response(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGetCheckAuth(e) {
  // Logic kiểm tra ROLE dựa trên email của người dùng
  // Ở môi trường Web App, Session.getActiveUser().getEmail() thường rỗng nếu không thuộc cùng Domain
  // Nên truyền Email từ Frontend nếu làm SSO hoặc Auth riêng.
}
