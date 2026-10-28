import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  ChevronLeft,
  Edit,
  Search,
  FolderOpen,
  Calendar,
  Tag,
  X,
  CheckCircle2,
  ListChecks,
  FileText,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

type ProjectStatus = "Rascunho" | "Em andamento" | "Pausado" | "Concluído";

interface Project {
  id: string;
  name: string;
  description: string;
  niche: string;
  status: ProjectStatus;
  startDate: string;
  targetDate: string;
  notes: string;
  checklist: ChecklistItem[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS: ProjectStatus[] = ["Rascunho", "Em andamento", "Pausado", "Concluído"];

const STATUS_COLORS: Record<ProjectStatus, string> = {
  Rascunho: "bg-gray-500/10 text-gray-400 border-gray-500/30",
  "Em andamento": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Pausado: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Concluído: "bg-green-500/10 text-green-400 border-green-500/30",
};

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

function getProgress(checklist: ChecklistItem[]): number {
  if (checklist.length === 0) return 0;
  return Math.round((checklist.filter((i) => i.done).length / checklist.length) * 100);
}

export default function ProjectsTool() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newTag, setNewTag] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mony-projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mony-projects", JSON.stringify(projects));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, filterStatus]);

  function createNewProject() {
    const project: Project = {
      id: generateId(),
      name: "",
      description: "",
      niche: "",
      status: "Rascunho",
      startDate: new Date().toISOString().split("T")[0],
      targetDate: "",
      notes: "",
      checklist: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(project);
    setView("form");
  }

  function saveProject() {
    if (!currentProject) return;
    if (!currentProject.name.trim()) {
      toast.error("Nome do projeto é obrigatório");
      return;
    }
    const updated = { ...currentProject, updatedAt: new Date().toISOString() };
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [...prev, updated];
    });
    setCurrentProject(updated);
    toast.success("Projeto salvo com sucesso!");
    setView("detail");
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Projeto excluído");
    if (currentProject?.id === id) {
      setView("list");
      setCurrentProject(null);
    }
  }

  function updateField(field: keyof Project, value: unknown) {
    if (!currentProject) return;
    setCurrentProject({ ...currentProject, [field]: value });
  }

  function addTag() {
    if (!currentProject || !newTag.trim()) return;
    if (currentProject.tags.includes(newTag.trim())) {
      toast.error("Tag já existe");
      return;
    }
    setCurrentProject({
      ...currentProject,
      tags: [...currentProject.tags, newTag.trim()],
    });
    setNewTag("");
  }

  function removeTag(tag: string) {
    if (!currentProject) return;
    setCurrentProject({
      ...currentProject,
      tags: currentProject.tags.filter((t) => t !== tag),
    });
  }

  function addChecklistItem() {
    if (!currentProject || !newChecklistItem.trim()) return;
    setCurrentProject({
      ...currentProject,
      checklist: [
        ...currentProject.checklist,
        { id: generateId(), text: newChecklistItem.trim(), done: false },
      ],
    });
    setNewChecklistItem("");
  }

  function toggleChecklistItem(id: string) {
    if (!currentProject) return;
    const checklist = currentProject.checklist.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    const updated = { ...currentProject, checklist };
    setCurrentProject(updated);
    // Auto-save toggle
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...updated, updatedAt: new Date().toISOString() };
        return copy;
      }
      return prev;
    });
  }

  function removeChecklistItem(id: string) {
    if (!currentProject) return;
    setCurrentProject({
      ...currentProject,
      checklist: currentProject.checklist.filter((item) => item.id !== id),
    });
  }

  // Form View
  if ((view === "form" || view === "detail") && currentProject) {
    const progress = getProgress(currentProject.checklist);
    const isEditing = view === "form";

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setView("list")}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div className="flex gap-2">
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setView("form")}>
                <Edit className="h-4 w-4 mr-1" /> Editar
              </Button>
            )}
            {isEditing && (
              <Button size="sm" onClick={saveProject}>
                <Save className="h-4 w-4 mr-1" /> Salvar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => deleteProject(currentProject.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5" /> Informações do Projeto
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Nome do Projeto *</Label>
                  {isEditing ? (
                    <Input
                      value={currentProject.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Ex: Campanha Black Friday"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-lg font-semibold mt-1">{currentProject.name || "—"}</p>
                  )}
                </div>
                <div>
                  <Label>Descrição</Label>
                  {isEditing ? (
                    <Textarea
                      value={currentProject.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Descreva o projeto..."
                      rows={3}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{currentProject.description || "—"}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nicho</Label>
                    {isEditing ? (
                      <Input
                        value={currentProject.niche}
                        onChange={(e) => updateField("niche", e.target.value)}
                        placeholder="Ex: Saúde, Finanças..."
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1">{currentProject.niche || "—"}</p>
                    )}
                  </div>
                  <div>
                    <Label>Status</Label>
                    {isEditing ? (
                      <Select
                        value={currentProject.status}
                        onValueChange={(v) => updateField("status", v)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        <Badge className={`border ${STATUS_COLORS[currentProject.status]}`}>
                          {currentProject.status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data de Início</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={currentProject.startDate}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {currentProject.startDate ? new Date(currentProject.startDate + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Data Alvo</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={currentProject.targetDate}
                        onChange={(e) => updateField("targetDate", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm mt-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {currentProject.targetDate ? new Date(currentProject.targetDate + "T00:00:00").toLocaleDateString("pt-BR") : "—"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Anotações
              </h3>
              {isEditing ? (
                <Textarea
                  value={currentProject.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Anotações livres sobre o projeto..."
                  rows={6}
                />
              ) : (
                <div className="text-sm whitespace-pre-wrap text-muted-foreground min-h-[60px]">
                  {currentProject.notes || "Nenhuma anotação."}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-sm font-semibold mb-3">Progresso</h3>
              <div className="text-center mb-3">
                <span className="text-4xl font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground text-center">
                {currentProject.checklist.filter((i) => i.done).length} de{" "}
                {currentProject.checklist.length} tarefas concluídas
              </p>
            </div>

            {/* Tags */}
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Tags
              </h3>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {currentProject.tags.length === 0 && (
                  <span className="text-xs text-muted-foreground">Nenhuma tag</span>
                )}
                {currentProject.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    {isEditing && (
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nova tag"
                    className="text-sm"
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button size="sm" variant="outline" onClick={addTag}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> Checklist
              </h3>
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-2">
                  {currentProject.checklist.length === 0 && (
                    <p className="text-xs text-muted-foreground">Nenhum item na checklist</p>
                  )}
                  {currentProject.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <Checkbox
                        checked={item.done}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                      />
                      <span className={`text-sm flex-1 ${item.done ? "line-through text-muted-foreground" : ""}`}>
                        {item.text}
                      </span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive"
                          onClick={() => removeChecklistItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {isEditing && (
                <div className="flex gap-2 mt-3">
                  <Input
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    placeholder="Novo item"
                    className="text-sm"
                    onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
                  />
                  <Button size="sm" variant="outline" onClick={addChecklistItem}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar projetos..."
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filtrar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={createNewProject}>
            <Plus className="h-4 w-4 mr-1" /> Novo Projeto
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATUS_OPTIONS.map((status) => {
          const count = projects.filter((p) => p.status === status).length;
          return (
            <div key={status} className="rounded-2xl border border-border bg-card/60 p-6 text-center">
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">{status}</p>
            </div>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FolderOpen className="h-5 w-5" /> Projetos ({filteredProjects.length})
        </h3>
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {projects.length === 0
                ? "Nenhum projeto criado. Clique em \"Novo Projeto\" para começar!"
                : "Nenhum projeto encontrado com os filtros aplicados."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const progress = getProgress(project.checklist);
              return (
                <div
                  key={project.id}
                  className="rounded-xl border border-border p-4 hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    setCurrentProject({ ...project, checklist: project.checklist.map((i) => ({ ...i })), tags: [...project.tags] });
                    setView("detail");
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium truncate flex-1">{project.name}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {project.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs border ${STATUS_COLORS[project.status]}`}>
                      {project.status}
                    </Badge>
                    {project.niche && (
                      <Badge variant="outline" className="text-xs">{project.niche}</Badge>
                    )}
                  </div>

                  {project.checklist.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {project.checklist.filter((i) => i.done).length}/{project.checklist.length}
                        </span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}

                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Atualizado: {new Date(project.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
