# งานสำหรับ Codex: ปรับ Cherry Browser เป็น Anime UX/UI ที่ใช้งานจริง

## เป้าหมาย
ลงมือแก้ source code ในโปรเจกต์ Cherry Browser ที่เปิดอยู่ ให้ UX/UI ใกล้ภาพ reference/target-home.png โดยคงฟังก์ชันเดิมและสถาปัตยกรรมที่เหมาะสมของโปรเจกต์ งานนี้คือ implementation ไม่ใช่ขอ mockup เพิ่ม ไม่ใช่ขอแผนอย่างเดียว และไม่ใช่สร้าง landing page แยกทิ้งไว้ข้างแอป

ภาพต้นทางทั้งหมดอยู่ในโฟลเดอร์ reference ซึ่งอยู่ข้างไฟล์นี้ เปิดดูภาพจริงก่อนลงมือ ไม่เดาหน้าตาจากชื่อไฟล์

## 1. สำรวจและปกป้องโค้ดเดิม
- อ่าน AGENTS.md และคำแนะนำภายใน repo ที่มีผลกับไฟล์ที่จะทำงาน
- ตรวจ git status, โครงสร้าง source, framework, scripts, lockfile, routing, state, theme, asset pipeline และการทดสอบที่มีอยู่
- ตรวจว่าเป็น Electron, Tauri, native desktop หรือ web app โดยดูจาก source จริง อย่าเลือก stack ใหม่จากภาพหน้าจอ
- ระบุ entry point ของ window shell, sidebar, tabs, toolbar/address bar, home/new tab และเนื้อหาเว็บ
- แสดงแผนสั้น ๆ แล้วลงมือทำต่อในงานเดียว ไม่หยุดส่งเฉพาะแผน
- ใช้ package manager และ component patterns เดิม ไม่ migrate framework หรือ rewrite ทั้งแอปเพื่อเปลี่ยนหน้าตา
- ไม่ทับการแก้ไขที่ผู้ใช้ทำไว้ ไม่ทำ destructive reset ไม่ลบฟีเจอร์ ไม่ push หรือ deploy โดยไม่ได้รับคำสั่ง
- ถ้าไม่มี source app จริงในโฟลเดอร์ ให้รายงานสิ่งที่พบและขอ path ของ repo ห้ามสร้างเว็บคนละโปรเจกต์แล้วอ้างว่าแก้ Cherry Browser สำเร็จ

## 2. ลำดับความสำคัญของภาพและข้อกำหนด
1. ข้อกำหนดข้อความในไฟล์นี้ โดยเฉพาะทรงผมและข้อห้าม มีความสำคัญเหนือรายละเอียดที่ผิดในภาพ
2. reference/target-home.png คือเป้าหมายหลักของหน้า Home / New Tab
3. reference/target-browser-short-hair.png คือแนวทางตกแต่ง browser shell และตัวละคร Cherry ผมสั้น
4. reference/current-app.png คือสภาพแอปเดิมสำหรับตรวจว่าเมนูและฟังก์ชันไม่หาย
5. ภาพแบรนด์และตัวละครอื่นเป็น reference เสริม ไม่ต้องใส่ทุกภาพลงหน้าเดียว

ภาพ mockup มีรายละเอียดวาดที่อาจไม่เหมาะกับ UI จริง เช่น ตัวละครล้ำ toolbar ข้อความเล็ก หรือองค์ประกอบบนเว็บภายนอก ให้แก้รายละเอียดเหล่านั้นเพื่อการใช้งาน ไม่คัดลอกข้อผิดพลาด

## 3. ทิศทางภาพและแบรนด์
- ผลิตภัณฑ์ชื่อ cherry. BROWSER เป็นเบราว์เซอร์ ไม่ใช่หน้า dashboard ของ SOC
- บรรยากาศ anime cyber workspace โทนน้ำเงินกรมท่า ฟ้า electric blue ขาว และกระจกสีเข้ม
- ให้เห็นภาพอนิเมะที่มีรายละเอียดจริงใน hero, assistant card และพื้นที่ตกแต่งที่ตั้งใจออกแบบ ไม่ใช่แค่เปลี่ยนสี CSS
- Cherry ต้องผมสั้นสีน้ำเงินแบบ bob ตามภาพ ตาสีน้ำเงิน เสื้อขาวรายละเอียดน้ำเงิน มีบุคลิกเป็นผู้ช่วยอนิเมะน่ารัก
- ห้ามเปลี่ยน Cherry เป็นผมยาว ห้ามตีความ Cherry เป็นผลไม้ ห้ามใช้ภาพผลเชอร์รีหรือไอคอนผลเชอร์รี
- ห้ามใช้โล่ กุญแจ หรือแม่กุญแจ ในโลโก้ ไอคอน เสื้อผ้า ฉากหลัง และภาพตกแต่งใหม่
- ภาพเก่าบางภาพมีสัญลักษณ์ที่ถูกห้าม ให้ใช้เพื่ออ้างอิงตัวละครเท่านั้นและตัด/ลบสัญลักษณ์นั้นก่อนใช้จริง
- ใช้โลโก้ CYRVOR / CherryWAF จากไฟล์ที่ให้ตามความจำเป็น ไม่วาดโลโก้ใหม่ ไม่เปลี่ยนชื่อแบรนด์ และไม่แทนด้วยโล่ทั่วไป
- ไม่ยัด Cherry ซ้ำทุกการ์ด: หน้า Home ใช้ hero หลัก 1 จุด, chibi ใน assistant card 1 จุด และ avatar ขนาดเล็กได้
- Nova ผมขาวและ Sienna ผมน้ำตาลเป็นตัวละครอื่น ใช้เสริมเฉพาะจุดที่มีหน้าที่ ไม่เปลี่ยนทุกคนให้กลายเป็น Cherry
- ไม่มีภาพโปสเตอร์ทั้งใบที่แปะลงทุกกล่อง ไม่มีภาพยืดผิดสัดส่วน และไม่ใช้ emoji แทนงาน illustration

## 4. ขอบเขต UI และ browser shell
ทำส่วนเหล่านี้ให้เป็น UI จริงตามสถาปัตยกรรมเดิม:
- Sidebar: โลโก้, Home, My Workspace, Bookmarks, History, Downloads, AI Assist, Notes & Clip, Settings
- Workspace switcher: Personal / workspace ที่มีอยู่จริง พร้อมเพิ่ม เปลี่ยนชื่อ และสลับตามความสามารถเดิม
- Tab strip: active / inactive / hover / close / new tab และ window controls เดิม
- Toolbar: back / forward / reload / address / bookmark / tools / profile ตามของเดิม
- Home / New Tab: พื้นที่หลักสำหรับกราฟิกเต็มรูปแบบ
- AI panel / Settings: ใช้ภาษา visual เดียวกัน แต่รักษาความอ่านง่าย

ขนาดตั้งต้นสำหรับจอเดสก์ท็อป: sidebar 232–248px, tab strip 40–44px, toolbar 52–56px, ระยะห่าง 16–24px, มุมโค้ง 12–18px ปรับให้เข้ากับหน้าต่างจริง

ห้ามจำลอง browser chrome ซ้อนอีกชุดใน content pane ถ้าแอปมี native chrome ของตัวเองอยู่แล้ว
ห้ามให้ตัวละครบัง address bar, ปุ่ม, พื้นที่ drag window หรือเนื้อหาเว็บ ตัวละครต้องอยู่ใน layout ไม่ใช่ overlay ที่ดักคลิก

## 5. แยกหน้า Home ออกจากเว็บไซต์ภายนอก
- หน้า Home / New Tab เป็นหน้าของแอป ใช้ hero และการ์ดอนิเมะได้เต็มรูปแบบ
- เมื่อเปิด YouTube หรือเว็บไซต์ภายนอก คงพื้นที่แสดงเว็บและการโต้ตอบเดิมไว้
- ภาพที่ดูเหมือนมีตัวละครอยู่ข้าง YouTube เป็นแรงบันดาลใจด้าน visual ไม่ใช่คำสั่งให้แก้ DOM ของ YouTube
- ไม่ inject กราฟิกลงเว็บภายนอก ไม่ปิดทับวิดีโอ โฆษณา ปุ่ม หรือ form ของเว็บไซต์
- คง engine / native web content view ของ repo และอัปเดต bounds ให้สัมพันธ์กับ sidebar / toolbar / panel
- ห้ามแก้ปัญหาด้วยการนำทุก URL ไปใส่ iframe แล้วอ้างว่าเป็น browser ที่รองรับทุกเว็บ
- ห้ามลดความปลอดภัย เช่น ปิด web security, เปิด privileged Node APIs ให้ remote content หรือขยาย IPC โดยไม่จำเป็น
- งานตกแต่งไม่ควรเปลี่ยน permission policy, session partition, certificate handling หรือพฤติกรรม security เดิม

## 6. โครงหน้า Home / New Tab
ส่วนบน:
- Hero เป็นภาพอนิเมะ Cherry ผมสั้นใน workspace ทางขวาและพื้นที่ข้อความที่อ่านง่ายทางซ้าย
- เก็บศีรษะและใบหน้าครบตามสัดส่วน ห้ามตัดยอดผมหรือขยายจนบดบัง search
- Headline แบบ DOM: “ค้นพบโลกที่กว้างกว่าเดิม ไปกับ cherry.”
- Supporting text: “พื้นที่สำหรับการค้นหา ไอเดีย และสิ่งที่คุณสนใจ”
- Search / URL field ใช้งานจริง มี label, focus state, Enter และ validation
- Shortcut chips สำหรับเว็บที่ผู้ใช้ตั้งค่าไว้ และปุ่มเพิ่ม shortcut

ส่วนล่าง:
- Featured / Continue browsing: ใช้รายการจริงหรือข้อมูลที่ผู้ใช้บันทึกไว้
- For You: รายการบันทึก/รายการแนะนำที่ระบุที่มา ถ้ายังไม่มีระบบแนะนำให้ใช้ชื่อที่ไม่ทำให้เข้าใจว่าเป็น personalized AI จริง
- Quick actions: เปิด AI Assist, Notes & Clip, Bookmarks และฟังก์ชันเดิมที่มีอยู่
- ด้านขวา: การ์ด CYRVOR ขนาดพอดี, assistant / tip card, recent workspaces
- ความหนาแน่นของหน้าให้ใกล้ภาพ target แต่ไม่ทำตัวหนังสือเล็กเพื่อยัดทุกอย่าง
- ไม่มีผู้ติดตาม ยอดวิว ยอดไลก์ สถานะ online หรือ security score ที่แต่งขึ้นแล้วแสดงเป็นข้อมูลจริง

## 7. งานภาพและ assets
- ค้นหา asset ต้นฉบับใน repo ก่อน โดยเฉพาะภาพ Cherry ผมสั้น โลโก้ และภาพพื้นหลัง
- ชุด reference นี้เป็นภาพเต็ม ยังไม่ใช่ชุด PNG โปร่งใสแยกชิ้น อย่าอ้างว่าพร้อมใช้เป็น cutout
- ห้ามใช้ screenshot เต็มหน้าเป็น background แล้ววางปุ่มล่องหนทับ เพราะจะไม่ใช่ UI ที่แก้ไขหรือรองรับหลายขนาดได้จริง
- ห้ามตัดข้อความ ปุ่ม หรือ toolbar จาก mockup มาเป็น bitmap UI ข้อความและ control ต้องเป็น DOM/native component
- ตัดเฉพาะ illustration ที่สะอาดได้และเก็บสัดส่วน ถ้าตัดแล้วติดปุ่มหรือข้อความ ให้หา source art ที่เหมาะสมกว่า
- ถ้ามีเครื่องมือแก้ภาพใน environment ให้ใช้สร้าง asset แยกชิ้นที่รักษาตัวละครตาม reference ไม่ใช่สร้าง mockup เพิ่มแทน coding
- ถ้าไม่มีเครื่องมือ/asset ที่พอ ให้ใช้ภาพที่มีได้อย่างตรงไปตรงมา ระบุรายการ artwork ที่ขาด และทำ UI integration ต่อ ห้ามใส่กล่องว่างแล้วอ้างว่ากราฟิกครบ
- จัดเก็บ production asset ตาม convention ของ repo แยกจาก reference และบันทึก source/usage ใน asset manifest
- เสนอชื่อไฟล์ตามหน้าที่ เช่น cherry-hero.webp, cherry-assistant.webp, workspace-background.webp, cyrvor-brand.webp
- ใช้ SVG สำหรับไอคอนควบคุมและรูปทรงพื้นฐานได้ แต่ห้ามใช้วาดทับตัวละครอนิเมะเป็นภาพเส้นหยาบแทน artwork
- ไอคอนตกแต่งไม่มีหน้าที่ให้ใช้ alt ว่าง; รูปที่สื่อความหมายต้องมี accessible name ที่เหมาะสม
- อย่าคัดลอก poster หรือเพลงเป็นข้อความเนื้อหายาวจากภาพ reference

## 8. พฤติกรรมที่ต้องใช้งานได้
- เมนูหลักเปิดหน้าจริง ไม่ใช่ทุกปุ่มแสดง toast เดียวกัน
- Tabs / navigation / URL / refresh / browser content ยังทำงานหลังเปลี่ยน theme
- Search แยกคำค้นกับ URL โดยใช้ logic เดิม และส่งไปยัง search provider ที่ตั้งค่า ไม่บังคับเปลี่ยน provider
- Workspace / bookmarks / notes / settings ใช้ data source และ persistence เดิม
- Shortcut เพิ่ม แก้ไข ลบได้ พร้อม validation และ empty state
- AI Assist เปิด panel จริง เชื่อม service เดิม; ถ้ายังไม่มี service ให้แสดงสถานะยังไม่เชื่อมต่อ ไม่แสดงคำตอบสมมติเป็น AI จริง
- ไม่ส่ง URL, browsing history, เนื้อหาเว็บ หรือภาพหน้าจอออกไปหา AI โดยอัตโนมัติเพียงเพราะผู้ใช้เปิด panel
- Translation / Screenshot / Clip ต้องเชื่อม implementation เดิม; ถ้ายังไม่รองรับให้ disabled พร้อมเหตุผล ไม่แสร้งว่าสำเร็จ
- เพิ่ม setting แสดง/ซ่อน mascot และลด motion เฉพาะเมื่อทำเข้ากับ settings store เดิมได้
- Loading / error / empty / selected / disabled / hover / keyboard focus ต้องถูกออกแบบ ไม่ใช่ทำเฉพาะสถานะสวยที่สุด

## 9. Design tokens และ responsive
ใช้ design-tokens.reference.css เป็นค่าเริ่มต้นได้ แต่ integrate เข้า theme เดิม ห้าม override ทุกหน้าแบบ global โดยไม่ตรวจ

สีพื้นหลัง: #061225
สี surface: #0B1C36
สี surface ยกขึ้น: #10284B
สี accent: #367BFF
สี cyan: #60D6FF
สีข้อความหลัก: #F2F7FF
สีข้อความรอง: #AEC0DC

เลือกฟอนต์ไทยที่อ่านง่ายจากระบบเดิม ใช้ตัวอักษรไทยจริง ไม่วาดเป็นภาพ ขนาด body ประมาณ 14–16px และจัด headline ตามความกว้าง

- ที่ 1440×900 และ 1920×1080 ให้ภาพรวมใกล้ reference
- ที่ 1024×768 ยุบ sidebar / เรียงคอลัมน์ใหม่ ไม่บีบ search และตัวหนังสือจนใช้ไม่ได้
- ถ้า repo รองรับ mobile web อยู่แล้ว ให้รักษาความสามารถนั้นโดยใช้ drawer และเรียง single column
- ไม่ทำ horizontal overflow แบบไม่ตั้งใจ ไม่ใช้ absolute positioning กับ layout ทั้งหน้า
- กราฟิกไม่ intercept pointer; ปุ่มมี hit target พอดีและ focus ring ชัดเจน
- ใช้ motion เล็กน้อย ไม่ทำแสงกระพริบหรือ animation หนักตลอดเวลา และเคารพ prefers-reduced-motion

## 10. ลำดับลงมือทำ
1. ตรวจ repo และบันทึก baseline ของหน้าจอ/ฟังก์ชันเดิม
2. ลง theme tokens และปรับ shell/sidebar/tabs/toolbar ให้เข้าชุด โดยไม่ทำให้ navigation เสีย
3. ทำ Home / New Tab พร้อม artwork จริงและแยก component ที่ดูแลต่อได้
4. เชื่อม workspace, shortcut, settings และ AI panel ตามระบบเดิม
5. ทดสอบการใช้งานด้วย keyboard และการเปิดเว็บภายนอก
6. รัน lint/typecheck/tests/build ที่มีอยู่จริง อย่าสมมติชื่อคำสั่งหรือรายงานว่าผ่านโดยไม่ได้รัน
7. เปิดแอปที่รันจริงและถ่าย screenshot เปรียบเทียบกับ target ที่ขนาดหน้าต่างตรงกัน ใช้เครื่องมือที่ environment มี
8. แก้ความต่างเรื่องสัดส่วน spacing artwork typography และการทับ control แล้วตรวจซ้ำ

## 11. เกณฑ์ส่งมอบ
- มีการแก้ source ในแอปเดิม และอธิบายเส้นทางไฟล์ที่เปลี่ยน
- หน้า Home มีภาพอนิเมะตามทิศทาง ไม่ใช่ dashboard ทั่วไปที่เพิ่ม avatar รูปเดียว
- Cherry ผมสั้น ไม่มีผลเชอร์รี โล่ กุญแจ หรือแม่กุญแจในองค์ประกอบที่เพิ่ม/ปรับ
- หน้าเว็บภายนอกยังใช้งานได้ ปุ่มและ tab เดิมไม่หาย
- มีภาพหน้าจอจากแอปที่รันจริงเมื่อ environment รองรับ ไม่ใช้ generated mockup อ้างเป็นภาพ implementation
- ระบุคำสั่งที่รันพร้อมผลจริง และแยก “ผ่าน”, “ล้มเหลว” และ “ไม่ได้ทดสอบ” ให้ชัด
- บอกข้อจำกัดที่เหลือ เช่น asset ที่ยังไม่มีหรือ AI backend ที่ยังไม่เชื่อมต่อ โดยไม่อ้างว่าทำเสร็จทั้งหมด
- ส่งสรุปภาษาไทยสั้น ๆ: สิ่งที่เปลี่ยน, วิธีรัน, ผลทดสอบ, screenshot path, ข้อจำกัด

เริ่มทำ implementation ใน repo ปัจจุบันได้เลย ไม่หยุดที่ moodboard, wireframe, แผน หรือภาพ mockup เพิ่ม
