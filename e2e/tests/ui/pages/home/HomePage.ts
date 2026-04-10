import type { Page } from "@playwright/test";
import { Navigation } from "../Navigation";

/**
 * Page object for the Dashboard/Home page
 */
export class HomePage {
  private readonly _page: Page;

  private constructor(page: Page) {
    this._page = page;
  }

  /**
   * Build the page object by navigating to the Dashboard
   */
  static async build(page: Page) {
    const navigation = await Navigation.build(page);
    await navigation.goToSidebar("Dashboard");
    // Wait for dashboard stats to load
    await page.getByText("Total SBOMs").waitFor({ state: "visible" });
    return new HomePage(page);
  }

  /**
   * Build the page object from the current page state WITHOUT navigating
   */
  static async fromCurrentPage(page: Page) {
    return new HomePage(page);
  }

  /**
   * Get the dashboard card title element
   */
  getDashboardTitle() {
    return this._page.getByText("Dashboard", { exact: true }).first();
  }

  /**
   * Get an SBOM name in the bar chart (clickable text element)
   */
  getSbomLink(sbomName: string) {
    return this._page.getByText(sbomName).first();
  }

  /**
   * Get a link to an Advisory by document ID
   */
  getAdvisoryLink(advisoryId: string) {
    return this._page.getByRole("link", { name: advisoryId });
  }

  /**
   * Get the Total SBOMs description list term
   */
  getTotalSbomsTerm() {
    return this._page.getByText("Total SBOMs");
  }

  /**
   * Get the Total SBOMs count value
   */
  getTotalSbomsValue() {
    return this._page
      .getByText("Total SBOMs")
      .locator("..")
      .locator("dd")
      .first();
  }

  /**
   * Get the Total Advisories description list term
   */
  getTotalAdvisoriesTerm() {
    return this._page.getByText("Total Advisories");
  }

  /**
   * Get the Total Advisories count value
   */
  getTotalAdvisoriesValue() {
    return this._page
      .getByText("Total Advisories")
      .locator("..")
      .locator("dd")
      .first();
  }

  /**
   * Get the Last SBOM ingested term
   */
  getLastSbomIngestedTerm() {
    return this._page.getByText("Last SBOM ingested");
  }

  /**
   * Get the Last Advisory ingested term
   */
  getLastAdvisoryIngestedTerm() {
    return this._page.getByText("Last Advisory ingested");
  }

  /**
   * Get the empty state element
   */
  getEmptyState() {
    return this._page.getByText("There is nothing here yet");
  }

  /**
   * Get the bar chart element (for monitoring section)
   */
  getBarChart() {
    return this._page.locator('svg[role="img"]').first();
  }

  /**
   * Get donut chart elements (for watched SBOMs)
   */
  getDonutCharts() {
    return this._page
      .locator('svg[role="img"]')
      .filter({ hasText: /Critical|High|Medium|Low/ });
  }
}
