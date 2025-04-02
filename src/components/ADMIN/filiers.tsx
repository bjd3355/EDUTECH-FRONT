"use client"; // Directive "use client" pour indiquer un composant client dans Next.js (si applicable)

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  UploadCloud,
  Download,
  LayoutGrid,
  List,
  ArrowUpDown,
  FileText,
  Info,
  BarChart2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import dynamic from "next/dynamic";
import "../../styles/quill.snow.css";
// Importation correcte des composants UI (assurez-vous que ces composants existent dans "@/components/ui")
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Import dynamique pour ReactQuill avec typage explicite
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Importation correcte du CSS de React Quill
import "../../styles/quill.snow.css"; // Cette ligne devrait fonctionner avec Vite si react-quill est installé

// Types
type Filiere =
  | "Génie Civil"
  | "Génie Informatique"
  | "Ressources Humaines"
  | "Transport et Logistique"
  | "Commerce International"
  | "Marketing et Stratégie"
  | "Hygiène Qualité Sécurité & Environnement"
  | "Banque, Finances, Assurances"
  | "Comptabilité & Gestion"
  | "Communication"
  | "Entreprise & Gestion des PME"
  | "Management des Affaires";

interface DocumentFile {
  id: string;
  nom: string;
  type: string;
  taille: string;
  url: string;
}

interface Cours {
  id: string;
  titre: string;
  filiere: Filiere;
  module: string;
  professeur: string;
  date: string;
  contenu: string;
  documents: DocumentFile[];
  nbEtudiants?: number;
}

// Interface temporaire pour Alert (à remplacer par le vrai composant si défini dans "@/components/ui")
interface AlertProps {
  title: string;
  children: React.ReactNode;
}
const Alert: React.FC<AlertProps> = ({ title, children }) => (
  <div className="border rounded-md p-4 bg-yellow-50 text-yellow-800">
    <h3 className="font-bold">{title}</h3>
    {children}
  </div>
);

// Liste des filières
const filieres: Filiere[] = [
  "Génie Civil",
  "Génie Informatique",
  "Ressources Humaines",
  "Transport et Logistique",
  "Commerce International",
  "Marketing et Stratégie",
  "Hygiène Qualité Sécurité & Environnement",
  "Banque, Finances, Assurances",
  "Comptabilité & Gestion",
  "Communication",
  "Entreprise & Gestion des PME",
  "Management des Affaires",
];

// Mock data
const mockCours: Cours[] = [
  {
    id: "1",
    titre: "Introduction à la programmation",
    filiere: "Génie Informatique",
    module: "Programmation",
    professeur: "Dr. Modou Diop",
    date: "2023-09-01",
    contenu:
      "<p>Ce cours couvre les bases de la programmation, incluant les variables, les structures de contrôle, les fonctions et les structures de données fondamentales.</p>",
    documents: [
      { id: "d1", nom: "syllabus.pdf", type: "PDF", taille: "2.4 MB", url: "#" },
      { id: "d2", nom: "exercices.zip", type: "ZIP", taille: "4.1 MB", url: "#" },
    ],
    nbEtudiants: 45,
  },
  {
    id: "2",
    titre: "Gestion de projet",
    filiere: "Management des Affaires",
    module: "Management",
    professeur: "Pr. Sophie sall",
    date: "2023-09-05",
    contenu:
      "<p>Apprenez les méthodologies de gestion de projet, y compris Agile, Scrum et les approches traditionnelles.</p>",
    documents: [
      { id: "d3", nom: "presentation.pptx", type: "PPTX", taille: "5.7 MB", url: "#" },
    ],
    nbEtudiants: 38,
  },
  {
    id: "3",
    titre: "Résistance des matériaux",
    filiere: "Génie Civil",
    module: "Structures",
    professeur: "Dr. Ahmed Basse",
    date: "2023-09-10",
    contenu:
      "<p>Étude des propriétés mécaniques des matériaux de construction et de leur comportement sous différentes charges.</p>",
    documents: [
      { id: "d4", nom: "cours_complet.pdf", type: "PDF", taille: "8.2 MB", url: "#" },
      { id: "d5", nom: "travaux_pratiques.pdf", type: "PDF", taille: "3.5 MB", url: "#" },
    ],
    nbEtudiants: 32,
  },
  {
    id: "4",
    titre: "Marketing digital",
    filiere: "Marketing et Stratégie",
    module: "Marketing",
    professeur: "Mme. Camille Bakana",
    date: "2023-09-15",
    contenu:
      "<p>Découvrez les stratégies et outils du marketing digital, incluant les médias sociaux, le SEO, le content marketing et l'analyse de données.</p>",
    documents: [
      { id: "d6", nom: "strategies_digitales.pdf", type: "PDF", taille: "4.8 MB", url: "#" },
    ],
    nbEtudiants: 50,
  },
  {
    id: "5",
    titre: "Comptabilité analytique",
    filiere: "Comptabilité & Gestion",
    module: "Comptabilité",
    professeur: "M. MATHYS",
    date: "2023-09-20",
    contenu:
      "<p>Ce cours approfondit les techniques de comptabilité analytique pour l'aide à la décision et le contrôle de gestion.</p>",
    documents: [
      { id: "d7", nom: "exercices_pratiques.xlsx", type: "XLSX", taille: "1.9 MB", url: "#" },
      { id: "d8", nom: "etudes_de_cas.pdf", type: "PDF", taille: "3.2 MB", url: "#" },
    ],
    nbEtudiants: 42,
  },
];

const Filieres: React.FC = () => {
  // States
  const [cours, setCours] = useState<Cours[]>(mockCours);
  const [filteredCours, setFilteredCours] = useState<Cours[]>(mockCours);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFiliere, setSelectedFiliere] = useState<Filiere | "Toutes">("Toutes");
  const [selectedModule, setSelectedModule] = useState<string>("Tous");
  const [selectedProfesseur, setSelectedProfesseur] = useState<string>("Tous");
  const [isAddingCours, setIsAddingCours] = useState<boolean>(false);
  const [editingCours, setEditingCours] = useState<Cours | null>(null);
  const [viewingCours, setViewingCours] = useState<Cours | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [sortField, setSortField] = useState<keyof Cours>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(6);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showStats, setShowStats] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newCours, setNewCours] = useState<Partial<Cours>>({
    titre: "",
    filiere: "Génie Informatique",
    module: "",
    professeur: "",
    date: format(new Date(), "yyyy-MM-dd"),
    contenu: "",
    documents: [],
    nbEtudiants: 0,
  });

  // Derived states
  const modules = Array.from(new Set(cours.map((c) => c.module)));
  const professeurs = Array.from(new Set(cours.map((c) => c.professeur)));

  const totalPages = Math.ceil(filteredCours.length / itemsPerPage);
  const paginatedCours = filteredCours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Stats calculation
  const coursParFiliere = filieres.map((filiere) => ({
    filiere,
    count: cours.filter((c) => c.filiere === filiere).length,
    etudiants: cours
      .filter((c) => c.filiere === filiere)
      .reduce((sum, c) => sum + (c.nbEtudiants || 0), 0),
  }));

  // Effects
  useEffect(() => {
    filterAndSortCours();
  }, [searchTerm, selectedFiliere, selectedModule, selectedProfesseur, cours, sortField, sortDirection]);

  // Functions
  const filterAndSortCours = () => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...cours];

      if (searchTerm) {
        filtered = filtered.filter(
          (c) =>
            c.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.professeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.module.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (selectedFiliere !== "Toutes") {
        filtered = filtered.filter((c) => c.filiere === selectedFiliere);
      }

      if (selectedModule !== "Tous") {
        filtered = filtered.filter((c) => c.module === selectedModule);
      }

      if (selectedProfesseur !== "Tous") {
        filtered = filtered.filter((c) => c.professeur === selectedProfesseur);
      }

      filtered.sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return sortDirection === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }
        return sortDirection === "asc"
          ? (fieldA as number) - (fieldB as number)
          : (fieldB as number) - (fieldA as number);
      });

      setFilteredCours(filtered);
      setCurrentPage(1);
      setIsLoading(false);
    }, 500);
  };

  const handleSort = (field: keyof Cours) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddCours = () => {
    if (
      newCours.titre &&
      newCours.filiere &&
      newCours.module &&
      newCours.professeur &&
      newCours.date
    ) {
      setIsLoading(true);
      setTimeout(() => {
        const coursToAdd: Cours = {
          ...newCours,
          id: Date.now().toString(),
          documents: newCours.documents || [],
        } as Cours;

        setCours([coursToAdd, ...cours]);
        setIsAddingCours(false);
        setNewCours({
          titre: "",
          filiere: "Génie Informatique",
          module: "",
          professeur: "",
          date: format(new Date(), "yyyy-MM-dd"),
          contenu: "",
          documents: [],
          nbEtudiants: 0,
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleEditCours = () => {
    if (editingCours) {
      setIsLoading(true);
      setTimeout(() => {
        setCours(cours.map((c) => (c.id === editingCours.id ? editingCours : c)));
        setEditingCours(null);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleDeleteCours = (id: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setCours(cours.filter((c) => c.id !== id));
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "new" | "edit",
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          const newDocuments: DocumentFile[] = Array.from(files).map((file) => ({
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            nom: file.name,
            type: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
            taille: formatFileSize(file.size),
            url: "#",
          }));

          if (target === "new") {
            setNewCours((prev) => ({
              ...prev,
              documents: [...(prev.documents || []), ...newDocuments],
            }));
          } else if (target === "edit" && editingCours) {
            setEditingCours((prev) =>
              prev
                ? {
                    ...prev,
                    documents: [...prev.documents, ...newDocuments],
                  }
                : null,
            );
          }
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeDocument = (docId: string, target: "new" | "edit") => {
    if (target === "new") {
      setNewCours((prev) => ({
        ...prev,
        documents: (prev.documents || []).filter((doc) => doc.id !== docId),
      }));
    } else if (target === "edit" && editingCours) {
      setEditingCours((prev) =>
        prev
          ? {
              ...prev,
              documents: prev.documents.filter((doc) => doc.id !== docId),
            }
          : null,
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Render functions
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading && paginatedCours.length === 0
        ? Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))
        : paginatedCours.length > 0
          ? paginatedCours.map((cours) => (
              <Card key={cours.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{cours.titre}</span>
                    <Badge variant="outline">{cours.filiere}</Badge>
                  </CardTitle>
                  <CardDescription>{cours.module}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Professeur:</strong> {cours.professeur}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {format(new Date(cours.date), "dd MMMM yyyy", { locale: fr })}
                    </p>
                    {cours.nbEtudiants && (
                      <p>
                        <strong>Étudiants inscrits:</strong> {cours.nbEtudiants}
                      </p>
                    )}
                    <div>
                      <strong>Documents:</strong> {cours.documents.length}
                      {cours.documents.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {cours.documents.slice(0, 2).map((doc) => (
                            <Badge key={doc.id} variant="secondary" className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="truncate max-w-[100px]">{doc.nom}</span>
                            </Badge>
                          ))}
                          {cours.documents.length > 2 && (
                            <Badge variant="secondary">+{cours.documents.length - 2}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Dialog onOpenChange={(open) => open && setViewingCours(cours)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Info className="mr-2 h-4 w-4" /> Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[725px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{viewingCours?.titre}</DialogTitle>
                          <DialogDescription>
                            {viewingCours?.module} - {viewingCours?.filiere}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Professeur</h4>
                              <p>{viewingCours?.professeur}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Date</h4>
                              <p>
                                {viewingCours?.date &&
                                  format(new Date(viewingCours.date), "dd MMMM yyyy", {
                                    locale: fr,
                                  })}
                              </p>
                            </div>
                            {viewingCours?.nbEtudiants && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Étudiants inscrits</h4>
                                <p>{viewingCours.nbEtudiants}</p>
                              </div>
                            )}
                          </div>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Contenu du cours</h4>
                            <div className="border rounded-md p-4 bg-gray-50">
                              <div
                                dangerouslySetInnerHTML={{ __html: viewingCours?.contenu || "" }}
                              />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Documents</h4>
                            {viewingCours?.documents.length ? (
                              <div className="border rounded-md divide-y">
                                {viewingCours.documents.map((doc) => (
                                  <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-3"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span>{doc.nom}</span>
                                      <Badge variant="outline" className="ml-2">
                                        {doc.type}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-500">{doc.taille}</span>
                                      <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">Aucun document disponible</p>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      onOpenChange={(open) => {
                        if (open) setEditingCours(cours);
                        else setEditingCours(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Modifier le cours</DialogTitle>
                          <DialogDescription>
                            Modifiez les détails du cours ci-dessous.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-titre" className="text-right">
                              Titre
                            </Label>
                            <Input
                              id="edit-titre"
                              value={editingCours?.titre || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditingCours((prev) =>
                                  prev ? { ...prev, titre: e.target.value } : null,
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-filiere" className="text-right">
                              Filière
                            </Label>
                            <Select
                              value={editingCours?.filiere}
                              onValueChange={(value: string) =>
                                setEditingCours((prev) =>
                                  prev ? { ...prev, filiere: value as Filiere } : null,
                                )
                              }
                            >
                              <SelectTrigger id="edit-filiere" className="col-span-3">
                                <SelectValue placeholder="Sélectionner une filière" />
                              </SelectTrigger>
                              <SelectContent>
                                {filieres.map((filiere) => (
                                  <SelectItem key={filiere} value={filiere}>
                                    {filiere}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-module" className="text-right">
                              Module
                            </Label>
                            <Input
                              id="edit-module"
                              value={editingCours?.module || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditingCours((prev) =>
                                  prev ? { ...prev, module: e.target.value } : null,
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-professeur" className="text-right">
                              Professeur
                            </Label>
                            <Input
                              id="edit-professeur"
                              value={editingCours?.professeur || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditingCours((prev) =>
                                  prev ? { ...prev, professeur: e.target.value } : null,
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-date" className="text-right">
                              Date
                            </Label>
                            <Input
                              id="edit-date"
                              type="date"
                              value={editingCours?.date || ""}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditingCours((prev) =>
                                  prev ? { ...prev, date: e.target.value } : null,
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-etudiants" className="text-right">
                              Étudiants
                            </Label>
                            <Input
                              id="edit-etudiants"
                              type="number"
                              value={editingCours?.nbEtudiants || 0}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEditingCours((prev) =>
                                  prev
                                    ? { ...prev, nbEtudiants: Number.parseInt(e.target.value) }
                                    : null,
                                )
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="edit-contenu" className="text-right pt-2">
                              Contenu
                            </Label>
                            <div className="col-span-3">
                              <ReactQuill
                                theme="snow"
                                value={editingCours?.contenu || ""}
                                onChange={(content: string) =>
                                  setEditingCours((prev) =>
                                    prev ? { ...prev, contenu: content } : null,
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Documents</Label>
                            <div className="col-span-3 space-y-4">
                              {editingCours?.documents && editingCours.documents.length > 0 ? (
                                <div className="border rounded-md divide-y">
                                  {editingCours.documents.map((doc) => (
                                    <div
                                      key={doc.id}
                                      className="flex items-center justify-between p-3"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span>{doc.nom}</span>
                                        <Badge variant="outline">{doc.type}</Badge>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">{doc.taille}</span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeDocument(doc.id, "edit")}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500">Aucun document</p>
                              )}
                              <div>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  className="hidden"
                                  multiple
                                  onChange={(e) => handleFileUpload(e, "edit")}
                                  aria-label="Télécharger des documents"
                                />
                                <Button
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-full"
                                >
                                  <UploadCloud className="mr-2 h-4 w-4" />
                                  Télécharger des documents
                                </Button>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                  <div className="mt-2">
                                    <Progress value={uploadProgress} className="h-2" />
                                    <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleEditCours} disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                              </>
                            ) : (
                              "Enregistrer les modifications"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement le
                          cours "{cours.titre}" et toutes les données associées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCours(cours.id)}
                          disabled={isLoading}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Suppression...
                            </>
                          ) : (
                            "Supprimer"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))
          : (
            <div className="col-span-full">
              <Alert title="Aucun cours trouvé">
                <p>
                  Aucun cours ne correspond à vos critères de recherche. Essayez de modifier vos
                  filtres ou d'ajouter un nouveau cours.
                </p>
              </Alert>
            </div>
          )}
    </div>
  );

  const renderTableView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button
                variant="outline"
                className="p-0 font-medium flex items-center gap-1"
                onClick={() => handleSort("titre")}
              >
                Titre
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="outline"
                className="p-0 font-medium flex items-center gap-1"
                onClick={() => handleSort("filiere")}
              >
                Filière
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="outline"
                className="p-0 font-medium flex items-center gap-1"
                onClick={() => handleSort("module")}
              >
                Module
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="outline"
                className="p-0 font-medium flex items-center gap-1"
                onClick={() => handleSort("professeur")}
              >
                Professeur
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="outline"
                className="p-0 font-medium flex items-center gap-1"
                onClick={() => handleSort("date")}
              >
                Date
                <ArrowUpDown className="h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && paginatedCours.length === 0
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-[250px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[50px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px] ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            : paginatedCours.length > 0
              ? paginatedCours.map((cours) => (
                  <TableRow key={cours.id}>
                    <TableCell className="font-medium">{cours.titre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{cours.filiere}</Badge>
                    </TableCell>
                    <TableCell>{cours.module}</TableCell>
                    <TableCell>{cours.professeur}</TableCell>
                    <TableCell>{format(new Date(cours.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {cours.documents.length > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge>{cours.documents.length}</Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <ul className="list-disc list-inside">
                                {cours.documents.map((doc) => (
                                  <li key={doc.id}>{doc.nom}</li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog onOpenChange={(open) => open && setViewingCours(cours)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                              <Info className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[725px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{viewingCours?.titre}</DialogTitle>
                              <DialogDescription>
                                {viewingCours?.module} - {viewingCours?.filiere}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Professeur</h4>
                                  <p>{viewingCours?.professeur}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Date</h4>
                                  <p>
                                    {viewingCours?.date &&
                                      format(new Date(viewingCours.date), "dd MMMM yyyy", {
                                        locale: fr,
                                      })}
                                  </p>
                                </div>
                                {viewingCours?.nbEtudiants && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">Étudiants inscrits</h4>
                                    <p>{viewingCours.nbEtudiants}</p>
                                  </div>
                                )}
                              </div>
                              <div className="mb-4">
                                <h4 className="text-sm font-medium mb-2">Contenu du cours</h4>
                                <div className="border rounded-md p-4 bg-gray-50">
                                  <div
                                    dangerouslySetInnerHTML={{ __html: viewingCours?.contenu || "" }}
                                  />
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Documents</h4>
                                {viewingCours?.documents.length ? (
                                  <div className="border rounded-md divide-y">
                                    {viewingCours.documents.map((doc) => (
                                      <div
                                        key={doc.id}
                                        className="flex items-center justify-between p-3"
                                      >
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-gray-500" />
                                          <span>{doc.nom}</span>
                                          <Badge variant="outline" className="ml-2">
                                            {doc.type}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-gray-500">{doc.taille}</span>
                                          <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500">Aucun document disponible</p>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          onOpenChange={(open) => {
                            if (open) setEditingCours(cours);
                            else setEditingCours(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Modifier le cours</DialogTitle>
                              <DialogDescription>
                                Modifiez les détails du cours ci-dessous.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-titre" className="text-right">
                                  Titre
                                </Label>
                                <Input
                                  id="edit-titre"
                                  value={editingCours?.titre || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingCours((prev) =>
                                      prev ? { ...prev, titre: e.target.value } : null,
                                    )
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-filiere" className="text-right">
                                  Filière
                                </Label>
                                <Select
                                  value={editingCours?.filiere}
                                  onValueChange={(value: string) =>
                                    setEditingCours((prev) =>
                                      prev ? { ...prev, filiere: value as Filiere } : null,
                                    )
                                  }
                                >
                                  <SelectTrigger id="edit-filiere" className="col-span-3">
                                    <SelectValue placeholder="Sélectionner une filière" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {filieres.map((filiere) => (
                                      <SelectItem key={filiere} value={filiere}>
                                        {filiere}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-module" className="text-right">
                                  Module
                                </Label>
                                <Input
                                  id="edit-module"
                                  value={editingCours?.module || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingCours((prev) =>
                                      prev ? { ...prev, module: e.target.value } : null,
                                    )
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-professeur" className="text-right">
                                  Professeur
                                </Label>
                                <Input
                                  id="edit-professeur"
                                  value={editingCours?.professeur || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingCours((prev) =>
                                      prev ? { ...prev, professeur: e.target.value } : null,
                                    )
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-date" className="text-right">
                                  Date
                                </Label>
                                <Input
                                  id="edit-date"
                                  type="date"
                                  value={editingCours?.date || ""}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingCours((prev) =>
                                      prev ? { ...prev, date: e.target.value } : null,
                                    )
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-etudiants" className="text-right">
                                  Étudiants
                                </Label>
                                <Input
                                  id="edit-etudiants"
                                  type="number"
                                  value={editingCours?.nbEtudiants || 0}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEditingCours((prev) =>
                                      prev
                                        ? { ...prev, nbEtudiants: Number.parseInt(e.target.value) }
                                        : null,
                                    )
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="edit-contenu" className="text-right pt-2">
                                  Contenu
                                </Label>
                                <div className="col-span-3">
                                  <ReactQuill
                                    theme="snow"
                                    value={editingCours?.contenu || ""}
                                    onChange={(content: string) =>
                                      setEditingCours((prev) =>
                                        prev ? { ...prev, contenu: content } : null,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Documents</Label>
                                <div className="col-span-3 space-y-4">
                                  {editingCours?.documents && editingCours.documents.length > 0 ? (
                                    <div className="border rounded-md divide-y">
                                      {editingCours.documents.map((doc) => (
                                        <div
                                          key={doc.id}
                                          className="flex items-center justify-between p-3"
                                        >
                                          <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span>{doc.nom}</span>
                                            <Badge variant="outline">{doc.type}</Badge>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">{doc.taille}</span>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => removeDocument(doc.id, "edit")}
                                            >
                                              <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-500">Aucun document</p>
                                  )}
                                  <div>
                                    <input
                                      type="file"
                                      ref={fileInputRef}
                                      className="hidden"
                                      multiple
                                      onChange={(e) => handleFileUpload(e, "edit")}
                                      aria-label="Télécharger des documents"
                                    />
                                    <Button
                                      variant="outline"
                                      onClick={() => fileInputRef.current?.click()}
                                      className="w-full"
                                    >
                                      <UploadCloud className="mr-2 h-4 w-4" />
                                      Télécharger des documents
                                    </Button>
                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                      <div className="mt-2">
                                        <Progress value={uploadProgress} className="h-2" />
                                        <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleEditCours} disabled={isLoading}>
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                  </>
                                ) : (
                                  "Enregistrer les modifications"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Cette action ne peut pas être annulée. Cela supprimera définitivement le
                                cours "{cours.titre}" et toutes les données associées.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCours(cours.id)}
                                disabled={isLoading}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Suppression...
                                  </>
                                ) : (
                                  "Supprimer"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-gray-500">Aucun cours trouvé</p>
                      <p className="text-sm text-gray-500">
                        Essayez de modifier vos filtres ou d'ajouter un nouveau cours.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  );

  const renderStatistics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Cours par filière</CardTitle>
          <CardDescription>Répartition des cours par filière</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursParFiliere
              .filter((item) => item.count > 0)
              .map((item) => (
                <div key={item.filiere} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.filiere}</span>
                    <span className="text-sm text-gray-500">{item.count} cours</span>
                  </div>
                  <Progress value={(item.count / cours.length) * 100} className="h-2" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Étudiants par filière</CardTitle>
          <CardDescription>Nombre d'étudiants inscrits par filière</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursParFiliere
              .filter((item) => item.etudiants > 0)
              .map((item) => (
                <div key={item.filiere} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.filiere}</span>
                    <span className="text-sm text-gray-500">{item.etudiants} étudiants</span>
                  </div>
                  <Progress
                    value={
                      (item.etudiants / coursParFiliere.reduce((sum, i) => sum + i.etudiants, 0)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2CB3C2]">
            Gestion des Filières et Cours
          </h1>
          <p className="text-gray-500">Gérez les cours pour toutes les filières</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)}>
            <BarChart2 className="mr-2 h-4 w-4" />
            {showStats ? "Masquer les statistiques" : "Afficher les statistiques"}
          </Button>
          <Dialog open={isAddingCours} onOpenChange={setIsAddingCours}>
            <DialogTrigger asChild>
              <Button className="bg-[#2CB3C2] text-white hover:bg-[#2CB3C2]/90">
                <Plus className="mr-2 h-4 w-4" /> Ajouter un cours
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau cours</DialogTitle>
                <DialogDescription>Remplissez les détails du nouveau cours ci-dessous.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titre" className="text-right">
                    Titre
                  </Label>
                  <Input
                    id="titre"
                    value={newCours.titre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCours({ ...newCours, titre: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filiere" className="text-right">
                    Filière
                  </Label>
                  <Select
                    value={newCours.filiere}
                    onValueChange={(value: string) =>
                      setNewCours({ ...newCours, filiere: value as Filiere })
                    }
                  >
                    <SelectTrigger id="filiere" className="col-span-3">
                      <SelectValue placeholder="Sélectionner une filière" />
                    </SelectTrigger>
                    <SelectContent>
                      {filieres.map((filiere) => (
                        <SelectItem key={filiere} value={filiere}>
                          {filiere}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="module" className="text-right">
                    Module
                  </Label>
                  <Input
                    id="module"
                    value={newCours.module}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCours({ ...newCours, module: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="professeur" className="text-right">
                    Professeur
                  </Label>
                  <Input
                    id="professeur"
                    value={newCours.professeur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCours({ ...newCours, professeur: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newCours.date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCours({ ...newCours, date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="etudiants" className="text-right">
                    Étudiants
                  </Label>
                  <Input
                    id="etudiants"
                    type="number"
                    value={newCours.nbEtudiants || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCours({ ...newCours, nbEtudiants: Number.parseInt(e.target.value) })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="contenu" className="text-right pt-2">
                    Contenu
                  </Label>
                  <div className="col-span-3">
                    <ReactQuill
                      theme="snow"
                      value={newCours.contenu}
                      onChange={(content: string) => setNewCours({ ...newCours, contenu: content })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Documents</Label>
                  <div className="col-span-3 space-y-4">
                    {newCours.documents && newCours.documents.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {newCours.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span>{doc.nom}</span>
                              <Badge variant="outline">{doc.type}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{doc.taille}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeDocument(doc.id, "new")}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Aucun document</p>
                    )}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileUpload(e, "new")}
                        aria-label="Télécharger des documents"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Télécharger des documents
                      </Button>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-center mt-1">{uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddCours}
                  disabled={isLoading}
                  className="bg-[#2CB3C2] text-white hover:bg-[#2CB3C2]/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ajout en cours...
                    </>
                  ) : (
                    "Ajouter le cours"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showStats && renderStatistics()}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Rechercher un cours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Select
            value={selectedFiliere}
            onValueChange={(value: string) => setSelectedFiliere(value as Filiere | "Toutes")}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Toutes">Toutes les filières</SelectItem>
              {filieres.map((filiere) => (
                <SelectItem key={filiere} value={filiere}>
                  {filiere}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les modules</SelectItem>
              {modules.map((module) => (
                <SelectItem key={module} value={module}>
                  {module}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedProfesseur} onValueChange={setSelectedProfesseur}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Professeur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Tous les professeurs</SelectItem>
              {professeurs.map((prof) => (
                <SelectItem key={prof} value={prof}>
                  {prof}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 border rounded-md">
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className={viewMode === "cards" ? "bg-[#2CB3C2] text-white rounded-l-md" : "rounded-l-md"}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? "bg-[#2CB3C2] text-white rounded-r-md" : "rounded-r-md"}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "cards" ? renderCardView() : renderTableView()}

      {filteredCours.length > 0 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNumber)}
                      isActive={currentPage === pageNumber}
                      className={currentPage === pageNumber ? "bg-[#2CB3C2] text-white" : ""}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(totalPages)}
                      isActive={currentPage === totalPages}
                      className={currentPage === totalPages ? "bg-[#2CB3C2] text-white" : ""}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Filieres;