let spriteSheet;
let spriteSheet2;
let characters = []; // 使用陣列來管理所有角色
let music;
let amplitude;
let musicLoaded = false;


// Sprite 類別用於處理動畫
class Sprite {
  constructor(img, x, y, totalFrames) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.totalFrames = totalFrames; // 圖片精靈中的畫格總數
    this.frameWidth = img.width / this.totalFrames; // 計算單一畫格寬度
    this.frameHeight = img.height;
    this.currentFrame = 0;
    this.animationSpeed = 0.2; // 控制動畫速度
  }

  // 更新動畫畫格
  animate() {
    this.currentFrame = (this.currentFrame + this.animationSpeed) % this.totalFrames;
  }

  // 顯示目前的畫格
  show() {
    let frameX = floor(this.currentFrame) * this.frameWidth;
    // 使用 image() 的 sx, sy, sWidth, sHeight 參數來擷取並顯示圖片精靈的特定部分
    image(
      this.img,
      this.x - this.frameWidth / 2, // 將圖片繪製在中心點
      this.y - this.frameHeight / 2,
      this.frameWidth,
      this.frameHeight,
      frameX,
      0,
      this.frameWidth,
      this.frameHeight
    );
  }
}

// p5.js 的 preload 函數，用於在 setup 之前預先載入資源
function preload() {
  // 載入位於 '1' 資料夾內的圖片精靈
  spriteSheet = loadImage('1/1all.png');
  // 載入位於 '2' 資料夾內的圖片精靈
  spriteSheet2 = loadImage('2/2all.png');
  // 載入背景音樂
  soundFormats('mp3', 'ogg');
  // 注意：檔案名稱中包含多個空白，使用資料夾實際檔名（有三個空格）
  music = loadSound('1/真珠美人魚   七彩的微風歌詞.mp3',
    () => { musicLoaded = true; console.log('music loaded'); },
    (err) => { console.error('Failed to load music', err); }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 建立一個全視窗的畫布

  const spacing = 60; // 角色之間的水平間距
  const yPosition = height / 2; // 統一的 Y 軸位置以對齊

  // --- 第一個角色 (左邊) ---
  characters.push(new Sprite(spriteSheet, width / 2 - spacing, yPosition, 8));

  // --- 第二個角色 (在第一個的右邊) ---
  characters.push(new Sprite(spriteSheet2, width / 2 + spacing, yPosition, 6));

  // 建立一個 Amplitude 物件來分析音量
  amplitude = new p5.Amplitude();
}

function draw() {
  background('#90e0ef'); // 設定背景顏色

  // 獲取當前的音量 (0.0 to 1.0)
  let level = amplitude.getLevel();
  // 將音量大小映射到一個合適的動畫速度範圍 (例如 0 to 0.5)
  let animationSpeed = map(level, 0, 1, 0, 0.5);

  // 遍歷陣列中的所有角色，並更新與顯示它們
  for (let character of characters) {
    // 使用來自音樂音量的速度來更新動畫
    character.animationSpeed = animationSpeed;
    character.animate();
    character.show();
  }
}

// p5.js 的 mousePressed 函數，當滑鼠被點擊時會被呼叫
function mousePressed() {
  // 切換音樂的播放/暫停狀態
  if (music.isPlaying()) {
    music.pause();
  } else {
    music.loop(); // 使用 loop() 來循環播放
  }
}
