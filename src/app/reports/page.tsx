"use client"

import { Header } from "@/components/layout/header"
import { ReportSummary } from "@/components/features/reports/report-summary"
import { ReportCharts } from "@/components/features/reports/report-charts"
import { ReportProjectBreakdown } from "@/components/features/reports/report-project-breakdown"
import { Button } from "@/components/ui/forms/button"
import { Download } from "lucide-react"
import { useStore } from "@/lib/store"
import { generateTimeReportCsv, downloadCsv } from "@/lib/utils/csv"

export default function ReportsPage() {
  const { entries, getProject } = useStore()

  const handleExport = () => {
    const csv = generateTimeReportCsv(entries, getProject)
    const today = new Date().toISOString().split("T")[0]
    downloadCsv(csv, `time-report-${today}.csv`)
  }

  return (
    <>
      <Header
        title="Reports"
        breadcrumb="Reports"
        showAddButton={false}
      >
        <Button onClick={handleExport} variant="outline" className="gap-1.5">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </Header>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
           <p className="text-sm text-muted-foreground">
            Analyze your time tracking data and export reports.
          </p>
        </div>
        
        <ReportSummary />
        <ReportCharts />
        <ReportProjectBreakdown />
      </div>
    </>
  )
}
