# งานพัฒนา: Cherry Browser Anime Redesign

## 1. ผลลัพธ์ที่ต้องส่ง

แก้แอป Cherry Browser ที่มีอยู่ให้เป็น desktop web browser ที่ใช้งานจริง โดยให้กรอบแอปและหน้า New Tab ใกล้เคียง `reference/01-newtab-target.png`
ต้องปรับทั้ง UI และกราฟิก ไม่ใช่เปลี่ยนสี CSS อย่างเดียว และไม่ใช่สร้างหน้าเว็บ marketing หรือ SOC dashboard แทน
ส่งโค้ดที่ผสานเข้าระบบเดิม ภาพ runtime ที่ผ่านการตรวจ ผลทดสอบ และ screenshot จากแอปที่รันจริง
อย่าอ้างว่าได้แก้ต้นฉบับหรือทดสอบแล้วหากยังไม่ได้ทำ

ลำดับแหล่งความจริง: ข้อกำหนดข้อความในชุดนี้ > ภาพ target หลัก > ภาพฟีเจอร์ > ภาพแอปเดิม
ภาพประกอบบางใบมีข้อผิดพลาดเรื่องโลโก้ สัญลักษณ์ และตัวอักษร จึงไม่ต้องลอกข้อผิดพลาดเหล่านั้น

## 2. ตรวจโปรเจกต์ก่อนแก้

อ่าน AGENTS.md ที่มีผลกับไฟล์ที่จะเปลี่ยน ตรวจ git status, package manifests, lockfile, entry points, renderer, preload/bridge และระบบเก็บข้อมูล
ยืนยันจาก repository ว่าเป็น Electron, Tauri, WebView2 หรือเทคโนโลยีอื่น อย่าเดาจากภาพ
ค้นหาระบบ tabs, navigation, downloads, history, bookmarks และ settings ที่มีอยู่แล้วเพื่อใช้ต่อ
บันทึกวิธีรันที่มีอยู่และพฤติกรรม baseline ก่อนเริ่มถ้าสภาพแวดล้อมรองรับ
รักษาการแก้ที่ผู้ใช้ยังไม่ commit ห้าม reset, clean, ล้างข้อมูล browser profile หรือเขียนทับ configuration ของผู้ใช้
ไม่เปลี่ยน stack ทั้งโครงการ ไม่ย้ายไป React หรือ TypeScript เพียงเพราะความถนัด หากเดิมเป็น HTML/CSS/JS ให้ปรับในระบบนั้นได้
เมื่อจำเป็นต้องเพิ่ม dependency ให้เพิ่มเท่าที่จำเป็น ตรวจเวอร์ชันที่เข้ากันได้และใช้ package manager เดิม
การอัปเดต runtime ที่จำเป็นด้านความปลอดภัยให้แยกการเปลี่ยนแปลงและทดสอบ migration ไม่ให้การทำธีมกลายเป็นการรื้อระบบทั้งหมดโดยไม่แจ้ง

## 3. กฎแบรนด์ที่ต้องรักษา

Cherry เป็นชื่อแบรนด์และตัวละครอนิเมะผมสีน้ำเงิน ไม่ใช่ผลไม้
ห้ามผลเชอร์รี พวงเชอร์รี ก้าน ใบ หรือ emoji ผลเชอร์รี ในส่วนที่แอปเป็นผู้สร้าง
ห้ามโล่ กุญแจ และแม่กุญแจ รวมถึงตราบนเสื้อ เครื่องประดับ favicon loading indicator และกราฟิกตกแต่ง
ข้อห้ามนี้ใช้กับ UI และ assets ของเรา ไม่ใช่ข้ออ้างให้แก้ DOM หรือซ่อนสัญลักษณ์บนเว็บไซต์ภายนอกที่ผู้ใช้เปิด
ใช้ `cherry.` และคำกำกับ `BROWSER` เป็น wordmark หรือใช้โลโก้เรขาคณิตที่ยืนยันแล้วจากโปรเจกต์ ห้ามออกแบบผลไม้ใหม่
page information ใช้สัญลักษณ์ข้อมูลหรือ sliders โดยไม่ลดการตรวจ certificate หรือ permission จริง
ตัวละครและชุดต้องคงอัตลักษณ์ตามภาพ ไม่สุ่มชื่อ ไม่สลับสีผม และไม่ทำ Cherry ซ้ำทุกการ์ด
การตั้งชื่อไฟล์ตัวละครอื่นให้ตรวจจาก character-board ที่ให้ไว้ ไม่ตั้งชื่อใหม่จากการคาดเดา

## 4. โครงหน้าที่ต้องทำ

อ้างอิง desktop ที่ 1920×1080, 1672×941, 1440×900 และ 1366×768
ขนาดต่อไปนี้เป็น logical CSS pixels ปรับตาม runtime และพื้นที่ใช้งานจริง ไม่ใช่ย่อภาพรวมทั้งหน้า

### Browser shell

sidebar เริ่มที่ประมาณ 236px ย่อเป็น 208px ในจอแคบและมี compact mode 72px
ด้านบนมี tab strip ประมาณ 42px และ toolbar/address bar ประมาณ 54px
tab strip มีชื่อ favicon สถานะ loading ปุ่มปิด เพิ่มแท็บ pin/mute ตามความสามารถ และ overflow เมื่อแท็บมาก
address bar มี back/forward/reload-stop, URL/search, bookmark, page information และเมนู
window controls และพื้นที่ลากหน้าต่างต้องทำงาน ปุ่มและช่องกรอกห้ามอยู่ใน drag region
sidebar มี หน้าแรก, Workspace, บุ๊กมาร์ก, ประวัติ, ดาวน์โหลด, AI, โน้ต และตั้งค่า
ห้ามมีเมนูหลักแบบ Incidents, Threat Map หรือ KPI สำหรับ SOC มาแทน browser controls
มี right panel สำหรับ AI/โน้ต/ดาวน์โหลด เปิดปิดได้ และเมื่อเปิดให้ปรับ viewport จริง ไม่วางทับหน้าเว็บด้วยภาพปลอม

### หน้า New Tab

หน้าแท็บใหม่แยกจากหน้าเว็บภายนอกอย่างชัดเจนและเลื่อนเฉพาะ content ของตัวเอง
hero สูงประมาณ 300–380px ตามความสูงหน้าต่าง มีภาพ Cherry หนึ่งตัวเด่นด้านซ้าย 40–46% และข้อความ/ช่องค้นหาทางขวา
ใช้ข้อความ “Browse smarter. Create faster.” หรือข้อความภาษาไทยที่อ่านเป็นธรรมชาติ
ข้อความ ปุ่ม และช่องกรอกต้องเป็น DOM จริง ไม่ฝังในภาพ
ช่องค้นหาต้องส่งไป search engine ที่ตั้งค่าไว้หรือเปิด URL ในแท็บปัจจุบันตามเจตนาที่ผู้ใช้กรอก
มี quick shortcuts, อ่านต่อ, แท็บล่าสุด, AI actions, workspaces ที่ปักหมุด และ team banner ขนาดพอดี
ข้อมูลประวัติหรือแท็บต้องมาจากระบบจริง ผู้ใช้ใหม่ให้มี empty state ไม่สร้างประวัติปลอม
มี Theme Studio ให้เลือกธีม/ตัวละคร/ความเข้มแสง/ความเข้มภาพ ลดภาพตกแต่ง และเปลี่ยนพื้นหลังได้
ห้ามให้ hero ยาวจนช่องค้นหาและ shortcuts หลุด viewport ของ 1366×768

### เมื่อเปิดเว็บไซต์จริง

กราฟิกจัดเต็มอยู่ที่ New Tab และ internal pages เป็นหลัก
เมื่อเปิดเว็บภายนอกคงธีมเฉพาะ sidebar/tab strip/toolbar และให้เนื้อหาเว็บไซต์อ่านได้เต็มพื้นที่
ห้ามแทรกตัวละครหรือเปลี่ยน background ของทุกเว็บไซต์โดยอัตโนมัติ
ไม่ inject CSS ไปแก้ branding ของเว็บปลายทาง ไม่ลดขนาดหน้าเว็บเพื่อให้โปสเตอร์มีพื้นที่

## 5. รูปลักษณ์และกราฟิก

ใช้ navy, electric blue, cyan และ violet แต้มเฉพาะจุด พื้นผิวอ่านง่าย ไม่เรืองแสงทุกองค์ประกอบ
ตั้งต้นด้วย `styles/cherry-theme.css` แต่ปรับเข้าชื่อ component และ design system ที่มีอยู่ ไม่สร้างระบบคู่ขนาน
สีหลัก: background #071122, panel #0E1C35, elevated #142746, blue #2F6BFF, cyan #45D9FF, violet #9C7BFF
text #F2F6FF, muted #A9B9D6 ใช้ solid surface รองข้อความบนภาพและตรวจ contrast จริง
spacing ใช้ 4/8/12/16/24/32px; card radius 14–18px; border บาง; ปุ่มหลักสูงอย่างน้อย 40px
ใช้ฟอนต์ระบบหรือฟอนต์ที่โปรเจกต์มีอยู่และรองรับภาษาไทย ไม่โหลดฟอนต์จากภายนอกโดยไม่จำเป็น
icons ใช้ชุดเดียวกันและมี label/tooltip ไม่มี emoji แทน UI icon
จัดกราฟิกตาม `GRAPHICS_SPEC_TH.md` และ `asset-plan.json`
อย่าแค่ใช้ gradient แล้วบอกว่างานอนิเมะเสร็จ ต้องมี character art ที่สะอาด ฉากที่จัดองค์ประกอบดี และการ์ดที่มี hierarchy ชัด

## 6. ฟังก์ชัน browser ที่ต้องใช้งานได้

### พื้นฐานและการเก็บข้อมูล

- เปิดเว็บจริงในตัวแอป, back/forward, reload/stop, address bar sync กับ URL หลัง redirect และ title/favicon sync ตามแท็บที่ active
- เพิ่ม/ปิด/สลับ/เรียงแท็บ, reopen closed tab, pin/mute เมื่อรองรับ, จัดการหลายแท็บและ overflow
- บุ๊กมาร์ก เพิ่ม/ลบ/แก้ไข/โฟลเดอร์, history ค้นหาและลบตามช่วง, recent tabs และ session restore
- downloads มี progress จริง สถานะชื่อไฟล์และปลายทาง เปิดโฟลเดอร์ และ pause/resume/cancel เฉพาะกรณีที่ runtime และ server รองรับ
- ลิงก์จากเว็บควรเปิดภายใน tabs ตามเจตนา target=_blank โดยผ่าน navigation policy ไม่ยิง external browser โดยอัตโนมัติทุกครั้ง
- persistent storage มี schema/version และวิธี migration ไม่เก็บเฉพาะ array ใน renderer แล้วหายเมื่อปิดแอป
- notes/clip เก็บข้อความและ source URL; reader mode ใช้เนื้อหาที่สกัดและ sanitize แล้ว ไม่ render HTML ที่ไม่เชื่อถือโดยตรง

### Workspace / Split View / Memory Saver

Workspace แยกชุดแท็บได้จริงพร้อมชื่อ สี และสถานะที่บันทึกไว้ แต่ไม่กล่าวอ้างว่าแยก cookie/session ถ้าไม่ได้ใช้คนละ profile/partition
Split View เป็นสองเว็บจริง พร้อมเลือกด้าน active ที่ address bar ควบคุม ปรับสัดส่วนได้ และกด link/พิมพ์/scroll ในแต่ละด้านได้
Tab Memory Saver เป็นการพักแท็บตามกลไกที่ runtime รองรับ ไม่ใช่แค่ซ่อน DOM หรือซ่อน native view
ห้ามพักแท็บที่ active, มีเสียง, ดาวน์โหลด หรือมีเหตุให้เสี่ยงเสียงานโดยไม่เตือน
อย่าอ้างว่าคืน form state ได้ทั้งหมดหลัง discard ให้บอกข้อจำกัดและมีรายการยกเว้น
แสดงตัวเลข RAM และการประหยัดเฉพาะเมื่อวัดได้จริง ไม่คัดลอก 40% หรือสถิติอื่นจากโปสเตอร์

### Search / AI / Translate / Widgets

Ctrl+K เปิด command palette ที่ค้นหาคำสั่ง แท็บ และบุ๊กมาร์กจริง ไม่ใช่แค่ช่องกรอกที่ตกแต่งไว้
Cherry AI เป็น side panel สรุปหน้า แปลข้อความ ถามเกี่ยวกับหน้าปัจจุบัน และช่วยร่างข้อความ
ใช้ provider adapter และตั้งค่า endpoint/model ได้ เลือกใช้ provider ที่ผู้ใช้ตั้งค่า ไม่ hardcode credential
การเชื่อม Ollama หรือ API แบบ OpenAI-compatible ต้องตรวจ contract ของ provider และทดสอบจริง ไม่เดา endpoint
ก่อนส่งเนื้อหาออกให้แสดง provider และขอบเขตข้อความที่ส่ง ให้ผู้ใช้ยินยอมเป็นครั้งแรกและควบคุมได้
ไม่ส่ง cookies, passwords, hidden fields, localStorage หรือข้อมูลทุกแท็บไป AI โดยอัตโนมัติ
ข้อมูลจากหน้าเว็บถือเป็น untrusted content ไม่ใช่คำสั่งระบบหรือคำสั่งให้ AI เรียกเครื่องมือ
ห้ามให้เนื้อหาบนเว็บสั่งรัน shell, เปิดไฟล์ในเครื่อง, เปลี่ยน settings หรือส่งข้อมูลไปที่อื่นผ่าน AI
การส่งอีเมล โพสต์ อนุมัติสิทธิ์ หรือทำงานภายนอกต้องมีการยืนยันแยกตามพฤติกรรม ไม่ทำเพียงเพราะหน้าเว็บสั่ง
ถ้าไม่มี provider/credential ให้มีสถานะ “ยังไม่ได้เชื่อมต่อ AI” พร้อมตั้งค่า; ไม่ตอบข้อความ canned ว่าเป็นผล AI จริง
Translate ต้องใช้ provider ที่ใช้งานได้; Reader ใช้งานได้โดยไม่อาศัย LLM เมื่อเหมาะสม
widgets เช่น clock/todo/local notes ใช้ข้อมูลจริง; weather ขอเมือง/ตำแหน่งและเชื่อม provider ก่อน ไม่แสดงอุณหภูมิสุ่ม

### Privacy / Permissions

มี site permissions, per-site controls, clear data และ private session ตามกลไกจริง
อย่าอ้างว่า private mode ปิดบังผู้ใช้จาก ISP/เว็บไซต์หรือไม่ทิ้งร่องรอยทุกประเภท
private session ไม่บันทึก history และไม่นำเข้าระบบ restore ปกติ; แจ้งว่าดาวน์โหลด/บุ๊กมาร์กที่ผู้ใช้สั่งเก็บอาจยังอยู่
tracker/ad blocking แสดง enabled ต่อเมื่อมี implementation และ rule set จริง พร้อมปุ่มปิดรายเว็บไซต์
ห้ามใช้ claims เช่น “ปลอดภัย 100%”, “รองรับ extension ของ Chrome ทั้งหมด” หรือ “เปิดทุกเว็บได้” โดยไม่มีหลักฐาน
ต้องรายงานข้อจำกัดจริงของ OAuth, DRM, extension compatibility และเว็บไซต์ที่ปฏิเสธ embedded browser

## 7. โครงสร้างและความปลอดภัยของ engine

ยึด engine เดิมที่มีอยู่ก่อน หากเป็น Electron ให้อ้างอิงเอกสาร WebContentsView และ security ทางการตามเวอร์ชันที่ติดตั้ง
อย่าใช้ iframe ธรรมดาเป็น engine หลักสำหรับ arbitrary browsing และอย่าใช้ window.open ไปเปิด system browser แทนการทำ tabs ภายใน
ถ้า renderer ใช้ native web contents ให้ main process ควบคุม lifecycle และ navigation; shell มีสิทธิ์เท่าที่จำเป็น
remote content: nodeIntegration=false, contextIsolation=true, sandbox=true, webSecurity=true เว้นแต่มีเหตุผลเฉพาะที่ตรวจสอบได้และไม่ลดหลักประกันพื้นฐาน
อย่าให้ remote pages ใช้ privileged preload ของ browser shell หรือเข้าถึง bridge สำหรับอ่านไฟล์/settings
IPC ต้องมี allowlist, validate sender/frame และ schema; ห้าม expose ipcRenderer, shell, fs หรือ generic execute ผ่าน bridge
URL/navigation ต้อง parse และตรวจ scheme; arbitrary navigation อนุญาต http/https เป็นฐาน; scheme อื่นใช้ policy และ user gesture
ไม่เปิด file://, javascript:, external protocol หรือ executable จาก input ที่ไม่เชื่อถือแบบอัตโนมัติ
ไม่ปิด certificate validation/CORS/CSP เพื่อทำให้เว็บ “ดูเหมือนใช้ได้”; ถ้าเป็นข้อจำกัดจริงให้รายงาน
default deny สำหรับสิทธิ์ที่ไม่รู้จัก; camera/microphone/notifications/geolocation ขอเป็นราย origin ตาม user action
ใช้ CSP แยกระหว่าง shell/internal pages และเว็บภายนอก; sanitize titles/URLs/notes/reader output และห้ามต่อ innerHTML จาก input ที่ไม่เชื่อถือ
secrets เก็บในระบบที่เหมาะสม เช่น OS credential facility ผ่าน process ที่เชื่อถือ ไม่ฝังไว้ใน frontend bundle/localStorage

native view bounds ต้องเปลี่ยนตาม sidebar, toolbar, split view, right panel, fullscreen และ window resize
อย่าคิดว่า CSS z-index จะวาง modal ทับ native WebContentsView ได้เสมอ ต้องจัด composition/lifecycle จริงและทดสอบการคลิก
เมื่อ modal หรือ command palette เปิดต้องจัด native views ให้ไม่บังและไม่รับคลิกทะลุ; ทางเลือกขึ้นกับ architecture เดิม
ปิด/ปล่อย webContents เมื่อ tab/window ถูกทำลายตาม ownership ของ runtime เพื่อป้องกัน resource leak
หน่วย bounds, display scale และ screenshot pixels ต้องแยกให้ถูกต้อง โดยเฉพาะ Windows DPI 125% และ 150%

## 8. คีย์บอร์ดและการใช้งาน

รองรับอย่างน้อย Ctrl+L, Ctrl+T, Ctrl+W, Ctrl+Shift+T, Ctrl+Tab/Ctrl+Shift+Tab, Ctrl+R และ Ctrl+K
shortcut ต้องทำงานเมื่อ focus อยู่ในเว็บจริง ไม่ใช่เฉพาะ New Tab ที่เป็น renderer ของ shell
มี focus ring, keyboard navigation, labels สำหรับ icon buttons และ tooltip ที่ไม่จำเป็นต้องใช้เมาส์อย่างเดียว
menu/modal ปิดด้วย Escape, trap focus เมื่อเหมาะสม และคืน focus หลังปิด
แบ่ง contrast ตรวจทั้งธีมเข้มและโหมดลดกราฟิก ข้อความสำคัญห้ามอยู่บนแสงภาพที่อ่านไม่ออก

## 9. ลำดับลงมือทำ

1. ตรวจ repository และ baseline; สรุปผลสั้น ๆ และไฟล์หลักที่จะเปลี่ยน
2. จัด theme tokens และ browser shell โดยรักษา navigation เดิมให้ทำงาน
3. เตรียมกราฟิกจาก sources ตามแผนและตรวจภาพ แล้วทำ New Tab ตาม target
4. เชื่อม tabs/bookmarks/history/downloads/workspaces และ panels เข้ากับ storage/engine
5. เติม Split View, command palette, theme controls, memory saving และ provider adapters ตามความสามารถจริง
6. รัน lint/typecheck/tests/build ด้วย scripts ของ repo และแก้ regression
7. เปิดแอป ถ่าย screenshot ตรวจคู่กับ target และปรับซ้ำอย่างน้อยหนึ่งรอบเมื่อพบความต่างที่แก้ได้
8. ส่งผลตามเกณฑ์ตรวจรับ และระบุส่วนที่ยังต้องมี credential/runtime support อย่างตรงไปตรงมา

ให้ทำต่อหลังแผนได้เลย ไม่ต้องขออนุมัติทุกส่วนที่ย้อนกลับได้และอยู่ในขอบเขต
หากเครื่องมือสร้างภาพ/ลบฉากหลัง/provider ภายนอกไม่พร้อม ให้ทำส่วนอื่นต่อและรายงาน asset ที่ยังขาด ห้ามอ้างว่าได้สร้างภาพใหม่แล้ว
ถ้าสภาพแวดล้อมไม่สามารถเปิดแอป native ได้ ให้แยกผลตรวจ shell กับผลที่ต้องทดสอบในเครื่องจริง ไม่อ้างว่าทดสอบ native navigation แล้ว

## 10. สิ่งส่งมอบ

โค้ดใน repository เดิม, runtime assets ที่ผ่านการตรวจ, asset mapping, screenshot ก่อน/หลังที่ไม่เปิดข้อมูลส่วนตัว
วิธีรัน/build ตาม scripts ที่ตรวจแล้ว, รายการ tests พร้อมผลและข้อจำกัด
สรุปเป็นภาษาไทย: สิ่งที่แก้, สิ่งที่ใช้งานจริง, สิ่งที่ยังไม่รองรับ, วิธีตั้งค่า provider และชื่อไฟล์สำคัญ
ไม่ส่งเพียงภาพ mockup หรือรายการคำแนะนำหลังจากได้รับสิทธิ์ให้แก้โค้ดแล้ว
