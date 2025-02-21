// 컨텐츠 로드 후 높이 조절 함수
function adjustContentHeight() {
  const contentArea = document.querySelector('.content-area');
  const contentHeight = contentArea.scrollHeight;
  contentArea.style.height = contentHeight + 'px';
  contentArea.style.minHeight = '100%';
  contentArea.style.overflow = 'visible'; // 스크롤바 제거
}

// HTML 로드 함수 수정
async function loadHTML() {
  try {
    const response = await fetch('블로그컨텐츠.html');
    const html = await response.text();
    const contentArea = document.querySelector('.content-area');
    contentArea.innerHTML = html;
    
    // 컨텐츠 로드 후 높이 조절
    adjustContentHeight();
    
    // 이미지 로드 완료 후 다시 한번 높이 조절 (이미지가 있는 경우)
    const images = contentArea.getElementsByTagName('img');
    if (images.length > 0) {
      Array.from(images).forEach(img => {
        img.onload = adjustContentHeight;
      });
    }
  } catch (error) {
    console.error('HTML 로드 중 에러 발생:', error);
  }
}

// 윈도우 리사이즈시 높이 재조절
window.addEventListener('resize', adjustContentHeight);