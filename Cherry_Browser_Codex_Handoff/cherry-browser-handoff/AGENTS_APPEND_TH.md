# ข้อกำหนดเฉพาะโปรเจกต์ Cherry Browser

เอกสารนี้เป็นข้อความสำหรับผสานกับ AGENTS.md ที่มีอยู่ ไม่ใช่ไฟล์ให้เขียนทับกฎเดิมทั้งไฟล์
ตรวจ scope และคำสั่งที่มีผลกับ repository ก่อนแก้ AGENTS.md

- แอปนี้เป็นเว็บเบราว์เซอร์เดสก์ท็อปจริง ไม่ใช่ SOC dashboard หรือ landing page
- Cherry เป็นตัวละครอนิเมะและชื่อแบรนด์ ห้ามใช้ภาพผลเชอร์รี/ก้าน/ใบ/emoji ผลเชอร์รีใน UI และ assets ของแอป
- ห้ามภาพโล่ กุญแจ แม่กุญแจ รวมถึงตราบนชุดและ icons ของแอป แม้มีอยู่ใน reference
- อนุญาตให้ external websites แสดงเนื้อหาของตนเองตามปกติ ข้อห้ามกราฟิกไม่ใช่คำสั่งให้แก้หรือเซ็นเซอร์ DOM ของเว็บปลายทาง
- ยึดตัวละครจริงจากภาพอ้างอิง ไม่สุ่มคน/ชื่อ/สีผม และไม่ทำ Cherry ซ้ำทุกพื้นที่
- ทำ UI เป็น component/DOM จริง ไม่ใช้ poster screenshot ทั้งใบเป็นหน้าแอป
- รักษา engine, framework, package manager, user data และการแก้ที่ยังไม่ commit
- อย่าเพิ่มสิทธิ์ให้ remote content อย่าปิด sandbox/context isolation/certificate checks เพื่อแก้ปัญหาหน้าตา
- ต้องตรวจหน้าตาด้วย screenshot และทดสอบ browser behavior จริงก่อนอ้างว่าสำเร็จ
- ข้อมูลตัวอย่างใช้เฉพาะ test fixture ที่ติดป้ายชัด ไม่แสดงเป็น history/status/AI response จริงของผู้ใช้
- ห้ามฝัง credential หรือส่งเนื้อหาทุกแท็บให้ AI อัตโนมัติ
