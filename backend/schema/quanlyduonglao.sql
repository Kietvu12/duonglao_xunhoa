-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 19, 2025 at 08:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Disable foreign key checks temporarily to avoid constraint errors during import
SET FOREIGN_KEY_CHECKS = 0;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlyduonglao`
--

-- --------------------------------------------------------

--
-- Table structure for table `bai_viet`
--

CREATE TABLE `bai_viet` (
  `id` bigint(20) NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `mo_ta_ngan` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `luot_xem` int(11) DEFAULT 0,
  `trang_thai` enum('nhap','xuat_ban') DEFAULT 'nhap',
  `ngay_dang` datetime DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `id_tac_gia` bigint(20) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bai_viet`
--

INSERT INTO `bai_viet` (`id`, `tieu_de`, `slug`, `noi_dung`, `anh_dai_dien`, `meta_title`, `meta_description`, `mo_ta_ngan`, `category`, `tags`, `luot_xem`, `trang_thai`, `ngay_dang`, `da_xoa`, `ngay_xoa`, `id_tac_gia`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(14, '7 Bước để ngủ ngắn kiểu văn phòng, tỉnh hơn 3 cốc cafe', '7-buoc-de-ngu-ngan-kieu-van-phong-tinh-hon-3-coc-cafe', '<p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Chiều 2-3 giờ, mắt díp lại, màn hình máy tính bắt đầu nhòe, tay vẫn gõ phím nhưng đầu óc đã “đình công” như điện thoại hết pin. Deadline còn đó, cà phê đã đến cốc thứ ba mà càng uống càng mệt, tim đập nhanh, tối về lại trằn trọc đến khuya.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Bạn có biết rằng chỉ 10 phút ngủ ngắn đúng cách, bạn có thể tỉnh táo ngay lập tức, không phụ thuộc caffeine, không ảnh hưởng giấc đêm. Dân văn phòng trên thế giới gọi đó là&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">power nap&nbsp;</em></i><span style=\"white-space: pre-wrap;\">- và hoàn toàn có thể thực hiện ngay tại bàn làm việc, không cần gối, không cần phòng riêng.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Khi ngủ dưới 15 phút, cơ thể chỉ kịp rơi vào hai giai đoạn đầu của giấc ngủ: giai đoạn nhẹ và giai đoạn chuyển tiếp. Lúc này não được “dọn dẹp” nhanh, serotonin và dopamine tăng nhẹ, adrenaline giảm xuống - kết quả là mắt sáng, đầu óc minh mẫn trở lại mà không bị ngái ngủ.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Ngược lại, nếu ngủ quá 20 - 30 phút, cơ thể dễ rơi vào ngủ sâu, tỉnh dậy sẽ càng uể oải hơn lúc chưa ngủ. NASA từng thử nghiệm trên phi hành gia và kết luận:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">giấc ngủ ngắn 10 - 20 phút giúp tăng hiệu suất làm việc lên đến 34% và độ chính xác tăng 50%</strong></b><span style=\"white-space: pre-wrap;\">. Con số này vượt xa hiệu quả của một ly cà phê lớn.</span></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Cách ngủ 10 phút ngay tại bàn làm việc</span></h2><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\" alt=\"alt\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114261087-437707296.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><ol><li value=\"1\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Chọn thời điểm lý tưởng: 13h30 - 15h, khi nhịp sinh học tự nhiên xuống thấp nhất trong ngày.</span></li><li value=\"2\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Đặt báo thức chính xác 15 phút (10 phút ngủ + 5 phút dự phòng để rơi vào giấc ngủ).</span></li><li value=\"3\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Ngồi thẳng trên ghế xoay, lưng tựa vừa phải, hai bàn chân chạm sàn.</span></li><li value=\"4\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Thả lỏng vai, cổ hơi cúi nhẹ về trước khoảng 30 - 40 độ (tư thế “ngủ gật tự nhiên” giống như trên máy bay).</span></li><li value=\"5\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Cầm chìa khóa xe hoặc điện thoại trên tay, thả lỏng tay buông thõng xuống dưới đầu gối. Khi rơi vào giấc ngủ sâu hơn một chút, tay sẽ giật nhẹ và làm rơi vật - đó là tín hiệu tự nhiên đánh thức đúng lúc.</span></li><li value=\"6\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Nhắm mắt, thở chậm theo nhịp 4-7-8 (hít 4 giây, giữ 7 giây, thở ra 8 giây) trong 3 - 4 hơi đầu để nhanh chóng thư giãn.</span></li><li value=\"7\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Không nghĩ gì cả, chỉ tập trung vào hơi thở hoặc tưởng tượng đang nằm trên võng.</span></li></ol><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Tỉnh dậy, đứng dậy vươn vai nhẹ, uống một ngụm nước mát - chỉ vài giây là đầu óc đã sáng rõ như vừa khởi động lại đó nha.</span></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Mẹo nhỏ để&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">power nap</em></i><span style=\"white-space: pre-wrap;\">&nbsp;hiệu quả hơn</span></h2><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==\" alt=\"alt\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114293917-25249393.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><ul><li value=\"1\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Tắt bớt đèn bàn hoặc đeo bịt mắt nếu văn phòng sáng quá.</span></li><li value=\"2\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Nghe tiếng mưa hoặc âm thanh trắng qua tai nghe không dây, âm lượng vừa đủ.</span></li><li value=\"3\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Tránh nằm gục hẳn xuống bàn vì dễ làm cột sống cổ và thắt lưng cong sai tư thế, tỉnh dậy lại đau mỏi thêm.</span></li></ul><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người sau khi thử&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">power nap</em></i><span style=\"white-space: pre-wrap;\">&nbsp;10 phút đều nhận ra một điều: tỉnh táo thật sự không cần phải “ép” bằng caffeine liên tục. Chỉ cần cho não một khoảng nghỉ ngắn đúng cách, hiệu suất cả buổi chiều tăng vọt, tối về còn đủ năng lượng cho các sở thích cá nhân mà không cần cà phê khuya, càng không bị trằn trọc khó ngủ khi đêm về.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nếu gần đây cảm thấy&nbsp;</span><a href=\"https://optimal365.vn/cang-co-co-vai-gay/\"><span style=\"white-space: pre-wrap;\">cổ vai gáy thường xuyên căng cứng</span></a><span style=\"white-space: pre-wrap;\">&nbsp;sau những ngày dài ngồi bàn, kết hợp&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">power nap</em></i><span style=\"white-space: pre-wrap;\">&nbsp;với một buổi&nbsp;</span><a href=\"https://optimal365.vn/#appointment-form\"><span style=\"white-space: pre-wrap;\">điều chỉnh tư thế cột sống</span></a><span style=\"white-space: pre-wrap;\">&nbsp;nhẹ nhàng sẽ giúp hiệu quả nhân đôi - ngủ ngắn tỉnh nhanh, lưng cổ lại thoải mái cả ngày.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Thử 10 phút hôm nay xem, biết đâu chiều nay lại hoàn thành nốt phần việc đang trì hoãn từ sáng thì sao?</span></p><p><br></p><p><br></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114331939-752047624.webp', NULL, NULL, 'Power nap - 10 phút ngủ ngắn đúng cách giúp bạn có thể tỉnh táo ngay lập tức.', 'Activities', NULL, 3, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 10:18:23', '2025-12-19 14:15:22'),
(15, '“Chọn lọc gen” và “đào tạo tinh hoa” liên quan gì đến thuyết ưu sinh?', 'chon-loc-gen-va-dao-tao-tinh-hoa-lien-quan-gi-den-thuyet-uu-sinh', '<h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Chuyện gì đã xảy ra?</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Ngày 17/12/2025, hàng loạt bài báo đồng loạt đưa tin về một đề xuất đào tạo nhân lực của Hà Nội. Nội dung nói về việc đầu tư mạnh cho nguồn nhân lực chất lượng cao, trong đó có nội dung: “Cấp độ thứ hai là chọn lọc theo gen để đào tạo tinh hoa đến khi trưởng thành, trong đó có việc nghiên cứu khoa học về thai giáo.”</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Chính điểm này đã khiến tranh luận bùng nổ. Bởi đây không còn là câu chuyện nâng cao chất lượng giáo dục, mà là một mô hình phân tầng con người dựa trên đặc điểm sinh học, được nhà nước trực tiếp thiết kế và đầu tư. Với nhiều người, điều này gợi nhớ thẳng đến chủ nghĩa ưu sinh, một học thuyết từng được sử dụng như công cụ chính trị của các chế độ phát xít và toàn trị (totalitarianism) trong thế kỷ XX.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Khi phản ứng lan rộng, một số báo đã điều chỉnh tiêu đề: từ “chọn lọc theo gen/gien” sang “đào tạo thế hệ tinh hoa”, rồi tiếp tục đổi thành “đào tạo nhân lực tinh hoa”. Nhưng sự thay đổi này không làm dịu tranh luận.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114372322-47225904.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><span style=\"white-space: pre-wrap;\">Internet, như thường lệ, nhanh hơn mọi đính chính. Trước khi các tiêu đề mới kịp định hình lại câu chuyện, cư dân mạng đã kịp chụp màn hình, trích dẫn nguyên văn và tiếp tục thảo luận. Chỉ trong vòng 24 giờ, ba cụm từ:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">chọn lọc gen/gien</em></i><span style=\"white-space: pre-wrap;\">,&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">đào tạo tinh hoa&nbsp;</em></i><span style=\"white-space: pre-wrap;\">và&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">thuyết ưu sinh</em></i><span style=\"white-space: pre-wrap;\">&nbsp;đã phủ sóng gần như toàn bộ không gian mạng.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Mọi người đang bàn tán gì?</span></h2><p><span style=\"white-space: pre-wrap;\">Tranh cãi lớn nhất xoay quanh một từ khóa: ưu sinh.</span></p><p><span style=\"white-space: pre-wrap;\">Với nhiều người, ưu sinh gắn liền với bài học lịch sử mang nhiều ám ảnh. Nó gắn với nỗi lo về việc xã hội phân tầng ngay từ đầu đời, khi một nhóm được đầu tư tối đa còn phần còn lại đứng ngoài cuộc chơi.</span></p><p><span style=\"white-space: pre-wrap;\">Từ đó, các câu hỏi nối tiếp nhau xuất hiện cho đề xuất “đào tạo tinh hoa”:</span></p><ul><li value=\"1\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Ai sẽ được coi là “tinh hoa”?</span></li><li value=\"2\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Ai là người đặt ra tiêu chí ấy?</span></li><li value=\"3\" class=\"ml-4\"><span style=\"white-space: pre-wrap;\">Và liệu cơ hội có còn khả năng dịch chuyển, hay bị cố định từ rất sớm?</span></li></ul><p><span style=\"white-space: pre-wrap;\">Có những lo ngại đi xa hơn, chạm đến cả vấn đề nhân khẩu học. Một số ý kiến cho rằng, nếu xã hội ngầm thừa nhận chỉ một nhóm nhỏ “tinh hoa” mới có khả năng thành công, thì phần còn lại sẽ sống trong cảm giác thua cuộc ngay từ vạch xuất phát. Và khi đó, việc sinh con có thể trở thành một lựa chọn đầy áp lực, nhiều người sẽ từ chối sinh con để con cái không phải bước vào một cuộc cạnh tranh được cho là không công bằng từ lúc bắt đầu.</span></p><p><span style=\"white-space: pre-wrap;\">Như thường lệ, các từ khóa này cũng nhanh chóng trượt khỏi phạm vi chính sách để bước vào lãnh địa quen thuộc của internet: châm biếm và tưởng tượng tập thể.</span></p><p><span style=\"white-space: pre-wrap;\">Chỉ trong thời gian ngắn, viễn cảnh “đào tạo tinh hoa” đã được tái hiện theo đủ thể loại: từ khoa học viễn tưởng phản địa đàng cho đến fanfic Wattpad ABO đầy tính giễu nhại. Như đã có một cư dân mạng lên ý tưởng một “alpha Hà Nội thuộc thế hệ tinh hoa STEM, được chọn lọc gien” xuất hiện như hình mẫu lý tưởng của đề xuất và ngay lập tức được đặt vào mối quan hệ trái khoáy với một “omega miền Tây yêu nghệ thuật”.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114386256-632132170.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114390947-316807865.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Khi tranh luận đi sâu đến… chính tả</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Giữa lúc bàn cãi về chính sách, đạo đức và tương lai xã hội, một nhánh tranh luận tưởng như lạc đề lại bất ngờ nổi lên: viết là</span><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">&nbsp;gen</strong></b></i><span style=\"white-space: pre-wrap;\">&nbsp;hay&nbsp;</span><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">gien</strong></b></i><span style=\"white-space: pre-wrap;\">&nbsp;mới đúng?</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114399543-528186020.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><span style=\"white-space: pre-wrap;\">Cư dân mạng Việt vốn có một “luật bất thành văn”: trong mọi cuộc tranh luận, nếu sai chính tả thì lý lẽ bỗng nhiên kém thuyết phục hẳn. Có lẽ vì vậy mà từ cách viết đúng của \"gene\" trong tiếng Việt cũng được đem ra mổ xẻ.</span></p><p><span style=\"white-space: pre-wrap;\">Người cho rằng \"</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">gien\"</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;mới là phiên âm đúng. Người khác lại nói&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">gen</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;dễ nhầm với \"generation\" trong trong từ gen Z, hoặc đọc thành “ghen” trong tiếng Việt. Lại có ý kiến dung hòa: dùng từ nào cũng được, miễn là ngữ cảnh đủ rõ.</span></p><p><span style=\"white-space: pre-wrap;\">Một cuộc tranh luận về tương lai con người, rốt cuộc lại đi rất xa đến… từng con chữ.</span></p><p style=\"text-align: center;\"><br></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Tóm lại là…</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Tranh luận quanh một đề xuất vẫn đang diễn ra sôi nổi. Điều đó cho thấy sự quan tâm rất thật của xã hội đối với các vấn đề vĩ mô. Cách con người phản ứng cũng nói lên nhiều điều. Khi chính sách vẽ ra một trật tự quá lạnh lùng, quá kỹ trị, con người sẽ tự động thổi vào đó cảm xúc, thân phận và cả sự phi lý như một cách để biến những vấn đề lớn trở nên gần gũi, dễ hiểu và dễ tranh luận hơn.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Có lẽ, chưa cần đến AI thay thế hay những chương trình đào tạo tinh hoa, chỉ riêng việc quan sát cách con người kể lại, đùa cợt và tranh luận quanh một đề xuất chính sách đã đủ cho thấy: xã hội khi vận hành vẫn có chỗ cho trí tưởng tượng, ký ức và cảm xúc. Đây là những thứ mà cho đến nay, vẫn chưa có thuật toán hay phát minh khoa học nào “chọn lọc” được.</span></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114361593-329045126.webp', NULL, NULL, 'Một đề xuất khoa học với đề án “chọn lọc gen” để “đào tạo tinh hoa” khiến cả mạng xã hội dậy sóng. Từ đào tạo nhân lực, câu chuyện trượt sang ưu sinh và cả tranh luận gen hay gien mới đúng chính tả.', NULL, NULL, 1, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 10:20:16', '2025-12-19 14:15:22'),
(16, 'Trinity Live: Khi mindset trở thành nền tảng của mọi trải nghiệm', 'trinity-live-khi-mindset-tro-thanh-nen-tang-cua-moi-trai-nghiem', '<p><span style=\"white-space: pre-wrap;\">Ngành sự kiện và trải nghiệm thương hiệu tại Việt Nam đang chuyển mình nhanh chóng. Từ những buổi ra mắt sản phẩm đến các không gian tương tác quy mô lớn, brand experience ngày nay không còn dừng lại ở tính “trình diễn”. Người tham dự đã thay đổi. Họ tinh tế hơn, nhạy cảm hơn với những gì họ nhìn thấy, chạm vào và cảm nhận. Điều họ mang về sau một trải nghiệm không phải là hình ảnh lung linh trên sân khấu - mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">cảm xúc</strong></b><span style=\"white-space: pre-wrap;\">.</span></p><p><span style=\"white-space: pre-wrap;\">Đối với Trinity Live, cảm giác ấy mới chính là nơi bắt đầu của brand experience. Một sự kiện có thể được thiết kế đẹp, vận hành trơn tru, nhưng nếu cảm giác để lại không đúng với tinh thần thương hiệu hoặc không chạm vào điều người tham dự thật sự quan tâm, trải nghiệm đó vẫn chưa trọn vẹn.</span></p><p><span style=\"white-space: pre-wrap;\">Chính vì vậy, Trinity Live chọn bước vào ngành này với tư duy rõ ràng:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Mindset Matters Most</strong></b><span style=\"white-space: pre-wrap;\">.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Mindset – Nền móng của một trải nghiệm đúng</span></h2><p><span style=\"white-space: pre-wrap;\">Trong nhiều năm làm nghề, Trinity Live nhận ra rằng một trải nghiệm bền vững không khởi đầu bằng visual ấn tượng hay ý tưởng hoành tráng. Nó bắt đầu từ tư duy: tư duy tôn trọng người tham dự, tư duy thấu hiểu thương hiệu và tư duy nhìn thấy giá trị của từng chi tiết nhỏ.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">Người tham dự có thể không nhớ từng chi tiết, nhưng họ nhớ cảm giác mà thương hiệu để lại</span></p></blockquote><p><span style=\"white-space: pre-wrap;\">- Ben Trần, Co-founder &amp; Group Business Director – Trinity Live</span></p><p><span style=\"white-space: pre-wrap;\">Đó là câu mà đội ngũ Trinity Live nhắc nhau mỗi ngày. Nó không chỉ là một nhận định nghề nghiệp, mà là một triết lý làm nghề.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114459212-426524468.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><span style=\"white-space: pre-wrap;\">Nguồn: Trinity</span></p><p><span style=\"white-space: pre-wrap;\">Trong ngành luôn tồn tại nhiều biến số khó lường - từ những thay đổi liên tục trong yêu cầu của nhãn hàng đến những khó khăn, trở ngại bất khả kháng – mindset là thứ giúp đội ngũ phản ứng đúng hướng. Một trải nghiệm được vận hành với mindset vững chắc sẽ không “mất chất” khi gặp sự cố, không đánh mất thương hiệu khi phải thay đổi phút cuối, và không đánh mất cảm xúc của người tham dự chỉ vì một chi tiết nhỏ bị bỏ quên.</span></p><p><span style=\"white-space: pre-wrap;\">Mindset là xương sống. Mọi thứ còn lại chỉ là cách để mindset được thể hiện ra ngoài.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Chi tiết - Ngôn ngữ thầm lặng của cảm xúc</span></h2><p><span style=\"white-space: pre-wrap;\">Khi nói đến sự kiện, nhiều người thường nghĩ đến những highlight lớn: ánh sáng sân khấu, âm nhạc bùng nổ, hiệu ứng bất ngờ. Nhưng theo Trinity Live, những khoảnh khắc đó chỉ chiếm một phần rất nhỏ trong tổng thể trải nghiệm. Cảm xúc thật sự được hình thành từ hàng trăm chi tiết nhỏ đan vào nhau - những thứ phần lớn người tham dự không gọi tên, nhưng luôn cảm nhận được.</span></p><p><span style=\"white-space: pre-wrap;\">Đó có thể là không khí khi họ bước vào không gian, cách ánh sáng đổi sắc nhẹ nhàng khi chuyển phân khúc nội dung, flow di chuyển hợp lý giúp họ không bị “đứt mạch”, hay chỉ đơn giản là cảm giác thoải mái mà nhân sự front-of-house mang lại.</span></p><p><span style=\"white-space: pre-wrap;\">Những chi tiết đó không có nhiệm vụ phô trương. Chúng có nhiệm vụ&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">kết nối cảm xúc</strong></b><span style=\"white-space: pre-wrap;\">.</span></p><p><span style=\"white-space: pre-wrap;\">Chính vì vậy, Trinity Live xem chi tiết là ngôn ngữ không lời của trải nghiệm. Một chi tiết sai có thể khiến cảm xúc bị vấp. Một chi tiết đúng có thể nâng cả trải nghiệm lên một cấp độ mới.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114466980-585709395.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><span style=\"white-space: pre-wrap;\">Nguồn: Triniti</span></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Live The Brand - Triết lý đứng sau mọi quyết định</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Để giữ cho trải nghiệm luôn “đúng” với thương hiệu, Trinity Live xây dựng triết lý&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Live The Brand</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;như hệ tư duy trung tâm. Thay vì “làm theo brief”, Live The Brand yêu cầu hiểu thương hiệu từ bên trong: hiểu bản sắc, hiểu mục tiêu, hiểu giá trị cốt lõi và hiểu cách thương hiệu muốn được cảm nhận.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Live The Brand cũng đòi hỏi sự liền mạch xuyên suốt: khi thương hiệu bước vào digital, khi xuất hiện trực tiếp, khi giao tiếp bằng hình ảnh, khi tương tác bằng âm thanh, khi người tham dự cầm một vật phẩm, hay khi họ rời khỏi không gian.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Tất cả đều phải gắn như một dòng chảy tự nhiên.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Quan trọng hơn, Live The Brand đặt hai trọng tâm mà Trinity Live xem là bất biến:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">bảo vệ thương hiệu&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">và&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">bảo vệ người tham dự</strong></b><span style=\"white-space: pre-wrap;\">.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Dù ở bất kỳ quy mô hay bối cảnh nào, Trinity Live tin rằng một trải nghiệm chỉ thật sự thành công khi thương hiệu được thể hiện đúng chất và người tham dự được tôn trọng từ đầu đến cuối.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Live The Brand không phải là khẩu hiệu; nó là tiêu chuẩn nội bộ, là cách Trinity Live ra quyết định khi không còn nhiều thời gian để suy nghĩ và là thứ giúp họ giữ sự nhất quán ngay cả trong khoảnh khắc hỗn loạn.</span></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trải nghiệm - Kênh chạm cảm xúc trực tiếp và chân thật nhất</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong kỷ nguyên digital, khi nội dung ngập tràn và sự chú ý của người dùng bị phân mảnh liên tục, trải nghiệm trực tiếp trở thành kênh kết nối quý giá nhất của thương hiệu. Không có thuật toán, không có bộ lọc, không có thứ gì xen vào giữa thương hiệu và người tham dự.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Chính vì vậy, experiential marketing vừa mạnh hơn bao giờ hết, nhưng cũng đòi hỏi nhiều hơn bao giờ hết: sự tinh tế, sự nhất quán, sự chuẩn xác và sự thấu cảm.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trinity Live chọn không chạy theo sự phô diễn. Thay vào đó, họ tập trung vào sự chân thật trong cảm xúc và sự liền mạch trong hành trình. Bởi khi trải nghiệm thật sự chạm vào người tham dự, họ sẽ mang cảm xúc đó về nhà - và mang nó theo nhiều ngày sau đó.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114498346-428073357.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Sundate Festival - Khi tư duy đúng tạo ra kết quả đúng</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Sundate Festival là ví dụ rõ ràng nhất cho cách Trinity Live biến mindset thành trải nghiệm. Được thiết kế cho hàng nghìn gia đình, Sundate không chỉ là một sự kiện đông đúc, mà là một hành trình cảm xúc được xây dựng dựa trên insight, sự tinh giản và sự chân thành trong từng hoạt động.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Không ồn ào, không màu mè quá mức, Sundate thành công vì nó “đúng” - đúng tinh thần gia đình, đúng nhu cầu của trẻ nhỏ, đúng mong đợi của phụ huynh và đúng cách thương hiệu muốn kết nối. Sundate cho thấy triết lý của Trinity Live không nằm ở việc tạo ra thứ lớn nhất, mà tạo ra thứ phù hợp nhất.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Điều Trinity Live mong muốn đọng lại không phải là tên dự án hay danh sách năng lực, mà là cách tư duy có thể góp phần làm ngành trải nghiệm trở nên tinh tế hơn. Trong thế giới nơi mọi thứ có thể được phóng đại bằng kỹ thuật, sự liền mạch và cảm xúc chân thật lại trở thành tài sản hiếm.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trinity Live tin rằng nếu bắt đầu bằng mindset đúng, trải nghiệm sẽ tìm được hình hài của nó - rõ ràng, mạch lạc và có chiều sâu. Và khi người tham dự bước ra khỏi sự kiện với một cảm xúc đẹp, thương hiệu đã hoàn thành phần quan trọng nhất của hành trình.</span></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114441834-482406935.webp', NULL, NULL, 'Với Trinity Live, trải nghiệm thương hiệu không bắt đầu từ sân khấu hào nhoáng, mà khởi nguồn từ tư duy \"Mindset Matters Most\" để chạm sâu vào cảm xúc người tham dự.', NULL, NULL, 1, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 10:21:48', '2025-12-19 14:15:22'),
(17, 'Gặp gỡ Nguyễn Kiên: “Chàng thơ” Hà Nội đam mê làm văn hoá vì tình yêu phố thị lớn lao', 'gap-go-nguyen-kien-chang-tho-ha-noi-dam-me-lam-van-hoa-vi-tinh-yeu-pho-thi-lon-lao', '<p><span style=\"white-space: pre-wrap;\">Sinh ra và lớn lên ở Hà Nội, hành trình của Nguyễn Kiên (bút danh Thế Lãng) là câu chuyện truyền cảm hứng về người trẻ GenZ yêu văn hoá văn học, sống hết mình với đam mê và luôn nỗ lực theo đuổi lý tưởng riêng. Tự nhận là “công nhân văn hoá”, anh có quan điểm cùng cách làm khác biệt, dẫu bị xem là đi ngược dòng thì niềm tin vẫn không hề lung chuyển.</span></p><p><span style=\"white-space: pre-wrap;\">Năm 2021, Nguyễn Kiên đồng sáng lập kênh Podcast Hà Nội FM - Nơi những chàng trai Hà Nội nói về Hà Nội. Sau đó, anh tiếp tục khởi xướng nhiều dự án văn hoá nghệ thuật đầy ấn tượng như: “Đêm thơ trong thành phố”, “Workshop Thơ”, “Đêm nghệ văn”, “The Muse Night”, … Mới đây, anh phụ trách phát triển dự án “Đêm Bảo tàng” tại Bảo tàng Mỹ thuật Việt Nam. Đặt trong bối cảnh nền công nghiệp văn hoá đang cần phát triển, việc làm của anh cùng các dự án ngày càng khẳng định rõ ý nghĩa, thể hiện trách nhiệm và tinh thần “Why not” của người trẻ.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Đâu là điểm khởi đầu cho tất cả những gì anh làm?</span></h2><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Chắc chắn là tình yêu dành cho Hà Nội!</em></i></p></blockquote><p><span style=\"white-space: pre-wrap;\">Tình cảm này xuất phát kiểu “oan gia ngõ hẹp”. Mặc dù cũng không thích sự chật chội, khói bụi của thành phố và cũng mơ ước đặt chân đến bao vùng xa vợi nhưng ước mơ nhiều khi chỉ nằm trong ý nghĩ, mình bắt đầu thử tìm hiểu về nơi mình đang sống. Lật giở từng trang viết về Hà Nội, mình đi hết từ bất ngờ này sang ngạc nhiên khác! Gấp sách lại, mình còn có thể đến tận nơi ngắm nghía, tìm hiểu thêm. Tình yêu Hà Nội nảy nở lúc nào không hay. Mình cảm thấy được gắn kết với quê hương, trân trọng hơn từng trải nghiệm trong cuộc sống mỗi ngày.</span></p><p><span style=\"white-space: pre-wrap;\">Biết thông tin nào thú vị, mình đều ghi chép cẩn thận vào cuốn sổ nhỏ. Những tri thức cùng trải nghiệm sống được mình đúc kết lại, viết thành tản văn rồi chia sẻ trên trang cá nhân. Khi Tùng - đồng sáng lập Podcast Hà Nội FM ngỏ lời muốn thu âm, phân phối trên các nền tảng trực tuyến, mình đồng ý ngay. Trộm vía “em bé Hà Nội FM” nhanh chóng được đông đảo thính giả yêu mến. Điều này thôi thúc mình sống - đọc - nghĩ - viết nhiều hơn về Hà Nội như đáp lại tình yêu của công chúng. Mình nghĩ đây cũng là cách hay để lan tỏa giá trị văn hoá.</span></p><p><span style=\"white-space: pre-wrap;\">Từ cuối năm 2022, với mong muốn gặp mặt trực tiếp thính giả, mình và ekip Hà Nội FM tổ chức những “Đêm thơ trong thành phố” mở ra không gian gần gũi, kết nối mọi người qua thơ nhạc chuyện. Rất nhanh chóng qua 3 sự kiện đầu tiên, dự án nhận được sự quan tâm, ủng hộ từ cộng đồng để sau đó, mình tự tin tổ chức thêm nhiều hoạt động văn hoá nghệ thuật khác.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114543887-753544928.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Tại sao anh lựa chọn thơ văn là chất liệu chính trong các dự án của mình?</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Mình yêu văn học từ nhỏ, nhất là thể loại thơ.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Mình nhìn nhận thơ văn là loại hình nghệ thuật phản ánh tốt nhất tinh thần Hà Nội, thấm đẫm trong văn hoá Thủ đô, không phải ngẫu nhiên biểu tượng của thành phố này là Khuê Văn Các (lầu chứa ngôi sao văn chương).</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Đồng thời, mình thấy thơ văn đối với phần đông người trẻ mới đang dừng lại là văn bản trong sách giáo khoa. Theo mình, thơ văn bị lép vế so với nhiều bộ môn nghệ thuật, nhất là đặt giữa tâm bão nội dung giải trí nhanh trong đời sống công nghệ. Bên cạnh đó, có không ít định kiến sai lầm về thơ văn như: thiếu thực tế, lãng mạn vặt, không có giá trị trong đời sống hiện đại,... Mình không vui khi những tập thơ hay bị phủ bụi, thường bị đặt ở kệ dưới trong nhà sách.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong bối cảnh đời sống hiện đại ưu ái những “món ăn tinh thần” nhanh và dễ tiếp cận, mình nghĩ thơ văn như mỏ neo vàng giúp mỗi người sống chậm lại, kích thích suy nghĩ chủ động, khơi gợi sáng tạo và tư duy nghệ thuật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhìn ra bên ngoài, mình thấy ở nhiều nền văn hoá phát triển, đời sống thơ văn ngày càng năng động và phong phú, hấp dẫn nhóm công chúng đáng kể.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Mình muốn đưa thơ văn đến gần hơn với tất cả qua cách tiếp cận mới mẻ, phù hợp hơn với thị hiếu thưởng thức của người trẻ. Qua đó, mình hy vọng truyền tải được những thông điệp và năng lượng tích cực.</span></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trước khó khăn, bên cạnh tình yêu Hà Nội và đam mê cá nhân, điều gì thôi thúc anh theo đuổi, phát triển các dự án?</span></h2><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Mình mơ ước một ngày cơm áo thôi đùa với khách thơ!</em></i></p></blockquote><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Là người học và làm marketing, mình nhìn nhận có một thị trường văn học đầy tiềm năng tại Việt Nam nhưng chưa được khai thác tương xứng với giá trị. Với tư cách là loại hình nghệ thuật vốn gắn bó và được người Việt yêu thích suốt hàng nghìn năm, thơ văn nên có những cập nhật cả về nội dung cảm hứng lẫn hình thức biểu hiện để đáp ứng tốt hơn nhu cầu thời đại. Ví dụ, các tác phẩm không còn tĩnh tại trên giấy mà nên được sân khấu hoá, điện ảnh hoá, kết hợp với nhiều thực hành nghệ thuật khác để trở nên sinh động, thu hút hơn. Các dự án hiện nay của mình chủ yếu liên quan đến trình diễn thơ.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Mình định hướng tất cả các dự án là sản phẩm. Sự kiện được tổ chức đều đặn đáp ứng nhu cầu thưởng thức của nhóm khách hàng cụ thể chứ không phải là các buổi trình diễn rời rạc, ngẫu hứng. Mình quan tâm đến trải nghiệm khách hàng, thường xuyên trò chuyện để không ngừng nâng cao chất lượng. Mỗi sản phẩm được định hướng chiến lược rõ ràng gắn với xây dựng cộng đồng. Các sản phẩm liên kết tạo thành mạng lưới trải nghiệm thơ văn, qua đó, thiết lập định vị riêng.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Đặt trong bối cảnh công nghiệp văn hoá đang được thúc đẩy mạnh mẽ, mình càng tin tưởng hơn vào con đường đang đi, cũng như những giá trị tiềm tàng của văn học Việt Nam sẽ sớm được khai mở.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114568050-290559428.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Lựa chọn thị trường ngách, dấn thân với loại hình nghệ thuật khó trong khi nguồn lực ít ỏi, niềm tin của anh có khi nào bị thử thách?</span></h2><p><span style=\"white-space: pre-wrap;\">“Giấc mơ con đè nát cuộc đời cơn”, câu thơ ấy treo trên đầu mình.</span></p><p><span style=\"white-space: pre-wrap;\">Đã có lúc, mình không tin bản thân. Nhưng chưa bao giờ, mình hoài nghi và thôi tin tưởng vào ý nghĩa của thơ văn cùng những giá trị mang tính nhân bản. Càng khi người ta nói về sức mạnh thay thế của trí tuệ nhân tạo, mình càng tin tưởng cái ngày mà mọi người trở về, tắt tịt điện thoại, mở sách ra và ngấu nghiến lấy chữ nghĩa đang đến rất gần. Suy cho cùng, mọi thứ sẽ đều đi đến chỗ cân bằng.</span></p><p><span style=\"white-space: pre-wrap;\">So với 3 năm trước, có thể nói con đường của mình giờ đây hoàn toàn rõ ràng. Đó là không ngừng sáng tạo, phát triển loại hình&nbsp;</span><a href=\"https://vietcetera.com/vn/trinh-dien-tho-mot-doi-song-khac-cua-thi-ca\" rel=\"noreferrer\"><span style=\"white-space: pre-wrap;\">nghệ thuật trình diễn thơ</span></a><span style=\"white-space: pre-wrap;\">&nbsp;nhằm đem lại các giá trị tinh thần cho xã hội, từ đó, khai thác lợi ích kinh tế và góp phần phát triển nền công nghiệp văn hoá địa phương.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Niềm tin như ngọn hải đăng không bao giờ tắt, lại thấy rõ đường đi rồi, mọi thứ đang dần trở nên tốt đẹp hơn.</em></i></p></blockquote><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Anh hướng tới chất lượng đầu ra như thế nào cho các sản phẩm văn hoá?</span></h2><p><span style=\"white-space: pre-wrap;\">Mình thường trăn trở hai điều.</span></p><p><span style=\"white-space: pre-wrap;\">Một là, phải làm sao tạo ra được giá trị có ý nghĩa và bền vững cho cộng đồng. Sản phẩm văn hoá không chỉ cần thoả mãn nhu cầu giải trí tức thời mà còn phải hướng đến những điều nhân văn, được xây dựng từ nội dung mang chiều sâu cùng hàm lượng nghệ thuật nhất định. Dự án “Đêm thơ trong thành phố” mang lại kết quả lớn lao mà bản thân mình cũng rất bất ngờ. Ví dụ, đêm thơ chủ đề thiếu nhi đã khơi gợi lại ký ức tuổi thơ, đêm thơ về cha đã giúp hàn gắn mối quan hệ gia đình, có những lời tỏ tình diễn ra ngay trong đêm thơ và sau này khi quay trở lại thì họ đã trở thành vợ chồng,... Toàn bộ số tiền bán vé của sự kiện được mình và ekip gửi tới các quỹ thiện nguyện uy tín như để lan toả tinh thần chân - thiện - mỹ mà dự án hướng tới.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Hai là, phải sáng tạo ra ngôn ngữ nghệ thuật riêng hoặc ít nhất là mới mẻ hơn, chứ không nên nói lại, không chịu làm thừa.</em></i></p></blockquote><p><span style=\"white-space: pre-wrap;\">Thơ cần được sắp đặt khéo léo để tăng thêm sức quyến rũ. Ở concept show mới ra mắt The Muse Night, thơ và ca được trình diễn theo tinh thần nhạc Jazz. Sự kiện tổ chức ở quán Bar nằm giấu mình trong con ngõ nhỏ đậm chất Hà Nội. Bên ly rượu, mọi người trò chuyện về chủ đề nào đó, cùng chơi drinking game, thưởng thức thơ ca và còn có cả những món quà để mang về. Chúng mình đã kết hợp nhạc của Whitney Houston và thơ của Hàn Mặc Tử trong đêm chủ đề Giáng sinh, và đã nhận về nhiều khen ngợi từ khán giả.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Các dự án văn hoá của anh đều có sự tham gia, đồng hành của các thiết chế văn hoá lớn, những thương hiệu lớn. Bí quyết nào để anh thuyết phục họ?</span></h2><p><span style=\"white-space: pre-wrap;\">Một ý tưởng sáng tạo là chưa đủ, cần đính kèm theo đó là bản kế hoạch rõ ràng và thực tế. Mỗi dự án là cơ hội để mình và cộng sự được học hỏi, trau dồi kinh nghiệm làm việc để ngày càng chuyên nghiệp.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Mình đề nghị được “tạm ứng niềm tin”, được tín chấp dựa trên năng lực chuyên môn, dựa trên nhiệt huyết tuổi trẻ với lòng yêu văn hoá chân thành.</em></i></p></blockquote><p><span style=\"white-space: pre-wrap;\">Trong suốt quá trình hợp tác, mình thường xuyên trao đổi, kết nối để thấu hiểu nhiều hơn. Qua đó, mình dần được gắn kết với những con người cùng chung đam mê, thường xuyên chia sẻ, sẵn sàng hỗ trợ nhau để hiện thực hóa ý tưởng, tạo nên vốn xã hội (</span><a href=\"https://vietcetera.com/vn/social-capital-la-gi-ban-co-dang-am-tham-giau-len-bang-niem-tin-cua-nguoi-khac\"><span style=\"white-space: pre-wrap;\">Social Capital</span></a><span style=\"white-space: pre-wrap;\">) giàu có. Cùng phấn đấu, cùng trưởng thành. Tất cả vì tình yêu Hà Nội!</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Từ khởi xướng ý tưởng, tổ chức thực hiện rồi cả sáng tác và trình diễn thơ, anh có hướng đến hình tượng là một nghệ sĩ đa năng?</span></h2><p><span style=\"white-space: pre-wrap;\">Mình từng rất băn khoăn về danh tính bản thân.</span></p><p><span style=\"white-space: pre-wrap;\">Đôi khi, có người gọi mình là nhà thơ, là giám tuyển nội dung (content curator) nhưng mình nghĩ đó đều là những danh tính cao quý không dễ gì đạt được.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Mình biết cụm từ “công nhân văn hoá” (cultural worker) chỉ một người làm nhiều công việc để góp phần lan toả, phát triển giá trị văn hoá. Mình nghĩ bản thân có thể chen chân đứng vào đó!</em></i></p></blockquote><p><span style=\"white-space: pre-wrap;\">Mình đánh giá đây sẽ là công việc quan trọng, ngày càng cần thiết và nên được nhìn nhận tốt hơn. Nó mang lại vị thế, cơ hội việc làm cho người trẻ trong nước. Một công việc không dễ dàng bị thay thế bởi trí tuệ nhân tạo và cũng khó bị cạnh tranh bởi lực lượng lao động nhập cư từ nước ngoài, bởi rõ ràng người Việt có lợi thế tốt nhất để đóng góp phát triển cho nền công nghiệp văn hoá Việt Nam.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114592750-309432241.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Có một Nguyễn Kiên làm công nhân văn hoá, có một Thế Lãng miệt mài thực hành thơ. Hai “con người” này sống hoà thuận với nhau không?</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hai đứa nó thường quấn quít, nhưng có lúc đánh nhau vỡ đầu! (cười)</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Kiên mang sân khấu cho Lãng đọc thơ. Lãng tư duy thơ cho Kiên ý tưởng.</em></i></p></blockquote><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Áp lực dự án liên tục khiến mình nhiều khi rơi vào trạng thái đóng băng cảm xúc. Đấy là chưa kể đến công việc cũng rất nhiều tại cơ quan và các chương trình học cá nhân. Cảm giác bị mâu thuẫn giữa những “con người” bên trong đã chuyển biến thành lối sống biết thích nghi, chấp nhận lấy nghề tay phải mà nuôi sống đam mê.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Việc có bút danh khi viết thơ văn là cách để mình bước vào thế giới bay bổng riêng với câu chữ, ý tưởng. Bảo rằng tách biệt hoàn toàn với con người, cuộc sống thường ngày thì không đúng nhưng rõ ràng nó là cách hay để mình được sống hết mình với đam mê. Chữ “Lãng” lấy từ “Lãng Bạc” - tên gọi khác của Hồ Tây cũng là nơi gắn bó với mình từ nhỏ.</span></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nếu ai đó muốn làm những việc giống anh nhưng không biết bắt đầu từ đâu, anh sẽ nói gì với họ?</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">“Cứ làm thôi”</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nếu làm việc có ý nghĩa cho xã hội, làm chân thành và hết sức thì mình tin mọi thứ sẽ dần dần trở nên rõ ràng, thuận lợi.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Các bạn trẻ nên thử nghỉ xem bản thân thích gì, giỏi gì và mạnh dạn làm thành các dự án cá nhân. Chúng ta sẽ học được nhiều điều qua đó với vai trò là người đầu tư, người làm, người chịu trách nhiệm. Tìm kiếm, gia nhập vào cộng đồng có chung đam mê, sở thích sẽ giúp bạn hạnh phúc và ngày càng trưởng thành hơn.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Đối với riêng lĩnh vực văn hoá, bạn cần dành nhiều thời gian nghiên cứu, suy tư và đi cảm nhận thực tế. Dù không làm thành dự án thì đây cũng là cơ hội để bạn tìm hiểu văn hoá Việt Nam. Mình thường lên một danh sách các vấn đề, chủ điểm quan tâm như: nghệ thuật hát ca trù, phong trào Thơ mới, kỹ thuật tranh sơn mài, … rồi đi tìm kiếm các tư liệu, dành khoảng thời gian từ 1 - 2 tháng nghiên cứu, nếu được thì viết lại thành bài tổng hợp, chia sẻ trên trang cá nhân. Dần dần, bạn có thêm nhiều kiến thức, có cái nhìn bao quát liên ngành.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Mỗi người Việt Nam là đại sứ văn hoá, ai ai cũng có trách nhiệm tìm hiểu và phát triển các giá trị bản địa tốt đẹp.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114620759-377829480.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Là người trẻ độc lập lại là “dân ngoại đạo” làm văn hoá, anh gặp phải những khó khăn và vượt qua như thế nào?</span></h2><p><span style=\"white-space: pre-wrap;\">Khó khăn thì nhiều, nhưng sau cùng mình nghĩ chủ yếu đến từ những hạn chế của cá nhân bởi vì chẳng ai có thể thay đổi được hết những điều bên ngoài bản thân. Thiếu kiến thức thì đọc sách nhiều hơn. Thiếu mạng lưới quan hệ thì cần chăm đi kết nối. Thiếu kỹ năng thì hãy mạnh dạn làm và phải làm cho thật tốt, …</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Bản thân nên giữ tinh thần lạc quan, mình rất thích câu thơ của Xuân Diệu là “Thi sĩ đi đâu cũng thấy cười”.</em></i></p></blockquote><p><span style=\"white-space: pre-wrap;\">Mình thích quy tắc tốt hơn 1% mỗi ngày, đồng thời, không ngừng manifest như bao bạn GenZ khác. Ngày trước, mình không tin vào câu nói \"Khi bạn thực sự muốn một điều gì, cả vũ trụ sẽ hợp lực giúp bạn đạt được nó” nhưng kể từ ngày quyết tâm theo con đường này, mình tin hơn nhiều.</span></p><p><span style=\"white-space: pre-wrap;\">Những lúc chán nản, mình lượn lờ một vòng Hà Nội, lê la quán xá, khám phá ngõ ngách hay đơn giản là vừa ngồi đọc sách vừa ngắm phố phường. Hà Nội sạc pin cho mình như thế! Không chỉ có Hà Nội, mình vô cùng biết ơn gia đình, những người bạn và khán thính giả luôn dõi theo, cổ vũ và đóng góp sức lực để cùng mình thực hiện, phát triển các dự án văn hoá nghệ thuật.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Trong thời gian tới, anh có đánh giá gì về sự phát triển nền công nghiệp văn hoá tại Hà Nội và có kế hoạch nào không?</span></h2><p><span style=\"white-space: pre-wrap;\">Trong thời gian tới, mình tin chắc không chỉ ở Hà Nội mà nhiều địa phương trên cả nước sẽ đều phát triển các hoạt động, sự kiện văn hoá nghệ thuật. Công chúng ngày càng có thêm nhiều cơ hội để thưởng thức, giao lưu, tìm hiểu về văn hoá Việt Nam và quốc tế. Mình rất phấn khích khi nghĩ về điều này.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Đối với cá nhân, mình tiếp tục làm việc với các thiết chế văn hoá lớn để mang tới công chúng nhiều dự án, hoạt động hấp dẫn, phản ánh đúng tinh thần Hà Nội đa sắc, giàu truyền thống nhưng cũng rất hiện đại.</em></i></p></blockquote><p><span style=\"white-space: pre-wrap;\">Mình mong được gặp gỡ, kết nối nhiều hơn với các nghệ sĩ, các nhóm dự án văn hoá và cả các doanh nghiệp để tạo nên mạng lưới tin cậy, cùng nhau thúc đẩy nền công nghiệp văn hoá địa phương. Trong đó, mình tin tưởng các hoạt động, sự kiện liên quan đến thơ văn sẽ ngày càng phong phú, và được nhiều bạn trẻ đón nhận.</span></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114531578-680740635.webp', NULL, NULL, '“Hạnh phúc của mình là mang đến hạnh phúc cho cộng đồng qua thơ ca, qua những câu chuyện kể về Hà Nội với tình yêu chân thành cùng tấm lòng giản dị”', NULL, NULL, 6, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 10:23:49', '2025-12-19 14:15:22');
INSERT INTO `bai_viet` (`id`, `tieu_de`, `slug`, `noi_dung`, `anh_dai_dien`, `meta_title`, `meta_description`, `mo_ta_ngan`, `category`, `tags`, `luot_xem`, `trang_thai`, `ngay_dang`, `da_xoa`, `ngay_xoa`, `id_tac_gia`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(18, 'Chú tâm - Món quà quý giá cho chính mình và tha nhân', 'chu-tam-mon-qua-quy-gia-cho-chinh-minh-va-tha-nhan', '<p><span style=\"white-space: pre-wrap;\">Tôi có một người em họ khá thành công trong sự nghiệp và cũng đang nuôi dạy đứa con trai 4 tuổi. Tuần rồi, em ấy hẹn tôi ra quán cafe vì muốn hỏi tôi vài ý kiến chuyên môn trong việc dạy con khi thấy con ngày càng lớn. Giữa câu chuyện, em dừng lại, ánh mắt nhìn xuống, giọng run run:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">\"Thực ra con cứ kéo tay em, cứ gọi \'mẹ ơi, mẹ ơi\', nhưng đầu óc em cứ nghĩ đến deadline công việc. Em có mặt đó, nhưng em không thực sự ở đó.\"</em></i></p><p><span style=\"white-space: pre-wrap;\">Câu nói ấy vẫn đọng lại trong tôi. Bởi vì đó chính là câu chuyện của rất nhiều người chúng ta: Chúng ta có mặt về thân thể, nhưng không hiện diện bằng tâm trí. Chúng ta nhìn, nhưng không thực sự thấy. Chúng ta nghe, nhưng không thực sự lắng nghe.</span></p><p><span style=\"white-space: pre-wrap;\">Và gốc rễ của tất cả những điều đó nằm trong một năng lực vô cùng cần thiết cho mỗi người chúng ta:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">khả năng chú tâm (attention)</strong></b><span style=\"white-space: pre-wrap;\">. Trong bài viết này, tôi muốn mời các bạn cùng chiêm nghiệm về một số khía cạnh quan trọng của năng lực chú tâm ảnh hưởng tới khả năng tương giao với tha nhân của mỗi người.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Từ gắn bó đến chú tâm: Gốc rễ của yêu thương</span></h2><p><span style=\"white-space: pre-wrap;\">Một trong những bài học thuộc dạng “vỡ lòng” khi tôi học Tâm lý học Phát triển là câu chuyện nhà tâm lý học John Bowlby nghiên cứu những đứa trẻ mồ côi sau Thế chiến II và phát hiện ra một điều chấn động thời đó:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Những đứa trẻ được nuôi dưỡng đầy đủ về dinh dưỡng nhưng thiếu vắng sự tương tác, sự chú ý từ người chăm sóc không phát triển được những năng lực cảm xúc cơ bản như yêu thương, đồng cảm, kết nối.</em></i></p><p><span style=\"white-space: pre-wrap;\">Trước đó, người ta tin rằng con người sẽ tự động phát triển các năng lực tâm lý khi lớn lên theo từng độ tuổi, nhưng Bowlby đã chứng minh rằng: Chính&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">mô thức gắn bó&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(attachment)</strong></b></i><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">đầu tiên giữa đứa trẻ và người chăm sóc chính (là mẹ, là ba, hay cũng có thể là bà ngoại, bà nội...) - qua sự tương tác, cái nhìn, cử chỉ, sự chú tâm - mới hình thành nên khả năng tương giao với tha nhân và yêu thương sau này.</span></p><p><span style=\"white-space: pre-wrap;\">Đó là lý do tại sao có những đứa trẻ được xem là phá phách trong lớp thực ra không nghịch ngợm vì bản tính xấu. Các em chỉ đang cố gắng thu hút sự chú ý:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">\"Thầy ơi, cô ơi, nhìn em đi. Em đang ở đây!\"</em></i><span style=\"white-space: pre-wrap;\">. Bởi vì nếu không được chú ý, các em cảm thấy mình tan biến - như thể mình không tồn tại. Cảm giác đó còn tệ hơn việc bị la mắng hay trừng phạt.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114668953-716507332.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><span style=\"white-space: pre-wrap;\">Và điều này không chỉ đúng với trẻ em. Cả chúng ta khi trưởng thành cũng vậy:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Chúng ta cần được nhìn thấy để có thể tồn tại lành mạnh.</strong></b></p><p><span style=\"white-space: pre-wrap;\">Vậy, bạn có được “nhìn thấy” trong cuộc sống hiện tại chưa?</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Nghịch lý của chú tâm: Sợ cái ta khao khát nhất</span></h2><p><span style=\"white-space: pre-wrap;\">Nhưng có một điều nghịch lý mà tôi nhận ra qua nhiều năm tham vấn tâm lý:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Đôi khi điều người ta sợ nhất chính là sự chú tâm trong mối quan hệ yêu đương</strong></b><span style=\"white-space: pre-wrap;\">.</span></p><p><span style=\"white-space: pre-wrap;\">Tại sao ta lại sợ cái ta khao khát?</span></p><p><span style=\"white-space: pre-wrap;\">Bởi vì khi ai đó thực sự chú tâm đến ta, họ sẽ&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">thấy ta</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- không phải cái mặt nạ ta đeo, không phải cái vỏ bọc ta xây dựng, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">chính ta</strong></b><span style=\"white-space: pre-wrap;\">. Và điều đó có thể kích hoạt những nỗi đau sâu kín, những điều mà ta không dám đối diện.</span></p><p><span style=\"white-space: pre-wrap;\">Từ nhỏ, nhiều người trong chúng ta học được rằng:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">\"Nếu con muốn được yêu thương, con phải là đứa trẻ ngoan, phải đạt điểm cao, phải làm theo ý cha mẹ.\"&nbsp;</em></i><span style=\"white-space: pre-wrap;\">Đó là sự chấp nhận có điều kiện. Để được chấp nhận, ta từ bỏ một phần căn tính của chính mình - những gì thực sự là ta - để đeo lên một chiếc mặt nạ, hoặc nhiều mảnh mặt nạ khác nhau.</span></p><p><span style=\"white-space: pre-wrap;\">Khi lớn lên, ta mang những lớp mặt nạ đó vào các mối quan hệ. Ta yêu và được yêu qua những cái mặt nạ, và đó là một sự đau khổ trầm lặng - bởi sâu thẳm bên trong, ta biết rằng người kia không thực sự yêu ta, mà chỉ yêu cái hình ảnh ta tạo ra. Ta cũng nghi ngờ mình có thực sự yêu người đó không, hay chỉ yêu những gì người đó đang phô bày cho ta thấy.</span></p><p><span style=\"white-space: pre-wrap;\">Do đó,&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">chú tâm thực sự đòi hỏi sự can đảm</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- từ cả người cho lẫn người nhận. Người cho phải đủ can đảm để nhìn thấy cả vẻ đẹp lẫn những vết nứt của người nhận. Người nhận phải đủ can đảm để cho phép mình được nhìn thấy, dù đó là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">những điều yếu đuối mong manh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(vulnerable)</strong></b></i><span style=\"white-space: pre-wrap;\">&nbsp;nhất của mình.</span></p><p style=\"text-align: center;\"><br></p><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.Bản chất của chú tâm: Dòng nước chảy, không phải keo dính cứng</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Nhiều người hiểu lầm rằng chú tâm có nghĩa là nhìn chằm chằm vào ai đó, hoặc luôn luôn hỏi han, tìm hiểu… dẫn đến người thụ hưởng có thể cảm thấy đang bị “giám sát, mất tự do”. Tuy nhiên, trong phần này, tôi muốn giúp bạn nhìn nhận lại chính xác hơn bản chất của sự chú tâm. Đặc điểm của chú tâm là rất linh hoạt và thích ứng chứ không phải cứng nhắc.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Hãy tưởng tượng sự chú tâm như một dòng nước. Nếu nó trở thành keo dính - dính vào một nỗi lo, một suy nghĩ, một cảm xúc rồi không thể rời ra - thì nó không còn là chú tâm nữa, mà là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự ám ảnh&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(obsession)</strong></b></i><span style=\"white-space: pre-wrap;\">. Nhưng nếu nó có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Trong tâm lý học, khả năng này gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><span style=\"white-space: pre-wrap;\">, còn trong Phật học gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">“sự diệu dụng của tâm”</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- bạn có thể ở trọn vẹn với điều này, rồi nhẹ nhàng chuyển sang ở trọn vẹn với điều kia. Chúng ta sẽ dễ rơi vào đau khổ bởi bám chấp nếu sự chú tâm của mình mất đi tính linh hoạt này.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114686914-656185376.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><span style=\"white-space: pre-wrap;\">Vậy thì chú tâm thực sự là gì?</span></p><p><span style=\"white-space: pre-wrap;\">Tôi quan niệm rằng chú tâm là</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">&nbsp;</em></i><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">sự hiện diện trọn vẹn&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(fully presence)</strong></b></i><span style=\"white-space: pre-wrap;\">: Khi bạn chú tâm đến con, bạn không chỉ nhìn bằng mắt, bạn dùng&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">toàn bộ sự hiện diện</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;của mình để đón nhận mọi diễn biến trong môi trường của đứa trẻ đó. Bạn không chỉ lắng nghe bằng tai, mà còn bằng cả trái tim, cả hệ thần kinh. Bạn cảm nhận được tâm trạng của con qua giọng nói, qua cử chỉ, qua hơi thở, và qua cả những khoảng im lặng.</span></p><p><span style=\"white-space: pre-wrap;\">Khi bạn chú tâm đến người bạn yêu, bạn không cần phải luôn nắm tay họ. Nhưng khi họ tâm sự, bạn thực sự ở đó - không nghĩ về công việc, không lướt điện thoại, không tính toán câu trả lời hay câu hỏi tiếp theo. Bạn chỉ đơn giản là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">ở đó với họ, bằng toàn bộ thân-tâm mình</strong></b><span style=\"white-space: pre-wrap;\">, với những cơn sóng cảm xúc cộng hưởng giữa hai bên, trong khoảnh khắc đó.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Nền tảng của chú tâm: Cơ thể và hệ thần kinh</span></h2><p><span style=\"white-space: pre-wrap;\">Tiếp theo là câu hỏi quan trọng: Làm sao chúng ta có thể “chú tâm như dòng nước” giống như tôi mô tả ở trên?</span></p><p><span style=\"white-space: pre-wrap;\">Chúng ta cần quay về nền tảng:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Chú tâm thật sự bắt đầu từ cơ thể</strong></b><span style=\"white-space: pre-wrap;\">. Nếu chúng ta không thể hiện diện trọn vẹn với chính cơ thể mình, với mọi diễn biến thân-tâm đang diễn ra, chúng ta không thể thực sự hiện diện với bất kỳ ai. Thực ra, ai trong chúng ta khi sinh ra cũng sở hữu khả năng này, nhưng khi lớn lên, nhất là trong thời hiện đại với vô vàn thiết bị và làn sóng thông tin vây quanh, chúng ta dần rơi vào trạng thái “chỉ sống trong đầu” mà dần mất kết nối với cảm nhận cơ thể mình.</span></p><p><span style=\"white-space: pre-wrap;\">Để bắt đầu phục nguyên lại năng lực chú tâm, bạn có thể thực hành một phương pháp trong Phật giáo gọi là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">\"quán cảm thọ toàn thân\"</strong></b><span style=\"white-space: pre-wrap;\">, sau đó Giáo sư Jon Kabat-Zinn đã mang nó sang phương Tây, đặt tên là Body scan. Đây không phải là thực hành tôn giáo, mà là một biện pháp luyện tâm, cụ thể hơn là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">rèn luyện năng lực linh hoạt nhận thức&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(cognitive flexibility)</strong></b></i><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">- khả năng di chuyển sự chú ý một cách tự do giữa các đối tượng như dòng nước chảy mà tôi có trình bày ở trên.</span></p><p><span style=\"white-space: pre-wrap;\">Cách thực hành quán cảm thọ toàn thân rất đơn giản: Bạn đưa sự chú ý của mình lên từng phần trên cơ thể - từ đỉnh đầu, trán, mắt, xuống cổ, vai, ngực, bụng, chân... Trong từng khoảnh khắc, bạn hiện diện trọn vẹn với các cảm giác xuất hiện ở phần đó. Cảm nhận tất cả những gì đang diễn ra: sự căng - chùng của cơ bắp, cảm giác ấm, mát, nhẹ nhàng, nặng nề, thăng bằng hay nghiêng lệch… Bạn không cần phải can thiệp hay thay đổi bất kỳ điều gì, chỉ cần hiện diện và cảm nhận.</span></p><p><span style=\"white-space: pre-wrap;\">Rồi sau vài hơi thở, bạn nhẹ nhàng di chuyển sự chú ý sang phần khác. Đây chính là điểm then chốt: Mỗi khi bạn</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;tách sự chú ý ra&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(detach)</strong></b></i><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">để đi sang phần khác,</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">lúc đó bạn đang</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">thực hành</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;khả năng linh hoạt nhận thức</strong></b><span style=\"white-space: pre-wrap;\">. Mỗi ngày thực hành như vậy, bạn đang củng cố các mạch thần kinh cho phép sự di chuyển này trở nên linh hoạt, tự do, hiệu quả, trọn vẹn. Não bộ bạn đang học lại sự thật rằng:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">\"Ta có thể ở&nbsp;</em></i><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">trọn vẹn</strong></b></i><i><em class=\"italic\" style=\"white-space: pre-wrap;\">&nbsp;với cái này, rồi nhẹ nhàng chuyển sang ở&nbsp;</em></i><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">trọn vẹn</strong></b></i><i><em class=\"italic\" style=\"white-space: pre-wrap;\">&nbsp;với cái kia mà không bị vướng bận lại chút nào\"</em></i><span style=\"white-space: pre-wrap;\">. Tới một lúc, bạn sẽ thấy không còn ý tưởng hay cảm xúc ám ảnh nào có thể bấu víu lấy bạn nếu bạn không muốn nữa. Tâm trí của bạn sẽ thực sự linh hoạt như dòng nước: chảy tới nơi cần chảy, và rời khỏi nơi cần rời khỏi một cách tự nhiên, không cần nỗ lực.</span></p><p><span style=\"white-space: pre-wrap;\">Và đây chính là năng lực bạn cần để chú tâm đến con, đến người thân, đến tất cả mọi người đến với cuộc đời bạn trong từng khoảnh khắc mà không bị mệt mỏi, không bị kiệt sức.</span></p><p><span style=\"white-space: pre-wrap;\">Không chỉ vậy,&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">khả năng hiện diện trọn vẹn với thân-tâm mình&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">cũng là&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">món quà quý giá nhất&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">mà bạn có thể trao cho chính bản thân mình.</span></p><p><span style=\"white-space: pre-wrap;\">Trong phòng tham vấn, nhiều lần tôi chỉ hỏi một câu: \"Cơ thể bạn muốn làm gì lúc này?\" Và người thân chủ, vốn đang ngồi thẳng lưng, gồng lên hoặc kiềm chế, tự nhiên buông lỏng ra. Có người ôm lấy mình, có người tự vỗ về, có người khóc trọn vẹn… Sau đó họ phục hồi, nhẹ nhàng hơn, như thể một gánh nặng đã được buông xuống.</span></p><p><span style=\"white-space: pre-wrap;\">Tại sao lại như vậy?</span></p><p><span style=\"white-space: pre-wrap;\">Bởi vì chúng ta đang sống trong một thế giới câu thúc mỗi người phải đáp ứng quá nhiều yêu cầu từ bên ngoài. Người khác muốn ta làm thế này, quy tắc xã hội muốn ta làm thế kia, quy định tổ chức muốn ta làm thế nọ... Và đôi khi chúng ta quên mất nhu cầu căn bản nhất từ chính thân thể của mình - nó đang muốn gì.</span></p><p><span style=\"white-space: pre-wrap;\">Mời bạn thử&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">thực sự quay về với cơ thể</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- không đặt điều kiện, không yêu cầu nó phải thế này thế kia - và bạn hỏi: \"Cơ thể đang muốn gì?\" Có thể nó muốn xoa hai bàn tay, muốn áp đôi tay ấm vào mặt, muốn bóp đôi vai đang gồng cứng, muốn ôm lấy chính mình…</span></p><p><span style=\"white-space: pre-wrap;\">Hãy để cho nó làm, tự nhiên và trọn vẹn.</span></p><p><span style=\"white-space: pre-wrap;\">Đó chính là</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;sự chú tâm</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;và quan tâm tuyệt vời nhất mà bạn có thể dành cho bản thân. Chỉ khi bạn biết cách chú tâm đến chính mình như vậy, bạn mới có thể chú tâm đến người khác một cách chân thật - không vì nghĩa vụ, không vì kỳ vọng, mà đơn giản vì bạn có khả năng ấy.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114699958-147499586.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><h2 class=\"text-2xl font-bold mb-3\" style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Dòng chảy của chú tâm: Từ bản thân đến người khác</span></h2><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Một trong những thách thức lớn nhất của thời đại này với đa số chúng ta là “không có đủ thời gian”, và đó cũng là một trong những trở ngại lớn nhất với sự chú tâm. Để vượt qua thử thách đó, tôi mời bạn suy ngẫm điều này:&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Chú tâm không đo bằng thời gian</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;(bao lâu), mà đo bằng</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;chất lượng hiện diện</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;(</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">trọn vẹn&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">và</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;chân thật&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">đến đâu).</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Năm phút chú tâm trọn vẹn có ý nghĩa hơn năm giờ hiện diện hời hợt. Một cái nhìn thực sự “thấy” người kia&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">(I see you)</em></i><span style=\"white-space: pre-wrap;\">&nbsp;có thể chữa lành hơn một trăm lời nói suông. Một khoảnh khắc lắng nghe bằng trái tim có thể xây dựng cây cầu nối kết mà hàng tháng trời nói chuyện hời hợt không làm được.</span></p><p style=\"text-align: start;\"><span style=\"white-space: pre-wrap;\">Khi bạn thực sự hiện diện, bạn sẽ cảm nhận được “rung động và nhịp điệu” của người kia. Tâm lý học gọi đó là</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">&nbsp;</em></i><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">đồng điệu&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(attunement)</strong></b></i><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">&nbsp;</strong></b><span style=\"white-space: pre-wrap;\">hay&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">cộng hưởng&nbsp;</strong></b><i><b><strong class=\"font-bold italic\" style=\"white-space: pre-wrap;\">(resonance)</strong></b></i><span style=\"white-space: pre-wrap;\">. Đứa trẻ đang cần bạn ôm, hay đang cần bạn để nó tự khám phá? Người bạn yêu đang cần bạn nói chuyện, hay chỉ cần bạn ngồi bên trong im lặng? Cha mẹ già đang cần bạn hỏi han, hay chỉ cần bạn nắm tay họ? Khi bạn hiện diện trọn vẹn với họ bằng sự chú tâm chân thật, bạn sẽ biết ngay bằng chính cảm nhận của mình chứ không cần phải hỏi một câu nào.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">Năm phút chú tâm trọn vẹn có ý nghĩa hơn năm giờ hiện diện hời hợt.</span></p></blockquote><p style=\"text-align: start;\"><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Chú tâm chân thật sẽ giúp chúng ta ở trạng thái vừa đủ</strong></b><span style=\"white-space: pre-wrap;\">&nbsp;- không nhiều hơn, không ít hơn. Nhờ vậy, chúng ta có thể đáp ứng chính xác những gì người kia đang cần ở thời điểm đó.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Chữa lành qua chú tâm: Món quà ta trao cho nhau</span></h2><p><span style=\"white-space: pre-wrap;\">Tôi tin rằng khi ta chú tâm đến người khác một cách thuần khiết - không vì ta muốn nhận lại điều gì, không vì ta muốn họ thay đổi, mà đơn giản vì ta thấy giá trị trong sự hiện diện của họ - ta đang chữa lành cả người đó lẫn chính ta.</span></p><p><span style=\"white-space: pre-wrap;\">Người kia được chữa lành vì họ được nhìn thấy, được đón nhận, được trân trọng như chính con người họ - không phải qua lớp mặt nạ, mà qua chính căn tính chân thật, toàn vẹn bao gồm cả ánh sáng lẫn bóng tối của họ. Và ta cũng được chữa lành vì qua hành động chú tâm đó, ta đang tái kết nối với khả năng yêu thương thuần khiết của chính mình - khả năng mà có thể đã bị chôn vùi dưới nhiều lớp vỏ bọc phòng vệ, dưới các mô thức chỉ “sống trong đầu, sống bằng ngôn từ”.</span></p><p><span style=\"white-space: pre-wrap;\">Do đó, tôi cho rằng&nbsp;</span><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">chú tâm là món quà quý giá nhất ta có thể trao cho nhau</strong></b><span style=\"white-space: pre-wrap;\">. Nó không tốn tiền, không cần chuẩn bị, chỉ cần ta thực sự ở đó, trọn vẹn với chính ta và với người mà ta đang chú tâm tới.</span></p><p><span style=\"white-space: pre-wrap;\">Và đó chính là tình yêu - ở dạng thức thuần khiết nhất của nó.</span></p><h2 class=\"text-2xl font-bold mb-3\"><span style=\"white-space: pre-wrap;\">Thực hành chú tâm: Từng bước mỗi ngày</span></h2><p><span style=\"white-space: pre-wrap;\">Tối nay, trước khi ngủ, tôi mời bạn thử điều này:</span></p><p><span style=\"white-space: pre-wrap;\">Dành 5-10 phút ngồi hoặc nằm xuống. Nhắm mắt. Từ từ đưa sự chú ý đi qua từng phần trên cơ thể - từ đỉnh đầu lần lượt xuống tới bàn chân. Cảm nhận tất cả những gì đang diễn ra, không cần thay đổi gì, không tưởng tượng hay hồi tưởng thêm điều gì. Chỉ cần ở đó, với chính mình.</span></p><p><span style=\"white-space: pre-wrap;\">Sau đó, khi thực hành xong, hãy hỏi cơ thể bạn:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">\"Cơ thể muốn làm gì lúc này?\"</em></i><span style=\"white-space: pre-wrap;\">&nbsp;Và cho phép nó làm - dù đó là vươn vai, xoa bàn tay, ôm lấy chính mình, hay bất kỳ chuyển động nào khác.</span></p><p><span style=\"white-space: pre-wrap;\">Vào ngày mai, khi bạn gặp một người mà bạn yêu thương - con bạn, người bạn yêu, cha mẹ, hay một người bạn - hãy dành cho họ một khoảnh khắc chú tâm trọn vẹn. Chỉ một khoảnh khắc thôi.</span></p><p><span style=\"white-space: pre-wrap;\">Nhìn họ như thể bạn đang nhìn họ lần đầu tiên. Lắng nghe họ như thể đây là lần cuối cùng mình được nghe tiếng họ. Hiện diện với họ như thể không có gì quan trọng hơn ở thời điểm này.</span></p><p><span style=\"white-space: pre-wrap;\">Rồi quan sát xem điều gì xảy ra - trong họ, trong bạn, trong không gian giữa hai người.</span></p><p><span style=\"white-space: pre-wrap;\">Bởi vì mỗi lần chúng ta chú tâm đến nhau một cách chân thật, chúng ta đang trao cho nhau món quà của sự tồn tại - món quà cho phép người kia biết rằng:&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">\"Bạn ở đây. Tôi thấy bạn. Và sự hiện diện của bạn có ý nghĩa\".</em></i></p><p><span style=\"white-space: pre-wrap;\">Và đó, có lẽ, là điều mà tất cả chúng ta - từ những đứa trẻ nhỏ cho đến những người trưởng thành - đều đang khao khát nhất trong cuộc đời này.</span></p><blockquote style=\"text-align: center;\"><p style=\"text-align: center;\"><span style=\"white-space: pre-wrap;\">Nhìn họ như thể bạn đang nhìn họ lần đầu tiên. Lắng nghe họ như thể đây là lần cuối cùng mình được nghe tiếng họ. Hiện diện với họ như thể không có gì quan trọng hơn ở thời điểm này.</span></p></blockquote><p><span style=\"white-space: pre-wrap;\">Mời bạn theo dõi tập 1 của chuỗi Podcast&nbsp;</span><i><em class=\"italic\" style=\"white-space: pre-wrap;\">Yêu Lành</em></i><span style=\"white-space: pre-wrap;\">&nbsp;mùa 5 từ Vietcetera mà tôi tham gia làm khách mời chính, chị Thuỳ Minh là host. Tập 1 này cũng thảo luận về sự chú tâm trong tình yêu, giống như chủ đề chính của bài viết này. Trong tập này, tôi cũng có phần hướng dẫn bằng lời để bạn thực hành quán cảm thọ toàn thân.</span></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114658725-954822285.webp', NULL, NULL, 'Nếu sự chú tâm có thể chảy tự do như nước, chạm vào mọi thứ nhẹ nhàng, có thể thấm sâu vào, rồi tiếp tục chảy, thì đó mới là chú tâm chân thật.', NULL, NULL, 4, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 10:25:21', '2025-12-19 14:15:22');
INSERT INTO `bai_viet` (`id`, `tieu_de`, `slug`, `noi_dung`, `anh_dai_dien`, `meta_title`, `meta_description`, `mo_ta_ngan`, `category`, `tags`, `luot_xem`, `trang_thai`, `ngay_dang`, `da_xoa`, `ngay_xoa`, `id_tac_gia`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(20, 'Điều gì khiến ta luôn lo sợ bị bỏ rơi?', 'dieu-gi-khien-ta-luon-lo-so-bi-bo-roi', '<p><span style=\"white-space: pre-wrap;\">Có người lớn lên trong tình yêu thương và yên bình. Nhưng cũng có người bước vào tuổi trưởng thành cùng nỗi hoài nghi, sợ hãi bị bỏ rơi, hoặc luôn cảm thấy mình “không đủ quan trọng” để được yêu thương trọn vẹn. Sự khác biệt ấy đã được hình thành từ rất sớm, qua những ngôn ngữ yêu thương mà chúng ta đón nhận khi còn nhỏ, đặc biệt là cách cha mẹ thể hiện tình yêu của họ với con mình.</span></p><p><span style=\"white-space: pre-wrap;\">Thế nhưng, nhiều người lại lầm tưởng chỉ cần con cái được nuôi nấng đầy đủ, ăn uống, học hành, áo quần tươm tất thì tự khắc sẽ lớn lên thành những người biết yêu thương, gắn bó và tin tưởng. Thực tế, John Bowlby đã phát hiện trong&nbsp;nghiên cứu&nbsp;của ông, bản chất của tình cảm và sự an toàn cảm xúc đã được hình thành từ những tương tác nhỏ, tinh tế, lặp đi lặp lại mỗi ngày giữa trẻ và người chăm sóc.</span></p><p><span style=\"white-space: pre-wrap;\">Sự chú tâm, do đó, là “chất dinh dưỡng” vô cùng cần thiết trong hành trình lớn lên của trẻ, và cũng là chủ đề trong tập đầu tiên của mùa&nbsp;Yêu Lành&nbsp;này.</span></p><p><span style=\"white-space: pre-wrap;\">Vai trò của sự chú tâm đối với tuổi thơ trẻ nhỏ</span></p><p><span style=\"white-space: pre-wrap;\">Nhà giáo dục Lương Dũng Nhân chia sẻ, điều đầu tiên giúp trẻ em an toàn và có cơ hội lớn lên chính là sự chăm sóc và chú tâm. Trong 8 giai đoạn phát triển mà nhà tâm lý học Erik Erikson mô tả, giai đoạn đầu tiên -&nbsp;từ 0 đến 2 tuổi&nbsp;là lúc trẻ hình thành “niềm tin căn bản” vào thế giới này.</span></p><p><span style=\"white-space: pre-wrap;\">Ở giai đoạn này, thế giới của một em bé vô cùng nhỏ, gần như gói trọn trong hình ảnh&nbsp;người chăm sóc chính (primary caregiver), có thể là bố, là mẹ, là bà…. Vì vậy, việc được chú ý đúng lúc, đúng nhu cầu, phản hồi một cách đều đặn không chỉ giúp trẻ thoải mái về mặt tâm sinh lý, mà còn tạo cho trẻ cảm giác rằng thế giới này an toàn, đáng tin và các em có thể tồn tại ở đây.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115789990-654487987.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><br></p><p><span style=\"white-space: pre-wrap;\">Vai trò thứ hai của sự chú tâm nằm ở sự phát triển nhận thức và năng lực học tập. Không phải tự nhiên mà trẻ em nào cũng biết cách tập trung, chú ý. Các em học khả năng này thông qua tiến trình&nbsp;đồng chú tâm (co-attention)&nbsp;- một hiện tượng được mô tả trong tâm lý học phát triển.</span></p><p><span style=\"white-space: pre-wrap;\">Đồng chú tâm xuất hiện rất tự nhiên trong những tương tác đời thường. Nếu cha mẹ có khả năng chú tâm trọn vẹn, không chỉ với con mà với môi trường xung quanh, trẻ cũng sẽ học được năng lực ấy. Bởi sự chú tâm không thể được dạy bằng lời, rằng “con hãy chú ý vào điều này, điều kia”. Nó được truyền sang trẻ qua sự&nbsp;đồng điều hòa (co-regulation)&nbsp;trong từng tương tác nhỏ: ánh mắt cha mẹ dừng lại ở đâu, phản hồi thế nào, có hiện diện trọn vẹn hay không.</span></p><p><span style=\"white-space: pre-wrap;\">Tuy nhiên, anh Nhân cũng chỉ ra một thực tế đau lòng của thời đại ngày nay, khi&nbsp;sự chú tâm của người lớn đang bị phân mảnh liên tục. Điện thoại, TV, công việc, tin nhắn… tất cả đều tranh giành từng giây của sự hiện diện. Điều này khiến nhiều bạn nhỏ phải lớn lên trong một môi trường - nơi cha mẹ thường xuyên chỉ dành&nbsp;một nửa sự chú tâm (half attention), như cách tác giả David Richo mô tả. Và trẻ, với sự nhạy cảm tự nhiên, luôn nhận ra điều đó.</span></p><p><span style=\"white-space: pre-wrap;\">Không gì khiến một đứa trẻ buồn hơn việc thấy rằng mình chỉ nhận được một nửa sự hiện diện của cha mẹ. Các em lớn lên trong một thế giới mà sự chú tâm đã bị chia cắt. Rất có thể, sau này, điều đó cũng vô thức lặp lại trong học tập, công việc và các mối quan hệ của các em.</span></p><p><span style=\"white-space: pre-wrap;\">Hình ảnh quen thuộc như cha mẹ vừa dạy con học vừa lướt điện thoại không chỉ làm giảm chất lượng kết nối, mà còn khiến trẻ khó hình thành khả năng tập trung.</span></p><p><span style=\"white-space: pre-wrap;\">Phản ứng mạnh mẽ của cha mẹ xuất phát từ những tổn thương bên trong họ</span></p><p><span style=\"white-space: pre-wrap;\">Từ kinh nghiệm tư vấn với phụ huynh, anh Nhân nhận ra phần lớn những phản ứng mạnh mẽ của cha mẹ với con không liên quan nhiều đến hành vi của trẻ. Cái ta nhìn thấy, một em bé khóc, mè nheo, hay bướng bỉnh, chỉ là bề mặt. Thứ thật sự khiến người lớn nổi giận, hoảng loạn hay mất kiểm soát thường là điều gì đó chưa được chữa lành ở bên trong họ.</span></p><p><span style=\"white-space: pre-wrap;\">Chẳng hạn, nhiều người lớn không chịu nổi tiếng khóc trẻ em. Đôi khi không phải vì âm thanh ấy quá khó chịu, mà vì nó gợi lại những ký ức không mấy đẹp đẽ, những lần khóc khi còn nhỏ không được đối xử dịu dàng, hay tệ hơn là bị quát mắng, bị bỏ mặc, bị yêu cầu phải “nín ngay lập tức”.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115803443-420260105.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><span style=\"white-space: pre-wrap;\">Cha mẹ còn phải đối mặt với áp lực xã hội: nỗi sợ bị đánh giá là dạy con không tốt nếu con khóc ở nơi công cộng, sợ bị chê trách nếu con cư xử “không đúng mực”. Tất cả những lớp lo âu dồn lại, và cuối cùng dẫn đến phản ứng mạnh mẽ.</span></p><p><span style=\"white-space: pre-wrap;\">Đây cũng là lý do sự chú tâm trở nên quan trọng.&nbsp;Khi ta thật sự chú tâm, ta đang mở rộng các giác quan&nbsp;để tiếp nhận mọi kích tác từ môi trường, tiếng con khóc, tình huống đang diễn ra, cảm xúc bên trong cơ thể. Nhưng giữa kích tác và phản ứng thật ra luôn tồn tại một khoảng trống. Viktor Frankl từng gọi đó là nơi ta có “quyền tự do lựa chọn”.</span></p><p><span style=\"white-space: pre-wrap;\">Chọn dừng lại.</span></p><p><span style=\"white-space: pre-wrap;\">Chọn hít thở thật sâu, giữ sự bình tĩnh.</span></p><p><span style=\"white-space: pre-wrap;\">Chọn phản hồi thay vì phản ứng.</span></p><p><span style=\"white-space: pre-wrap;\">Chọn nhận diện và hoá giải niềm đau cũ đang trỗi dậy, thay vì trút nó lên đứa trẻ trước mặt.</span></p><p><span style=\"white-space: pre-wrap;\">Nhưng thực tế, nhiều cha mẹ chưa thể tận dụng \"không gian tự do\" giữa kích tác và phản ứng mà Victor Frankl đã chỉ ra, bởi tiếng khóc của con đang kích hoạt những điều họ không chịu nổi, chưa từng được xử lý, chưa từng được nhìn vào.</span></p><p><span style=\"white-space: pre-wrap;\">Đề cập đến điều này, anh Nhân liên hệ đến&nbsp;mô hình 4 chữ S&nbsp;của nhà thần kinh học Daniel Siegel. Trong đó, chữ S cuối cùng -&nbsp;soothed, hay&nbsp;được an ủi, là một trong những món quà quan trọng nhất mà người chăm sóc có thể trao cho một em bé. Khi trẻ đau, khóc, đang chật vật với cảm xúc của chính mình, điều các em cần nhất không phải là lời răn đe hay giảng giải, mà là sự hiện diện dịu dàng có khả năng làm nguôi ngoai cơn bão đang diễn ra bên trong. Hành động an ủi lúc ấy có thể rất đơn giản như đặt tay lên chỗ con đang đau, ôm con, hoặc ngồi cạnh để con cảm nhận được sự có mặt trọn vẹn, thay vì những hành động như đánh vào chỗ vừa làm con đau, để rồi nhận ra những hành động ấy không hề giúp con cảm thấy an toàn mà còn khiến con hoảng loạn, bối rối và tổn thương hơn thế nữa.</span></p><p><span style=\"white-space: pre-wrap;\">Thậm chí khi không bị căng thẳng hay bùng nổ cảm xúc, trẻ vẫn cần nhận được sự an ủi trong những khoảnh khắc đời thường. Chính tại đây, anh Nhân nhấn mạnh một điều quan trọng:&nbsp;sự chú tâm không chỉ hướng ra môi trường hay con trẻ, mà còn phải quay về trạng thái thân - tâm của chính người chăm sóc.</span></p><p><span style=\"white-space: pre-wrap;\">Tuổi thơ vắng bóng sự chú tâm và ảnh hưởng đến những mối quan hệ yêu thương lành mạnh</span></p><p><span style=\"white-space: pre-wrap;\">Nhà giáo dục Lương Dũng Nhân cho biết, sự chú tâm không chỉ là nhìn - nghe - chăm sóc theo nghĩa vật lý. Nó là một dòng kết nối vô hình nhưng vô cùng rõ rệt, vượt ra ngoài khoảng cách địa lý.</span></p><p><span style=\"white-space: pre-wrap;\">Anh kể rằng nhiều học trò của mình dù đi du học nửa vòng trái đất vẫn cảm thấy sự hiện diện và quan tâm của cha mẹ như thể họ đang ở rất gần. Cảm giác này không tự nhiên mà có. Nó được tích lũy từ tuổi thơ qua những tương tác nhất quán, và được nuôi dưỡng qua những “nghi thức gia đình” mà nhiều nhà vẫn duy trì, như tuần nào cũng video call, chia sẻ và tâm sự cùng nhau. Những “nghi thức” tưởng như rất nhỏ chính là nền tảng giúp trẻ lớn lên với cảm giác mình được nâng đỡ, bao bọc và gắn kết.</span></p><p><span style=\"white-space: pre-wrap;\">Nhưng khi một bạn nhỏ không nhận được sự chú tâm cần thiết, hậu quả lại sâu xa hơn nhiều so với những gì người lớn thường nghĩ.</span></p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115814646-654902866.png\" alt=\"Pasted image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"><p><br></p><p><span style=\"white-space: pre-wrap;\">Theo Erik Erikson, việc thiếu chú tâm khiến trẻ mất đi niềm tin căn bản nhất vào thế giới. Các em sống trong trạng thái nghi hoặc, luôn cảm thấy có điều gì đó không an toàn, hình thành một dạng&nbsp;độc lập độc hại (toxic independence), lúc nào cũng nghĩ rằng mình chỉ có thể dựa vào chính mình. Các em khát khao yêu thương, khát khao điểm tựa, nhưng lại không tin những điều đó tồn tại. Hoặc nếu có, các em tin rằng mọi sự yêu thương đều có điều kiện, và người khác có thể lợi dụng mình bất cứ lúc nào. Chính vì vậy, khi nhận được sự quan tâm chân thành, những em bé lớn lên nhưng vắng bóng sự chú tâm thường… tự phá hỏng mối quan hệ, đẩy người khác ra xa.</span></p><p><span style=\"white-space: pre-wrap;\">Bên cạnh đó, anh Nhân cũng nhấn mạnh một yếu tố mà nhiều cha mẹ hay cả những người đang yêu thường bỏ qua:&nbsp;tính ổn định và công bằng của sự chú tâm.</span></p><p><span style=\"white-space: pre-wrap;\">Nếu trẻ em nhận được sự chú tâm nhưng thiếu ổn định, hoặc cảm thấy mình ít được quan tâm hơn so với anh chị em, cảm giác tổn thương và tủi thân sẽ len lỏi vào bên trong. Điều này ảnh hưởng trực tiếp đến cách các em yêu trong tương lai. Chỉ cần người yêu hơi lơ đãng, hay chỉ cần một tín hiệu rất nhỏ như thiếu đi một lời công nhận, cảm giác “mình không quan trọng” lập tức trỗi dậy.&nbsp;Những phản ứng nhạy cảm, dễ chạnh lòng, dễ tủi thân… đều là dư âm của tuổi thơ thiếu sự chú tâm ổn định và công bằng.</span></p><p><span style=\"white-space: pre-wrap;\">Quay về bên trong để an ủi chính mình</span></p><p><span style=\"white-space: pre-wrap;\">Hành trình chữa lành khỏi những tổn thương liên quan đến sự thiếu chú tâm trong tuổi thơ, theo anh Nhân, không ngắn. Nó đòi hỏi sự kiên nhẫn, đồng hành đúng cách, và quan trọng nhất là khả năng quay về bên trong để nhận diện và an ủi chính mình.</span></p><p><span style=\"white-space: pre-wrap;\">1. Với những người bị dissociation (phân ly)</span></p><p><span style=\"white-space: pre-wrap;\">Thông qua những buổi tham vấn, Nhà Giáo dục Lương Dũng Nhân đúc kết được một trong những thực trạng trầm trọng nhất ở người trưởng thành Việt Nam là hiện tượng&nbsp;dissociation&nbsp;- tách rời khỏi cảm xúc và cơ thể. Họ gần như sống hoàn toàn bằng lý trí, không còn cảm nhận rõ rệt tín hiệu từ cơ thể, cũng không nhận ra cảm xúc của người khác. Bởi nếu nhận ra, những điều ấy sẽ kích hoạt lại nỗi đau từ quá khứ.</span></p><p><span style=\"white-space: pre-wrap;\">Với nhóm này, bước đầu tiên chính là kết nối lại với bản thân, rất chậm, rất từ tốn, với sự hỗ trợ của chuyên gia được đào tạo chuyên sâu về chấn thương tâm lý. Bởi nếu làm một mình, nguy cơ tái chấn thương là rất lớn.</span></p><p><span style=\"white-space: pre-wrap;\">2. Với những ai có xu hướng overreact (phản ứng quá mức)</span></p><p><span style=\"white-space: pre-wrap;\">Một nhóm khác mà anh Nhân gặp là những người luôn phải làm “quá lên” để thu hút sự chú ý: nói lớn, phản ứng mạnh, bùng nổ cảm xúc, hoặc tạo kịch tính trong mối quan hệ. Ẩn dưới những phản ứng tưởng như “bất hợp lý” ấy thường là ký ức tuổi thơ thiếu chú tâm ổn định và công bằng.</span></p><p><span style=\"white-space: pre-wrap;\">Họ cần học cách quan sát lại toàn bộ tiến trình kích hoạt: Điều gì trong bối cảnh khiến mình phản ứng mạnh? Cảm giác cơ thể lúc đó ra sao? Tâm trí đang chạy những câu chuyện nào? “Mình không được yêu”, “Mình không quan trọng”, “Người ta sẽ bỏ mình”…?</span></p><p><span style=\"white-space: pre-wrap;\">Nhờ tiến trình điều hoà thân-tâm, họ sẽ học cách giúp hệ thần kinh lắng xuống, để phản ứng không còn bùng nổ như trước. Nhưng điều này không xảy ra trong một sớm một chiều, mà cần luyện tập, tạo ra những kết nối thần kinh mới, ổn định và lành hơn.</span></p><p><span style=\"white-space: pre-wrap;\">3. Với những người mang niềm tin tiêu cực về đời sống</span></p><p><span style=\"white-space: pre-wrap;\">Anh Nhân đã không ít lần gặp gỡ những người bước vào buổi tham vấn với một “chiếc ba lô” đầy quan điểm tiêu cực.</span></p><p><span style=\"white-space: pre-wrap;\">Điều họ cần, không phải là lý thuyết rằng “cuộc đời vẫn đẹp sao”. Họ cần một trải nghiệm thực, một mối tương giao chân thật để cơ thể “thực chứng”: vẫn có những người thực sự quan tâm mình, một cách vô điều kiện và không vụ lợi. Những mối tương giao ấy có thể đến từ một nhà trị liệu chuyên nghiệp, những người bạn thấu hiểu, một cộng đồng biết lắng nghe,...</span></p><p><span style=\"white-space: pre-wrap;\">Và quan trọng hơn, cách giải quyết đôi khi đến từ chính họ, khi họ bắt đầu cư xử với bản thân bằng lòng tử tế mà họ chưa từng nhận được.</span></p><p><span style=\"white-space: pre-wrap;\">4. Hành trình reparenting và chữa lành bằng tình yêu thương</span></p><p><span style=\"white-space: pre-wrap;\">Ở tầng sâu nhất của chữa lành, như anh Nhân chia sẻ, là giây phút ta nhận ra một sự thật: “Quá khứ đó không định nghĩa mình.”</span></p><p><span style=\"white-space: pre-wrap;\">Từ đó, ta mới bắt đầu một hành trình khác mang tên&nbsp;reparenting - trở thành cha mẹ của chính mình. Ta dịu dàng với chính phần trẻ thơ tổn thương trước đây, đồng thời, cũng có thể trao sự chú tâm, quan tâm vô điều kiện ấy cho những người mình yêu.</span></p><p><span style=\"white-space: pre-wrap;\">Có một giai đoạn trong chữa lành rất đẹp mà anh Nhân chia sẻ đến khán giả, đó là khi mình đã đủ mở lòng để yêu một người khác cũng còn đầy vết thương, nhưng ta yêu họ bằng chính sự chú tâm mà ngày xưa mình khao khát được nhận. Một tình thương dịu dàng, tỉnh thức và chân thành.</span></p><p><span style=\"white-space: pre-wrap;\">Chính tình thương ấy, theo nhiều nghiên cứu thần kinh học, tiết ra oxytocin, endorphin, những hormone chữa lành mạnh mẽ. Có ba tầng của lòng từ bi:</span></p><p><span style=\"white-space: pre-wrap;\">Từ bi nhận thức: hiểu vì sao người ấy phản ứng như vậy.</span></p><p><span style=\"white-space: pre-wrap;\">Từ bi cảm xúc: cảm được nỗi đau của họ nhưng không bị cuốn theo.</span></p><p><span style=\"white-space: pre-wrap;\">Từ bi hành động: mong muốn và chủ động hỗ trợ họ.</span></p><p><span style=\"white-space: pre-wrap;\">Khi cả ba tầng này hiện diện, não bộ rơi vào một trạng thái chữa lành sâu.</span></p><p><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766116108799-156791621.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 4px;\"></p><p><span style=\"white-space: pre-wrap;\">5. Cuối cùng, hãy thực hành chú tâm với chính mình</span></p><p><span style=\"white-space: pre-wrap;\">Điều nghịch lý của thời đại ngày nay, theo anh Nhân chia sẻ, là khi có&nbsp;me-time (thời gian cho bản thân), con người lại… trốn khỏi chính mình bằng điện thoại, mạng xã hội, video ngắn, nội dung giải trí. Không phải vì họ không muốn chú tâm về bên trong, mà vì họ sợ những gì sẽ hiện ra khi họ thật sự đối diện với chính mình: sự trống rỗng, nỗi buồn, chán nản, hoặc những ký ức từng bị kìm nén.</span></p><p><span style=\"white-space: pre-wrap;\">Chú tâm, theo Nhà giáo dục Lương Dũng Nhân, chỉ đơn giản là một sự cởi mở để đón nhận tất cả những diễn biến của thân - tâm và môi trường, nhưng không bám theo, không chống lại. Một hành trình chữa lành - yêu lành mở cửa và bắt đầu.</span></p><p><span style=\"white-space: pre-wrap;\">Mời các bạn xem lại tập 1&nbsp;Yêu Lành&nbsp;và các tập tiếp theo được phát sóng lúc 20h, tối Chủ nhật hàng tuần, từ ngày 14/12 trên Vietcetera Podcast, Youtube, Spotify và Apple Podcast.</span></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115899757-538881761.webp', NULL, NULL, 'Phản ứng nhạy cảm, dễ chạnh lòng, dễ tủi thân… đều là dư âm của tuổi thơ thiếu sự chú tâm ổn định và công bằng từ cha mẹ.', NULL, NULL, 6, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 10:44:44', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `bai_viet_dich_vu`
--

CREATE TABLE `bai_viet_dich_vu` (
  `id` bigint(20) NOT NULL,
  `id_dich_vu` bigint(20) DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `mo_ta_ngan` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `luot_xem` int(11) DEFAULT 0,
  `trang_thai` enum('nhap','xuat_ban') DEFAULT 'nhap',
  `ngay_dang` datetime DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `id_tac_gia` bigint(20) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bai_viet_dich_vu`
--

INSERT INTO `bai_viet_dich_vu` (`id`, `id_dich_vu`, `tieu_de`, `slug`, `noi_dung`, `anh_dai_dien`, `meta_title`, `meta_description`, `mo_ta_ngan`, `category`, `tags`, `luot_xem`, `trang_thai`, `ngay_dang`, `da_xoa`, `ngay_xoa`, `id_tac_gia`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 20, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày', 'hoat-dong-tinh-than-giao-luu-va-phuc-hoi-chuc-nang-hang-ngay', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 1, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:20:10', '2025-12-19 14:15:22'),
(3, 19, 'Chế độ dinh dưỡng khoa học, phù hợp từng thể trạng', 'che-do-dinh-duong-khoa-hoc-phu-hop-tung-the-trang', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 0, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:20:56', '2025-12-19 14:15:22'),
(4, 18, 'Chăm sóc sinh hoạt cá nhân và theo dõi sức khỏe 24/7', 'cham-soc-sinh-hoat-ca-nhan-va-theo-doi-suc-khoe-24-7', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 0, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:21:25', '2025-12-19 14:15:22'),
(5, 17, 'Lưu trú dài hạn với phòng ở an toàn, tiện nghi, sạch sẽ', 'luu-tru-dai-han-voi-phong-o-an-toan-tien-nghi-sach-se', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 0, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:22:19', '2025-12-19 14:15:22'),
(6, 16, 'Báo cáo tình trạng sức khỏe và sinh hoạt cho gia đình', 'bao-cao-tinh-trang-suc-khoe-va-sinh-hoat-cho-gia-dinh', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 0, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:22:39', '2025-12-19 14:15:22'),
(7, 15, 'Tổ chức các hoạt động sinh hoạt, giao lưu và giải trí nhẹ nhàng', 'to-chuc-cac-hoat-dong-sinh-hoat-giao-luu-va-giai-tri-nhe-nhang', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 0, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:23:00', '2025-12-19 14:15:22'),
(8, 14, 'Theo dõi sức khỏe, hỗ trợ ăn uống và nghỉ ngơi', 'theo-doi-suc-khoe-ho-tro-an-uong-va-nghi-ngoi', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 0, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:23:23', '2025-12-19 14:15:22'),
(9, 13, 'Đón – trả người cao tuổi theo khung giờ linh hoạt trong ngày', 'don-tra-nguoi-cao-tuoi-theo-khung-gio-linh-hoat-trong-ngay', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 0, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:23:51', '2025-12-19 14:15:22'),
(10, 12, 'Hướng dẫn vận động nhẹ giúp duy trì sức khỏe lâu dài', 'huong-dan-van-dong-nhe-giup-duy-tri-suc-khoe-lau-dai', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 3, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:25:26', '2025-12-19 14:15:22'),
(11, 11, 'Giảm đau xương khớp bằng các bài tập và liệu pháp hỗ trợ', 'giam-dau-xuong-khop-bang-cac-bai-tap-va-lieu-phap-ho-tro', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 2, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:25:50', '2025-12-19 14:15:22'),
(12, 5, 'Thăm khám sức khỏe định kỳ, theo dõi các chỉ số sinh tồn hằng ngày', 'tham-kham-suc-khoe-dinh-ky-theo-doi-cac-chi-so-sinh-ton-hang-ngay', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 2, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:37:55', '2025-12-19 14:15:22'),
(13, 9, 'Đánh giá thể trạng và xây dựng phác đồ trị liệu cá nhân', 'danh-gia-the-trang-va-xay-dung-phac-do-tri-lieu-ca-nhan', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 1, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:38:35', '2025-12-19 14:15:22'),
(14, 7, 'Theo dõi bệnh nền, xử lý kịp thời các tình huống y tế phát sinh', 'theo-doi-benh-nen-xu-ly-kip-thoi-cac-tinh-huong-y-te-phat-sinh', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 3, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:39:12', '2025-12-19 14:15:22'),
(15, 8, 'Tư vấn chăm sóc sức khỏe và phòng ngừa bệnh tật cho người cao tuổi', 'tu-van-cham-soc-suc-khoe-va-phong-ngua-benh-tat-cho-nguoi-cao-tuoi', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 11, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:47:37', '2025-12-19 14:15:22'),
(16, 10, 'Tập phục hồi chức năng vận động, đi lại và thăng bằng', 'tap-phuc-hoi-chuc-nang-van-dong-di-lai-va-thang-bang', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 3, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:48:47', '2025-12-19 14:15:22'),
(17, 6, 'Quản lý và hỗ trợ sử dụng thuốc theo chỉ định của bác sĩ', 'quan-ly-va-ho-tro-su-dung-thuoc-theo-chi-dinh-cua-bac-si', '<p><span style=\"white-space: pre-wrap;\">Tại viện dưỡng lão, các hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày được tổ chức như một phần không thể thiếu trong chương trình chăm sóc toàn diện cho người cao tuổi. Những hoạt động này không chỉ giúp duy trì sức khỏe thể chất mà còn mang lại sự vui vẻ, lạc quan và cảm giác được quan tâm, sẻ chia trong môi trường sinh hoạt chung.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Người cao tuổi được tham gia các buổi sinh hoạt tập thể như trò chuyện, đọc sách, nghe nhạc, xem phim, chơi các trò chơi trí tuệ nhẹ nhàng hoặc tham gia các hoạt động văn hóa phù hợp với sở thích cá nhân. Thông qua việc giao lưu, kết nối với những người cùng độ tuổi, các cụ giảm cảm giác cô đơn, tăng sự gắn kết và cải thiện sức khỏe tinh thần một cách tự nhiên.</span><br><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Song song với đó, các chương trình phục hồi chức năng được thiết kế khoa học, bao gồm các bài tập vận động nhẹ, kéo giãn cơ, luyện tập thăng bằng và hít thở, giúp cải thiện khả năng vận động, giảm đau nhức xương khớp và duy trì sự linh hoạt của cơ thể. Các hoạt động được hướng dẫn và theo dõi bởi đội ngũ chuyên môn, đảm bảo an toàn và phù hợp với từng thể trạng.</span></p><p><span style=\"white-space: pre-wrap;\">Sự kết hợp hài hòa giữa chăm sóc tinh thần và phục hồi chức năng không chỉ giúp người cao tuổi khỏe mạnh hơn mỗi ngày mà còn mang đến niềm vui sống, sự tự tin và cảm giác an yên trong những năm tháng tuổi già.</span></p>', NULL, NULL, NULL, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày giúp người cao tuổi duy trì trạng thái tinh thần tích cực, tăng cường sự linh hoạt của cơ thể và nâng cao chất lượng cuộc sống thông qua các hoạt động nhẹ nhàng, phù hợp với thể trạng.', NULL, NULL, 3, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:49:13', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `bai_viet_phong`
--

CREATE TABLE `bai_viet_phong` (
  `id` bigint(20) NOT NULL,
  `id_loai_phong` bigint(20) DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `noi_dung` longtext DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `mo_ta_ngan` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `luot_xem` int(11) DEFAULT 0,
  `trang_thai` enum('nhap','xuat_ban') DEFAULT 'nhap',
  `ngay_dang` datetime DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `id_tac_gia` bigint(20) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bai_viet_phong`
--

INSERT INTO `bai_viet_phong` (`id`, `id_loai_phong`, `tieu_de`, `slug`, `noi_dung`, `anh_dai_dien`, `meta_title`, `meta_description`, `mo_ta_ngan`, `category`, `tags`, `luot_xem`, `trang_thai`, `ngay_dang`, `da_xoa`, `ngay_xoa`, `id_tac_gia`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 1, 'PHÒNG NỘI TRÚ', 'phong-noi-tru', '<p><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Viện Dưỡng Lão Xuân Hoa – Phòng Nội Trú An Tâm Như Ở Nhà</strong></b></p><p><span style=\"white-space: pre-wrap;\">Phòng nội trú tại Viện Dưỡng Lão Xuân Hoa được xây dựng với mục tiêu mang đến cho người cao tuổi một không gian sống an toàn, ấm áp và đầy sự quan tâm. Từng chi tiết trong phòng đều được thiết kế phù hợp với thể trạng và nhu cầu sinh hoạt của người lớn tuổi, giúp các cụ cảm nhận được sự thoải mái và yên tâm trong suốt thời gian lưu trú.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109399097-546418753.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Hệ thống phòng ở luôn đảm bảo thông thoáng, sạch sẽ, đầy đủ ánh sáng tự nhiên, trang bị giường chuyên dụng, tủ cá nhân, nhà vệ sinh khép kín và hệ thống gọi hỗ trợ khẩn cấp 24/7. Không gian được bố trí gọn gàng, hạn chế vật cản, giảm nguy cơ té ngã và tạo điều kiện thuận lợi cho việc di chuyển.</span></p><p><span style=\"white-space: pre-wrap;\">Bên cạnh cơ sở vật chất, Phòng nội trú Viện Dưỡng Lão Xuân Hoa còn chú trọng đến công tác chăm sóc sức khỏe toàn diện. Đội ngũ điều dưỡng, y bác sĩ theo dõi tình trạng sức khỏe hằng ngày, hỗ trợ dùng thuốc, dinh dưỡng và chăm sóc cá nhân. Các bữa ăn được xây dựng khoa học, phù hợp với từng thể trạng, đảm bảo đủ chất và dễ tiêu hóa.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109418921-704869750.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Ngoài thời gian nghỉ ngơi, người cao tuổi tại phòng nội trú còn được tham gia các hoạt động sinh hoạt, giao lưu nhẹ nhàng và phục hồi chức năng, giúp tinh thần luôn vui vẻ, lạc quan. Môi trường sống thân thiện, giàu tình cảm tại Xuân Hoa không chỉ là nơi chăm sóc sức khỏe mà còn là mái nhà thứ hai, nơi người cao tuổi được yêu thương, tôn trọng và sống những năm tháng tuổi già một cách an nhiên.</span></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109580687-795215363.jpg', NULL, NULL, 'Giới thiệu về phòng nội trú của viện dưỡng lão Xuân Hoa', NULL, NULL, 4, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:00:06', '2025-12-19 14:15:22'),
(3, 2, 'PHÒNG BÁN NỘI TRÚ', 'phong-ban-noi-tru', '<p><b><strong class=\"font-bold\" style=\"white-space: pre-wrap;\">Viện Dưỡng Lão Xuân Hoa – Phòng Nội Trú An Tâm Như Ở Nhà</strong></b></p><p><span style=\"white-space: pre-wrap;\">Phòng nội trú tại Viện Dưỡng Lão Xuân Hoa được xây dựng với mục tiêu mang đến cho người cao tuổi một không gian sống an toàn, ấm áp và đầy sự quan tâm. Từng chi tiết trong phòng đều được thiết kế phù hợp với thể trạng và nhu cầu sinh hoạt của người lớn tuổi, giúp các cụ cảm nhận được sự thoải mái và yên tâm trong suốt thời gian lưu trú.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109399097-546418753.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Hệ thống phòng ở luôn đảm bảo thông thoáng, sạch sẽ, đầy đủ ánh sáng tự nhiên, trang bị giường chuyên dụng, tủ cá nhân, nhà vệ sinh khép kín và hệ thống gọi hỗ trợ khẩn cấp 24/7. Không gian được bố trí gọn gàng, hạn chế vật cản, giảm nguy cơ té ngã và tạo điều kiện thuận lợi cho việc di chuyển.</span></p><p><span style=\"white-space: pre-wrap;\">Bên cạnh cơ sở vật chất, Phòng nội trú Viện Dưỡng Lão Xuân Hoa còn chú trọng đến công tác chăm sóc sức khỏe toàn diện. Đội ngũ điều dưỡng, y bác sĩ theo dõi tình trạng sức khỏe hằng ngày, hỗ trợ dùng thuốc, dinh dưỡng và chăm sóc cá nhân. Các bữa ăn được xây dựng khoa học, phù hợp với từng thể trạng, đảm bảo đủ chất và dễ tiêu hóa.</span></p><p><span style=\"display: block; margin: 10px 0px;\"><img src=\"https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109418921-704869750.jpg\" alt=\"image\" style=\"max-width: 100%; height: auto; display: block; margin: 0px auto; border-radius: 4px;\"></span></p><p><span style=\"white-space: pre-wrap;\">Ngoài thời gian nghỉ ngơi, người cao tuổi tại phòng nội trú còn được tham gia các hoạt động sinh hoạt, giao lưu nhẹ nhàng và phục hồi chức năng, giúp tinh thần luôn vui vẻ, lạc quan. Môi trường sống thân thiện, giàu tình cảm tại Xuân Hoa không chỉ là nơi chăm sóc sức khỏe mà còn là mái nhà thứ hai, nơi người cao tuổi được yêu thương, tôn trọng và sống những năm tháng tuổi già một cách an nhiên.</span></p>', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109652046-536980386.jpg', NULL, NULL, 'Giới thiệu về phòng bán nội trú của viện dưỡng lão Xuân Hoa', NULL, NULL, 10, 'xuat_ban', NULL, 0, NULL, 1, '2025-12-19 09:00:53', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `bang_gia_dich_vu`
--

CREATE TABLE `bang_gia_dich_vu` (
  `id` bigint(20) NOT NULL,
  `id_dich_vu` bigint(20) DEFAULT NULL,
  `gia_thang` int(11) DEFAULT NULL,
  `gia_quy` int(11) DEFAULT NULL,
  `gia_nam` int(11) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bang_gia_dich_vu`
--

INSERT INTO `bang_gia_dich_vu` (`id`, `id_dich_vu`, `gia_thang`, `gia_quy`, `gia_nam`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(6, 20, 1000000, 3000000, 10000000, '2025-12-19 09:58:34', '2025-12-19 09:58:34'),
(7, 19, 1000000, 3000000, 10000000, '2025-12-19 09:58:56', '2025-12-19 09:58:56'),
(8, 18, 1000000, 3000000, 10000000, '2025-12-19 09:59:10', '2025-12-19 09:59:10'),
(9, 17, 1000000, 3000000, 10000000, '2025-12-19 09:59:27', '2025-12-19 09:59:27'),
(10, 16, 1000000, 3000000, 10000000, '2025-12-19 09:59:42', '2025-12-19 09:59:42'),
(11, 15, 1000000, 3000000, 10000000, '2025-12-19 10:00:00', '2025-12-19 10:00:00'),
(12, 14, 1000000, 3000000, 10000000, '2025-12-19 10:00:18', '2025-12-19 10:00:18'),
(13, 13, 1000000, 3000000, 10000000, '2025-12-19 10:00:32', '2025-12-19 10:00:32'),
(14, 12, 1000000, 3000000, 10000000, '2025-12-19 10:00:48', '2025-12-19 10:00:48'),
(15, 11, 1000000, 3000000, 10000000, '2025-12-19 10:01:11', '2025-12-19 10:01:11'),
(16, 10, 1000000, 3000000, 10000000, '2025-12-19 10:01:28', '2025-12-19 10:01:28'),
(17, 9, 1000000, 3000000, 10000000, '2025-12-19 10:01:40', '2025-12-19 10:01:40'),
(18, 8, 1000000, 3000000, 10000000, '2025-12-19 10:01:53', '2025-12-19 10:01:53'),
(19, 7, 1000000, 3000000, 10000000, '2025-12-19 10:02:07', '2025-12-19 10:02:07'),
(20, 6, 1000000, 3000000, 10000000, '2025-12-19 10:02:23', '2025-12-19 10:02:23'),
(21, 5, 1000000, 3000000, 10000000, '2025-12-19 10:02:42', '2025-12-19 10:02:42');

-- --------------------------------------------------------

--
-- Table structure for table `benh_hien_tai`
--

CREATE TABLE `benh_hien_tai` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_thong_tin_benh` bigint(20) DEFAULT NULL,
  `ngay_phat_hien` date DEFAULT NULL,
  `tinh_trang` enum('dang_dieu_tri','on_dinh','khoi','tai_phat') DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `benh_nhan`
--

CREATE TABLE `benh_nhan` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('nam','nu','khac') DEFAULT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `nhom_mau` varchar(10) DEFAULT NULL,
  `bhyt` varchar(50) DEFAULT NULL,
  `phong` varchar(50) DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `ngay_nhap_vien` date DEFAULT NULL,
  `tinh_trang_hien_tai` text DEFAULT NULL,
  `kha_nang_sinh_hoat` enum('doc_lap','ho_tro','phu_thuoc') DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `benh_nhan`
--

INSERT INTO `benh_nhan` (`id`, `ho_ten`, `ngay_sinh`, `gioi_tinh`, `cccd`, `dia_chi`, `nhom_mau`, `bhyt`, `phong`, `anh_dai_dien`, `ngay_nhap_vien`, `tinh_trang_hien_tai`, `kha_nang_sinh_hoat`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(16, 'Ngãnh Thị Lan Uyên', '2002-05-30', 'khac', '034202005336', 'Vương Quốc Hoa Thánh', 'B', '012212121212212', NULL, NULL, '2025-12-16', 'Đang điều trị', 'doc_lap', 1, '2025-12-18 15:37:50', '2025-12-16 14:41:47', '2025-12-18 15:37:50'),
(17, 'Hiếu Người Hoa Thánh', '2005-10-15', 'nu', '0363363636', 'Vương Quốc Hoa Thánh', 'B', '363636363', NULL, NULL, '2025-12-16', 'Đang điều trị', 'doc_lap', 1, '2025-12-18 15:37:47', '2025-12-16 14:46:04', '2025-12-18 15:37:47');

-- --------------------------------------------------------

--
-- Table structure for table `benh_nhan_dich_vu`
--

CREATE TABLE `benh_nhan_dich_vu` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) NOT NULL,
  `id_dich_vu` bigint(20) NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `hinh_thuc_thanh_toan` enum('thang','quy','nam') DEFAULT 'thang',
  `thanh_tien` int(11) DEFAULT 0,
  `da_thanh_toan` int(11) DEFAULT 0,
  `cong_no_con_lai` int(11) DEFAULT 0,
  `ngay_thanh_toan_lan_cuoi` date DEFAULT NULL,
  `trang_thai` enum('dang_su_dung','tam_dung','ket_thuc') DEFAULT 'dang_su_dung',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `binh_luan_bai_viet`
--

CREATE TABLE `binh_luan_bai_viet` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `ngay_binh_luan` datetime DEFAULT current_timestamp(),
  `duyet` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `binh_luan_bai_viet_dich_vu`
--

CREATE TABLE `binh_luan_bai_viet_dich_vu` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `ngay_binh_luan` datetime DEFAULT current_timestamp(),
  `duyet` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `binh_luan_bai_viet_phong`
--

CREATE TABLE `binh_luan_bai_viet_phong` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `noi_dung` text NOT NULL,
  `ngay_binh_luan` datetime DEFAULT current_timestamp(),
  `duyet` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cau_hinh_chi_so_canh_bao`
--

CREATE TABLE `cau_hinh_chi_so_canh_bao` (
  `id` bigint(20) NOT NULL,
  `ten_chi_so` varchar(255) NOT NULL,
  `gioi_han_canh_bao` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cau_hinh_chi_so_canh_bao`
--

INSERT INTO `cau_hinh_chi_so_canh_bao` (`id`, `ten_chi_so`, `gioi_han_canh_bao`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'SpO2', '{\"binh_thuong\":{\"min\":12,\"max\":20},\"thap\":{\"max\":21},\"cao\":{\"min\":22},\"bat_on\":{\"min\":23,\"max\":25},\"nguy_hiem\":{\"min\":26,\"max\":30}}', '2025-12-17 10:25:34', '2025-12-17 10:25:34');

-- --------------------------------------------------------

--
-- Table structure for table `cong_viec`
--

CREATE TABLE `cong_viec` (
  `id` bigint(20) NOT NULL,
  `ten_cong_viec` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `muc_uu_tien` enum('thap','trung_binh','cao') DEFAULT NULL,
  `thoi_gian_du_kien` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `id_nguoi_tao` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `danh_sach_trieu_chung`
--

CREATE TABLE `danh_sach_trieu_chung` (
  `id` bigint(20) NOT NULL,
  `ten_trieu_chung` varchar(255) NOT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dich_vu`
--

CREATE TABLE `dich_vu` (
  `id` bigint(20) NOT NULL,
  `id_loai_dich_vu` bigint(20) DEFAULT NULL,
  `ten_dich_vu` varchar(255) DEFAULT NULL,
  `mo_ta_ngan` text DEFAULT NULL,
  `mo_ta_day_du` text DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dich_vu`
--

INSERT INTO `dich_vu` (`id`, `id_loai_dich_vu`, `ten_dich_vu`, `mo_ta_ngan`, `mo_ta_day_du`, `anh_dai_dien`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(5, 4, 'Thăm khám sức khỏe định kỳ, theo dõi các chỉ số sinh tồn hằng ngày', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:11:05', '2025-12-19 09:11:05'),
(6, 4, 'Quản lý và hỗ trợ sử dụng thuốc theo chỉ định của bác sĩ', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:11:11', '2025-12-19 09:11:11'),
(7, 4, 'Theo dõi bệnh nền, xử lý kịp thời các tình huống y tế phát sinh', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:11:18', '2025-12-19 09:11:18'),
(8, 4, 'Tư vấn chăm sóc sức khỏe và phòng ngừa bệnh tật cho người cao tuổi', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:11:25', '2025-12-19 09:11:25'),
(9, 3, 'Đánh giá thể trạng và xây dựng phác đồ trị liệu cá nhân', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:11:37', '2025-12-19 09:11:37'),
(10, 3, 'Tập phục hồi chức năng vận động, đi lại và thăng bằng', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:11:45', '2025-12-19 09:11:45'),
(11, 3, 'Giảm đau xương khớp bằng các bài tập và liệu pháp hỗ trợ', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:11:53', '2025-12-19 09:11:53'),
(12, 3, 'Hướng dẫn vận động nhẹ giúp duy trì sức khỏe lâu dài', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:12:06', '2025-12-19 09:12:06'),
(13, 2, 'Đón – trả người cao tuổi theo khung giờ linh hoạt trong ngày', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:12:14', '2025-12-19 09:12:14'),
(14, 2, 'Theo dõi sức khỏe, hỗ trợ ăn uống và nghỉ ngơi', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:12:26', '2025-12-19 09:12:26'),
(15, 2, 'Tổ chức các hoạt động sinh hoạt, giao lưu và giải trí nhẹ nhàng', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:12:34', '2025-12-19 09:12:34'),
(16, 2, 'Báo cáo tình trạng sức khỏe và sinh hoạt cho gia đình', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:12:43', '2025-12-19 09:12:43'),
(17, 1, 'Lưu trú dài hạn với phòng ở an toàn, tiện nghi, sạch sẽ', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:12:51', '2025-12-19 09:21:54'),
(18, 1, 'Chăm sóc sinh hoạt cá nhân và theo dõi sức khỏe 24/7', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:13:04', '2025-12-19 09:13:04'),
(19, 1, 'Chế độ dinh dưỡng khoa học, phù hợp từng thể trạng', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:13:12', '2025-12-19 09:13:12'),
(20, 1, 'Hoạt động tinh thần, giao lưu và phục hồi chức năng hằng ngày', NULL, NULL, NULL, 0, NULL, '2025-12-19 09:13:20', '2025-12-19 09:13:20');

-- --------------------------------------------------------

--
-- Table structure for table `diem_rui_ro_ai`
--

CREATE TABLE `diem_rui_ro_ai` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `loai_rui_ro` enum('nga','dot_quy','suy_tim','nhiem_trung') DEFAULT NULL,
  `diem` int(11) DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dieu_duong_benh_nhan`
--

CREATE TABLE `dieu_duong_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_dieu_duong` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `trang_thai` enum('dang_quan_ly','ket_thuc') DEFAULT 'dang_quan_ly',
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `don_thuoc`
--

CREATE TABLE `don_thuoc` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_ke` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `do_dung_ca_nhan`
--

CREATE TABLE `do_dung_ca_nhan` (
  `id` bigint(20) NOT NULL,
  `id_phan_loai` bigint(20) DEFAULT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `ten_vat_dung` varchar(255) NOT NULL,
  `so_luong` int(11) DEFAULT 1,
  `tinh_trang` enum('tot','hu_hong','mat') DEFAULT 'tot',
  `media` text DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_them` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `duong_huyet`
--

CREATE TABLE `duong_huyet` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `gia_tri_duong_huyet` decimal(5,2) DEFAULT NULL COMMENT 'Giá trị đường huyết (mmol/L)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo đường huyết',
  `thoi_diem_do` enum('sang','trua','toi','truoc_an','sau_an','truoc_ngu','khac') DEFAULT NULL COMMENT 'Thời điểm đo đường huyết',
  `vi_tri_lay_mau` enum('ngon_tay','canh_tay','dui') DEFAULT NULL COMMENT 'Vị trí lấy mẫu',
  `trieu_chung_kem_theo` text DEFAULT NULL COMMENT 'Triệu chứng kèm theo (nếu có)',
  `ghi_chu` text DEFAULT NULL,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text DEFAULT NULL COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text DEFAULT NULL COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hoat_dong_sinh_hoat`
--

CREATE TABLE `hoat_dong_sinh_hoat` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `gio_di_ngu` time DEFAULT NULL,
  `gio_thuc_day` time DEFAULT NULL,
  `so_lan_thuc_giac` int(11) DEFAULT NULL,
  `chat_luong_giac_ngu` enum('tot','trung_binh','kem') DEFAULT NULL,
  `tam` tinyint(1) DEFAULT NULL,
  `danh_rang` tinyint(1) DEFAULT NULL,
  `thay_quan_ao` tinyint(1) DEFAULT NULL,
  `dai_tien_so_lan` int(11) DEFAULT NULL,
  `dai_tien_tinh_chat` enum('binh_thuong','tao_bon','tieu_chay') DEFAULT NULL,
  `tieu_tien_so_lan` int(11) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ho_so_nhan_vien`
--

CREATE TABLE `ho_so_nhan_vien` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `chuc_vu` varchar(100) DEFAULT NULL,
  `bang_cap` text DEFAULT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `luong_co_ban` int(11) DEFAULT NULL,
  `gioi_thieu` text DEFAULT NULL,
  `chuyen_mon` text DEFAULT NULL,
  `so_nam_kinh_nghiem` int(11) DEFAULT NULL,
  `danh_gia` text DEFAULT NULL,
  `so_benh_nhan_da_dieu_tri` int(11) DEFAULT 0,
  `noi_cong_tac` varchar(255) DEFAULT NULL,
  `lich_lam_viec` text DEFAULT NULL,
  `cccd` varchar(20) DEFAULT NULL,
  `so_bhyt` varchar(50) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ho_so_nhan_vien`
--

INSERT INTO `ho_so_nhan_vien` (`id`, `id_tai_khoan`, `chuc_vu`, `bang_cap`, `ngay_bat_dau`, `luong_co_ban`, `gioi_thieu`, `chuyen_mon`, `so_nam_kinh_nghiem`, `danh_gia`, `so_benh_nhan_da_dieu_tri`, `noi_cong_tac`, `lich_lam_viec`, `cccd`, `so_bhyt`, `dia_chi`, `ngay_tao`, `ngay_cap_nhat`, `avatar`) VALUES
(4, 1, 'Điều dưỡng', NULL, '2025-12-18', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2025-12-18 15:14:39', '2025-12-18 15:14:39', NULL),
(5, 7, 'Điều dưỡng', NULL, '2025-12-18', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2025-12-18 15:31:03', '2025-12-18 15:31:03', NULL),
(6, 8, 'Điều dưỡng', NULL, '2025-12-18', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, '2025-12-18 15:36:00', '2025-12-18 15:36:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ho_so_ung_tuyen`
--

CREATE TABLE `ho_so_ung_tuyen` (
  `id` bigint(20) NOT NULL,
  `id_tin_tuyen_dung` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `file_cv` text DEFAULT NULL,
  `trang_thai` enum('moi_nop','da_xem','phong_van','trung_tuyen','tu_choi') DEFAULT 'moi_nop',
  `ngay_nop` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `diem_ai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ho_so_ung_tuyen`
--

INSERT INTO `ho_so_ung_tuyen` (`id`, `id_tin_tuyen_dung`, `ho_ten`, `email`, `so_dien_thoai`, `file_cv`, `trang_thai`, `ngay_nop`, `ngay_tao`, `ngay_cap_nhat`, `diem_ai`) VALUES
(1, 2, 'Vũ Tuấn Kiệt', 'kietvu389@gmail.com', '038362718', 'http://localhost:4545/uploads/file_cv-1766045334949-846554860.pdf', 'trung_tuyen', '2025-12-18 15:08:54', '2025-12-18 15:08:54', '2025-12-18 15:14:39', NULL),
(2, 2, 'Kiệt Tuấn Vũ', 'a1@gmail.com', '0365157215', 'http://localhost:4545/uploads/file_cv-1766046644088-119762549.pdf', 'trung_tuyen', '2025-12-18 15:30:44', '2025-12-18 15:30:44', '2025-12-18 15:31:03', NULL),
(3, 2, 'aaa', 'kietvu3893@gmail.com', '12121212', 'http://localhost:4545/uploads/file_cv-1766046953372-223277917.pdf', 'trung_tuyen', '2025-12-18 15:35:53', '2025-12-18 15:35:53', '2025-12-18 15:36:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ho_so_y_te_benh_nhan`
--

CREATE TABLE `ho_so_y_te_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_loai_benh_ly` bigint(20) DEFAULT NULL,
  `tien_su_benh` text DEFAULT NULL,
  `di_ung_thuoc` text DEFAULT NULL,
  `lich_su_phau_thuat` text DEFAULT NULL,
  `benh_ly_hien_tai` text DEFAULT NULL,
  `ghi_chu_dac_biet` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CCCD` varchar(225) DEFAULT NULL,
  `MST` varchar(225) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `huyet_ap`
--

CREATE TABLE `huyet_ap` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `tam_thu` int(11) DEFAULT NULL COMMENT 'Huyết áp tâm thu (mmHg)',
  `tam_truong` int(11) DEFAULT NULL COMMENT 'Huyết áp tâm trương (mmHg)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo huyết áp',
  `vi_tri_do` enum('tay_trai','tay_phai','dau_goi','co_chan') DEFAULT NULL COMMENT 'Vị trí đo',
  `tu_the_khi_do` enum('nam','ngoi','dung') DEFAULT NULL COMMENT 'Tư thế khi đo',
  `ghi_chu` text DEFAULT NULL,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text DEFAULT NULL COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text DEFAULT NULL COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `huyet_ap`
--

INSERT INTO `huyet_ap` (`id`, `id_benh_nhan`, `tam_thu`, `tam_truong`, `thoi_gian_do`, `vi_tri_do`, `tu_the_khi_do`, `ghi_chu`, `muc_do`, `noi_dung_canh_bao`, `id_cau_hinh_chi_so_canh_bao`, `danh_gia_chi_tiet`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 16, 21, 21, '2025-12-16 07:46:00', 'tay_phai', 'nam', '', 'binh_thuong', '', NULL, NULL, '2025-12-16 14:46:49', '2025-12-16 14:46:49'),
(3, 17, 140, 140, '2025-12-16 21:17:00', 'tay_trai', 'ngoi', NULL, 'binh_thuong', NULL, NULL, NULL, '2025-12-17 11:17:08', '2025-12-17 11:17:24'),
(4, 17, 140, 140, '2025-12-17 04:17:00', 'tay_trai', 'nam', NULL, 'binh_thuong', NULL, NULL, NULL, '2025-12-17 11:17:51', '2025-12-17 11:17:51');

-- --------------------------------------------------------

--
-- Table structure for table `kpi_nhan_vien`
--

CREATE TABLE `kpi_nhan_vien` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `thang` int(11) NOT NULL,
  `nam` int(11) NOT NULL,
  `ty_le_hoan_thanh_cong_viec` float DEFAULT NULL,
  `so_loi_ghi_chep` int(11) DEFAULT 0,
  `so_lan_tre_ca` int(11) DEFAULT 0,
  `diem_danh_gia_quan_ly` float DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_hen_tu_van`
--

CREATE TABLE `lich_hen_tu_van` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `loai_dich_vu_quan_tam` varchar(255) DEFAULT NULL,
  `ngay_mong_muon` date NOT NULL,
  `gio_mong_muon` time NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` enum('cho_xac_nhan','da_xac_nhan','da_den','huy') DEFAULT 'cho_xac_nhan',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `nguoi_xac_nhan` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lich_hen_tu_van`
--

INSERT INTO `lich_hen_tu_van` (`id`, `ho_ten`, `so_dien_thoai`, `email`, `loai_dich_vu_quan_tam`, `ngay_mong_muon`, `gio_mong_muon`, `ghi_chu`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `nguoi_xac_nhan`) VALUES
(1, 'Vũ Tuấn Kiệt', '0365157215', 'kietvu389@gmail.com', 'Tư vấn chăm sóc sức khỏe và phòng ngừa bệnh tật cho người cao tuổi', '2025-12-20', '09:00:00', '', 'cho_xac_nhan', '2025-12-19 11:10:44', '2025-12-19 11:10:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lich_kham`
--

CREATE TABLE `lich_kham` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `loai_kham` enum('tong_quat','chuyen_khoa','xet_nghiem','phuc_hoi') DEFAULT NULL,
  `bac_si` varchar(255) DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ket_qua` text DEFAULT NULL,
  `trang_thai` enum('cho_kham','dang_kham','da_kham') DEFAULT 'cho_kham',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_phan_ca`
--

CREATE TABLE `lich_phan_ca` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `ca` enum('sang','chieu','dem') DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `trang_thai` enum('du_kien','dang_truc','hoan_thanh','vang') DEFAULT 'du_kien',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_phong_van`
--

CREATE TABLE `lich_phong_van` (
  `id` bigint(20) NOT NULL,
  `id_ho_so` bigint(20) DEFAULT NULL,
  `ngay_gio` datetime NOT NULL,
  `dia_diem` varchar(255) DEFAULT NULL,
  `nguoi_phong_van` text DEFAULT NULL,
  `ket_qua` text DEFAULT NULL,
  `trang_thai` enum('chua_phong_van','da_phong_van') DEFAULT 'chua_phong_van',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_tham_benh`
--

CREATE TABLE `lich_tham_benh` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_nguoi_than` bigint(20) DEFAULT NULL,
  `ngay` date DEFAULT NULL,
  `khung_gio` enum('8_10','14_16','18_20') DEFAULT NULL,
  `loai` enum('gap_mat','goi_dien') DEFAULT 'gap_mat',
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `so_nguoi_di_cung` int(11) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` enum('cho_duyet','da_duyet','tu_choi') DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lien_he`
--

CREATE TABLE `lien_he` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `chu_de` varchar(255) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `ngay_gui` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loai_benh_ly`
--

CREATE TABLE `loai_benh_ly` (
  `id` bigint(20) NOT NULL,
  `ten_loai_benh_ly` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loai_dich_vu`
--

CREATE TABLE `loai_dich_vu` (
  `id` bigint(20) NOT NULL,
  `ten` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loai_dich_vu`
--

INSERT INTO `loai_dich_vu` (`id`, `ten`, `mo_ta`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Chăm sóc nội trú', 'Dịch vụ chăm sóc nội trú mang đến không gian sống ổn định và an toàn cho người cao tuổi với sự hỗ trợ 24/7 từ đội ngũ nhân viên chuyên nghiệp. Người cao tuổi được chăm sóc toàn diện từ sinh hoạt cá nhân, ăn uống, nghỉ ngơi đến theo dõi và quản lý sức khỏe lâu dài. Không chỉ đáp ứng nhu cầu thể chất, chăm sóc nội trú còn chú trọng đời sống tinh thần thông qua các hoạt động giao lưu, sinh hoạt chung, tạo cảm giác ấm cúng, gần gũi và giúp người cao tuổi an tâm tận hưởng cuộc sống tuổi già.', '2025-12-19 09:07:53', '2025-12-19 09:10:09'),
(2, 'Chăm sóc ban ngày', 'Chăm sóc ban ngày là dịch vụ phù hợp với những gia đình mong muốn người cao tuổi được chăm sóc chuyên nghiệp trong giờ hành chính nhưng vẫn sinh hoạt tại nhà vào buổi tối. Trong thời gian ban ngày, người cao tuổi được theo dõi sức khỏe, hỗ trợ ăn uống, nghỉ ngơi và tham gia các hoạt động sinh hoạt chung, giao lưu tinh thần hoặc rèn luyện nhẹ nhàng. Môi trường thân thiện, an toàn giúp các cụ luôn vui vẻ, giảm cảm giác cô đơn, đồng thời gia đình có thể yên tâm công tác và sinh hoạt.', '2025-12-19 09:08:04', '2025-12-19 09:09:43'),
(3, 'Vật lý trị liệu', 'Dịch vụ vật lý trị liệu được thiết kế phù hợp với từng tình trạng sức khỏe và khả năng vận động của người cao tuổi. Thông qua các bài tập phục hồi chức năng, xoa bóp, vận động trị liệu và các phương pháp hỗ trợ khác, dịch vụ giúp cải thiện khả năng đi lại, giảm đau nhức xương khớp và tăng cường sự linh hoạt của cơ thể. Quá trình trị liệu được theo dõi sát sao bởi đội ngũ chuyên môn, góp phần nâng cao thể lực, hạn chế biến chứng và giúp người cao tuổi tự tin hơn trong sinh hoạt hằng ngày.', '2025-12-19 09:08:12', '2025-12-19 09:09:33'),
(4, 'Chăm sóc y tế', 'Dịch vụ chăm sóc y tế tại viện dưỡng lão được xây dựng nhằm đảm bảo sức khỏe toàn diện cho người cao tuổi trong suốt quá trình sinh hoạt và nghỉ ngơi. Người cao tuổi được thăm khám định kỳ, theo dõi các chỉ số sức khỏe, hỗ trợ dùng thuốc đúng giờ, đúng liều theo chỉ định của bác sĩ. Đội ngũ y bác sĩ và điều dưỡng luôn túc trực, sẵn sàng xử lý kịp thời các tình huống phát sinh, đồng thời tư vấn sức khỏe, phòng ngừa bệnh tật, giúp người cao tuổi an tâm và duy trì cuộc sống ổn định, chất lượng.', '2025-12-19 09:08:19', '2025-12-19 09:09:22');

-- --------------------------------------------------------

--
-- Table structure for table `loai_phong`
--

CREATE TABLE `loai_phong` (
  `id` bigint(20) NOT NULL,
  `ten` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `anh_mau` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loai_phong`
--

INSERT INTO `loai_phong` (`id`, `ten`, `mo_ta`, `anh_mau`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'PHÒNG NỘI TRÚ', 'Phòng nội trú của viện dưỡng lão được thiết kế ấm cúng, yên tĩnh và an toàn, mang lại cảm giác như ở nhà cho người cao tuổi. Không gian phòng thoáng đãng, đầy đủ ánh sáng tự nhiên, trang bị giường chuyên dụng, hệ thống gọi hỗ trợ khẩn cấp và các tiện nghi cần thiết cho sinh hoạt hằng ngày. Mỗi phòng đều được vệ sinh, chăm sóc định kỳ, đảm bảo sự thoải mái và riêng tư, giúp người cao tuổi an tâm nghỉ ngơi và phục hồi sức khỏe trong môi trường thân thiện, giàu sự quan tâm.', 'http://localhost:4545/uploads/file-1766050011068-207700875.jpg', '2025-12-18 15:58:37', '2025-12-19 08:47:28'),
(2, 'PHÒNG BÁN NỘI TRÚ', 'Phòng bán nội trú của viện dưỡng lão là không gian sinh hoạt ban ngày dành cho người cao tuổi, được bố trí tiện nghi, sạch sẽ và an toàn. Phòng được trang bị khu nghỉ ngơi, bàn ghế sinh hoạt chung, điều hòa, ánh sáng tự nhiên cùng các thiết bị hỗ trợ cần thiết. Tại đây, người cao tuổi được chăm sóc, theo dõi sức khỏe, tham gia các hoạt động giao lưu – phục hồi chức năng trong ngày và trở về nhà vào buổi tối, mang lại sự linh hoạt và cảm giác gần gũi cho gia đình.', 'http://localhost:4545/uploads/file-1766109027570-359368439.jpg', '2025-12-19 08:52:40', '2025-12-19 08:52:40');

-- --------------------------------------------------------

--
-- Table structure for table `media_bai_viet`
--

CREATE TABLE `media_bai_viet` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_bai_viet`
--

INSERT INTO `media_bai_viet` (`id`, `id_bai_viet`, `loai`, `url`, `mo_ta`, `thu_tu`, `ngay_upload`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(37, 14, 'anh', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', NULL, 0, '2025-12-19 10:18:24', '2025-12-19 10:18:24', '2025-12-19 10:18:24'),
(38, 14, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114261087-437707296.png', NULL, 1, '2025-12-19 10:18:24', '2025-12-19 10:18:24', '2025-12-19 14:15:22'),
(39, 14, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114293917-25249393.png', NULL, 2, '2025-12-19 10:18:24', '2025-12-19 10:18:24', '2025-12-19 14:15:22'),
(41, 15, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114361593-329045126.webp', 'Ảnh đại diện', 0, '2025-12-19 10:20:16', '2025-12-19 10:20:16', '2025-12-19 14:15:22'),
(42, 15, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114372322-47225904.png', NULL, 1, '2025-12-19 10:20:16', '2025-12-19 10:20:16', '2025-12-19 14:15:22'),
(43, 15, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114386256-632132170.png', NULL, 2, '2025-12-19 10:20:16', '2025-12-19 10:20:16', '2025-12-19 14:15:22'),
(44, 15, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114390947-316807865.png', NULL, 3, '2025-12-19 10:20:16', '2025-12-19 10:20:16', '2025-12-19 14:15:22'),
(45, 15, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114399543-528186020.png', NULL, 4, '2025-12-19 10:20:16', '2025-12-19 10:20:16', '2025-12-19 14:15:22'),
(46, 16, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114441834-482406935.webp', 'Ảnh đại diện', 0, '2025-12-19 10:21:48', '2025-12-19 10:21:48', '2025-12-19 14:15:22'),
(47, 16, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114459212-426524468.png', NULL, 1, '2025-12-19 10:21:48', '2025-12-19 10:21:48', '2025-12-19 14:15:22'),
(48, 16, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114466980-585709395.png', NULL, 2, '2025-12-19 10:21:48', '2025-12-19 10:21:48', '2025-12-19 14:15:22'),
(49, 16, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114498346-428073357.png', NULL, 3, '2025-12-19 10:21:48', '2025-12-19 10:21:48', '2025-12-19 14:15:22'),
(50, 17, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114531578-680740635.webp', 'Ảnh đại diện', 0, '2025-12-19 10:23:49', '2025-12-19 10:23:49', '2025-12-19 14:15:22'),
(51, 17, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114543887-753544928.png', NULL, 1, '2025-12-19 10:23:49', '2025-12-19 10:23:49', '2025-12-19 14:15:22'),
(52, 17, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114568050-290559428.png', NULL, 2, '2025-12-19 10:23:49', '2025-12-19 10:23:49', '2025-12-19 14:15:22'),
(53, 17, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114592750-309432241.png', NULL, 3, '2025-12-19 10:23:49', '2025-12-19 10:23:49', '2025-12-19 14:15:22'),
(54, 17, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114620759-377829480.png', NULL, 4, '2025-12-19 10:23:49', '2025-12-19 10:23:49', '2025-12-19 14:15:22'),
(55, 18, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114658725-954822285.webp', 'Ảnh đại diện', 0, '2025-12-19 10:25:21', '2025-12-19 10:25:21', '2025-12-19 14:15:22'),
(56, 18, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114668953-716507332.png', NULL, 1, '2025-12-19 10:25:21', '2025-12-19 10:25:21', '2025-12-19 14:15:22'),
(57, 18, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114686914-656185376.png', NULL, 2, '2025-12-19 10:25:21', '2025-12-19 10:25:21', '2025-12-19 14:15:22'),
(58, 18, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766114699958-147499586.png', NULL, 3, '2025-12-19 10:25:21', '2025-12-19 10:25:21', '2025-12-19 14:15:22'),
(65, 20, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115789990-654487987.png', NULL, 0, '2025-12-19 10:44:44', '2025-12-19 10:44:44', '2025-12-19 14:15:22'),
(66, 20, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115803443-420260105.png', NULL, 1, '2025-12-19 10:44:44', '2025-12-19 10:44:44', '2025-12-19 14:15:22'),
(67, 20, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115814646-654902866.png', NULL, 2, '2025-12-19 10:44:44', '2025-12-19 10:44:44', '2025-12-19 14:15:22'),
(68, 20, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115823880-227592702.png', NULL, 3, '2025-12-19 10:44:44', '2025-12-19 10:44:44', '2025-12-19 14:15:22'),
(69, 20, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766115855221-414062494.png', NULL, 4, '2025-12-19 10:44:44', '2025-12-19 10:44:44', '2025-12-19 14:15:22'),
(72, 20, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766116108799-156791621.jpg', NULL, 6, '2025-12-19 10:48:37', '2025-12-19 10:48:37', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `media_bai_viet_dich_vu`
--

CREATE TABLE `media_bai_viet_dich_vu` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_bai_viet_dich_vu`
--

INSERT INTO `media_bai_viet_dich_vu` (`id`, `id_bai_viet`, `loai`, `url`, `mo_ta`, `thu_tu`, `ngay_upload`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:20:10', '2025-12-19 09:20:10', '2025-12-19 14:15:22'),
(2, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:20:10', '2025-12-19 09:20:10', '2025-12-19 14:15:22'),
(3, 3, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:20:56', '2025-12-19 09:20:56', '2025-12-19 14:15:22'),
(4, 3, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:20:56', '2025-12-19 09:20:56', '2025-12-19 14:15:22'),
(5, 4, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:21:25', '2025-12-19 09:21:25', '2025-12-19 14:15:22'),
(6, 4, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:21:25', '2025-12-19 09:21:25', '2025-12-19 14:15:22'),
(7, 5, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:22:19', '2025-12-19 09:22:19', '2025-12-19 14:15:22'),
(8, 5, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:22:19', '2025-12-19 09:22:19', '2025-12-19 14:15:22'),
(9, 6, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:22:39', '2025-12-19 09:22:39', '2025-12-19 14:15:22'),
(10, 6, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:22:39', '2025-12-19 09:22:39', '2025-12-19 14:15:22'),
(11, 7, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:23:00', '2025-12-19 09:23:00', '2025-12-19 14:15:22'),
(12, 7, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:23:00', '2025-12-19 09:23:00', '2025-12-19 14:15:22'),
(13, 8, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:23:23', '2025-12-19 09:23:23', '2025-12-19 14:15:22'),
(14, 8, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:23:23', '2025-12-19 09:23:23', '2025-12-19 14:15:22'),
(15, 9, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:23:51', '2025-12-19 09:23:51', '2025-12-19 14:15:22'),
(16, 9, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:23:51', '2025-12-19 09:23:51', '2025-12-19 14:15:22'),
(17, 10, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:25:26', '2025-12-19 09:25:26', '2025-12-19 14:15:22'),
(18, 10, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:25:26', '2025-12-19 09:25:26', '2025-12-19 14:15:22'),
(19, 11, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:25:50', '2025-12-19 09:25:50', '2025-12-19 14:15:22'),
(20, 11, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:25:50', '2025-12-19 09:25:50', '2025-12-19 14:15:22'),
(21, 12, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:37:55', '2025-12-19 09:37:55', '2025-12-19 14:15:22'),
(22, 12, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:37:55', '2025-12-19 09:37:55', '2025-12-19 14:15:22'),
(23, 13, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:38:35', '2025-12-19 09:38:35', '2025-12-19 14:15:22'),
(24, 13, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:38:35', '2025-12-19 09:38:35', '2025-12-19 14:15:22'),
(25, 14, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:39:12', '2025-12-19 09:39:12', '2025-12-19 14:15:22'),
(26, 14, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:39:12', '2025-12-19 09:39:12', '2025-12-19 14:15:22'),
(27, 15, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:47:37', '2025-12-19 09:47:37', '2025-12-19 14:15:22'),
(28, 15, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:47:37', '2025-12-19 09:47:37', '2025-12-19 14:15:22'),
(29, 16, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:48:47', '2025-12-19 09:48:47', '2025-12-19 14:15:22'),
(30, 16, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:48:47', '2025-12-19 09:48:47', '2025-12-19 14:15:22'),
(31, 17, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110691223-676941387.jpg', NULL, 0, '2025-12-19 09:49:13', '2025-12-19 09:49:13', '2025-12-19 14:15:22'),
(32, 17, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766110713940-404497059.png', NULL, 1, '2025-12-19 09:49:13', '2025-12-19 09:49:13', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `media_bai_viet_phong`
--

CREATE TABLE `media_bai_viet_phong` (
  `id` bigint(20) NOT NULL,
  `id_bai_viet` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_bai_viet_phong`
--

INSERT INTO `media_bai_viet_phong` (`id`, `id_bai_viet`, `loai`, `url`, `mo_ta`, `thu_tu`, `ngay_upload`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109399097-546418753.jpg', NULL, 0, '2025-12-19 09:00:06', '2025-12-19 09:00:06', '2025-12-19 14:15:22'),
(2, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109418921-704869750.jpg', NULL, 1, '2025-12-19 09:00:06', '2025-12-19 09:00:06', '2025-12-19 14:15:22'),
(3, 3, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109399097-546418753.jpg', NULL, 0, '2025-12-19 09:00:53', '2025-12-19 09:00:53', '2025-12-19 14:15:22'),
(4, 3, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766109418921-704869750.jpg', NULL, 1, '2025-12-19 09:00:53', '2025-12-19 09:00:53', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `media_ca_nhan_benh_nhan`
--

CREATE TABLE `media_ca_nhan_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_dieu_duong` bigint(20) DEFAULT NULL,
  `id_benh_nhan` bigint(20) NOT NULL,
  `id_nguoi_nha` bigint(20) DEFAULT NULL,
  `duong_dan_anh` text DEFAULT NULL,
  `loi_nhan` text DEFAULT NULL,
  `ngay_gui` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_ca_nhan_benh_nhan`
--

INSERT INTO `media_ca_nhan_benh_nhan` (`id`, `id_dieu_duong`, `id_benh_nhan`, `id_nguoi_nha`, `duong_dan_anh`, `loi_nhan`, `ngay_gui`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, NULL, 17, 5, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1765877011441-330557759.jpg', NULL, '2025-12-16 09:23:31', '2025-12-16 16:23:31', '2025-12-19 14:15:22'),
(2, NULL, 17, 4, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1765877036407-497743700.jpg', NULL, '2025-12-16 09:23:56', '2025-12-16 16:23:56', '2025-12-19 14:15:22'),
(3, NULL, 17, NULL, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1765877367260-702751896.jpg', NULL, '2025-12-16 09:29:27', '2025-12-16 16:29:27', '2025-12-19 14:15:22'),
(4, NULL, 17, 5, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1765878654588-928417750.jpg', 'Đẹp không bác ?', '2025-12-16 09:50:54', '2025-12-16 16:50:54', '2025-12-19 14:15:22'),
(5, NULL, 17, 5, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1765878714565-574992829.jpg', 'Chào các cụ một câu nàoooo', '2025-12-16 09:51:54', '2025-12-16 16:51:54', '2025-12-19 14:15:22'),
(6, NULL, 17, 5, NULL, 'Chào các bác buổi sáng tốt lành', '2025-12-17 02:20:28', '2025-12-17 09:20:28', '2025-12-17 09:20:28');

-- --------------------------------------------------------

--
-- Table structure for table `media_ho_so_nhan_vien`
--

CREATE TABLE `media_ho_so_nhan_vien` (
  `id` bigint(20) NOT NULL,
  `id_nhan_vien` bigint(20) DEFAULT NULL,
  `anh_cccd` text DEFAULT NULL,
  `anh_bangdh` text DEFAULT NULL,
  `anh_bhyt` text DEFAULT NULL,
  `anh_cv` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_ho_so_nhan_vien`
--

INSERT INTO `media_ho_so_nhan_vien` (`id`, `id_nhan_vien`, `anh_cccd`, `anh_bangdh`, `anh_bhyt`, `anh_cv`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 4, NULL, NULL, NULL, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file_cv-1766045334949-846554860.pdf', '2025-12-18 15:14:39', '2025-12-19 14:15:22'),
(2, 5, NULL, NULL, NULL, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file_cv-1766046644088-119762549.pdf', '2025-12-18 15:31:03', '2025-12-19 14:15:22'),
(3, 6, NULL, NULL, NULL, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file_cv-1766046953372-223277917.pdf', '2025-12-18 15:36:00', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `media_su_kien`
--

CREATE TABLE `media_su_kien` (
  `id` bigint(20) NOT NULL,
  `id_su_kien` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL,
  `url` text NOT NULL,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_tin_tuyen_dung`
--

CREATE TABLE `media_tin_tuyen_dung` (
  `id` bigint(20) NOT NULL,
  `id_tin_tuyen_dung` bigint(20) DEFAULT NULL,
  `loai` enum('anh','video') NOT NULL DEFAULT 'anh',
  `url` text NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `thu_tu` int(11) DEFAULT 0,
  `ngay_upload` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media_tin_tuyen_dung`
--

INSERT INTO `media_tin_tuyen_dung` (`id`, `id_tin_tuyen_dung`, `loai`, `url`, `mo_ta`, `thu_tu`, `ngay_upload`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/files-1766045285583-665383809.jpg', NULL, 0, '2025-12-18 15:08:05', '2025-12-18 15:08:05', '2025-12-19 14:15:22'),
(3, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/files-1766045285589-792225346.jpg', NULL, 1, '2025-12-18 15:08:05', '2025-12-18 15:08:05', '2025-12-19 14:15:22'),
(4, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/files-1766045285590-192501464.jpg', NULL, 2, '2025-12-18 15:08:05', '2025-12-18 15:08:05', '2025-12-19 14:15:22'),
(5, 2, 'anh', 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/files-1766045285597-212573147.jpg', NULL, 3, '2025-12-18 15:08:05', '2025-12-18 15:08:05', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_tham_gia_su_kien`
--

CREATE TABLE `nguoi_tham_gia_su_kien` (
  `id` bigint(20) NOT NULL,
  `id_su_kien` bigint(20) DEFAULT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_nguoi_than` bigint(20) DEFAULT NULL,
  `xac_nhan` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_than_benh_nhan`
--

CREATE TABLE `nguoi_than_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `moi_quan_he` varchar(50) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `la_nguoi_lien_he_chinh` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `avatar` text DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoi_than_benh_nhan`
--

INSERT INTO `nguoi_than_benh_nhan` (`id`, `id_benh_nhan`, `id_tai_khoan`, `ho_ten`, `moi_quan_he`, `so_dien_thoai`, `email`, `la_nguoi_lien_he_chinh`, `ngay_tao`, `ngay_cap_nhat`, `avatar`) VALUES
(3, 17, NULL, ' Hoàng', 'Anh', '212112', 'hoangdjno1@gmail.com', 0, '2025-12-16 14:54:14', '2025-12-16 14:54:14', NULL),
(4, 17, NULL, 'Kiệt', 'Anh', '121221121', 'kietvu389@gmail.com', 0, '2025-12-16 14:54:33', '2025-12-16 14:54:33', NULL),
(5, 17, NULL, 'Đỗ Phú', 'Em', '1212122112', 'phuhatdosay@gmail.com', 0, '2025-12-16 14:55:00', '2025-12-16 14:55:00', NULL),
(6, 17, NULL, 'Hoàng Hoa', 'Anh chị', '0365157215', 'a@gmail.com', 0, '2025-12-18 14:50:19', '2025-12-18 14:50:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nhiet_do`
--

CREATE TABLE `nhiet_do` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `gia_tri_nhiet_do` decimal(4,2) DEFAULT NULL COMMENT 'Giá trị nhiệt độ (°C)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo nhiệt độ',
  `vi_tri_do` enum('tran','tai','mieng','nach','truc_trang') DEFAULT NULL COMMENT 'Vị trí đo',
  `tinh_trang_luc_do` enum('nghi_ngoi','van_dong','sau_an','sau_ngu') DEFAULT NULL COMMENT 'Tình trạng lúc đo',
  `ghi_chu` text DEFAULT NULL,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text DEFAULT NULL COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text DEFAULT NULL COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nhip_tim`
--

CREATE TABLE `nhip_tim` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `gia_tri_nhip_tim` int(11) DEFAULT NULL COMMENT 'Giá trị nhịp tim (bpm)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo nhịp tim',
  `tinh_trang_benh_nhan_khi_do` enum('nghi_ngoi','van_dong','ngu','an') DEFAULT NULL COMMENT 'Tình trạng bệnh nhân khi đo',
  `ghi_chu` text DEFAULT NULL,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text DEFAULT NULL COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text DEFAULT NULL COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhip_tim`
--

INSERT INTO `nhip_tim` (`id`, `id_benh_nhan`, `gia_tri_nhip_tim`, `thoi_gian_do`, `tinh_trang_benh_nhan_khi_do`, `ghi_chu`, `muc_do`, `noi_dung_canh_bao`, `id_cau_hinh_chi_so_canh_bao`, `danh_gia_chi_tiet`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 16, 21, '2025-12-16 07:46:00', 'van_dong', '', 'binh_thuong', '12', NULL, NULL, '2025-12-16 14:47:03', '2025-12-16 14:47:03');

-- --------------------------------------------------------

--
-- Table structure for table `otp_xac_thuc`
--

CREATE TABLE `otp_xac_thuc` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `ma_otp` varchar(10) DEFAULT NULL,
  `loai_otp` enum('dang_ky','quen_mat_khau') DEFAULT NULL,
  `het_han` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_cong_cong_viec`
--

CREATE TABLE `phan_cong_cong_viec` (
  `id` bigint(20) NOT NULL,
  `id_cong_viec` bigint(20) DEFAULT NULL,
  `id_dieu_duong` bigint(20) DEFAULT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `trang_thai` enum('chua_lam','dang_lam','hoan_thanh') DEFAULT 'chua_lam',
  `thoi_gian_hoan_thanh` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_cong_su_kien`
--

CREATE TABLE `phan_cong_su_kien` (
  `id` bigint(20) NOT NULL,
  `id_su_kien` bigint(20) DEFAULT NULL,
  `id_nhan_vien` bigint(20) DEFAULT NULL,
  `vai_tro` varchar(100) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_hoi_benh_nhan`
--

CREATE TABLE `phan_hoi_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_dieu_duong` bigint(20) DEFAULT NULL,
  `diem_danh_gia` int(11) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `ngay_danh_gia` datetime DEFAULT current_timestamp(),
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phan_khu`
--

CREATE TABLE `phan_khu` (
  `id` bigint(20) NOT NULL,
  `ten_khu` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `so_tang` int(11) DEFAULT NULL,
  `so_phong` int(11) DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phan_khu`
--

INSERT INTO `phan_khu` (`id`, `ten_khu`, `mo_ta`, `so_tang`, `so_phong`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 'A', 'Khu nhà A', 4, 10, 1, '2025-12-19 08:46:11', '2025-12-16 14:43:41', '2025-12-19 08:46:11'),
(3, 'A', 'Khu nội trú nằm về hướng Đông Nam của Viện Dưỡng Lão Xuân Hoa', 5, 50, 0, NULL, '2025-12-19 08:53:37', '2025-12-19 08:53:37');

-- --------------------------------------------------------

--
-- Table structure for table `phan_loai_do_dung`
--

CREATE TABLE `phan_loai_do_dung` (
  `id` bigint(20) NOT NULL,
  `ten_loai` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phan_loai_do_dung`
--

INSERT INTO `phan_loai_do_dung` (`id`, `ten_loai`, `mo_ta`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Qu???n ??o', 'Qu???n ??o c?? nh??n c???a b???nh nh??n', '2025-12-19 09:42:04', '2025-12-19 09:42:04'),
(2, 'Gi??y d??p', 'Gi??y d??p, d??p ??i trong ph??ng', '2025-12-19 09:42:04', '2025-12-19 09:42:04'),
(3, '????? d??ng c?? nh??n', 'B??n ch???i, kem ????nh r??ng, x?? ph??ng...', '2025-12-19 09:42:04', '2025-12-19 09:42:04'),
(4, 'Thi???t b??? y t???', 'Thu???c, d???ng c??? y t??? c?? nh??n', '2025-12-19 09:42:04', '2025-12-19 09:42:04'),
(5, '??i???n t???', '??i???n tho???i, m??y t??nh b???ng, s???c...', '2025-12-19 09:42:04', '2025-12-19 09:42:04'),
(6, 'Gi???y t???', 'CMND, BHYT, gi???y t??? quan tr???ng', '2025-12-19 09:42:04', '2025-12-19 09:42:04'),
(7, 'Kh??c', 'C??c ????? d??ng kh??c', '2025-12-19 09:42:04', '2025-12-19 09:42:04');

-- --------------------------------------------------------

--
-- Table structure for table `phong`
--

CREATE TABLE `phong` (
  `id` bigint(20) NOT NULL,
  `id_loai_phong` bigint(20) DEFAULT NULL,
  `id_phan_khu` bigint(20) NOT NULL,
  `ten_phong` varchar(255) NOT NULL,
  `so_phong` varchar(50) DEFAULT NULL,
  `so_giuong` int(11) DEFAULT NULL,
  `so_nguoi_toi_da` int(11) DEFAULT 1,
  `dien_tich` decimal(10,2) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` enum('trong','co_nguoi','bao_tri') DEFAULT 'trong',
  `anh_1` text DEFAULT NULL,
  `anh_2` text DEFAULT NULL,
  `anh_3` text DEFAULT NULL,
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phong`
--

INSERT INTO `phong` (`id`, `id_loai_phong`, `id_phan_khu`, `ten_phong`, `so_phong`, `so_giuong`, `so_nguoi_toi_da`, `dien_tich`, `mo_ta`, `trang_thai`, `anh_1`, `anh_2`, `anh_3`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(4, NULL, 2, '101', '101', 10, 10, 200.00, NULL, 'trong', NULL, NULL, NULL, 1, '2025-12-18 15:38:44', '2025-12-16 14:44:23', '2025-12-18 15:38:44'),
(5, NULL, 2, 'A', '102', 10, 10, 200.00, NULL, 'trong', NULL, NULL, NULL, 1, '2025-12-18 15:38:47', '2025-12-16 14:44:47', '2025-12-18 15:38:47'),
(6, NULL, 2, 'A', '101', 10, 10, 120.00, NULL, 'trong', 'http://localhost:4545/uploads/file-1766050927695-728474219.jpg', 'http://localhost:4545/uploads/file-1766050932131-244465556.jpg', 'http://localhost:4545/uploads/file-1766050936781-706631564.jpg', 1, '2025-12-19 08:46:05', '2025-12-18 16:44:06', '2025-12-19 08:46:05'),
(7, 1, 3, 'A', '101', 10, 10, 100.00, NULL, 'trong', 'http://localhost:4545/uploads/file-1766109243367-328343475.jpg', 'http://localhost:4545/uploads/file-1766109247620-797569366.jpg', 'http://localhost:4545/uploads/file-1766109252668-293575743.jpg', 0, NULL, '2025-12-19 08:54:13', '2025-12-19 08:54:13'),
(8, 2, 3, 'A', '102', 10, 10, 100.00, NULL, 'trong', 'http://localhost:4545/uploads/file-1766109277211-170143923.jpg', 'http://localhost:4545/uploads/file-1766109280373-46326687.jpg', 'http://localhost:4545/uploads/file-1766109307059-223457587.jpg', 0, NULL, '2025-12-19 08:55:08', '2025-12-19 09:03:22');

-- --------------------------------------------------------

--
-- Table structure for table `phong_o_benh_nhan`
--

CREATE TABLE `phong_o_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `id_phong` bigint(20) DEFAULT NULL,
  `ngay_bat_dau_o` date DEFAULT NULL,
  `ngay_ket_thuc_o` date DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phong_o_benh_nhan_backup`
--

CREATE TABLE `phong_o_benh_nhan_backup` (
  `id` bigint(20) NOT NULL DEFAULT 0,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `khu` varchar(50) DEFAULT NULL,
  `phong` varchar(50) DEFAULT NULL,
  `giuong` varchar(50) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `spo2`
--

CREATE TABLE `spo2` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `gia_tri_spo2` int(11) DEFAULT NULL COMMENT 'Giá trị SpO2 (%)',
  `pi` decimal(5,2) DEFAULT NULL COMMENT 'Perfusion Index (chỉ số tưới máu)',
  `thoi_gian_do` datetime DEFAULT NULL COMMENT 'Thời gian đo SpO2',
  `vi_tri_do` enum('ngon_tay_cai','ngon_tay_tro','ngon_tay_giua','ngon_tay_ut','ngon_chan') DEFAULT NULL COMMENT 'Vị trí đo',
  `tinh_trang_ho_hap` enum('binh_thuong','kho_tho','tho_nhanh','tho_cham','ngung_tho') DEFAULT NULL COMMENT 'Tình trạng hô hấp',
  `ghi_chu` text DEFAULT NULL,
  `muc_do` enum('binh_thuong','canh_bao','nguy_hiem') DEFAULT NULL COMMENT 'Mức độ cảnh báo',
  `noi_dung_canh_bao` text DEFAULT NULL COMMENT 'Nội dung cảnh báo nếu có',
  `id_cau_hinh_chi_so_canh_bao` bigint(20) DEFAULT NULL COMMENT 'ID cấu hình chỉ số cảnh báo',
  `danh_gia_chi_tiet` text DEFAULT NULL COMMENT 'Đánh giá chi tiết (tự động tính)',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `su_kien`
--

CREATE TABLE `su_kien` (
  `id` bigint(20) NOT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay` datetime DEFAULT NULL,
  `dia_diem` varchar(255) DEFAULT NULL,
  `ngan_sach` int(11) DEFAULT NULL,
  `anh_dai_dien` text DEFAULT NULL,
  `video` text DEFAULT NULL,
  `trang_thai` enum('sap_dien_ra','dang_dien_ra','ket_thuc') DEFAULT 'sap_dien_ra',
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `su_kien`
--

INSERT INTO `su_kien` (`id`, `tieu_de`, `mo_ta`, `ngay`, `dia_diem`, `ngan_sach`, `anh_dai_dien`, `video`, `trang_thai`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 'Lễ hội Giáng Sinh', 'Lễ hội Giáng Sinh là sự kiện thường niên được tổ chức tại viện dưỡng lão nhằm mang đến không khí ấm áp, vui tươi và gắn kết cho người cao tuổi trong mùa lễ cuối năm. Chương trình được trang trí rực rỡ với cây thông Noel, ánh đèn lung linh và không gian thân thiện, tạo cảm giác gần gũi như trong gia đình.\nTrong khuôn khổ lễ hội, người cao tuổi được tham gia các hoạt động ý nghĩa như giao lưu, ca hát các bài nhạc Giáng Sinh quen thuộc, thưởng thức tiệc nhẹ, nhận quà và cùng nhau chia sẻ những khoảnh khắc ấm áp. Đây không chỉ là dịp mang lại niềm vui tinh thần mà còn giúp các cụ cảm nhận được sự quan tâm, yêu thương từ đội ngũ nhân viên, gia đình và cộng đồng.\nLễ hội Giáng Sinh tại viện dưỡng lão không chỉ đơn thuần là một sự kiện giải trí, mà còn là hoạt động chăm sóc tinh thần quan trọng, góp phần lan tỏa niềm vui, sự an yên và hạnh phúc cho người cao tuổi trong không khí sum vầy, ấm áp của mùa lễ hội.', '2025-12-24 04:31:00', 'Viện Dưỡng lão Xuân Hoa', 1000000, 'https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/file-1766118713423-527353096.jpg', NULL, 'sap_dien_ra', 0, NULL, '2025-12-19 11:32:33', '2025-12-19 14:15:22');

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan`
--

CREATE TABLE `tai_khoan` (
  `id` bigint(20) NOT NULL,
  `ho_ten` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `mat_khau` text DEFAULT NULL,
  `vai_tro` enum('super_admin','quan_ly_y_te','quan_ly_nhan_su','dieu_duong','dieu_duong_truong','nguoi_nha','marketing') DEFAULT NULL,
  `trang_thai` enum('active','inactive','locked') DEFAULT 'active',
  `da_xoa` tinyint(1) DEFAULT 0,
  `ngay_xoa` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tai_khoan`
--

INSERT INTO `tai_khoan` (`id`, `ho_ten`, `so_dien_thoai`, `email`, `avatar`, `mat_khau`, `vai_tro`, `trang_thai`, `da_xoa`, `ngay_xoa`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Admin12', '0123456789', 'kietvu389@gmail.com', NULL, '$2y$10$JrnNTV42f2DSbRYaseKSW.IUK9N2tg4zEOINAA19dMAPegmldgqk2', 'super_admin', 'active', 0, NULL, '2025-12-16 14:38:40', '2025-12-16 14:38:40'),
(7, 'Hoàng Hoa', '0365157215', 'a@gmail.com', NULL, '$2a$10$Sfox7lpxa/iE2VAdBZSyhuaW4s1EBqiISjkYck0iuaEXd7Nsqyd8C', 'nguoi_nha', 'active', 1, '2025-12-18 15:37:43', '2025-12-18 14:50:19', '2025-12-18 15:37:43'),
(8, 'aaa', '12121212', 'kietvu3893@gmail.com', NULL, '$2a$10$glvARAlOQwkIe6ItTdPEC.FpeKgM.KfW0OPst4kxci1izFxrev20S', 'dieu_duong', 'active', 1, '2025-12-18 15:37:40', '2025-12-18 15:36:00', '2025-12-18 15:37:40');

-- --------------------------------------------------------

--
-- Table structure for table `tam_ly_giao_tiep`
--

CREATE TABLE `tam_ly_giao_tiep` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `trang_thai_tinh_than` enum('vui_ve','binh_thuong','buon_ba','lo_lang','cau_gat') DEFAULT NULL,
  `nhan_thuc_nguoi_than` tinyint(1) DEFAULT NULL,
  `nhan_thuc_dieu_duong` tinyint(1) DEFAULT NULL,
  `biet_thoi_gian` tinyint(1) DEFAULT NULL,
  `muc_do_tuong_tac` enum('chu_dong','phan_hoi','it_phan_hoi','khong_giao_tiep') DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `thoi_gian` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_bao`
--

CREATE TABLE `thong_bao` (
  `id` bigint(20) NOT NULL,
  `id_nguoi_nhan` bigint(20) DEFAULT NULL,
  `loai` enum('cong_viec','canh_bao','tin_nhan','su_kien','he_thong') NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `noi_dung` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `da_doc` tinyint(1) DEFAULT 0,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_tin_benh`
--

CREATE TABLE `thong_tin_benh` (
  `id` bigint(20) NOT NULL,
  `ten_benh` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thong_tin_tai_khoan`
--

CREATE TABLE `thong_tin_tai_khoan` (
  `id` bigint(20) NOT NULL,
  `id_tai_khoan` bigint(20) DEFAULT NULL,
  `ten_thuoc_tinh` varchar(255) DEFAULT NULL,
  `gia_tri` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `thuoc_trong_don`
--

CREATE TABLE `thuoc_trong_don` (
  `id` bigint(20) NOT NULL,
  `id_don_thuoc` bigint(20) DEFAULT NULL,
  `ten_thuoc` varchar(255) DEFAULT NULL,
  `lieu_luong` varchar(255) DEFAULT NULL,
  `thoi_diem_uong` varchar(50) DEFAULT NULL,
  `thoi_gian_uong` datetime DEFAULT NULL COMMENT 'Thời gian cụ thể uống thuốc',
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tin_tuyen_dung`
--

CREATE TABLE `tin_tuyen_dung` (
  `id` bigint(20) NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `vi_tri` varchar(100) NOT NULL,
  `yeu_cau` text DEFAULT NULL,
  `so_luong` int(11) DEFAULT 1,
  `ngay_dang` datetime DEFAULT current_timestamp(),
  `ngay_het_han` datetime DEFAULT NULL,
  `trang_thai` enum('dang_tuyen','tam_dung','da_dong') DEFAULT 'dang_tuyen',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tin_tuyen_dung`
--

INSERT INTO `tin_tuyen_dung` (`id`, `tieu_de`, `mo_ta`, `vi_tri`, `yeu_cau`, `so_luong`, `ngay_dang`, `ngay_het_han`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(2, 'Tuyển dụng vị trí Bác Sĩ Chuyên Khoa tháng 12/2025', 'Viện Dưỡng lão Xuân Hoa cần tuyển bác sĩ chuyên khoa đảm nhận vị trí tại khoa Lão Khoa.', 'Bác sĩ chuyên khoa', '- Tốt nghiệp Đại học tại ngành Y và các chuyên ngành liên quan\n- Có ít nhất 5 năm kinh nghiệm tại vị trí bác sĩ chuyên khoa\n- Chịu đựng được cường độ làm việc cao, liên tục\n- Làm việc từ thứ 2 đến thứ 6\n- Có ít nhất 3 năm kinh nghiệm phẫu thuật\n- Học vị từ PGS ( nice to have)', 1, '2025-12-18 15:07:12', '2025-12-27 08:07:00', 'dang_tuyen', '2025-12-18 15:07:12', '2025-12-18 15:08:08');

-- --------------------------------------------------------

--
-- Table structure for table `trieu_chung_benh_nhan`
--

CREATE TABLE `trieu_chung_benh_nhan` (
  `id` bigint(20) NOT NULL,
  `id_trieu_chung` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) NOT NULL,
  `ngay_gio_xay_ra` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `van_dong_phuc_hoi`
--

CREATE TABLE `van_dong_phuc_hoi` (
  `id` bigint(20) NOT NULL,
  `id_benh_nhan` bigint(20) DEFAULT NULL,
  `kha_nang_van_dong` enum('doc_lap','tro_giup','nam_lien') DEFAULT NULL,
  `loai_bai_tap` varchar(255) DEFAULT NULL,
  `thoi_gian_bat_dau` datetime DEFAULT NULL,
  `thoi_luong_phut` int(11) DEFAULT NULL,
  `cuong_do` enum('nhe','trung_binh','manh') DEFAULT NULL,
  `calo_tieu_hao` int(11) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `id_tac_gia` (`id_tac_gia`);

--
-- Indexes for table `bai_viet_dich_vu`
--
ALTER TABLE `bai_viet_dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `id_tac_gia` (`id_tac_gia`),
  ADD KEY `id_dich_vu` (`id_dich_vu`);

--
-- Indexes for table `bai_viet_phong`
--
ALTER TABLE `bai_viet_phong`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `id_tac_gia` (`id_tac_gia`),
  ADD KEY `id_loai_phong` (`id_loai_phong`);

--
-- Indexes for table `bang_gia_dich_vu`
--
ALTER TABLE `bang_gia_dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dich_vu` (`id_dich_vu`);

--
-- Indexes for table `benh_hien_tai`
--
ALTER TABLE `benh_hien_tai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_thong_tin_benh` (`id_thong_tin_benh`);

--
-- Indexes for table `benh_nhan`
--
ALTER TABLE `benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_benh_nhan_ngay_nhap_vien` (`ngay_nhap_vien`);

--
-- Indexes for table `benh_nhan_dich_vu`
--
ALTER TABLE `benh_nhan_dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_id_dich_vu` (`id_dich_vu`),
  ADD KEY `idx_trang_thai` (`trang_thai`),
  ADD KEY `idx_ngay_bat_dau` (`ngay_bat_dau`);

--
-- Indexes for table `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`);

--
-- Indexes for table `binh_luan_bai_viet_dich_vu`
--
ALTER TABLE `binh_luan_bai_viet_dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`);

--
-- Indexes for table `binh_luan_bai_viet_phong`
--
ALTER TABLE `binh_luan_bai_viet_phong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`);

--
-- Indexes for table `cau_hinh_chi_so_canh_bao`
--
ALTER TABLE `cau_hinh_chi_so_canh_bao`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cong_viec`
--
ALTER TABLE `cong_viec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_tao` (`id_nguoi_tao`),
  ADD KEY `idx_cong_viec_trang_thai` (`muc_uu_tien`);

--
-- Indexes for table `danh_sach_trieu_chung`
--
ALTER TABLE `danh_sach_trieu_chung`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dich_vu`
--
ALTER TABLE `dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_loai_dich_vu` (`id_loai_dich_vu`);

--
-- Indexes for table `diem_rui_ro_ai`
--
ALTER TABLE `diem_rui_ro_ai`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `dieu_duong_benh_nhan`
--
ALTER TABLE `dieu_duong_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_dieu_duong` (`id_dieu_duong`),
  ADD KEY `idx_id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_trang_thai` (`trang_thai`),
  ADD KEY `idx_ngay_bat_dau` (`ngay_bat_dau`);

--
-- Indexes for table `don_thuoc`
--
ALTER TABLE `don_thuoc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `do_dung_ca_nhan`
--
ALTER TABLE `do_dung_ca_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_id_phan_loai` (`id_phan_loai`);

--
-- Indexes for table `duong_huyet`
--
ALTER TABLE `duong_huyet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_duong_huyet_thoi_gian_do` (`thoi_gian_do`),
  ADD KEY `fk_duong_huyet_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`);

--
-- Indexes for table `hoat_dong_sinh_hoat`
--
ALTER TABLE `hoat_dong_sinh_hoat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `ho_so_nhan_vien`
--
ALTER TABLE `ho_so_nhan_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `ho_so_ung_tuyen`
--
ALTER TABLE `ho_so_ung_tuyen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tin_tuyen_dung` (`id_tin_tuyen_dung`);

--
-- Indexes for table `ho_so_y_te_benh_nhan`
--
ALTER TABLE `ho_so_y_te_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_loai_benh_ly` (`id_loai_benh_ly`);

--
-- Indexes for table `huyet_ap`
--
ALTER TABLE `huyet_ap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_huyet_ap_thoi_gian_do` (`thoi_gian_do`),
  ADD KEY `fk_huyet_ap_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`);

--
-- Indexes for table `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `lich_hen_tu_van`
--
ALTER TABLE `lich_hen_tu_van`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nguoi_xac_nhan` (`nguoi_xac_nhan`);

--
-- Indexes for table `lich_kham`
--
ALTER TABLE `lich_kham`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `lich_phan_ca`
--
ALTER TABLE `lich_phan_ca`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `lich_phong_van`
--
ALTER TABLE `lich_phong_van`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_ho_so` (`id_ho_so`);

--
-- Indexes for table `lich_tham_benh`
--
ALTER TABLE `lich_tham_benh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_nguoi_than` (`id_nguoi_than`);

--
-- Indexes for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loai_benh_ly`
--
ALTER TABLE `loai_benh_ly`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loai_dich_vu`
--
ALTER TABLE `loai_dich_vu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `loai_phong`
--
ALTER TABLE `loai_phong`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`),
  ADD KEY `idx_media_bai_viet_thu_tu` (`thu_tu`);

--
-- Indexes for table `media_bai_viet_dich_vu`
--
ALTER TABLE `media_bai_viet_dich_vu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`),
  ADD KEY `idx_media_bai_viet_dich_vu_thu_tu` (`thu_tu`);

--
-- Indexes for table `media_bai_viet_phong`
--
ALTER TABLE `media_bai_viet_phong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_bai_viet` (`id_bai_viet`),
  ADD KEY `idx_media_bai_viet_phong_thu_tu` (`thu_tu`);

--
-- Indexes for table `media_ca_nhan_benh_nhan`
--
ALTER TABLE `media_ca_nhan_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_dieu_duong` (`id_dieu_duong`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_nguoi_nha` (`id_nguoi_nha`);

--
-- Indexes for table `media_ho_so_nhan_vien`
--
ALTER TABLE `media_ho_so_nhan_vien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nhan_vien` (`id_nhan_vien`);

--
-- Indexes for table `media_su_kien`
--
ALTER TABLE `media_su_kien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_su_kien` (`id_su_kien`);

--
-- Indexes for table `media_tin_tuyen_dung`
--
ALTER TABLE `media_tin_tuyen_dung`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tin_tuyen_dung` (`id_tin_tuyen_dung`),
  ADD KEY `idx_media_tin_tuyen_dung_thu_tu` (`thu_tu`);

--
-- Indexes for table `nguoi_tham_gia_su_kien`
--
ALTER TABLE `nguoi_tham_gia_su_kien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_su_kien` (`id_su_kien`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_nguoi_than` (`id_nguoi_than`);

--
-- Indexes for table `nguoi_than_benh_nhan`
--
ALTER TABLE `nguoi_than_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `nhiet_do`
--
ALTER TABLE `nhiet_do`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_nhiet_do_thoi_gian_do` (`thoi_gian_do`),
  ADD KEY `fk_nhiet_do_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`);

--
-- Indexes for table `nhip_tim`
--
ALTER TABLE `nhip_tim`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_nhip_tim_thoi_gian_do` (`thoi_gian_do`),
  ADD KEY `fk_nhip_tim_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`);

--
-- Indexes for table `otp_xac_thuc`
--
ALTER TABLE `otp_xac_thuc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `phan_cong_cong_viec`
--
ALTER TABLE `phan_cong_cong_viec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cong_viec` (`id_cong_viec`),
  ADD KEY `id_dieu_duong` (`id_dieu_duong`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_phan_cong_cong_viec_trang_thai` (`trang_thai`);

--
-- Indexes for table `phan_cong_su_kien`
--
ALTER TABLE `phan_cong_su_kien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_su_kien` (`id_su_kien`),
  ADD KEY `id_nhan_vien` (`id_nhan_vien`);

--
-- Indexes for table `phan_hoi_benh_nhan`
--
ALTER TABLE `phan_hoi_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_dieu_duong` (`id_dieu_duong`);

--
-- Indexes for table `phan_khu`
--
ALTER TABLE `phan_khu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ten_khu` (`ten_khu`),
  ADD KEY `idx_da_xoa` (`da_xoa`);

--
-- Indexes for table `phan_loai_do_dung`
--
ALTER TABLE `phan_loai_do_dung`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `phong`
--
ALTER TABLE `phong`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_id_phan_khu` (`id_phan_khu`),
  ADD KEY `idx_ten_phong` (`ten_phong`),
  ADD KEY `idx_so_phong` (`so_phong`),
  ADD KEY `idx_trang_thai` (`trang_thai`),
  ADD KEY `idx_da_xoa` (`da_xoa`),
  ADD KEY `id_loai_phong` (`id_loai_phong`);

--
-- Indexes for table `phong_o_benh_nhan`
--
ALTER TABLE `phong_o_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_phong_o_benh_nhan_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_id_phong` (`id_phong`),
  ADD KEY `idx_ngay_bat_dau_o` (`ngay_bat_dau_o`),
  ADD KEY `idx_ngay_ket_thuc_o` (`ngay_ket_thuc_o`);

--
-- Indexes for table `spo2`
--
ALTER TABLE `spo2`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `idx_spo2_thoi_gian_do` (`thoi_gian_do`),
  ADD KEY `fk_spo2_cau_hinh` (`id_cau_hinh_chi_so_canh_bao`);

--
-- Indexes for table `su_kien`
--
ALTER TABLE `su_kien`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_tai_khoan_vai_tro` (`vai_tro`);

--
-- Indexes for table `tam_ly_giao_tiep`
--
ALTER TABLE `tam_ly_giao_tiep`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `thong_bao`
--
ALTER TABLE `thong_bao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_nguoi_nhan` (`id_nguoi_nhan`),
  ADD KEY `idx_thong_bao_da_doc` (`da_doc`);

--
-- Indexes for table `thong_tin_benh`
--
ALTER TABLE `thong_tin_benh`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `thong_tin_tai_khoan`
--
ALTER TABLE `thong_tin_tai_khoan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_tai_khoan` (`id_tai_khoan`);

--
-- Indexes for table `thuoc_trong_don`
--
ALTER TABLE `thuoc_trong_don`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_don_thuoc` (`id_don_thuoc`);

--
-- Indexes for table `tin_tuyen_dung`
--
ALTER TABLE `tin_tuyen_dung`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `trieu_chung_benh_nhan`
--
ALTER TABLE `trieu_chung_benh_nhan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_trieu_chung` (`id_trieu_chung`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- Indexes for table `van_dong_phuc_hoi`
--
ALTER TABLE `van_dong_phuc_hoi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_benh_nhan` (`id_benh_nhan`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `bai_viet_dich_vu`
--
ALTER TABLE `bai_viet_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `bai_viet_phong`
--
ALTER TABLE `bai_viet_phong`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `bang_gia_dich_vu`
--
ALTER TABLE `bang_gia_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `benh_hien_tai`
--
ALTER TABLE `benh_hien_tai`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `benh_nhan`
--
ALTER TABLE `benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `benh_nhan_dich_vu`
--
ALTER TABLE `benh_nhan_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `binh_luan_bai_viet_dich_vu`
--
ALTER TABLE `binh_luan_bai_viet_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `binh_luan_bai_viet_phong`
--
ALTER TABLE `binh_luan_bai_viet_phong`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cau_hinh_chi_so_canh_bao`
--
ALTER TABLE `cau_hinh_chi_so_canh_bao`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cong_viec`
--
ALTER TABLE `cong_viec`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `danh_sach_trieu_chung`
--
ALTER TABLE `danh_sach_trieu_chung`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dich_vu`
--
ALTER TABLE `dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `diem_rui_ro_ai`
--
ALTER TABLE `diem_rui_ro_ai`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dieu_duong_benh_nhan`
--
ALTER TABLE `dieu_duong_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `don_thuoc`
--
ALTER TABLE `don_thuoc`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `do_dung_ca_nhan`
--
ALTER TABLE `do_dung_ca_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `duong_huyet`
--
ALTER TABLE `duong_huyet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hoat_dong_sinh_hoat`
--
ALTER TABLE `hoat_dong_sinh_hoat`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ho_so_nhan_vien`
--
ALTER TABLE `ho_so_nhan_vien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ho_so_ung_tuyen`
--
ALTER TABLE `ho_so_ung_tuyen`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ho_so_y_te_benh_nhan`
--
ALTER TABLE `ho_so_y_te_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `huyet_ap`
--
ALTER TABLE `huyet_ap`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_hen_tu_van`
--
ALTER TABLE `lich_hen_tu_van`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `lich_kham`
--
ALTER TABLE `lich_kham`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_phan_ca`
--
ALTER TABLE `lich_phan_ca`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `lich_phong_van`
--
ALTER TABLE `lich_phong_van`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lich_tham_benh`
--
ALTER TABLE `lich_tham_benh`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loai_benh_ly`
--
ALTER TABLE `loai_benh_ly`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `loai_dich_vu`
--
ALTER TABLE `loai_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `loai_phong`
--
ALTER TABLE `loai_phong`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT for table `media_bai_viet_dich_vu`
--
ALTER TABLE `media_bai_viet_dich_vu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `media_bai_viet_phong`
--
ALTER TABLE `media_bai_viet_phong`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `media_ca_nhan_benh_nhan`
--
ALTER TABLE `media_ca_nhan_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `media_ho_so_nhan_vien`
--
ALTER TABLE `media_ho_so_nhan_vien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `media_su_kien`
--
ALTER TABLE `media_su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_tin_tuyen_dung`
--
ALTER TABLE `media_tin_tuyen_dung`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `nguoi_tham_gia_su_kien`
--
ALTER TABLE `nguoi_tham_gia_su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `nguoi_than_benh_nhan`
--
ALTER TABLE `nguoi_than_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `nhiet_do`
--
ALTER TABLE `nhiet_do`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `nhip_tim`
--
ALTER TABLE `nhip_tim`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `otp_xac_thuc`
--
ALTER TABLE `otp_xac_thuc`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phan_cong_cong_viec`
--
ALTER TABLE `phan_cong_cong_viec`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `phan_cong_su_kien`
--
ALTER TABLE `phan_cong_su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phan_hoi_benh_nhan`
--
ALTER TABLE `phan_hoi_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phan_khu`
--
ALTER TABLE `phan_khu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `phan_loai_do_dung`
--
ALTER TABLE `phan_loai_do_dung`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `phong`
--
ALTER TABLE `phong`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `phong_o_benh_nhan`
--
ALTER TABLE `phong_o_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `spo2`
--
ALTER TABLE `spo2`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `su_kien`
--
ALTER TABLE `su_kien`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tai_khoan`
--
ALTER TABLE `tai_khoan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tam_ly_giao_tiep`
--
ALTER TABLE `tam_ly_giao_tiep`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `thong_bao`
--
ALTER TABLE `thong_bao`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thong_tin_benh`
--
ALTER TABLE `thong_tin_benh`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `thong_tin_tai_khoan`
--
ALTER TABLE `thong_tin_tai_khoan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `thuoc_trong_don`
--
ALTER TABLE `thuoc_trong_don`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tin_tuyen_dung`
--
ALTER TABLE `tin_tuyen_dung`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `trieu_chung_benh_nhan`
--
ALTER TABLE `trieu_chung_benh_nhan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `van_dong_phuc_hoi`
--
ALTER TABLE `van_dong_phuc_hoi`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `bai_viet_dich_vu`
--
ALTER TABLE `bai_viet_dich_vu`
  ADD CONSTRAINT `bai_viet_dich_vu_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`),
  ADD CONSTRAINT `bai_viet_dich_vu_ibfk_2` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`);

--
-- Constraints for table `bai_viet_phong`
--
ALTER TABLE `bai_viet_phong`
  ADD CONSTRAINT `bai_viet_phong_ibfk_1` FOREIGN KEY (`id_tac_gia`) REFERENCES `tai_khoan` (`id`),
  ADD CONSTRAINT `bai_viet_phong_ibfk_2` FOREIGN KEY (`id_loai_phong`) REFERENCES `loai_phong` (`id`);

--
-- Constraints for table `bang_gia_dich_vu`
--
ALTER TABLE `bang_gia_dich_vu`
  ADD CONSTRAINT `bang_gia_dich_vu_ibfk_1` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`);

--
-- Constraints for table `benh_hien_tai`
--
ALTER TABLE `benh_hien_tai`
  ADD CONSTRAINT `benh_hien_tai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `benh_hien_tai_ibfk_2` FOREIGN KEY (`id_thong_tin_benh`) REFERENCES `thong_tin_benh` (`id`);

--
-- Constraints for table `benh_nhan_dich_vu`
--
ALTER TABLE `benh_nhan_dich_vu`
  ADD CONSTRAINT `fk_benh_nhan_dich_vu_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_benh_nhan_dich_vu_dich_vu` FOREIGN KEY (`id_dich_vu`) REFERENCES `dich_vu` (`id`);

--
-- Constraints for table `binh_luan_bai_viet`
--
ALTER TABLE `binh_luan_bai_viet`
  ADD CONSTRAINT `binh_luan_bai_viet_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet` (`id`);

--
-- Constraints for table `binh_luan_bai_viet_dich_vu`
--
ALTER TABLE `binh_luan_bai_viet_dich_vu`
  ADD CONSTRAINT `binh_luan_bai_viet_dich_vu_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_dich_vu` (`id`);

--
-- Constraints for table `binh_luan_bai_viet_phong`
--
ALTER TABLE `binh_luan_bai_viet_phong`
  ADD CONSTRAINT `binh_luan_bai_viet_phong_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_phong` (`id`);

--
-- Constraints for table `cong_viec`
--
ALTER TABLE `cong_viec`
  ADD CONSTRAINT `cong_viec_ibfk_1` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `dich_vu`
--
ALTER TABLE `dich_vu`
  ADD CONSTRAINT `dich_vu_ibfk_1` FOREIGN KEY (`id_loai_dich_vu`) REFERENCES `loai_dich_vu` (`id`);

--
-- Constraints for table `diem_rui_ro_ai`
--
ALTER TABLE `diem_rui_ro_ai`
  ADD CONSTRAINT `diem_rui_ro_ai_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `dieu_duong_benh_nhan`
--
ALTER TABLE `dieu_duong_benh_nhan`
  ADD CONSTRAINT `fk_dieu_duong_benh_nhan_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dieu_duong_benh_nhan_dieu_duong` FOREIGN KEY (`id_dieu_duong`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `don_thuoc`
--
ALTER TABLE `don_thuoc`
  ADD CONSTRAINT `don_thuoc_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `do_dung_ca_nhan`
--
ALTER TABLE `do_dung_ca_nhan`
  ADD CONSTRAINT `do_dung_ca_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `fk_do_dung_ca_nhan_phan_loai` FOREIGN KEY (`id_phan_loai`) REFERENCES `phan_loai_do_dung` (`id`);

--
-- Constraints for table `duong_huyet`
--
ALTER TABLE `duong_huyet`
  ADD CONSTRAINT `duong_huyet_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_duong_huyet_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `hoat_dong_sinh_hoat`
--
ALTER TABLE `hoat_dong_sinh_hoat`
  ADD CONSTRAINT `hoat_dong_sinh_hoat_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `ho_so_nhan_vien`
--
ALTER TABLE `ho_so_nhan_vien`
  ADD CONSTRAINT `ho_so_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `ho_so_ung_tuyen`
--
ALTER TABLE `ho_so_ung_tuyen`
  ADD CONSTRAINT `ho_so_ung_tuyen_ibfk_1` FOREIGN KEY (`id_tin_tuyen_dung`) REFERENCES `tin_tuyen_dung` (`id`);

--
-- Constraints for table `ho_so_y_te_benh_nhan`
--
ALTER TABLE `ho_so_y_te_benh_nhan`
  ADD CONSTRAINT `ho_so_y_te_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `ho_so_y_te_benh_nhan_ibfk_2` FOREIGN KEY (`id_loai_benh_ly`) REFERENCES `loai_benh_ly` (`id`);

--
-- Constraints for table `huyet_ap`
--
ALTER TABLE `huyet_ap`
  ADD CONSTRAINT `fk_huyet_ap_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `huyet_ap_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  ADD CONSTRAINT `kpi_nhan_vien_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `lich_hen_tu_van`
--
ALTER TABLE `lich_hen_tu_van`
  ADD CONSTRAINT `lich_hen_tu_van_ibfk_1` FOREIGN KEY (`nguoi_xac_nhan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `lich_kham`
--
ALTER TABLE `lich_kham`
  ADD CONSTRAINT `lich_kham_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `lich_phan_ca`
--
ALTER TABLE `lich_phan_ca`
  ADD CONSTRAINT `lich_phan_ca_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `lich_phong_van`
--
ALTER TABLE `lich_phong_van`
  ADD CONSTRAINT `lich_phong_van_ibfk_1` FOREIGN KEY (`id_ho_so`) REFERENCES `ho_so_ung_tuyen` (`id`);

--
-- Constraints for table `lich_tham_benh`
--
ALTER TABLE `lich_tham_benh`
  ADD CONSTRAINT `lich_tham_benh_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `lich_tham_benh_ibfk_2` FOREIGN KEY (`id_nguoi_than`) REFERENCES `nguoi_than_benh_nhan` (`id`);

--
-- Constraints for table `media_bai_viet`
--
ALTER TABLE `media_bai_viet`
  ADD CONSTRAINT `media_bai_viet_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_bai_viet_dich_vu`
--
ALTER TABLE `media_bai_viet_dich_vu`
  ADD CONSTRAINT `media_bai_viet_dich_vu_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_dich_vu` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_bai_viet_phong`
--
ALTER TABLE `media_bai_viet_phong`
  ADD CONSTRAINT `media_bai_viet_phong_ibfk_1` FOREIGN KEY (`id_bai_viet`) REFERENCES `bai_viet_phong` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_ca_nhan_benh_nhan`
--
ALTER TABLE `media_ca_nhan_benh_nhan`
  ADD CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_1` FOREIGN KEY (`id_dieu_duong`) REFERENCES `ho_so_nhan_vien` (`id`),
  ADD CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `media_ca_nhan_benh_nhan_ibfk_3` FOREIGN KEY (`id_nguoi_nha`) REFERENCES `nguoi_than_benh_nhan` (`id`);

--
-- Constraints for table `media_ho_so_nhan_vien`
--
ALTER TABLE `media_ho_so_nhan_vien`
  ADD CONSTRAINT `media_ho_so_nhan_vien_ibfk_1` FOREIGN KEY (`id_nhan_vien`) REFERENCES `ho_so_nhan_vien` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_su_kien`
--
ALTER TABLE `media_su_kien`
  ADD CONSTRAINT `media_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`);

--
-- Constraints for table `media_tin_tuyen_dung`
--
ALTER TABLE `media_tin_tuyen_dung`
  ADD CONSTRAINT `media_tin_tuyen_dung_ibfk_1` FOREIGN KEY (`id_tin_tuyen_dung`) REFERENCES `tin_tuyen_dung` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nguoi_tham_gia_su_kien`
--
ALTER TABLE `nguoi_tham_gia_su_kien`
  ADD CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`),
  ADD CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `nguoi_tham_gia_su_kien_ibfk_3` FOREIGN KEY (`id_nguoi_than`) REFERENCES `nguoi_than_benh_nhan` (`id`);

--
-- Constraints for table `nguoi_than_benh_nhan`
--
ALTER TABLE `nguoi_than_benh_nhan`
  ADD CONSTRAINT `nguoi_than_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `nguoi_than_benh_nhan_ibfk_2` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `nhiet_do`
--
ALTER TABLE `nhiet_do`
  ADD CONSTRAINT `fk_nhiet_do_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `nhiet_do_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nhip_tim`
--
ALTER TABLE `nhip_tim`
  ADD CONSTRAINT `fk_nhip_tim_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `nhip_tim_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `otp_xac_thuc`
--
ALTER TABLE `otp_xac_thuc`
  ADD CONSTRAINT `otp_xac_thuc_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `phan_cong_cong_viec`
--
ALTER TABLE `phan_cong_cong_viec`
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_1` FOREIGN KEY (`id_cong_viec`) REFERENCES `cong_viec` (`id`),
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `tai_khoan` (`id`),
  ADD CONSTRAINT `phan_cong_cong_viec_ibfk_3` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `phan_cong_su_kien`
--
ALTER TABLE `phan_cong_su_kien`
  ADD CONSTRAINT `phan_cong_su_kien_ibfk_1` FOREIGN KEY (`id_su_kien`) REFERENCES `su_kien` (`id`),
  ADD CONSTRAINT `phan_cong_su_kien_ibfk_2` FOREIGN KEY (`id_nhan_vien`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `phan_hoi_benh_nhan`
--
ALTER TABLE `phan_hoi_benh_nhan`
  ADD CONSTRAINT `phan_hoi_benh_nhan_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`),
  ADD CONSTRAINT `phan_hoi_benh_nhan_ibfk_2` FOREIGN KEY (`id_dieu_duong`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `phong`
--
ALTER TABLE `phong`
  ADD CONSTRAINT `fk_phong_loai_phong` FOREIGN KEY (`id_loai_phong`) REFERENCES `loai_phong` (`id`),
  ADD CONSTRAINT `fk_phong_phan_khu` FOREIGN KEY (`id_phan_khu`) REFERENCES `phan_khu` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `phong_o_benh_nhan`
--
ALTER TABLE `phong_o_benh_nhan`
  ADD CONSTRAINT `fk_phong_o_benh_nhan_benh_nhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_phong_o_benh_nhan_phong` FOREIGN KEY (`id_phong`) REFERENCES `phong` (`id`);

--
-- Constraints for table `spo2`
--
ALTER TABLE `spo2`
  ADD CONSTRAINT `fk_spo2_cau_hinh` FOREIGN KEY (`id_cau_hinh_chi_so_canh_bao`) REFERENCES `cau_hinh_chi_so_canh_bao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `spo2_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tam_ly_giao_tiep`
--
ALTER TABLE `tam_ly_giao_tiep`
  ADD CONSTRAINT `tam_ly_giao_tiep_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `thong_bao`
--
ALTER TABLE `thong_bao`
  ADD CONSTRAINT `thong_bao_ibfk_1` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `thong_tin_tai_khoan`
--
ALTER TABLE `thong_tin_tai_khoan`
  ADD CONSTRAINT `thong_tin_tai_khoan_ibfk_1` FOREIGN KEY (`id_tai_khoan`) REFERENCES `tai_khoan` (`id`);

--
-- Constraints for table `thuoc_trong_don`
--
ALTER TABLE `thuoc_trong_don`
  ADD CONSTRAINT `thuoc_trong_don_ibfk_1` FOREIGN KEY (`id_don_thuoc`) REFERENCES `don_thuoc` (`id`);

--
-- Constraints for table `trieu_chung_benh_nhan`
--
ALTER TABLE `trieu_chung_benh_nhan`
  ADD CONSTRAINT `trieu_chung_benh_nhan_ibfk_1` FOREIGN KEY (`id_trieu_chung`) REFERENCES `danh_sach_trieu_chung` (`id`),
  ADD CONSTRAINT `trieu_chung_benh_nhan_ibfk_2` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

--
-- Constraints for table `van_dong_phuc_hoi`
--
ALTER TABLE `van_dong_phuc_hoi`
  ADD CONSTRAINT `van_dong_phuc_hoi_ibfk_1` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benh_nhan` (`id`);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
