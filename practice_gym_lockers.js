/**
 * Bài tập: 3. Xây dựng Module Quản lý Phân bổ Tủ đồ & Bàn giao Vật tư Phòng Gym
 * Môn học: [RL-IT103B-K25] - Xây dựng ứng dụng web với Javascript
 * Sinh viên thực hiện tự làm bài tập
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Dữ liệu giả lập hội viên
const dbMembers = {
  'VIP001': { name: 'Nguyễn Văn A', tier: 'VIP', active: true },
  'STD002': { name: 'Trần Thị B', tier: 'STANDARD', active: true },
  'ERR999': { name: 'Lê Văn C', tier: 'STANDARD', active: false }
};

let currentMember = null;
let rawItemsLog = '';

function showMenu() {
  console.log('\n--- QUẢN LÝ TỦ ĐỒ & VẬT TƯ PHÒNG GYM ---');
  console.log('1. Tiếp nhận và xác thực thẻ hội viên');
  console.log('2. Ghi nhận chuỗi vật tư mượn thêm (Ví dụ: TOWEL:2|LOCK:1)');
  console.log('3. In phiếu bàn giao tủ đồ & tính tổng phụ phí');
  console.log('4. Đóng ca làm việc và thoát');
  rl.question('Chọn chức năng (1-4): ', handleMenu);
}

function handleMenu(choice) {
  switch(choice.trim()) {
    case '1':
      rl.question('Nhập mã thẻ hội viên: ', (cardId) => {
        const member = dbMembers[cardId.trim()];
        if (!member) {
          console.log('Lỗi: Không tìm thấy mã thẻ hội viên trong hệ thống!');
        } else if (!member.active) {
          console.log('Lỗi: Thẻ hội viên đã bị khóa hoặc hết hạn!');
        } else {
          currentMember = member;
          console.log(`Xác thực thành công! Chào mừng hội viên ${member.name} (${member.tier}).`);
        }
        showMenu();
      });
      break;

    case '2':
      if (!currentMember) {
        console.log('Vui lòng xác thực thẻ hội viên trước (Chức năng 1)!');
        showMenu();
        break;
      }
      rl.question('Nhập chuỗi vật tư (Định dạng TOWEL:2|LOCK:1): ', (strInput) => {
        rawItemsLog = strInput.trim();
        console.log('Đã ghi nhận chuỗi vật tư mượn thành công.');
        showMenu();
      });
      break;

    case '3':
      if (!currentMember) {
        console.log('Chưa có thông tin hội viên trong ca làm việc này!');
        showMenu();
        break;
      }
      printSlip();
      showMenu();
      break;

    case '4':
      console.log('Đóng ca làm việc. Hẹn gặp lại!');
      rl.close();
      break;

    default:
      console.log('Lựa chọn không hợp lệ, vui lòng chọn từ 1 đến 4.');
      showMenu();
      break;
  }
}

function printSlip() {
  console.log('\n' + '='.repeat(40));
  console.log('      PHIẾU BÀN GIAO TỦ ĐỒ & VẬT TƯ');
  console.log('='.repeat(40));
  console.log(`Hội viên : ${currentMember.name}`.padEnd(40));
  console.log(`Hạng thẻ : ${currentMember.tier}`.padEnd(40));
  
  let lockerZone = currentMember.tier === 'VIP' ? 'ZONE-A (Khu VIP gần phòng tắm)' : 'ZONE-B (Khu Standard)';
  console.log(`Tủ cấp   : ${lockerZone}`.padEnd(40));
  console.log('-'.repeat(40));
  console.log('CHI TIẾT VẬT TƯ MƯỢN THÊM:');

  let totalItemCost = 0;
  const depositFee = rawItemsLog.length > 0 ? 50000 : 0;

  if (rawItemsLog.length > 0) {
    let remainingStr = rawItemsLog;
    let loopCount = 0;
    
    while (remainingStr.length > 0 && loopCount < 10) {
      loopCount++;
      let pipeIndex = remainingStr.indexOf('|');
      let currentPair = '';

      if (pipeIndex !== -1) {
        currentPair = remainingStr.slice(0, pipeIndex);
        remainingStr = remainingStr.slice(pipeIndex + 1);
      } else {
        currentPair = remainingStr;
        remainingStr = '';
      }

      let colonIndex = currentPair.indexOf(':');
      if (colonIndex !== -1) {
        let itemCode = currentPair.slice(0, colonIndex).trim();
        let itemQty = parseInt(currentPair.slice(colonIndex + 1).trim()) || 0;
        let unitPrice = 0;
        let itemName = '';

        if (itemCode === 'TOWEL') {
          itemName = 'Khăn tắm lớn';
          unitPrice = 20000;
        } else if (itemCode === 'LOCK') {
          itemName = 'Khóa tủ phụ';
          unitPrice = 15000;
        }

        let subTotal = itemQty * unitPrice;
        totalItemCost += subTotal;

        console.log(`- ${itemName.padEnd(18)} x${itemQty} : ${subTotal.toLocaleString()} VNĐ`);
      }
    }
  } else {
    console.log('- Không có vật tư mượn thêm.');
  }

  if (currentMember.tier === 'VIP') {
    console.log('- Khăn tắm lớn (VIP)  x1 : 0 VNĐ (Miễn phí)');
  }

  console.log('-'.repeat(40));
  console.log(`Tiền đặt cọc hoàn trả   : ${depositFee.toLocaleString()} VNĐ`.padEnd(40));
  console.log(`Tổng phụ phí vật tư     : ${totalItemCost.toLocaleString()} VNĐ`.padEnd(40));
  console.log(`TỔNG THANH TOÁN (Cọc)  : ${(depositFee + totalItemCost).toLocaleString()} VNĐ`.padEnd(40));
  console.log('='.repeat(40));
}

// Khởi chạy chương trình
showMenu();
