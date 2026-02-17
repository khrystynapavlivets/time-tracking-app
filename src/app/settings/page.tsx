"use client"

import { Header } from "@/components/layout/header"
import { SettingsForm } from "@/components/features/settings/settings-form"

export default function SettingsPage() {
  return (
    <>
      <Header
        title="Settings"
        breadcrumb="Settings"
        showAddButton={false}
      />
      <SettingsForm />
    </>
  )
}
