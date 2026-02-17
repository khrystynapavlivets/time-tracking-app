"use client"

import { Header } from "@/components/layout/header"
import { SettingsForm } from "@/components/features/settings/settings-form"

export default function SettingsPage() {
  return (
    <>
      <Header
        breadcrumb="Settings"
        showAddButton={false}
      />
      <SettingsForm />
    </>
  )
}
