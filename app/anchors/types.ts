export interface SuggestionItem {
  title: string
  description: string
}

export interface CategorySuggestion {
  category: string
  items: SuggestionItem[]
}

export interface Anchor {
  id: string
  category: string
  text: string
  notes?: string
} 