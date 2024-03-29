$(function () {
  // 手機版選單
  $(".m-menu-open").click(function () {
    $(".m-header-menu").animate({ left: "0px" }, "fast");
    $("body").css("overflow-y", "hidden");
  });
  $(".m-menu-close").click(function () {
    $(".m-header-menu").animate({ left: "500px" }, "fast");
    $("body").css("overflow-y", "visible");
  });

  // 手機版swiper
  const swiper = new Swiper(".swiper", {
    loop: false, //loop
    slidesPerView: 1,
    spaceBetween: 24,
    autoplay: {
      delay: 5000,
    },
    breakpoints: {
      576: {
        slidesPerView: 2,
        slidesPerGroup: 2,
      },
      768: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // 篩選、排序按鈕
  $(".tools-filter-btn").click(function () {
    $(".tools-filter-content").toggle();
    $(".tools-sort-content").hide();
    $(".tools-filter-btn").toggleClass("border");
    $(".tools-sort-btn").removeClass("border");
  });

  $(".tools-sort-btn").click(function () {
    $(".tools-sort-content").toggle();
    $(".tools-filter-content").hide();
    $(".tools-sort-btn").toggleClass("border");
    $(".tools-filter-btn").removeClass("border");
  });
  // $(document).on("click", function (event) {
  //   let $trigger = $(".tools-filter");
  //   if ($trigger !== event.target && !$trigger.has(event.target).length) {
  //     $(".tools-filter-content").hide();
  //   }
  // });

  $(".tools-filter-content li").click(function () {
    $(".tools-filter-content").hide();
    $(".tools-filter-btn").removeClass("border");
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".tools-filter").length) {
      $(".tools-filter-content").hide();
      $(".tools-sort-content").hide();
      $(".tools-filter-btn").removeClass("border");
      $(".tools-sort-btn").removeClass("border");
    }
  });

  // 常見問題
  let title = $(".qa-title");
  for (let i = 0; i < title.length; i++) {
    title[i].onclick = function (e) {
      let clickedTitle = e.currentTarget;
      if ($(".active").length && $(".active")[0] !== clickedTitle) {
        // $(".active")[0].classList.remove("active");
      }
      clickedTitle.classList.toggle("active");
    };
  }
  $(".qa-content").click(function () {
    $(".qa-title").removeClass("active");
  });
  // $(".accordion > li > a").click(function (event) {
  //   event.preventDefault();
  //   //點擊 .accordion 的第一層 a 連結，找到父層元素中的同階層內的子層 ul 元素，並讓其向上滑動
  //   $(this).parent().siblings().find("ul").slideUp();
  //   //點擊 .accordion 的第一層 a 連結，找到父層元素的子層 ul 元素，切換 Slide 效果。
  //   $(this).parent().find("ul").slideToggle();
  // });
});

// 資料串接
const apiPath = "https://2023-engineer-camp.zeabur.app";
const list = document.querySelector("#list");
const pagination = document.querySelector("#pagination");

const data = {
  type: "",
  sort: 0,
  page: 1,
  search: "",
};

let worksData = [];
let pagesData = {};

function getData({ type, sort, page, search }) {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${
    type ? `type=${type}&` : ""
  }${search ? `search=${search}` : ""}`;
  axios.get(apiUrl).then((res) => {
    worksData = res.data.ai_works.data;
    pagesData = res.data.ai_works.page;

    renderWorks();
    renderPages();
  });
}

getData(data);

// 作品選染至畫面
function renderWorks() {
  let works = "";

  worksData.forEach((item) => {
    works += /*html*/ `  <li>
    <a href="${item.link}" target="_blank" class="tools-img">
      <img src="${item.imageUrl}" alt="${item.title}">
    </a>
    <div class="tools-title">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
    <div class="tools-ai">
      <span>AI 模型</span>
      <span>${item.model}</span>
    </div>
    <div class="tools-tag">
      <span>#${item.type}</span>
      <a href="${item.link}" target="_blank">
        <span class="material-symbols-outlined">
          share
        </span>
      </a>
    </div>
  </li>`;
  });
  if (worksData.length == 0) {
    list.innerHTML = `<p class="tools-nodata">無相關資料</p>`;
  } else {
    list.innerHTML = works;
  }
}

// 切換分頁
function changePage(pagesData) {
  const pageLinks = document.querySelectorAll("a.page-link");
  let pageId = "";

  pageLinks.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      pageId = e.target.dataset.page;
      data.page = Number(pageId);

      if (!pageId) {
        data.page = Number(pagesData.current_page) + 1;
      }

      if (!pageId) {
        if (e.target.classList.contains("pre")) {
          data.page = Number(pagesData.current_page) - 1;
        } else if (e.target.classList.contains("next")) {
          data.page = Number(pagesData.current_page) + 1;
        }
      }

      getData(data);
    });
  });
}

// 分頁選染至畫面
function renderPages() {
  let pageStr = "";

  if (pagesData.has_pre) {
    pageStr += /*html*/ `<li class="page-item">
    <a class="page-link pre" href="#">
      <span class="material-symbols-outlined">
        chevron_left
      </span>
    </a>
  </li>`;
  }

  for (let i = 1; i <= pagesData.total_pages; i += 1) {
    pageStr += /*html*/ `<li ${pagesData.current_page == i ? "active" : ""} >
      <a class="page-link ${
        pagesData.current_page == i ? "disabled" : ""
      }" href="#"  data-page="${i}">${i}</a>
    </li>`;
  }

  if (pagesData.has_next) {
    pageStr += /*html*/ `<li class="page-item">
      <a class="page-link next" href="#">
        <span class="material-symbols-outlined">
          chevron_right
        </span>
      </a>
    </li>`;
  }
  pagination.innerHTML = pageStr;

  changePage(pagesData);
}

// 切換作品排序
const desc = document.querySelector("#desc");
const asc = document.querySelector("#asc");
const btnSort = document.querySelector("#btn-sort");
//  由新到舊 -> sort = 0
desc.addEventListener("click", (e) => {
  e.preventDefault();
  data.sort = 0;
  getData(data);
  btnSort.innerHTML = "由新到舊";
});
//  由舊到新 -> sort = 1
asc.addEventListener("click", (e) => {
  e.preventDefault();
  data.sort = 1;
  getData(data);
  btnSort.innerHTML = "由舊到新";
});

// 切換作品類型
const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.value === "所有類型") {
      data.type = "";
    } else {
      data.type = item.value;
    }
    getData(data);
  });
  console.log(item.value);
});

// 搜尋
const search = document.querySelector("#search");
search.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    data.search = search.value;
    data.page = 1;
    getData(data);
  }
});
