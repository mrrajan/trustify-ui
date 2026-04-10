Feature: Dashboard - Home Page
    Background: Authentication
        Given User is authenticated

    Scenario: Dashboard loads on navigation to root
        When User navigates to Dashboard
        Then The dashboard is visible

    Scenario: Monitoring section displays with title
        When User navigates to Dashboard
        Then The monitoring section is visible with title "Dashboard"

    Scenario: Stats are displayed on dashboard
        When User navigates to Dashboard
        Then Total SBOMs count is visible
        And Total Advisories count is visible
        And Last SBOM ingested is visible
        And Last Advisory ingested is visible

    Scenario Outline: Dashboard vulnerability count matches SBOM details page
        Given An ingested SBOM "<sbomName>" is available
        When User navigates to Dashboard
        Then The vulnerability count for SBOM "<sbomName>" in the bar chart matches the SBOM details page

        Examples:
            | sbomName    |
            | quarkus-bom |

    Scenario Outline: Bar chart displays vulnerability severities for SBOM
        Given An ingested SBOM "<sbomName>" is available
        When User navigates to Dashboard
        Then The bar chart shows vulnerability severities for "<sbomName>"
        And Clicking on SBOM "<sbomName>" in bar chart navigates to SBOM details

        Examples:
            | sbomName    |
            | quarkus-bom |

    Scenario Outline: Navigate to SBOM details from latest SBOMs section
        Given An ingested SBOM "<sbomName>" is available
        When User navigates to Dashboard
        And User clicks on SBOM link "<sbomName>" in the latest SBOMs section
        Then Application navigates to SBOM details page of "<sbomName>"

        Examples:
            | sbomName    |
            | quarkus-bom |

    Scenario Outline: Navigate to Advisory details from latest advisories
        When User navigates to Dashboard
        And An Advisory "<advisoryId>" is displayed in latest advisories
        And User clicks on Advisory link "<advisoryId>"
        Then Application navigates to Advisory details page of "<advisoryId>"

        Examples:
            | advisoryId      |
            | CVE-2024-29025  |

    Scenario: Latest SBOMs section displays SBOMs sorted by ingestion date
        When User navigates to Dashboard
        Then The latest SBOMs section displays up to 10 SBOMs
        And The SBOMs are sorted by most recent ingestion date first

    Scenario: Stats totals are consistent with list pages
        When User navigates to Dashboard
        Then Total SBOMs count matches the SBOM list page total
        And Total Advisories count matches the Advisory list page total

    Scenario: Bar chart is visible in monitoring section
        When User navigates to Dashboard
        Then The vulnerability bar chart is visible
        And The bar chart shows up to 10 recent SBOMs

    Scenario Outline: Watched SBOMs section displays donut charts
        Given An ingested SBOM "<sbomName>" is available
        When User navigates to Dashboard
        Then The watched SBOMs section is visible
        And Donut charts display for watched SBOMs if any are configured

        Examples:
            | sbomName    |
            | quarkus-bom |
