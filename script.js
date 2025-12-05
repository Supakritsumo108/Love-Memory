// ======================================================
// 1. ตั้งค่าวันเริ่มคบกัน (แก้ไขตรงนี้)
// ======================================================
// หมายเหตุ: เดือนมกราคมคือ 0, กุมภาพันธ์คือ 1, ...
const startDate = new Date(2024, 9, 5); // ตัวอย่าง: 5 ตุลาคม 2024

// --- ระบบจัดการเสียงเอฟเฟกต์ ---
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0; // รีเซ็ตเสียงให้เริ่มใหม่ทันที (เผื่อกดรัวๆ)
    sound.play().catch((error) => console.log("Audio play prevented:", error));
  }
}

// เพิ่มเสียงคลิกให้ปุ่มทุกปุ่มในเว็บโดยอัตโนมัติ
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button, .nav-btn, a");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => playSound("sfx-click"));
  });
});

// ======================================================
// 0. ระบบ Love Password (ด่านป้องกัน)
// ======================================================

function checkPassword() {
  const input = document.getElementById("passwordInput");
  const errorMsg = document.getElementById("error-msg");
  const overlay = document.getElementById("login-overlay");

  const correctAnswer = "28 มกรา";

  // แปลงสิ่งที่พิมพ์เป็นตัวเล็กหมด จะได้ไม่ต้องกังวลเรื่องตัวใหญ่/เล็ก
  if (input.value.trim().toLowerCase() === correctAnswer) {
    // ถ้าถูก:
    playSound("sfx-correct");
    overlay.style.opacity = "0"; // ค่อยๆ จางหาย
    setTimeout(() => {
      overlay.style.display = "none"; // ซ่อนถาวร
      // เริ่มเล่นเพลงอัตโนมัติ (ถ้าต้องการ)
      // toggleMusic();
    }, 500);

    createHeart(); // โปรยหัวใจต้อนรับ
  } else {
    // ถ้าผิด:
    playSound("sfx-wrong");
    errorMsg.style.display = "block";
    input.classList.add("shake"); // สั่นกล่อง

    // เอา class สั่นออก เพื่อให้สั่นใหม่ได้รอบหน้า
    setTimeout(() => {
      input.classList.remove("shake");
    }, 500);
  }
}

// ฟังก์ชันเปิด/ปิดคำใบ้
function toggleHint() {
  const hintMsg = document.getElementById("hint-msg");
  if (hintMsg.style.display === "none") {
    hintMsg.style.display = "block";
  } else {
    hintMsg.style.display = "none";
  }
}

// ฟังก์ชันกด Enter แล้วล็อกอินได้เลย
function handleLoginEnter(event) {
  if (event.key === "Enter") {
    checkPassword();
  }
}

// --- ฟังก์ชันคำนวณเวลา ---
function updateTimer() {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById(
    "timer"
  ).innerText = `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
}
// เริ่มนับเวลาทันทีและอัปเดตทุก 1 วินาที
updateTimer();
setInterval(updateTimer, 1000);

// ======================================================
// 2. ส่วนจัดการ Popup & Navbar & Music
// ======================================================

// --- Popup เซอร์ไพรส์ ---
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

function showSurprise() {
  modal.style.display = "block";
}
span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// --- ควบคุมเพลง ---
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let isMusicPlaying = false;
music.volume = 0.5; // ความดัง 50%

// ======================================================
// 3. Music Playlist System (ระบบเพลงหลายเพลง)
// ======================================================

// 1. รายชื่อเพลง (แก้ชื่อไฟล์และชื่อเพลงตรงนี้)
const playlist = [
    { title: "Wish", src: "audios/songs/song1.mp3" },      // เพลงเดิมที่มีอยู่
    { title: "ให้เธอรู้", src: "audios/songs/song2.mp3" }, // เพลงที่ 2 (ต้องหาไฟล์มาใส่)
    { title: "Until I Found You", src: "audios/songs/song3.mp3" }     // เพลงที่ 3
];

let currentSongIndex = 0;
let isPlaying = false;
const audio = document.getElementById("bgMusic");
const playBtn = document.getElementById("playPauseBtn");
const titleText = document.getElementById("songTitle");

// โหลดเพลงแรกเตรียมไว้
function loadSong(index) {
    const song = playlist[index];
    audio.src = song.src;
    titleText.innerText = `🎵 ${song.title}`;
}

// ฟังก์ชันหลัก: เล่น/หยุด
function toggleMusic() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    // ถ้ายังไม่มี src (เพิ่งเข้าเว็บครั้งแรก) ให้โหลดเพลงปัจจุบันก่อน
    if (!audio.src || audio.src === window.location.href) {
        loadSong(currentSongIndex);
    }
    
    audio.play().then(() => {
        isPlaying = true;
        playBtn.innerText = "⏸"; // เปลี่ยนไอคอนเป็นหยุด
        playBtn.classList.add("playing"); // (เผื่อใส่ effect หมุนๆ ในอนาคต)
    }).catch(e => console.log("Error playing:", e));
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.innerText = "▶"; // เปลี่ยนไอคอนเป็นเล่น
}

// เพลงถัดไป
function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > playlist.length - 1) {
        currentSongIndex = 0; // วนกลับไปเพลงแรก
    }
    
    loadSong(currentSongIndex);
    if (isPlaying) playSong(); // ถ้าเล่นอยู่ ก็ให้เล่นเพลงใหม่ต่อเลย
}

// เพลงก่อนหน้า
function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1; // วนไปเพลงสุดท้าย
    }
    
    loadSong(currentSongIndex);
    if (isPlaying) playSong();
}

// เมื่อจบเพลง ให้เล่นเพลงถัดไปอัตโนมัติ
audio.addEventListener('ended', nextSong);

// เริ่มต้น: โหลดข้อมูลเพลงแรก (แต่ยังไม่เล่น)
loadSong(currentSongIndex);

// --- เปลี่ยนหน้า (Navbar Navigation) ---
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.style.width = menu.style.width === "250px" ? "0" : "250px";
}

function switchPage(pageName) {
  const sections = [
    "home-section",
    "gallery-section",
    "food-section",
    "coupon-section",
    "notes-section",
  ];

  toggleMenu(); // ปิดเมนู

  // ซ่อนทุกหน้า
  sections.forEach((id) => {
    document.getElementById(id).style.display = "none";
  });

  // เปิดหน้าที่เลือก
  if (pageName === "home") {
    document.getElementById("home-section").style.display = "flex";
  } else if (pageName === "gallery") {
    document.getElementById("gallery-section").style.display = "flex";
    // (Optional) อาจจะสั่งให้เล่นสไลด์โชว์เลยก็ได้
  } else if (pageName === "food") {
    document.getElementById("food-section").style.display = "flex";
    drawWheel(); // วาดวงล้อใหม่ป้องกันภาพหาย
  } else if (pageName === "coupons") {
    document.getElementById("coupon-section").style.display = "flex";
  } else if (pageName === "notes") {
    document.getElementById("notes-section").style.display = "flex";
    loadNote(); // โหลดข้อความ
  }
}

// ======================================================
// 3. Gallery & Auto Slideshow (สไลด์โชว์อัตโนมัติ)
// ======================================================
const photos = [
  "images/img1.jpg", // เปลี่ยนลิงก์รูปตรงนี้
  "images/img2.jpg",
  "images/img3.jpg",
  "images/img4.jpg",
  "images/img5.jpg",
];

function preloadImages() {
  photos.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

window.addEventListener("load", () => {
  setTimeout(preloadImages, 1000); // รอ 1 วินาทีค่อยเริ่มโหลดรูปซ่อนไว้
});

let currentPhotoIndex = 0;
let slideInterval;
let isSlidePlaying = false;

// แสดงรูปภาพ
function showPhoto(index) {
  const imgElement = document.getElementById("galleryImg");
  const counterElement = document.getElementById("photoCounter");

  if (index >= photos.length) currentPhotoIndex = 0;
  if (index < 0) currentPhotoIndex = photos.length - 1;

  imgElement.src = photos[currentPhotoIndex];
  counterElement.innerText = `${currentPhotoIndex + 1} / ${photos.length}`;

  // เอฟเฟกต์ Fade
  imgElement.classList.remove("fade");
  void imgElement.offsetWidth; // Trigger reflow
  imgElement.classList.add("fade");
}

function nextPhoto() {
  currentPhotoIndex++;
  showPhoto(currentPhotoIndex);
}

function prevPhoto() {
  currentPhotoIndex--;
  showPhoto(currentPhotoIndex);
  if (isSlidePlaying) stopSlideshow(); // กดเองให้หยุดออโต้
}

// ปุ่ม Play/Pause Slideshow
function toggleSlideshow() {
  const btn = document.getElementById("playPauseBtn");
  if (isSlidePlaying) {
    stopSlideshow();
    btn.innerText = "▶";
  } else {
    startSlideshow();
    btn.innerText = "⏸";
  }
}

function startSlideshow() {
  isSlidePlaying = true;
  slideInterval = setInterval(nextPhoto, 3000); // เปลี่ยนทุก 3 วินาที
}

function stopSlideshow() {
  isSlidePlaying = false;
  clearInterval(slideInterval);
  document.getElementById("playPauseBtn").innerText = "▶";
}
// โหลดรูปแรก
showPhoto(currentPhotoIndex);

// ======================================================
// 4. ลูกเล่นตกแต่ง (Hearts, Typewriter, Preloader)
// ======================================================

// --- หัวใจลอย (Floating Hearts) ---
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("floating-heart");
  heart.innerHTML = "🤍";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = Math.random() * 20 + 10 + "px";
  heart.style.animationDuration = Math.random() * 5 + 3 + "s";
  document.querySelector(".hearts-container").appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}
setInterval(createHeart, 300);

// --- พิมพ์ดีด (Typewriter) ---
const typingElement = document.getElementById("typing-text");
const typeString = "ขอบคุณที่อยู่ข้างกันนะ <br> รักที่สุดเลยยย ❤️";
let typeIndex = 0;

function typeWriter() {
  if (typingElement && typeIndex < typeString.length) {
    if (typeString.substring(typeIndex, typeIndex + 4) === "<br>") {
      typingElement.innerHTML += "<br>";
      typeIndex += 4;
    } else {
      typingElement.innerHTML += typeString.charAt(typeIndex);
      typeIndex++;
    }
    setTimeout(typeWriter, 100);
  } else if (typingElement) {
    typingElement.classList.add("cursor-blink");
  }
}
setTimeout(typeWriter, 1000);

// --- Preloader ---
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.style.opacity = "0";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }, 2500);
});

// ======================================================
// 5. เปลี่ยนธีมและทักทายตามเวลา (Dynamic Theme)
// ======================================================
function checkTimeForTheme() {
  const now = new Date();
  const currentHour = now.getHours();
  const body = document.body;
  const greetingElement = document.getElementById("greeting-text");
  let message = "";

  // กำหนดข้อความ
  if (currentHour >= 5 && currentHour < 12) {
    message = "Good Morning ที่รัก ☀️ ตื่นมาสดใสๆ นะ";
  } else if (currentHour >= 12 && currentHour < 17) {
    message = "อย่าลืมหาอะไรกินด้วยนะคนเก่ง 🍛";
  } else if (currentHour >= 17 && currentHour < 21) {
    message = "เหนื่อยไหมวันนี้? พักผ่อนเยอะๆ นะ 🌆";
  } else {
    message = "ดึกแล้วนะ... ฝันดีครับ จุ๊บๆ 😴";
  }

  if (greetingElement) greetingElement.innerText = message;

  // เปลี่ยนธีม (18:00 - 06:00 เป็นโหมดกลางคืน)
  if (currentHour >= 18 || currentHour < 6) {
    body.classList.add("night-theme");
    body.classList.remove("blue-theme");
  } else {
    body.classList.remove("night-theme");
  }
}
checkTimeForTheme();
setInterval(checkTimeForTheme, 60000); // เช็คทุก 1 นาที

// ======================================================
// 6. Food Wheel (วงล้อสุ่มของกิน)
// ======================================================
const canvas = document.getElementById("foodWheel");
const ctx = canvas.getContext("2d");
const resultText = document.getElementById("result-text");
const foods = [
  "ชาบู",
  "หมูกระทะ",
  "มาม่า",
  "ส้มตำ",
  "ชานม",
  "ก๋วยเตี๋ยว",
  "KFC",
  "ตามสั่ง",
];
const colors = [
  "#FFADAD",
  "#FFD6A5",
  "#FDFFB6",
  "#CAFFBF",
  "#9BF6FF",
  "#A0C4FF",
  "#BDB2FF",
  "#FFC6FF",
];

let startAngle = 0;
let arc = Math.PI / (foods.length / 2);
let currentRotation = 0;

function drawWheel() {
  if (!canvas) return; // ป้องกัน Error ถ้ายังไม่โหลดหน้า
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const outsideRadius = 140;
  const textRadius = 100;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < foods.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
    ctx.arc(centerX, centerY, 0, angle + arc, angle, true);
    ctx.fill();
    ctx.save();

    ctx.fillStyle = "#333";
    ctx.font = 'bold 16px "Mali"';
    ctx.translate(
      centerX + Math.cos(angle + arc / 2) * textRadius,
      centerY + Math.sin(angle + arc / 2) * textRadius
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    const text = foods[i];
    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
    ctx.restore();
  }
}

function spinWheel() {
  const spins = Math.random() * 4 + 4;
  const degrees = spins * 360;
  const randomOffset = Math.floor(Math.random() * 360);
  const totalDegrees = degrees + randomOffset;
  currentRotation += totalDegrees;

  canvas.style.transform = `rotate(-${currentRotation}deg)`;
  resultText.innerText = "กำลังสุ่ม... 😋";

  setTimeout(() => {
    const actualRotation = currentRotation % 360;
    const sliceAngle = 360 / foods.length;
    const winningAngle = (270 + actualRotation) % 360;
    const index = Math.floor(winningAngle / sliceAngle);

    playSound("sfx-cheer");

    resultText.innerHTML = `🎉 วันนี้กิน: <span style="font-size: 1.5rem; color: var(--accent-color);">${foods[index]}</span>! 🎉`;
    createHeart();
    createHeart();
    createHeart();
  }, 4000);
}
drawWheel();

// ======================================================
// 7. Sticky Notes (สมุดโน้ตฝากข้อความ)
// ======================================================

function loadNote() {
    const savedNote = localStorage.getItem('ourLoveNote');
    const noteArea = document.getElementById('loveNote'); // ต้องใช้ ID ใหม่ 'loveNote'
    const statusText = document.getElementById('save-status');

    if (savedNote && noteArea) {
        noteArea.value = savedNote;
        if (statusText) {
            statusText.innerText = "อ่านแล้ว (ข้อความเก่า)";
            statusText.style.color = "#888";
        }
    }
}

function saveNote() {
    const noteArea = document.getElementById('loveNote');
    const statusText = document.getElementById('save-status');
    const readStatus = document.getElementById('read-status'); // สถานะใต้กล่องข้อความ

    if (!noteArea) return;

    const noteContent = noteArea.value;
    
    // บันทึกลงเครื่อง
    localStorage.setItem('ourLoveNote', noteContent);
    
    // เปลี่ยนสถานะให้ดูเหมือนส่งแล้ว
    if (statusText) {
        statusText.innerText = "ส่งแล้ว ✅";
        statusText.style.color = "#4CAF50"; // สีเขียว
    }
    
    if (readStatus) {
        readStatus.innerText = "ส่งเมื่อกี้";
    }

    playSound('sfx-click'); // เสียงกด
    alert("ส่งข้อความถึงเค้าเรียบร้อย! 💌\n(ระบบบันทึกไว้แล้ว)");
}

function clearNote() {
    const noteArea = document.getElementById('loveNote');
    const statusText = document.getElementById('save-status');

    if (confirm("จะลบข้อความทิ้งจริงๆ หรอ? 🥺")) {
        // ลบข้อมูลในเครื่อง
        localStorage.removeItem('ourLoveNote');
        
        // เคลียร์ช่องพิมพ์
        if (noteArea) noteArea.value = "";
        
        // รีเซ็ตสถานะ
        if (statusText) {
            statusText.innerText = "ยังไม่ได้บันทึก";
            statusText.style.color = "#888";
        }
        
        playSound('sfx-click');
    }
}

loadNote();

// ======================================================
// 8. Advanced Coupons (คูปองใช้แล้วหมดไป)
// ======================================================
function loadCoupons() {
  const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons")) || [];
  usedCoupons.forEach((id) => {
    const element = document.getElementById(id);
    if (element) markAsUsed(element);
  });
}

function markAsUsed(element) {
  element.classList.add("used");
  element.innerHTML = "❌ ใช้สิทธิ์แล้ว (Used)";
}

function useCoupon(id, title) {
  const element = document.getElementById(id);
  if (element.classList.contains("used")) return;

  if (
    confirm(
      `ยืนยันจะใช้สิทธิ์ "${title}" ใช่มั้ย? \n(กดแล้วคูปองจะหายไปจริงๆ นะ!)`
    )
  ) {
    playSound("sfx-cheer");
    markAsUsed(element);
    const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons")) || [];
    usedCoupons.push(id);
    localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
    alert("บันทึกการใช้สิทธิ์เรียบร้อย! ✅ \nแคปหน้าจอนี้ส่งมาได้เลย");
    for (let i = 0; i < 5; i++) setTimeout(createHeart, i * 200);
  }
}

function resetCoupons() {
  const password = prompt("ใส่รหัสลับเพื่อเติมคูปอง:");
  // แก้รหัสผ่านตรงนี้ (Admin Only)
  if (password === "1234") {
    localStorage.removeItem("usedCoupons");
    alert("เติมคูปองให้ใหม่หมดแล้วครับท่าน! 🎉");
    location.reload();
  } else if (password !== null) {
    alert("รหัสผิด! ห้ามแอบเติมนะ 😝");
  }
}
loadCoupons();

// ... (ต่อท้ายไฟล์เดิม) ...

// ======================================================
// 6. ระบบปัดนิ้ว (Touch Swipe) สำหรับ Gallery
// ======================================================
let touchStartX = 0;
let touchEndX = 0;

const galleryContainer = document.getElementById("gallery-section");

// เมื่อเริ่มแตะหน้าจอ
galleryContainer.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  false
);

// เมื่อยกนิ้วออก
galleryContainer.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  },
  false
);

function handleSwipeGesture() {
  // กำหนดระยะขั้นต่ำในการปัด (50px) เพื่อกันมือลั่น
  const swipeThreshold = 50;

  if (touchEndX < touchStartX - swipeThreshold) {
    // ปัดไปทางซ้าย (Left Swipe) -> รูปถัดไป
    showPhoto(currentPhotoIndex + 1);
    playSound("sfx-click"); // ใส่เสียงด้วย
  }

  if (touchEndX > touchStartX + swipeThreshold) {
    // ปัดไปทางขวา (Right Swipe) -> รูปก่อนหน้า
    showPhoto(currentPhotoIndex - 1);
    playSound("sfx-click");
  }
}
