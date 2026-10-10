const repositoryList = document.querySelector("#repository-list");
const statusMessage = document.querySelector("#status");

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) {
      throw new Error(`Could not load repositories (${response.status}).`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error("Repository data has an unexpected format.");
    }

    const items = events.map((event) => {
      const repository = event.repository;
      if (
        event.type !== "starred" ||
        typeof repository?.full_name !== "string" ||
        typeof repository.name !== "string" ||
        typeof repository.description !== "string" ||
        typeof repository.url !== "string"
      ) {
        throw new Error("A repository entry is incomplete or invalid.");
      }

      const item = document.createElement("li");
      item.className = "repository-card";

      const link = document.createElement("a");
      link.href = repository.url;
      link.textContent = repository.full_name;

      const description = document.createElement("p");
      description.textContent = repository.description;

      item.append(link, description);
      return item;
    });

    repositoryList.replaceChildren(...items);
    statusMessage.textContent = items.length
      ? `${items.length} starred repositories`
      : "No starred repositories yet.";
  } catch (error) {
    statusMessage.textContent = `Unable to load repositories: ${error.message}`;
    statusMessage.classList.add("error");
  }
}

loadRepositories();
