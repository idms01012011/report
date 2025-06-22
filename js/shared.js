let drawing = false;

document.addEventListener('DOMContentLoaded', function () {
  initializeCanvases();
  const today = new Date().toISOString().split('T')[0];
  ['openDate', 'closeDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = today;
  });
});

function initializeCanvases() {
  document.querySelectorAll('canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    canvas.addEventListener('mousedown', e => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });
    canvas.addEventListener('mousemove', e => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    });
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
      drawing = true;
    });
    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      if (!drawing) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
      ctx.stroke();
    });
    canvas.addEventListener('touchend', () => drawing = false);
  });
}

function clearCanvas(id) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function generatePDF(type) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.addFileToVFS("THSarabunNew.ttf", thsarabun);
  doc.addFont("THSarabunNew.ttf", "THSarabunNew", "normal");
  doc.setFont("THSarabunNew");
  doc.setFontSize(12);

  const f = id => document.getElementById(id)?.value || '';
  let y = 10;

  try {
    doc.addImage(logoBase64, 'PNG', 10, y, 30, 30); // ซ้ายบน
  } catch (e) {}
  y += 25;
  // หัวเอกสาร
  doc.setFontSize(14);
  doc.setFont("THSarabunNew", "bold"); 
  doc.text("IDMS COMPANY LIMITED", 105, y, { align: 'center' }); y += 7;
  doc.setFont("THSarabunNew", "normal");
  doc.setFontSize(10);
  doc.text("126/101 ,Moo 4 T.Bang Larmung A.Bang Lamung Chon Buri 20150", 105, y, { align: 'center' }); y += 5;
  doc.text("Tel.081-998-8372   E- Mail:IDMS2@hotmail.com", 105, y, { align: 'center' }); y += 10;

  // ชื่อฟอร์ม
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 255); // RGB สีฟ้าเข้ม
  doc.setFont("THSarabunNew", "bold"); 
  doc.text("Service Report", 105, y, { align: 'center' }); 
  y += 10;
  doc.setFont("THSarabunNew", "normal");
  doc.setTextColor(0, 0, 0); // กลับเป็นสีดำสำหรับข้อความถัดไป


  // ข้อมูลทั่วไป
  doc.setFontSize(12);
  const printLine = (label1, val1, label2, val2) => {
    doc.setFont("THSarabunNew", "bold");
    doc.text(`${label1}:`, 20, y);
    doc.setFont("THSarabunNew", "normal");
    doc.text(`${val1}`, 50, y);

    doc.setFont("THSarabunNew", "bold");
    doc.text(`${label2}:`, 120, y);
    doc.setFont("THSarabunNew", "normal");
    doc.text(`${val2}`, 150, y);
    y += 8;
  };

  printLine("เลขที่ / No", f(`${type}No`), "ประเภทงาน ",f("WorkType"));
  printLine("ชื่อโรงพยาบาล", f("hospital"), "วันที่", new Date(f(`${type}Date`)).toLocaleDateString('th-TH'));
  printLine("ชื่อเครื่อง", f("deviceName"), "Brand", f("brand"));
  printLine("รุ่น", f("model"), "S/N", f("serial"));
  doc.setFont("THSarabunNew", "bold");
  doc.text("หมายเลขครุภัณฑ์:", 20, y);
  doc.setFont("THSarabunNew", "normal");
  doc.text(f("assetNo"), 60, y);
  y += 8;

  doc.setFont("THSarabunNew", "bold");
  doc.text("อุปกรณ์ที่ส่งมาด้วย:", 20, y);
  doc.setFont("THSarabunNew", "normal");
  doc.text(f("Accessories"), 60, y);
  y += 10;


  // อาการที่แจ้งเสีย
  doc.setFont("THSarabunNew", "bold");
  doc.text("อาการที่แจ้งเสีย:", 20, y);
  y += 6;
  doc.setFont("THSarabunNew", "normal");
  const issueLines = doc.splitTextToSize(f("issue"), 170);
  doc.text(issueLines, 25, y); y += issueLines.length * 6 + 4;

  // ผลการซ่อม/แก้ไข
  doc.setFont("THSarabunNew", "bold");
  doc.text("ผลการซ่อม/แก้ไข:", 20, y);
  y += 6;
  doc.setFont("THSarabunNew", "normal");
  const solutionLines = doc.splitTextToSize(f("solution"), 170);
  doc.text(solutionLines, 25, y); y += solutionLines.length * 6 + 6;

  doc.setFont("THSarabunNew", "bold");
  doc.text("รับประกัน:", 20, y);
  doc.setFont("THSarabunNew", "normal");
  doc.text(f("guarantee"), 40, y);
  y += 6;
  
  // รูปภาพ
  const img1 = document.getElementById('preview1')?.src;
  const img2 = document.getElementById('preview2')?.src;
  if (img1?.startsWith('data:image')) doc.addImage(img1, 'JPEG', 20, y, 80, 50);
  if (img2?.startsWith('data:image')) doc.addImage(img2, 'JPEG', 110, y, 80, 50);
  y += 60;

  // ลายเซ็นและข้อมูลบริษัท/ลูกค้า
  doc.setFont("THSarabunNew", "bold");
  doc.text("IDMS", 50, y, { align: 'center' });      // กึ่งกลางของลายเซ็นบริษัท
  doc.text("Customer", 150, y, { align: 'center' }); // กึ่งกลางของลายเซ็นลูกค้า
  y += 6;
  doc.setFont("THSarabunNew", "normal");

  try {
    doc.addImage(document.getElementById('signCompany').toDataURL(), 'PNG', 20, y, 60, 30);
    doc.addImage(document.getElementById('signCustomer').toDataURL(), 'PNG', 120, y, 60, 30);
  } catch (e) {}

  y += 35;
  
  // ใช้ข้อมูลจากฟอร์ม หรือข้อมูลเริ่มต้นถ้าไม่มี
  const companyName = f("companyName") || "";
  const companyPhone = f("companyPhone") || "";
  const customerName = f("customerName") || "";
  const customerPhone = f("customerPhone") || "";
  
  doc.text(`ชื่อ ${companyName}`, 50, y, { align: 'center' });
  doc.text(`ชื่อ ${customerName}`, 150, y, { align: 'center' });
  y += 6;
  doc.text(`เบอร์โทรศัพท์ ${companyPhone}`, 50, y, { align: 'center' });
  doc.text(`เบอร์โทรศัพท์ ${customerPhone}`, 150, y, { align: 'center' });

  return doc;
}

function previewPDF(type) {
  if (!validateForm(`${type}WorkForm`)) return;
  const doc = generatePDF(type);
  window.open(doc.output('bloburl'), '_blank');
}

function downloadPDF(type) {
  if (!validateForm(`${type}WorkForm`)) return;
  const doc = generatePDF(type);
  doc.save(`${type}_work.pdf`);
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  return [...form.querySelectorAll('input[required], textarea[required]')].every(input => {
    if (!input.value.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      input.focus();
      return false;
    }
    return true;
  });
}

// แสดงภาพที่เลือกไว้ล่วงหน้าในหน้าเว็บ
function previewImage(inputId, imgId) {
  const input = document.getElementById(inputId);
  const img = document.getElementById(imgId);
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => img.src = e.target.result;
    reader.readAsDataURL(input.files[0]);
  }
}