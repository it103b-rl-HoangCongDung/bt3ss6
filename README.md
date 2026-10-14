# BÁO CÁO BÀI TẬP: XÂY DỰNG MODULE QUẢN LÝ PHÂN BỔ TỦ ĐỒ VÀ BÀN GIAO VẬT TƯ PHÒNG GYM

> 👤 **Học viên:** Hoàng Công Dũng | **Mã SV:** PTIT-HCM-009
> 🏫 **Môn học:** it103b-rl-HoangCongDung

---

## 📊 Sơ đồ thiết kế hệ thống (Activity Diagram)

> 💡 *Sơ đồ dưới đây được render tự động trực tiếp trên GitHub bằng Mermaid. Bạn cũng có thể tải file **`bt3.drawio`** trong repository này để mở và chỉnh sửa trực tiếp trên [Draw.io (diagrams.net)](https://app.diagrams.net).* 

```mermaid
graph TD
  Start([Bắt đầu ca làm việc]) --> Scan[Tiếp nhận thẻ hội viên & Quét mã]
  Scan --> CheckValid{Thẻ hợp lệ trong hệ thống?}
  CheckValid -- Không hợp lệ --> ErrCard[Thông báo thẻ lỗi hoặc hết hạn] --> EndFail([Kết thúc: Từ chối phục vụ])
  CheckValid -- Hợp lệ --> CheckTier{Kiểm tra hạng hội viên}
  CheckTier -- VIP --> AssignVIP[Cấp tủ ZONE-A & Miễn phí 1 khăn tắm lớn]
  CheckTier -- STANDARD --> AssignStd[Cấp tủ ZONE-B & Không miễn phí vật tư]
  AssignVIP --> InputItems[Nhập chuỗi vật tư mượn thêm ví dụ TOWEL:2|LOCK:1]
  AssignStd --> InputItems
  InputItems --> ParseLoop[Vòng lặp bóc tách chuỗi bằng .indexOf và .slice]
  ParseLoop --> CalcCost[Tính phụ phí: Khăn 20k/chiếc, Khóa 15k/chiếc]
  CalcCost --> Fork[=== Thanh Fork: Xử lý song song ===]
  Fork --> PrintSlip[In phiếu bàn giao chi tiết bằng Template Literals & Padding]
  Fork --> Deposit[Thu tiền đặt cọc 50.000 VNĐ]
  PrintSlip --> Join[=== Thanh Join: Đồng bộ hóa ===]
  Deposit --> Join
  Join --> EndSuccess([Kết thúc: Bàn giao hoàn tất cho hội viên])
```

---

## 1. Mục tiêu và Ngữ cảnh bài toán

Bài tập yêu cầu xây dựng module điều phối hậu cần cho phòng gym, thực hiện hai nhiệm vụ chính là cấp phát tủ đồ tự động dựa trên phân hạng hội viên và xử lý chuỗi nhật ký mượn vật tư phát sinh.

Toàn bộ logic được viết thuần bằng Javascript, tập trung rèn luyện kỹ năng thao tác với chuỗi (string manipulation) sử dụng vòng lặp kết hợp phương thức .indexOf() và .slice(), đồng thời ứng dụng Template Literals và String Padding để định dạng hóa đơn chuyên nghiệp.

- Hội viên VIP: Được cấp phát tủ ở khu vực ZONE-A (gần phòng tắm) và miễn phí 1 khăn tắm lớn.
- Hội viên Standard: Được cấp phát tủ ở khu vực ZONE-B và tính phí toàn bộ vật tư mượn thêm.
- Đơn giá vật tư: Khăn tắm = 20.000 VNĐ/chiếc, Khóa tủ phụ = 15.000 VNĐ/chiếc.
- Tiền đặt cọc: Cố định 50.000 VNĐ cho mỗi lần mượn vật tư, sẽ được hoàn trả khi hội viên trả lại đồ.

## 2. Phân tích Quy tắc Nghiệp vụ và Bẫy Dữ liệu

Trong quá trình xây dựng mã nguồn, tôi đã chú ý xử lý các trường hợp ngoại lệ (Edge Cases) để hệ thống hoạt động ổn định, tránh sai sót khi nhân viên thao tác nhanh tại quầy lễ tân.

Chuỗi nhật ký mượn vật tư có định dạng 'TOWEL:2|LOCK:1' đòi hỏi thuật toán cắt chuỗi chính xác dựa trên ký tự phân tách phân đoạn '|' và dấu hai chấm ':' để lấy mã vật tư và số lượng.

- Xác thực thẻ: Hệ thống bắt buộc phải kiểm tra trạng thái thẻ hội viên trước khi tiến hành phân bổ tủ đồ.
- Xử lý chuỗi an toàn: Kiểm tra sự tồn tại của ký tự phân tách để tránh lỗi trả về NaN khi tính tiền phụ phí.
- Định dạng bảng in: Sử dụng hàm padEnd() hoặc padStart() để canh lề các cột trên Console, đảm bảo tính thẩm mỹ của phiếu bàn giao.

## 3. Bảng đặc tả chi tiết quy trình nghiệp vụ

Dưới đây là bảng mô tả chi tiết từng bước thực thi trong module quản lý tủ đồ và vật tư:

| Bước | Tác nhân | Hành động kỹ thuật | Kết quả / Trạng thái |
| --- | --- | --- | --- |
| 1 | Lễ tân / Hệ thống | Nhập mã thẻ hội viên để quét xác thực | Kiểm tra tính hợp lệ trong cơ sở dữ liệu |
| 2 | Hệ thống | Đọc phân hạng hội viên (VIP hoặc Standard) | Xác định khu vực tủ ZONE-A hoặc ZONE-B |
| 3 | Hệ thống | Nhận chuỗi mượn vật tư ('TOWEL:2|LOCK:1') | Chuẩn bị dữ liệu để bóc tách bằng vòng lặp |
| 4 | Thuật toán JS | Dùng .indexOf() và .slice() cắt chuỗi từng mục | Lấy chính xác mã vật tư và số lượng tương ứng |
| 5 | Hệ thống | Tính toán phụ phí dựa trên đơn giá và tiền cọc | Cộng dồn tổng tiền hội viên cần thanh toán |
| 6 | Hệ thống | In phiếu bàn giao ra Console | Sử dụng Template Literals và padding canh lề chuyên nghiệp |

## 4. Hướng dẫn sử dụng Mã nguồn

Mã nguồn được lưu tại file 'practice_gym_lockers.js' trong thư mục gốc của repository.

Để chạy thử nghiệm, bạn có thể sử dụng môi trường Node.js trên terminal với câu lệnh 'node practice_gym_lockers.js' và tương tác qua menu điều khiển dòng lệnh.

---

## 📁 Danh sách tệp tin nộp bài trong Repository
- 📝 `bt3.docx`: Báo cáo tài liệu phân tích nghiệp vụ hoàn chỉnh.
- 🎨 `bt3.drawio`: File thiết kế sơ đồ chuẩn theo quy định đề bài (mở trực tiếp bằng [Draw.io](https://app.diagrams.net) hoặc Lucidchart).
- 💻 `practice_gym_lockers.js`: Mã nguồn chương trình.
