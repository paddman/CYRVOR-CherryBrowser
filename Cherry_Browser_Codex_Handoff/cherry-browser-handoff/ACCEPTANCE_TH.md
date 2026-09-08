# เกณฑ์ตรวจรับ Cherry Browser Anime Redesign

สถานะเริ่มต้นของทุกข้อคือ ยังไม่ได้ทดสอบ ห้ามเปลี่ยนเป็นผ่านโดยไม่มีหลักฐาน
สร้าง TEST_REPORT.md ใน repository เมื่อทำงานจริง ระบุ ผ่าน/ไม่ผ่าน/ไม่ได้ทดสอบ/ต้องตั้งค่า พร้อมเหตุผล
ใช้ browser profile สำหรับทดสอบที่แยกจากของจริง และอย่าใส่ข้อมูลส่วนตัวหรือ tokens ลง screenshot/log

## ภาพและกราฟิก

| รหัส | การตรวจ |
|---|---|
| V01 | New Tab เห็น browser chrome, hero, search และ shortcuts ใน 1366×768 โดยไม่ต้อง zoom out |
| V02 | หน้าใกล้ target ด้าน hierarchy, spacing, สี, กรอบการ์ด และสัดส่วนตัวละคร ไม่ใช่เพียง navy background |
| V03 | ไม่มีผลเชอร์รี โล่ กุญแจ แม่กุญแจ ใน app UI/asset รวมถึงตราเล็กบนชุด |
| V04 | ตัวละครตรง reference ไม่มีมือ/แขนเกิน หน้าบิด หรือ crop ตัดศีรษะผิดตำแหน่ง |
| V05 | ตัวอักษรและปุ่มเป็น DOM จริง เลือก text/ใช้คีย์บอร์ดได้ และ search ไม่ใช่ภาพ |
| V06 | external website ไม่มี hero, CSS หรือ mascot ทับเนื้อหา |
| V07 | การ์ดหลายตำแหน่งไม่ใช้ Cherry รูปเดียวซ้ำเต็มหน้า |
| V08 | dark theme, compact sidebar, graphics-off และ reduced-motion ไม่ทำให้หน้าเสีย |
| V09 | ทุก runtime graphic โหลดจากแพ็กในเครื่อง ไม่มี hotlink ที่ควบคุมไม่ได้ |
| V10 | ทดสอบ 1920×1080, 1672×941, 1440×900, 1366×768 และ Windows DPI 125%/150% เมื่อมีเครื่องรองรับ |

## Browser และข้อมูล

| รหัส | การตรวจ |
|---|---|
| B01 | URL จริงเปิดใน viewport ของแอปไม่ใช่ external system browser; title/URL/favicon sync |
| B02 | ข้อความค้นหาไทย/อังกฤษ ส่ง query ที่ encode ถูกต้องไป search engine ที่เลือก |
| B03 | back/forward/reload/stop ทำงานขณะ load และ redirect |
| B04 | เปิด 20 แท็บ สลับ ปิด เรียง เปิดแท็บที่ปิดแล้ว และ overflow ไม่บัง controls |
| B05 | ปิด/เปิดแอปแล้ว tabs/bookmarks/workspace/theme กลับมาตาม setting ที่เลือก |
| B06 | เพิ่ม/ลบ/แก้ bookmarks และค้นหา history มีข้อมูลจริง ไม่ปน seed/demo data |
| B07 | ดาวน์โหลดไฟล์ทดสอบ progress/ชื่อ/ปลายทางตรงจริง ปุ่มที่ runtime ไม่รองรับไม่อ้างว่าทำได้ |
| B08 | Split View ใช้สองเนื้อหาเว็บจริง และ address bar ทำงานกับด้าน active ที่ถูกต้อง |
| B09 | เปิด/ปิด sidebar/right panel/modal แล้ว native view bounds และ hit area ถูกต้อง |
| B10 | Ctrl+L/T/W/Shift+T/Tab/R/K ทำงานเมื่อ focus อยู่ใน native web page ด้วย |
| B11 | Reader/Notes/Clip เก็บ source URL และไม่ execute script จาก content |
| B12 | Private session ไม่เข้า normal history/restore และบอกข้อจำกัดของไฟล์ดาวน์โหลดที่เก็บไว้ |
| B13 | Weather/AI/Translate ไม่มี config แสดงข้อจำกัด ไม่สร้างผลลัพธ์ปลอม |
| B14 | Memory saver มี lifecycle จริง ไม่พัก active/audio/download และบอกข้อจำกัดของ unsaved state |
| B15 | Workspace ที่แยกเฉพาะ tabs ไม่ถูกโฆษณาว่าแยก session/cookies |

## ความปลอดภัย

| รหัส | การตรวจ |
|---|---|
| S01 | remote page เข้าถึง require/process/fs/shell/privileged preload ไม่ได้ |
| S02 | context isolation, sandbox, web security เปิดตาม architecture และไม่มี bypass certificate |
| S03 | IPC ปฏิเสธ sender/frame/channel/payload ที่ไม่ถูกต้อง |
| S04 | navigation policy แยก http/https กับ file/javascript/external schemes |
| S05 | permissions กล้อง/ไมค์/แจ้งเตือน/ตำแหน่งถามตาม origin และถอนสิทธิ์ได้ |
| S06 | AI ไม่ได้รับ cookie/password/hidden field/history ทุกแท็บโดยไม่ยินยอม |
| S07 | คำสั่งโจมตีที่ฝังในหน้าเว็บไม่เปลี่ยนเป็น privileged tool action |
| S08 | API keys ไม่อยู่ใน bundle, localStorage, logs หรือ screenshots |
| S09 | หลายเว็บไม่สามารถปลอม browser address bar หรือควบคุม shell ผ่าน bridge ได้ |
| S10 | ไม่กล่าวอ้าง OAuth/DRM/extensions/universal site compatibility โดยยังไม่ทดสอบ |

## ประสิทธิภาพและ lifecycle

| รหัส | การตรวจ |
|---|---|
| P01 | บันทึก asset sizes, เวลาแสดง New Tab และเงื่อนไขเครื่องจริง ไม่เขียนตัวเลขตามภาพร่าง |
| P02 | ปิด tab/window แล้ว renderer/webContents ที่เป็นเจ้าของถูก cleanup |
| P03 | ลดกราฟิกหรือเปลี่ยนไปเว็บจริงแล้ว loop/animation ที่ไม่จำเป็นหยุด |
| P04 | เปิด/ปิด tabs ซ้ำหลายรอบ ตรวจ process/memory เทียบ baseline และรายงานข้อจำกัดการวัด |
| P05 | ไม่มี CPU/GPU ทำงานหนักจาก wallpaper/video/WebGL ที่เปิดเองโดยไม่จำเป็น |

## หลักฐานส่งมอบ

screenshot: newtab-large, newtab-1366, real-website, ai-panel, split-view, theme-studio และ settings เมื่อหน้าที่เกี่ยวข้องทำงานแล้ว
เก็บ screenshot จากแอปที่รันจริง หากเป็นเพียง shell preview ต้องระบุชัดและห้ามใช้แทนหลักฐาน native browsing
รายงานคำสั่ง lint/typecheck/test/build ที่รันและ exit status; ไม่สร้าง npm script สมมติที่ไม่ได้อยู่ใน repo
รายการไฟล์ที่แก้และ dependency ที่เพิ่ม; อธิบายการย้ายข้อมูลถ้ามีและวิธี rollback โดยไม่ล้าง user profile
ข้อที่ยังทดสอบไม่ได้ให้บอกว่าเพราะไม่มี GUI/runtime/provider/credential หรือเหตุใด ไม่เหมารวมว่าใช้งานได้ทั้งหมด
