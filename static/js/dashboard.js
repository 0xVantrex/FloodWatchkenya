// FloodWatch Kenya Dashboard JavaScript

$(document).ready(function () {
  // Check authentication
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "/users/login/";
    return;
  }

  // Initialize dashboard
  loadDashboardData();
  setupEventListeners();

  // Display username
  const username = localStorage.getItem("username") || "User";
  $("#usernameDisplay").text(username);

  // Function to get CSRF token
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Load all dashboard data
  async function loadDashboardData() {
    try {
      await Promise.all([
        loadUserStats(),
        loadUserLocations(),
        loadRecentReports(),
        loadRecentAlerts(),
        loadWeatherData(),
      ]);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      showToast("error", "Failed to load dashboard data");
    }
  }

  // Load user statistics
  async function loadUserStats() {
    try {
      // Load locations count
      const locationsResponse = await fetch("/users/api/locations/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const locations = await locationsResponse.json();
      $("#myLocations").text(locations.length || 0);

      // Load reports count
      const reportsResponse = await fetch("/reports/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const reports = await reportsResponse.json();
      $("#totalReports").text(reports.length || 0);

      // Load alerts count
      const alertsResponse = await fetch("/alerts/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const alerts = await alertsResponse.json();
      $("#activeAlerts").text(alerts.length || 0);
      $("#alertCounter").text(alerts.length || 0);

      // Set risk level based on recent alerts
      if (alerts.length > 0) {
        const highAlerts = alerts.filter(
          (a) => a.severity === "high" || a.severity === "critical"
        );
        if (highAlerts.length > 0) {
          $("#riskLevel").text("High").addClass("text-danger");
        } else {
          $("#riskLevel").text("Medium").addClass("text-warning");
        }
      } else {
        $("#riskLevel").text("Low").addClass("text-success");
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  }

  // Load user locations
  async function loadUserLocations() {
    try {
      const response = await fetch("/users/api/locations/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const locations = await response.json();

      const locationsList = $("#locationsList");
      const reportLocationSelect = $("#reportLocation");

      // Clear existing options except the first
      reportLocationSelect.find("option:not(:first)").remove();

      if (locations.length === 0) {
        locationsList.html(`
                    <div class="text-center py-4">
                        <i class="fas fa-map-marker-alt fa-3x text-gray-300 mb-3"></i>
                        <p class="text-gray-500">No locations added yet</p>
                        <button class="btn btn-primary btn-sm" id="addFirstLocationBtn">
                            <i class="fas fa-plus fa-sm"></i> Add Your First Location
                        </button>
                    </div>
                `);

        // Add event listener for the button
        $("#addFirstLocationBtn").on("click", showAddLocationModal);
        return;
      }

      // Populate locations list
      let locationsHtml = "";
      locations.forEach((location) => {
        const isPrimary = location.is_primary
          ? '<span class="badge badge-primary ml-2">Primary</span>'
          : "";
        locationsHtml += `
                    <div class="card location-card mb-3">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="font-weight-bold mb-1">${
                                      location.county
                                    }</h6>
                                    <p class="mb-0 text-muted small">${
                                      location.subcounty
                                    } ${
          location.ward ? `- ${location.ward}` : ""
        }</p>
                                </div>
                                ${isPrimary}
                            </div>
                        </div>
                    </div>
                `;

        // Add to report location dropdown
        reportLocationSelect.append(
          `<option value="${location.id}">${location.county} - ${location.subcounty}</option>`
        );
      });

      locationsList.html(locationsHtml);
    } catch (error) {
      console.error("Error loading locations:", error);
      showToast("error", "Failed to load locations");
    }
  }

  // Load recent reports
  const tableBody = $("#reports-table-body");
  async function loadRecentReports() {
    try {
      const response = await fetch("/reports/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const reports = await response.json();

      if (reports.length === 0) {
        tableBody.html(
          '<tr><td colspan="4" class="text-center">No reports yet</td></tr>'
        );
        return;
      }

      // Sort by date (newest first) and take latest 5
      const recentReports = reports
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      let tableHtml = "";
      recentReports.forEach((report) => {
        const waterLevelBadge = getWaterLevelBadge(report.water_level);
        const date = new Date(report.created_at).toLocaleDateString();

        tableHtml += `
                    <tr>
                        <td>${report.location_name || "Unknown Location"}</td>
                        <td>${waterLevelBadge}</td>
                        <td>${date}</td>
                        <td><span class="badge badge-info">${
                          report.status || "Pending"
                        }</span></td>
                    </tr>
                `;
      });

      tableBody.html(tableHtml);
    } catch (error) {
      console.error("Error loading reports:", error);
      tableBody.html(
        '<tr><td colspan="4" class="text-center text-danger">Error loading reports</td></tr>'
      );
    }
  }

  // Load recent alerts
  async function loadRecentAlerts() {
    try {
      const response = await fetch("/alerts/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const alerts = await response.json();

      const alertsList = $("#recentAlertsList");

      if (alerts.length === 0) {
        alertsList.html(
          '<a class="dropdown-item text-center small text-gray-500">No new alerts</a>'
        );
        return;
      }

      // Sort by date (newest first) and take latest 3
      const recentAlerts = alerts
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);

      let alertsHtml = "";
      recentAlerts.forEach((alert) => {
        const severityClass = getSeverityClass(alert.severity);
        const time = new Date(alert.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        alertsHtml += `
                    <a class="dropdown-item d-flex align-items-center" href="/alerts/">
                        <div class="mr-3">
                            <div class="icon-circle ${severityClass}">
                                <i class="fas fa-bell text-white"></i>
                            </div>
                        </div>
                        <div>
                            <div class="small text-gray-500">${time}</div>
                            <span class="font-weight-bold">${
                              alert.message || "New alert"
                            }</span>
                        </div>
                    </a>
                `;
      });

      alertsHtml +=
        '<a class="dropdown-item text-center small text-gray-500" href="/alerts/">Show All Alerts</a>';
      alertsList.html(alertsHtml);
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
  }

  // Setup all event listeners
  function setupEventListeners() {
    // Logout buttons
    $("#logoutBtn").on("click", function (e) {
      e.preventDefault();
      $("#logoutModal").modal("show");
    });

    $("#confirmLogoutBtn").on("click", function () {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      window.location.href = "/users/login/";
    });

    // Report buttons
    $("#submitReportBtn, #quickReportBtn, #quickReportTopBtn").on(
      "click",
      function (e) {
        e.preventDefault();
        showReportModal();
      }
    );

    // Quick action report buttons
    $("#reportNormalBtn").on("click", () => quickReport("normal"));
    $("#reportRisingBtn").on("click", () => quickReport("rising"));
    $("#reportHighBtn").on("click", () => quickReport("high"));
    $("#reportFloodingBtn").on("click", () => quickReport("flooding"));

    // Location buttons
    $("#addLocationBtn, #manageLocationsBtn, #addFirstLocationBtn").on(
      "click",
      function (e) {
        e.preventDefault();
        showAddLocationModal();
      }
    );

    // Settings button
    $("#settingsBtn").on("click", function (e) {
      e.preventDefault();
      showToast("info", "Settings feature coming soon!");
    });

    // Profile button
    $("#profileBtn").on("click", function (e) {
      e.preventDefault();
      showToast("info", "Profile feature coming soon!");
    });

    // Safety tips button
    $("#safetyTipsBtn").on("click", function (e) {
      e.preventDefault();
      showSafetyTips();
    });

    // History button
    $("#viewHistoryBtn").on("click", function (e) {
      e.preventDefault();
      window.location.href = "/reports/";
    });

    // Submit report from modal
    $("#submitReportModalBtn").on("click", submitReport);

    // Save location from modal
    $("#saveLocationBtn").on("click", saveLocation);

    // Filter reports
    $("[data-filter]").on("click", function (e) {
      e.preventDefault();
      const filter = $(this).data("filter");
      filterReports(filter);
    });
  }

  // Show report modal
  function showReportModal() {
    // Check if user has locations
    if ($("#reportLocation option").length <= 1) {
      showToast("warning", "Please add a location first");
      showAddLocationModal();
      return;
    }
    $("#reportModal").modal("show");
  }

  // Show add location modal
  function showAddLocationModal() {
    $("#locationModal").modal("show");
  }

  // Submit report
  async function submitReport() {
    const locationId = $("#reportLocation").val();
    const waterLevel = $("#waterLevel").val();
    const description = $("#reportDescription").val().trim();

    if (!locationId) {
      showToast("error", "Please select a location");
      return;
    }

    const submitBtn = $("#submitReportModalBtn");
    const originalText = submitBtn.html();
    submitBtn
      .html('<i class="fas fa-spinner fa-spin"></i> Submitting...')
      .prop("disabled", true);

    try {
      const response = await fetch("/reports/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          location: locationId,
          water_level: waterLevel,
          description: description || "",
        }),
      });

      if (response.ok) {
        showToast("success", "Report submitted successfully!");
        $("#reportModal").modal("hide");
        $("#reportForm")[0].reset();
        loadDashboardData(); // Refresh all data
      } else {
        const error = await response.json();
        showToast("error", error.detail || "Failed to submit report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      showToast("error", "Network error. Please try again.");
    } finally {
      submitBtn.html(originalText).prop("disabled", false);
    }
  }

  // Quick report function
  async function quickReport(waterLevel) {
    // Check if user has locations
    const locationsResponse = await fetch("/users/api/locations/", {
      headers: { Authorization: `Token ${token}` },
    });
    const locations = await locationsResponse.json();

    if (locations.length === 0) {
      showToast("warning", "Please add a location first");
      showAddLocationModal();
      return;
    }

    // Use primary location or first location
    const primaryLocation =
      locations.find((loc) => loc.is_primary) || locations[0];

    try {
      const response = await fetch("/reports/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          location: primaryLocation.id,
          water_level: waterLevel,
          description: `Quick report: ${waterLevel} water level`,
        }),
      });

      if (response.ok) {
        showToast("success", `Report submitted: ${waterLevel} water level`);
        loadDashboardData(); // Refresh data
      } else {
        showToast("error", "Failed to submit quick report");
      }
    } catch (error) {
      console.error("Error submitting quick report:", error);
      showToast("error", "Network error");
    }
  }

  // Save location
  async function saveLocation() {
    const county = $("#county").val();
    const subcounty = $("#subcounty").val().trim();
    const ward = $("#ward").val().trim();
    const isPrimary = $("#isPrimary").is(":checked");

    if (!county || !subcounty) {
      showToast("error", "Please fill in required fields");
      return;
    }

    const saveBtn = $("#saveLocationBtn");
    const originalText = saveBtn.html();
    saveBtn
      .html('<i class="fas fa-spinner fa-spin"></i> Saving...')
      .prop("disabled", true);

    try {
      const response = await fetch("/users/api/locations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
          county: county,
          subcounty: subcounty,
          ward: ward || "",
          is_primary: isPrimary,
        }),
      });

      if (response.ok) {
        showToast("success", "Location saved successfully!");
        $("#locationModal").modal("hide");
        $("#locationForm")[0].reset();
        loadUserLocations(); // Refresh locations
        loadUserStats(); // Refresh stats
      } else {
        const error = await response.json();
        showToast("error", error.detail || "Failed to save location");
      }
    } catch (error) {
      console.error("Error saving location:", error);
      showToast("error", "Network error. Please try again.");
    } finally {
      saveBtn.html(originalText).prop("disabled", false);
    }
  }

  // Filter reports (placeholder)
  function filterReports(filter) {
    showToast("info", `Filtering reports: ${filter}`);
    // Implement actual filtering logic here
  }

  // Show safety tips
  function showSafetyTips() {
    const tips = [
      "Move to higher ground immediately if flooding occurs",
      "Avoid walking or driving through flood waters",
      "Stay tuned to local weather reports",
      "Prepare an emergency kit with essentials",
      "Have an evacuation plan ready",
    ];

    let tipsHtml =
      '<div class="alert alert-info"><h5>Flood Safety Tips:</h5><ul>';
    tips.forEach((tip) => {
      tipsHtml += `<li>${tip}</li>`;
    });
    tipsHtml += "</ul></div>";

    // Show in a modal or alert
    alert("Flood Safety Tips:\n\n" + tips.join("\n• "));
  }

  // Helper function to get water level badge
  function getWaterLevelBadge(level) {
    const levels = {
      normal: { class: "badge-success", text: "Normal" },
      rising: { class: "badge-warning", text: "Rising" },
      high: { class: "badge-danger", text: "High" },
      flooding: { class: "badge-dark", text: "Flooding" },
    };

    const levelInfo = levels[level] || {
      class: "badge-secondary",
      text: level,
    };
    return `<span class="badge ${levelInfo.class}">${levelInfo.text}</span>`;
  }

  // Helper function to get severity class
  function getSeverityClass(severity) {
    switch (severity) {
      case "low":
        return "bg-success";
      case "medium":
        return "bg-warning";
      case "high":
        return "bg-danger";
      case "critical":
        return "bg-dark";
      default:
        return "bg-info";
    }
  }

  // Toast notification function
  function showToast(type, message) {
    // Create toast element
    const toastId = "toast-" + Date.now();
    const toastHtml = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">
                <div class="toast-header bg-${type} text-white">
                    <strong class="mr-auto">${
                      type.charAt(0).toUpperCase() + type.slice(1)
                    }</strong>
                    <button type="button" class="ml-2 mb-1 close text-white" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;

    // Append to body
    $("body").append(toastHtml);

    // Show toast
    $(`#${toastId}`).toast("show");

    // Remove after hiding
    $(`#${toastId}`).on("hidden.bs.toast", function () {
      $(this).remove();
    });
  }

  // Weather Functions
  async function loadWeatherData() {
    try {
      // Get user's primary location
      const locationsResponse = await fetch("/users/api/locations/", {
        headers: { Authorization: `Token ${token}` },
      });
      const locations = await locationsResponse.json();

      if (locations.length === 0) {
        showWeatherPlaceholder("Add a location to get weather data");
        return;
      }

      const primaryLocation =
        locations.find((loc) => loc.is_primary) || locations[0];
      const coords = getCoordinatesForCounty(primaryLocation.county);

      // Fetch weather data from our API
      const weatherResponse = await fetch(
        `/api/weather/?lat=${coords.lat}&lon=${coords.lon}`,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        updateWeatherDisplay(weatherData, primaryLocation);
      } else {
        showWeatherPlaceholder("Weather service temporarily unavailable");
      }
    } catch (error) {
      console.error("Error loading weather:", error);
      showWeatherPlaceholder("Failed to load weather data");
    }
  }

  function getCoordinatesForCounty(county) {
    // Approximate coordinates for Kenyan counties
    const countyCoords = {
      NAIROBI: { lat: -1.286389, lon: 36.817223, name: "Nairobi" },
      MOMBASA: { lat: -4.0435, lon: 39.6682, name: "Mombasa" },
      KISUMU: { lat: -0.1022, lon: 34.7617, name: "Kisumu" },
      NAKURU: { lat: -0.3031, lon: 36.08, name: "Nakuru" },
      KIAMBU: { lat: -1.1611, lon: 36.8331, name: "Kiambu" },
      MERU: { lat: 0.05, lon: 37.65, name: "Meru" },
      KAKAMEGA: { lat: 0.2827, lon: 34.7519, name: "Kakamega" },
      KISII: { lat: -0.6833, lon: 34.7667, name: "Kisii" },
      NYERI: { lat: -0.4201, lon: 36.9476, name: "Nyeri" },
      BUNGOMA: { lat: 0.5695, lon: 34.5584, name: "Bungoma" },
    };

    return countyCoords[county] || countyCoords["NAIROBI"];
  }
function updateWeatherDisplay(weatherData, location) {
  const weatherInfo = $("#weatherInfo");

  if (weatherData.success) {
    const rain = weatherData.precipitation || 0;
    const floodRisk = calculateFloodRisk(rain);

    weatherInfo.html(`
      <div class="row">
        <div class="col-12 mb-3">
          <h6 class="font-weight-bold">
            <i class="fas fa-map-marker-alt"></i> ${location.county} - ${location.subcounty}
          </h6>
        </div>

        <div class="col-md-6 mb-3">
          <div class="card border-left-info h-100">
            <div class="card-body text-center">
              <i class="fas fa-cloud-rain fa-2x mb-2 text-info"></i>
              <h5 class="font-weight-bold">${rain} mm</h5>
              <small class="text-muted">Rain (1hr)</small>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-3">
          <div class="card border-left-${floodRisk.color} h-100">
            <div class="card-body text-center">
              <i class="fas fa-exclamation-triangle fa-2x mb-2 text-${floodRisk.color}"></i>
              <h5 class="font-weight-bold">${floodRisk.level}</h5>
              <small class="text-muted">Flood Risk</small>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="alert alert-${floodRisk.color} small mb-0">
            <i class="fas fa-info-circle mr-2"></i>
            ${floodRisk.message}
          </div>
        </div>
      </div>
    `);
  } else {
    showWeatherPlaceholder("Weather data unavailable.");
  }
}

function calculateFloodRisk(rainfall) {
  if (rainfall > 30) return { level: "CRITICAL", color: "danger", message: "High flood risk. Consider evacuation if in low-lying area." };
  if (rainfall > 20) return { level: "HIGH", color: "warning", message: "Moderate flood risk. Stay alert and monitor water levels." };
  if (rainfall > 10) return { level: "MEDIUM", color: "info", message: "Low flood risk. Continue normal monitoring." };
  return { level: "LOW", color: "success", message: "Minimal flood risk. Normal conditions." };
}

function showWeatherPlaceholder(message) {
  $("#weatherInfo").html(`
    <div class="text-center py-4">
      <i class="fas fa-cloud-showers-heavy fa-3x text-gray-300 mb-3"></i>
      <p class="text-gray-500">${message}</p>
    </div>
  `);
}

  // Auto-refresh data every 30 seconds
  setInterval(() => {
    loadDashboardData();
  }, 30000);
});
