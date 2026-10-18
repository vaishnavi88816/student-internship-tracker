// ===== Get HTML Elements =====

const internshipForm = document.getElementById("internshipForm");
const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");

const applicationList = document.getElementById("applicationList");
const searchInput = document.getElementById("search");
const emptyMessage = document.getElementById("emptyMessage");

const totalCount = document.getElementById("totalCount");
const interviewCount = document.getElementById("interviewCount");
const selectedCount = document.getElementById("selectedCount");
const pendingCount = document.getElementById("pendingCount");


// ===== Load Saved Applications =====

let applications = [];

try {
    const savedApplications = localStorage.getItem("internshipApplications");
    applications = savedApplications ? JSON.parse(savedApplications) : [];

    if (!Array.isArray(applications)) {
        applications = [];
    }
} catch (error) {
    applications = [];
}


// ===== Save Applications =====

function saveApplications() {
    try {
        localStorage.setItem(
            "internshipApplications",
            JSON.stringify(applications)
        );
    } catch (error) {
        alert("Unable to save data in your browser.");
    }
}


// ===== Add New Application =====

internshipForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const company = companyInput.value.trim();
    const role = roleInput.value.trim();
    const date = dateInput.value;
    const status = statusInput.value;

    if (!company || !role || !date) {
        alert("Please fill in all the fields.");
        return;
    }

    const application = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        company: company,
        role: role,
        date: date,
        status: status
    };

    applications.push(application);

    saveApplications();
    displayApplications();

    internshipForm.reset();
});


// ===== Display Applications =====

function displayApplications() {
    applicationList.replaceChildren();

    const searchText = searchInput.value.trim().toLowerCase();

    const filteredApplications = applications.filter(function (application) {
        return application.company.toLowerCase().includes(searchText);
    });

    emptyMessage.style.display =
        filteredApplications.length === 0 ? "block" : "none";

    filteredApplications.forEach(function (application) {
        const item = document.createElement("div");
        item.className = "application-item";

        const info = document.createElement("div");
        info.className = "application-info";

        const companyName = document.createElement("h3");
        companyName.textContent = application.company;

        const roleName = document.createElement("p");
        roleName.textContent = "Role: " + application.role;

        const applicationDate = document.createElement("p");
        applicationDate.textContent = "Applied on: " + application.date;

        info.append(companyName, roleName, applicationDate);

        const actions = document.createElement("div");
        actions.className = "application-actions";

        const statusBadge = document.createElement("span");
        statusBadge.className = "status " + application.status;
        statusBadge.textContent = application.status;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            deleteApplication(application.id);
        });

        actions.append(statusBadge, deleteButton);
        item.append(info, actions);

        applicationList.appendChild(item);
    });

    updateDashboard();
}


// ===== Delete Application =====

function deleteApplication(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
        return;
    }

    applications = applications.filter(function (application) {
        return application.id !== id;
    });

    saveApplications();
    displayApplications();
}


// ===== Update Dashboard Counters =====

function updateDashboard() {
    totalCount.textContent = applications.length;

    interviewCount.textContent = applications.filter(function (application) {
        return application.status === "Interview";
    }).length;

    selectedCount.textContent = applications.filter(function (application) {
        return application.status === "Selected";
    }).length;

    pendingCount.textContent = applications.filter(function (application) {
        return application.status === "Pending";
    }).length;
}


// ===== Search Applications =====

searchInput.addEventListener("input", displayApplications);


// ===== Initial Display =====

displayApplications();