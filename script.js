document.getElementById("fetchHeadlinesBtn").addEventListener("click", fetchHeadlines);
document.getElementById("searchInput").addEventListener("input", searchArticles);

const apiKey = "bb3b278050915cafae3d80d3f2698fd0";
let currentPage = 1;
let totalResults = 0;

document.getElementById("fetchHeadlinesBtn").addEventListener("click", () => {
    fetchHeadlines();
  });

  document.getElementById("searchInput").addEventListener("input", () => {
    fetchHeadlines(1, document.getElementById("searchInput").value.trim());
  });

async function fetchHeadlines(page = 1, query = '') {
    const loadingMessage = document.getElementById("loadingMessage");
    const headlinesContainer = document.getElementById("headlinesContainer");
    const errorContainer = document.getElementById("errorContainer");
    const paginationContainer = document.getElementById("pagination");

    // Show loading message
    loadingMessage.innerHTML = '<i class="fas fa-spinner loading-spinner"></i> Loading...';
    headlinesContainer.innerHTML = "";
    errorContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    const url = `https://gnews.io/api/v4/search?q=${query || 'technology'}&token=${apiKey}&lang=en&max=5&page=${page}`;


    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.articles) {
            throw new Error("Failed to fetch news.");
        }

        totalResults = data.totalArticles;

        // Hide loading message
        loadingMessage.innerHTML = '';

        // Render articles
        data.articles.forEach(article => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");

            const articleImage = article.urlToImage ? `<img src="${article.urlToImage}" class="article-image" alt="Article Image" />` : '';
            const articleDate = new Date(article.publishedAt).toLocaleDateString();

            articleCard.innerHTML = `
                ${articleImage}
                <div class="article-content">
                    <h3 class="article-title"><a href="${article.url}" target="_blank">${article.title}</a></h3>
                    <p class="article-description">${article.description}</p>
                    <div class="article-footer">${articleDate}</div>
                </div>
            `;
            headlinesContainer.appendChild(articleCard);
        });

        // Pagination buttons
        renderPagination(page);

    } catch (error) {
        loadingMessage.innerHTML = '';
        errorContainer.innerHTML = 'Sorry, there was an error fetching the headlines. Please try again later.';
    }
}

function renderPagination(page) {
    const paginationContainer = document.getElementById("pagination");

    const totalPages = Math.ceil(totalResults / 5);

    if (page > 1) {
        paginationContainer.innerHTML += `<button onclick="fetchHeadlines(${page - 1})">Previous</button>`;
    }

    if (page < totalPages) {
        paginationContainer.innerHTML += `<button onclick="fetchHeadlines(${page + 1})">Next</button>`;
    }
}

function searchArticles() {
    const query = document.getElementById("searchInput").value.trim();
    fetchHeadlines(1, query);
}
