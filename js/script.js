$(function () {
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
    <a href="${item.link}" target="_blank">
      <div class="tools-img">
        <img src="${item.imageUrl}" alt="Voice Assistant SDK">
      </div>
    </a>
    <div class="tools-title">
      <h4>${item.title}</h4>
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

  list.innerHTML = works;
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

      getData(data);
    });
  });
}

// 分頁選染至畫面
function renderPages() {
  let pageStr = "";

  for (let i = 1; i <= pagesData.total_pages; i += 1) {
    pageStr += /*html*/ `<li ${pagesData.current_page == i ? "active" : ""} >
      <a class="page-link ${
        pagesData.current_page == i ? "disabled" : ""
      }" href="#"  data-page="${i}">${i}</a>
    </li>`;
  }

  if (pagesData.has_next) {
    pageStr += /*html*/ `<li>
    <a class="page-link" href="#">
    <span class="material-icons">
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
  btnSort.innerHTML =
    '由新到舊<span class="material-icons pl-12">expand_more</span>';
});
//  由舊到新 -> sort = 1
asc.addEventListener("click", (e) => {
  e.preventDefault();
  data.sort = 1;
  getData(data);
  btnSort.innerHTML =
    '由舊到新<span class="material-icons pl-12">expand_more</span>';
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
