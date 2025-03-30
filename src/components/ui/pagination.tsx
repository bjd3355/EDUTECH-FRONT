"use client" // Directive "use client" pour indiquer un composant client dans Next.js

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

// Composant racine de la pagination, une balise <nav> avec rôle d'accessibilité
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

// Conteneur des éléments de pagination, une liste <ul>
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

// Élément individuel de la pagination, une balise <li>
const PaginationItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  ),
)
PaginationItem.displayName = "PaginationItem"

// Type pour les props du composant PaginationLink, aligné avec ButtonProps
type PaginationLinkProps = {
  isActive?: boolean
  className?: string // Ajout explicite de className pour compatibilité
} & React.ComponentProps<typeof Button> // Hérite des props de Button

// Lien de pagination, utilisant le composant Button avec variantes
const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <Button
    variant={isActive ? "default" : "outline"} // Variant dynamique basé sur isActive
    size="sm" // Taille fixe à "sm"
    className={cn("h-9 w-9 p-0", className)} // Classes Tailwind combinées
    {...props} // Propagation des autres props
  />
)
PaginationLink.displayName = "PaginationLink"

// Bouton "Précédent" de la pagination
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

// Bouton "Suivant" de la pagination
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

// Ellipsis de la pagination pour indiquer des pages supplémentaires
const PaginationEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// Exportation de tous les composants
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}