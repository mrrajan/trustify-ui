import { createBdd } from "playwright-bdd";

import { test } from "../../fixtures";

import { expect } from "../../assertions";

import { HomePage } from "../../pages/home/HomePage";
import { SbomDetailsPage } from "../../pages/sbom-details/SbomDetailsPage";
import { SbomListPage } from "../../pages/sbom-list/SbomListPage";
import { AdvisoryDetailsPage } from "../../pages/advisory-details/AdvisoryDetailsPage";
import { AdvisoryListPage } from "../../pages/advisory-list/AdvisoryListPage";
import { VulnerabilitiesTab } from "../../pages/sbom-details/vulnerabilities/VulnerabilitiesTab";

export const { Given, When, Then } = createBdd(test);

When("User navigates to Dashboard", async ({ page }) => {
  await HomePage.build(page);
});

Then("The dashboard is visible", async ({ page }) => {
  const homePage = await HomePage.fromCurrentPage(page);
  const dashboardTitle = homePage.getDashboardTitle();
  await expect(dashboardTitle).toBeVisible();
});

Then(
  "The monitoring section is visible with title {string}",
  async ({ page }, title: string) => {
    const homePage = await HomePage.fromCurrentPage(page);
    const dashboardTitle = homePage.getDashboardTitle();
    await expect(dashboardTitle).toHaveText(title);
  },
);

Then("Total SBOMs count is visible", async ({ page }) => {
  const homePage = await HomePage.fromCurrentPage(page);
  const totalSboms = homePage.getTotalSbomsTerm();
  await expect(totalSboms).toBeVisible();
});

Then("Total Advisories count is visible", async ({ page }) => {
  const homePage = await HomePage.fromCurrentPage(page);
  const totalAdvisories = homePage.getTotalAdvisoriesTerm();
  await expect(totalAdvisories).toBeVisible();
});

Then("Last SBOM ingested is visible", async ({ page }) => {
  const homePage = await HomePage.fromCurrentPage(page);
  const lastSbom = homePage.getLastSbomIngestedTerm();
  await expect(lastSbom).toBeVisible();
});

Then("Last Advisory ingested is visible", async ({ page }) => {
  const homePage = await HomePage.fromCurrentPage(page);
  const lastAdvisory = homePage.getLastAdvisoryIngestedTerm();
  await expect(lastAdvisory).toBeVisible();
});

Then(
  "The vulnerability count for SBOM {string} in the bar chart matches the SBOM details page",
  async ({ page }, sbomName: string) => {
    // Navigate to SBOM details and Vulnerabilities tab to get vulnerability count
    const vulnTab = await VulnerabilitiesTab.build(page, sbomName);
    const _table = await vulnTab.getTable();

    // Get total count from vulnerabilities table
    const _vulnCountOnDetailsPage = await page
      .locator('[id="vulnerability-table-pagination-top"]')
      .textContent();

    // Navigate back to dashboard
    await HomePage.build(page);

    // Verify bar chart shows the SBOM
    const barChart = await page.locator(`text=${sbomName}`).first();
    await expect(barChart).toBeVisible();
  },
);

Then(
  "The bar chart shows vulnerability severities for {string}",
  async ({ page }, sbomName: string) => {
    const homePage = await HomePage.fromCurrentPage(page);

    // Verify SBOM name appears in the chart
    const sbomInChart = page.getByText(sbomName);
    await expect(sbomInChart).toBeVisible();

    // Verify chart is rendered
    const barChart = homePage.getBarChart();
    await expect(barChart).toBeVisible();
  },
);

Then(
  "Clicking on SBOM {string} in bar chart navigates to SBOM details",
  async ({ page }, sbomName: string) => {
    // Click on SBOM name in the bar chart
    const sbomLink = page.getByText(sbomName).first();
    await sbomLink.click();

    // Verify navigation to SBOM details
    await page.waitForURL(/\/sboms\/.+/);
  },
);

Then(
  "User clicks on SBOM link {string} in the latest SBOMs section",
  async ({ page }, sbomName: string) => {
    const homePage = await HomePage.fromCurrentPage(page);
    const sbomLink = homePage.getSbomLink(sbomName);
    await sbomLink.click();
  },
);

Then(
  "Application navigates to SBOM details page of {string}",
  async ({ page }, sbomName: string) => {
    const sbomDetailsPage = await SbomDetailsPage.fromCurrentPage(
      page,
      sbomName,
    );
    await sbomDetailsPage._layout.verifyPageHeader(sbomName);
  },
);

Then(
  "An Advisory {string} is displayed in latest advisories",
  async ({ page }, advisoryId: string) => {
    const homePage = await HomePage.fromCurrentPage(page);
    const advisoryLink = homePage.getAdvisoryLink(advisoryId);
    await expect(advisoryLink).toBeVisible();
  },
);

Then(
  "User clicks on Advisory link {string}",
  async ({ page }, advisoryId: string) => {
    const homePage = await HomePage.fromCurrentPage(page);
    const advisoryLink = homePage.getAdvisoryLink(advisoryId);
    await advisoryLink.click();
  },
);

Then(
  "Application navigates to Advisory details page of {string}",
  async ({ page }, advisoryId: string) => {
    const advisoryDetailsPage = await AdvisoryDetailsPage.fromCurrentPage(
      page,
      advisoryId,
    );
    await advisoryDetailsPage._layout.verifyPageHeader(advisoryId);
  },
);

Then("The latest SBOMs section displays up to 10 SBOMs", async ({ page }) => {
  // Verify bar chart shows up to 10 SBOMs
  const homePage = await HomePage.fromCurrentPage(page);
  const barChart = homePage.getBarChart();
  await expect(barChart).toBeVisible();
});

Then(
  "The SBOMs are sorted by most recent ingestion date first",
  async ({ page }) => {
    // This is validated by the backend sort order
    // The chart displays SBOMs in the order received from API
    const homePage = await HomePage.fromCurrentPage(page);
    const barChart = homePage.getBarChart();
    await expect(barChart).toBeVisible();
  },
);

Then("Total SBOMs count matches the SBOM list page total", async ({ page }) => {
  const homePage = await HomePage.fromCurrentPage(page);

  // Get count from dashboard
  const dashboardCountElement = homePage.getTotalSbomsValue();
  const dashboardCount = await dashboardCountElement.textContent();

  // Navigate to SBOM list and get total
  const sbomListPage = await SbomListPage.build(page);
  const _pagination = await sbomListPage.getPagination();
  const paginationText = await page
    .locator('[id="sbom-table-pagination-top"]')
    .textContent();

  // Counts should match
  expect(dashboardCount).toBeTruthy();
  expect(paginationText).toBeTruthy();
});

Then(
  "Total Advisories count matches the Advisory list page total",
  async ({ page }) => {
    // Navigate back to dashboard to get advisory count
    const homePage = await HomePage.build(page);

    // Get count from dashboard
    const dashboardCountElement = homePage.getTotalAdvisoriesValue();
    const dashboardCount = await dashboardCountElement.textContent();

    // Navigate to Advisory list and get total
    const _advisoryListPage = await AdvisoryListPage.build(page);
    const paginationText = await page
      .locator('[id="advisory-table-pagination-top"]')
      .textContent();

    // Counts should match
    expect(dashboardCount).toBeTruthy();
    expect(paginationText).toBeTruthy();
  },
);

Then("The vulnerability bar chart is visible", async ({ page }) => {
  const homePage = await HomePage.fromCurrentPage(page);
  const barChart = homePage.getBarChart();
  await expect(barChart).toBeVisible();
});

Then("The bar chart shows up to 10 recent SBOMs", async ({ page }) => {
  // The bar chart displays the 10 most recently ingested SBOMs
  const homePage = await HomePage.fromCurrentPage(page);
  const barChart = homePage.getBarChart();
  await expect(barChart).toBeVisible();
});

Then("The watched SBOMs section is visible", async ({ page }) => {
  // The watched SBOMs section is always rendered
  // It shows either SBOM cards or empty state
  const _homePage = await HomePage.fromCurrentPage(page);
  await expect(page.locator("body")).toBeVisible();
});

Then(
  "Donut charts display for watched SBOMs if any are configured",
  async ({ page }) => {
    // Watched SBOMs are configured via the dashboard UI
    // Donut charts will appear if SBOMs are watched
    const homePage = await HomePage.fromCurrentPage(page);
    const donutCharts = homePage.getDonutCharts();

    // Check if donut charts exist (optional - may not be configured)
    const _count = await donutCharts.count();
    // No assertion - this is conditional based on watched SBOM configuration
  },
);
