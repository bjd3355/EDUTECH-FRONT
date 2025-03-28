export interface Patient {
  nom: string
  id?: string
  maladie?: string
  dernierVisite?: string
  genre?: string
}

export interface RendezVous {
  id: string
  patient: Patient
  date: string
  heure: string
  statut: string
  symptomes: string
}

export interface Medecin {
  id: string
  nom: string
  specialite: string
  statut: string
}

export interface GroupePatient {
  id: string
  nom: string
  nombrePatients: number
  couleur: string
}

export interface Tache {
  id: string
  description: string
  priorite: "High" | "Normal" | "Low"
}

