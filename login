<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <title>เข้าสู่ระบบ</title>
  <link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet" />
  <style>
    body {
      font-family: 'Kanit', sans-serif;
      background: #f4f4f4;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    input, button {
      width: 100%;
      margin-top: 10px;
      padding: 10px;
      font-size: 16px;
    }
  </style>
</head>
<body>

  <form id="loginForm">
    <h2 style="margin: 0 0 10px 0;">เข้าสู่ระบบ</h2>
    <input type="text" id="username" placeholder="ชื่อผู้ใช้" required>
    <input type="password" id="password" placeholder="รหัสผ่าน" required>
    <button type="submit">เข้าสู่ระบบ</button>
  </form>

<script>
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  // ใส่ user/pass ที่อนุญาต (แก้ไขได้ตามต้องการ)
  const validUsers = {
    "admin": "1234",
    "technician": "idms2024"
  };

  if (validUsers[user] === pass) {
    // ถ้าถูกต้อง เก็บสถานะไว้ใน localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", user);
    window.location.href = "index.html";
  } else {
    alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  }
});
</script>
</body>
</html>
