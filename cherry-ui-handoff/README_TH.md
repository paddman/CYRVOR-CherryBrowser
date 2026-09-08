# Cherry Browser: Codex UX/UI handoff

แพ็กนี้เป็นภาพอ้างอิง + สเปกสำหรับส่งงานให้ Codex ไม่ใช่ source แอปหรือ build ที่แก้เสร็จแล้ว
ไม่มีการเข้าถึงหรือแก้ repository ของผู้ใช้จากการสร้างแพ็กนี้

## ใช้งาน
แตก ZIP ให้โฟลเดอร์ cherry-ui-handoff อยู่ที่ root ของโปรเจกต์ Cherry Browser เดิม แล้วเปิด terminal ที่ root ของโปรเจกต์นั้น

```sh
codex --image "cherry-ui-handoff/reference/target-home.png" "อ่าน cherry-ui-handoff/CODEX_TASK_TH.md และภาพ reference ทั้งหมด แล้วลงมือแก้ UX/UI แอปเดิมตามสเปก รักษาฟังก์ชันเดิม ใช้ Cherry ผมสั้น ทดสอบและส่งภาพหน้าจอจากแอปจริง ไม่ต้องสร้าง mockup เพิ่ม"
```

ถ้าเปิด session ของ Codex ในโปรเจกต์ไว้แล้ว ให้วางข้อความนี้:

```text
อ่าน cherry-ui-handoff/CODEX_TASK_TH.md และเปิดดูภาพใน cherry-ui-handoff/reference ก่อนเริ่ม
ใช้ target-home.png เป็นเป้าหมาย Home / New Tab และ current-app.png เป็น baseline
ลงมือแก้ source code ของแอปเดิมตามสเปก รักษา browser engine, tabs, navigation และ data เดิม
Cherry ต้องผมสั้น ห้ามใช้ผลเชอร์รี โล่ กุญแจ หรือแม่กุญแจ
นี่คืองาน implementation ไม่ใช่ขอรูป mockup เพิ่ม
ทำต่อจนมี UI จริง ทดสอบ และส่งภาพหน้าจอจริง พร้อมแจ้งสิ่งที่ยังไม่ได้ทดสอบ
```

## สิ่งที่อยู่ในแพ็ก
- CODEX_TASK_TH.md: ขอบเขต UI, งาน assets, การรักษาฟังก์ชันเดิม และเกณฑ์ตรวจรับ
- reference/: ภาพที่ใช้ประกอบการตัดสินใจทาง visual
- design-tokens.reference.css: ค่า theme เริ่มต้นสำหรับนำไปปรับเข้ากับระบบเดิม
- ASSET_NOTES.md: ลำดับภาพและข้อควรระวังในการใช้ภาพเก่า
- manifest.json: รายชื่อและ checksum ของภาพอ้างอิง

อย่าให้ Codex ลบหรือย้ายโค้ดเดิมเพื่อสร้างเว็บใหม่ที่ดูคล้ายภาพแต่ไม่ใช่แอปที่ใช้งานอยู่
