"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react"
import { useStore, type Project } from "@/lib/store"

const PRESET_COLORS = [
  { hex: "#6366f1", label: "Indigo" },
  { hex: "#2dd4bf", label: "Teal" },
  { hex: "#facc15", label: "Yellow" },
  { hex: "#ef4444", label: "Red" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#f97316", label: "Orange" },
  { hex: "#a855f7", label: "Purple" },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#ec4899", label: "Pink" },
  { hex: "#64748b", label: "Slate" },
]

interface FormData {
  name: string
  client: string
  hexColor: string
  status: "Active" | "Completed" | "On Hold"
}

const emptyForm: FormData = {
  name: "",
  client: "",
  hexColor: "#6366f1",
  status: "Active",
}

export function ProjectsPage() {
  const { projects, entries, addProject, updateProject, deleteProject } =
    useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setIsDialogOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditingId(project.id)
    setForm({
      name: project.name,
      client: project.client,
      hexColor: project.hexColor,
      status: project.status,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    if (editingId) {
      updateProject(editingId, {
        name: form.name,
        client: form.client,
        hexColor: form.hexColor,
        color: "bg-primary", // legacy compat
        status: form.status,
      })
    } else {
      addProject({
        name: form.name,
        client: form.client,
        hexColor: form.hexColor,
        color: "bg-primary",
        status: form.status,
      })
    }
    setIsDialogOpen(false)
    setForm(emptyForm)
    setEditingId(null)
  }

  const getProjectHours = (projectId: string) => {
    const projectEntries = entries.filter((e) => e.projectId === projectId)
    const totalSeconds = projectEntries.reduce(
      (acc, e) => acc + e.duration,
      0
    )
    return (totalSeconds / 3600).toFixed(1)
  }

  const statusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Completed":
        return "secondary"
      case "On Hold":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your projects and track time per client.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="gap-1.5">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update your project details below."
                  : "Fill in the details for your new project."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Website Redesign"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="client-name">Client</Label>
                <Input
                  id="client-name"
                  value={form.client}
                  onChange={(e) =>
                    setForm({ ...form, client: e.target.value })
                  }
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Project Color</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        className={`h-8 w-8 rounded-full border-2 transition-all ${
                          form.hexColor === c.hex
                            ? "border-foreground scale-110"
                            : "border-transparent hover:border-muted-foreground/30"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() =>
                          setForm({ ...form, hexColor: c.hex })
                        }
                        aria-label={`Select ${c.label} color`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="custom-color"
                      className="text-xs text-muted-foreground shrink-0"
                    >
                      Custom:
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="custom-color"
                        type="color"
                        value={form.hexColor}
                        onChange={(e) =>
                          setForm({ ...form, hexColor: e.target.value })
                        }
                        className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                      <Input
                        value={form.hexColor}
                        onChange={(e) =>
                          setForm({ ...form, hexColor: e.target.value })
                        }
                        className="h-8 w-24 font-mono text-xs"
                        placeholder="#6366f1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      status: v as "Active" | "Completed" | "On Hold",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingId ? "Save Changes" : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            All Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                No projects yet
              </p>
              <p className="text-xs text-muted-foreground/70">
                Create your first project to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Hours Tracked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: project.hexColor }}
                        />
                        <span className="font-medium text-foreground">
                          {project.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {project.client}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-foreground">
                      {getProjectHours(project.id)}h
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(project)}
                          aria-label={`Edit ${project.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteProject(project.id)}
                          aria-label={`Delete ${project.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
