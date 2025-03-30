"use client"

import type React from "react"
import { useState, useEffect, useReducer, createContext, useContext } from "react"
import {
  Settings,
  Users,
  Shield,
  Bell,
  Calendar,
  Lock,
  Eye,
  Trash,
  Plus,
  Edit,
  Check,
  X,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  Info,
  Search,
  Clock,
} from "lucide-react"

// ============= Types =============
type Role = "admin" | "teacher" | "assistant" | "student" | "guest"

type Permission = {
  id: string
  name: string
  description: string
  category: "content" | "users" | "settings" | "classes" | "recordings" | "chat"
}

type RoleDefinition = {
  id: string
  name: string
  description: string
  permissions: string[] // IDs of permissions
  userCount: number
  isDefault?: boolean
  isSystem?: boolean
  color: string
}

type User = {
  id: string
  name: string
  email: string
  role: string
  lastLogin?: Date
  status: "active" | "inactive" | "pending" | "blocked"
  avatar?: string
}

type SecuritySetting = {
  id: string
  name: string
  description: string
  value: string | number | boolean
  type: "text" | "number" | "boolean" | "select"
  options?: string[]
  category: "authentication" | "session" | "password" | "access" | "audit"
}

type NotificationChannel = "email" | "sms" | "push" | "in-app"

type NotificationSetting = {
  id: string
  name: string
  description: string
  enabled: boolean
  channels: NotificationChannel[]
  userRoles: string[] // Which roles receive this notification
}

type IntegrationSetting = {
  id: string
  name: string
  description: string
  enabled: boolean
  apiKey?: string
  refreshToken?: string
  lastSync?: Date
  syncFrequency?: "manual" | "hourly" | "daily" | "weekly"
  status: "connected" | "disconnected" | "error" | "pending"
}

type AuditLogEntry = {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  details?: string
}

// ============= Mock Data =============
const mockPermissions: Permission[] = [
  { id: "p1", name: "Voir les classes", description: "Peut voir la liste des classes", category: "classes" },
  { id: "p2", name: "Créer des classes", description: "Peut créer de nouvelles classes", category: "classes" },
  { id: "p3", name: "Modifier des classes", description: "Peut modifier les classes existantes", category: "classes" },
  { id: "p4", name: "Supprimer des classes", description: "Peut supprimer des classes", category: "classes" },
  { id: "p5", name: "Gérer les utilisateurs", description: "Peut gérer tous les utilisateurs", category: "users" },
  { id: "p6", name: "Voir les enregistrements", description: "Peut voir les enregistrements", category: "recordings" },
  {
    id: "p7",
    name: "Télécharger les enregistrements",
    description: "Peut télécharger les enregistrements",
    category: "recordings",
  },
  { id: "p8", name: "Gérer les paramètres", description: "Peut modifier les paramètres système", category: "settings" },
  {
    id: "p9",
    name: "Voir les statistiques",
    description: "Peut voir les statistiques et rapports",
    category: "content",
  },
  { id: "p10", name: "Modérer le chat", description: "Peut modérer les messages du chat", category: "chat" },
  { id: "p11", name: "Supprimer des messages", description: "Peut supprimer des messages du chat", category: "chat" },
  {
    id: "p12",
    name: "Voir l'historique du chat",
    description: "Peut voir l'historique complet du chat",
    category: "chat",
  },
]

const mockRoles: RoleDefinition[] = [
  {
    id: "r1",
    name: "Administrateur",
    description: "Accès complet à toutes les fonctionnalités",
    permissions: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12"],
    userCount: 3,
    isSystem: true,
    color: "bg-red-100 text-red-800",
  },
  {
    id: "r2",
    name: "Enseignant",
    description: "Peut gérer ses propres classes et voir les statistiques",
    permissions: ["p1", "p2", "p3", "p6", "p7", "p9", "p10", "p11", "p12"],
    userCount: 12,
    isDefault: false,
    color: "bg-cyan-100 text-cyan-800",
  },
  {
    id: "r3",
    name: "Assistant",
    description: "Peut aider à gérer les classes et modérer le chat",
    permissions: ["p1", "p6", "p10", "p11", "p12"],
    userCount: 8,
    isDefault: false,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "r4",
    name: "Étudiant",
    description: "Accès limité aux classes et au contenu",
    permissions: ["p1", "p6", "p12"],
    userCount: 156,
    isDefault: true,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "r5",
    name: "Invité",
    description: "Accès en lecture seule aux classes publiques",
    permissions: ["p1"],
    userCount: 27,
    isDefault: false,
    color: "bg-gray-100 text-gray-800",
  },
]

const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => {
  const roles = ["r1", "r2", "r3", "r4", "r5"]
  const statuses: ("active" | "inactive" | "pending" | "blocked")[] = ["active", "inactive", "pending", "blocked"]

  return {
    id: `u${i + 1}`,
    name: `Utilisateur ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    lastLogin: i % 3 === 0 ? undefined : new Date(Date.now() - Math.random() * 10000000000),
    status: statuses[i % statuses.length],
  }
})

const mockSecuritySettings: SecuritySetting[] = [
  {
    id: "s1",
    name: "Durée de session",
    description: "Durée de validité d'une session en minutes",
    value: 60,
    type: "number",
    category: "session",
  },
  {
    id: "s2",
    name: "Nombre maximum de tentatives de connexion",
    description: "Nombre maximum de tentatives avant blocage temporaire",
    value: 5,
    type: "number",
    category: "authentication",
  },
  {
    id: "s3",
    name: "Durée de blocage après échec",
    description: "Durée de blocage en minutes après échec d'authentification",
    value: 15,
    type: "number",
    category: "authentication",
  },
  {
    id: "s4",
    name: "Authentification à deux facteurs",
    description: "Exiger l'authentification à deux facteurs pour tous les utilisateurs",
    value: false,
    type: "boolean",
    category: "authentication",
  },
  {
    id: "s5",
    name: "Complexité du mot de passe",
    description: "Niveau de complexité requis pour les mots de passe",
    value: "medium",
    type: "select",
    options: ["low", "medium", "high", "very-high"],
    category: "password",
  },
  {
    id: "s6",
    name: "Expiration du mot de passe",
    description: "Nombre de jours avant expiration du mot de passe (0 = jamais)",
    value: 90,
    type: "number",
    category: "password",
  },
  {
    id: "s7",
    name: "Historique des mots de passe",
    description: "Nombre de mots de passe précédents interdits à la réutilisation",
    value: 5,
    type: "number",
    category: "password",
  },
  {
    id: "s8",
    name: "Journalisation des activités",
    description: "Activer la journalisation détaillée des activités des utilisateurs",
    value: true,
    type: "boolean",
    category: "audit",
  },
  {
    id: "s9",
    name: "Restriction d'accès par IP",
    description: "Restreindre l'accès à certaines plages d'adresses IP",
    value: false,
    type: "boolean",
    category: "access",
  },
  {
    id: "s10",
    name: "Déconnexion automatique après inactivité",
    description: "Déconnecter l'utilisateur après une période d'inactivité (minutes)",
    value: 30,
    type: "number",
    category: "session",
  },
]

const mockNotificationSettings: NotificationSetting[] = [
  {
    id: "n1",
    name: "Nouvelle classe programmée",
    description: "Notification lorsqu'une nouvelle classe est programmée",
    enabled: true,
    channels: ["email", "in-app"],
    userRoles: ["r1", "r2", "r3", "r4"],
  },
  {
    id: "n2",
    name: "Rappel de classe",
    description: "Rappel avant le début d'une classe",
    enabled: true,
    channels: ["email", "push", "in-app"],
    userRoles: ["r1", "r2", "r3", "r4"],
  },
  {
    id: "n3",
    name: "Classe annulée",
    description: "Notification lorsqu'une classe est annulée",
    enabled: true,
    channels: ["email", "sms", "push", "in-app"],
    userRoles: ["r1", "r2", "r3", "r4"],
  },
  {
    id: "n4",
    name: "Nouvel enregistrement disponible",
    description: "Notification lorsqu'un nouvel enregistrement est disponible",
    enabled: true,
    channels: ["email", "in-app"],
    userRoles: ["r1", "r2", "r3", "r4"],
  },
  {
    id: "n5",
    name: "Nouveau message privé",
    description: "Notification lors de la réception d'un message privé",
    enabled: true,
    channels: ["email", "push", "in-app"],
    userRoles: ["r1", "r2", "r3", "r4"],
  },
  {
    id: "n6",
    name: "Alerte de sécurité",
    description: "Notification en cas d'activité suspecte sur le compte",
    enabled: true,
    channels: ["email", "sms"],
    userRoles: ["r1", "r2", "r3", "r4", "r5"],
  },
  {
    id: "n7",
    name: "Rapport hebdomadaire",
    description: "Résumé hebdomadaire des activités",
    enabled: false,
    channels: ["email"],
    userRoles: ["r1", "r2"],
  },
]

const mockIntegrationSettings: IntegrationSetting[] = [
  {
    id: "i1",
    name: "Google Agenda",
    description: "Synchronisation avec Google Agenda",
    enabled: true,
    apiKey: "AIza***********************",
    refreshToken: "1//04d***********************",
    lastSync: new Date(Date.now() - 86400000),
    syncFrequency: "daily",
    status: "connected",
  },
  {
    id: "i2",
    name: "Microsoft Teams",
    description: "Intégration avec Microsoft Teams",
    enabled: false,
    status: "disconnected",
  },
  {
    id: "i3",
    name: "Slack",
    description: "Notifications via Slack",
    enabled: true,
    apiKey: "xoxb-***********************",
    lastSync: new Date(Date.now() - 3600000),
    syncFrequency: "hourly",
    status: "connected",
  },
  {
    id: "i4",
    name: "Zoom",
    description: "Intégration des réunions Zoom",
    enabled: true,
    apiKey: "eyjh***********************",
    refreshToken: "eyJh***********************",
    lastSync: new Date(Date.now() - 43200000),
    syncFrequency: "daily",
    status: "error",
  },
]

const mockAuditLogs: AuditLogEntry[] = Array.from({ length: 50 }, (_, i) => {
  const actions = [
    "Connexion",
    "Déconnexion",
    "Création",
    "Modification",
    "Suppression",
    "Téléchargement",
    "Partage",
    "Changement de mot de passe",
    "Changement de rôle",
  ]

  const resources = [
    "Utilisateur",
    "Classe",
    "Enregistrement",
    "Paramètre",
    "Rôle",
    "Permission",
    "Notification",
    "Intégration",
  ]

  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]

  return {
    id: `a${i + 1}`,
    userId: randomUser.id,
    userName: randomUser.name,
    action: actions[Math.floor(Math.random() * actions.length)],
    resource: resources[Math.floor(Math.random() * resources.length)],
    timestamp: new Date(Date.now() - Math.random() * 10000000000),
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    details: Math.random() > 0.7 ? `Détails supplémentaires pour l'action ${i + 1}` : undefined,
  }
})

// ============= State Management =============
type State = {
  roles: RoleDefinition[]
  permissions: Permission[]
  users: User[]
  securitySettings: SecuritySetting[]
  notificationSettings: NotificationSetting[]
  integrationSettings: IntegrationSetting[]
  auditLogs: AuditLogEntry[]
}

type Action =
  | { type: "UPDATE_ROLE"; payload: RoleDefinition }
  | { type: "ADD_ROLE"; payload: RoleDefinition }
  | { type: "DELETE_ROLE"; payload: string }
  | { type: "UPDATE_SECURITY_SETTING"; payload: SecuritySetting }
  | { type: "UPDATE_NOTIFICATION_SETTING"; payload: NotificationSetting }
  | { type: "UPDATE_INTEGRATION_SETTING"; payload: IntegrationSetting }
  | { type: "UPDATE_USER_ROLE"; payload: { userId: string; roleId: string } }
  | { type: "UPDATE_USER_STATUS"; payload: { userId: string; status: User["status"] } }

const initialState: State = {
  roles: mockRoles,
  permissions: mockPermissions,
  users: mockUsers,
  securitySettings: mockSecuritySettings,
  notificationSettings: mockNotificationSettings,
  integrationSettings: mockIntegrationSettings,
  auditLogs: mockAuditLogs,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "UPDATE_ROLE":
      return {
        ...state,
        roles: state.roles.map((role) => (role.id === action.payload.id ? action.payload : role)),
      }
    case "ADD_ROLE":
      return {
        ...state,
        roles: [...state.roles, action.payload],
      }
    case "DELETE_ROLE":
      return {
        ...state,
        roles: state.roles.filter((role) => role.id !== action.payload),
      }
    case "UPDATE_SECURITY_SETTING":
      return {
        ...state,
        securitySettings: state.securitySettings.map((setting) =>
          setting.id === action.payload.id ? action.payload : setting,
        ),
      }
    case "UPDATE_NOTIFICATION_SETTING":
      return {
        ...state,
        notificationSettings: state.notificationSettings.map((setting) =>
          setting.id === action.payload.id ? action.payload : setting,
        ),
      }
    case "UPDATE_INTEGRATION_SETTING":
      return {
        ...state,
        integrationSettings: state.integrationSettings.map((setting) =>
          setting.id === action.payload.id ? action.payload : setting,
        ),
      }
    case "UPDATE_USER_ROLE":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.userId ? { ...user, role: action.payload.roleId } : user,
        ),
      }
    case "UPDATE_USER_STATUS":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.userId ? { ...user, status: action.payload.status } : user,
        ),
      }
    default:
      return state
  }
}

// Context
type SettingsContextType = {
  state: State
  dispatch: React.Dispatch<Action>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

// ============= Utility Functions =============
function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getRoleName(roleId: string, roles: RoleDefinition[]): string {
  const role = roles.find((r) => r.id === roleId)
  return role ? role.name : "Inconnu"
}

function getRoleColor(roleId: string, roles: RoleDefinition[]): string {
  const role = roles.find((r) => r.id === roleId)
  return role ? role.color : "bg-gray-100 text-gray-800"
}

// ============= Components =============

// Toast Component
type ToastProps = {
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <Check className="h-5 w-5" />,
    error: <X className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  }

  const colors = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-cyan-100 text-cyan-800",
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${colors[type]} transition-all duration-300 ease-in-out transform translate-y-0`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">{icons[type]}</div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-200"
        onClick={onClose}
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}

// Tabs Component
type Tab = {
  id: string
  label: string
  icon: React.ReactNode
}

type TabsProps = {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <li key={tab.id} className="mr-2">
            <button
              className={`inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 rounded-t-lg ${
                activeTab === tab.id
                  ? "text-cyan-600 border-cyan-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => onChange(tab.id)}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Card Component
type CardProps = {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ title, children, actions, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// Badge Component
type BadgeProps = {
  text: string
  color?: string
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ text, color = "bg-cyan-100 text-cyan-800", className = "" }) => {
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color} ${className}`}>{text}</span>
}

// Toggle Component
type ToggleProps = {
  checked: boolean
  onChange: () => void
  label?: string
  disabled?: boolean
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} disabled={disabled} />
        <div
          className={`block w-10 h-6 rounded-full ${
            checked ? "bg-cyan-600" : "bg-gray-300"
          } ${disabled ? "opacity-50" : ""}`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
            checked ? "transform translate-x-4" : ""
          }`}
        ></div>
      </div>
      {label && <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>}
    </label>
  )
}

// Search Input Component
type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Rechercher...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      <input
        type="text"
        className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:ring-cyan-500 focus:border-cyan-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// ============= Feature Components =============

// Role Management Component
const RoleManagement: React.FC = () => {
  const { state, dispatch } = useSettings()
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null)
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)

  const filteredRoles = state.roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveRole = (role: RoleDefinition) => {
    if (role.id) {
      dispatch({ type: "UPDATE_ROLE", payload: role })
      setToast({ message: "Rôle mis à jour avec succès", type: "success" })
    } else {
      const newRole = {
        ...role,
        id: `r${state.roles.length + 1}`,
        userCount: 0,
      }
      dispatch({ type: "ADD_ROLE", payload: newRole })
      setToast({ message: "Rôle créé avec succès", type: "success" })
    }
    setEditingRole(null)
    setIsAddingRole(false)
  }

  const handleDeleteRole = (roleId: string) => {
    dispatch({ type: "DELETE_ROLE", payload: roleId })
    setToast({ message: "Rôle supprimé avec succès", type: "success" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Gestion des rôles</h2>
        <button
          onClick={() => setIsAddingRole(true)}
          className="px-3 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un rôle
        </button>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un rôle..."
          className="max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <Badge text={`${role.userCount} utilisateurs`} color="bg-gray-100 text-gray-800" />
                  {role.isDefault && <Badge text="Par défaut" color="bg-green-100 text-green-800" />}
                  {role.isSystem && <Badge text="Système" color="bg-purple-100 text-purple-800" />}
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingRole(role)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Modifier"
                >
                  <Edit className="w-5 h-5" />
                </button>
                {!role.isSystem && (
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    aria-label="Supprimer"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions ({role.permissions.length})</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permId) => {
                  const permission = state.permissions.find((p) => p.id === permId)
                  return permission ? (
                    <Badge key={permId} text={permission.name} color="bg-cyan-100 text-cyan-800" />
                  ) : null
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(editingRole || isAddingRole) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-900">
                {isAddingRole ? "Ajouter un rôle" : "Modifier le rôle"}
              </h3>
              <button
                onClick={() => {
                  setEditingRole(null)
                  setIsAddingRole(false)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <RoleForm
              role={
                editingRole || {
                  id: "",
                  name: "",
                  description: "",
                  permissions: [],
                  userCount: 0,
                  color: "bg-gray-100 text-gray-800",
                }
              }
              permissions={state.permissions}
              onSave={handleSaveRole}
              onCancel={() => {
                setEditingRole(null)
                setIsAddingRole(false)
              }}
            />
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// Role Form Component
type RoleFormProps = {
  role: RoleDefinition
  permissions: Permission[]
  onSave: (role: RoleDefinition) => void
  onCancel: () => void
}

const RoleForm: React.FC<RoleFormProps> = ({ role, permissions, onSave, onCancel }) => {
  const [formData, setFormData] = useState<RoleDefinition>(role)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionToggle = (permId: string) => {
    setFormData((prev) => {
      const newPermissions = prev.permissions.includes(permId)
        ? prev.permissions.filter((id) => id !== permId)
        : [...prev.permissions, permId]
      return { ...prev, permissions: newPermissions }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis"
    }
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise"
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = "Au moins une permission est requise"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData)
  }

  // Group permissions by category
  const permissionsByCategory = permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {})

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du rôle
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? "border-red-500" : "border-gray-300"
          } bg-white text-gray-900 focus:ring-cyan-500 focus:border-cyan-500`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.description ? "border-red-500" : "border-gray-300"
          } bg-white text-gray-900 focus:ring-cyan-500 focus:border-cyan-500`}
        ></textarea>
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
          Couleur
        </label>
        <select
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="bg-red-100 text-red-800">Rouge</option>
          <option value="bg-cyan-100 text-cyan-800">Bleu</option>
          <option value="bg-green-100 text-green-800">Vert</option>
          <option value="bg-yellow-100 text-yellow-800">Jaune</option>
          <option value="bg-purple-100 text-purple-800">Violet</option>
          <option value="bg-gray-100 text-gray-800">Gris</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Permissions</label>
          {errors.permissions && <p className="text-sm text-red-600">{errors.permissions}</p>}
        </div>

        <div className="space-y-4 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
          {Object.entries(permissionsByCategory).map(([category, perms]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 capitalize">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {perms.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`perm-${permission.id}`}
                      checked={formData.permissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <label htmlFor={`perm-${permission.id}`} className="text-sm text-gray-700 cursor-pointer">
                      {permission.name}
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          Enregistrer
        </button>
      </div>
    </form>
  )
}

// User Management Component
const UserManagement: React.FC = () => {
  const { state, dispatch } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)

  const filteredUsers = state.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRoleChange = (userId: string, roleId: string) => {
    dispatch({ type: "UPDATE_USER_ROLE", payload: { userId, roleId } })
    setToast({ message: "Rôle de l'utilisateur mis à jour", type: "success" })
  }

  const handleStatusChange = (userId: string, status: User["status"]) => {
    dispatch({ type: "UPDATE_USER_STATUS", payload: { userId, status } })
    setToast({ message: "Statut de l'utilisateur mis à jour", type: "success" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Gestion des utilisateurs</h2>
        <button className="px-3 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher un utilisateur..."
          className="max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Utilisateur
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rôle
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Dernière connexion
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm rounded-md border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    {state.roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as User["status"])}
                    className={`text-sm rounded-md border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 ${
                      user.status === "active"
                        ? "text-green-800"
                        : user.status === "blocked"
                          ? "text-red-800"
                          : "text-gray-800"
                    }`}
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="pending">En attente</option>
                    <option value="blocked">Bloqué</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? formatDate(user.lastLogin) : "Jamais connecté"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-cyan-600 hover:text-cyan-900">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// Security Settings Component
const SecuritySettings: React.FC = () => {
  const { state, dispatch } = useSettings()
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>("authentication")

  const securitySettingsByCategory = state.securitySettings.reduce<Record<string, SecuritySetting[]>>(
    (acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    },
    {},
  )

  const handleSettingChange = (setting: SecuritySetting, value: string | number | boolean) => {
    const updatedSetting = { ...setting, value }
    dispatch({ type: "UPDATE_SECURITY_SETTING", payload: updatedSetting })
    setToast({ message: "Paramètre de sécurité mis à jour", type: "success" })
  }

  const categoryTitles: Record<string, string> = {
    authentication: "Authentification",
    session: "Session",
    password: "Mot de passe",
    access: "Contrôle d'accès",
    audit: "Audit et journalisation",
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    authentication: <Shield className="w-5 h-5" />,
    session: <Clock className="w-5 h-5" />,
    password: <Lock className="w-5 h-5" />,
    access: <Users className="w-5 h-5" />,
    audit: <Eye className="w-5 h-5" />,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Paramètres de sécurité</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(securitySettingsByCategory).map(([category, settings]) => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <button
              className="w-full px-4 py-3 flex justify-between items-center text-left border-b border-gray-200"
              onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
            >
              <div className="flex items-center space-x-2">
                {categoryIcons[category]}
                <h3 className="text-lg font-medium text-gray-900">{categoryTitles[category] || category}</h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  expandedCategory === category ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {expandedCategory === category && (
              <div className="p-4 space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <label htmlFor={setting.id} className="block text-sm font-medium text-gray-700">
                          {setting.name}
                        </label>
                        <p className="text-xs text-gray-500">{setting.description}</p>
                      </div>
                      {setting.type === "boolean" ? (
                        <Toggle
                          checked={setting.value as boolean}
                          onChange={() => handleSettingChange(setting, !setting.value)}
                        />
                      ) : null}
                    </div>

                    {setting.type === "text" && (
                      <input
                        type="text"
                        id={setting.id}
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      />
                    )}

                    {setting.type === "number" && (
                      <input
                        type="number"
                        id={setting.id}
                        value={setting.value as number}
                        onChange={(e) => handleSettingChange(setting, Number.parseInt(e.target.value, 10))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      />
                    )}

                    {setting.type === "select" && setting.options && (
                      <select
                        id={setting.id}
                        value={setting.value as string}
                        onChange={(e) => handleSettingChange(setting, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                      >
                        {setting.options.map((option) => (
                          <option key={option} value={option}>
                            {option === "low"
                              ? "Faible"
                              : option === "medium"
                                ? "Moyen"
                                : option === "high"
                                  ? "Élevé"
                                  : option === "very-high"
                                    ? "Très élevé"
                                    : option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// Notification Settings Component
const NotificationSettings: React.FC = () => {
  const { state, dispatch } = useSettings()
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)

  const handleToggleNotification = (setting: NotificationSetting) => {
    const updatedSetting = { ...setting, enabled: !setting.enabled }
    dispatch({ type: "UPDATE_NOTIFICATION_SETTING", payload: updatedSetting })
    setToast({
      message: `Notification ${updatedSetting.enabled ? "activée" : "désactivée"}`,
      type: "success",
    })
  }

  const handleToggleChannel = (setting: NotificationSetting, channel: NotificationChannel) => {
    const updatedChannels = setting.channels.includes(channel)
      ? setting.channels.filter((c) => c !== channel)
      : [...setting.channels, channel]

    const updatedSetting = { ...setting, channels: updatedChannels }
    dispatch({ type: "UPDATE_NOTIFICATION_SETTING", payload: updatedSetting })
    setToast({ message: "Canaux de notification mis à jour", type: "success" })
  }

  const handleToggleRole = (setting: NotificationSetting, roleId: string) => {
    const updatedRoles = setting.userRoles.includes(roleId)
      ? setting.userRoles.filter((r) => r !== roleId)
      : [...setting.userRoles, roleId]

    const updatedSetting = { ...setting, userRoles: updatedRoles }
    dispatch({ type: "UPDATE_NOTIFICATION_SETTING", payload: updatedSetting })
    setToast({ message: "Rôles de notification mis à jour", type: "success" })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Paramètres de notification</h2>
      </div>

      <div className="space-y-4">
        {state.notificationSettings.map((setting) => (
          <div key={setting.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{setting.name}</h3>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <Toggle checked={setting.enabled} onChange={() => handleToggleNotification(setting)} />
            </div>

            {setting.enabled && (
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Canaux de notification</h4>
                  <div className="flex flex-wrap gap-3">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        checked={setting.channels.includes("email")}
                        onChange={() => handleToggleChannel(setting, "email")}
                      />
                      <span className="ml-2 text-sm text-gray-700">Email</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        checked={setting.channels.includes("sms")}
                        onChange={() => handleToggleChannel(setting, "sms")}
                      />
                      <span className="ml-2 text-sm text-gray-700">SMS</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        checked={setting.channels.includes("push")}
                        onChange={() => handleToggleChannel(setting, "push")}
                      />
                      <span className="ml-2 text-sm text-gray-700">Notification push</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                        checked={setting.channels.includes("in-app")}
                        onChange={() => handleToggleChannel(setting, "in-app")}
                      />
                      <span className="ml-2 text-sm text-gray-700">Dans l'application</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Rôles d'utilisateurs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {state.roles.map((role) => (
                      <label key={role.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-cyan-600 shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
                          checked={setting.userRoles.includes(role.id)}
                          onChange={() => handleToggleRole(setting, role.id)}
                        />
                        <span className="ml-2 text-sm text-gray-700">{role.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// Integration Settings Component
const IntegrationSettings: React.FC = () => {
  const { state, dispatch } = useSettings()
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" | "info" } | null>(null)
  const [editingIntegration, setEditingIntegration] = useState<IntegrationSetting | null>(null)

  const handleToggleIntegration = (setting: IntegrationSetting) => {
    const updatedSetting = {
      ...setting,
      enabled: !setting.enabled,
      status: !setting.enabled ? "pending" : "disconnected",
    }
    dispatch({ type: "UPDATE_INTEGRATION_SETTING", payload: updatedSetting })
    setToast({
      message: `Intégration ${updatedSetting.enabled ? "activée" : "désactivée"}`,
      type: "success",
    })
  }

  const handleSyncNow = (setting: IntegrationSetting) => {
    // In a real app, this would trigger an API call to sync
    const updatedSetting = {
      ...setting,
      lastSync: new Date(),
      status: "connected",
    }
    dispatch({
      type: "UPDATE_INTEGRATION_SETTING",
      payload: updatedSetting,
    })
    setToast({ message: "Synchronisation démarrée", type: "success" })
  }

  const handleSaveIntegration = (setting: IntegrationSetting) => {
    dispatch({ type: "UPDATE_INTEGRATION_SETTING", payload: setting })
    setEditingIntegration(null)
    setToast({ message: "Paramètres d'intégration mis à jour", type: "success" })
  }

  const getStatusBadge = (status: IntegrationSetting["status"]) => {
    switch (status) {
      case "connected":
        return <Badge text="Connecté" color="bg-green-100 text-green-800" />
      case "disconnected":
        return <Badge text="Déconnecté" color="bg-gray-100 text-gray-800" />
      case "error":
        return <Badge text="Erreur" color="bg-red-100 text-red-800" />
      case "pending":
        return <Badge text="En attente" color="bg-yellow-100 text-yellow-800" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Intégrations</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {state.integrationSettings.map((setting) => (
          <div key={setting.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">{setting.name}</h3>
                  {getStatusBadge(setting.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
              </div>
              <Toggle checked={setting.enabled} onChange={() => handleToggleIntegration(setting)} />
            </div>

            {setting.enabled && (
              <div className="mt-4 space-y-3">
                {setting.apiKey && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Clé API</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        value={setting.apiKey}
                        readOnly
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-50"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                        onClick={() => setEditingIntegration(setting)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {setting.lastSync && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dernière synchronisation</label>
                    <div className="mt-1 text-sm text-gray-500">{formatDate(setting.lastSync)}</div>
                  </div>
                )}

                {setting.syncFrequency && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fréquence de synchronisation</label>
                    <select
                      value={setting.syncFrequency}
                      onChange={(e) => {
                        const updatedSetting = {
                          ...setting,
                          syncFrequency: e.target.value as IntegrationSetting["syncFrequency"],
                        }
                        dispatch({
                          type: "UPDATE_INTEGRATION_SETTING",
                          payload: updatedSetting,
                        })
                      }}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                    >
                      <option value="manual">Manuelle</option>
                      <option value="hourly">Toutes les heures</option>
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                    </select>
                  </div>
                )}

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSyncNow(setting)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    disabled={!setting.enabled}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Synchroniser maintenant
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Modifier l'intégration {editingIntegration.name}</h3>
              <button onClick={() => setEditingIntegration(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Clé API</label>
                <input
                  type="text"
                  value={editingIntegration.apiKey || ""}
                  onChange={(e) =>
                    setEditingIntegration({
                      ...editingIntegration,
                      apiKey: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                />
              </div>

              {editingIntegration.refreshToken && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Token de rafraîchissement</label>
                  <input
                    type="text"
                    value={editingIntegration.refreshToken}
                    onChange={(e) =>
                      setEditingIntegration({
                        ...editingIntegration,
                        refreshToken: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Fréquence de synchronisation</label>
                <select
                  value={editingIntegration.syncFrequency || "manual"}
                  onChange={(e) =>
                    setEditingIntegration({
                      ...editingIntegration,
                      syncFrequency: e.target.value as IntegrationSetting["syncFrequency"],
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
                >
                  <option value="manual">Manuelle</option>
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingIntegration(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveIntegration(editingIntegration)}
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// Audit Logs Component
const AuditLogs: React.FC = () => {
  const { state } = useSettings()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState<string>("")
  const [filterResource, setFilterResource] = useState<string>("")

  // Get unique actions and resources for filters
  const uniqueActions = Array.from(new Set(state.auditLogs.map((log) => log.action))).sort()

  const uniqueResources = Array.from(new Set(state.auditLogs.map((log) => log.resource))).sort()

  // Filter logs
  const filteredLogs = state.auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesAction = filterAction === "" || log.action === filterAction
    const matchesResource = filterResource === "" || log.resource === filterResource

    return matchesSearch && matchesAction && matchesResource
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Journaux d'audit</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Rechercher dans les journaux..."
          className="md:w-1/3"
        />

        <div className="flex gap-2 flex-1">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
          >
            <option value="">Toutes les actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>

          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
          >
            <option value="">Toutes les ressources</option>
            {uniqueResources.map((resource) => (
              <option key={resource} value={resource}>
                {resource}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date et heure
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Utilisateur
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ressource
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Adresse IP
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Détails
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Aucun journal d'audit ne correspond à vos critères de recherche.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(log.timestamp)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      text={log.action}
                      color={
                        log.action.includes("Connexion") || log.action.includes("Création")
                          ? "bg-green-100 text-green-800"
                          : log.action.includes("Suppression")
                            ? "bg-red-100 text-red-800"
                            : log.action.includes("Modification")
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-cyan-100 text-cyan-800"
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.resource}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{log.details || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Main Settings Component
const Parametre: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [activeTab, setActiveTab] = useState("security")

  const tabs: Tab[] = [
    {
      id: "security",
      label: "Sécurité et rôles",
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "roles",
      label: "Gestion des rôles",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "users",
      label: "Utilisateurs",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "integrations",
      label: "Intégrations",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "audit",
      label: "Journaux d'audit",
      icon: <Eye className="w-4 h-4" />,
    },
  ]

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-gray-100">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-cyan-600 mr-3" />
                  <h1 className="text-2xl font-bold text-gray-900">Paramètres et Configuration</h1>
                </div>
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-white">
                      A
                    </div>
                    <span className="hidden md:inline-block font-medium">Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <div className="mt-6">
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "roles" && <RoleManagement />}
              {activeTab === "users" && <UserManagement />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "integrations" && <IntegrationSettings />}
              {activeTab === "audit" && <AuditLogs />}
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">© 2025 Classe Virtuelle. Tous droits réservés.</div>
                <div className="flex space-x-4">
                  <button className="text-sm text-gray-500 hover:text-gray-700">Aide</button>
                  <button className="text-sm text-gray-500 hover:text-gray-700">Confidentialité</button>
                  <button className="text-sm text-gray-500 hover:text-gray-700">Conditions</button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SettingsContext.Provider>
  )
}

export default Parametre

