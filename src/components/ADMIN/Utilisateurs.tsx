"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Search,
  Download,
  Trash2,
  Edit,
  UserPlus,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  User,
  Users,
  GraduationCap,
  Clock,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
} from "lucide-react"
import edutechLogo from "../../assets/mag.jpg"

// Types
type UserRole = "admin" | "professeur" | "etudiant"
type UserStatus = "actif" | "inactif" | "suspendu" | "en attente"
type UserGender = "homme" | "femme" | "autre"

interface UserActivity {
  id: string
  action: string
  date: string
  details: string
  ip?: string
}

interface UserType {
  id: string
  nom: string
  prenom: string
  email: string
  role: UserRole
  filiere?: string
  status: UserStatus
  dateInscription: string
  derniereConnexion: string
  telephone?: string
  adresse?: string
  dateNaissance?: string
  genre?: UserGender
  photo: string
  activites: UserActivity[]
}

// Composants UI
interface CardProps {
  className?: string
  children: React.ReactNode
}

const Card = ({ className = "", children, ...props }: CardProps) => (
  <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
    {children}
  </div>
)

interface CardContentProps {
  className?: string
  children: React.ReactNode
}

const CardContent = ({ className = "", children, ...props }: CardContentProps) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
)

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "success" | "warning" | "ghost"
  size?: "sm" | "md" | "lg" | "icon"
  className?: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

const Button = ({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-[#2CB3C2] hover:bg-[#259aa6] text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    ghost: "hover:bg-gray-100 text-gray-700",
  }

  const sizes = {
    sm: "text-xs px-2 py-1 rounded",
    md: "text-sm px-4 py-2 rounded-md",
    lg: "text-base px-6 py-3 rounded-lg",
    icon: "p-2 rounded-full",
  }

  return (
    <button className={`font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "outline"
  className?: string
  children: React.ReactNode
}

const Badge = ({ variant = "default", className = "", children, ...props }: BadgeProps) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-[#2CB3C2] text-white",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = ({ className = "", ...props }: InputProps) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] focus:border-[#2CB3C2] ${className}`}
    {...props}
  />
)

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
  children: React.ReactNode
}

const Select = ({ className = "", children, ...props }: SelectProps) => (
  <select
    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] focus:border-[#2CB3C2] ${className}`}
    {...props}
  >
    {children}
  </select>
)

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const Modal = ({ isOpen, onClose, title, children, size = "md" }: ModalProps) => {
  if (!isOpen) return null

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-lg w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ComponentType<{ className?: string }> }[]
  activeTab: string
  onChange: (id: string) => void
}

const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  return (
    <div className="border-b">
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "border-b-2 border-[#2CB3C2] text-[#2CB3C2]" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4 mr-2 inline" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface AlertProps {
  variant?: "default" | "warning" | "danger" | "success"
  title?: string
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

const Alert = ({ variant = "default", title, children, onClose, className = "" }: AlertProps) => {
  const variants = {
    default: "bg-[#2CB3C2]/10 text-[#2CB3C2] border-[#2CB3C2]/20",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-red-50 text-red-800 border-red-200",
    success: "bg-green-50 text-green-800 border-green-200",
  }

  return (
    <div className={`p-4 rounded-md border ${variants[variant]} ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          {title && <h4 className="text-sm font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Données d'exemple adaptées à Unipro
const generateUsers = (count: number): UserType[] => {
  const roles: UserRole[] = ["admin", "professeur", "etudiant"]
  const statuses: UserStatus[] = ["actif", "inactif", "suspendu", "en attente"]
  const filieres = [
    "Informatique",
    "Mathématiques",
    "Physique",
    "Chimie",
    "Biologie",
    "Économie",
    "Droit",
    "Lettres",
    "Médecine",
    "Génie Civil",
  ]
  const genres: UserGender[] = ["homme", "femme", "autre"]
  const nomsSenegalais = ["Diouf", "Ndiaye", "Sarr", "Fall", "Ba", "Sow", "Gueye", "Diallo", "Mbaye", "Thiam"]
  const prenomsSenegalais = [
    "Mamadou",
    "Fatou",
    "Aminata",
    "Ousmane",
    "Seydou",
    "Khady",
    "Ibrahima",
    "Awa",
    "Cheikh",
    "Ndèye",
  ]
  const quartiersDakar = [
    "Médina",
    "Plateau",
    "Yoff",
    "Fann",
    "Point E",
    "Grand Dakar",
    "Parcelles Assainies",
    "Sicap",
    "Hann",
    "Liberté",
  ]

  const users: UserType[] = []

  for (let i = 1; i <= count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const filiere = filieres[Math.floor(Math.random() * filieres.length)]
    const genre = genres[Math.floor(Math.random() * genres.length)]
    const nom = nomsSenegalais[Math.floor(Math.random() * nomsSenegalais.length)]
    const prenom = prenomsSenegalais[Math.floor(Math.random() * prenomsSenegalais.length)]

    const activities: UserActivity[] = []
    const activityCount = Math.floor(Math.random() * 10) + 1

    for (let j = 1; j <= activityCount; j++) {
      const actions = [
        "Connexion",
        "Déconnexion",
        "Modification du profil",
        "Changement de mot de passe",
        "Inscription à un cours",
        "Soumission d’un devoir",
        "Participation à un forum",
        "Téléchargement d’un document",
        "Création d’un événement",
        "Modification d’un cours",
      ]

      const action = actions[Math.floor(Math.random() * actions.length)]
      const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]

      activities.push({
        id: `activity-${i}-${j}`,
        action,
        date,
        details: `Détails de l’action: ${action}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      })
    }

    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    users.push({
      id: `user-${i}`,
      nom,
      prenom,
      email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@unipro.sn`,
      role,
      filiere: role === "etudiant" || role === "professeur" ? filiere : undefined,
      status,
      dateInscription: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      derniereConnexion: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      telephone: `+221 ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
      adresse: `${Math.floor(Math.random() * 100)} Rue ${quartiersDakar[Math.floor(Math.random() * quartiersDakar.length)]}, Dakar, Sénégal`,
      dateNaissance: new Date(Date.now() - (18 + Math.floor(Math.random() * 40)) * 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      genre,
      photo: edutechLogo, // Corrigé ici
      activites: activities,
    })
  }

  return users
}

// Composant principal
const Utilisateurs: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [roleSelectionStep, setRoleSelectionStep] = useState(true)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [activeTab, setActiveTab] = useState("informations")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ role: "", filiere: "", status: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserType
    direction: "ascending" | "descending"
  }>({ key: "nom", direction: "ascending" })
  const [alert, setAlert] = useState<{
    show: boolean
    message: string
    variant: "default" | "warning" | "danger" | "success"
  }>({ show: false, message: "", variant: "default" })

  useEffect(() => {
    const data = generateUsers(100)
    setUsers(data)
    setFilteredUsers(data)
  }, [])

  useEffect(() => {
    let result = [...users]
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (user) =>
          user.nom.toLowerCase().includes(term) ||
          user.prenom.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term),
      )
    }
    if (filters.role) result = result.filter((user) => user.role === filters.role)
    if (filters.filiere) result = result.filter((user) => user.filiere === filters.filiere)
    if (filters.status) result = result.filter((user) => user.status === filters.status)

    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1
      return 0
    })

    setFilteredUsers(result)
    setCurrentPage(1)
  }, [users, searchTerm, filters, sortConfig])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

  const handleSort = (key: keyof UserType) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending"
    setSortConfig({ key, direction })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
      setIsDeleteModalOpen(false)
      setAlert({
        show: true,
        message: `L'utilisateur ${selectedUser.prenom} ${selectedUser.nom} a été supprimé avec succès.`,
        variant: "success",
      })
      setTimeout(() => setAlert({ show: false, message: "", variant: "default" }), 3000)
    }
  }

  const handleToggleUserStatus = (user: UserType) => {
    const newStatus: UserStatus = user.status === "actif" ? "inactif" : "actif"
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))
    setAlert({
      show: true,
      message: `Le statut de ${user.prenom} ${user.nom} a été changé en "${newStatus}".`,
      variant: "success",
    })
    setTimeout(() => setAlert({ show: false, message: "", variant: "default" }), 3000)
  }

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedUser) return

    const formData = new FormData(e.currentTarget)
    const updatedUser: UserType = {
      ...selectedUser,
      nom: formData.get("nom") as string,
      prenom: formData.get("prenom") as string,
      email: formData.get("email") as string,
      role: selectedUser.role,
      filiere: (formData.get("filiere") as string) || undefined,
      status: formData.get("status") as UserStatus,
      telephone: (formData.get("telephone") as string) || undefined,
      adresse: (formData.get("adresse") as string) || undefined,
      dateNaissance: (formData.get("dateNaissance") as string) || undefined,
      genre: (formData.get("genre") as UserGender) || undefined,
    }

    setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)))
    setIsEditModalOpen(false)
    setAlert({
      show: true,
      message: `Les informations de ${selectedUser.prenom} ${selectedUser.nom} ont été mises à jour.`,
      variant: "success",
    })
    setTimeout(() => setAlert({ show: false, message: "", variant: "default" }), 3000)
  }

  const handleAddUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newUser: UserType = {
      id: `user-${users.length + 1}`,
      nom: formData.get("nom") as string,
      prenom: formData.get("prenom") as string,
      email: formData.get("email") as string,
      role: selectedRole as UserRole,
      filiere: (formData.get("filiere") as string) || undefined,
      status: formData.get("status") as UserStatus,
      dateInscription: new Date().toISOString().split("T")[0],
      derniereConnexion: new Date().toISOString().split("T")[0],
      telephone: (formData.get("telephone") as string) || undefined,
      adresse: (formData.get("adresse") as string) || undefined,
      dateNaissance: (formData.get("dateNaissance") as string) || undefined,
      genre: (formData.get("genre") as UserGender) || undefined,
      photo: edutechLogo, // Corrigé ici
      activites: [],
    }
    setUsers((prev) => [newUser, ...prev])
    setIsAddModalOpen(false)
    setRoleSelectionStep(true)
    setSelectedRole(null)
    setAlert({
      show: true,
      message: "Nouvel utilisateur ajouté avec succès.",
      variant: "success",
    })
    setTimeout(() => setAlert({ show: false, message: "", variant: "default" }), 3000)
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setRoleSelectionStep(false)
  }

  const handleBackToRoleSelection = () => {
    setRoleSelectionStep(true)
  }

  const openAddUserModal = () => {
    setRoleSelectionStep(true)
    setSelectedRole(null)
    setIsAddModalOpen(true)
  }

  const handleResetFilters = () => {
    setFilters({ role: "", filiere: "", status: "" })
    setSearchTerm("")
    setFilteredUsers(users)
    setCurrentPage(1)
    setAlert({
      show: true,
      message: "Les filtres ont été réinitialisés.",
      variant: "success",
    })
    setTimeout(() => setAlert({ show: false, message: "", variant: "default" }), 3000)
  }

  const handleExport = () => {
    const csvContent = [
      [
        "ID",
        "Prénom",
        "Nom",
        "Email",
        "Rôle",
        "Filière",
        "Statut",
        "Date d'inscription",
        "Dernière connexion",
        "Téléphone",
        "Adresse",
        "Date de naissance",
        "Genre",
      ],
      ...filteredUsers.map((user) => [
        user.id,
        user.prenom,
        user.nom,
        user.email,
        user.role,
        user.filiere || "",
        user.status,
        user.dateInscription,
        user.derniereConnexion,
        user.telephone || "",
        user.adresse || "",
        user.dateNaissance || "",
        user.genre || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "utilisateurs_unipro.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setAlert({
      show: true,
      message: "Les données ont été exportées avec succès.",
      variant: "success",
    })
    setTimeout(() => setAlert({ show: false, message: "", variant: "default" }), 3000)
  }

  const stats = {
    total: users.length,
    actifs: users.filter((user) => user.status === "actif").length,
    inactifs: users.filter((user) => user.status === "inactif").length,
    admins: users.filter((user) => user.role === "admin").length,
    professeurs: users.filter((user) => user.role === "professeur").length,
    etudiants: users.filter((user) => user.role === "etudiant").length,
  }

  const uniqueFilieres = Array.from(
    new Set(users.filter((user) => user.filiere !== undefined).map((user) => user.filiere as string))
  )

  const getUserStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "actif":
        return <Badge variant="success">Actif</Badge>
      case "inactif":
        return <Badge variant="danger">Inactif</Badge>
      case "suspendu":
        return <Badge variant="warning">Suspendu</Badge>
      case "en attente":
        return <Badge variant="outline">En attente</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getUserRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "professeur":
        return <User className="h-4 w-4 text-[#2CB3C2]" />
      case "etudiant":
        return <GraduationCap className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getUserRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Administrateur"
      case "professeur":
        return "Professeur"
      case "etudiant":
        return "Étudiant"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 md:p-6">
        <header className="bg-white border-b mb-6 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs - Unipro</h1>
            <Button onClick={openAddUserModal} className="flex items-center">
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
        </header>

        {alert.show && (
          <Alert
            variant={alert.variant}
            onClose={() => setAlert({ show: false, message: "", variant: "default" })}
            className="mb-4"
          >
            {alert.message}
          </Alert>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-6 w-6 text-[#2CB3C2] mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats.actifs}</div>
              <div className="text-xs text-gray-500">Actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <XCircle className="h-6 w-6 text-red-500 mb-2" />
              <div className="text-2xl font-bold">{stats.inactifs}</div>
              <div className="text-xs text-gray-500">Inactifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Shield className="h-6 w-6 text-purple-500 mb-2" />
              <div className="text-2xl font-bold">{stats.admins}</div>
              <div className="text-xs text-gray-500">Administrateurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <User className="h-6 w-6 text-[#2CB3C2] mb-2" />
              <div className="text-2xl font-bold">{stats.professeurs}</div>
              <div className="text-xs text-gray-500">Professeurs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <GraduationCap className="h-6 w-6 text-green-500 mb-2" />
              <div className="text-2xl font-bold">{stats.etudiants}</div>
              <div className="text-xs text-gray-500">Étudiants</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <Select name="role" value={filters.role} onChange={handleFilterChange}>
                <option value="">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="professeur">Professeurs</option>
                <option value="etudiant">Étudiants</option>
              </Select>
              <Select name="filiere" value={filters.filiere} onChange={handleFilterChange}>
                <option value="">Toutes les filières</option>
                {uniqueFilieres.map((filiere) => (
                  <option key={filiere} value={filiere}>
                    {filiere}
                  </option>
                ))}
              </Select>
              <Select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
                <option value="en attente">En attente</option>
              </Select>
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">{filteredUsers.length} utilisateur(s) trouvé(s)</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réinitialiser les filtres
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort("nom")}>
                      Nom
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort("role")}>
                      Rôle
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filière
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort("status")}>
                      Statut
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center" onClick={() => handleSort("derniereConnexion")}>
                      Dernière connexion
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.photo || "/placeholder.svg"}
                            alt={`${user.prenom} ${user.nom}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {getUserRoleIcon(user.role)}
                        <span className="ml-1 text-sm text-gray-900">{getUserRoleLabel(user.role)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.filiere || "-"}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{getUserStatusBadge(user.status)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.derniereConnexion}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewUser(user)}
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)} title="Modifier">
                          <Edit className="h-4 w-4 text-[#2CB3C2]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleUserStatus(user)}
                          title={user.status === "actif" ? "Désactiver" : "Activer"}
                        >
                          {user.status === "actif" ? (
                            <EyeOff className="h-4 w-4 text-amber-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)} title="Supprimer">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{" "}
                    <span className="font-medium">
                      {indexOfLastItem > filteredUsers.length ? filteredUsers.length : indexOfLastItem}
                    </span>{" "}
                    sur <span className="font-medium">{filteredUsers.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-l-md"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="hidden md:inline-flex"
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-r-md"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>

      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={`Détails de l'utilisateur: ${selectedUser?.prenom} ${selectedUser?.nom}`}
        size="lg"
      >
        {selectedUser && (
          <div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                  <img
                    src={selectedUser.photo || "/placeholder.svg"}
                    alt={`${selectedUser.prenom} ${selectedUser.nom}`}
                    className="h-32 w-32 rounded-full mb-4"
                  />
                  <h3 className="text-xl font-medium">
                    {selectedUser.prenom} {selectedUser.nom}
                  </h3>
                  <div className="flex items-center mt-1">
                    {getUserRoleIcon(selectedUser.role)}
                    <span className="ml-1 text-sm text-gray-600">{getUserRoleLabel(selectedUser.role)}</span>
                  </div>
                  <div className="mt-2">{getUserStatusBadge(selectedUser.status)}</div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm">{selectedUser.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Téléphone</div>
                      <div className="text-sm">{selectedUser.telephone || "Non renseigné"}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Date de naissance</div>
                      <div className="text-sm">{selectedUser.dateNaissance || "Non renseignée"}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-xs text-gray-500">Adresse</div>
                      <div className="text-sm">{selectedUser.adresse || "Non renseignée"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <Tabs
                  tabs={[
                    { id: "informations", label: "Informations", icon: FileText },
                    { id: "activites", label: "Activités", icon: Clock },
                  ]}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                />
                <div className="mt-4">
                  {activeTab === "informations" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Filière</div>
                          <div className="text-sm font-medium">{selectedUser.filiere || "Non applicable"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Genre</div>
                          <div className="text-sm font-medium">
                            {selectedUser.genre === "homme"
                              ? "Homme"
                              : selectedUser.genre === "femme"
                                ? "Femme"
                                : selectedUser.genre === "autre"
                                  ? "Autre"
                                  : "Non renseigné"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Date d'inscription</div>
                          <div className="text-sm font-medium">{selectedUser.dateInscription}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Dernière connexion</div>
                          <div className="text-sm font-medium">{selectedUser.derniereConnexion}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Actions rapides</div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditUser(selectedUser)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant={selectedUser.status === "actif" ? "warning" : "success"}
                            size="sm"
                            onClick={() => handleToggleUserStatus(selectedUser)}
                          >
                            {selectedUser.status === "actif" ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Activer
                              </>
                            )}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(selectedUser)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "activites" && (
                    <div>
                      <div className="text-sm text-gray-500 mb-4">Historique des activités de l'utilisateur</div>
                      {selectedUser.activites.length > 0 ? (
                        <div className="space-y-3">
                          {selectedUser.activites.map((activity) => (
                            <div key={activity.id} className="flex items-start p-3 border rounded-md">
                              <div className="h-8 w-8 rounded-full bg-[#2CB3C2]/10 flex items-center justify-center text-[#2CB3C2] mr-3">
                                <Clock className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div className="font-medium">{activity.action}</div>
                                  <div className="text-sm text-gray-500">{activity.date}</div>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{activity.details}</div>
                                {activity.ip && <div className="text-xs text-gray-500 mt-1">IP: {activity.ip}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">Aucune activité enregistrée</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Modifier l'utilisateur: ${selectedUser?.prenom} ${selectedUser?.nom}`}
        size="lg"
      >
        {selectedUser && (
          <form onSubmit={handleSaveUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <Input type="text" name="prenom" defaultValue={selectedUser.prenom} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <Input type="text" name="nom" defaultValue={selectedUser.nom} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" name="email" defaultValue={selectedUser.email} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <Input type="tel" name="telephone" defaultValue={selectedUser.telephone} />
              </div>

              {selectedUser.role === "admin" && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'accès</label>
                    <Select name="access_level" defaultValue="complet">
                      <option value="complet">Accès complet</option>
                      <option value="limité">Accès limité</option>
                      <option value="lecture">Lecture seule</option>
                    </Select>
                  </div>
                </>
              )}

              {selectedUser.role === "professeur" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    <Select name="filiere" defaultValue={selectedUser.filiere} required>
                      <option value="">Sélectionner une filière</option>
                      {uniqueFilieres.map((filiere) => (
                        <option key={filiere} value={filiere}>
                          {filiere}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                    <Input type="text" name="specialite" defaultValue="" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <Select name="grade" defaultValue="">
                      <option value="">Sélectionner un grade</option>
                      <option value="assistant">Assistant</option>
                      <option value="maitre_assistant">Maître assistant</option>
                      <option value="maitre_conference">Maître de conférence</option>
                      <option value="professeur">Professeur titulaire</option>
                    </Select>
                  </div>
                </>
              )}

              {selectedUser.role === "etudiant" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    <Select name="filiere" defaultValue={selectedUser.filiere} required>
                      <option value="">Sélectionner une filière</option>
                      {uniqueFilieres.map((filiere) => (
                        <option key={filiere} value={filiere}>
                          {filiere}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <Select name="niveau" defaultValue="">
                      <option value="">Sélectionner un niveau</option>
                      <option value="licence1">Licence 1</option>
                      <option value="licence2">Licence 2</option>
                      <option value="licence3">Licence 3</option>
                      <option value="master1">Master 1</option>
                      <option value="master2">Master 2</option>
                      <option value="doctorat">Doctorat</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'étudiant</label>
                    <Input type="text" name="numero_etudiant" defaultValue="" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <Select name="status" defaultValue={selectedUser.status} required>
                  <option value="">Sélectionner un statut</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="en attente">En attente</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <Input type="date" name="dateNaissance" defaultValue={selectedUser.dateNaissance} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <Select name="genre" defaultValue={selectedUser.genre || ""}>
                  <option value="">Non renseigné</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <Input type="text" name="adresse" defaultValue={selectedUser.adresse} />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setRoleSelectionStep(true)
          setSelectedRole(null)
        }}
        title={
          roleSelectionStep
            ? "Sélectionner un type d'utilisateur"
            : `Ajouter un ${getUserRoleLabel(selectedRole as UserRole).toLowerCase()}`
        }
        size="lg"
      >
        {roleSelectionStep ? (
          <div className="py-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Quel type d'utilisateur souhaitez-vous ajouter ?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Veuillez sélectionner le type d'utilisateur que vous souhaitez créer
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => handleRoleSelect("admin")}
                className="border rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 hover:border-[#2CB3C2] transition-colors"
              >
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-red-500" />
                </div>
                <h4 className="text-lg font-medium">Administrateur</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Gestion complète de la plateforme</p>
              </div>
              <div
                onClick={() => handleRoleSelect("professeur")}
                className="border rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 hover:border-[#2CB3C2] transition-colors"
              >
                <div className="h-16 w-16 rounded-full bg-[#2CB3C2]/10 flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-[#2CB3C2]" />
                </div>
                <h4 className="text-lg font-medium">Professeur</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Gestion des cours et des étudiants</p>
              </div>
              <div
                onClick={() => handleRoleSelect("etudiant")}
                className="border rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-50 hover:border-[#2CB3C2] transition-colors"
              >
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="text-lg font-medium">Étudiant</h4>
                <p className="text-sm text-gray-500 text-center mt-2">Accès aux cours et aux ressources</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddUserSubmit}>
            <div className="mb-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBackToRoleSelection}
                className="flex items-center text-gray-500"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour à la sélection
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <Input type="text" name="prenom" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <Input type="text" name="nom" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" name="email" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <Input type="tel" name="telephone" />
              </div>

              {selectedRole === "admin" && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'accès</label>
                    <Select name="access_level">
                      <option value="complet">Accès complet</option>
                      <option value="limité">Accès limité</option>
                      <option value="lecture">Lecture seule</option>
                    </Select>
                  </div>
                </>
              )}

              {selectedRole === "professeur" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    <Select name="filiere" required>
                      <option value="">Sélectionner une filière</option>
                      {uniqueFilieres.map((filiere) => (
                        <option key={filiere} value={filiere}>
                          {filiere}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                    <Input type="text" name="specialite" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                    <Select name="grade">
                      <option value="">Sélectionner un grade</option>
                      <option value="assistant">Assistant</option>
                      <option value="maitre_assistant">Maître assistant</option>
                      <option value="maitre_conference">Maître de conférence</option>
                      <option value="professeur">Professeur titulaire</option>
                    </Select>
                  </div>
                </>
              )}

              {selectedRole === "etudiant" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
                    <Select name="filiere" required>
                      <option value="">Sélectionner une filière</option>
                      {uniqueFilieres.map((filiere) => (
                        <option key={filiere} value={filiere}>
                          {filiere}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                    <Select name="niveau">
                      <option value="">Sélectionner un niveau</option>
                      <option value="licence1">Licence 1</option>
                      <option value="licence2">Licence 2</option>
                      <option value="licence3">Licence 3</option>
                      <option value="master1">Master 1</option>
                      <option value="master2">Master 2</option>
                      <option value="doctorat">Doctorat</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numéro d'étudiant</label>
                    <Input type="text" name="numero_etudiant" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <Select name="status" required>
                  <option value="">Sélectionner un statut</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="suspendu">Suspendu</option>
                  <option value="en attente">En attente</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <Input type="date" name="dateNaissance" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <Select name="genre">
                  <option value="">Non renseigné</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <Input type="text" name="adresse" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setRoleSelectionStep(true)
                  setSelectedRole(null)
                }}
              >
                Annuler
              </Button>
              <Button type="submit">Ajouter l'utilisateur</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        {selectedUser && (
          <div>
            <Alert variant="danger" className="mb-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mb-2" />
              Vous êtes sur le point de supprimer définitivement cet utilisateur. Cette action ne peut pas être annulée.
            </Alert>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer l'utilisateur
              <strong>
                {selectedUser.prenom} {selectedUser.nom}
              </strong>
              ?
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDeleteUser}>
                Supprimer définitivement
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Utilisateurs