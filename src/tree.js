// Opening tree — stored in localStorage
// Structure: { [fen]: { moves: { [san]: nextFen } } }

const STORAGE_KEY = 'chess-openings-tree'

export function loadTree() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveTree(tree) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tree))
}

export function addMoveToTree(tree, fromFen, san, toFen) {
  const node = tree[fromFen] ?? { moves: {} }
  return {
    ...tree,
    [fromFen]: {
      ...node,
      moves: { ...node.moves, [san]: toFen },
    },
  }
}

export function getMovesAtPosition(tree, fen) {
  return Object.keys(tree[fen]?.moves ?? {})
}
