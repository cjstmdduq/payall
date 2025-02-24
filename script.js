// | 작성자 : 천승엽(with AI)
// | 작성일 : 2025.02.10 최초작성
// | selfpeedback : JS는 하나도 이해못했다. 공부할 것 (2025.02.18)
// | 변경사항
// 2025.02.21 : 파트너사 - 숫자카운트 - 오늘날짜기능 추가
// 2025.02.22 : 대규모 수정작업 진행
// 2025.02.04 : 히어로섹션 - 유입키워드 반환 기능 추가 (레벤슈타인알고리즘 <- 이거 잘 배워둬라.)

//====================================================//
//====================================================//
//====================================================//


// 프로모션 배너 반짝임효과
function randomSparkle() {
  const strong = document.querySelector(".promo-banner strong");
  const intensity = Math.random() * 30 + 10; // 10-40px 범위의 랜덤 값
  strong.style.textShadow = `0 0 ${intensity}px var(--gold)`;

  // 다음 반짝임까지의 랜덤 시간 설정 (0.5-2초)
  setTimeout(randomSparkle, Math.random() * 1500 + 500);
}


// 프로모션 배너 스크롤 시 하이드
window.addEventListener('scroll', function () {
  const banner = document.querySelector('.promo-banner');
  if (window.scrollY > 100) { // 100px 이상 스크롤되면
    banner.classList.add('hide-banner');
  } else {
    banner.classList.remove('hide-banner');
  }
});

// 초기 실행
randomSparkle();


// 네비게이션바 섹션
// 네비게이션 스크롤 애니메이션
document.querySelectorAll(".nav-menu a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    const headerOffset = 80; // 헤더 높이만큼 오프셋

    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  });
});

// 스크롤 시 위치 이벤트 처리
window.addEventListener('scroll', function () {
  const banner = document.querySelector('.promo-banner');
  const header = document.querySelector('.header');

  if (window.scrollY > 100) { // 100px 이상 스크롤되면
    banner.classList.add('hide-banner');
    header.style.top = '0'; // 헤더를 최상단으로 이동
  } else {
    banner.classList.remove('hide-banner');
    header.style.top = '36px'; // 프로모션 배너 높이만큼 아래로
  }
});


// 모바일 화면에서 햄버거메뉴 토글 js
document.getElementById("menuToggle").addEventListener("click", function () {
  document.getElementById("mobileNav").classList.toggle("show");
});




//====================================================//
//====================================================//
//====================================================//
// 모바일전용 상담문의 버튼 (50번 스크롤하면 등장함)

let scrollCount = 0;
const callButton = document.getElementById("callButton");
const tooltip = document.getElementById("tooltip");

window.addEventListener("scroll", () => {
  scrollCount++;

  if (scrollCount >= 50) {
    callButton.classList.add("show");
    tooltip.classList.add("show");

    // 2.0초 후 툴팁 자동 숨김 (더 자연스럽게)
    setTimeout(() => {
      tooltip.classList.remove("show");
    }, 2000);
  }
});

function makeCall() {
  window.location.href = "tel:0264025502";
}








//====================================================//
//====================================================//
//====================================================//
// 히어로섹션, 소구맨트 검색어기반 반환 함수 
// 🔹 레벤슈타인 거리 계산 함수 < 잘 배워둬라.
function levenshteinDistance(a, b) {
  let matrix = Array.from(Array(a.length + 1), () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,   // 삭제
        matrix[i][j - 1] + 1,   // 삽입
        matrix[i - 1][j - 1] + cost // 교체
      );
    }
  }
  return matrix[a.length][b.length];
}

// 🔹 추천 검색어 리스트 (오탈자 교정 대상) < 데이터베이스를 많이 늘릴 것
const keywordList = ["비사업자단말기", "비사업자", "단말기", "페이올", "PG사"];

// 🔹 가장 유사한 검색어 찾기 (레벤슈타인 거리 기반)
function findClosestMatch(input) {
  let bestMatch = input;
  let minDistance = Infinity;

  keywordList.forEach((word) => {
    let distance = levenshteinDistance(input, word);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = word;
    }
  });

  // 거리가 2 이하인 경우만 수정 (너무 차이나면 보정 X)
  return minDistance <= 2 ? bestMatch : input;
}

// 🔹 URL에서 특정 파라미터 값 가져오기
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// 🔹 Referrer(이전 페이지)에서 검색어 추출
function getSearchKeywordFromReferrer() {
  const referrer = document.referrer; // 사용자가 어디서 왔는지 확인
  let keyword = "";

  if (referrer.includes("search.naver.com")) { // 네이버 검색어 추출
    const refUrl = new URL(referrer);
    keyword = refUrl.searchParams.get("query");
  } else if (referrer.includes("google.com")) { // 구글 검색어 추출
    const refUrl = new URL(referrer);
    keyword = refUrl.searchParams.get("q");
  }

  return keyword;
}

// 🔹 검색어 표시 로직 (오탈자 자동 수정 포함)
function showSearchMessage() {
  let searchKeyword = getQueryParam("query") || getSearchKeywordFromReferrer();
  const searchElement = document.getElementById("searchKeyword");

  if (searchKeyword) {
    searchKeyword = findClosestMatch(searchKeyword); // 유사 검색어 추천 적용
    searchElement.innerText = `"${searchKeyword}" 찾으시나요?`;
  } else {
    searchElement.innerText = "비사업자부터 프랜차이즈까지";
  }
}

// 🔹 페이지 로드 시 실행
window.onload = showSearchMessage;

















// 히어로섹션 텍스트 타이핑애니메이션

document.addEventListener("DOMContentLoaded", function () {
  const texts = [
    "국내 모든 PG서비스",
    "업계 최저 수수료",
    "D+1 빠른 정산",
    "가맹점 맞춤 PG솔루션",
    "유연한 개통 심의",
  ]; // 순서대로 출력할 텍스트
  let textIndex = 0; // 현재 텍스트 인덱스
  let charIndex = 0; // 현재 글자 인덱스
  const typingElement = document.getElementById("typing-text");

  const typingSpeed = 50; // 글자 하나 당 타이핑 속도 (ms)
  const erasingSpeed = 50; // 글자 하나 당 지우는 속도 (ms)
  const delayBetweenTexts = 2000; // 텍스트 전체 출력 후 다음 텍스트까지 대기 시간 (ms)

  function type() {
    if (charIndex < texts[textIndex].length) {
      // 현재 텍스트의 다음 글자 추가
      typingElement.textContent += texts[textIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      // 텍스트 완성 후 잠시 대기 후 지우기 시작
      setTimeout(erase, delayBetweenTexts);
    }
  }

  function erase() {
    if (charIndex > 0) {
      // 현재 텍스트에서 한 글자씩 지움
      typingElement.textContent = texts[textIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      // 텍스트를 모두 지운 후 다음 텍스트로 넘어감
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, typingSpeed);
    }
  }

  // 애니메이션 시작
  type();
});

//====================================================//
//====================================================//
//====================================================//
// 파트너사 섹션의 애니메이션
// 1. 텍스트 카운트 애니메이션 (상단 숫자 카운팅) 공부용 메모주석!
document.addEventListener("DOMContentLoaded", function () {
  const countElement = document.querySelector(".count-number");
  const timeElement = document.querySelector(".now.time");

  // 기준 가맹점 수 범위 설정
  const minPartners = 31300;
  const maxPartners = 31305;

  // 날짜 형식 포맷팅 함수
  function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    return `${year}.${month}.${day}. ${time} 전산자동집계 기준`;
  }

  // 랜덤 가맹점 수 생성 함수
  function generateRandomPartners() {
    return Math.floor(Math.random() * (maxPartners - minPartners + 1)) + minPartners;
  }

  // 카운트 애니메이션 함수
  function animateCount(target) {
    const duration = 500;
    const step = target / (duration / 16);
    let current = 0;
    let rafId;

    function updateCount() {
      if (current < target) {
        current = Math.min(current + step, target);
        countElement.textContent = Math.floor(current).toLocaleString();
        rafId = requestAnimationFrame(updateCount);
      } else {
        cancelAnimationFrame(rafId);
      }
    }

    requestAnimationFrame(updateCount);
  }

  // 가맹점 수와 날짜 업데이트 함수
  function updatePartnersAndDate() {
    const newTarget = generateRandomPartners();
    countElement.dataset.target = newTarget;
    animateCount(newTarget);
    timeElement.textContent = formatDate(new Date());
  }

  // 다음 오전 9시까지 남은 시간 계산 함수
  function getTimeUntilNextUpdate() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(9, 0, 0, 0);

    if (now.getHours() >= 9) {
      next.setDate(next.getDate() + 1);
    }

    return next.getTime() - now.getTime();
  }

  // 초기 설정 및 정기 업데이트 설정
  function initializeUpdates() {
    updatePartnersAndDate();

    // 매일 오전 9시에 업데이트
    setTimeout(() => {
      updatePartnersAndDate();
      setInterval(updatePartnersAndDate, 24 * 60 * 60 * 1000); // 24시간마다
    }, getTimeUntilNextUpdate());

    // 테스트용: 30초마다 업데이트 (실제 배포 시 주석 처리)
    // setInterval(updatePartnersAndDate, 10000);
  }

  // IntersectionObserver 설정
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initializeUpdates();
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: [0.2, 0.5],
      rootMargin: "50px",
    }
  );

  observer.observe(countElement);
});













// 2. 로고 무한 슬라이드 애니메이션 (3줄 교차 슬라이드)
const logoRows = document.querySelectorAll(".logo-row");
if (logoRows.length) {
  logoRows.forEach((row) => {
    const fragment = document.createDocumentFragment();
    const originalLogos = Array.from(row.children).slice(0, 8);

    originalLogos.forEach((logo) => {
      const clone = logo.cloneNode(true);
      const img = clone.querySelector("img");
      if (img) {
        img.loading = "lazy";
      }
      fragment.appendChild(clone);
    });

    row.appendChild(fragment);
  });
}


//====================================================//
//====================================================//
//====================================================//

document.addEventListener("DOMContentLoaded", function () {
  // 표시할 슬라이드 개수 (항상 5개가 보인다고 가정)
  const visibleCount = 5;
  const clonesCount = Math.floor(visibleCount / 2); // 양쪽에 추가할 클론 수 (예: 5면 2개씩)

  const container = document.querySelector(".promo-slider .slider-container");
  const promoSlider = document.querySelector(".promo-slider");
  const originalSlides = Array.from(
    document.querySelectorAll(".promo-slider .slide")
  );
  const realCount = originalSlides.length; // 원래 슬라이드 개수 (예: 5)

  // 현재 인덱스: 클론이 추가된 후, 첫 번째 실제 슬라이드는 clonesCount번째 인덱스에 위치
  let currentIndex = clonesCount;
  let isAnimating = false;
  let autoPlayInterval;
  const transitionTime = 2000; // 전환 시간 (ms)

  // --- 클론 슬라이드 동적 추가 ---
  // 왼쪽 클론: 원래 슬라이드의 마지막 clonesCount개 (순서를 유지하기 위해 앞에 그대로 추가)
  for (let i = realCount - clonesCount; i < realCount; i++) {
    const clone = originalSlides[i].cloneNode(true);
    container.insertBefore(clone, container.firstChild);
  }
  // 오른쪽 클론: 원래 슬라이드의 처음 clonesCount개
  for (let i = 0; i < clonesCount; i++) {
    const clone = originalSlides[i].cloneNode(true);
    container.appendChild(clone);
  }

  // 클론 추가 후 전체 슬라이드 목록 업데이트
  let slides = document.querySelectorAll(".promo-slider .slide");

  // 슬라이드 한 개의 전체 폭(요소 폭 + 양쪽 마진)
  function getSlideFullWidth() {
    return slides[0].offsetWidth + 40; // 여기서 40는 좌우 margin(20+20)
  }

  // 슬라이드 위치 및 active/neighbor 클래스 업데이트
  function updateSlider(animate) {
    container.style.transition = animate
      ? `transform ${transitionTime}ms ease`
      : "none";
    const slideFullWidth = getSlideFullWidth();
    const promoWidth = promoSlider.offsetWidth;
    // active 슬라이드를 중앙에 배치하기 위한 오프셋 계산:
    // 현재 인덱스의 왼쪽 전체 길이에서 (부모 폭 - 슬라이드 폭)/2 만큼 더함.
    const offset =
      -(currentIndex * slideFullWidth) + (promoWidth - slideFullWidth) / 2;
    container.style.transform = `translateX(${offset}px)`;

    // 모든 슬라이드의 클래스 초기화
    slides.forEach((slide) => slide.classList.remove("active", "neighbor"));
    // active 슬라이드 및 양옆 이웃에 클래스 추가
    if (slides[currentIndex]) slides[currentIndex].classList.add("active");
    if (slides[currentIndex - 1])
      slides[currentIndex - 1].classList.add("neighbor");
    if (slides[currentIndex + 1])
      slides[currentIndex + 1].classList.add("neighbor");
  }

  // 다음 슬라이드로 이동
  function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex++;
    updateSlider(true);
    setTimeout(() => {
      // active 슬라이드 범위: clonesCount ~ (realCount + clonesCount - 1)
      if (currentIndex > realCount + clonesCount - 1) {
        // 오른쪽 클론 영역에 도달하면 실제 첫 슬라이드로 리셋
        currentIndex = clonesCount;
        updateSlider(false);
      }
      isAnimating = false;
    }, transitionTime);
  }

  // 이전 슬라이드로 이동
  function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex--;
    updateSlider(true);
    setTimeout(() => {
      if (currentIndex < clonesCount) {
        // 왼쪽 클론 영역에 도달하면 실제 마지막 슬라이드로 리셋
        currentIndex = realCount + clonesCount - 1;
        updateSlider(false);
      }
      isAnimating = false;
    }, transitionTime);
  }

  // 자동 슬라이드 재생
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, 2000);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // 초기 위치 설정 및 자동 재생 시작
  updateSlider(false);
  startAutoPlay();

  // 마우스 오버 시 자동 슬라이드 일시 정지 (필요없을거같다.)
  // promoSlider.addEventListener('mouseenter', stopAutoPlay);
  // promoSlider.addEventListener('mouseleave', startAutoPlay);

  // 네비게이션 버튼 이벤트 (원하는 경우)
  const btnNext = document.querySelector(".promo-slider .next");
  const btnPrev = document.querySelector(".promo-slider .prev");
  if (btnNext) btnNext.addEventListener("click", nextSlide);
  if (btnPrev) btnPrev.addEventListener("click", prevSlide);

  // 창 크기 변경 시 슬라이더 위치 재조정
  window.addEventListener("resize", () => {
    updateSlider(false);
  });
});

//====================================================//
//====================================================//
//====================================================//
// 서비스 정보 객체
const serviceInfo = {
  nonBusinessTerminal: {
    title: "비사업자 단말기",
    description:
      "사업자 없이도 카드결제를 받을 수 있는 비사업자전용 단말기입니다. 최신 결제 단말기로 안전하고 빠른 결제를 지원합니다.",
    features: [
      "삼성페이,앱카드 지원",
      "영수증용지 무상지원",
      "당일 개통 서비스",
      "서비스케어 담당자 배정",
      "D+1 정산(영업일기준)",
    ],
  },
  manualPayment: {
    title: "수기결제 서비스",
    description: "고객의 카드번호만으로도 비대면으로 결제할 수 있습니다.",
    features: [
      "결제URL 생성기능 제공",
      "간소화 된 심의절차",
      "서비스케어 담당자 배정",
      "D+1 정산(영업일기준)",
      "보증보험미가입(월 1,000만원)",
    ],
  },
  businessTerminal: {
    title: "사업자 단말기 서비스",
    description: "VAN망과 유사한 수수료의 사업자 전용 PG단말기 서비스입니다.",
    features: [
      "삼성페이,앱카드 지원",
      "영수증용지 무상지원",
      "당일 개통 서비스",
      "서비스케어 담당자 배정",
      "D+1 정산(영업일기준)",
    ],
  },
  nonBusinessManual: {
    title: "비사업자 수기결제 서비스",
    description:
      "사업자등록 없이도, 고객의 카드번호만으로도 결제하는 수기결제서비스를 도입 할 수 있습니다.",
    features: [
      "결제URL 생성기능 제공",
      "간소화 된 심의절차",
      "서비스케어 담당자 배정",
      "D+1 정산(영업일기준)",
      "보증보험미가입(월 1,000만원)",
    ],
  },
  internationalcard: {
    title: "해외카드 서비스",
    description: "해외카드결제가 가능한 단말기 서비스입니다.",
    features: ["사업자전용", "별도등록필요"],
  },
  kiosk: {
    title: "키오스크 서비스",
    description: "프랜차이즈 매장에 최적화된 키오스크 결제 솔루션입니다.",
    features: [
      "직관적인 인터페이스",
      "맞춤형 UI/UX 제공",
      "본사&가맹점 통합관리",
      "24시간 기술지원",
      "POS/테이블오더 연동",
    ],
  },
  pos: {
    title: "POS 서비스",
    description: "전문적인 POS 시스템을 통해 매장 운영을 지원합니다.",
    features: [
      "직관적인 인터페이스",
      "맞춤형 UI/UX 제공",
      "본사&가맹점 통합관리",
      "24시간 기술지원",
      "키오스크/테이블오더 연동",
    ],
  },
  tableOrder: {
    title: "테이블오더 서비스",
    description: "식당에서 테이블 주문 및 결제를 간편하게 진행할 수 있습니다.",
    features: [
      "QR코드 기반 주문시스템",
      "터치패드 기반 주문시스템",
      "기타결제 시스템 연동",
      "맞춤형 UI/UX 제공",
      "키오스크/POS 연동",
    ],
  },
  delivery: {
    title: "배달대행 결제 서비스",
    description: "배달 대행 결제 솔루션으로 편리한 주문 및 결제를 지원합니다.",
    features: [
      "배달앱 연동 시스템",
      "자동 영수증 발행",
      "배달대행 정산관리",
      "고객 리뷰관리",
      "통합 주문관리",
    ],
  },
  paymentModule: {
    title: "결제 모듈 연동 서비스",
    description: "온라인 가맹점에 맞춤형 결제 모듈을 제공합니다.",
    features: ["간편한 API 연동", "테스트 계정 지원", "기술지원 서비스"],
  },
  internationalpay: {
    title: "해외 결제 서비스",
    description:
      "온라인 글로벌 비즈니스를 위한 해외결제모듈솔루션을 제공합니다.",
    features: ["글로벌 PG사 연동", "해외카드 결제모듈 제공"],
  },
  recurring: {
    title: "정기 결제 서비스",
    description: "정기 결제 관리 및 자동 결제 시스템을 지원합니다.",
    features: ["자동 결제일 설정", "카드 유효성 자동체크", "결제내역 리포트"],
  },
  subscription: {
    title: "구독 결제 서비스",
    description: "구독형 서비스에 최적화된 결제 솔루션입니다.",
    features: ["자동 결제일 설정", "카드 유효성 자동체크", "결제내역 리포트"],
  },

  hospitalPharmacy: {
    title: "병원 및 약국 서비스",
    description:
      "의료 기관에 최적화된 결제 솔루션으로 효율적인 운영을 도와드립니다.",
    features: [
      "비급여 전용 결제단말기 지원",
      "병원 전용 키오스크&포스 시스템",
      "약국 전용 단말기 제공",
      "정기결제지원",
      "수납창구 통합관리 시스템",
    ],
  },
  lawfirm: {
    title: "법률 및 세무 서비스",
    description: "개인변호사 및 로펌을 위한 맞춤 결제 솔루션입니다.",
    features: [
      "착수금,선수금 결제관리",
      "성공보수 결제시스템 제공",
      "변호사업 전용 단말기제공",
    ],
  },
  consultingMarketing: {
    title: "컨설팅 및 마케팅 서비스",
    description: "비즈니스 컨설팅 및 마케팅업종의 결제 솔루션을 제공합니다.",
    features: [
      "수기결제 지원",
      "당 업종 전용 단말기 제공",
      "결제한도 및 할부한도 확장",
      "카드사 민원 대응지원",
      "정산주기 단축 서비스",
    ],
  },
  Otherindustries: {
    title: "기타 특수업종",
    description: "기타 특수업종에 맞는 맞춤형 결제 솔루션을 제공합니다.",
    features: [
      "수기결제 지원",
      "당 업종 전용 단말기 제공",
      "결제한도 및 할부한도 확장",
      "카드사 민원 대응지원",
      "정산주기 단축 서비스",
    ],
  },
  rent: {
    title: "월세 카드 결제 서비스",
    description: "부동산 임대료 결제를 위한 안전하고 간편한 결제 솔루션입니다.",
    features: [
      "부동산 임대료 결제",
      "단말기&수기결제 지원",
      "자동 월세결제지원",
    ],
  },
  donation: {
    title: "카드헌금(기부) 서비스",
    description: "기부 문화를 선도하는 카드헌금 솔루션입니다.",
    features: [
      "정기/일시 기부관리",
      "온라인 기부전용 모듈지원",
      "자동이체 설정",
      "기부내역 통계",
      "세제혜택 안내",
    ],
  },
  salary: {
    title: "급여 카드 결제 서비스",
    description: "급여 지급을 위한 카드 결제 솔루션입니다.",
    features: [
      "긴급 급여지급 결제지원",
      "정기급여 자동지급",
      "급여명세서 발행",
    ],
  },
  deposit: {
    title: "보증금 카드 결제 서비스",
    description: "보증금 결제를 위한 간편하고 안전한 솔루션입니다.",
    features: ["PG에스크로 서비스"],
  },
};

// 모달 관리 클래스
class ServiceModal {
  constructor() {
    this.modal = document.getElementById("serviceModal");
    this.content = this.modal.querySelector(".modal-content");
    this.closeBtn = this.modal.querySelector(".close-modal");
    this.isOpen = false;
    this.currentService = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.closeBtn.addEventListener("click", () => this.close());

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.close();
    });

    // 서비스 박스 클릭 이벤트
    document.querySelector(".services").addEventListener("click", (e) => {
      const serviceBox = e.target.closest(".service-box");
      if (serviceBox) {
        const serviceType = serviceBox.dataset.service;
        this.open(serviceType);
        modalState.updateHistory(serviceType);
      }
    });
  }

  async open(serviceType) {
    try {
      if (!serviceInfo[serviceType]) {
        console.error("Service not found:", serviceType);
        return;
      }

      this.currentService = serviceType;
      const info = serviceInfo[serviceType];

      this.updateModalContent(info);
      this.modal.classList.add("show");
      await this.animateContent();
      this.isOpen = true;
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Modal open error:", error);
      this.close();
    }
  }

  updateModalContent(info) {
    this.content.querySelector(".modal-title").textContent = info.title;
    this.content.querySelector(".modal-description").textContent =
      info.description;

    const featuresGrid = this.content.querySelector(".features-grid");
    featuresGrid.innerHTML = "";

    info.features.forEach((feature, index) => {
      const featureEl = document.createElement("div");
      featureEl.className = "feature-item";
      featureEl.style.animationDelay = `${index * 0.1}s`;
      featureEl.innerHTML = `
                <i class="bi bi-check-circle"></i>
                <span>${feature}</span>
            `;
      featuresGrid.appendChild(featureEl);
    });
  }

  async animateContent() {
    const features = this.content.querySelectorAll(".feature-item");
    for (let i = 0; i < features.length; i++) {
      features[i].classList.add("slide-in");
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  close() {
    if (!this.isOpen) return;

    this.modal.classList.remove("show");
    this.isOpen = false;
    this.currentService = null;
    document.body.style.overflow = "";
    modalState.updateHistory();
  }
}

// 모달 상태 관리
const modalState = {
  handleHashChange() {
    const hash = window.location.hash.slice(1);
    if (hash && serviceInfo[hash]) {
      serviceModal.open(hash);
    } else if (serviceModal.isOpen) {
      serviceModal.close();
    }
  },

  updateHistory(serviceType) {
    if (serviceType) {
      window.history.pushState(null, "", `#${serviceType}`);
    } else {
      window.history.pushState(null, "", window.location.pathname);
    }
  },
};

// 브라우저 히스토리 이벤트 리스너
window.addEventListener("popstate", modalState.handleHashChange);
window.addEventListener("hashchange", modalState.handleHashChange);

// 모달 인스턴스 생성 및 초기 URL 해시 확인
const serviceModal = new ServiceModal();
document.addEventListener("DOMContentLoaded", modalState.handleHashChange);

